import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { db } from '../models/mockDatabase';
import { supabase } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
      email: string;
    };

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
    } else {
      const user = db.getUsers().find(u => u.id === decoded.id);
      if (!user) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
