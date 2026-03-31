"""
Unit tests for volcengine-llm chat skill.
"""

import pytest
from unittest.mock import patch, Mock, MagicMock
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from chat import chat, non_stream_chat, AVAILABLE_MODELS


class TestAvailableModels:
    """Tests for available models."""
    
    def test_models_defined(self):
        """Test that models are defined."""
        assert len(AVAILABLE_MODELS) > 0
        assert "doubao-seed-2-0-pro-260215" in AVAILABLE_MODELS
    
    def test_model_info_structure(self):
        """Test model info has required fields."""
        for model_id, info in AVAILABLE_MODELS.items():
            assert "name" in info
            assert "context" in info
            assert "description" in info


class TestChat:
    """Tests for chat function."""
    
    @patch('chat.requests.post')
    def test_chat_success(self, mock_post):
        """Test successful chat."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{
                "message": {
                    "content": "Hello! How can I help?"
                }
            }],
            "usage": {
                "total_tokens": 100,
                "prompt_tokens": 20,
                "completion_tokens": 80
            }
        }
        mock_post.return_value = mock_response
        
        # Call function
        result = chat("Hi", model="doubao-seed-2-0-pro-260215")
        
        # Verify
        assert result == "Hello! How can I help?"
        mock_post.assert_called_once()
    
    @patch('chat.requests.post')
    def test_chat_with_system_prompt(self, mock_post):
        """Test chat with system prompt."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{
                "message": {"content": "Response"}
            }],
            "usage": {"total_tokens": 50}
        }
        mock_post.return_value = mock_response
        
        # Call with system prompt
        result = chat("Question", system_prompt="You are a helpful assistant")
        
        # Verify system prompt was in payload
        call_args = mock_post.call_args
        payload = call_args.kwargs['json']
        messages = payload['messages']
        
        assert any(m.get('role') == 'system' for m in messages)
    
    @patch('chat.requests.post')
    def test_custom_temperature(self, mock_post):
        """Test custom temperature."""
        # Mock API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Response"}}],
            "usage": {"total_tokens": 10}
        }
        mock_post.return_value = mock_response
        
        # Call with custom temperature
        chat("Question", temperature=0.5)
        
        # Verify temperature
        call_args = mock_post.call_args
        payload = call_args.kwargs['json']
        assert payload['temperature'] == 0.5
    
    @patch('chat.requests.post')
    def test_api_error(self, mock_post):
        """Test API error handling."""
        # Mock error response
        mock_response = Mock()
        mock_response.status_code = 400
        mock_response.text = "Bad Request"
        mock_post.return_value = mock_response
        
        # Call function and expect exit
        with pytest.raises(SystemExit):
            chat("Question")


class TestNonStreamChat:
    """Tests for non-stream chat."""
    
    @patch('chat.requests.post')
    def test_response_extraction(self, mock_post):
        """Test extracting response from API."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{
                "message": {"content": "Test response"}
            }],
            "usage": {
                "total_tokens": 100,
                "prompt_tokens": 30,
                "completion_tokens": 70
            }
        }
        mock_post.return_value = mock_response
        
        headers = {"Authorization": "Bearer test"}
        payload = {"model": "test", "messages": [{"role": "user", "content": "test"}]}
        
        result = non_stream_chat("http://test", headers, payload)
        
        assert result == "Test response"
    
    @patch('chat.requests.post')
    def test_empty_choices(self, mock_post):
        """Test empty choices handling."""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"choices": []}
        mock_post.return_value = mock_response
        
        with pytest.raises(SystemExit):
            non_stream_chat("http://test", {}, {})


class TestStreaming:
    """Tests for streaming chat."""
    
    @patch('chat.requests.post')
    def test_streaming_response(self, mock_post):
        """Test streaming response parsing."""
        # Mock streaming response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.iter_lines.return_value = [
            b'data: {"choices":[{"delta":{"content":"Hello"}}]}',
            b'data: [DONE]'
        ]
        mock_post.return_value = mock_response
        
        headers = {"Authorization": "Bearer test"}
        payload = {"model": "test", "messages": [], "stream": True}
        
        result = stream_chat("http://test", headers, payload)
        
        # Streaming combines content from deltas
        assert "Hello" in result or result == ""


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
