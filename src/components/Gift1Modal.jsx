import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';

function Gift1Modal({ onClose, content }) {
  const { label, subtitle, description, fileUrl, linkUrl, buttonLabel } = content;

  const actionUrl = fileUrl || linkUrl;
  const isDownload = !!fileUrl;

  return (
    <Modal onClose={onClose}>
      <p className="editor-trailer-status" style={{ marginBottom: 4 }}>
        {label || 'YOUR FIRST GIFT'}
      </p>

      <h2 className="editor-heading">
        {subtitle || 'Something you can actually keep.'}
      </h2>

      {description && (
        <p
          style={{
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-lg)',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}

      {actionUrl ? (
        <a
          href={actionUrl}
          download={isDownload || undefined}
          target={isDownload ? undefined : '_blank'}
          rel="noreferrer"
          style={{
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <Button variant="primary" fullWidth>
            {buttonLabel ||
              (isDownload ? 'DOWNLOAD YOUR GIFT' : 'OPEN YOUR GIFT')}
          </Button>
        </a>
      ) : (
        <p
          style={{
            color: 'var(--text-tertiary)',
            fontSize: 'var(--font-caption)',
          }}
        >
          This gift hasn't been set up yet.
        </p>
      )}
    </Modal>
  );
}

export default Gift1Modal;