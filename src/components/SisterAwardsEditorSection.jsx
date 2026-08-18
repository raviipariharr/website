import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useSisterAwards } from '../hooks/useSisterAwards.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

function SisterAwardsEditorSection() {
  const { showToast } = useToast();
  const { awards, loading } = useSisterAwards();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAddAward(e) {
    e.preventDefault();

    if (!title) {
      showToast('Give the award a title.', 'error');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('sister_awards')
      .insert({ title, description: description || null });

    if (error) {
      showToast('Something went wrong adding that award.', 'error');
    } else {
      showToast('Award added.', 'success');
      setTitle('');
      setDescription('');
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);

    const { error } = await supabase.from('sister_awards').delete().eq('id', id);

    if (error) {
      showToast("Couldn't delete that award — try again.", 'error');
    } else {
      showToast('Award removed.', 'success');
    }

    setDeletingId(null);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading">Sister Awards</h2>

      <form onSubmit={handleAddAward} className="editor-form">
        <label className="editor-label">
          Award Title
          <input
            className="editor-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best Hugger"
          />
        </label>

        <label className="editor-label">
          Description (optional)
          <input
            className="editor-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A one-line reason why"
          />
        </label>

        <Button type="submit" variant="secondary" fullWidth disabled={saving}>
          {saving ? 'Adding...' : 'Add Award'}
        </Button>
      </form>

      <div className="editor-divider" />

      <p className="editor-trailer-status">
        {loading
          ? 'Loading awards...'
          : `${awards.length} award${awards.length === 1 ? '' : 's'} added`}
      </p>

      <div className="editor-entry-list">
        {awards.map((award) => (
          <div className="editor-entry-row" key={award.id}>
            <span className="editor-entry-label">{award.title}</span>
            <button
              type="button"
              className="editor-entry-delete"
              onClick={() => handleDelete(award.id)}
              disabled={deletingId === award.id}
            >
              {deletingId === award.id ? '...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SisterAwardsEditorSection;