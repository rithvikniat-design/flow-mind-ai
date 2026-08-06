# FlowMind AI - Autonomous AI Workforce for Modern Businesses

FlowMind AI is a premium SaaS platform built for the **Agentic AI & Intelligent Systems** hackathon theme. It allows businesses to coordinate multiple specialized autonomous AI agents (CEO, Planner, Researcher, Copywriter, CFO, Developer, and QA) collaborating to execute multi-step business goals with minimal human intervention.

## 🚀 Premium Features

1. **Autonomous Task Planner:** The Planner Agent breaks down user goals (e.g. *"Launch a hiring campaign"*) into distinct tasks and assigns them to specialized agents.
2. **Animated Agent Collaboration Network:** A real-time visualization canvas of agent cards updating states (`thinking`, `executing`, `completed`), displaying live thinking logs, and streaming agent-to-agent communications.
3. **Command Palette (`Ctrl/Cmd + K`):** An instant overlay menu permitting fast navigation across workspace dashboards.
4. **Voice Assistant:** A floating mic panel recording spoken speech targets and utilizing text-to-speech synthesis feedbacks.
5. **Intelligent Local Simulation Fallback:** If Grok AI API keys or Supabase PostgreSQL parameters are not supplied, the backend runs in a simulated sandbox mode, executing authentic workflows, logs, and business reports.
6. **Robust Authentication:** Secure JWT sessions, encrypted user keys, rate limit protection, and input validators (Zod).
7. **Reports & Exports:** Generates business packages (Executive summaries, compliance risks, recommendations) downloadable as PDF, Word, or CSV.

---

## 📁 Scalable Directory Structure

```text
flowmind-ai/
├── client/                 # React + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/     # Reusable UI widgets
│   │   ├── context/        # Auth and Theme States
│   │   ├── layouts/        # AppLayout, Auth frame layouts
│   │   ├── pages/          # Landing, Dashboard, Workspace, Collaboration, visual builders...
│   │   ├── services/       # Axios API client mappings
│   │   └── types/          # TypeScript common interfaces
├── server/                 # Express + TypeScript API server
│   ├── src/
│   │   ├── config/         # Supabase, config loading, and Grok clients
│   │   ├── controllers/    # Route controllers (Auth, projects, agents...)
│   │   ├── middleware/     # Rate limiter, Auth checks, error handling
│   │   ├── models/         # Mock database schema models
│   │   ├── routes/         # API express sub-routers
│   │   └── utils/          # Agent background execution engine loop
```

---

## 🛢️ Supabase PostgreSQL Schema SQL Script

If you are connecting FlowMind AI to a live Supabase PostgreSQL database, execute the following SQL script inside the Supabase SQL Editor to establish the required tables:

```sql
-- 1. Users Table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tasks Table
CREATE TABLE tasks (
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

-- 4. Agents Table
CREATE TABLE agents (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  avatar VARCHAR(50) NOT NULL,
  current_task VARCHAR(255),
  reasoning TEXT,
  confidence INT DEFAULT 90,
  execution_status VARCHAR(50) DEFAULT 'idle'
);

-- 5. Execution Logs Table
CREATE TABLE execution_logs (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sender_agent_id VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info'
);

-- 6. Reports Table
CREATE TABLE reports (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  executive_summary TEXT,
  risk_analysis TEXT,
  business_insights TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Knowledge Base Files
CREATE TABLE kb_files (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size INT NOT NULL,
  type VARCHAR(100) NOT NULL,
  content_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Visual Workflows
CREATE TABLE workflows (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Memories Table
CREATE TABLE memories (
  id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Local Development Setup

### 1. Backend Server Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Configure the environment: copy `.env.example` to `.env` and fill details (or leave empty to trigger **Simulation Mode**).
4. Run in development: `npm run dev` (Runs on `http://localhost:5000`)

### 2. Frontend Client Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev` (Runs on `http://localhost:3000`)

---

## ☁️ Deployment Instructions

### 1. Database (Supabase)
1. Register an account at [Supabase](https://supabase.com).
2. Instantiate a PostgreSQL Project.
3. Open the SQL editor and execute the schema script above.
4. Copy the URL and Anon Key from project API settings.

### 2. Backend API (Render)
1. Link your git repository to [Render](https://render.com).
2. Create a Web Service pointing to the `server/` root folder.
3. Configure settings:
   - **Environment:** Node
   - **Build Command:** `npm run build` (Inside server)
   - **Start Command:** `npm start`
4. Add environment variables: `PORT`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GROK_API_KEY`.

### 3. Frontend UI (Vercel)
1. Link your repository to [Vercel](https://vercel.com).
2. Configure settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Set proxy/environment endpoints pointing to your Render server URL.
