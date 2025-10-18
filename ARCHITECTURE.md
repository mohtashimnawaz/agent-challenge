# 🏗️ Technical Architecture

Deep dive into the Database Schema Designer architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (Port 3000)              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │ Schema View  │  │ Relations    │  │ Chat UI     │ │ │
│  │  │ (Tables)     │  │ View         │  │ (Sidebar)   │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket / HTTP
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    CopilotKit Runtime                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Real-time Agent-UI Synchronization           │ │
│  │  • State Management  • Tool Rendering  • Streaming     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Mastra Agent Server (Port 4111)             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Schema Designer Agent                │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │              Working Memory (LibSQL)             │ │ │
│  │  │  • Current Schema State                          │ │ │
│  │  │  • Tables & Relations                            │ │ │
│  │  │  • Last Action                                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MCP Server                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    5 Custom Tools                      │ │
│  │  • createTableTool      • validateSchemaTool          │ │
│  │  • addRelationTool      • exportSchemaTool            │ │
│  │  • generateMigrationTool                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LLM Provider                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Ollama (Local) OR OpenAI (Cloud)                     │ │
│  │  • Model: qwen3:8b / gpt-4o                           │ │
│  │  • Tool Calling Support                               │ │
│  │  • Streaming Responses                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend Layer (Next.js)

**Location**: `src/app/page.tsx`

**Responsibilities**:
- Render schema visualization
- Display tables and relationships
- Show tool execution results
- Provide chat interface

**Key Features**:
- Real-time updates via CopilotKit
- Generative UI for tool results
- Responsive design with Tailwind
- Copy-to-clipboard functionality

**State Management**:
```typescript
const { state, setState } = useCoAgent<AgentState>({
  name: "schemaAgent",
  initialState: {
    schema: { tables: [], relations: [] },
    lastAction: undefined,
  },
});
```

### 2. CopilotKit Integration

**Location**: `src/app/api/copilotkit/route.ts`, `src/app/layout.tsx`

**Responsibilities**:
- Bridge between UI and agent
- Manage WebSocket connections
- Stream agent responses
- Synchronize state

**Key Features**:
- Frontend actions (UI → Agent)
- Generative UI (Agent → UI)
- Shared state management
- Real-time streaming

**Configuration**:
```typescript
<CopilotKit runtimeUrl="/api/copilotkit" agent="schemaAgent">
  {children}
</CopilotKit>
```

### 3. Mastra Agent

**Location**: `src/mastra/agents/index.ts`

**Responsibilities**:
- Process user requests
- Orchestrate tool calls
- Maintain conversation context
- Manage working memory

**Agent Configuration**:
```typescript
export const schemaAgent = new Agent({
  name: "Schema Designer Agent",
  tools: { 
    createTableTool, 
    addRelationTool, 
    generateMigrationTool, 
    validateSchemaTool,
    exportSchemaTool 
  },
  model: ollama("qwen3:8b"),
  instructions: "Expert database schema designer...",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
})
```

**Memory Schema**:
```typescript
export const AgentState = z.object({
  schema: SchemaDesignSchema.default({ tables: [], relations: [] }),
  lastAction: z.string().optional(),
});
```

### 4. MCP Server

**Location**: `src/mastra/mcp/index.ts`

**Responsibilities**:
- Expose tools to agent
- Manage tool registry
- Handle tool execution

**Server Configuration**:
```typescript
export const server = new MCPServer({
  name: "Database Schema Designer Server",
  version: "1.0.0",
  tools: { 
    createTableTool, 
    addRelationTool, 
    generateMigrationTool, 
    validateSchemaTool,
    exportSchemaTool 
  },
  agents: { schemaAgent },
});
```

### 5. Custom Tools

**Location**: `src/mastra/tools/index.ts`

#### Tool 1: createTableTool

**Purpose**: Create or update database tables

**Input Schema**:
```typescript
{
  name: string,
  fields: Array<{
    name: string,
    type: FieldType,
    nullable: boolean,
    unique: boolean,
    primaryKey: boolean,
    autoIncrement: boolean,
    defaultValue?: string,
    length?: number,
    enumValues?: string[]
  }>,
  timestamps: boolean
}
```

**Output**:
```typescript
{
  success: boolean,
  table: Table,
  message: string
}
```

**Validation**:
- Table name format
- Field name uniqueness
- Enum value requirements
- Primary key presence

#### Tool 2: addRelationTool

**Purpose**: Define relationships between tables

**Input Schema**:
```typescript
{
  type: 'one-to-one' | 'one-to-many' | 'many-to-many',
  fromTable: string,
  toTable: string,
  fromField: string,
  toField: string,
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION',
  onUpdate: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
}
```

**Output**:
```typescript
{
  success: boolean,
  relation: Relation,
  message: string
}
```

#### Tool 3: generateMigrationTool

**Purpose**: Generate SQL migration scripts

**Input Schema**:
```typescript
{
  schema: SchemaDesign,
  database: 'postgresql' | 'mysql' | 'sqlite',
  migrationName?: string
}
```

**Output**:
```typescript
{
  success: boolean,
  sql: string,
  migrationName: string,
  database: string
}
```

**SQL Generation**:
- CREATE TABLE statements
- Foreign key constraints
- Data type mapping per database
- Timestamp fields

#### Tool 4: validateSchemaTool

**Purpose**: Validate schema integrity

**Input Schema**:
```typescript
{
  tables: Table[],
  relations: Relation[]
}
```

**Output**:
```typescript
{
  valid: boolean,
  errors: string[],
  warnings: string[],
  suggestions: string[]
}
```

**Validation Checks**:
- Table naming conventions
- Primary key presence
- Foreign key integrity
- Field name validity
- Relationship consistency

#### Tool 5: exportSchemaTool

**Purpose**: Export schema in various formats

**Input Schema**:
```typescript
{
  schema: SchemaDesign,
  format: 'json' | 'postgresql' | 'mysql' | 'sqlite'
}
```

**Output**:
```typescript
{
  success: boolean,
  content: string,
  format: string
}
```

## Data Flow

### User Creates a Table

1. **User Input**: "Create a users table with email and password"

2. **Frontend**: Sends message to CopilotKit

3. **CopilotKit**: Routes to Mastra agent

4. **Agent**: 
   - Processes natural language
   - Determines need for `createTableTool`
   - Constructs tool parameters

5. **Tool Execution**:
   ```typescript
   createTableTool.execute({
     name: "users",
     fields: [
       { name: "id", type: "integer", primaryKey: true, autoIncrement: true },
       { name: "email", type: "string", unique: true },
       { name: "password", type: "string" }
     ],
     timestamps: true
   })
   ```

6. **Tool Response**: Returns success with table details

7. **Agent**: Updates working memory with new table

8. **CopilotKit**: Streams response to frontend

9. **Frontend**: 
   - Renders tool result card
   - Updates schema visualization
   - Adds table to tables panel

### User Generates Migration

1. **User Input**: "Generate a PostgreSQL migration"

2. **Agent**: Retrieves current schema from memory

3. **Tool Execution**:
   ```typescript
   generateMigrationTool.execute({
     schema: state.schema,
     database: "postgresql",
     migrationName: "create_schema_1234567890"
   })
   ```

4. **SQL Generation**:
   - Iterates through tables
   - Generates CREATE TABLE statements
   - Adds foreign key constraints
   - Maps data types to PostgreSQL

5. **Frontend**: Renders migration card with SQL preview

## Type System

### Core Types

```typescript
// Field types supported
type FieldType = 
  | 'string' | 'text' | 'integer' | 'bigint' 
  | 'float' | 'decimal' | 'boolean' | 'date' 
  | 'datetime' | 'timestamp' | 'json' | 'uuid' | 'enum';

// Relationship types
type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

// Database types
type DatabaseType = 'postgresql' | 'mysql' | 'sqlite';

// Field definition
interface Field {
  name: string;
  type: FieldType;
  nullable: boolean;
  unique: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  defaultValue?: string;
  length?: number;
  enumValues?: string[];
}

// Table definition
interface Table {
  name: string;
  fields: Field[];
  timestamps: boolean;
}

// Relation definition
interface Relation {
  type: RelationType;
  fromTable: string;
  toTable: string;
  fromField: string;
  toField: string;
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

// Complete schema
interface SchemaDesign {
  tables: Table[];
  relations: Relation[];
}
```

## Performance Considerations

### Memory Management

- **LibSQL in-memory storage**: Fast, ephemeral state
- **Working memory**: Persists during session
- **State synchronization**: Efficient delta updates

### Optimization Strategies

1. **Lazy Loading**: Load schema components on demand
2. **Debouncing**: Reduce unnecessary re-renders
3. **Memoization**: Cache computed values
4. **Streaming**: Progressive response rendering

### Scalability

- **Stateless tools**: Easy to scale horizontally
- **Modular architecture**: Add tools without refactoring
- **Database-agnostic**: Support multiple SQL dialects

## Security Considerations

### Input Validation

- Sanitize table/field names
- Validate SQL injection risks
- Check enum values
- Limit schema complexity

### Best Practices

- No direct SQL execution
- Generate safe migrations
- Validate all user inputs
- Use parameterized queries

## Extension Points

### Adding New Tools

1. Define tool in `src/mastra/tools/index.ts`
2. Add to MCP server in `src/mastra/mcp/index.ts`
3. Include in agent tools in `src/mastra/agents/index.ts`
4. Add frontend rendering in `src/app/page.tsx`

### Supporting New Databases

1. Add database type to enum
2. Implement type mapping function
3. Add SQL generation logic
4. Test with sample schemas

### Enhancing UI

1. Add new components in `src/app/page.tsx`
2. Create generative UI for new tools
3. Update state management
4. Style with Tailwind

---

This architecture provides a solid foundation for building sophisticated database design tools with AI assistance.
