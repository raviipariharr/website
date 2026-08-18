import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

function Modal({ children, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="modal-panel"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Modal;