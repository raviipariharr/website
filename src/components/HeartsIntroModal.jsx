import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';
import { useHearts } from './HeartsContext.jsx';

function HeartsIntroModal({ onClose }) {
  const { totalHearts } = useHearts();

  return (
    <Modal onClose={onClose}>
      <h2 className="editor-heading">A Hidden Game</h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          lineHeight: 1.6,
          fontSize: 'var(--font-body)',
        }}
      >
        {totalHearts} hidden hearts are scattered through the rest of this
        story. Look closely as you go — find them all to unlock something
        special.
      </p>
      <Button variant="primary" fullWidth onClick={onClose}>
        Got it
      </Button>
    </Modal>
  );
}

export default HeartsIntroModal;