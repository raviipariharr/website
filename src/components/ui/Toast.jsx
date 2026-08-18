import { motion } from 'framer-motion';

function Toast({ message, type }) {
  return (
    <motion.div
      className={`toast toast-${type}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {message}
    </motion.div>
  );
}

export default Toast;