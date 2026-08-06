import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { supabase } from '../config/supabase';
import { db } from '../models/mockDatabase';
import { signupSchema, loginSchema } from '../validators/authValidator';

// Generate Token
const generateToken = (userId: string, email: string) => {
  return jwt.sign({ id: userId, email }, config.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const validated = signupSchema.parse(req.body);
    const { email, password, name, role } = validated;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (supabase) {
      // 1. Check if user already exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const userId = 'usr_' + Math.random().toString(36).substring(2, 11);

      // 2. Insert user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          password_hash: passwordHash,
          name,
          role: role || 'user',
          created_at: new Date().toISOString(),
        })
        .select('id, email, name, role')
        .maybeSingle();

      if (error || !newUser) {
        console.error('[Signup Database Error]:', error);
        return res.status(500).json({ error: error?.message || 'Failed to create user in database.' });
      }

      const token = generateToken(newUser.id, newUser.email);
      return res.status(201).json({
        user: newUser,
        token,
      });
    } else {
      // Mock DB Mode
      const existingUser = db.getUsers().find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
      const newUser = {
        id: userId,
        email,
        passwordHash,
        name,
        role,
        createdAt: new Date().toISOString(),
      };

      db.addUser(newUser);

      const token = generateToken(userId, email);
      return res.status(201).json({
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
        token,
      });
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: error.message || 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { email, password } = validated;

    if (supabase) {
      // 1. Fetch user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error || !user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // 2. Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.email);
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } else {
      // Mock DB Mode
      const user = db.getUsers().find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.email);
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      });
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    // req.user is populated by authenticateToken middleware
    return res.status(200).json({ user: req.user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve profile' });
  }
};
