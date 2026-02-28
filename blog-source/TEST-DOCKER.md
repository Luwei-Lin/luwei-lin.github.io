# Docker Setup Test Guide

Use this guide to verify your Docker setup is working correctly.

## ✅ Pre-flight Checks

Run these commands to verify prerequisites:

```bash
# Check Docker
docker --version
# Expected: Docker version 20.x.x or higher

# Check Docker Compose
docker-compose --version
# Expected: Docker Compose version 2.x.x or higher

# Check Make
make --version
# Expected: GNU Make or BSD Make

# Check Docker is running
docker ps
# Expected: List of containers (may be empty)
```

If any fail, install [Docker Desktop](https://www.docker.com/products/docker-desktop).

---

## 🧪 Test 1: Basic Make Help

```bash
cd /Users/luis/Documents/GitHub/luwei.github.io/blog-source
make help
```

**Expected Output:**
```
Available commands:
  dev             Start development server...
  up              Alias for 'make dev'
  ...
```

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 2: Build Docker Image

```bash
make build
```

**Expected:**
- Docker downloads Node.js Alpine image (first time only)
- Builds image successfully
- No errors

**Time:** 1-3 minutes (first time), 5-10 seconds (cached)

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 3: Start Development Server

```bash
make dev
```

**Expected Output:**
```
✔ Starting...
✔ Ready in Xms
○ Compiling / ...
✓ Compiled / in Xms
```

**Open Browser:** http://localhost:3000

**You should see:**
- "Hey! I'm Luis" heading
- Navigation menu (Home, Blog, About)
- Responsive design

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 4: Hot Reload

**While `make dev` is running:**

1. Open `app/page.tsx` in your editor
2. Find the line: `Hey! I'm Luis`
3. Change it to: `Hey! I'm Testing Docker`
4. Save the file

**Expected:**
- Terminal shows: "Compiling..."
- Browser auto-refreshes
- New text appears

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 5: View Logs

**In a new terminal:**

```bash
cd blog-source
make logs
```

**Expected:**
- Shows Next.js dev server logs
- Updates in real-time
- Press `Ctrl+C` to exit

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 6: Shell Access

```bash
make shell
```

**Expected:**
- Opens shell inside container
- Prompt changes to: `/app #`

**Run inside shell:**
```bash
pwd           # Should show: /app
ls            # Should list: app, components, lib, posts, etc.
node --version # Should show: v20.x.x
exit          # Exit shell
```

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 7: Container Status

```bash
make ps
```

**Expected Output:**
```
NAME                 STATUS              PORTS
luwei-blog-dev       Up X minutes        0.0.0.0:3000->3000/tcp
```

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 8: Stop Server

**In the terminal running `make dev`:**
- Press `Ctrl+C`

**Or in a new terminal:**
```bash
make down
```

**Expected:**
- Server stops gracefully
- Containers removed
- `make ps` shows no running containers

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 9: Install Package

```bash
make npm CMD="install --save-dev prettier"
```

**Expected:**
- Prettier added to `package.json`
- Installed inside container

**Verify:**
```bash
grep prettier package.json
```

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 10: Clean and Rebuild

```bash
make clean
```

**Expected:**
- Removes containers and volumes
- Cleans `node_modules`, `.next`, `out`

```bash
make full
```

**Expected:**
- Rebuilds from scratch
- Starts dev server
- http://localhost:3000 works

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 11: Production Build

```bash
make deploy-build
```

**Expected:**
- Builds static site
- Creates `out/` directory
- No errors

**Verify:**
```bash
ls -la out/
```

Should contain:
- `index.html`
- `blog/` directory
- `_next/` directory

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 12: Blog Posts

**Start server:**
```bash
make dev
```

**Visit:** http://localhost:3000/blog

**Expected:**
- Lists 3 blog posts
- Shows titles, dates, tags
- "Read more" links work

**Click a post:** http://localhost:3000/blog/welcome-to-my-blog

**Expected:**
- Full blog post loads
- Code blocks have syntax highlighting
- "Back to Blog" link works

**Status**: ⬜ Pass / ⬜ Fail

---

## 🧪 Test 13: Navigation

**Visit different pages:**

- http://localhost:3000/ (Home)
- http://localhost:3000/blog (Blog)
- http://localhost:3000/about (About)

**Test mobile menu:**
- Resize browser to mobile width
- Click hamburger menu (≡)
- Menu expands
- Links work

**Status**: ⬜ Pass / ⬜ Fail

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Make Help | ⬜ | |
| 2. Build Image | ⬜ | |
| 3. Start Server | ⬜ | |
| 4. Hot Reload | ⬜ | |
| 5. View Logs | ⬜ | |
| 6. Shell Access | ⬜ | |
| 7. Container Status | ⬜ | |
| 8. Stop Server | ⬜ | |
| 9. Install Package | ⬜ | |
| 10. Clean & Rebuild | ⬜ | |
| 11. Production Build | ⬜ | |
| 12. Blog Posts | ⬜ | |
| 13. Navigation | ⬜ | |

---

## 🐛 Common Issues & Fixes

### Issue: "Port 3000 already in use"
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Issue: "Cannot connect to Docker daemon"
**Fix:** Start Docker Desktop application

### Issue: "Build fails with permission error"
```bash
# Fix permissions
sudo chown -R $(whoami) .
```

### Issue: "Changes not reflecting"
```bash
make restart
```

### Issue: "Container keeps crashing"
```bash
make logs    # Check for errors
make clean   # Clean everything
make rebuild # Rebuild from scratch
```

---

## ✅ All Tests Passed?

Congratulations! Your Docker setup is working perfectly! 🎉

**Next steps:**
1. Customize your [about page](app/about/page.tsx)
2. Write your first blog post
3. Deploy with `make deploy`

---

## ❌ Some Tests Failed?

Don't worry! Here's what to do:

1. **Check Docker Desktop is running**
2. **Restart Docker Desktop**
3. **Run:** `make clean && make rebuild`
4. **Check logs:** `make logs`
5. **Ask for help:** Open an issue with test results

---

## 🎓 Understanding the Tests

These tests verify:
- ✅ Docker setup is correct
- ✅ Make commands work
- ✅ Hot reload functions
- ✅ All pages load
- ✅ Build process works
- ✅ Deployment is ready

Once all pass, you're ready to blog! 🚀
