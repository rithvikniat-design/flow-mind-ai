import { Request, Response } from 'express';
import { db } from '../models/mockDatabase';
import { supabase } from '../config/supabase';

export const getMemories = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    if (supabase) {
      const { data: memories, error } = await supabase
        .from('memories')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return res.status(200).json(memories);
    } else {
      // Return project specific memories, or merge with default long term memory blocks
      const projectMemories = db.getMemories().filter(m => m.projectId === projectId);
      
      const defaultMemories = [
        {
          id: 'mem_glob_1',
          projectId,
          type: 'long-term' as const,
          content: 'FlowMind AI workforce framework calibrated for rapid SaaS integrations.',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'mem_glob_2',
          projectId,
          type: 'short-term' as const,
          content: 'Planner agent template loaded with Standard Agile sprints breakdown.',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return res.status(200).json([...projectMemories, ...defaultMemories]);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch memory records' });
  }
};
