-- FLOWMIND AI DATABASE MIGRATIONS SCRIPT
-- Copy this entire file and paste it into the Supabase SQL Editor

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  assigned_agent_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  progress INT DEFAULT 0,
  depends_on TEXT[],
  thinking TEXT,
  output TEXT,
  execution_time INT,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  avatar VARCHAR(50) NOT NULL,
  current_task VARCHAR(255),
  reasoning TEXT,
  confidence INT DEFAULT 90,
  execution_status VARCHAR(50) DEFAULT 'idle'
);

-- 5. Create Execution Logs Table
CREATE TABLE IF NOT EXISTS execution_logs (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sender_agent_id VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info'
);

-- 6. Create Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  executive_summary TEXT,
  risk_analysis TEXT,
  business_insights TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Knowledge Base Files Table
CREATE TABLE IF NOT EXISTS kb_files (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size INT NOT NULL,
  type VARCHAR(100) NOT NULL,
  content_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Visual Workflows Table
CREATE TABLE IF NOT EXISTS workflows (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Memories Table
CREATE TABLE IF NOT EXISTS memories (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Disable Row Level Security (RLS) on all tables for backend server access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE kb_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE workflows DISABLE ROW LEVEL SECURITY;
ALTER TABLE memories DISABLE ROW LEVEL SECURITY;

