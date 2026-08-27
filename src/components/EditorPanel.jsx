import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';
import TimeMachineEditorSection from './TimeMachineEditorSection.jsx';
import MuseumEditorSection from './MuseumEditorSection.jsx';
import SisterAwardsEditorSection from './SisterAwardsEditorSection.jsx';
import SecretRoomEditorSection from './SecretRoomEditorSection.jsx';
import Gift1UploadSection from './Gift1UploadSection.jsx';
import Gift3MessagesEditorSection from './Gift3MessagesEditorSection.jsx';

const SITE_SLUG = 'default';
const TRAILER_STORAGE_PATH = 'trailer/trailer.mp4';

const GIFT1_TYPES = [
  { value: 'file', label: 'Downloadable File' },
  { value: 'wallpaper', label: 'Digital Wallpaper' },
  { value: 'pdf', label: 'PDF' },
  { value: 'playlist', label: 'Playlist Link' },
  { value: 'voucher', label: 'Digital Voucher' },
  { value: 'custom_card', label: 'Custom Digital Card' },
  { value: 'other', label: 'Other' },
];

function EditorPanel() {
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadRow() {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('slug', SITE_SLUG)
        .single();

      if (!error && data) {
        setForm(data);
      }
      setLoading(false);
    }

    loadRow();
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('site_content')
      .update({
        recipient_name: form.recipient_name,
        relationship: form.relationship,
        birthday_date: form.birthday_date,
        title: form.title,
        subtitle: form.subtitle,
        genre: form.genre,
        final_message: form.final_message,
        hearts_reward_message: form.hearts_reward_message,
        secret_room_password: form.secret_room_password,
        secret_room_hint: form.secret_room_hint,
        secret_room_note: form.secret_room_note,
        gift1_type: form.gift1_type,
        gift1_label: form.gift1_label,
        gift1_subtitle: form.gift1_subtitle,
        gift1_description: form.gift1_description,
        gift1_link_url: form.gift1_link_url,
        gift1_button_label: form.gift1_button_label,
        gift2_label: form.gift2_label,
        gift2_message: form.gift2_message,
      })
      .eq('slug', SITE_SLUG);

    if (error) {
      showToast('Something went wrong saving — try again.', 'error');
    } else {
      showToast('Saved — visitors will see this instantly.', 'success');
    }

    setSaving(false);
  }

  async function handleUploadTrailer() {
    if (!selectedFile) {
      showToast('Choose a video file first.', 'error');
      return;
    }

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(TRAILER_STORAGE_PATH, selectedFile, {
        upsert: true,
        contentType: selectedFile.type,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      showToast('Upload failed — try again.', 'error');
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(TRAILER_STORAGE_PATH);

    const freshUrl = `${publicUrlData.publicUrl}?updated=${Date.now()}`;

    const { error: dbError } = await supabase
      .from('site_content')
      .update({ trailer_video_url: freshUrl })
      .eq('slug', SITE_SLUG);

    if (dbError) {
      showToast('Video uploaded, but saving the link failed.', 'error');
    } else {
      showToast('Trailer uploaded — visitors will see it now.', 'success');
      setForm((prev) => ({ ...prev, trailer_video_url: freshUrl }));
      setSelectedFile(null);
    }

    setUploading(false);
  }

  if (loading) {
    return <p className="editor-loading">Loading current content...</p>;
  }

  if (!form) {
    return <p className="editor-error">Couldn't load content to edit.</p>;
  }

  return (
    <>
      <form className="editor-form" onSubmit={handleSave}>
        <h2 className="editor-heading">Edit Site Content</h2>

        <label className="editor-label">
          Recipient Name
          <input
            className="editor-input"
            value={form.recipient_name || ''}
            onChange={(e) => handleChange('recipient_name', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Relationship
          <input
            className="editor-input"
            value={form.relationship || ''}
            onChange={(e) => handleChange('relationship', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Birthday Date
          <input
            className="editor-input"
            type="date"
            value={form.birthday_date || ''}
            onChange={(e) => handleChange('birthday_date', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Title
          <input
            className="editor-input"
            value={form.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Subtitle
          <input
            className="editor-input"
            value={form.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Genre
          <input
            className="editor-input"
            value={form.genre || ''}
            onChange={(e) => handleChange('genre', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Final Message
          <textarea
            className="editor-input editor-textarea"
            value={form.final_message || ''}
            onChange={(e) => handleChange('final_message', e.target.value)}
            rows={3}
          />
        </label>

        <label className="editor-label">
          Hidden Hearts Reward Message
          <textarea
            className="editor-input editor-textarea"
            value={form.hearts_reward_message || ''}
            onChange={(e) =>
              handleChange('hearts_reward_message', e.target.value)
            }
            rows={2}
          />
        </label>

        <label className="editor-label">
          Secret Room Password
          <input
            className="editor-input"
            value={form.secret_room_password || ''}
            onChange={(e) => handleChange('secret_room_password', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Secret Room Hint
          <input
            className="editor-input"
            value={form.secret_room_hint || ''}
            onChange={(e) => handleChange('secret_room_hint', e.target.value)}
          />
        </label>

        <label className="editor-label">
          Secret Room Note
          <textarea
            className="editor-input editor-textarea"
            value={form.secret_room_note || ''}
            onChange={(e) => handleChange('secret_room_note', e.target.value)}
            rows={3}
          />
        </label>

        <div className="editor-divider" />
        <p className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
          Gift One
        </p>

        <label className="editor-label">
          Gift Type
          <select
            className="editor-input"
            value={form.gift1_type || 'file'}
            onChange={(e) => handleChange('gift1_type', e.target.value)}
          >
            {GIFT1_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-label">
          Label
          <input
            className="editor-input"
            value={form.gift1_label || ''}
            onChange={(e) => handleChange('gift1_label', e.target.value)}
            placeholder="YOUR FIRST GIFT"
          />
        </label>

        <label className="editor-label">
          Subtitle
          <input
            className="editor-input"
            value={form.gift1_subtitle || ''}
            onChange={(e) => handleChange('gift1_subtitle', e.target.value)}
            placeholder="Something you can actually keep."
          />
        </label>

        <label className="editor-label">
          Description (used for the message on voucher / custom card types)
          <textarea
            className="editor-input editor-textarea"
            value={form.gift1_description || ''}
            onChange={(e) => handleChange('gift1_description', e.target.value)}
            rows={2}
          />
        </label>

        <label className="editor-label">
          Link URL (used for Playlist / Other types, instead of a file)
          <input
            className="editor-input"
            value={form.gift1_link_url || ''}
            onChange={(e) => handleChange('gift1_link_url', e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="editor-label">
          Button Label
          <input
            className="editor-input"
            value={form.gift1_button_label || ''}
            onChange={(e) => handleChange('gift1_button_label', e.target.value)}
            placeholder="DOWNLOAD YOUR GIFT"
          />
        </label>

        <div className="editor-divider" />
        <p className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
          Gift Two — A Future Gift
        </p>

        <label className="editor-label">
          Label
          <input
            className="editor-input"
            value={form.gift2_label || ''}
            onChange={(e) => handleChange('gift2_label', e.target.value)}
            placeholder="This gift isn't for today."
          />
        </label>

        <label className="editor-label">
          Message
          <textarea
            className="editor-input editor-textarea"
            value={form.gift2_message || ''}
            onChange={(e) => handleChange('gift2_message', e.target.value)}
            rows={3}
            placeholder="Open this when you need a reminder that you're loved."
          />
        </label>

        <Button type="submit" fullWidth disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>

      <div className="editor-divider" />

      <div className="editor-form">
        <h2 className="editor-heading">Trailer Video</h2>

        {form.trailer_video_url && (
          <p className="editor-trailer-status">A trailer is currently live.</p>
        )}

        <label className="editor-label">
          Choose Video File
          <input
            className="editor-input"
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedFile(e.target.files[0] || null)}
          />
        </label>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={uploading}
          onClick={handleUploadTrailer}
        >
          {uploading ? 'Uploading...' : 'Upload Trailer'}
        </Button>
      </div>

      <div className="editor-divider" />

      <TimeMachineEditorSection />

      <div className="editor-divider" />

      <MuseumEditorSection />

      <div className="editor-divider" />

      <SisterAwardsEditorSection />

      <div className="editor-divider" />

      <Gift1UploadSection
        currentFileUrl={form.gift1_file_url}
        onFileUploaded={(url) => setForm((prev) => ({ ...prev, gift1_file_url: url }))}
      />

      <div className="editor-divider" />

      <Gift3MessagesEditorSection />

      <div className="editor-divider" />

      <SecretRoomEditorSection
        currentPhotoUrl={form.secret_room_photo_url}
        onPhotoUploaded={(url) =>
          setForm((prev) => ({ ...prev, secret_room_photo_url: url }))
        }
      />
    </>
  );
}

export default EditorPanel;