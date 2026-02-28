# Getting Started with Docker - Visual Guide

This guide shows you exactly what happens when you run Docker commands.

## 🎯 TL;DR (Too Long; Didn't Read)

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source
make dev
```

Open browser to http://localhost:3000 - Done! 🎉

---

## 📋 Prerequisites Check

Before starting, verify you have Docker installed:

```bash
docker --version
# Should show: Docker version 20.x.x or higher

docker-compose --version
# Should show: Docker Compose version 2.x.x or higher

make --version
# Should show: GNU Make or similar
```

If any command fails, install Docker Desktop from https://www.docker.com/products/docker-desktop

---

## 🚀 Step-by-Step First Run

### Step 1: Navigate to Blog Directory

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source
```

### Step 2: Start the Blog

```bash
make dev
```

**What happens behind the scenes:**

1. 📦 Docker reads `Dockerfile`
2. 🏗️ Builds a Node.js container with your blog
3. 📥 Installs all npm dependencies inside container
4. 🔄 Mounts your code for live reloading
5. 🚀 Starts Next.js dev server on port 3000
6. ✅ Your blog is ready!

**First run takes 2-5 minutes** (downloads Node.js image and installs packages)

**Subsequent runs take 5-10 seconds** (uses cached image)

### Step 3: Open Your Blog

```
Browser → http://localhost:3000
```

You should see your blog homepage!

### Step 4: Make a Change (Test Hot Reload)

1. Open `app/page.tsx` in your editor
2. Change the text "Hey! I'm Luis" to something else
3. Save the file
4. **Browser auto-refreshes** with your changes! 🎊

### Step 5: Stop the Server

Press `Ctrl+C` in the terminal, or in a new terminal:

```bash
make down
```

---

## 🎨 Visual Workflow Diagram

```
┌─────────────────────────────────────────────────┐
│  Your Computer (Host)                           │
│                                                 │
│  📁 blog-source/                                │
│     ├── app/                                    │
│     ├── posts/          ←──────┐               │
│     └── ...                    │ Volume Mount  │
│                                │ (Live Sync)   │
│  ┌──────────────────────────┐  │               │
│  │  Docker Container        │  │               │
│  │  ┌────────────────────┐  │  │               │
│  │  │ Node.js 20 Alpine  │  │  │               │
│  │  │                    │  │  │               │
│  │  │ /app/ ─────────────┼──┘  │               │
│  │  │   ├── node_modules │     │               │
│  │  │   ├── .next/       │     │               │
│  │  │   └── [your code]  │     │               │
│  │  │                    │     │               │
│  │  │ Next.js Dev Server │     │               │
│  │  │ Running on :3000   │     │               │
│  │  └────────────────────┘     │               │
│  └──────────────────────────────┘               │
│                 │                               │
│                 └─── Port Mapping ───┐          │
│                                      │          │
└──────────────────────────────────────┼──────────┘
                                       │
                                       ▼
                            localhost:3000
                            (Your Browser)
```

---

## 🔄 Common Development Workflows

### Workflow 1: Daily Development

```bash
# Morning - Start working
cd blog-source
make dev

# ... code, code, code ...

# Evening - Done for the day
make down
```

### Workflow 2: Write a New Blog Post

```bash
# 1. Start server
make dev

# 2. Create new post (in your editor)
# blog-source/posts/my-new-post.md

# 3. View in browser
# http://localhost:3000/blog/my-new-post

# 4. Edit and save - auto-refreshes!

# 5. When done
make down
```

### Workflow 3: Add New Dependency

```bash
# 1. Stop server (if running)
make down

# 2. Add dependency
make npm CMD="install react-icons"

# 3. Rebuild and start
make full

# Done!
```

### Workflow 4: Something Broken? Fresh Start!

```bash
make clean      # Nuclear option - removes everything
make full       # Fresh build and start
```

---

## 📊 Command Comparison Table

| Task | Docker Command | Local Command | Notes |
|------|---------------|---------------|-------|
| Start dev server | `make dev` | `npm run dev` | Docker is isolated |
| Stop server | `make down` | `Ctrl+C` | Docker cleans up containers |
| View logs | `make logs` | See terminal | Docker logs persist |
| Install packages | `make npm CMD="install X"` | `npm install X` | Installed in container |
| Debug | `make shell` | N/A | Enter container shell |
| Clean | `make clean` | `rm -rf node_modules .next` | Docker removes all |

---

## 🎯 Quick Reference

### Starting

```bash
make dev        # Regular start
make full       # Build first, then start
make up         # Same as 'make dev'
```

### Monitoring

```bash
make logs       # Watch logs
make ps         # Show status
```

### Stopping

```bash
make down       # Stop gracefully
make stop       # Same as 'make down'
Ctrl+C          # Stop from running terminal
```

### Debugging

```bash
make shell      # Enter container
make logs       # Check logs
make restart    # Restart server
```

---

## 🐛 Troubleshooting

### Problem: "Port 3000 already in use"

**Solution 1**: Stop other apps using port 3000
```bash
lsof -i :3000
kill -9 <PID>
```

**Solution 2**: Change port in `docker-compose.yml`
```yaml
ports:
  - "8080:3000"  # Use port 8080 instead
```

### Problem: "Cannot connect to Docker daemon"

**Solution**: Start Docker Desktop application

### Problem: Changes not reflecting

**Solution**: Restart the dev server
```bash
make restart
```

### Problem: "Image build failed"

**Solution**: Clean and rebuild
```bash
make clean
make rebuild
```

### Problem: Container keeps exiting

**Solution**: Check logs for errors
```bash
make logs
```

---

## 🎓 Understanding Make Commands

The `Makefile` is just a collection of shortcuts:

| Make Command | Actual Docker Command |
|-------------|----------------------|
| `make dev` | `docker-compose up blog-dev` |
| `make down` | `docker-compose down` |
| `make logs` | `docker-compose logs -f blog-dev` |
| `make shell` | `docker-compose exec blog-dev sh` |
| `make build` | `docker-compose build blog-dev` |

You can use either! Make commands are just easier to remember.

---

## 🚢 Deploying Your Blog

When ready to deploy:

```bash
# 1. Build static site
make deploy

# 2. Commit and push
cd ..
git add .
git commit -m "Deploy blog update"
git push origin main

# 3. Wait a few minutes
# Your site will be live at https://yourusername.github.io
```

---

## 📚 Next Steps

1. ✅ You've started the blog with Docker
2. ⬜ Customize your [about page](app/about/page.tsx)
3. ⬜ Write your [first blog post](posts/)
4. ⬜ Change [colors and styles](tailwind.config.ts)
5. ⬜ Deploy to GitHub Pages

---

## 💡 Pro Tips

1. **Keep it Running**: Leave `make dev` running while you code - it auto-reloads!
2. **Two Terminals**: Terminal 1 for `make dev`, Terminal 2 for `make logs`
3. **Shell Access**: Use `make shell` to run commands inside the container
4. **Clean Regularly**: Run `make clean` weekly to free up disk space
5. **Check Status**: Use `make ps` to see what's running

---

## 🎉 You're Ready!

You now know how to:
- ✅ Start the blog with Docker
- ✅ Monitor and debug
- ✅ Make changes with hot reload
- ✅ Stop and clean up
- ✅ Deploy to production

**Most used commands:**
```bash
make dev        # Start
make logs       # Watch
make down       # Stop
```

**Need more help?**
- [DOCKER.md](DOCKER.md) - Complete Docker guide
- [MAKE-CHEATSHEET.md](MAKE-CHEATSHEET.md) - Quick command reference
- [README.md](README.md) - Project overview

Happy Dockerized blogging! 🐳✨
