import { Request, Response } from 'express';
import { db } from '../models/mockDatabase';
import { supabase } from '../config/supabase';

export const getWorkflows = async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: workflows, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return res.status(200).json(workflows);
    } else {
      const workflows = db.getWorkflows();
      return res.status(200).json(workflows);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch workflows' });
  }
};

export const saveWorkflow = async (req: Request, res: Response) => {
  const { name, description, nodes, edges } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Workflow name is required' });
  }

  try {
    const workflowId = 'flow_' + Math.random().toString(36).substring(2, 11);
    const newWorkflow = {
      id: workflowId,
      name,
      description: description || 'Visual canvas template',
      nodes: nodes || [],
      edges: edges || [],
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      const { data: workflow, error } = await supabase
        .from('workflows')
        .insert({
          id: newWorkflow.id,
          name: newWorkflow.name,
          description: newWorkflow.description,
          nodes: newWorkflow.nodes,
          edges: newWorkflow.edges,
          created_at: newWorkflow.createdAt
        })
        .select('*')
        .single();

      if (error) throw error;
      return res.status(201).json(workflow);
    } else {
      db.addWorkflow(newWorkflow);
      return res.status(201).json(newWorkflow);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to save workflow' });
  }
};
