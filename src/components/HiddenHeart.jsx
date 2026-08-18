import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHearts } from './HeartsContext.jsx';
import './HiddenHeart.css';

// Keeps hearts off the very edges so they're never half-cut-off
// or sitting exactly behind a fixed button/nav element.
function randomPercent(min, max) {
  return `${Math.floor(Math.random() * (max - min) + min)}%`;
}

function HiddenHeart({ id, top, left }) {
  const { addHeart, isFound } = useHearts();
  const [justFound, setJustFound] = useState(false);
  const found = isFound(id);

  // Generated once per mount and never recalculated — stable
  // for the lifetime of this visit, but different on the next load.
  const position = useRef({
    top: top ?? randomPercent(8, 85),
    left: left ?? randomPercent(8, 85),
  });

  function handleClick() {
    if (found) return;
    setJustFound(true);
    addHeart(id);
  }

  return (
    <motion.button
      type="button"
      className="hidden-heart"
      style={{
        top: position.current.top,
        left: position.current.left,
        pointerEvents: found ? 'none' : 'auto',
      }}
      onClick={handleClick}
      aria-label="Hidden heart"
      animate={
        justFound
          ? { opacity: 0, scale: 1.8 }
          : { opacity: [0.12, 0.35, 0.12], scale: [1, 1.1, 1] }
      }
      transition={
        justFound
          ? { duration: 0.5 }
          : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      ♥
    </motion.button>
  );
}

export default HiddenHeart;