import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent.js';
import { useSecretRoomVoiceNotes } from '../hooks/useSecretRoomVoiceNotes.js';
import Button from './ui/Button.jsx';
import './FinalReveal.css';

const CONFETTI_COUNT = 45;
const CONFETTI_COLORS = ['gold', 'purple', 'white'];

function FinalReveal() {
  const { content } = useSiteContent();
  const { recipientName, message } = content.finalReveal;
  const { voiceNotes, loading: voiceLoading } = useSecretRoomVoiceNotes();

  const confetti = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 4}px`,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: Math.random() * 2 + 2.5,
      delay: Math.random() * 1.5,
      xDrift: Math.random() * 80 - 40,
    }));
  }, []);

  return (
    <section className="final-reveal">
      <div className="final-reveal-confetti" aria-hidden="true">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            className={`final-reveal-confetti-piece final-reveal-confetti-${c.color}`}
            style={{ left: c.left, width: c.size, height: c.size }}
            initial={{ y: -40, opacity: 0, x: 0 }}
            animate={{
              y: '110vh',
              opacity: [0, 1, 1, 0],
              x: c.xDrift,
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      <motion.p
        className="final-reveal-eyebrow"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        THE END — OR JUST THE BEGINNING
      </motion.p>

      <motion.h1
        className="final-reveal-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Happy Birthday, {recipientName}
      </motion.h1>

      <motion.p
        className="final-reveal-message"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {message}
      </motion.p>

      {!voiceLoading && voiceNotes.length > 0 && (
        <motion.div
          className="final-reveal-voices"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <p className="final-reveal-voices-title">Voices For You</p>

          <div className="final-reveal-voice-list">
            {voiceNotes.map((note) => (
              <div className="final-reveal-voice-note" key={note.id}>
                <p className="final-reveal-voice-name">{note.speaker_name}</p>
                {note.relationship && (
                  <p className="final-reveal-voice-relationship">
                    {note.relationship}
                  </p>
                )}
                <audio className="final-reveal-audio" controls src={note.audio_url} />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <Button variant="primary" onClick={() => window.location.reload()}>
          Relive the Story
        </Button>
      </motion.div>
    </section>
  );
}

export default FinalReveal;