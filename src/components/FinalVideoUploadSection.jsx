import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

const SITE_SLUG = 'default';
const VIDEO_STORAGE_PATH = 'final-video-note/video';

function FinalVideoUploadSection({ currentVideoUrl, onVideoUploaded }) {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      showToast('Choose a video file first.', 'error');
      return;
    }

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(VIDEO_STORAGE_PATH, file, {
        upsert: true,
        contentType: file.type || 'video/mp4',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Upload failed — try again.', 'error');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(VIDEO_STORAGE_PATH);

    const freshUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('site_content')
      .update({ final_video_note_url: freshUrl })
      .eq('slug', SITE_SLUG);

    if (dbError) {
      showToast('Video uploaded, but saving it failed.', 'error');
    } else {
      showToast('Final video note updated.', 'success');
      setFile(null);
      onVideoUploaded?.(freshUrl);
    }

    setUploading(false);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Final Video Note
      </h2>

      {currentVideoUrl && (
        <p className="editor-trailer-status">A final video note is currently set.</p>
      )}

      <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-caption)' }}>
        Appears at the very end, right after the final message.
      </p>

      <label className="editor-label">
        Upload Video File
        <input
          className="editor-input"
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
      </label>

      <Button type="button" variant="secondary" fullWidth disabled={uploading} onClick={handleUpload}>
        {uploading ? 'Uploading...' : 'Upload Video'}
      </Button>
    </div>
  );
}

export default FinalVideoUploadSection;