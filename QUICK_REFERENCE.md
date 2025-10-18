# 🚀 Quick Reference Card

Essential commands and prompts for the Database Schema Designer.

## 📦 Setup Commands

```bash
# Install dependencies
pnpm install

# Start development (2 terminals)
pnpm dev:agent    # Terminal 1 - Port 4111
pnpm dev:ui       # Terminal 2 - Port 3000

# Build for production
pnpm build

# Docker commands
docker build -t yourusername/schema-designer:latest .
docker run -p 3000:3000 yourusername/schema-designer:latest
docker push yourusername/schema-designer:latest
```

## 💬 Example Prompts

### Creating Tables
```
"Create a users table with id, email, password, and name"
"Add a products table with name, price, and description"
"Create a posts table with title, content, and author_id"
```

### Adding Relationships
```
"Add a one-to-many relationship from users to posts"
"Link products to categories"
"Create a many-to-many relationship between posts and tags"
```

### Generating Migrations
```
"Generate a PostgreSQL migration"
"Create a MySQL migration for my schema"
"Show me the SQLite migration"
```

### Validation
```
"Validate my schema"
"Check for any errors in my design"
"Are there any issues with my schema?"
```

### Export
```
"Export my schema as JSON"
"Export as PostgreSQL SQL"
"Show me the MySQL version"
```

### Complex Requests
```
"Design a blog schema with users, posts, comments, and tags"
"Create an e-commerce schema with products, orders, and customers"
"Build a social media schema with users, posts, likes, and follows"
```

## 🛠️ MCP Tools Reference

### 1. createTableTool
**Purpose**: Create/update tables  
**Input**: Table name, fields, constraints  
**Output**: Success status, table details  

### 2. addRelationTool
**Purpose**: Define relationships  
**Input**: Relation type, tables, fields  
**Output**: Success status, relation details  

### 3. generateMigrationTool
**Purpose**: Generate SQL migrations  
**Input**: Schema, database type  
**Output**: SQL migration script  

### 4. validateSchemaTool
**Purpose**: Validate schema  
**Input**: Complete schema  
**Output**: Errors, warnings, suggestions  

### 5. exportSchemaTool
**Purpose**: Export schema  
**Input**: Schema, format  
**Output**: Formatted export  

## 📊 Data Types

```
string      - VARCHAR(255)
text        - TEXT
integer     - INTEGER/INT
bigint      - BIGINT
float       - FLOAT/REAL
decimal     - DECIMAL(10,2)
boolean     - BOOLEAN/INTEGER
date        - DATE
datetime    - DATETIME/TIMESTAMP
timestamp   - TIMESTAMP
json        - JSON/JSONB/TEXT
uuid        - UUID/CHAR(36)/TEXT
enum        - ENUM/VARCHAR with CHECK
```

## 🔗 Relationship Types

```
one-to-one      - Single record to single record
one-to-many     - Single record to multiple records
many-to-many    - Multiple records to multiple records
```

## 🗄️ Database Support

```
PostgreSQL  - Full support with JSONB, UUID
MySQL       - Full support with JSON, ENUM
SQLite      - Full support with TEXT types
```

## 📁 File Structure

```
src/
├── app/
│   ├── api/copilotkit/route.ts  # CopilotKit endpoint
│   ├── layout.tsx               # App layout
│   └── page.tsx                 # Main UI (400 lines)
└── mastra/
    ├── agents/index.ts          # Schema Agent (64 lines)
    ├── tools/index.ts           # 5 MCP Tools (387 lines)
    ├── mcp/index.ts             # MCP Server
    └── index.ts                 # Mastra instance
```

## 🎨 UI Components

```
Tables Panel      - Left side, shows all tables
Relations Panel   - Right side, shows relationships
Chat Sidebar      - Right side, agent interface
Tool Result Cards - Inline feedback
Quick Actions     - Bottom buttons
```

## 🔧 Environment Variables

```env
# Ollama (Local)
OLLAMA_API_URL=http://127.0.0.1:11434/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b

# Nosana Shared
OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b

# OpenAI
OPENAI_API_KEY=your-key-here

# Debug
LOG_LEVEL=debug
```

## 🐛 Troubleshooting

```bash
# Port already in use
lsof -ti:3000 | xargs kill -9
lsof -ti:4111 | xargs kill -9

# Clear cache
rm -rf .next node_modules/.cache

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check Ollama
ollama list
ollama serve

# View logs
pnpm dev:agent --verbose
```

## 📚 Documentation Files

```
README.md                 - Main project README
PROJECT_OVERVIEW.md       - Project description
QUICKSTART.md            - 5-minute setup
EXAMPLES.md              - Usage examples
ARCHITECTURE.md          - Technical details
DEPLOYMENT.md            - Deployment guide
FEATURES.md              - Feature list
SUBMISSION_CHECKLIST.md  - Submission prep
SUMMARY.md               - Project summary
QUICK_REFERENCE.md       - This file
```

## 🔗 Important Links

```
Nosana Dashboard:  https://dashboard.nosana.com
Nosana Discord:    https://nosana.com/discord
SuperTeam:         https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102
Mastra Docs:       https://mastra.ai/en/docs
CopilotKit Docs:   https://docs.copilotkit.ai
```

## 🎯 Keyboard Shortcuts

```
Cmd/Ctrl + K       - Focus chat input
Cmd/Ctrl + Enter   - Send message
Cmd/Ctrl + C       - Copy SQL/JSON
Esc                - Close sidebar
```

## 📊 Performance Tips

```
- Use smaller models for faster responses
- Enable GPU acceleration in Nosana
- Cache frequently used schemas
- Batch multiple operations
- Use streaming for large outputs
```

## ✅ Pre-Deployment Checklist

```
□ All features tested
□ No TypeScript errors
□ Docker image built
□ Image pushed to Docker Hub
□ Job definition updated
□ Deployed to Nosana
□ Video demo recorded
□ Social media posted
□ Documentation complete
□ Submitted to SuperTeam
```

## 🏆 Judging Criteria

```
Innovation (25%)           - Originality, creativity
Technical (25%)            - Code quality, implementation
Nosana Integration (25%)   - Deployment, performance
Real-World Impact (25%)    - Usefulness, adoption potential
```

## 💡 Pro Tips

```
✓ Start with simple schemas, then add complexity
✓ Always validate before generating migrations
✓ Use descriptive table and field names
✓ Add timestamps to all tables
✓ Test with different database types
✓ Export schemas for backup
✓ Document your design decisions
```

## 🆘 Getting Help

```
Discord:  #builders-challenge channel
Docs:     Check QUICKSTART.md
Issues:   Check TROUBLESHOOTING section
Examples: See EXAMPLES.md
```

---

**Keep this card handy for quick reference during development!**
