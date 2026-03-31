#!/usr/bin/env python3
"""
Daily Status Checker
Provides a quick overview of all configured services and integrations
Run via cron for automated health monitoring
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Configuration
WORKSPACE = Path.home() / ".openclaw" / "workspace"
LOG_DIR = WORKSPACE / "logs"

def check_file_exists(path: Path, description: str) -> dict:
    """Check if a file or directory exists."""
    exists = path.exists()
    return {
        "name": description,
        "status": "✓" if exists else "✗",
        "exists": exists,
        "path": str(path)
    }

def check_script(script_name: str) -> dict:
    """Check if a script exists and is executable."""
    script_path = WORKSPACE / "scripts" / script_name
    exists = script_path.exists()
    executable = os.access(script_path, os.X_OK) if exists else False
    return {
        "name": script_name,
        "status": "✓" if (exists and executable) else "⚠",
        "exists": exists,
        "executable": executable,
        "path": str(script_path)
    }

def check_1password() -> dict:
    """Check if 1Password is authenticated."""
    try:
        result = subprocess.run(
            ["op", "list", "vaults"],
            capture_output=True,
            text=True,
            timeout=10
        )
        authenticated = result.returncode == 0
        return {
            "name": "1Password",
            "status": "✓" if authenticated else "✗",
            "authenticated": authenticated
        }
    except FileNotFoundError:
        return {
            "name": "1Password",
            "status": "✗",
            "error": "CLI not found"
        }
    except subprocess.TimeoutExpired:
        return {
            "name": "1Password",
            "status": "⚠",
            "error": "Timeout"
        }

def check_vercel_deployed() -> dict:
    """Check if Vercel deployment exists."""
    # Check if deployment URL is documented
    deployment_file = WORKSPACE / "docs" / "deployments.md"
    if deployment_file.exists():
        content = deployment_file.read_text()
        if "weather-ai-one.vercel.app" in content:
            return {
                "name": "Vercel Deployment",
                "status": "✓",
                "url": "https://weather-ai-one.vercel.app"
            }
    return {
        "name": "Vercel Deployment",
        "status": "?"
    }

def check_skills() -> dict:
    """Check installed skills."""
    skills_dir = WORKSPACE / "skills"
    custom_skills_dir = Path.home() / ".nvm" / "versions" / "node" / "v24.14.0" / "lib" / "node_modules" / "openclaw" / "skills"
    
    workspace_skills = []
    if skills_dir.exists():
        workspace_skills = [s.name for s in skills_dir.iterdir() if s.is_dir()]
    
    npm_skills = []
    if custom_skills_dir.exists():
        npm_skills = [s.name for s in custom_skills_dir.iterdir() if s.is_dir()]
    
    return {
        "name": "Skills",
        "status": "✓" if (workspace_skills or npm_skills) else "✗",
        "workspace_skills": workspace_skills,
        "npm_skills": npm_skills,
        "total": len(workspace_skills) + len(npm_skills)
    }

def check_logs() -> dict:
    """Check recent log activity."""
    execution_log = LOG_DIR / "execution.jsonl"
    if not execution_log.exists():
        return {
            "name": "Execution Logs",
            "status": "○",
            "entries": 0
        }
    
    # Count entries from today
    today = datetime.now().strftime("%Y-%m-%d")
    count = 0
    try:
        with open(execution_log, "r") as f:
            for line in f:
                if today in line:
                    count += 1
    except:
        pass
    
    return {
        "name": "Execution Logs",
        "status": "✓" if count > 0 else "○",
        "entries_today": count
    }

def check_git_repos() -> dict:
    """Check GitHub repos."""
    gh_file = WORKSPACE / "docs" / "github-repos.md"
    if gh_file.exists():
        content = gh_file.read_text()
        # Count repo URLs
        count = content.count("github.com")
        return {
            "name": "GitHub Repos",
            "status": "✓",
            "count": count
        }
    return {
        "name": "GitHub Repos",
        "status": "?"
    }

def run_all_checks():
    """Run all status checks and return summary."""
    print("🔍 Daily Status Check")
    print(f"   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    checks = [
        ("1Password", check_1password),
        ("Vercel", check_vercel_deployed),
        ("Skills", check_skills),
        ("GitHub", check_git_repos),
        ("Logs", check_logs),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append(result)
            status = result.get("status", "?")
            print(f"  {status} {name}")
        except Exception as e:
            results.append({"name": name, "status": "✗", "error": str(e)})
            print(f"  ✗ {name}: {e}")
    
    # Check scripts
    print("\n📜 Scripts:")
    scripts_to_check = [
        "mixedcloud-healthcheck.py",
        "skill_logging.py",
        "backup.py",
        "reporting.py"
    ]
    
    for script in scripts_to_check:
        result = check_script(script)
        status = result.get("status", "?")
        print(f"  {status} {script}")
    
    # Summary
    print("\n" + "-" * 50)
    print("✅ All checks complete!")
    
    # Save status report
    status_file = LOG_DIR / "status.json"
    status_data = {
        "timestamp": datetime.now().isoformat(),
        "checks": results
    }
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    with open(status_file, "w") as f:
        json.dump(status_data, f, indent=2)
    
    return results

if __name__ == "__main__":
    run_all_checks()
