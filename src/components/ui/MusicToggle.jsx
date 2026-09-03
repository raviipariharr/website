import { useState } from 'react';
import { useBackgroundMusic } from '../../context/BackgroundMusicContext.jsx';
import './MusicToggle.css';

function MusicToggle() {
  const { toggleMute, hasMusic } = useBackgroundMusic();
  const [muted, setMuted] = useState(false);

  if (!hasMusic) return null;

  function handleClick() {
    const isMuted = toggleMute();
    setMuted(isMuted);
  }

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={handleClick}
      aria-label={muted ? 'Unmute background music' : 'Mute background music'}
    >
      {muted ? '🔇' : '🎵'}
    </button>
  );
}

export default MusicToggle;