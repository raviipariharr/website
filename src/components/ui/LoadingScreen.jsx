import { motion } from 'framer-motion';
import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <motion.div
        className="loading-dot"
        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default LoadingScreen;