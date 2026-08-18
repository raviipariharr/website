import { motion } from 'framer-motion';
import { useHearts } from './HeartsContext.jsx';
import './HeartsProgress.css';

function HeartsProgress() {
  const { foundHearts, totalHearts, allFound } = useHearts();

  if (allFound) return null;

  return (
    <motion.div
      className="hearts-progress"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      ♥ {foundHearts.length} / {totalHearts}
    </motion.div>
  );
}

export default HeartsProgress;