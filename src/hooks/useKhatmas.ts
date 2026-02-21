import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { KhatmaWithProgress } from '../types';

export function useKhatmas() {
  const [khatmas, setKhatmas] = useState<KhatmaWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKhatmas = async () => {
    try {
      const { data, error } = await supabase
        .from('khatma_with_progress')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKhatmas(data || []);
    } catch (err: any) {
      console.error('Error fetching khatmas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhatmas();

    // Set up realtime subscription for progress updates
    const subscription = supabase
      .channel('khatma_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'juz_assignment' },
        () => {
          fetchKhatmas();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'khatma' },
        () => {
          fetchKhatmas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { khatmas, loading, error, refresh: fetchKhatmas };
}
