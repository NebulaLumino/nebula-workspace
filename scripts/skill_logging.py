#!/usr/bin/env python3
"""
Skill Logging Utility
Provides standardized logging for OpenClaw skills
"""

import os
import sys
import logging
import json
from datetime import datetime
from pathlib import Path

# Log directory
LOG_DIR = Path.home() / ".openclaw" / "workspace" / "logs"

def setup_logger(name: str, log_file: str = None, level: int = logging.INFO) -> logging.Logger:
    """
    Set up a logger with console and optional file output.
    
    Args:
        name: Logger name (typically skill name)
        log_file: Optional log file name (defaults to {name}.log)
        level: Logging level
    
    Returns:
        Configured logger instance
    """
    # Ensure log directory exists
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    
    if log_file is None:
        log_file = f"{name}.log"
    
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_format = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(console_format)
    logger.addHandler(console_handler)
    
    # File handler
    file_path = LOG_DIR / log_file
    file_handler = logging.FileHandler(file_path)
    file_handler.setLevel(level)
    file_format = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(file_format)
    logger.addHandler(file_handler)
    
    return logger


def log_execution(skill_name: str, action: str, details: dict = None):
    """
    Log skill execution to a structured format.
    
    Args:
        skill_name: Name of the skill
        action: Action being performed
        details: Optional details dictionary
    """
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "skill": skill_name,
        "action": action,
        "details": details or {}
    }
    
    execution_log = LOG_DIR / "execution.jsonl"
    with open(execution_log, "a") as f:
        f.write(json.dumps(entry) + "\n")


def get_recent_logs(skill_name: str = None, lines: int = 50) -> list:
    """
    Get recent log entries.
    
    Args:
        skill_name: Optional filter by skill name
        lines: Number of lines to return
    
    Returns:
        List of log lines
    """
    log_file = LOG_DIR / "execution.jsonl"
    if not log_file.exists():
        return []
    
    entries = []
    with open(log_file, "r") as f:
        for line in f:
            try:
                entry = json.loads(line.strip())
                if skill_name is None or entry.get("skill") == skill_name:
                    entries.append(entry)
            except json.JSONDecodeError:
                continue
    
    return entries[-lines:]


# Convenience function for quick setup
def get_logger(name: str) -> logging.Logger:
    """Quick logger setup - alias for setup_logger."""
    return setup_logger(name)


if __name__ == "__main__":
    # Demo/test
    logger = setup_logger("test-skill")
    logger.info("Logger initialized successfully")
    log_execution("test-skill", "startup", {"version": "1.0"})
    logger.info("Check logs/ directory for output")
