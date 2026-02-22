import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { KhatmaWithProgress } from '../types';

export function useKhatmasByGroup(groupId: string | undefined) {
  const [khatmas, setKhatmas] = useState<KhatmaWithProgress[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKhatmas = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch group name
      const { data: groupData, error: groupError } = await supabase
        .from('khatma_group')
        .select('name')
        .eq('id', groupId)
        .single();
      if (groupError) throw groupError;
      setGroupName(groupData?.name || '');

      // Fetch khatmas with progress for this group
      const { data, error } = await supabase
        .from('khatma_with_progress')
        .select('*')
        .eq('group_name', groupData?.name || '')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKhatmas(data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchKhatmas();

    if (!groupId) return;

    const subscription = supabase
      .channel(`group_khatmas_${groupId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'juz_assignment' }, () => {
        fetchKhatmas();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'khatma' }, () => {
        fetchKhatmas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [groupId, fetchKhatmas]);

  return { khatmas, groupName, loading, error, refresh: fetchKhatmas };
}

export async function updateKhatma(id: string, name: string) {
  const { error } = await supabase
    .from('khatma')
    .update({ name: name.trim() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteKhatma(id: string) {
  const { error } = await supabase
    .from('khatma')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
