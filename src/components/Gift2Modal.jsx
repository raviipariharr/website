import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

const OPTIONS = [
  { id: 'argument', emoji: '😂', label: 'Start an unnecessary argument?' },
  { id: 'love', emoji: '❤️', label: 'Say "I love you" first?' },
  { id: 'steal', emoji: '🤦', label: 'Steal the other\'s stuff?' },
];

function fillName(template, name) {
  const who = name || 'you';
  return (template || '').split('{name}').join(who);
}

function Gift2Modal({ onClose }) {
  const { content } = useSiteContent();
  const [choice, setChoice] = useState(null);

  const recipientName = content.finalReveal?.recipientName;
  const { resultArgument, resultLove, resultSteal } = content.gift2;

  const resultTemplates = {
    argument: resultArgument,
    love: resultLove,
    steal: resultSteal,
  };

  return (
    <Modal onClose={onClose}>
      <p className="editor-trailer-status" style={{ marginBottom: 4 }}>
        WAIT...
      </p>
      <h2 className="editor-heading">This box contains a question.</h2>

      <AnimatePresence mode="wait">
        {!choice ? (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: 'var(--font-body)',
                marginBottom: 'var(--space-md)',
              }}
            >
              Who is more likely to...
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChoice(opt.id)}
                  className="editor-entry-row"
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: 'flex-start',
                    gap: 10,
                  }}
                >
                  <span>{opt.emoji}</span>
                  <span className="editor-entry-label" style={{ whiteSpace: 'normal' }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.p
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              color: 'var(--accent-gold)',
              fontSize: 'var(--font-heading)',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            {fillName(resultTemplates[choice], recipientName)}
          </motion.p>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default Gift2Modal;