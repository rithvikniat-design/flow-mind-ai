import fs from 'fs';
import path from 'path';

// Define DB Types
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  currentTask: string;
  memory: string[];
  reasoning: string;
  confidence: number; // 0 - 100
  executionStatus: 'idle' | 'thinking' | 'executing' | 'completed' | 'failed';
  thinkingProcess: string[];
  communicationLogs: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignedAgentId: string;
  dependsOn?: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  thinking?: string;
  output?: string;
  executionTime?: number;
  completedAt?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  createdAt: string;
  workflowId?: string;
}

export interface ExecutionLog {
  id: string;
  projectId: string;
  timestamp: string;
  senderAgentId: string;
  message: string;
  type: 'info' | 'chat' | 'decision' | 'error';
}

export interface Report {
  id: string;
  projectId: string;
  title: string;
  executiveSummary: string;
  riskAnalysis: string;
  businessInsights: string;
  recommendations: string;
  createdAt: string;
}

export interface KBFile {
  id: string;
  userId: string;
  name: string;
  size: number;
  type: string;
  contentSummary: string;
  createdAt: string;
}

export interface AIMemory {
  id: string;
  projectId: string;
  type: 'short-term' | 'long-term' | 'project' | 'conversation';
  content: string;
  timestamp: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  agents: Agent[];
  projects: Project[];
  tasks: Task[];
  executionLogs: ExecutionLog[];
  reports: Report[];
  kbFiles: KBFile[];
  memories: AIMemory[];
  workflows: WorkflowTemplate[];
}

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initialize default agents
const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'ceo',
    name: 'CEO Agent (Arthur)',
    role: 'Chief Executive Officer',
    avatar: '💼',
    currentTask: 'Overseeing global operations',
    memory: ['Goal: Optimize enterprise workflow efficiency', 'Standard Operating Procedures updated'],
    reasoning: 'Coordinating overall agent execution to meet business timelines.',
    confidence: 95,
    executionStatus: 'idle',
    thinkingProcess: ['Analyzing global progress', 'Setting system-wide goals'],
    communicationLogs: ['System online. CEO Agent stands ready.']
  },
  {
    id: 'planner',
    name: 'Planner Agent (Sophia)',
    role: 'Workflow & Strategy Planner',
    avatar: '📐',
    currentTask: 'Awaiting goals to compile workflows',
    memory: ['Project management templates loaded', 'Resource allocation matrix cached'],
    reasoning: 'Determining the critical path for task executions.',
    confidence: 92,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'research',
    name: 'Research Agent (Isaac)',
    role: 'Lead Researcher & Industry Analyst',
    avatar: '🔍',
    currentTask: 'Indexing industry whitepapers',
    memory: ['Market reports indexed', 'Competitor database online'],
    reasoning: 'Filtering target demographics and tracking competitor models.',
    confidence: 88,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'analyst',
    name: 'Data Analysis Agent (Elena)',
    role: 'Data Analyst & Statistician',
    avatar: '📊',
    currentTask: 'Calibrating analytics dashboard formulas',
    memory: ['SQL engines active', 'Linear regression algorithms optimized'],
    reasoning: 'Correlating user traffic spikes with marketing campaigns.',
    confidence: 94,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'finance',
    name: 'Finance Agent (Marcus)',
    role: 'Chief Financial Officer',
    avatar: '💵',
    currentTask: 'Monitoring mock API cost allocations',
    memory: ['Q3 budget constraints defined', 'Cost/benefit assessment standards loaded'],
    reasoning: 'Projecting ROI percentages and cost reductions of automation.',
    confidence: 91,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'marketing',
    name: 'Marketing Agent (Amelia)',
    role: 'Marketing Copywriter & Channel Specialist',
    avatar: '📣',
    currentTask: 'Drafting brand guidelines template',
    memory: ['Ad copy templates loaded', 'Social media channel mappings cached'],
    reasoning: 'Structuring visual and text-based assets for client campaigns.',
    confidence: 89,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'sales',
    name: 'Sales Agent (Viktor)',
    role: 'Sales Pipeline Specialist',
    avatar: '📈',
    currentTask: 'Structuring mock outbound lead lists',
    memory: ['CRM lead scoring rules established', 'Sales funnel triggers loaded'],
    reasoning: 'Prioritizing customer segments based on conversion metrics.',
    confidence: 87,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'hr',
    name: 'HR Agent (Chloe)',
    role: 'HR & Recruitment Coordinator',
    avatar: '👥',
    currentTask: 'Formatting employee onboarding guides',
    memory: ['Job description formats cached', 'Interview feedback forms online'],
    reasoning: 'Aligning job definitions with industry standards.',
    confidence: 90,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'support',
    name: 'Customer Support Agent (Liam)',
    role: 'Helpdesk & FAQ Lead',
    avatar: '🎧',
    currentTask: 'Compiling core support scripts',
    memory: ['Ticketing priority system mapped', 'FAQ search indices active'],
    reasoning: 'Mapping customer complaints to immediate knowledge-base resolutions.',
    confidence: 86,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'developer',
    name: 'Developer Agent (Devin)',
    role: 'Software Developer',
    avatar: '💻',
    currentTask: 'Testing mock API handlers',
    memory: ['Git repository status active', 'TypeScript schemas verified'],
    reasoning: 'Evaluating algorithmic space-time complexities of user flows.',
    confidence: 93,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'document',
    name: 'Document Agent (Page)',
    role: 'Report Generator & Editor',
    avatar: '📄',
    currentTask: 'Creating PDF layout templates',
    memory: ['Markdown renderer initialized', 'Document schemas parsed'],
    reasoning: 'Formatting structured data tables into reports.',
    confidence: 95,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'meeting',
    name: 'Meeting Agent (Cal)',
    role: 'Calendar & Event Coordinator',
    avatar: '📅',
    currentTask: 'Syncing mock calendar availability',
    memory: ['Outlook/Google calendar sync simulation active', 'Timezone preferences loaded'],
    reasoning: 'Locating optimal blocks of time for agent reviews.',
    confidence: 92,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'risk',
    name: 'Risk Analysis Agent (Regina)',
    role: 'Compliance & Risk Assessor',
    avatar: '⚠️',
    currentTask: 'Auditing data privacy patterns',
    memory: ['GDPR/SOC2 rules configured', 'Security guidelines indexed'],
    reasoning: 'Analyzing potential liabilities in planned agent integrations.',
    confidence: 90,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  },
  {
    id: 'quality',
    name: 'Quality Checker Agent (Quinn)',
    role: 'QA Engineer',
    avatar: '🛡️',
    currentTask: 'Awaiting task artifacts to evaluate',
    memory: ['Acceptance criteria validator loaded', 'Unit test automation templates mapped'],
    reasoning: 'Ensuring outputs meet 100% of user-defined constraints.',
    confidence: 96,
    executionStatus: 'idle',
    thinkingProcess: [],
    communicationLogs: []
  }
];

class MockDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = {
      users: [],
      agents: [...DEFAULT_AGENTS],
      projects: [],
      tasks: [],
      executionLogs: [],
      reports: [],
      kbFiles: [],
      memories: [],
      workflows: []
    };
    this.ensureDataDirectory();
    this.load();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          users: parsed.users || [],
          agents: parsed.agents && parsed.agents.length > 0 ? parsed.agents : [...DEFAULT_AGENTS],
          projects: parsed.projects || [],
          tasks: parsed.tasks || [],
          executionLogs: parsed.executionLogs || [],
          reports: parsed.reports || [],
          kbFiles: parsed.kbFiles || [],
          memories: parsed.memories || [],
          workflows: parsed.workflows || []
        };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading mock database file, using in-memory fallback', err);
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to mock database file', err);
    }
  }

  // Getters
  public getUsers() { return this.data.users; }
  public getAgents() { return this.data.agents; }
  public getProjects() { return this.data.projects; }
  public getTasks() { return this.data.tasks; }
  public getExecutionLogs() { return this.data.executionLogs; }
  public getReports() { return this.data.reports; }
  public getKbFiles() { return this.data.kbFiles; }
  public getMemories() { return this.data.memories; }
  public getWorkflows() { return this.data.workflows; }

  // Setters/Mutations
  public addUser(user: User) {
    this.data.users.push(user);
    this.save();
  }

  public addProject(project: Project) {
    this.data.projects.push(project);
    this.save();
  }

  public updateProject(id: string, updates: Partial<Project>) {
    const project = this.data.projects.find(p => p.id === id);
    if (project) {
      Object.assign(project, updates);
      this.save();
    }
  }

  public addAgent(agent: Agent) {
    this.data.agents.push(agent);
    this.save();
  }

  public updateAgent(id: string, updates: Partial<Agent>) {
    const agent = this.data.agents.find(a => a.id === id);
    if (agent) {
      Object.assign(agent, updates);
      this.save();
    }
  }

  public resetAgents() {
    this.data.agents = JSON.parse(JSON.stringify(DEFAULT_AGENTS));
    this.save();
  }

  public addTask(task: Task) {
    this.data.tasks.push(task);
    this.save();
  }

  public updateTask(id: string, updates: Partial<Task>) {
    const task = this.data.tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updates);
      this.save();
    }
  }

  public addExecutionLog(log: ExecutionLog) {
    this.data.executionLogs.push(log);
    this.save();
  }

  public addReport(report: Report) {
    this.data.reports.push(report);
    this.save();
  }

  public addKbFile(file: KBFile) {
    this.data.kbFiles.push(file);
    this.save();
  }

  public removeKbFile(id: string) {
    this.data.kbFiles = this.data.kbFiles.filter(f => f.id !== id);
    this.save();
  }

  public addMemory(memory: AIMemory) {
    this.data.memories.push(memory);
    this.save();
  }

  public addWorkflow(workflow: WorkflowTemplate) {
    this.data.workflows.push(workflow);
    this.save();
  }
}

export const db = new MockDatabase();
