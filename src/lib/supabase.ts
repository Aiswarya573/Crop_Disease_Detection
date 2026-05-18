import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Prediction {
  id: string;
  image_url: string;
  disease_name: string;
  confidence: number;
  description: string;
  causes: string[];
  prevention: string[];
  treatment: string;
  crop_type: string;
  is_healthy: boolean;
  created_at: string;
}

export interface PredictionInsert {
  image_url: string;
  disease_name: string;
  confidence: number;
  description: string;
  causes: string[];
  prevention: string[];
  treatment: string;
  crop_type: string;
  is_healthy: boolean;
}
