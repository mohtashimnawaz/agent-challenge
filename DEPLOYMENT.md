# 🚀 Deployment Guide

Complete guide to deploying your Database Schema Designer to Nosana Network.

## Prerequisites

- Docker installed and running
- Docker Hub account
- Nosana account (register at [dashboard.nosana.com](https://dashboard.nosana.com))
- Your application tested locally

## Step 1: Prepare for Production

### 1.1 Test Locally

Ensure everything works:
```bash
# Start both servers
pnpm dev:agent
pnpm dev:ui

# Test at http://localhost:3000
# Try creating tables, generating migrations, etc.
```

### 1.2 Clean Up Code

Remove any unused imports or console.logs:
```bash
# Run linter
pnpm lint
```

### 1.3 Update Environment Variables

Create a production `.env` file with your LLM configuration.

## Step 2: Build Docker Image

### 2.1 Review Dockerfile

The provided `Dockerfile` includes:
- Multi-stage build for optimization
- Mastra agent server
- Next.js UI server
- Embedded LLM (Ollama with qwen3:0.6b)

### 2.2 Build the Image

```bash
# Replace 'yourusername' with your Docker Hub username
docker build -t yourusername/schema-designer:latest .
```

This will take 5-10 minutes as it downloads the LLM model.

### 2.3 Test Locally

```bash
# Run the container
docker run -p 3000:3000 yourusername/schema-designer:latest

# Test at http://localhost:3000
# Verify the agent responds correctly
```

### 2.4 Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push the image
docker push yourusername/schema-designer:latest
```

## Step 3: Configure Nosana Job

### 3.1 Update Job Definition

Edit `nos_job_def/nosana_mastra_job_definition.json`:

```json
{
  "version": "0.1",
  "type": "container",
  "meta": {
    "trigger": "cli"
  },
  "ops": [
    {
      "type": "container/run",
      "id": "schema-designer",
      "args": {
        "image": "yourusername/schema-designer:latest",
        "gpu": true,
        "expose": 3000,
        "env": {
          "NODE_ENV": "production"
        }
      }
    }
  ]
}
```

Key fields:
- `image`: Your Docker Hub image
- `gpu`: Set to `true` for LLM inference
- `expose`: Port 3000 for the web interface

### 3.2 Choose GPU Type

Available options:
- `nvidia-3090` - Recommended for this project
- `nvidia-4090` - Faster but more expensive
- `nvidia-a100` - Enterprise grade

## Step 4: Deploy to Nosana

### Option A: Using Nosana Dashboard (Recommended)

1. Go to [dashboard.nosana.com/deploy](https://dashboard.nosana.com/deploy)

2. Click "Expand" to open the job editor

3. Copy your job definition from `nos_job_def/nosana_mastra_job_definition.json`

4. Paste it into the editor

5. Select GPU type (nvidia-3090 recommended)

6. Click "Deploy"

7. Wait for deployment (usually 2-5 minutes)

8. Copy the deployment URL

### Option B: Using Nosana CLI

```bash
# Install Nosana CLI
npm install -g @nosana/cli

# Deploy
nosana job post \
  --file ./nos_job_def/nosana_mastra_job_definition.json \
  --market nvidia-3090 \
  --timeout 30
```

## Step 5: Verify Deployment

### 5.1 Check Status

In the Nosana Dashboard:
- View job status
- Check logs for errors
- Get the public URL

### 5.2 Test the Deployment

Visit your deployment URL and test:
- ✅ UI loads correctly
- ✅ Agent responds to messages
- ✅ Tables are created
- ✅ Migrations are generated
- ✅ Schema validation works

### 5.3 Take Screenshots

Capture proof of deployment:
- Dashboard showing running job
- Your application UI
- Agent creating a schema
- Generated migration

## Step 6: Document Deployment

### 6.1 Update PROJECT_OVERVIEW.md

Add your deployment details:
```markdown
## Deployment

Deployed on Nosana Network: https://your-deployment-url.nos.ci

Docker Image: https://hub.docker.com/r/yourusername/schema-designer

Deployment Date: [Date]
GPU Type: nvidia-3090
Status: ✅ Running
```

### 6.2 Create Video Demo

Record a 1-3 minute video showing:
1. Your deployed application (on Nosana URL)
2. Creating a database schema
3. Generating a migration
4. Validating the schema
5. Exporting the result

Upload to YouTube/Loom and add link to README.

## Troubleshooting

### Container Won't Start

Check logs in Nosana Dashboard:
```bash
# Common issues:
- Port conflicts
- Missing environment variables
- LLM model not loaded
```

### Agent Not Responding

Verify:
- Ollama is running inside container
- Model is loaded (qwen3:0.6b)
- Mastra server started on port 4111

### Out of Memory

If you see OOM errors:
- Use a smaller model (qwen3:0.6b instead of 8b)
- Request more GPU memory
- Optimize Docker image size

### Slow Response Times

Optimize:
- Use GPU acceleration
- Reduce model size
- Enable caching
- Use faster GPU type (4090 or A100)

## Cost Optimization

### Reduce Costs

1. **Use smaller models**: qwen3:0.6b vs 8b
2. **Shorter timeouts**: Set appropriate job timeout
3. **Efficient GPU usage**: Choose right GPU for your needs
4. **Batch operations**: Process multiple requests together

### Monitor Usage

Track in Nosana Dashboard:
- GPU hours used
- NOS tokens spent
- Job duration
- Resource utilization

## Production Best Practices

### Security

- ✅ Don't expose API keys in Docker image
- ✅ Use environment variables for secrets
- ✅ Validate user inputs
- ✅ Rate limit requests

### Performance

- ✅ Enable caching for repeated queries
- ✅ Optimize Docker image size
- ✅ Use CDN for static assets
- ✅ Monitor response times

### Reliability

- ✅ Add error handling
- ✅ Implement retry logic
- ✅ Log errors properly
- ✅ Set up health checks

### Monitoring

- ✅ Track agent response times
- ✅ Monitor error rates
- ✅ Check GPU utilization
- ✅ Review user feedback

## Next Steps

After successful deployment:

1. ✅ Share on social media with #NosanaAgentChallenge
2. ✅ Submit to SuperTeam challenge page
3. ✅ Gather user feedback
4. ✅ Iterate and improve
5. ✅ Consider adding more features

## Support

Need help with deployment?

- **Discord**: [Nosana Discord](https://nosana.com/discord) #builders-challenge
- **Docs**: [Nosana Documentation](https://docs.nosana.io)
- **CLI Help**: `nosana --help`

---

Good luck with your deployment! 🚀
