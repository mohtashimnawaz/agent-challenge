# 🗄️ Database Schema Designer

## Project Description

An AI-powered database schema designer that helps developers design, validate, and generate database schemas through natural language conversations. Built for the Nosana Builders Challenge 3: Agents 102.

## What It Does

This developer tool allows you to:
- **Design database schemas** by chatting with an AI agent
- **Create tables** with fields, data types, and constraints
- **Define relationships** between tables (foreign keys)
- **Generate SQL migrations** for PostgreSQL, MySQL, and SQLite
- **Validate schemas** for errors and best practices
- **Export schemas** in JSON or SQL formats
- **Visualize your schema** in real-time as you build it

## Key Features

### 🤖 Intelligent Schema Agent
- Understands natural language requests
- Suggests appropriate data types and constraints
- Recommends best practices (primary keys, indexes, timestamps)
- Maintains context of your entire schema design

### 🛠️ 5 Custom MCP Tools
1. **createTableTool** - Create/update tables with fields and constraints
2. **addRelationTool** - Define relationships between tables
3. **generateMigrationTool** - Generate SQL migrations for different databases
4. **validateSchemaTool** - Validate schema integrity and best practices
5. **exportSchemaTool** - Export schemas in JSON or SQL formats

### 🎨 Real-Time UI
- Live visualization of tables and relationships
- Instant feedback on tool execution
- Syntax-highlighted SQL previews
- Copy-to-clipboard functionality
- Responsive, modern design

## Tech Stack

- **Mastra AI** - Agent framework with memory and tool orchestration
- **MCP (Model Context Protocol)** - Custom server implementation
- **Next.js 15** - React framework with App Router
- **CopilotKit** - Real-time agent-UI synchronization
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Ollama/OpenAI** - LLM providers (configurable)

## Example Usage

### Design a Blog Schema
```
User: "Design a blog schema with users, posts, and comments"

Agent: Creates:
- users table (id, email, password, created_at, updated_at)
- posts table (id, user_id, title, content, published_at, created_at, updated_at)
- comments table (id, post_id, user_id, content, created_at, updated_at)
- Relationships: users → posts, users → comments, posts → comments
```

### Generate Migration
```
User: "Generate a PostgreSQL migration"

Agent: Produces complete SQL with:
- CREATE TABLE statements
- Foreign key constraints
- Proper data types
- Timestamps
```

### Validate Schema
```
User: "Validate my schema"

Agent: Checks for:
- Missing primary keys
- Invalid field names
- Broken relationships
- Best practice violations
```

## Real-World Use Cases

1. **Rapid Prototyping** - Quickly design database schemas for new projects
2. **Learning Tool** - Understand database design best practices
3. **Migration Generation** - Generate SQL for different database systems
4. **Schema Documentation** - Export and share schema designs
5. **Team Collaboration** - Discuss and iterate on schema designs

## Why This Matters

Database schema design is a critical but often tedious task. This tool:
- **Saves time** by automating boilerplate SQL generation
- **Reduces errors** through validation and best practice suggestions
- **Improves learning** by explaining design decisions
- **Enhances collaboration** with visual representations
- **Supports multiple databases** with a single design

## Challenge Requirements Met

✅ **5+ Custom MCP Tools** - Implemented 5 specialized tools  
✅ **Sophisticated Agent** - Context-aware with working memory  
✅ **Interactive Frontend** - Real-time, reactive UI  
✅ **Live Synchronization** - Agent actions update UI instantly  
✅ **Production Ready** - Fully functional and deployable  
✅ **Well Documented** - Comprehensive documentation  

## Video Demo

[Link to video demo will be added here]

## Deployment

Deployed on Nosana Network: [Deployment URL will be added here]

Docker Image: [Docker Hub link will be added here]

## Social Media

[Link to social media post will be added here]

---

Built with ❤️ for Nosana Builders Challenge 3: Agents 102
