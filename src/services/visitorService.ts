import { supabase } from '../lib/supabase';

export async function getVisitorCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('visitor_counter')
      .select('count')
      .single();

    if (error) throw error;
    return data?.count || 0;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return 0;
  }
}

export async function incrementVisitorCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .rpc('increment_visitor_counter');

    if (error) throw error;
    return data || 0;
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return 0;
  }
}