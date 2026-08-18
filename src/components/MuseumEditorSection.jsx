import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useMuseumEntries } from '../hooks/useMuseumEntries.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

function MuseumEditorSection() {
  const { showToast } = useToast();
  const { entries, loading } = useMuseumEntries();

  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAddPhoto(e) {
    e.preventDefault();

    if (!selectedFile) {
      showToast('Choose a photo first.', 'error');
      return;
    }

    setUploading(true);

    const filePath = `museum/${Date.now()}-${selectedFile.name}`;

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
      .from('museum_entries')
      .insert({
        photo_url: publicUrlData.publicUrl,
        caption: caption || null,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      showToast('Photo uploaded, but saving the entry failed.', 'error');
    } else {
      showToast('Photo added to the museum.', 'success');
      setCaption('');
      setSelectedFile(null);
    }

    setUploading(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);

    const { error } = await supabase
      .from('museum_entries')
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
      <h2 className="editor-heading">Museum of Memories</h2>

      <form onSubmit={handleAddPhoto} className="editor-form">
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
          {uploading ? 'Adding...' : 'Add Photo'}
        </Button>
      </form>

      <div className="editor-divider" />

      <p className="editor-trailer-status">
        {loading
          ? 'Loading entries...'
          : `${entries.length} photo${entries.length === 1 ? '' : 's'} added`}
      </p>

      <div className="editor-entry-list">
        {entries.map((entry) => (
          <div className="editor-entry-row" key={entry.id}>
            <span className="editor-entry-label">
              {entry.caption || 'Untitled photo'}
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

export default MuseumEditorSection;