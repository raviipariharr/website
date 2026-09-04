import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

const SITE_SLUG = 'default';

function Gift2CakeUploadSection({ currentBeforeUrl, currentAfterUrl, onUpdated }) {
  const { showToast } = useToast();
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  async function uploadImage(file, path, column) {
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/jpeg' });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Upload failed — try again.', 'error');
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from('site-assets').getPublicUrl(path);
    const freshUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('site_content')
      .update({ [column]: freshUrl })
      .eq('slug', SITE_SLUG);

    if (dbError) {
      showToast('Image uploaded, but saving it failed.', 'error');
      return null;
    }

    return freshUrl;
  }

  async function handleUploadBefore() {
    if (!beforeFile) {
      showToast('Choose the whole-cake photo first.', 'error');
      return;
    }
    setUploadingBefore(true);
    const url = await uploadImage(beforeFile, 'gifts/cake-before', 'gift2_cake_before_url');
    if (url) {
      showToast('Whole cake photo updated.', 'success');
      setBeforeFile(null);
      onUpdated?.({ beforeUrl: url });
    }
    setUploadingBefore(false);
  }

  async function handleUploadAfter() {
    if (!afterFile) {
      showToast('Choose the cut-cake photo first.', 'error');
      return;
    }
    setUploadingAfter(true);
    const url = await uploadImage(afterFile, 'gifts/cake-after', 'gift2_cake_after_url');
    if (url) {
      showToast('Cut cake photo updated.', 'success');
      setAfterFile(null);
      onUpdated?.({ afterUrl: url });
    }
    setUploadingAfter(false);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Gift Two — Cake Photos
      </h2>

      {currentBeforeUrl && (
        <p className="editor-trailer-status">Whole cake photo is set.</p>
      )}

      <label className="editor-label">
        Whole Cake Photo (before cutting)
        <input
          className="editor-input"
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeFile(e.target.files[0] || null)}
        />
      </label>

      <Button type="button" variant="secondary" fullWidth disabled={uploadingBefore} onClick={handleUploadBefore}>
        {uploadingBefore ? 'Uploading...' : 'Upload Whole Cake Photo'}
      </Button>

      <div className="editor-divider" />

      {currentAfterUrl && (
        <p className="editor-trailer-status">Cut cake photo is set.</p>
      )}

      <label className="editor-label">
        Cut Cake Photo (after cutting)
        <input
          className="editor-input"
          type="file"
          accept="image/*"
          onChange={(e) => setAfterFile(e.target.files[0] || null)}
        />
      </label>

      <Button type="button" variant="secondary" fullWidth disabled={uploadingAfter} onClick={handleUploadAfter}>
        {uploadingAfter ? 'Uploading...' : 'Upload Cut Cake Photo'}
      </Button>
    </div>
  );
}

export default Gift2CakeUploadSection;