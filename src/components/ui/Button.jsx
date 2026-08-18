import { motion } from 'framer-motion';
import './Button.css';

function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
}) {
  return (
    <motion.button
      type={type}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;