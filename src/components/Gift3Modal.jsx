import { motion } from 'framer-motion';
import Modal from './ui/Modal.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

function Gift3Modal({ onClose }) {
  const { content } = useSiteContent();

  return (
    <Modal onClose={onClose}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          color: 'var(--text-primary)',
          fontSize: 'var(--font-heading)',
          lineHeight: 1.7,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        {content.gift3.message}
      </motion.p>
    </Modal>
  );
}

export default Gift3Modal;