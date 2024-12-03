import { supabase } from '../lib/supabase';

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      throw new Error('No active session');
    }
    
    return session;
  } catch (error) {
    console.error('Auth check failed:', error);
    throw error;
  }
};

export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) throw error;
    
    return session;
  } catch (error) {
    console.error('Session refresh failed:', error);
    throw error;
  }
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error.message === 'Failed to fetch') {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
  
  throw lastError;
};