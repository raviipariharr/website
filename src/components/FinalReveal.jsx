import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent.js';
import Button from './ui/Button.jsx';
import './FinalReveal.css';

const CONFETTI_COUNT = 45;
const CONFETTI_COLORS = ['gold', 'purple', 'white'];

function FinalReveal() {
  const { content } = useSiteContent();
  const { recipientName, message } = content.finalReveal;

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