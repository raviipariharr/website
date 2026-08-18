import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useTimeMachineEntries } from '../hooks/useTimeMachineEntries.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

function TimeMachineEditorSection() {
  const { showToast } = useToast();
  const { entries, loading } = useTimeMachineEntries();

  const [year, setYear] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAddYear(e) {
    e.preventDefault();

    if (!year || !selectedFile) {
      showToast('Add both a year and a photo.', 'error');
      return;
    }

    setUploading(true);

    const filePath = `timeline/${Date.now()}-${selectedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, selectedFile, { contentType: selectedFile.type });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Photo upload failed — try again.', 'error');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('time_machine_entries')
      .insert({
        year: parseInt(year, 10),
        photo_url: publicUrlData.publicUrl,
        caption: caption || null,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      showToast('Photo uploaded, but saving the year failed.', 'error');
    } else {
      showToast('Year added to the timeline.', 'success');
      setYear('');
      setCaption('');
      setSelectedFile(null);
    }

    setUploading(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);

    const { error } = await supabase
      .from('time_machine_entries')
      .delete()
      .eq('id', id);

    if (error) {
      showToast("Couldn't delete that entry — try again.", 'error');
    } else {
      showToast('Entry removed.', 'success');
    }

    setDeletingId(null);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading">Time Machine</h2>

      <form onSubmit={handleAddYear} className="editor-form">
        <label className="editor-label">
          Year
          <input
            className="editor-input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2010"
          />
        </label>

        <label className="editor-label">
          Photo
          <input
            className="editor-input"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0] || null)}
          />
        </label>

        <label className="editor-label">
          Caption (optional)
          <input
            className="editor-input"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="A one-line memory"
          />
        </label>

        <Button type="submit" variant="secondary" fullWidth disabled={uploading}>
          {uploading ? 'Adding...' : 'Add Year'}
        </Button>
      </form>

      <div className="editor-divider" />

      <p className="editor-trailer-status">
        {loading
          ? 'Loading entries...'
          : `${entries.length} year${entries.length === 1 ? '' : 's'} added`}
      </p>

      <div className="editor-entry-list">
        {entries.map((entry) => (
          <div className="editor-entry-row" key={entry.id}>
            <span className="editor-entry-label">
              {entry.year}
              {entry.caption ? ` — ${entry.caption}` : ''}
            </span>
            <button
              type="button"
              className="editor-entry-delete"
              onClick={() => handleDelete(entry.id)}
              disabled={deletingId === entry.id}
            >
              {deletingId === entry.id ? '...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeMachineEditorSection;