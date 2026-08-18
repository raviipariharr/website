import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useSecretRoomVoiceNotes() {
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVoiceNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from('secret_room_voice_notes')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setVoiceNotes(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVoiceNotes();

    const channel = supabase
      .channel('secret_room_voice_notes_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'secret_room_voice_notes' },
        () => {
          fetchVoiceNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVoiceNotes]);

  return { voiceNotes, loading, refetch: fetchVoiceNotes };
}