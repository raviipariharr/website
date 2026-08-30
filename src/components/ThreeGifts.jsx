import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBox from './GiftBox.jsx';
import Gift1Modal from './Gift1Modal.jsx';
import Gift2Modal from './Gift2Modal.jsx';
import Gift3Modal from './Gift3Modal.jsx';
import Button from './ui/Button.jsx';
import './ThreeGifts.css';

const FLASH_COLORS = {
  1: 'rgba(212, 175, 106, 0.12)',
  2: 'rgba(183, 126, 224, 0.12)',
};

function ThreeGifts({ onContinue }) {
  const [openedGifts, setOpenedGifts] = useState({ 1: false, 2: false, 3: false });
  const [activeModal, setActiveModal] = useState(null);
  const [flash, setFlash] = useState(null);
  const [mysteryDark, setMysteryDark] = useState(false);

  function markOpened(num) {
    setOpenedGifts((prev) => ({ ...prev, [num]: true }));
    setActiveModal(num);

    if (num === 3) {
      setMysteryDark(false);
    } else {
      setFlash(FLASH_COLORS[num]);
      setTimeout(() => setFlash(null), 1200);
    }
  }

  const openedCount = Object.values(openedGifts).filter(Boolean).length;

  return (
    <section className="three-gifts">
      <AnimatePresence>
        {flash && (
          <motion.div
            className="three-gifts-flash"
            style={{ background: flash }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mysteryDark && (
          <motion.div
            className="three-gifts-mystery-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        )}
      </AnimatePresence>

      <h2 className="three-gifts-title">Three Gifts</h2>
      <p className="three-gifts-subtitle">
        Not everything worth giving comes wrapped.
      </p>

      <div className="three-gifts-row">
        <GiftBox
          label="GIFT ONE"
          color="gold"
          opened={openedGifts[1]}
          onOpened={() => markOpened(1)}
        />
        <GiftBox
          label="GIFT TWO"
          color="rose"
          opened={openedGifts[2]}
          onOpened={() => markOpened(2)}
        />
        <GiftBox
          label="GIFT THREE"
          color="indigo"
          dramatic
          opened={openedGifts[3]}
          onClickStart={() => setMysteryDark(true)}
          onOpened={() => markOpened(3)}
        />
      </div>

      <p className="three-gifts-progress">{openedCount} of 3 gifts opened</p>

      <div className="three-gifts-continue">
        <Button variant="primary" onClick={onContinue}>
          CONTINUE →
        </Button>
      </div>

      <AnimatePresence>
        {activeModal === 1 && <Gift1Modal onClose={() => setActiveModal(null)} />}
        {activeModal === 2 && <Gift2Modal onClose={() => setActiveModal(null)} />}
        {activeModal === 3 && <Gift3Modal onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </section>
  );
}

export default ThreeGifts;