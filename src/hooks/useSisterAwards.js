import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useSisterAwards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAwards = useCallback(async () => {
    const { data, error } = await supabase
      .from('sister_awards')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setAwards(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAwards();

    const channel = supabase
      .channel('sister_awards_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sister_awards' },
        () => {
          fetchAwards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAwards]);

  return { awards, loading, refetch: fetchAwards };
}