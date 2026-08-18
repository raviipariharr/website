import { useState } from 'react';
import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';
import EditorPanel from './EditorPanel.jsx';
import './Editor.css';

const EDITOR_PASSWORD = '2026';

function EditorGate({ onClose }) {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  function handlePasswordSubmit(e) {
    e.preventDefault();

    if (passwordInput === EDITOR_PASSWORD) {
      setUnlocked(true);
      setPasswordError(null);
    } else {
      setPasswordError('Incorrect password.');
    }
  }

  return (
    <Modal onClose={onClose}>
      {unlocked ? (
        <EditorPanel />
      ) : (
        <form className="editor-form" onSubmit={handlePasswordSubmit}>
          <h2 className="editor-heading">Enter Password</h2>

          <label className="editor-label">
            Password
            <input
              className="editor-input"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
          </label>

          {passwordError && <p className="editor-error">{passwordError}</p>}

          <Button type="submit" fullWidth>
            Unlock
          </Button>
        </form>
      )}
    </Modal>
  );
}

export default EditorGate;