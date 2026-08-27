import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useGift3Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('gift3_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('gift3_messages_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gift3_messages' },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  return { messages, loading, refetch: fetchMessages };
}