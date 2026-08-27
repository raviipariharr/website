import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal.jsx';
import { useGift3Messages } from '../hooks/useGift3Messages.js';

function Gift3Modal({ onClose }) {
  const { messages, loading } = useGift3Messages();
  const [selectedId, setSelectedId] = useState(null);

  const selected = messages.find((m) => m.id === selectedId);

  return (
    <Modal onClose={onClose}>
      <p className="editor-trailer-status" style={{ marginBottom: 4 }}>
        GIFT THREE
      </p>
      <h2 className="editor-heading">Messages for different moments</h2>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>}
      {!loading && messages.length === 0 && (
        <p style={{ color: 'var(--text-secondary)' }}>
          This gift hasn't been set up yet.
        </p>
      )}

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {messages.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                className="editor-entry-row"
                style={{ textAlign: 'left', cursor: 'pointer', width: '100%' }}
              >
                <span className="editor-entry-label">{m.condition_label}</span>
                <span style={{ color: 'var(--accent-gold)', fontSize: 'var(--font-caption)' }}>
                  Open →
                </span>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p style={{ color: 'var(--accent-gold)', fontSize: 'var(--font-caption)', marginBottom: 12 }}>
              {selected.condition_label}
            </p>
            <p
              style={{
                color: 'var(--text-primary)',
                fontStyle: 'italic',
                lineHeight: 1.7,
                fontSize: 'var(--font-heading)',
                marginBottom: 'var(--space-md)',
              }}
            >
              {selected.message}
            </p>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                fontSize: 'var(--font-caption)',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              ← Back to messages
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default Gift3Modal;  