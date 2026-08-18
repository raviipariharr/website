import { motion } from 'framer-motion';
import './Card.css';

function Card({ children, hoverable = false, className = '' }) {
  return (
    <motion.div
      className={`card ${className}`}
      whileHover={hoverable ? { scale: 1.02 } : {}}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

export default Card;