import { Request, Response } from 'express';
import { db } from '../models/mockDatabase';
import { supabase } from '../config/supabase';

export const getKbFiles = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    if (supabase) {
      const { data: files, error } = await supabase
        .from('kb_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return res.status(200).json(files);
    } else {
      const files = db.getKbFiles().filter(f => f.userId === userId);
      return res.status(200).json(files);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch knowledge base files' });
  }
};

export const uploadKbFile = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { name, size, type, contentSummary } = req.body;

  if (!name || !size) {
    return res.status(400).json({ error: 'File name and size are required' });
  }

  try {
    const fileId = 'file_' + Math.random().toString(36).substring(2, 11);
    
    // Simulate parsing contents based on file extensions
    let parsedSummary = contentSummary;
    if (!parsedSummary) {
      if (type.includes('pdf')) {
        parsedSummary = 'Extracted text from PDF: Focuses on enterprise client requirements and performance KPIs.';
      } else if (type.includes('csv') || type.includes('excel') || type.includes('sheet')) {
        parsedSummary = 'CSV Table: Found 200 records mapping marketing conversion metrics, ROI sheets, and sales budgets.';
      } else {
        parsedSummary = 'Raw text document containing baseline system operations guidelines.';
      }
    }

    const fileData = {
      id: fileId,
      userId,
      name,
      size,
      type: type || 'text/plain',
      contentSummary: parsedSummary,
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      const { data: file, error } = await supabase
        .from('kb_files')
        .insert({
          id: fileData.id,
          user_id: fileData.userId,
          name: fileData.name,
          size: fileData.size,
          type: fileData.type,
          content_summary: fileData.contentSummary,
          created_at: fileData.createdAt
        })
        .select('*')
        .single();

      if (error) throw error;
      return res.status(201).json(file);
    } else {
      db.addKbFile(fileData);
      return res.status(201).json(fileData);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to upload knowledge base document' });
  }
};

export const deleteKbFile = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (supabase) {
      const { error } = await supabase.from('kb_files').delete().eq('id', id);
      if (error) throw error;
    } else {
      db.removeKbFile(id);
    }
    return res.status(200).json({ message: 'File removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete file' });
  }
};
