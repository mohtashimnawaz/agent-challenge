import { MCPServer } from "@mastra/mcp"
import { 
  createTableTool, 
  addRelationTool, 
  generateMigrationTool, 
  validateSchemaTool,
  exportSchemaTool 
} from "../tools";
import { schemaAgent } from "../agents";

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
  agents: { schemaAgent }, // this agent will become tool "ask_schemaAgent"
});
