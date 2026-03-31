#!/usr/bin/env python3
"""
Reporting System - Generate automated reports
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

WORKSPACE = Path.home() / ".openclaw" / "workspace"

def get_git_stats():
    """Get git activity stats."""
    import subprocess
    stats = {}
    
    try:
        # Count commits today
        result = subprocess.run(
            ["git", "log", "--since=midnight", "--oneline"],
            cwd=WORKSPACE, capture_output=True, text=True
        )
        stats['commits_today'] = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        
        # Count commits this week
        result = subprocess.run(
            ["git", "log", "--since='7 days ago'", "--oneline"],
            cwd=WORKSPACE, capture_output=True, text=True
        )
        stats['commits_week'] = len(result.stdout.strip().split('\n')) if result.stdout.strip() else 0
        
    except Exception as e:
        stats['error'] = str(e)
    
    return stats

def get_task_stats():
    """Get task completion stats."""
    tasks_dir = WORKSPACE / "tasks"
    if not tasks_dir.exists():
        return {"error": "Tasks directory not found"}
    
    completed = 0
    in_progress = 0
    not_started = 0
    
    for f in tasks_dir.glob("task-*.md"):
        content = f.read_text()
        if "**Status:** ✅" in content:
            completed += 1
        elif "**Status:** 🔄" in content:
            in_progress += 1
        else:
            not_started += 1
    
    return {
        "completed": completed,
        "in_progress": in_progress,
        "not_started": not_started,
        "total": completed + in_progress + not_started
    }

def get_cron_stats():
    """Get cron job stats."""
    import subprocess
    result = subprocess.run(
        ["openclaw", "cron", "list", "--json"],
        capture_output=True, text=True
    )
    
    if result.returncode == 0:
        try:
            jobs = json.loads(result.stdout)
            return {"jobs": len(jobs), "jobs_detail": jobs}
        except:
            pass
    
    return {"error": "Could not fetch cron stats"}

def generate_daily_summary():
    """Generate daily summary report."""
    stats = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "type": "daily_summary",
        "git": get_git_stats(),
        "tasks": get_task_stats(),
        "cron": get_cron_stats()
    }
    
    report = f"""# Daily Summary - {stats['date']}

## Git Activity
- Commits today: {stats['git'].get('commits_today', 'N/A')}
- Commits this week: {stats['git'].get('commits_week', 'N/A')}

## Task Progress
- ✅ Completed: {stats['tasks'].get('completed', 0)}
- 🔄 In Progress: {stats['tasks'].get('in_progress', 0)}
- [ ] Not Started: {stats['tasks'].get('not_started', 0)}
- Total: {stats['tasks'].get('total', 0)}

## Cron Jobs
- Active jobs: {stats['cron'].get('jobs', 'N/A')}

---
Generated: {datetime.now().isoformat()}
"""
    
    return report, stats

def generate_weekly_report():
    """Generate weekly progress report."""
    stats = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "type": "weekly_report",
        "week": datetime.now().isocalendar()[1],
        "git": get_git_stats(),
        "tasks": get_task_stats()
    }
    
    report = f"""# Weekly Report - Week {stats['week']}

## Overview
- Date: {stats['date']}
- Week: {stats['week']}

## Git Activity
- Commits this week: {stats['git'].get('commits_week', 'N/A')}

## Task Progress
- ✅ Completed: {stats['tasks'].get('completed', 0)}
- 🔄 In Progress: {stats['tasks'].get('in_progress', 0)}
- [ ] Not Started: {stats['tasks'].get('not_started', 0)}

---
Generated: {datetime.now().isoformat()}
"""
    
    return report, stats

if __name__ == "__main__":
    import sys
    
    report_type = sys.argv[1] if len(sys.argv) > 1 else "daily"
    
    if report_type == "daily":
        report, stats = generate_daily_summary()
    elif report_type == "weekly":
        report, stats = generate_weekly_report()
    else:
        print(f"Unknown report type: {report_type}")
        sys.exit(1)
    
    print(report)
    
    # Save to reports folder
    reports_dir = WORKSPACE / "reports"
    reports_dir.mkdir(exist_ok=True)
    
    filename = f"{stats['type']}_{stats['date']}.md"
    (reports_dir / filename).write_text(report)
    print(f"\nSaved to: {reports_dir / filename}")
