import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playFanfare, playConfettiPops } from '../utils/playChime.js';
import { useBackgroundMusic } from '../context/BackgroundMusicContext.jsx';
import './IntroOverlay.css';

const PIECES_PER_CANNON = 55;
const COLORS = ['gold', 'purple', 'white', 'rose'];

function buildCannon(originX, seedOffset) {
  return Array.from({ length: PIECES_PER_CANNON }).map((_, i) => {
    const id = seedOffset + i;

    const baseAngle = originX === 0 ? -60 : -120;
    const angleSpread = 50;
    const angle = baseAngle + (Math.random() * angleSpread - angleSpread / 2);
    const radians = (angle * Math.PI) / 180;

    const power = Math.random() * 260 + 220;
    const peakX = Math.cos(radians) * power;
    const peakY = Math.sin(radians) * power;

    const shapeRoll = Math.random();
    const shape = shapeRoll < 0.7 ? 'rect' : 'circle';

    return {
      id,
      originX: originX === 0 ? '4%' : '96%',
      peakX,
      peakY,
      fallDistance: Math.random() * 200 + 260,
      drift: Math.random() * 120 - 60,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape,
      size: `${Math.random() * 5 + 5}px`,
      rotations: Math.random() * 3 + 2,
      duration: Math.random() * 1.4 + 2.2,
      delay: Math.random() * 0.25,
    };
  });
}

function IntroConfetti() {
  const pieces = useMemo(() => {
    return [...buildCannon(0, 0), ...buildCannon(1, PIECES_PER_CANNON)];
  }, []);

  return (
    <div className="intro-confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className={`intro-confetti-piece intro-confetti-${p.color} intro-confetti-${p.shape}`}
          style={{
            left: p.originX,
            width: p.size,
            height: p.shape === 'rect' ? `calc(${p.size} * 0.4)` : p.size,
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 1, 0],
            x: [0, p.peakX, p.peakX + p.drift],
            y: [0, p.peakY, p.peakY + p.fallDistance],
            rotate: p.rotations * 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: ['circOut', 'easeIn'],
            times: [0, 0.35, 1],
          }}
        />
      ))}
    </div>
  );
}

function IntroOverlay({ onFinish }) {
  const [stage, setStage] = useState('waiting'); // waiting -> celebrating -> leaving
  const { start: startMusic } = useBackgroundMusic();

  function handleTap() {
    if (stage !== 'waiting') return;

    setStage('celebrating');
    startMusic()

    // Both pops scheduled together on one audio clock — tight,
    // exact 80ms gap instead of drifting.
    playConfettiPops();

    // Fanfare scheduled on the same shared clock, ~220ms after now.
    playFanfare(0.22);

    setTimeout(() => setStage('leaving'), 2600);
  }

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {stage !== 'leaving' && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {stage === 'celebrating' && <IntroConfetti />}

          <AnimatePresence mode="wait">
            {stage === 'waiting' ? (
              <motion.button
                key="tap"
                type="button"
                className="intro-tap-button"
                onClick={handleTap}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="intro-tap-icon">✦</span>
                <span className="intro-tap-label">Tap to begin</span>
              </motion.button>
            ) : (
              <motion.p
                key="message"
                className="intro-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Something special is about to begin...
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IntroOverlay;