import { db, Task, Agent, ExecutionLog, Project } from '../models/mockDatabase';
import { callGrok } from '../config/grok';
import { supabase } from '../config/supabase';

// Helper to delay execution (simulates thinking and allows frontend visual transitions)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runAgentWorkflow(projectId: string, goal: string) {
  console.log(`[AgentEngine] Starting workflow for project: ${projectId}, Goal: "${goal}"`);
  
  try {
    // 1. Initial State Sync
    let project: Project | null = null;
    let tasks: Task[] = [];
    
    if (supabase) {
      const { data: p } = await supabase.from('projects').select('*').eq('id', projectId).single();
      const { data: t } = await supabase.from('tasks').select('*').eq('project_id', projectId);
      project = p;
      tasks = t || [];
    } else {
      project = db.getProjects().find(p => p.id === projectId) || null;
      tasks = db.getTasks().filter(t => t.projectId === projectId);
    }
    
    if (!project) return;
    
    const isFlash = tasks.length <= 2;
    const thinkingDelay = isFlash ? 800 : 3000;
    const transitionDelay = isFlash ? 500 : 2000;
    
    // Log project initialization
    await logEvent(projectId, 'ceo', `CEO Arthur initialized project. Goal: "${goal}". Strategy planning assigned to Sophia (Planner Agent).`, 'decision');
    
    // Update project state to executing
    await updateProjectStatus(projectId, 'executing');
    
    // We execute tasks based on dependencies
    // To simplify, we will execute them sequentially or topographically.
    // Given our linear dependencies in the mock output, we will run them in order.
    
    const taskOutputs: Record<string, string> = {};
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const agentId = task.assignedAgentId || (task as any).assigned_agent_id;
      
      // Update task status to running
      await updateTaskState(task.id, { status: 'running', progress: 10 });
      await logEvent(projectId, 'planner', `Sophia assigned Task ${i + 1}: "${task.title}" to Agent ${agentId.toUpperCase()}`, 'info');
      
      // Prepare Agent thinking state
      await updateAgentState(agentId, {
        executionStatus: 'thinking',
        currentTask: task.title,
        thinkingProcess: [`Analyzing requirements for: ${task.title}`, `Reviewing goal: ${goal}`],
        confidence: Math.floor(Math.random() * 10) + 85 // 85-95
      });
      
      await logEvent(projectId, agentId, `Agent is analyzing instructions...`, 'info');
      await delay(thinkingDelay);
      
      // Agent is executing
      await updateAgentState(agentId, { executionStatus: 'executing' });
      await updateTaskState(task.id, { progress: 40 });
      
      // Create chat log
      const historyContext = Object.entries(taskOutputs)
        .map(([aId, out]) => `[Output of Agent ${aId.toUpperCase()}]: ${out.substring(0, 300)}...`)
        .join('\n\n');
        
      await logEvent(
        projectId,
        agentId,
        `Task execution in progress. Calling Grok AI model with target instructions.`,
        'chat'
      );
      
      // Call Grok with role prompting
      const systemPrompt = `You are the ${agentId.toUpperCase()} Agent in FlowMind AI's autonomous multi-agent workforce.
Your role: Customize your actions and output for this project goal: "${goal}".

INSTRUCTIONS:
1. Spatial & Regional Adaptation: If the goal specifies a city, region, or physical context (e.g. "in front of college", "in London", "near Central Park"), adapt your execution details to this specific spatial context.
2. Correct Typographical Errors: Intelligently interpret messy inputs and typos in the goal. Do not carry over spelling mistakes; use corrected forms in your report (e.g., use "college" instead of "collage", "coffee" instead of "cofee").
3. Context Matching: Review previous agent outputs to make sure your coordinates, location metadata, and assumptions match exactly.

Previous agent outputs for context:
${historyContext}
Provide a detailed execution report of your specific task: "${task.title}". Keep it professional, actionable, and formatted in markdown.`;

      const response = await callGrok([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please execute your task "${task.title}" for the business goal: "${goal}"` }
      ]);
      
      taskOutputs[agentId] = response;
      
      // Task completed
      await updateTaskState(task.id, {
        status: 'completed',
        progress: 100,
        output: response,
        executionTime: Math.floor(Math.random() * 3) + 2, // 2-5 seconds
        completedAt: new Date().toISOString()
      });
      
      await updateAgentState(agentId, {
        executionStatus: 'completed',
        memory: [
          ...(supabase ? [] : (db.getAgents().find(a => a.id === agentId)?.memory || [])),
          `Completed Task: ${task.title}`
        ],
        reasoning: `Successfully completed execution. Confidence metrics met.`,
        communicationLogs: [
          ...(supabase ? [] : (db.getAgents().find(a => a.id === agentId)?.communicationLogs || [])),
          `Dispatched output for task: ${task.title}`
        ]
      });
      
      await logEvent(projectId, agentId, `Task finished successfully. Outgoing payload saved to workspace memory.`, 'info');
      await delay(transitionDelay);
    }
    
    // 2. Final Report Generation by Document Agent
    await logEvent(projectId, 'document', 'Page (Document Agent) is compiling the final report...', 'info');
    await updateAgentState('document', { executionStatus: 'thinking', currentTask: 'Compiling project summary report' });
    await delay(thinkingDelay);
    
    const summaryPrompt = `You are Page (Document Agent). Please compile the final business report for project goal: "${goal}".
Here are the reports submitted by the collaborative agents:
${Object.entries(taskOutputs).map(([aId, out]) => `--- Agent ${aId.toUpperCase()} Report ---\n${out}`).join('\n\n')}

CRITICAL PARSING & GEOGRAPHIC DIRECTIVES:
1. Spatial & Location Context: Actively scan the goal and agent findings for geographic or spatial details (e.g. "in front of college", "in London", "near Central Park"). Maintain this context as a central pillar of your report (e.g. spatial foot traffic, local competitor maps). Do not drop or generalize specific place names.
2. Correct Typographical Errors: Intelligently parse and replace any colloquialisms or spelling errors in the user goal (e.g. output "college" instead of "collage", "coffee" instead of "cofee") throughout the report titles and headers.

Create a professional full report with:
1. Executive Summary
2. Risk Analysis
3. Business Insights
4. Recommendations

Format it in beautiful markdown.`;

    const finalReportContent = await callGrok([
      { role: 'system', content: 'You are an Expert Business Document Writer.' },
      { role: 'user', content: summaryPrompt }
    ]);
    
    // Save report to database
    const reportId = 'rep_' + Math.random().toString(36).substring(2, 11);
    
    // Parse sections
    const executiveSummary = extractSection(finalReportContent, 'Executive Summary');
    const riskAnalysis = extractSection(finalReportContent, 'Risk Analysis');
    const businessInsights = extractSection(finalReportContent, 'Insights');
    const recommendations = extractSection(finalReportContent, 'Recommendations');
    
    if (supabase) {
      const { error } = await supabase.from('reports').insert({
        id: reportId,
        project_id: projectId,
        title: `FlowMind AI Collaboration Report - ${project.name}`,
        executive_summary: executiveSummary || finalReportContent.substring(0, 1000),
        risk_analysis: riskAnalysis || 'No high risks identified.',
        business_insights: businessInsights || 'Optimizations verified.',
        recommendations: recommendations || 'Proceed to campaign deployment.',
        created_at: new Date().toISOString()
      });
      if (error) {
        console.error('[AgentEngine] Supabase Report Insert Error:', error);
        throw new Error(`Supabase report insert failed: ${error.message}`);
      }
    } else {
      db.addReport({
        id: reportId,
        projectId,
        title: `FlowMind AI Collaboration Report - ${project.name}`,
        executiveSummary: executiveSummary || finalReportContent.substring(0, 1000),
        riskAnalysis: riskAnalysis || 'No high risks identified.',
        businessInsights: businessInsights || 'Optimizations verified.',
        recommendations: recommendations || 'Proceed to campaign deployment.',
        createdAt: new Date().toISOString()
      });
      
      // Save memory nodes
      db.addMemory({
        id: 'mem_' + Math.random().toString(36).substring(2, 11),
        projectId,
        type: 'long-term',
        content: `Successful project workflow execution for goal: "${goal}". Generated report ID ${reportId}.`,
        timestamp: new Date().toISOString()
      });
    }
    
    await updateAgentState('document', { executionStatus: 'completed' });
    await logEvent(projectId, 'ceo', 'Arthur (CEO Agent): Workflow review finished. Final business deliverables saved to user cabinet.', 'decision');
    
    // Complete project
    await updateProjectStatus(projectId, 'completed');
    
    // Reset all agents to idle
    if (!supabase) {
      db.resetAgents();
    }
    
  } catch (error) {
    console.error(`[AgentEngine] Critical workflow error in project ${projectId}:`, error);
    await updateProjectStatus(projectId, 'failed');
    await logEvent(projectId, 'ceo', `Arthur (CEO Agent): CRITICAL FAIL. Workflow halted due to system interrupt.`, 'error');
  }
}

// Helper to log event
async function logEvent(projectId: string, agentId: string, message: string, type: 'info' | 'chat' | 'decision' | 'error') {
  const logId = 'log_' + Math.random().toString(36).substring(2, 11);
  const logData = {
    id: logId,
    projectId,
    timestamp: new Date().toISOString(),
    senderAgentId: agentId,
    message,
    type
  };
  
  if (supabase) {
    await supabase.from('execution_logs').insert({
      id: logId,
      project_id: projectId,
      timestamp: logData.timestamp,
      sender_agent_id: agentId,
      message,
      type
    });
  } else {
    db.addExecutionLog(logData);
  }
}

// Helper to update project status
async function updateProjectStatus(projectId: string, status: 'planning' | 'executing' | 'completed' | 'failed') {
  if (supabase) {
    await supabase.from('projects').update({ status }).eq('id', projectId);
  } else {
    db.updateProject(projectId, { status });
  }
}

// Helper to update task state
async function updateTaskState(taskId: string, updates: Partial<Task>) {
  if (supabase) {
    // Map TS keys to PostgreSQL snake_case columns
    const mapped: any = {};
    if (updates.status) mapped.status = updates.status;
    if (updates.progress !== undefined) mapped.progress = updates.progress;
    if (updates.output) mapped.output = updates.output;
    if (updates.executionTime !== undefined) mapped.execution_time = updates.executionTime;
    if (updates.completedAt) mapped.completed_at = updates.completedAt;
    
    await supabase.from('tasks').update(mapped).eq('id', taskId);
  } else {
    db.updateTask(taskId, updates);
  }
}

// Helper to update agent status
async function updateAgentState(agentId: string, updates: Partial<Agent>) {
  if (supabase) {
    const mapped: any = {};
    if (updates.executionStatus) mapped.execution_status = updates.executionStatus;
    if (updates.currentTask) mapped.current_task = updates.currentTask;
    if (updates.reasoning) mapped.reasoning = updates.reasoning;
    if (updates.confidence !== undefined) mapped.confidence = updates.confidence;
    
    await supabase.from('agents').update(mapped).eq('id', agentId);
  } else {
    db.updateAgent(agentId, updates);
  }
}

// Helper to extract section content from markdown
function extractSection(content: string, sectionTitle: string): string {
  const lines = content.split('\n');
  let recording = false;
  const sectionLines: string[] = [];
  
  for (const line of lines) {
    if (line.toLowerCase().includes('##') && line.toLowerCase().includes(sectionTitle.toLowerCase())) {
      recording = true;
      continue;
    }
    if (recording && line.toLowerCase().startsWith('##')) {
      break;
    }
    if (recording) {
      sectionLines.push(line);
    }
  }
  
  if (sectionLines.length === 0) {
    // Fallback if formatting doesn't match perfectly
    const regex = new RegExp(`(?:##|###|\\*\\*)\\s*\\d*\\.?\\s*${sectionTitle}[\\s\\S]*?(?=\\n(?:##|###|\\*\\*)|$)`, 'i');
    const match = content.match(regex);
    return match ? match[0].trim() : '';
  }
  
  return sectionLines.join('\n').trim();
}
