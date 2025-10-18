# 🚀 Quick Start Guide

Get your Database Schema Designer running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Ollama installed (optional, for local LLM) OR OpenAI API key

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
pnpm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and choose your LLM provider:

**Option A: Use Nosana Shared Endpoint (Easiest)**
```env
OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
```

**Option B: Use Local Ollama**
```bash
# In a separate terminal
ollama pull qwen3:8b
ollama serve
```
```env
OLLAMA_API_URL=http://127.0.0.1:11434/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
```

**Option C: Use OpenAI**
```env
OPENAI_API_KEY=your-api-key-here
```
Then uncomment the OpenAI line in `src/mastra/agents/index.ts`

### 3. Start Development Servers

Open two terminal windows:

**Terminal 1: Start Mastra Agent**
```bash
pnpm dev:agent
```
Wait for: `✓ Mastra server running on http://localhost:4111`

**Terminal 2: Start Next.js UI**
```bash
pnpm dev:ui
```
Wait for: `✓ Ready on http://localhost:3000`

### 4. Open the Application

Visit [http://localhost:3000](http://localhost:3000)

## Try It Out!

### Example Prompts

**Create a Simple Table:**
```
"Create a users table with id, email, password, and name fields"
```

**Design a Complete Schema:**
```
"Design a blog schema with users, posts, comments, and tags"
```

**Add Relationships:**
```
"Add a one-to-many relationship from users to posts"
```

**Generate Migration:**
```
"Generate a PostgreSQL migration for my current schema"
```

**Validate Schema:**
```
"Validate my schema and check for any issues"
```

**Export Schema:**
```
"Export my schema as JSON"
```

## What You'll See

1. **Chat Interface** - Talk to the AI agent on the right sidebar
2. **Tables Panel** - See your tables appear in real-time on the left
3. **Relations Panel** - View relationships between tables on the right
4. **Tool Results** - Watch as the agent uses tools to build your schema
5. **Quick Actions** - Buttons for common operations at the bottom

## Troubleshooting

### Agent Not Responding
- Check that both servers are running (agent on :4111, UI on :3000)
- Verify your LLM endpoint is accessible
- Check browser console for errors

### Connection Errors
- Ensure `.env` file is configured correctly
- For Ollama: verify it's running with `ollama list`
- For OpenAI: check your API key is valid

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:4111 | xargs kill -9
```

## Next Steps

1. **Explore the Code** - Check out `src/mastra/tools/index.ts` for tool implementations
2. **Customize the Agent** - Modify `src/mastra/agents/index.ts` to change behavior
3. **Enhance the UI** - Update `src/app/page.tsx` to add new features
4. **Add More Tools** - Create additional MCP tools for more functionality

## Development Tips

- **Hot Reload**: Both servers support hot reload - just save your files
- **Agent Playground**: Visit http://localhost:4111 to test the agent directly
- **Debug Mode**: Set `LOG_LEVEL=debug` in `.env` for detailed logs
- **Type Safety**: TypeScript will catch errors before runtime

## Ready to Deploy?

See the main README for deployment instructions to Nosana Network!

---

Need help? Join the [Nosana Discord](https://nosana.com/discord) #builders-challenge channel!
