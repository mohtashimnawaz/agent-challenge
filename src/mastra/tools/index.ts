import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ============================================
// DATABASE SCHEMA DESIGNER TOOLS
// ============================================

// Schema Types
export const FieldTypeEnum = z.enum([
  'string', 'text', 'integer', 'bigint', 'float', 'decimal',
  'boolean', 'date', 'datetime', 'timestamp', 'json', 'uuid', 'enum'
]);

export const RelationTypeEnum = z.enum(['one-to-one', 'one-to-many', 'many-to-many']);

export const DatabaseTypeEnum = z.enum(['postgresql', 'mysql', 'sqlite']);

const FieldSchema = z.object({
  name: z.string(),
  type: FieldTypeEnum,
  nullable: z.boolean().default(false),
  unique: z.boolean().default(false),
  primaryKey: z.boolean().default(false),
  autoIncrement: z.boolean().default(false),
  defaultValue: z.string().optional(),
  length: z.number().optional(),
  enumValues: z.array(z.string()).optional(),
});

const TableSchema = z.object({
  name: z.string(),
  fields: z.array(FieldSchema),
  timestamps: z.boolean().default(true),
});

const RelationSchema = z.object({
  type: RelationTypeEnum,
  fromTable: z.string(),
  toTable: z.string(),
  fromField: z.string(),
  toField: z.string(),
  onDelete: z.enum(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION']).default('CASCADE'),
  onUpdate: z.enum(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION']).default('CASCADE'),
});

export const SchemaDesignSchema = z.object({
  tables: z.array(TableSchema),
  relations: z.array(RelationSchema).default([]),
});

export type SchemaDesign = z.infer<typeof SchemaDesignSchema>;
export type Table = z.infer<typeof TableSchema>;
export type Field = z.infer<typeof FieldSchema>;
export type Relation = z.infer<typeof RelationSchema>;

// Tool 1: Create/Update Table
export const createTableTool = createTool({
  id: 'create-table',
  description: 'Create or update a database table with fields and constraints',
  inputSchema: TableSchema,
  outputSchema: z.object({
    success: z.boolean(),
    table: TableSchema,
    message: z.string(),
  }),
  execute: async ({ context }) => {
    // Validate table structure
    const errors = validateTable(context);
    if (errors.length > 0) {
      return {
        success: false,
        table: context,
        message: `Validation errors: ${errors.join(', ')}`,
      };
    }

    return {
      success: true,
      table: context,
      message: `Table '${context.name}' created successfully with ${context.fields.length} fields`,
    };
  },
});

// Tool 2: Add Relationship
export const addRelationTool = createTool({
  id: 'add-relation',
  description: 'Add a relationship between two tables (foreign key constraint)',
  inputSchema: RelationSchema,
  outputSchema: z.object({
    success: z.boolean(),
    relation: RelationSchema,
    message: z.string(),
  }),
  execute: async ({ context }) => {
    return {
      success: true,
      relation: context,
      message: `${context.type} relationship added from ${context.fromTable}.${context.fromField} to ${context.toTable}.${context.toField}`,
    };
  },
});

// Tool 3: Generate Migration
export const generateMigrationTool = createTool({
  id: 'generate-migration',
  description: 'Generate SQL migration script for the schema design',
  inputSchema: z.object({
    schema: SchemaDesignSchema,
    database: DatabaseTypeEnum,
    migrationName: z.string().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    sql: z.string(),
    migrationName: z.string(),
    database: z.string(),
  }),
  execute: async ({ context }) => {
    const sql = generateSQL(context.schema, context.database);
    const migrationName = context.migrationName || `create_schema_${Date.now()}`;
    
    return {
      success: true,
      sql,
      migrationName,
      database: context.database,
    };
  },
});

// Tool 4: Validate Schema
export const validateSchemaTool = createTool({
  id: 'validate-schema',
  description: 'Validate the entire schema design for errors and best practices',
  inputSchema: SchemaDesignSchema,
  outputSchema: z.object({
    valid: z.boolean(),
    errors: z.array(z.string()),
    warnings: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate each table
    context.tables.forEach(table => {
      const tableErrors = validateTable(table);
      errors.push(...tableErrors);

      // Check for primary key
      const hasPrimaryKey = table.fields.some(f => f.primaryKey);
      if (!hasPrimaryKey) {
        warnings.push(`Table '${table.name}' has no primary key`);
      }

      // Check for indexes on foreign keys
      if (!table.timestamps) {
        suggestions.push(`Consider adding timestamps to '${table.name}'`);
      }
    });

    // Validate relations
    context.relations.forEach(relation => {
      const fromTable = context.tables.find(t => t.name === relation.fromTable);
      const toTable = context.tables.find(t => t.name === relation.toTable);

      if (!fromTable) {
        errors.push(`Relation references non-existent table: ${relation.fromTable}`);
      }
      if (!toTable) {
        errors.push(`Relation references non-existent table: ${relation.toTable}`);
      }

      if (fromTable && !fromTable.fields.find(f => f.name === relation.fromField)) {
        errors.push(`Field '${relation.fromField}' not found in table '${relation.fromTable}'`);
      }
      if (toTable && !toTable.fields.find(f => f.name === relation.toField)) {
        errors.push(`Field '${relation.toField}' not found in table '${relation.toTable}'`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  },
});

// Tool 5: Export Schema
export const exportSchemaTool = createTool({
  id: 'export-schema',
  description: 'Export schema design as JSON or SQL for different databases',
  inputSchema: z.object({
    schema: SchemaDesignSchema,
    format: z.enum(['json', 'postgresql', 'mysql', 'sqlite']),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    content: z.string(),
    format: z.string(),
  }),
  execute: async ({ context }) => {
    let content: string;

    if (context.format === 'json') {
      content = JSON.stringify(context.schema, null, 2);
    } else {
      content = generateSQL(context.schema, context.format as 'postgresql' | 'mysql' | 'sqlite');
    }

    return {
      success: true,
      content,
      format: context.format,
    };
  },
});

// Helper Functions
function validateTable(table: Table): string[] {
  const errors: string[] = [];

  if (!table.name || table.name.trim() === '') {
    errors.push('Table name is required');
  }

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table.name)) {
    errors.push(`Invalid table name '${table.name}'. Use only letters, numbers, and underscores.`);
  }

  if (table.fields.length === 0) {
    errors.push('Table must have at least one field');
  }

  const fieldNames = new Set<string>();
  table.fields.forEach(field => {
    if (fieldNames.has(field.name)) {
      errors.push(`Duplicate field name: ${field.name}`);
    }
    fieldNames.add(field.name);

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)) {
      errors.push(`Invalid field name '${field.name}'`);
    }

    if (field.type === 'enum' && (!field.enumValues || field.enumValues.length === 0)) {
      errors.push(`Enum field '${field.name}' must have enumValues`);
    }
  });

  return errors;
}

function generateSQL(schema: SchemaDesign, database: 'postgresql' | 'mysql' | 'sqlite'): string {
  let sql = `-- Migration generated for ${database}\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

  // Create tables
  schema.tables.forEach(table => {
    sql += generateTableSQL(table, database);
    sql += '\n\n';
  });

  // Add foreign keys
  schema.relations.forEach(relation => {
    sql += generateRelationSQL(relation, database);
    sql += '\n';
  });

  return sql;
}

function generateTableSQL(table: Table, database: 'postgresql' | 'mysql' | 'sqlite'): string {
  let sql = `CREATE TABLE ${table.name} (\n`;
  
  const columns: string[] = [];

  table.fields.forEach(field => {
    let columnDef = `  ${field.name} ${mapFieldType(field, database)}`;
    
    if (field.primaryKey) {
      columnDef += ' PRIMARY KEY';
    }
    if (field.autoIncrement) {
      if (database === 'postgresql') {
        columnDef = `  ${field.name} SERIAL PRIMARY KEY`;
      } else if (database === 'mysql') {
        columnDef += ' AUTO_INCREMENT';
      } else {
        columnDef += ' AUTOINCREMENT';
      }
    }
    if (!field.nullable && !field.primaryKey) {
      columnDef += ' NOT NULL';
    }
    if (field.unique && !field.primaryKey) {
      columnDef += ' UNIQUE';
    }
    if (field.defaultValue) {
      columnDef += ` DEFAULT ${field.defaultValue}`;
    }

    columns.push(columnDef);
  });

  if (table.timestamps) {
    if (database === 'postgresql') {
      columns.push('  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      columns.push('  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    } else {
      columns.push('  created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
      columns.push('  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    }
  }

  sql += columns.join(',\n');
  sql += '\n);';

  return sql;
}

function generateRelationSQL(relation: Relation, database: 'postgresql' | 'mysql' | 'sqlite'): string {
  const constraintName = `fk_${relation.fromTable}_${relation.toTable}`;
  
  return `ALTER TABLE ${relation.fromTable}
  ADD CONSTRAINT ${constraintName}
  FOREIGN KEY (${relation.fromField})
  REFERENCES ${relation.toTable}(${relation.toField})
  ON DELETE ${relation.onDelete}
  ON UPDATE ${relation.onUpdate};`;
}

function mapFieldType(field: Field, database: 'postgresql' | 'mysql' | 'sqlite'): string {
  const typeMap: Record<string, Record<string, string>> = {
    postgresql: {
      string: field.length ? `VARCHAR(${field.length})` : 'VARCHAR(255)',
      text: 'TEXT',
      integer: 'INTEGER',
      bigint: 'BIGINT',
      float: 'REAL',
      decimal: 'DECIMAL(10,2)',
      boolean: 'BOOLEAN',
      date: 'DATE',
      datetime: 'TIMESTAMP',
      timestamp: 'TIMESTAMP',
      json: 'JSONB',
      uuid: 'UUID',
      enum: field.enumValues ? `VARCHAR(50) CHECK (${field.name} IN (${field.enumValues.map(v => `'${v}'`).join(', ')}))` : 'VARCHAR(50)',
    },
    mysql: {
      string: field.length ? `VARCHAR(${field.length})` : 'VARCHAR(255)',
      text: 'TEXT',
      integer: 'INT',
      bigint: 'BIGINT',
      float: 'FLOAT',
      decimal: 'DECIMAL(10,2)',
      boolean: 'BOOLEAN',
      date: 'DATE',
      datetime: 'DATETIME',
      timestamp: 'TIMESTAMP',
      json: 'JSON',
      uuid: 'CHAR(36)',
      enum: field.enumValues ? `ENUM(${field.enumValues.map(v => `'${v}'`).join(', ')})` : 'VARCHAR(50)',
    },
    sqlite: {
      string: 'TEXT',
      text: 'TEXT',
      integer: 'INTEGER',
      bigint: 'INTEGER',
      float: 'REAL',
      decimal: 'REAL',
      boolean: 'INTEGER',
      date: 'TEXT',
      datetime: 'TEXT',
      timestamp: 'TEXT',
      json: 'TEXT',
      uuid: 'TEXT',
      enum: 'TEXT',
    },
  };

  return typeMap[database][field.type] || 'TEXT';
}