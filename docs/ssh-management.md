# SSH Key Management

## Current Setup

### Keys
- **Type:** Ed25519 (recommended)
- **Location:** `~/.ssh/id_ed25519`
- **Public Key:** `~/.ssh/id_ed25519.pub`

### Config (`~/.ssh/config`)
```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

## Adding New SSH Connections

### 1. Generate New Key
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

### 2. Add to SSH Config
```bash
# Edit ~/.ssh/config
Host my-server
  HostName server.example.com
  User ubuntu
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
```

### 3. Add Public Key to Server
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.example.com
```

### 4. Store Private Key in 1Password (optional)
```
Item: SSH Key - my-server
Type: Secure Note
Fields:
  - Private Key (encrypted)
  - Public Key
  - Passphrase (if any)
```

## Common SSH Commands

```bash
# Connect to server
ssh user@server.example.com

# Connect with specific key
ssh -i ~/.ssh/custom_key user@server.example.com

# Test connection
ssh -T git@github.com

# List configured hosts
ssh -G github.com | grep hostname
```

## Security Best Practices

1. **Use Ed25519** instead of RSA (more secure, smaller keys)
2. **Never share private keys**
3. **Use SSH agent** to avoid entering passphrase repeatedly
4. **Rotate keys** annually
5. **Use different keys** for different services
6. **Store passphrases in 1Password** (not in keychain for sensitive keys)
