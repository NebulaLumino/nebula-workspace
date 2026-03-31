"""
Unit tests for volcengine-seedance skill.
"""

import pytest
from unittest.mock import patch, Mock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from seedance import parse_prompt, create_video_task, poll_for_result


class TestParsePrompt:
    """Tests for prompt parsing."""
    
    def test_basic_prompt(self):
        """Test basic prompt parsing."""
        prompt, model, duration, resolution, reference = parse_prompt("一只猫在奔跑")
        assert prompt == "一只猫在奔跑"
        assert model == "doubao-seedance-1-5-pro-251215"
        assert duration == 5
        assert resolution == "720p"
        assert reference is None
    
    def test_prompt_with_duration(self):
        """Test prompt with duration."""
        prompt, model, duration, resolution, ref = parse_prompt("一只猫 时长：10秒")
        assert prompt == "一只猫"
        assert duration == 10
    
    def test_prompt_with_resolution(self):
        """Test prompt with resolution."""
        prompt, model, duration, resolution, ref = parse_prompt("一只猫 分辨率：480p")
        assert prompt == "一只猫"
        assert resolution == "480p"
    
    def test_prompt_with_reference(self):
        """Test prompt with reference image."""
        prompt, model, duration, resolution, reference = parse_prompt(
            "waves Reference: https://example.com/image.jpg"
        )
        assert "waves" in prompt
        assert reference == "https://example.com/image.jpg"
    
    def test_duration_clamping(self):
        """Test duration is clamped to 5-12."""
        prompt, _, duration, _, _ = parse_prompt("test 时长：100")
        assert duration == 12  # clamped to max
    
    def test_chinese_prefix_removal(self):
        """Test Chinese prefix removal."""
        prompt, _, _, _, _ = parse_prompt("生成视频：一只猫")
        assert prompt == "一只猫"


class TestCreateVideoTask:
    """Tests for video task creation."""
    
    @patch('seedance.requests.post')
    def test_create_task_success(self, mock_post):
        """Test successful task creation."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "task-123",
            "task_id": "task-123"
        }
        mock_post.return_value = mock_response
        
        # Call function
        result = create_video_task("test prompt")
        
        # Verify
        assert result == "task-123"
        mock_post.assert_called_once()
    
    @patch('seedance.requests.post')
    def test_create_task_with_reference(self, mock_post):
        """Test task creation with reference image."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "id": "task-123"
        }
        mock_post.return_value = mock_response
        
        # Call function with reference
        result = create_video_task(
            "animate this",
            reference="https://example.com/img.jpg"
        )
        
        # Verify reference was in payload
        call_args = mock_post.call_args
        payload = call_args.kwargs['json']
        assert payload['image_url'] == "https://example.com/img.jpg"


class TestPollForResult:
    """Tests for result polling."""
    
    @patch('seedance.requests.get')
    def test_poll_success(self, mock_get):
        """Test successful polling."""
        # Mock response - video ready
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "status": "SUCCESS",
                "data": {
                    "content": {
                        "video_url": "https://example.com/video.mp4"
                    }
                }
            }
        }
        mock_get.return_value = mock_response
        
        # Call function
        result = poll_for_result("task-123", max_wait=1)
        
        # Verify
        assert result == "https://example.com/video.mp4"
    
    @patch('seedance.requests.get')
    def test_poll_failure(self, mock_get):
        """Test polling with failure."""
        # Mock response - failed
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "status": "FAILED",
                "fail_reason": "Invalid prompt"
            }
        }
        mock_get.return_value = mock_response
        
        # Call function and expect exit
        with pytest.raises(SystemExit):
            poll_for_result("task-123", max_wait=1)
    
    @patch('seedance.requests.get')
    def test_poll_in_progress(self, mock_get):
        """Test polling when still in progress."""
        # Mock response - in progress
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "status": "IN_PROGRESS",
                "progress": "50%"
            }
        }
        mock_get.return_value = mock_response
        
        # Call function with very short timeout - should exit on timeout
        # Note: This will timeout since we mock success on first call
        with pytest.raises(SystemExit):
            poll_for_result("task-123", max_wait=0)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
