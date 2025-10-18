# 🎮 All Commands

Complete list of commands for development, testing, and deployment.

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
```

## 🔧 Development

### Start Development Servers

```bash
# Terminal 1: Start Mastra agent server
pnpm dev:agent

# Terminal 2: Start Next.js UI
pnpm dev:ui

# Alternative: Debug mode with verbose logging
LOG_LEVEL=debug pnpm dev:agent
```

### Access Points

```bash
# Frontend UI
open http://localhost:3000

# Mastra Agent Playground
open http://localhost:4111
```

## 🧪 Testing

### Manual Testing

```bash
# Check TypeScript errors
pnpm tsc --noEmit

# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix
```

### Test Prompts

```bash
# In the UI at http://localhost:3000, try:
"Create a users table with email and password"
"Add a posts table related to users"
"Generate a PostgreSQL migration"
"Validate my schema"
"Export as JSON"
```

## 🏗️ Building

### Build for Production

```bash
# Build both agent and UI
pnpm build

# Or build separately
pnpm build:agent
pnpm build:ui
```

### Start Production Servers

```bash
# Start both servers
pnpm start

# Or start separately
pnpm start:agent
pnpm start:ui
```

## 🐳 Docker

### Build Docker Image

```bash
# Build with your username
docker build -t yourusername/schema-designer:latest .

# Build with specific tag
docker build -t yourusername/schema-designer:v1.0.0 .

# Build with no cache
docker build --no-cache -t yourusername/schema-designer:latest .
```

### Test Docker Image Locally

```bash
# Run container
docker run -p 3000:3000 yourusername/schema-designer:latest

# Run with environment variables
docker run -p 3000:3000 \
  -e OLLAMA_API_URL=http://host.docker.internal:11434/api \
  yourusername/schema-designer:latest

# Run in detached mode
docker run -d -p 3000:3000 yourusername/schema-designer:latest

# View logs
docker logs <container-id>

# Stop container
docker stop <container-id>
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push image
docker push yourusername/schema-designer:latest

# Push specific version
docker push yourusername/schema-designer:v1.0.0
```

### Docker Cleanup

```bash
# Remove container
docker rm <container-id>

# Remove image
docker rmi yourusername/schema-designer:latest

# Clean up all unused images
docker image prune -a

# Clean up everything
docker system prune -a
```

## 🚀 Nosana Deployment

### Using Nosana Dashboard

```bash
# 1. Open dashboard
open https://dashboard.nosana.com/deploy

# 2. Update job definition
# Edit nos_job_def/nosana_mastra_job_definition.json
# Replace image with: yourusername/schema-designer:latest

# 3. Copy job definition and paste in dashboard
# 4. Select GPU (nvidia-3090)
# 5. Click Deploy
```

### Using Nosana CLI

```bash
# Install Nosana CLI
npm install -g @nosana/cli

# Login to Nosana
nosana login

# Deploy job
nosana job post \
  --file ./nos_job_def/nosana_mastra_job_definition.json \
  --market nvidia-3090 \
  --timeout 30

# Check job status
nosana job get <job-id>

# View job logs
nosana job logs <job-id>

# List your jobs
nosana job list
```

## 🔍 Debugging

### Check Ports

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :4111

# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:4111 | xargs kill -9
```

### Check Ollama

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# List available models
ollama list

# Pull a model
ollama pull qwen3:8b

# Start Ollama server
ollama serve

# Test model
ollama run qwen3:8b "Hello"
```

### View Logs

```bash
# Mastra agent logs
# Check terminal where dev:agent is running

# Next.js logs
# Check terminal where dev:ui is running

# Docker logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>
```

### Clear Cache

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules cache
rm -rf node_modules/.cache

# Clear all and reinstall
rm -rf node_modules pnpm-lock.yaml .next
pnpm install
```

## 📊 Code Quality

### Type Checking

```bash
# Check TypeScript errors
pnpm tsc --noEmit

# Watch mode
pnpm tsc --noEmit --watch
```

### Linting

```bash
# Run ESLint
pnpm lint

# Fix auto-fixable issues
pnpm lint --fix

# Lint specific file
pnpm eslint src/app/page.tsx
```

### Formatting

```bash
# Format with Prettier (if configured)
pnpm prettier --write "src/**/*.{ts,tsx}"

# Check formatting
pnpm prettier --check "src/**/*.{ts,tsx}"
```

## 📝 Documentation

### Generate Documentation

```bash
# Count lines of code
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# List all files
find src -type f -name "*.ts" -o -name "*.tsx"

# Check documentation files
ls -la *.md
```

### Update Documentation

```bash
# Edit README
nano README.md

# Edit project overview
nano PROJECT_OVERVIEW.md

# View documentation
cat QUICKSTART.md
```

## 🎥 Recording Demo

### Screen Recording (macOS)

```bash
# Start screen recording
# Press Cmd + Shift + 5
# Select recording area
# Click Record

# Or use QuickTime
open -a "QuickTime Player"
# File > New Screen Recording
```

### Upload to YouTube

```bash
# 1. Go to youtube.com/upload
# 2. Select video file
# 3. Add title: "Database Schema Designer - Nosana Challenge"
# 4. Add description with links
# 5. Set visibility to Public
# 6. Publish
```

## 📱 Social Media

### Create Post

```bash
# X/Twitter
# 1. Go to twitter.com
# 2. Create new post
# 3. Add text, screenshot, and links
# 4. Tag @nosana_ai
# 5. Add #NosanaAgentChallenge
# 6. Post

# LinkedIn
# Similar process on linkedin.com
```

## 📤 Submission

### Prepare Submission

```bash
# 1. Ensure all code is committed
git add .
git commit -m "Final submission for Nosana Challenge 3"
git push origin main

# 2. Verify all links work
# - GitHub repository
# - Docker Hub image
# - Nosana deployment
# - Video demo
# - Social media post

# 3. Submit to SuperTeam
open https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102
```

## 🔧 Maintenance

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update all dependencies
pnpm update

# Update specific package
pnpm update mastra

# Update to latest
pnpm update --latest
```

### Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Create new branch
git checkout -b feature/new-feature

# View commit history
git log --oneline
```

## 🆘 Troubleshooting Commands

### Reset Everything

```bash
# Nuclear option - start fresh
rm -rf node_modules pnpm-lock.yaml .next
pnpm install
pnpm dev:agent  # Terminal 1
pnpm dev:ui     # Terminal 2
```

### Check System

```bash
# Check Node version
node --version

# Check pnpm version
pnpm --version

# Check Docker version
docker --version

# Check available disk space
df -h

# Check memory usage
top
```

### Network Issues

```bash
# Check internet connection
ping google.com

# Check if port is accessible
nc -zv localhost 3000
nc -zv localhost 4111

# Check DNS
nslookup nosana.com
```

## 📋 Checklist Commands

### Pre-Deployment

```bash
# Run all checks
pnpm lint && \
pnpm tsc --noEmit && \
pnpm build && \
docker build -t test:latest . && \
echo "✅ All checks passed!"
```

### Post-Deployment

```bash
# Verify deployment
curl -I https://your-deployment-url.nos.ci

# Check if agent responds
curl https://your-deployment-url.nos.ci/api/copilotkit
```

---

**Keep this file handy for quick command reference!**
