import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

const SITE_SLUG = 'default';
const MUSIC_STORAGE_PATH = 'background-music/track';

function BackgroundMusicUploadSection({ currentMusicUrl, onMusicUploaded }) {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      showToast('Choose an audio file first.', 'error');
      return;
    }

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(MUSIC_STORAGE_PATH, file, {
        upsert: true,
        contentType: file.type || 'audio/mpeg',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Upload failed — try again.', 'error');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(MUSIC_STORAGE_PATH);

    const freshUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('site_content')
      .update({ background_music_url: freshUrl })
      .eq('slug', SITE_SLUG);

    if (dbError) {
      showToast('Music uploaded, but saving it failed.', 'error');
    } else {
      showToast('Background music updated.', 'success');
      setFile(null);
      onMusicUploaded?.(freshUrl);
    }

    setUploading(false);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Background Music
      </h2>

      {currentMusicUrl && (
        <p className="editor-trailer-status">Background music is currently set.</p>
      )}

      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-caption)' }}>
        Plays quietly on loop through the whole site, and pauses automatically
        while the trailer video is playing.
      </p>

      <label className="editor-label">
        Upload Audio File
        <input
          className="editor-input"
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
      </label>

      <Button type="button" variant="secondary" fullWidth disabled={uploading} onClick={handleUpload}>
        {uploading ? 'Uploading...' : 'Upload Music'}
      </Button>
    </div>
  );
}

export default BackgroundMusicUploadSection;