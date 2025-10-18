# 🗄️ Database Schema Designer

> AI-powered database schema designer built for Nosana Builders Challenge 3: Agents 102

[![Nosana](https://img.shields.io/badge/Nosana-Challenge%203-purple)](https://nosana.com)
[![Mastra](https://img.shields.io/badge/Mastra-AI%20Agent-blue)](https://mastra.ai)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)

## 🎯 What It Does

Design database schemas through natural language conversations with an AI agent. Create tables, define relationships, generate SQL migrations, validate schemas, and export in multiple formats - all by chatting!

**Try it live**: [Your Nosana Deployment URL]

## ✨ Key Features

- 🤖 **AI-Powered Design** - Chat naturally to design your database
- 📋 **Smart Table Creation** - 13 data types, constraints, and validation
- 🔗 **Relationship Management** - One-to-one, one-to-many, many-to-many
- 🔄 **Multi-Database Migrations** - PostgreSQL, MySQL, SQLite
- ✅ **Schema Validation** - Errors, warnings, and best practice suggestions
- 📤 **Multiple Export Formats** - JSON and SQL for different databases
- 🎨 **Real-Time Visualization** - Watch your schema come to life

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development (2 terminals)
pnpm dev:agent    # Terminal 1 - Mastra agent server
pnpm dev:ui       # Terminal 2 - Next.js UI

# Open http://localhost:3000
```

**First prompt to try:**
```
"Design a blog schema with users, posts, and comments"
```

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

## 💬 Example Usage

```
You: "Create a users table with email and password"
Agent: ✅ Created users table with 4 fields (id, email, password, timestamps)

You: "Add a posts table related to users"
Agent: ✅ Created posts table with user_id foreign key

You: "Generate a PostgreSQL migration"
Agent: 🔄 Here's your migration script...
[Shows complete SQL with CREATE TABLE and foreign keys]

You: "Validate my schema"
Agent: ✅ Schema is valid! 
💡 Suggestion: Consider adding indexes on foreign keys
```

## 🛠️ Tech Stack

- **Mastra AI** - Agent framework with memory
- **MCP** - 5 custom tools for schema operations
- **Next.js 15** - React framework with App Router
- **CopilotKit** - Real-time agent-UI synchronization
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling

## 📦 Project Structure

```
src/
├── app/
│   ├── api/copilotkit/     # CopilotKit API endpoint
│   ├── layout.tsx          # App layout with providers
│   └── page.tsx            # Main UI (400 lines)
└── mastra/
    ├── agents/             # Schema Designer Agent
    ├── tools/              # 5 custom MCP tools (387 lines)
    ├── mcp/                # MCP server configuration
    └── index.ts            # Mastra instance
```

## 🔧 MCP Tools

This project implements 5 custom MCP tools:

1. **createTableTool** - Create/update tables with fields and constraints
2. **addRelationTool** - Define relationships between tables
3. **generateMigrationTool** - Generate SQL migrations for different databases
4. **validateSchemaTool** - Validate schema integrity and best practices
5. **exportSchemaTool** - Export schemas in JSON or SQL formats

## 📚 Documentation

- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Detailed project description
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup guide
- [EXAMPLES.md](EXAMPLES.md) - Real-world usage scenarios
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical deep dive
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment to Nosana
- [FEATURES.md](FEATURES.md) - Complete feature list
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands and prompts

## 🚢 Deployment

### Docker

```bash
# Build image
docker build -t yourusername/schema-designer:latest .

# Test locally
docker run -p 3000:3000 yourusername/schema-designer:latest

# Push to Docker Hub
docker push yourusername/schema-designer:latest
```

### Nosana Network

1. Update `nos_job_def/nosana_mastra_job_definition.json` with your image
2. Deploy via [Nosana Dashboard](https://dashboard.nosana.com/deploy)
3. Select GPU type (nvidia-3090 recommended)

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete instructions.

## 🎥 Demo

**Video Demo**: [Your YouTube/Loom Link]

**Screenshots**:
- [Schema visualization]
- [Migration generation]
- [Validation results]

## 🏆 Challenge Requirements

✅ **5+ Custom MCP Tools** - Implemented 5 specialized tools  
✅ **Sophisticated Agent** - Context-aware with working memory  
✅ **Interactive Frontend** - Real-time, reactive UI  
✅ **Live Synchronization** - Agent actions update UI instantly  
✅ **Production Ready** - Fully functional and deployable  
✅ **Well Documented** - 7 comprehensive guides  

## 🎯 Use Cases

- **Rapid Prototyping** - Quick schema design for new projects
- **Learning Tool** - Understand database design best practices
- **Migration Generation** - Automate SQL creation
- **Team Collaboration** - Discuss and iterate on designs
- **Documentation** - Export and share schema designs

## 🤝 Contributing

This is a challenge submission, but feedback and suggestions are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [Nosana Network](https://nosana.com) for hosting the challenge
- [Mastra AI](https://mastra.ai) for the excellent framework
- [CopilotKit](https://copilotkit.ai) for seamless agent-UI integration

## 🔗 Links

- **Challenge**: [Nosana Builders Challenge 3](https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102)
- **Docker Image**: [Your Docker Hub Link]
- **Deployment**: [Your Nosana Deployment URL]
- **Social Post**: [Your X/Twitter/LinkedIn Post]

## 📊 Stats

- **Lines of Code**: 851
- **Custom Tools**: 5
- **Data Types**: 13
- **Databases**: 3
- **Documentation**: 7 guides

---

**Built with ❤️ for Nosana Builders Challenge 3: Agents 102**

#NosanaAgentChallenge | @nosana_ai
