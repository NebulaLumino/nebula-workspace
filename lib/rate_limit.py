"""
Rate Limiting and Retry Utilities

Provides decorators and classes for handling rate limits and retries.
"""

import time
import logging
from functools import wraps
from typing import Callable, Optional, Type
import random

logger = logging.getLogger(__name__)


class RateLimiter:
    """Simple rate limiter with token bucket algorithm."""
    
    def __init__(self, requests_per_second: float = 1.0):
        self.rate = requests_per_second
        self.allowance = requests_per_second
        self.last_check = time.time()
    
    def acquire(self) -> None:
        """Wait if necessary to respect rate limit."""
        current = time.time()
        elapsed = current - self.last_check
        self.last_check = current
        
        self.allowance += elapsed * self.rate
        if self.allowance > self.rate:
            self.allowance = self.rate
        
        if self.allowance < 1.0:
            wait_time = (1.0 - self.allowance) / self.rate
            time.sleep(wait_time)
            self.allowance = 0.0
        else:
            self.allowance -= 1.0


def retry_with_backoff(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    jitter: bool = True,
    retry_on: Optional[Type[Exception]] = None
):
    """
    Decorator that retries a function with exponential backoff.
    
    Args:
        max_retries: Maximum number of retry attempts
        base_delay: Initial delay between retries (seconds)
        max_delay: Maximum delay between retries (seconds)
        exponential_base: Base for exponential backoff
        jitter: Add random jitter to prevent thundering herd
        retry_on: Specific exception type to retry on (default: all)
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    
                    if retry_on and not isinstance(e, retry_on):
                        raise
                    
                    if attempt == max_retries:
                        logger.error(f"{func.__name__} failed after {max_retries} retries: {e}")
                        raise
                    
                    # Calculate delay with exponential backoff
                    delay = min(base_delay * (exponential_base ** attempt), max_delay)
                    
                    # Add jitter (±25%)
                    if jitter:
                        delay = delay * (0.75 + random.random() * 0.5)
                    
                    logger.warning(
                        f"{func.__name__} attempt {attempt + 1}/{max_retries + 1} failed: {e}. "
                        f"Retrying in {delay:.2f}s..."
                    )
                    time.sleep(delay)
            
            raise last_exception
        
        return wrapper
    return decorator


class CircuitBreaker:
    """
    Circuit breaker pattern to prevent cascading failures.
    
    States:
    - CLOSED: Normal operation, requests pass through
    - OPEN: Failure threshold exceeded, requests fail fast
    - HALF_OPEN: Testing if service recovered
    """
    
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"
    
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: float = 60.0,
        expected_exception: Type[Exception] = Exception
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception
        
        self.failure_count = 0
        self.last_failure_time: Optional[float] = None
        self.state = self.CLOSED
    
    def call(self, func: Callable, *args, **kwargs):
        """Execute function with circuit breaker protection."""
        
        if self.state == self.OPEN:
            # Check if recovery timeout has passed
            if time.time() - self.last_failure_time >= self.recovery_timeout:
                self.state = self.HALF_OPEN
                logger.info("Circuit breaker entering HALF_OPEN state")
            else:
                raise Exception("Circuit breaker is OPEN - service unavailable")
        
        try:
            result = func(*args, **kwargs)
            
            # Success - reset failure count
            if self.state == self.HALF_OPEN:
                self.state = self.CLOSED
                self.failure_count = 0
                logger.info("Circuit breaker CLOSED - service recovered")
            
            return result
            
        except self.expected_exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = self.OPEN
                logger.error(
                    f"Circuit breaker OPENED after {self.failure_count} failures"
                )
            
            raise
    
    def reset(self):
        """Manually reset the circuit breaker."""
        self.state = self.CLOSED
        self.failure_count = 0
        self.last_failure_time = None


# Default rate limiter instance for API calls
default_limiter = RateLimiter(requests_per_second=2.0)
