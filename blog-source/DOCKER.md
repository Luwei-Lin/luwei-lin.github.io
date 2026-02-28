# Docker Setup Guide

This guide explains how to run your blog using Docker and Docker Compose with simple Make commands.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- Make (usually pre-installed on macOS/Linux)

## Quick Start

### Option 1: Using Make Commands (Recommended)

```bash
# Start development server with hot reload
make dev

# Or simply
make up

# Build and start (if first time or after dependency changes)
make full
```

That's it! Your blog will be running at [http://localhost:3000](http://localhost:3000)

### Option 2: Using Docker Compose Directly

```bash
# Start development server
docker-compose up blog-dev

# Or run in background
docker-compose up -d blog-dev
```

## Available Make Commands

Run `make help` or just `make` to see all available commands:

```bash
make help
```

### Development Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start development server with hot reload (default) |
| `make up` | Alias for `make dev` |
| `make full` | Build and start development server |
| `make dev-build` | Same as `make full` |
| `make dev-fresh` | Clean everything, reinstall, and start dev server |

### Container Management

| Command | Description |
|---------|-------------|
| `make down` | Stop and remove containers |
| `make stop` | Alias for `make down` |
| `make restart` | Restart the development server |
| `make logs` | Show logs from the development server |
| `make ps` | Show running containers |

### Development Tools

| Command | Description |
|---------|-------------|
| `make shell` | Open a shell in the development container |
| `make bash` | Alias for `make shell` |
| `make install` | Install/reinstall npm dependencies |
| `make lint` | Run ESLint |
| `make npm CMD="..."` | Run custom npm command |

### Build & Deployment

| Command | Description |
|---------|-------------|
| `make build` | Build Docker images |
| `make rebuild` | Rebuild Docker images from scratch (no cache) |
| `make deploy-build` | Build static site for deployment |
| `make deploy` | Build and prepare for GitHub Pages deployment |

### Production

| Command | Description |
|---------|-------------|
| `make prod` | Build and run production server (port 3001) |
| `make prod-build` | Build production Docker image |

### Cleanup

| Command | Description |
|---------|-------------|
| `make clean` | Clean up containers, volumes, and build artifacts |

### Local (Non-Docker)

| Command | Description |
|---------|-------------|
| `make local` | Run development server locally (without Docker) |
| `make local-install` | Install dependencies locally (without Docker) |

## Common Workflows

### First Time Setup

```bash
# Build and start the development server
make full

# Wait for the build to complete, then visit http://localhost:3000
```

### Daily Development

```bash
# Start development server
make dev

# View logs (in another terminal)
make logs

# When done, stop the server
make down
```

### Adding New Dependencies

```bash
# Stop the server
make down

# Add the dependency to package.json manually or:
make npm CMD="install package-name"

# Rebuild and start
make full
```

### Troubleshooting

```bash
# Clean everything and start fresh
make clean
make full

# Or use the combined command
make dev-fresh
```

### Working Inside the Container

```bash
# Open a shell in the running container
make shell

# Now you can run commands directly:
# npm install package-name
# npm run build
# etc.
```

### Building for Production

```bash
# Build the static site
make deploy-build

# The output will be in the ./out directory
```

### Deploying to GitHub Pages

```bash
# Build and prepare deployment
make deploy

# Then commit and push
git add .
git commit -m "Deploy blog update"
git push origin main
```

## Architecture

### Development Mode

- Uses `Dockerfile` (development)
- Mounts source code as volume for hot reload
- Runs `npm run dev`
- Port: 3000

### Production Mode

- Uses `Dockerfile.prod` (multi-stage build)
- Builds optimized static site
- Serves with `serve`
- Port: 3001

## File Structure

```
blog-source/
├── Dockerfile              # Development Dockerfile
├── Dockerfile.prod         # Production Dockerfile
├── docker-compose.yml      # Docker Compose configuration
├── Makefile               # Make commands
├── .dockerignore          # Files to exclude from Docker build
└── ...
```

## Environment Variables

You can set environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=development
  - NEXT_PUBLIC_API_URL=https://api.example.com
```

Or create a `.env` file:

```bash
NODE_ENV=development
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Port Configuration

By default:
- Development: `http://localhost:3000`
- Production: `http://localhost:3001`

To change ports, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Maps host port 8080 to container port 3000
```

## Volume Mounts

The development container mounts:
- `.:/app` - Your source code (for hot reload)
- `/app/node_modules` - Node modules (not from host)
- `/app/.next` - Next.js build cache (not from host)

This allows hot reload while keeping dependencies isolated.

## Debugging

### View Container Logs

```bash
make logs
```

### Check Container Status

```bash
make ps
```

### Enter Container Shell

```bash
make shell

# Inside container:
ps aux          # See running processes
ls -la          # List files
npm run dev     # Restart dev server
```

### Rebuild Everything

```bash
make rebuild
```

## Tips

1. **Hot Reload**: Changes to files are automatically detected and the server reloads
2. **Dependency Changes**: Run `make full` after changing `package.json`
3. **Port Conflicts**: If port 3000 is in use, edit `docker-compose.yml`
4. **Performance**: Docker on macOS can be slower; consider using `make local` for development
5. **Cleanup**: Run `make clean` periodically to free up disk space

## Comparison: Docker vs Local

### Docker Advantages
- ✅ Consistent environment across machines
- ✅ No need to install Node.js locally
- ✅ Easy cleanup (`make clean`)
- ✅ Isolated dependencies

### Local Advantages
- ✅ Faster on macOS (no Docker overhead)
- ✅ Direct access to Node.js tools
- ✅ Better IDE integration

**Recommendation**: Use Docker for consistency, use local for better performance.

## Troubleshooting

### Container Won't Start

```bash
# Check logs
make logs

# Rebuild from scratch
make rebuild
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

### Changes Not Reflecting

```bash
# Restart container
make restart

# Or rebuild
make full
```

### Out of Disk Space

```bash
# Clean up Docker resources
docker system prune -a

# Clean blog artifacts
make clean
```

### Permission Errors

```bash
# Files created by Docker may have wrong permissions
# Fix ownership (replace 'youruser' with your username)
sudo chown -R youruser:youruser .
```

## Advanced Usage

### Running Custom Commands

```bash
# Run any npm command
make npm CMD="install --save-dev package-name"
make npm CMD="run lint"
make npm CMD="test"
```

### Multiple Environments

```bash
# Development (port 3000)
make dev

# Production (port 3001) - in another terminal
make prod

# Now you can compare both versions
```

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Build with Docker
  run: |
    cd blog-source
    docker-compose build blog-dev
    docker-compose run blog-dev npm run build
```

---

## Quick Reference

Most common commands:

```bash
make dev        # Start development
make logs       # View logs
make shell      # Enter container
make down       # Stop container
make clean      # Clean everything
make deploy     # Deploy to GitHub Pages
```

Happy Dockerized blogging! 🐳
