import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../hooks/useSiteContent.js';
import Button from './ui/Button.jsx';
import './SecretRoomChapter.css';

function SecretRoomChapter({ onContinue }) {
  const { content } = useSiteContent();

  const [doorOpened, setDoorOpened] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const secretRoom = content.secretRoom || {};
  const roomReady = !!secretRoom.password;

  function handleUnlock(e) {
    e.preventDefault();

    const correct =
      passwordInput.trim().toLowerCase() ===
      (secretRoom.password || '').trim().toLowerCase();

    if (correct) {
      setUnlocked(true);
      setError(null);
    } else {
      setError('Not quite — try again.');
    }
  }

  return (
    <section className={`secret-room ${unlocked ? 'secret-room-unlocked' : ''}`}>
      <h2 className="secret-room-title">Secret Room</h2>

      {!unlocked && (
        <div className="secret-room-door-area">
          {!roomReady && (
            <p className="secret-room-status">
              This room hasn't been set up yet — nothing to find here right now.
            </p>
          )}

          {roomReady && !doorOpened && (
            <motion.button
              type="button"
              className="secret-room-door"
              onClick={() => setDoorOpened(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="secret-room-door-icon">🚪</span>
              <span className="secret-room-door-label">Click here</span>
            </motion.button>
          )}

          <AnimatePresence>
            {roomReady && doorOpened && (
              <motion.form
                className="editor-form secret-room-form"
                onSubmit={handleUnlock}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4 }}
              >
                {secretRoom.hint && (
                  <p className="secret-room-hint">Hint: {secretRoom.hint}</p>
                )}

                <label className="editor-label">
                  Password
                  <input
                    className="editor-input"
                    type="text"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                </label>

                {error && <p className="editor-error">{error}</p>}

                <Button type="submit" fullWidth>
                  Unlock
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <button type="button" className="secret-room-skip" onClick={onContinue}>
            Skip →
          </button>
        </div>
      )}

      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="secret-room-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {secretRoom.note && <p className="secret-room-note">{secretRoom.note}</p>}

            {secretRoom.photoUrl && (
              <div className="secret-room-photo-frame">
                <img
                  src={secretRoom.photoUrl}
                  alt="A secret memory"
                  className="secret-room-photo"
                />
              </div>
            )}

            <div className="secret-room-continue">
              <Button variant="primary" onClick={onContinue}>
                CONTINUE →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default SecretRoomChapter;