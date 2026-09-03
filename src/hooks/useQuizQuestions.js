import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useQuizQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setQuestions(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuestions();

    const channel = supabase
      .channel('quiz_questions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quiz_questions' },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQuestions]);

  return { questions, loading, refetch: fetchQuestions };
}