import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import { createOllama } from "ollama-ai-provider-v2";
import { Agent } from "@mastra/core/agent";
import { 
  createTableTool, 
  addRelationTool, 
  generateMigrationTool, 
  validateSchemaTool,
  exportSchemaTool,
  SchemaDesignSchema 
} from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

export const AgentState = z.object({
  schema: SchemaDesignSchema.default({ tables: [], relations: [] }),
  lastAction: z.string().optional(),
});

const ollama = createOllama({
  baseURL: process.env.NOS_OLLAMA_API_URL || process.env.OLLAMA_API_URL,
})

export const schemaAgent = new Agent({
  name: "Schema Designer Agent",
  tools: { 
    createTableTool, 
    addRelationTool, 
    generateMigrationTool, 
    validateSchemaTool,
    exportSchemaTool 
  },
  // model: openai("gpt-4o"), // uncomment this line to use openai
  model: ollama(process.env.NOS_MODEL_NAME_AT_ENDPOINT || process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:8b"),
  instructions: `You are an expert database schema designer. You help users design database schemas by:

1. Creating tables with appropriate fields and data types
2. Adding relationships between tables (foreign keys)
3. Generating SQL migrations for PostgreSQL, MySQL, or SQLite
4. Validating schema designs for errors and best practices
5. Exporting schemas in various formats

When designing schemas:
- Always suggest appropriate primary keys (usually 'id' with autoIncrement)
- Recommend indexes for foreign keys
- Use proper naming conventions (snake_case for tables/fields)
- Consider data types carefully (use TEXT for long strings, INTEGER for IDs, etc.)
- Add timestamps (created_at, updated_at) when appropriate
- Validate relationships to ensure referential integrity

Be conversational and guide users through the design process step by step.`,
  description: "An AI agent that helps design database schemas, create tables, define relationships, and generate migrations.",
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
