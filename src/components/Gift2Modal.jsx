import Modal from './ui/Modal.jsx';

function Gift2Modal({ onClose, content }) {
  const { label, message } = content;

  return (
    <Modal onClose={onClose}>
      <p className="editor-trailer-status" style={{ marginBottom: 4 }}>
        GIFT TWO — A FUTURE GIFT
      </p>
      <h2 className="editor-heading">{label || "This gift isn't for today."}</h2>
      <p
        style={{
          color: 'var(--text-primary)',
          fontStyle: 'italic',
          lineHeight: 1.7,
          fontSize: 'var(--font-heading)',
        }}
      >
        {message || "Open this when you need a reminder that you're loved."}
      </p>
    </Modal>
  );
}

export default Gift2Modal;