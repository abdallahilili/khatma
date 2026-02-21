import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { KhatmaGroup } from '../types';

export function useGroups(searchQuery: string) {
  const [groups, setGroups] = useState<KhatmaGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('khatma_group')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query.limit(20);
      if (error) throw error;
      setGroups(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return { groups, loading, error, refresh: fetchGroups };
}

/** Calls the find_or_create_group RPC and returns the group id */
export async function findOrCreateGroup(groupName: string): Promise<string> {
  const { data, error } = await supabase.rpc('find_or_create_group', {
    group_name: groupName.trim(),
  });
  if (error) throw new Error(error.message);
  return data as string;
}
