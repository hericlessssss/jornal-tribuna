import { supabase } from '../lib/supabase';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  highlighted: boolean;
  homepage_highlight: boolean;
  category: string;
  created_at: string;
}

/**
 * Busca todas as notícias no banco de dados.
 * @returns Lista de notícias.
 */
export async function fetchNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false }); // Ordena por data, do mais recente ao mais antigo.

  if (error) {
    console.error('Erro ao buscar notícias:', error);
    throw new Error('Erro ao buscar notícias');
  }

  return data || [];
}

/**
 * Adiciona uma nova notícia ao banco de dados.
 * @param news Objeto contendo os dados da nova notícia.
 * @returns Notícia adicionada.
 */
export async function addNews(news: Partial<NewsItem>): Promise<NewsItem> {
  const { data, error } = await supabase.from('news').insert([news]).select('*').single();

  if (error) {
    console.error('Erro ao adicionar notícia:', error);
    throw new Error('Erro ao adicionar notícia');
  }

  return data;
}

/**
 * Atualiza uma notícia existente no banco de dados.
 * @param id ID da notícia a ser atualizada.
 * @param updates Objeto contendo os dados a serem atualizados.
 * @returns Notícia atualizada.
 */
export async function updateNews(id: number, updates: Partial<NewsItem>): Promise<NewsItem> {
  const { data, error } = await supabase.from('news').update(updates).eq('id', id).select('*').single();

  if (error) {
    console.error('Erro ao atualizar notícia:', error);
    throw new Error('Erro ao atualizar notícia');
  }

  return data;
}

/**
 * Exclui uma notícia do banco de dados.
 * @param id ID da notícia a ser excluída.
 * @returns Resultado da exclusão.
 */
export async function deleteNews(id: number): Promise<void> {
  const { error } = await supabase.from('news').delete().eq('id', id);

  if (error) {
    console.error('Erro ao excluir notícia:', error);
    throw new Error('Erro ao excluir notícia');
  }
}
