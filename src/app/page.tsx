"use client";

import { useCoAgent, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import React, { useState } from "react";
import { AgentState as AgentStateSchema } from "@/mastra/agents";
import { z } from "zod";
import type { SchemaDesign, Table, Relation } from "@/mastra/tools";

type AgentState = z.infer<typeof AgentStateSchema>;

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");

  useCopilotAction({
    name: "setThemeColor",
    parameters: [{
      name: "themeColor",
      description: "The theme color to set. Make sure to pick nice colors.",
      required: true,
    }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  return (
    <main style={{ "--copilot-kit-primary-color": themeColor } as CopilotKitCSSProperties}>
      <SchemaDesignerContent themeColor={themeColor} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Schema Designer AI",
          initial: "👋 Welcome to the Database Schema Designer!\n\nI can help you design database schemas with:\n\n**Examples to try:**\n- \"Create a users table with email and password\"\n- \"Add a posts table related to users\"\n- \"Generate a PostgreSQL migration\"\n- \"Design a blog schema with users, posts, and comments\"\n- \"Validate my current schema\"\n- \"Export schema as JSON\"\n\nLet's build something great together!"
        }}
      />
    </main>
  );
}

function SchemaDesignerContent({ themeColor }: { themeColor: string }) {
  const { state, setState } = useCoAgent<AgentState>({
    name: "schemaAgent",
    initialState: {
      schema: { tables: [], relations: [] },
      lastAction: undefined,
    },
  });

  // Generative UI for tool calls
  useCopilotAction({
    name: "createTableTool",
    available: "frontend",
    render: ({ args, result, status }) => {
      return <ToolResultCard
        title="Table Created"
        icon="📋"
        themeColor={themeColor}
        status={status}
        result={result}
      />
    },
  });

  useCopilotAction({
    name: "addRelationTool",
    available: "frontend",
    render: ({ args, result, status }) => {
      return <ToolResultCard
        title="Relation Added"
        icon="🔗"
        themeColor={themeColor}
        status={status}
        result={result}
      />
    },
  });

  useCopilotAction({
    name: "generateMigrationTool",
    available: "frontend",
    render: ({ args, result, status }) => {
      return <MigrationCard
        themeColor={themeColor}
        status={status}
        result={result}
      />
    },
  });

  useCopilotAction({
    name: "validateSchemaTool",
    available: "frontend",
    render: ({ args, result, status }) => {
      return <ValidationCard
        themeColor={themeColor}
        status={status}
        result={result}
      />
    },
  });

  useCopilotAction({
    name: "exportSchemaTool",
    available: "frontend",
    render: ({ args, result, status }) => {
      return <ExportCard
        themeColor={themeColor}
        status={status}
        result={result}
      />
    },
  });

  useCopilotAction({
    name: "updateWorkingMemory",
    available: "frontend",
    render: ({ args }) => {
      return <div style={{ backgroundColor: themeColor }} className="rounded-2xl max-w-md w-full text-white p-4 animate-fade-in">
        <p>✨ Schema updated</p>
      </div>
    },
  });

  const schema = state.schema || { tables: [], relations: [] };
  const hasSchema = schema.tables.length > 0 || schema.relations.length > 0;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-2 animate-bounce-slow">🗄️</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400">
            Database Schema Designer
          </h1>
          <p className="text-indigo-200 text-base md:text-lg mb-4">Design, validate, and generate database schemas with AI</p>
          
          {/* Stats Bar */}
          {hasSchema && (
            <div className="flex justify-center gap-4 mt-6">
              <StatBadge icon="📋" label="Tables" value={schema.tables.length} />
              <StatBadge icon="🔗" label="Relations" value={schema.relations.length} />
              <StatBadge 
                icon="📊" 
                label="Fields" 
                value={schema.tables.reduce((sum, t) => sum + t.fields.length, 0)} 
              />
            </div>
          )}
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Tables Section */}
          <div className="bg-gradient-to-br from-slate-900/90 to-indigo-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                📋 Tables
                <span className="text-sm font-normal bg-indigo-500/40 px-3 py-1 rounded-full border border-indigo-400/30">
                  {schema.tables.length}
                </span>
              </h2>
              {schema.tables.length > 0 && (
                <button 
                  onClick={() => setState({ ...state, schema: { ...schema, tables: [] } })}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {schema.tables.length === 0 ? (
                <EmptyState 
                  icon="📋"
                  title="No tables yet"
                  description="Ask the AI to create your first table!"
                  suggestions={[
                    "Create a users table",
                    "Design a blog schema",
                    "Add a products table"
                  ]}
                />
              ) : (
                schema.tables.map((table, idx) => (
                  <TableCard key={idx} table={table} themeColor={themeColor} index={idx} />
                ))
              )}
            </div>
          </div>

          {/* Relations Section */}
          <div className="bg-gradient-to-br from-slate-900/90 to-cyan-900/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                🔗 Relations
                <span className="text-sm font-normal bg-cyan-500/40 px-3 py-1 rounded-full border border-cyan-400/30">
                  {schema.relations.length}
                </span>
              </h2>
              {schema.relations.length > 0 && (
                <button 
                  onClick={() => setState({ ...state, schema: { ...schema, relations: [] } })}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {schema.relations.length === 0 ? (
                <EmptyState 
                  icon="🔗"
                  title="No relations yet"
                  description="Connect your tables with relationships!"
                  suggestions={[
                    "Add a foreign key",
                    "Create a one-to-many relation",
                    "Link tables together"
                  ]}
                />
              ) : (
                schema.relations.map((relation, idx) => (
                  <RelationCard key={idx} relation={relation} themeColor={themeColor} index={idx} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-slate-900/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 shadow-2xl border border-indigo-500/30">
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
            💡 Quick Actions
            <span className="text-xs font-normal text-indigo-300">Try these commands</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <QuickActionButton icon="✅" label="Validate Schema" prompt="Validate my schema" />
            <QuickActionButton icon="🔄" label="Generate Migration" prompt="Generate a PostgreSQL migration" />
            <QuickActionButton icon="📤" label="Export Schema" prompt="Export my schema as JSON" />
            <QuickActionButton icon="🎨" label="Change Theme" prompt="Set the theme to blue" />
          </div>
        </div>

        {/* Example Prompts */}
        {!hasSchema && (
          <div className="mt-6 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-indigo-400/40 animate-fade-in shadow-lg">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              🚀 Get Started
            </h3>
            <p className="text-indigo-200 mb-4">Try these example prompts to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ExamplePrompt 
                icon="📝"
                text="Create a users table with email and password"
              />
              <ExamplePrompt 
                icon="🏗️"
                text="Design a blog schema with users, posts, and comments"
              />
              <ExamplePrompt 
                icon="🛒"
                text="Build an e-commerce schema with products and orders"
              />
              <ExamplePrompt 
                icon="📱"
                text="Create a social media schema with posts and likes"
              />
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}

// UI Components
function StatBadge({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-indigo-400/30 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-indigo-200">{label}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, suggestions }: { 
  icon: string; 
  title: string; 
  description: string;
  suggestions: string[];
}) {
  return (
    <div className="text-center py-12 text-indigo-200 animate-fade-in">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <p className="text-lg font-semibold mb-2 text-white">{title}</p>
      <p className="text-sm mb-4">{description}</p>
      <div className="space-y-2">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="text-xs bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-3 py-2 inline-block mx-1 hover:bg-indigo-500/20 transition-colors">
            💡 {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamplePrompt({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 hover:from-indigo-500/20 hover:to-cyan-500/20 rounded-xl p-4 cursor-pointer transition-all group border border-indigo-400/30 hover:border-cyan-400/50 shadow-md hover:shadow-lg">
      <div className="flex items-start gap-3">
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        <p className="text-sm text-indigo-100 group-hover:text-white transition-colors">
          "{text}"
        </p>
      </div>
    </div>
  );
}

function TableCard({ table, themeColor, index }: { table: Table; themeColor: string; index: number }) {
  return (
    <div 
      className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-xl p-4 hover:from-indigo-800/50 hover:to-indigo-700/30 transition-all border border-indigo-500/30 hover:border-indigo-400/60 hover:shadow-xl animate-fade-in backdrop-blur-sm"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          📋 {table.name}
        </h3>
        <div className="flex gap-1">
          {table.timestamps && (
            <span className="text-xs bg-indigo-500/40 border border-indigo-400/30 px-2 py-1 rounded-full">⏰ timestamps</span>
          )}
          <span className="text-xs bg-cyan-500/30 border border-cyan-400/30 px-2 py-1 rounded-full">
            {table.fields.length} fields
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {table.fields.map((field, idx) => (
          <div key={idx} className="bg-slate-900/50 hover:bg-slate-800/60 rounded-lg p-3 text-sm transition-all group border border-indigo-500/20 hover:border-indigo-400/40">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-mono font-semibold group-hover:text-cyan-300 transition-colors">
                {field.name}
              </span>
              <span className="text-indigo-300 text-xs font-mono bg-indigo-500/30 border border-indigo-400/30 px-2 py-1 rounded">
                {field.type}
              </span>
            </div>
            {(field.primaryKey || field.unique || field.nullable || field.autoIncrement) && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {field.primaryKey && <Badge color="green">🔑 PK</Badge>}
                {field.unique && <Badge color="blue">⭐ UNIQUE</Badge>}
                {field.nullable && <Badge color="gray">∅ NULL</Badge>}
                {field.autoIncrement && <Badge color="yellow">⚡ AUTO</Badge>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationCard({ relation, themeColor, index }: { relation: Relation; themeColor: string; index: number }) {
  const relationTypeColors = {
    'one-to-one': 'bg-blue-500/40 text-blue-200 border-blue-400/30',
    'one-to-many': 'bg-emerald-500/40 text-emerald-200 border-emerald-400/30',
    'many-to-many': 'bg-violet-500/40 text-violet-200 border-violet-400/30',
  };

  return (
    <div 
      className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl p-4 hover:from-cyan-800/50 hover:to-cyan-700/30 transition-all border border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-xl animate-fade-in backdrop-blur-sm"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${relationTypeColors[relation.type]}`}>
            {relation.type}
          </span>
        </div>
      </div>
      <div className="text-white text-sm space-y-2">
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-3">
          <div className="text-xs text-cyan-300 mb-1">From</div>
          <div className="font-mono font-semibold">
            {relation.fromTable}<span className="text-cyan-400">.{relation.fromField}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-block bg-cyan-500/30 border border-cyan-400/30 rounded-full px-3 py-1">
            <span className="text-cyan-300 text-lg">↓</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-3">
          <div className="text-xs text-cyan-300 mb-1">To</div>
          <div className="font-mono font-semibold">
            {relation.toTable}<span className="text-cyan-400">.{relation.toField}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3 text-xs flex-wrap">
          <span className="bg-red-500/30 border border-red-400/30 text-red-200 px-2 py-1 rounded">
            🗑️ {relation.onDelete}
          </span>
          <span className="bg-blue-500/30 border border-blue-400/30 text-blue-200 px-2 py-1 rounded">
            🔄 {relation.onUpdate}
          </span>
        </div>
      </div>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    green: "bg-green-500/30 text-green-200",
    blue: "bg-blue-500/30 text-blue-200",
    gray: "bg-gray-500/30 text-gray-200",
    yellow: "bg-yellow-500/30 text-yellow-200",
  };
  return (
    <span className={`${colors[color]} px-2 py-0.5 rounded text-xs`}>
      {children}
    </span>
  );
}

function QuickActionButton({ icon, label, prompt }: { icon: string; label: string; prompt?: string }) {
  return (
    <button 
      className="bg-white/10 hover:bg-white/20 rounded-lg p-3 text-white transition-all text-center group border border-white/10 hover:border-purple-400/50 hover:shadow-lg active:scale-95"
      title={prompt}
    >
      <div className="text-2xl md:text-3xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-xs md:text-sm font-medium">{label}</div>
    </button>
  );
}

function ToolResultCard({ 
  title, 
  icon, 
  themeColor, 
  status, 
  result 
}: { 
  title: string; 
  icon: string; 
  themeColor: string; 
  status: string; 
  result: any;
}) {
  if (status !== "complete" || !result) {
    return (
      <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-md w-full text-white shadow-lg border border-white/20 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚙️</div>
          <p className="animate-pulse">{icon} {title}...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-md w-full text-white shadow-lg border border-white/20 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="font-bold text-lg">{title}</span>
      </div>
      {result?.success && result?.message && (
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm flex items-start gap-2">
            <span className="text-xl">✅</span>
            <span>{result.message}</span>
          </p>
        </div>
      )}
      {result?.success === false && result?.message && (
        <div className="bg-red-500/20 rounded-lg p-3">
          <p className="text-sm flex items-start gap-2">
            <span className="text-xl">❌</span>
            <span>{result.message}</span>
          </p>
        </div>
      )}
      {!result?.message && (
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm flex items-start gap-2">
            <span className="text-xl">✅</span>
            <span>{title} completed successfully</span>
          </p>
        </div>
      )}
    </div>
  );
}

function MigrationCard({ themeColor, status, result }: { themeColor: string; status: string; result: any }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status !== "complete" || !result) {
    return (
      <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-2xl w-full text-white shadow-lg border border-white/20 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚙️</div>
          <p className="animate-pulse">🔄 Generating migration...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-2xl w-full text-white shadow-lg border border-white/20 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          🔄 Migration
          <span className="text-sm font-normal text-white/80">
            {result?.migrationName || 'Schema Migration'}
          </span>
        </h3>
        <span className="text-xs bg-white/30 px-3 py-1 rounded-full font-semibold uppercase">
          {result?.database || 'SQL'}
        </span>
      </div>
      <div className="relative">
        <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs border border-white/10 max-h-96">
          <code className="text-green-300">{result?.sql || 'No SQL generated'}</code>
        </pre>
        {result?.sql && (
          <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-xs transition-all flex items-center gap-2 border border-white/20"
          >
            {copied ? (
              <>
                <span>✅</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy SQL</span>
              </>
            )}
          </button>
        )}
      </div>
      {result?.sql && (
        <div className="mt-3 text-xs text-white/70 flex items-center gap-2">
          <span>💡</span>
          <span>Click the copy button to use this migration in your project</span>
        </div>
      )}
    </div>
  );
}

function ValidationCard({ themeColor, status, result }: { themeColor: string; status: string; result: any }) {
  if (status !== "complete" || !result) {
    return (
      <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-md w-full text-white shadow-lg border border-white/20 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚙️</div>
          <p className="animate-pulse">✅ Validating schema...</p>
        </div>
      </div>
    );
  }

  const totalIssues = (result?.errors?.length || 0) + (result?.warnings?.length || 0);

  return (
    <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-md w-full text-white shadow-lg border border-white/20 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          {result?.valid ? (
            <>
              <span className="text-2xl">✅</span>
              <span>Schema Valid</span>
            </>
          ) : (
            <>
              <span className="text-2xl">❌</span>
              <span>Schema Invalid</span>
            </>
          )}
        </h3>
        {totalIssues > 0 && (
          <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-semibold">
            {totalIssues} issue{totalIssues !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {result?.errors?.length > 0 && (
          <div>
            <p className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span>🚫</span>
              <span>Errors ({result.errors.length})</span>
            </p>
            <ul className="text-sm space-y-2">
              {result.errors.map((err: string, idx: number) => (
                <li key={idx} className="bg-red-500/30 border border-red-400/50 p-3 rounded-lg flex items-start gap-2">
                  <span className="text-lg">❌</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {result?.warnings?.length > 0 && (
          <div>
            <p className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span>⚠️</span>
              <span>Warnings ({result.warnings.length})</span>
            </p>
            <ul className="text-sm space-y-2">
              {result.warnings.map((warn: string, idx: number) => (
                <li key={idx} className="bg-yellow-500/30 border border-yellow-400/50 p-3 rounded-lg flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{warn}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {result?.suggestions?.length > 0 && (
          <div>
            <p className="font-semibold text-sm mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Suggestions ({result.suggestions.length})</span>
            </p>
            <ul className="text-sm space-y-2">
              {result.suggestions.map((sug: string, idx: number) => (
                <li key={idx} className="bg-blue-500/30 border border-blue-400/50 p-3 rounded-lg flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!result?.errors?.length && !result?.warnings?.length && !result?.suggestions?.length && (
          <div className="bg-green-500/30 border border-green-400/50 p-4 rounded-lg text-center">
            <p className="text-lg mb-1">🎉</p>
            <p className="text-sm font-semibold">Perfect! No issues found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExportCard({ themeColor, status, result }: { themeColor: string; status: string; result: any }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status !== "complete" || !result) {
    return (
      <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-2xl w-full text-white shadow-lg border border-white/20 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⚙️</div>
          <p className="animate-pulse">📤 Exporting schema...</p>
        </div>
      </div>
    );
  }

  const formatIcons: Record<string, string> = {
    json: '📄',
    postgresql: '🐘',
    mysql: '🐬',
    sqlite: '💾',
  };
  const formatIcon = formatIcons[result?.format] || '📤';

  return (
    <div style={{ backgroundColor: themeColor }} className="rounded-xl p-4 max-w-2xl w-full text-white shadow-lg border border-white/20 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <span className="text-2xl">{formatIcon}</span>
          <span>Export</span>
        </h3>
        <span className="text-xs bg-white/30 px-3 py-1 rounded-full font-semibold uppercase">
          {result?.format || 'export'}
        </span>
      </div>
      <div className="relative">
        <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-xs border border-white/10 max-h-96">
          <code className="text-cyan-300">{result?.content || 'No content'}</code>
        </pre>
        {result?.content && (
          <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-xs transition-all flex items-center gap-2 border border-white/20"
          >
            {copied ? (
              <>
                <span>✅</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
      {result?.content && (
        <div className="mt-3 flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Ready to use in your project</span>
          </div>
          <span>{result.content.length} characters</span>
        </div>
      )}
    </div>
  );
}
