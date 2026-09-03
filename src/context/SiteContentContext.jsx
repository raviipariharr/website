import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { defaultContent } from '../data/defaultContent.js';

const SITE_SLUG = 'default';

function mapRowToContent(data) {
  return {
    landing: {
      eyebrow: defaultContent.landing.eyebrow,
      title: data.title,
      subtitle: data.subtitle,
      genre: data.genre,
      buttonText: defaultContent.landing.buttonText,
      trailerVideoUrl: data.trailer_video_url || null,
    },
    hearts: {
      rewardMessage:
        data.hearts_reward_message || defaultContent.hearts.rewardMessage,
    },
    secretRoom: {
      password: data.secret_room_password || null,
      hint: data.secret_room_hint || '',
      note: data.secret_room_note || '',
      photoUrl: data.secret_room_photo_url || null,
    },
    finalReveal: {
      recipientName: data.recipient_name || defaultContent.finalReveal.recipientName,
      message: data.final_message || defaultContent.finalReveal.message,
    },
    gift1: {
      line1: data.gift1_line1 || defaultContent.gift1.line1,
      line2: data.gift1_line2 || defaultContent.gift1.line2,
      line3: data.gift1_line3 || defaultContent.gift1.line3,
    },
    gift2: {
      resultArgument: data.gift2_result_argument || defaultContent.gift2.resultArgument,
      resultLove: data.gift2_result_love || defaultContent.gift2.resultLove,
      resultSteal: data.gift2_result_steal || defaultContent.gift2.resultSteal,
    },
    gift3: {
      message: data.gift3_message || defaultContent.gift3.message,
    },
    quiz: {
      endMessage: data.quiz_end_message || defaultContent.quiz.endMessage,
    },
    backgroundMusic: {
      url: data.background_music_url || null,
    },
  };
}

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('site_content')
      .select('*')
      .eq('slug', SITE_SLUG)
      .single();

    if (fetchError || !data) {
      console.warn('Falling back to default content:', fetchError?.message);
      setContent(defaultContent);
      setError(fetchError);
    } else {
      setContent(mapRowToContent(data));
      setError(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();

    const channel = supabase
      .channel('site_content_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_content',
          filter: `slug=eq.${SITE_SLUG}`,
        },
        (payload) => {
          setContent(mapRowToContent(payload.new));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContent]);

  return (
    <SiteContentContext.Provider value={{ content, loading, error, refetch: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}