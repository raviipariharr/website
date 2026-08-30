import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChime } from '../utils/playChime.js';
import './GiftBox.css';

const STAGE_IDLE = 'idle';
const STAGE_SHAKE = 'shake';
const STAGE_OPEN = 'open';

function GiftParticles() {
  const particles = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    angle: (360 / 14) * i,
    distance: Math.random() * 40 + 40,
  }));

  return (
    <>
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180;
        const x = Math.cos(radians) * p.distance;
        const y = Math.sin(radians) * p.distance;

        return (
          <motion.span
            key={p.id}
            className="gift-particle"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x, y: y - 30, scale: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        );
      })}
    </>
  );
}

function GiftBox({ label, color = 'gold', opened, dramatic = false, onOpened, onClickStart }) {
  const [stage, setStage] = useState(opened ? STAGE_OPEN : STAGE_IDLE);

  function handleClick() {
    if (stage === STAGE_OPEN) {
      onOpened();
      return;
    }
    if (stage !== STAGE_IDLE) return;

    onClickStart?.();

    const shakeDuration = dramatic ? 700 : 450;
    const openDelay = dramatic ? 1600 : 900;

    setStage(STAGE_SHAKE);
    if (!dramatic) playChime();

    setTimeout(() => {
      setStage(STAGE_OPEN);
      if (dramatic) playChime();
    }, shakeDuration);

    setTimeout(() => onOpened(), shakeDuration + openDelay);
  }

  const isOpen = stage === STAGE_OPEN;

  return (
    <div className={`gift-box-wrapper gift-box-${color}`}>
      <motion.div
        className="gift-box"
        onClick={handleClick}
        animate={
          stage === STAGE_SHAKE
            ? { x: [0, -6, 6, -6, 6, 0], rotate: [0, -2, 2, -2, 2, 0] }
            : {}
        }
        transition={{ duration: dramatic ? 0.7 : 0.45 }}
        whileHover={stage === STAGE_IDLE ? { scale: 1.03, y: -4 } : {}}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`gift-box-glow ${dramatic ? 'gift-box-glow-dramatic' : ''}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: dramatic ? 2.4 : 1.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dramatic ? 1.4 : 0.7, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>{isOpen && <GiftParticles />}</AnimatePresence>

        <motion.div
          className="gift-box-lid"
          animate={isOpen ? { rotateX: -120, y: -14 } : { rotateX: 0, y: 0 }}
          transition={{ duration: dramatic ? 1.1 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="gift-box-base" />
      </motion.div>

      <p className="gift-box-label">{isOpen ? 'Opened ♥' : label}</p>
    </div>
  );
}

export default GiftBox;