import { Request, Response } from 'express';
import { db } from '../models/mockDatabase';
import { supabase } from '../config/supabase';
import { callGrok } from '../config/grok';
import { runAgentWorkflow } from '../utils/agentEngine';

export const createProject = async (req: any, res: Response) => {
  const { name, description, goal, researchMode } = req.body;
  const userId = req.user.id;

  if (!name || !goal) {
    return res.status(400).json({ error: 'Project name and business goal are required' });
  }

  try {
    const projectId = 'proj_' + Math.random().toString(36).substring(2, 11);
    let workflowDetails: { projectName: string; tasks: any[] } = { projectName: name, tasks: [] };
    
    if (researchMode === 'flash') {
      console.log(`[ProjectController] Flash mode selected. Initializing rapid task sweep.`);
      workflowDetails = {
        projectName: `Flash: ${name}`,
        tasks: [
          { title: 'Immediate Market & Competitor Flash Sweep', assignedAgentId: 'research', dependsOn: [] },
          { title: 'Compile Rapid Summary Business Brief', assignedAgentId: 'document', dependsOn: ['Immediate Market & Competitor Flash Sweep'] }
        ]
      };
    } else {
      // 1. Ask Planner Agent (via Grok or Simulation) to compile subtasks
      console.log(`[ProjectController] Planner Agent is compiling subtasks for: "${goal}"`);
      const systemPrompt = `You are Sophia, the Planner Agent of FlowMind AI.
A user has assigned the following business goal: "${goal}"

CRITICAL PARSING & GEOGRAPHIC DIRECTIVES:
1. Typo & Colloquialism Correction: Intelligently parse, interpret, and auto-correct slight typos (e.g. "cofee" -> "coffee", "nyrk" -> "New York", "collage" -> "college"), colloquialisms, or semi-complete requests before formulating tasks. Do not complain about messy inputs; correct them silently and build accurate, professional plans.
2. Geographic & Spatial Awareness: Actively identify if the goal mentions specific cities, regions, countries, or spatial contexts (e.g., "in front of college", "near Central Park", "in San Francisco"). If location or spatial descriptors are present:
   - Preserve and match all place names and location contexts exactly in your subtasks.
   - Incorporate geographic/spatial requirements directly into research, marketing, and developer tasks (e.g., localized demographic studies, region-specific regulations, local market competitors).

Please break this goal down into a logical sequence of subtasks (exactly 5 or 6 tasks).
Assign each subtask to one of the following available agents:
- research (Lead Researcher)
- analyst (Data Analyst)
- finance (CFO)
- marketing (Marketing Copywriter)
- sales (Sales Pipeline Specialist)
- hr (HR Recruiter)
- support (Helpdesk Lead)
- developer (Software Developer)
- quality (QA Checker)
- document (Report Writer)

Each task should have:
1. title: clear action description
2. assignedAgentId: one of the IDs above
3. dependsOn: array of previous task titles it relies upon (or empty array)

Response MUST be a valid JSON object matching this structure:
{
  "projectName": "Name of workflow",
  "tasks": [
    { "title": "Task title", "assignedAgentId": "research", "dependsOn": [] }
  ]
}`;

      const plannerResponseText = await callGrok([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Break down the goal: "${goal}"` }
      ]);

      try {
        // Find JSON block if grok wrapped it in markdown code fences
        const jsonStart = plannerResponseText.indexOf('{');
        const jsonEnd = plannerResponseText.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd !== -1) {
          workflowDetails = JSON.parse(plannerResponseText.substring(jsonStart, jsonEnd));
        } else {
          workflowDetails = JSON.parse(plannerResponseText);
        }
      } catch (e) {
        console.warn('[ProjectController] JSON parse failed on planner response, using simulation fallback.');
        // Fallback fallback if JSON fails to parse
        workflowDetails = {
          projectName: name,
          tasks: [
            { title: 'Market & Competitive Landscape Audit', assignedAgentId: 'research', dependsOn: [] } as any,
            { title: 'Draft Marketing and Branding Assets', assignedAgentId: 'marketing', dependsOn: ['Market & Competitive Landscape Audit'] } as any,
            { title: 'Develop Integration Scripts & Forms', assignedAgentId: 'developer', dependsOn: ['Draft Marketing and Branding Assets'] } as any,
            { title: 'Calculate Campaign Budget & ROI Matrix', assignedAgentId: 'finance', dependsOn: ['Draft Marketing and Branding Assets'] } as any,
            { title: 'Run Code QA & Compliance Auditing', assignedAgentId: 'quality', dependsOn: ['Develop Integration Scripts & Forms', 'Calculate Campaign Budget & ROI Matrix'] } as any,
            { title: 'Create Final Deliverable Business Document', assignedAgentId: 'document', dependsOn: ['Run Code QA & Compliance Auditing'] } as any
          ]
        };
      }
    }

    // 2. Save Project
    const projectData = {
      id: projectId,
      userId,
      name: workflowDetails.projectName || name,
      description: description || `Autonomous workflow for: ${goal}`,
      status: 'planning' as const,
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      await supabase.from('projects').insert({
        id: projectData.id,
        user_id: projectData.userId,
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        created_at: projectData.createdAt
      });
    } else {
      db.addProject(projectData);
    }

    // 3. Save Tasks
    const compiledTasks: any[] = [];
    for (let idx = 0; idx < workflowDetails.tasks.length; idx++) {
      const t: any = workflowDetails.tasks[idx];
      const taskId = 'task_' + Math.random().toString(36).substring(2, 11);
      
      const taskData = {
        id: taskId,
        projectId,
        title: t.title,
        assignedAgentId: t.assignedAgentId || 'research',
        status: 'pending' as const,
        progress: 0,
        dependsOn: t.dependsOn || []
      };

      if (supabase) {
        await supabase.from('tasks').insert({
          id: taskData.id,
          project_id: taskData.projectId,
          title: taskData.title,
          assigned_agent_id: taskData.assignedAgentId,
          status: taskData.status,
          progress: taskData.progress,
          depends_on: taskData.dependsOn
        });
      } else {
        db.addTask(taskData);
      }
      compiledTasks.push(taskData);
    }

    // 4. Trigger Asynchronous Multi-Agent Execution Pipeline in background
    runAgentWorkflow(projectId, goal);

    return res.status(201).json({
      project: projectData,
      tasks: compiledTasks
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create project' });
  }
};

export const getProjects = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    if (supabase) {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return res.status(200).json(projects);
    } else {
      const projects = db.getProjects()
        .filter(p => p.userId === userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return res.status(200).json(projects);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (supabase) {
      const { data: project } = await supabase.from('projects').select('*').eq('id', id).single();
      if (!project) return res.status(404).json({ error: 'Project not found' });
      
      const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', id);
      const { data: agents } = await supabase.from('agents').select('*');
      
      return res.status(200).json({ project, tasks: tasks || [], agents: agents || [] });
    } else {
      const project = db.getProjects().find(p => p.id === id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      
      const tasks = db.getTasks().filter(t => t.projectId === id);
      const agents = db.getAgents();
      
      return res.status(200).json({ project, tasks, agents });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve project details' });
  }
};

export const getExecutionLogs = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    if (supabase) {
      const { data: logs, error } = await supabase
        .from('execution_logs')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: true });
        
      if (error) throw error;
      return res.status(200).json(logs);
    } else {
      const logs = db.getExecutionLogs()
        .filter(l => l.projectId === projectId)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      return res.status(200).json(logs);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve logs' });
  }
};

export const getProjectReport = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    if (supabase) {
      const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('project_id', projectId)
        .single();
        
      if (error || !report) return res.status(404).json({ error: 'Report not found' });
      return res.status(200).json(report);
    } else {
      const report = db.getReports().find(r => r.projectId === projectId);
      if (!report) return res.status(404).json({ error: 'Report not found' });
      return res.status(200).json(report);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve report' });
  }
};
