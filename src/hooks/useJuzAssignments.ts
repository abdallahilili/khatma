import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { JuzAssignment, Khatma } from '../types';

export function useJuzAssignments(khatmaId: string | undefined) {
  const [khatma, setKhatma] = useState<Khatma | null>(null);
  const [assignments, setAssignments] = useState<JuzAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isInitial = false) => {
    if (!khatmaId) return;
    try {
      if (isInitial) setLoading(true);
      // Fetch khatma details
      const { data: khatmaData, error: khatmaError } = await supabase
        .from('khatma')
        .select('*')
        .eq('id', khatmaId)
        .single();

      if (khatmaError) throw khatmaError;
      setKhatma(khatmaData || null);

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('juz_assignment')
        .select('*')
        .eq('khatma_id', khatmaId);

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Error fetching assignments:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [khatmaId]);

  useEffect(() => {
    fetchData(true);

    if (!khatmaId) return;

    const subscription = supabase
      .channel(`juz_assignments_${khatmaId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'juz_assignment',
          filter: `khatma_id=eq.${khatmaId}`,
        },
        () => {
          fetchData(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [khatmaId, fetchData]);

  return { khatma, assignments, loading, error, refresh: fetchData };
}

export async function updateAssignment(id: string, updates: Partial<JuzAssignment>) {
  const { error } = await supabase
    .from('juz_assignment')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function deleteAssignment(id: string) {
  const { error } = await supabase
    .from('juz_assignment')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
