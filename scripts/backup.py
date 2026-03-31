#!/usr/bin/env python3
"""
Workspace Backup Script
Creates backups of the OpenClaw workspace.
"""

import os
import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path

# Configuration
WORKSPACE = Path.home() / ".openclaw" / "workspace"
BACKUP_DIR = Path.home() / "Backups" / "openclaw-workspace"
INCLUDE_DIRS = [
    "skills",
    "tasks", 
    "plans",
    "memory",
]
INCLUDE_FILES = [
    "AGENTS.md",
    "SOUL.md",
    "USER.md",
    "TOOLS.md",
    "IDENTITY.md",
    "HEARTBEAT.md",
]
EXCLUDE_PATTERNS = [
    "__pycache__",
    "*.pyc",
    ".git",
    "node_modules",
    ".next",
    "*.log",
]


def create_backup_dir():
    """Create backup directory if it doesn't exist."""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    return BACKUP_DIR


def get_backup_filename():
    """Generate backup filename with timestamp."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"workspace_backup_{timestamp}"


def create_archive(backup_name):
    """Create tar archive of workspace."""
    # Create temporary list of files to backup
    files_to_backup = []
    
    # Add directories
    for dir_name in INCLUDE_DIRS:
        dir_path = WORKSPACE / dir_name
        if dir_path.exists():
            files_to_backup.append(dir_name)
    
    # Add individual files
    for file_name in INCLUDE_FILES:
        file_path = WORKSPACE / file_name
        if file_path.exists():
            files_to_backup.append(file_name)
    
    # Build tar command - use tar's native exclude
    backup_path = BACKUP_DIR / f"{backup_name}.tar.gz"
    
    cmd = ["tar", "-czf", str(backup_path), "-C", str(WORKSPACE)]
    
    # Add exclusions properly
    for pattern in EXCLUDE_PATTERNS:
        cmd.extend(["--exclude", pattern])
    
    cmd.extend(files_to_backup)
    
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        return backup_path
    except subprocess.CalledProcessError as e:
        print(f"Error creating backup: {e}")
        print(f"stderr: {e.stderr}")
        return None


def save_metadata(backup_name, backup_path):
    """Save backup metadata."""
    metadata = {
        "backup_name": backup_name,
        "backup_path": str(backup_path),
        "created_at": datetime.now().isoformat(),
        "included_dirs": INCLUDE_DIRS,
        "included_files": INCLUDE_FILES,
    }
    
    metadata_path = BACKUP_DIR / f"{backup_name}_metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    
    return metadata_path


def list_backups():
    """List all backups."""
    if not BACKUP_DIR.exists():
        print("No backups found.")
        return
    
    backups = sorted(BACKUP_DIR.glob("workspace_backup_*.tar.gz"), reverse=True)
    
    if not backups:
        print("No backups found.")
        return
    
    print(f"Backups in: {BACKUP_DIR}")
    print("=" * 50)
    for backup in backups:
        size = backup.stat().st_size / (1024 * 1024)  # MB
        mtime = datetime.fromtimestamp(backup.stat().st_mtime)
        print(f"{backup.name} - {size:.2f} MB - {mtime.strftime('%Y-%m-%d %H:%M')}")


def restore_backup(backup_name):
    """Restore from a backup."""
    backup_path = BACKUP_DIR / f"{backup_name}.tar.gz"
    
    if not backup_path.exists():
        print(f"Backup not found: {backup_name}")
        return False
    
    print(f"Restoring from: {backup_name}")
    print(f"Target: {WORKSPACE}")
    
    # Create backup of current state first
    current_backup = get_backup_filename()
    print(f"Creating backup of current state: {current_backup}.tar.gz")
    create_archive(current_backup)
    
    # Extract backup
    cmd = ["tar", "-xzf", str(backup_path), "-C", str(WORKSPACE)]
    
    try:
        subprocess.run(cmd, check=True)
        print("Restore complete!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error restoring: {e}")
        return False


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Workspace Backup Tool")
    parser.add_argument("--create", action="store_true", help="Create a new backup")
    parser.add_argument("--list", action="store_true", help="List all backups")
    parser.add_argument("--restore", metavar="BACKUP", help="Restore from backup")
    
    args = parser.parse_args()
    
    if args.list:
        list_backups()
    elif args.restore:
        restore_backup(args.restore)
    elif args.create:
        create_backup_dir()
        backup_name = get_backup_filename()
        print(f"Creating backup: {backup_name}")
        
        backup_path = create_archive(backup_name)
        if backup_path:
            save_metadata(backup_name, backup_path)
            print(f"Backup created: {backup_path}")
            print(f"Size: {backup_path.stat().st_size / (1024*1024):.2f} MB")
        else:
            print("Backup failed.")
            sys.exit(1)
    else:
        # Default: show help
        parser.print_help()
        print()
        print("Examples:")
        print("  python backup.py --create    # Create backup")
        print("  python backup.py --list       # List backups")
        print("  python backup.py --restore workspace_backup_20260315_120000.tar.gz")


if __name__ == "__main__":
    main()
