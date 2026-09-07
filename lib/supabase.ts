import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Exercise = {
  id: string;
  category: string;
  name: string;
  description: string;
  duration_minutes: number;
  instructions: string[];
  benefits: string[];
};

export type Devotional = {
  id: string;
  title: string;
  scripture: string;
  message: string;
  prayer_points: string[];
  date: string;
};

export type CareerTip = {
  id: string;
  category: string;
  title: string;
  content: string;
  scripture_reference: string | null;
  action_steps: string[];
};

export type UserProgress = {
  id: string;
  section: string;
  activity_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
};
