import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';

export interface RemedyFavorite {
  id: string;
  user_id: string;
  remedy_slug: string;
  created_at: string;
}

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string): Promise<string[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('remedy_favorites')
    .select('remedy_slug')
    .eq('user_id', userId);

  if (error) {
    logger.error('Error fetching favorites:', error);
    return [];
  }

  return data.map((f) => f.remedy_slug);
}

/**
 * Toggle a remedy favorite (add/remove)
 */
export async function toggleFavorite(userId: string, remedySlug: string): Promise<boolean> {
  const supabase = createClient();

  // Check if already favorited
  const { data: existing } = await supabase
    .from('remedy_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('remedy_slug', remedySlug)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('remedy_favorites')
      .delete()
      .eq('id', existing.id);

    if (error) {
      logger.error('Error removing favorite:', error);
      return true; // still favorited
    }
    return false;
  } else {
    // Add favorite
    const { error } = await supabase
      .from('remedy_favorites')
      .insert({ user_id: userId, remedy_slug: remedySlug });

    if (error) {
      logger.error('Error adding favorite:', error);
      return false; // not favorited
    }
    return true;
  }
}

/**
 * Check if a remedy is favorited
 */
export async function isFavorited(userId: string, remedySlug: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('remedy_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('remedy_slug', remedySlug)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Error checking favorite:', error);
  }

  return !!data;
}
