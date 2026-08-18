import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimeMachineEntries } from '../hooks/useTimeMachineEntries.js';
import BackgroundEffect from './ui/BackgroundEffect.jsx';
import Button from './ui/Button.jsx';
import HiddenHeart from './HiddenHeart.jsx';
import './TimeMachine.css';

function TimeMachine({ onContinue }) {
  const { entries, loading } = useTimeMachineEntries();
  const [revealedYears, setRevealedYears] = useState({});

  function toggleReveal(id) {
    setRevealedYears((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className="time-machine">
      <BackgroundEffect variant="rose" />

      <HiddenHeart id="heart-1" />
      <HiddenHeart id="heart-2" />

      <h2 className="time-machine-title">The Time Machine</h2>

      {loading && <p className="time-machine-status">Loading the timeline...</p>}

      {!loading && entries.length === 0 && (
        <p className="time-machine-status">The story is just getting started...</p>
      )}

      <div className="time-machine-track">
        {entries.map((entry) => {
          const revealed = !!revealedYears[entry.id];

          return (
            <div className="time-machine-entry" key={entry.id}>
              <p className="time-machine-year">{entry.year}</p>

              <motion.div
                className="time-machine-photo-frame"
                onClick={() => toggleReveal(entry.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {revealed ? (
                    <motion.img
                      key="photo"
                      src={entry.photo_url}
                      alt={entry.caption || `Year ${entry.year}`}
                      className="time-machine-photo"
                      initial={{ opacity: 0, filter: 'blur(6px)', scale: 0.98 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : (
                    <motion.div
                      key="prompt"
                      className="time-machine-reveal-prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Tap to reveal
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {revealed && entry.caption && (
                <motion.p
                  className="time-machine-caption"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {entry.caption}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>

      {!loading && (
        <div className="time-machine-continue">
          <Button variant="primary" onClick={onContinue}>
            CONTINUE →
          </Button>
        </div>
      )}
    </section>
  );
}

export default TimeMachine;