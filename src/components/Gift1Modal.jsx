import { motion } from 'framer-motion';
import Modal from './ui/Modal.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

function Gift1Modal({ onClose }) {
  const { content } = useSiteContent();
  const { line1, line2, line3 } = content.gift1;

  return (
    <Modal onClose={onClose}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="editor-trailer-status"
        style={{ fontSize: 'var(--font-caption)', marginBottom: 8 }}
      >
        {line1}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-body)',
          marginBottom: 8,
        }}
      >
        {line2}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="editor-heading"
        style={{ marginBottom: 0 }}
      >
        {line3}
      </motion.h2>
    </Modal>
  );
}

export default Gift1Modal;