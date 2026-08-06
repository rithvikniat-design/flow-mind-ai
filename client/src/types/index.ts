export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  currentTask: string;
  memory: string[];
  reasoning: string;
  confidence: number;
  executionStatus: 'idle' | 'thinking' | 'executing' | 'completed' | 'failed';
  thinkingProcess: string[];
  communicationLogs: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignedAgentId: string;
  dependsOn: string[];
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
