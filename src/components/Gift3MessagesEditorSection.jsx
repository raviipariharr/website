import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useGift3Messages } from '../hooks/useGift3Messages.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

function Gift3MessagesEditorSection() {
  const { showToast } = useToast();
  const { messages, loading } = useGift3Messages();

  const [conditionLabel, setConditionLabel] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();

    if (!conditionLabel || !message) {
      showToast('Add both a moment and a message.', 'error');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('gift3_messages')
      .insert({ condition_label: conditionLabel, message });

    if (error) {
      showToast('Something went wrong adding that message.', 'error');
    } else {
      showToast('Message added.', 'success');
      setConditionLabel('');
      setMessage('');
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);

    const { error } = await supabase.from('gift3_messages').delete().eq('id', id);

    if (error) {
      showToast("Couldn't delete that message — try again.", 'error');
    } else {
      showToast('Message removed.', 'success');
    }

    setDeletingId(null);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Gift Three — Messages
      </h2>

      <form onSubmit={handleAdd} className="editor-form">
        <label className="editor-label">
          Moment (when to open)
          <input
            className="editor-input"
            value={conditionLabel}
            onChange={(e) => setConditionLabel(e.target.value)}
            placeholder="e.g. Open when you miss me"
          />
        </label>

        <label className="editor-label">
          Message
          <textarea
            className="editor-input editor-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </label>

        <Button type="submit" variant="secondary" fullWidth disabled={saving}>
          {saving ? 'Adding...' : 'Add Message'}
        </Button>
      </form>

      <div className="editor-divider" />

      <p className="editor-trailer-status">
        {loading
          ? 'Loading messages...'
          : `${messages.length} message${messages.length === 1 ? '' : 's'} added`}
      </p>

      <div className="editor-entry-list">
        {messages.map((m) => (
          <div className="editor-entry-row" key={m.id}>
            <span className="editor-entry-label">{m.condition_label}</span>
            <button
              type="button"
              className="editor-entry-delete"
              onClick={() => handleDelete(m.id)}
              disabled={deletingId === m.id}
            >
              {deletingId === m.id ? '...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gift3MessagesEditorSection;