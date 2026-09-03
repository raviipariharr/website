import { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { useSiteContent } from '../hooks/useSiteContent.js';

const BackgroundMusicContext = createContext(null);

export function BackgroundMusicProvider({ children }) {
  const { content } = useSiteContent();
  const audioRef = useRef(null);
  const wantsPlayingRef = useRef(false);

  const musicUrl = content.backgroundMusic?.url;

  const tryPlay = useCallback(() => {
    if (!wantsPlayingRef.current) return;
    if (!audioRef.current || !musicUrl) return;
    audioRef.current.volume = 0.22;
    audioRef.current.play().catch((e) => {
      console.warn('Could not play background music:', e);
    });
  }, [musicUrl]);

  // If the music URL loads after the user already tapped to start
  // (e.g. content was still fetching), catch up once it's ready.
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

  return (
    <BackgroundMusicContext.Provider
      value={{ start, pause, resume, toggleMute, hasMusic: !!musicUrl }}
    >
      <audio ref={audioRef} src={musicUrl || undefined} loop preload="auto" />
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