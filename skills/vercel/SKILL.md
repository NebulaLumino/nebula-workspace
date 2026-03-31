# Vercel Skill

Deploy and manage projects on Vercel directly from OpenClaw.

## Capabilities

- Deploy projects to Vercel
- List and manage deployments
- Manage environment variables
- Link projects, manage domains
- View logs and inspect deployments

## Commands

### Deploy

Deploy the current directory or a specific path:

```
vercel deploy [path] [--prod] [--yes]
```

**Options:**
- `--prod` - Deploy to production
- `--yes` - Skip confirmation

### List Deployments

List all deployments for a project:

```
vercel ls [app]
```

### Remove Deployment

Remove a specific deployment:

```
vercel rm <deployment-id>
```

### Logs

View logs for a deployment:

```
vercel logs <url-or-id>
```

### Environment Variables

Manage environment variables:

```
vercel env add <name>              # Add new variable
vercel env ls                      # List variables
vercel env rm <name>               # Remove variable
```

### Link Project

Link current directory to a Vercel project:

```
vercel link
```

### Login

Log into Vercel account:

```
vercel login [email]
```

### Whoami

Check currently logged in user:

```
vercel whoami
```

## Examples

```bash
# Deploy current project
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# View deployment logs
vercel logs my-project.vercel.app

# Add environment variable
vercel env add DATABASE_URL
```

## Requirements

- Vercel CLI installed: `npm install -g vercel`
- Vercel account (run `vercel login` to authenticate)

## Setup

1. Install Vercel CLI: `npm install -g vercel`
2. Log in: `vercel login [email]` or set VERCEL_TOKEN environment variable
3. Link project: `vercel link`

## Notes

- Uses `--non-interactive` mode by default (agent-friendly)
- Run `vercel link` first to connect to a Vercel project
- Use `--debug` for verbose output
- For CI/CD, set `VERCEL_TOKEN` environment variable
