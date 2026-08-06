import { Request, Response } from 'express';
import { db } from '../models/mockDatabase';
import { supabase } from '../config/supabase';

export const getAgents = async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: agents, error } = await supabase.from('agents').select('*');
      if (error) throw error;
      return res.status(200).json(agents);
    } else {
      const agents = db.getAgents();
      return res.status(200).json(agents);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch agents' });
  }
};

export const updateAgent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, avatar, currentTask, reasoning, confidence } = req.body;

  try {
    if (supabase) {
      const { data: agent, error } = await supabase
        .from('agents')
        .update({
          name,
          role,
          avatar,
          current_task: currentTask,
          reasoning,
          confidence
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return res.status(200).json(agent);
    } else {
      db.updateAgent(id, { name, role, avatar, currentTask, reasoning, confidence });
      const agent = db.getAgents().find(a => a.id === id);
      return res.status(200).json(agent);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update agent' });
  }
};

export const createAgent = async (req: Request, res: Response) => {
  const { name, role, avatar } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  try {
    const id = 'agent_' + Math.random().toString(36).substring(2, 11);
    const newAgent = {
      id,
      name,
      role,
      avatar: avatar || '🤖',
      currentTask: 'Idle',
      memory: [],
      reasoning: 'Ready to receive tasks.',
      confidence: 90,
      executionStatus: 'idle' as const,
      thinkingProcess: [],
      communicationLogs: []
    };

    if (supabase) {
      const { data: agent, error } = await supabase
        .from('agents')
        .insert({
          id: newAgent.id,
          name: newAgent.name,
          role: newAgent.role,
          avatar: newAgent.avatar,
          current_task: newAgent.currentTask,
          reasoning: newAgent.reasoning,
          confidence: newAgent.confidence,
          execution_status: newAgent.executionStatus
        })
        .select('*')
        .single();

      if (error) throw error;
      return res.status(201).json(agent);
    } else {
      db.addAgent(newAgent);
      return res.status(201).json(newAgent);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create agent' });
  }
};
