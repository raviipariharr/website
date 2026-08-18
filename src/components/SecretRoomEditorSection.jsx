import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useSecretRoomVoiceNotes } from '../hooks/useSecretRoomVoiceNotes.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

const SITE_SLUG = 'default';
const SECRET_PHOTO_PATH = 'secret-room/photo';

function SecretRoomEditorSection({ currentPhotoUrl, onPhotoUploaded }) {
  const { showToast } = useToast();
  const { voiceNotes, loading } = useSecretRoomVoiceNotes();

  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [speakerName, setSpeakerName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

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

  async function handleAddVoiceNote(e) {
    e.preventDefault();

    if (!speakerName || !audioFile) {
      showToast('Add a name and choose an audio file.', 'error');
      return;
    }

    setUploadingAudio(true);

    const filePath = `secret-room-voice/${Date.now()}-${audioFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filePath, audioFile, { contentType: audioFile.type });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Audio upload failed — try again.', 'error');
      setUploadingAudio(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('secret_room_voice_notes')
      .insert({
        speaker_name: speakerName,
        relationship: relationship || null,
        audio_url: publicUrlData.publicUrl,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      showToast('Audio uploaded, but saving the entry failed.', 'error');
    } else {
      showToast('Voice note added.', 'success');
      setSpeakerName('');
      setRelationship('');
      setAudioFile(null);
    }

    setUploadingAudio(false);
  }

  async function handleDeleteVoiceNote(id) {
    setDeletingId(id);

    const { error } = await supabase
      .from('secret_room_voice_notes')
      .delete()
      .eq('id', id);

    if (error) {
      showToast("Couldn't delete that voice note — try again.", 'error');
    } else {
      showToast('Voice note removed.', 'success');
    }

    setDeletingId(null);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading">Secret Room</h2>

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

      <div className="editor-divider" />

      <p
        className="editor-heading"
        style={{ fontSize: 'var(--font-body)', marginBottom: 'var(--space-sm)' }}
      >
        Voice Notes
      </p>

      <form onSubmit={handleAddVoiceNote} className="editor-form">
        <label className="editor-label">
          Speaker Name
          <input
            className="editor-input"
            value={speakerName}
            onChange={(e) => setSpeakerName(e.target.value)}
            placeholder="e.g. Mom"
          />
        </label>

        <label className="editor-label">
          Relationship (optional)
          <input
            className="editor-input"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g. Your mother"
          />
        </label>

        <label className="editor-label">
          Audio File
          <input
            className="editor-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0] || null)}
          />
        </label>

        <Button type="submit" variant="secondary" fullWidth disabled={uploadingAudio}>
          {uploadingAudio ? 'Adding...' : 'Add Voice Note'}
        </Button>
      </form>

      <div className="editor-divider" />

      <p className="editor-trailer-status">
        {loading
          ? 'Loading voice notes...'
          : `${voiceNotes.length} voice note${voiceNotes.length === 1 ? '' : 's'} added`}
      </p>

      <div className="editor-entry-list">
        {voiceNotes.map((note) => (
          <div className="editor-entry-row" key={note.id}>
            <span className="editor-entry-label">{note.speaker_name}</span>
            <button
              type="button"
              className="editor-entry-delete"
              onClick={() => handleDeleteVoiceNote(note.id)}
              disabled={deletingId === note.id}
            >
              {deletingId === note.id ? '...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SecretRoomEditorSection;