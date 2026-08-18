import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent.js';
import BackgroundEffect from './ui/BackgroundEffect.jsx';
import Button from './ui/Button.jsx';
import LoadingScreen from './ui/LoadingScreen.jsx';
import TrailerPlayer from './TrailerPlayer.jsx';
import './Landing.css';

const SECRET_CLICKS_REQUIRED = 5;
const SECRET_CLICK_WINDOW_MS = 3000;

function Landing({ onSecretUnlock, onTrailerEnd }) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [noTrailerMessage, setNoTrailerMessage] = useState(false);
  const { content, loading } = useSiteContent();

  const clickCount = useRef(0);
  const resetTimer = useRef(null);

  function handleEyebrowClick() {
    clickCount.current += 1;

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, SECRET_CLICK_WINDOW_MS);

    if (clickCount.current >= SECRET_CLICKS_REQUIRED) {
      clickCount.current = 0;
      clearTimeout(resetTimer.current);
      onSecretUnlock();
    }
  }

  function handleWatchTrailer() {
    if (content.landing.trailerVideoUrl) {
      setTrailerOpen(true);
    } else {
      setNoTrailerMessage(true);
    }
  }

  function handleContinue() {
    setTrailerOpen(false);
    onTrailerEnd?.();
  }

  if (loading) {
    return <LoadingScreen />;
  }

  const { eyebrow, title, subtitle, genre, buttonText, trailerVideoUrl } = content.landing;

  return (
    <section className="landing">
      <BackgroundEffect variant="gold" />

      <motion.p
        className="landing-eyebrow"
        onClick={handleEyebrowClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {eyebrow}
      </motion.p>

      <motion.h1
        className="landing-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="landing-subtitle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="landing-genre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        {genre}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <Button variant="secondary" onClick={handleWatchTrailer}>
          {buttonText}
        </Button>
      </motion.div>

      {noTrailerMessage && (
        <motion.p
          className="landing-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your story begins here...
        </motion.p>
      )}

      <AnimatePresence>
        {trailerOpen && (
          <TrailerPlayer
            videoUrl={trailerVideoUrl}
            onClose={() => setTrailerOpen(false)}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default Landing;