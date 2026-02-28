# Make Commands Cheat Sheet

Quick reference for Docker + Make commands.

## 🚀 Getting Started

```bash
make dev        # Start development server
make up         # Alias for 'make dev'
make full       # Build + start (first time or after dependency changes)
```

## 🛠️ Development

```bash
make dev        # Start dev server with hot reload
make logs       # Show logs (follow mode)
make shell      # Open shell in container
make restart    # Restart the server
```

## 📦 Container Management

```bash
make down       # Stop and remove containers
make stop       # Alias for 'make down'
make ps         # Show running containers
make status     # Alias for 'make ps'
```

## 🔨 Build & Rebuild

```bash
make build      # Build Docker images
make rebuild    # Rebuild from scratch (no cache)
make dev-build  # Build and start dev server
```

## 🧹 Cleanup

```bash
make clean      # Remove containers, volumes, node_modules, .next, out
```

## 📝 Development Tools

```bash
make install    # Install/reinstall npm dependencies
make lint       # Run ESLint
make npm CMD="install package"  # Run custom npm command
```

## 🚢 Deployment

```bash
make deploy-build   # Build static site (creates ./out directory)
make deploy         # Build + prepare for GitHub Pages
```

## 🏭 Production

```bash
make prod           # Run production server (port 3001)
make prod-build     # Build production Docker image
```

## 🔄 Common Workflows

### First Time Setup
```bash
make full
# Visit http://localhost:3000
```

### Daily Development
```bash
make dev        # Start
make logs       # Watch logs (in another terminal)
make down       # Stop when done
```

### Add New Package
```bash
make down
make npm CMD="install package-name"
make full
```

### Troubleshooting
```bash
make clean
make full
```

### Build for Deployment
```bash
make deploy
cd ..
git add .
git commit -m "Deploy"
git push
```

### Compare Dev vs Prod
```bash
make dev        # Terminal 1 - port 3000
make prod       # Terminal 2 - port 3001
```

## 🆘 Help

```bash
make help       # Show all available commands
make            # Same as 'make help'
```

## 🎯 Most Used Commands (Top 5)

1. `make dev` - Start development
2. `make logs` - View logs
3. `make down` - Stop server
4. `make shell` - Debug in container
5. `make deploy` - Deploy to GitHub Pages

## 💡 Tips

- **Hot Reload**: File changes auto-reload in `make dev`
- **Logs**: Use `make logs` in a separate terminal
- **Shell Access**: Use `make shell` to run commands inside container
- **Clean Start**: `make clean && make full` fixes most issues
- **Local Dev**: Use `make local` to run without Docker (faster on macOS)

## 🔗 See Also

- [DOCKER.md](DOCKER.md) - Complete Docker documentation
- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Setup guide
