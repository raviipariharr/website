import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button.jsx';
import { useBackgroundMusic } from '../context/BackgroundMusicContext.jsx';
import './TrailerPlayer.css';

function TrailerPlayer({ videoUrl, onClose, onContinue }) {
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);
  const { pause, resume } = useBackgroundMusic();

  useEffect(() => {
    pause();
    return () => {
      resume();
    };
  }, [pause, resume]);

  return (
    <motion.div
      className="trailer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button className="trailer-close" onClick={onClose} aria-label="Close trailer">
        ✕
      </button>

      <video
        ref={videoRef}
        className="trailer-video"
        src={videoUrl}
        autoPlay
        playsInline
        controls
        onEnded={() => setEnded(true)}
      />

      {ended && (
        <motion.div
          className="trailer-continue"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button variant="primary" onClick={onContinue}>
            CONTINUE →
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default TrailerPlayer;