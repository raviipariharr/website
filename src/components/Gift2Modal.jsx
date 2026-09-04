import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

function Gift2Modal({ onClose }) {
  const { content } = useSiteContent();
  const [cut, setCut] = useState(false);

  const { introText, finalText, cakeBeforeUrl, cakeAfterUrl } = content.gift2;

  if (!cakeBeforeUrl && !cakeAfterUrl) {
    return (
      <Modal onClose={onClose}>
        <p className="editor-trailer-status" style={{ marginBottom: 4 }}>
          GIFT TWO
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-caption)' }}>
          This gift hasn't been set up yet.
        </p>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <AnimatePresence mode="wait">
        {!cut ? (
          <motion.div
            key="before"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {cakeBeforeUrl && (
              <button
                type="button"
                onClick={() => cakeAfterUrl && setCut(true)}
                disabled={!cakeAfterUrl}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  width: '100%',
                  cursor: cakeAfterUrl ? 'pointer' : 'default',
                }}
              >
                <img
                  src={cakeBeforeUrl}
                  alt="Your cake"
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-md)',
                  }}
                />
              </button>
            )}

            <h2 className="editor-heading">{introText}</h2>

            {cakeAfterUrl && (
              <p style={{ color: 'var(--accent-gold)', fontSize: 'var(--font-caption)' }}>
                Tap the cake to cut it 🔪
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {cakeAfterUrl && (
              <img
                src={cakeAfterUrl}
                alt="The cut cake"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-md)',
                }}
              />
            )}

            <p
              style={{
                color: 'var(--text-primary)',
                fontSize: 'var(--font-heading)',
                fontStyle: 'italic',
                lineHeight: 1.6,
              }}
            >
              {finalText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default Gift2Modal;