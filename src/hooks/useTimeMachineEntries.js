import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useTimeMachineEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase
      .from('time_machine_entries')
      .select('*')
      .order('year', { ascending: true });

    if (!error && data) {
      setEntries(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();

    // Live editing: any add/delete to this table pushes to every
    // visitor currently on the page, same as the landing content.
    const channel = supabase
      .channel('time_machine_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'time_machine_entries' },
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