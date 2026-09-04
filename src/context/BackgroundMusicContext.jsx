import { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent.js';

const BackgroundMusicContext = createContext(null);

export function BackgroundMusicProvider({ children }) {
  const { content } = useSiteContent();
  const audioRef = useRef(null);
  const wantsPlayingRef = useRef(false);

  const musicUrl = content.backgroundMusic?.url;

  // Force the element to pick up a new/changed source explicitly —
  // relying on the src attribute alone can leave a stale element
  // that never actually loads the updated file.
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      audioRef.current.load();
    }
  }, [musicUrl]);

  const tryPlay = useCallback(() => {
    if (!wantsPlayingRef.current) return;
    if (!audioRef.current || !musicUrl) return;
    audioRef.current.volume = 0.22;
    audioRef.current.play().catch((e) => {
      console.warn('Could not play background music:', e);
    });
  }, [musicUrl]);

  useEffect(() => {
    tryPlay();
  }, [tryPlay]);

  const start = useCallback(() => {
    wantsPlayingRef.current = true;
    tryPlay();
  }, [tryPlay]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    tryPlay();
  }, [tryPlay]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return false;
    audioRef.current.muted = !audioRef.current.muted;
    return audioRef.current.muted;
  }, []);

  function handleAudioError() {
    const el = audioRef.current;
    console.error(
      'Background music failed to load/play. Element error:',
      el?.error,
      'Source:',
      musicUrl
    );
  }

  return (
    <BackgroundMusicContext.Provider
      value={{ start, pause, resume, toggleMute, hasMusic: !!musicUrl }}
    >
      <audio
        ref={audioRef}
        src={musicUrl || undefined}
        loop
        preload="auto"
        onError={handleAudioError}
      />
      {children}
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error('useBackgroundMusic must be used within a BackgroundMusicProvider');
  }
  return context;
}