import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

const SITE_SLUG = 'default';
const SECRET_PHOTO_PATH = 'secret-room/photo';

function SecretRoomEditorSection({ currentPhotoUrl, onPhotoUploaded }) {
  const { showToast } = useToast();
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  async function handleUploadPhoto() {
    if (!photoFile) {
      showToast('Choose a photo first.', 'error');
      return;
    }

    setUploadingPhoto(true);

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(SECRET_PHOTO_PATH, photoFile, {
        upsert: true,
        contentType: photoFile.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Photo upload failed — try again.', 'error');
      setUploadingPhoto(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(SECRET_PHOTO_PATH);

    const freshUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('site_content')
      .update({ secret_room_photo_url: freshUrl })
      .eq('slug', SITE_SLUG);

    if (dbError) {
      showToast('Photo uploaded, but saving it failed.', 'error');
    } else {
      showToast('Secret room photo updated.', 'success');
      setPhotoFile(null);
      onPhotoUploaded?.(freshUrl);
    }

    setUploadingPhoto(false);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Secret Room Photo
      </h2>

      {currentPhotoUrl && (
        <p className="editor-trailer-status">A secret photo is currently set.</p>
      )}

      <label className="editor-label">
        Secret Photo
        <input
          className="editor-input"
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files[0] || null)}
        />
      </label>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={uploadingPhoto}
        onClick={handleUploadPhoto}
      >
        {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
      </Button>
    </div>
  );
}

export default SecretRoomEditorSection;