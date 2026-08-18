import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useMuseumEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from('museum_entries')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setEntries(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('museum_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'museum_entries' },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  return { entries, loading, refetch: fetchEntries };
}