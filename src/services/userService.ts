import { createClient } from '@supabase/supabase-js';
import { logError } from '../utils/errorHandler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables for user management');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
}

export async function createUser(email: string, password: string): Promise<User> {
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Failed to create user');

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;
    return profileData;
  } catch (error) {
    logError('UserService.createUser', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) throw authError;
  } catch (error) {
    logError('UserService.deleteUser', error);
    throw error;
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logError('UserService.fetchUsers', error);
    throw error;
  }
}