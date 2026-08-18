import Modal from './ui/Modal.jsx';
import { useSiteContent } from '../hooks/useSiteContent.js';

function HeartsRewardModal({ onClose }) {
  const { content } = useSiteContent();
  const message =
    content.hearts?.rewardMessage ||
    "You found them all. That's very on-brand for you.";

  return (
    <Modal onClose={onClose}>
      <h2 className="editor-heading">You Found Them All ♥</h2>
      <p
        style={{
          color: 'var(--accent-gold)',
          fontSize: 'var(--font-heading)',
          lineHeight: 1.6,
          fontStyle: 'italic',
        }}
      >
        {message}
      </p>
    </Modal>
  );
}

export default HeartsRewardModal;