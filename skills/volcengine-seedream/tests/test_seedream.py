"""
Unit tests for volcengine-seedream skill.
"""

import pytest
import json
from unittest.mock import patch, Mock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from seedream import parse_prompt, generate_images, download_image


class TestParsePrompt:
    """Tests for prompt parsing."""
    
    def test_basic_prompt(self):
        """Test basic prompt parsing."""
        prompt, model, size = parse_prompt("一只可爱的小猫")
        assert prompt == "一只可爱的小猫"
        assert model == "doubao-seedream-5-0-260128"
        assert size == "2048x2048"
    
    def test_prompt_with_size(self):
        """Test prompt with size parameter."""
        prompt, model, size = parse_prompt("一只猫 尺寸：1024x1024")
        assert prompt == "一只猫"
        assert size == "1024x1024"
    
    def test_prompt_with_model(self):
        """Test prompt with model parameter."""
        prompt, model, size = parse_prompt("一只猫 模型：doubao-seedream-4-5-251128")
        assert prompt == "一只猫"
        assert model == "doubao-seedream-4-5-251128"
    
    def test_chinese_prefix_removal(self):
        """Test Chinese prefix removal."""
        prompt, _, _ = parse_prompt("生图：一只小猫")
        assert prompt == "一只小猫"
    
    def test_english_prefix_removal(self):
        """Test English prefix removal."""
        prompt, _, _ = parse_prompt("Generate an image: a cute kitten")
        assert prompt == "a cute kitten"


class TestGenerateImages:
    """Tests for image generation."""
    
    @patch('seedream.requests.post')
    def test_generate_single_image_success(self, mock_post):
        """Test successful single image generation."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": [{
                "url": "https://example.com/image.jpg"
            }]
        }
        mock_post.return_value = mock_response
        
        # Call function
        result = generate_images("test prompt", count=1)
        
        # Verify
        assert len(result) == 1
        assert result[0] == "https://example.com/image.jpg"
        mock_post.assert_called_once()
    
    @patch('seedream.requests.post')
    def test_generate_multiple_images(self, mock_post):
        """Test batch image generation."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": [
                {"url": "https://example.com/image1.jpg"},
                {"url": "https://example.com/image2.jpg"},
                {"url": "https://example.com/image3.jpg"}
            ]
        }
        mock_post.return_value = mock_response
        
        # Call function
        result = generate_images("test prompt", count=3)
        
        # Verify
        assert len(result) == 3
        assert result[0] == "https://example.com/image1.jpg"
        assert result[1] == "https://example.com/image2.jpg"
        assert result[2] == "https://example.com/image3.jpg"
    
    @patch('seedream.requests.post')
    def test_api_error_handling(self, mock_post):
        """Test API error handling."""
        # Mock error response
        mock_response = Mock()
        mock_response.status_code = 400
        mock_response.text = "Bad Request"
        mock_post.return_value = mock_response
        
        # Call function and expect exit
        with pytest.raises(SystemExit):
            generate_images("test prompt")


class TestDownloadImage:
    """Tests for image download."""
    
    @patch('seedream.requests.get')
    def test_download_success(self, mock_get):
        """Test successful image download."""
        # Mock response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.content = b"fake image data"
        mock_get.return_value = mock_response
        
        # Call function
        result = download_image("https://example.com/image.jpg", "test.jpg")
        
        # Verify
        assert result == "test.jpg"
        mock_get.assert_called_once()
    
    @patch('seedream.requests.get')
    def test_download_failure(self, mock_get):
        """Test download failure handling."""
        # Mock 404 response
        mock_response = Mock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response
        
        # Call function
        result = download_image("https://example.com/image.jpg")
        
        # Verify
        assert result is None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
