import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

const SITE_SLUG = 'default';

function Gift1UploadSection({ currentFileUrl, onFileUploaded }) {
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      showToast('Choose a file first.', 'error');
      return;
    }

    setUploading(true);

    const filePath = `gifts/gift1-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Upload failed — try again.', 'error');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    const freshUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('site_content')
      .update({ gift1_file_url: freshUrl })
      .eq('slug', SITE_SLUG);

    if (dbError) {
      showToast('File uploaded, but saving it failed.', 'error');
    } else {
      showToast('Gift file uploaded.', 'success');
      setFile(null);
      onFileUploaded?.(freshUrl);
    }

    setUploading(false);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Gift One — File
      </h2>

      {currentFileUrl && (
        <p className="editor-trailer-status">A gift file is currently set.</p>
      )}

      <label className="editor-label">
        Upload File (used for File / Wallpaper / PDF gift types)
        <input
          className="editor-input"
          type="file"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />
      </label>

      <Button type="button" variant="secondary" fullWidth disabled={uploading} onClick={handleUpload}>
        {uploading ? 'Uploading...' : 'Upload Gift File'}
      </Button>
    </div>
  );
}

export default Gift1UploadSection;  