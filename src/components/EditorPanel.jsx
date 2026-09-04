import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';
import TimeMachineEditorSection from './TimeMachineEditorSection.jsx';
import MuseumEditorSection from './MuseumEditorSection.jsx';
import SisterAwardsEditorSection from './SisterAwardsEditorSection.jsx';
import SecretRoomEditorSection from './SecretRoomEditorSection.jsx';
import QuizEditorSection from './QuizEditorSection.jsx';
import BackgroundMusicUploadSection from './BackgroundMusicUploadSection.jsx';
import Gift2CakeUploadSection from './Gift2CakeUploadSection.jsx';
import FinalVideoUploadSection from './FinalVideoUploadSection.jsx';
import { defaultContent } from '../data/defaultContent.js';

const SITE_SLUG = 'default';
const TRAILER_STORAGE_PATH = 'trailer/trailer.mp4';

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

  async function handleSave() {
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
        gift1_line1: form.gift1_line1,
        gift1_line2: form.gift1_line2,
        gift1_line3: form.gift1_line3,
        gift2_intro_text: form.gift2_intro_text,
        gift2_final_text: form.gift2_final_text,
        gift3_message: form.gift3_message,
        quiz_end_message: form.quiz_end_message,
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
    <div className="editor-form">
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
        Gift One — Funny Surprise
      </p>

      <label className="editor-label">
        Line 1
        <input
          className="editor-input"
          value={form.gift1_line1 || ''}
          onChange={(e) => handleChange('gift1_line1', e.target.value)}
          placeholder={defaultContent.gift1.line1}
        />
      </label>

      <label className="editor-label">
        Line 2
        <input
          className="editor-input"
          value={form.gift1_line2 || ''}
          onChange={(e) => handleChange('gift1_line2', e.target.value)}
          placeholder={defaultContent.gift1.line2}
        />
      </label>

      <label className="editor-label">
        Line 3 (the punchline)
        <input
          className="editor-input"
          value={form.gift1_line3 || ''}
          onChange={(e) => handleChange('gift1_line3', e.target.value)}
          placeholder={defaultContent.gift1.line3}
        />
      </label>

      <div className="editor-divider" />
      <p className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Gift Two — Cake Text
      </p>

      <label className="editor-label">
        Intro Text (shown with the whole cake)
        <input
          className="editor-input"
          value={form.gift2_intro_text || ''}
          onChange={(e) => handleChange('gift2_intro_text', e.target.value)}
          placeholder={defaultContent.gift2.introText}
        />
      </label>

      <label className="editor-label">
        Final Text (shown after cutting)
        <textarea
          className="editor-input editor-textarea"
          value={form.gift2_final_text || ''}
          onChange={(e) => handleChange('gift2_final_text', e.target.value)}
          placeholder={defaultContent.gift2.finalText}
          rows={2}
        />
      </label>

      <div className="editor-divider" />
      <p className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Gift Three — Mystery Message
      </p>

      <label className="editor-label">
        Message
        <textarea
          className="editor-input editor-textarea"
          value={form.gift3_message || ''}
          onChange={(e) => handleChange('gift3_message', e.target.value)}
          placeholder={defaultContent.gift3.message}
          rows={2}
        />
      </label>

      <div className="editor-divider" />
      <p className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Quiz End Message
      </p>

      <label className="editor-label">
        Message
        <textarea
          className="editor-input editor-textarea"
          value={form.quiz_end_message || ''}
          onChange={(e) => handleChange('quiz_end_message', e.target.value)}
          placeholder={defaultContent.quiz.endMessage}
          rows={2}
        />
      </label>

      <div className="editor-divider" />

      <div>
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

      <QuizEditorSection />

      <div className="editor-divider" />

      <Gift2CakeUploadSection
        currentBeforeUrl={form.gift2_cake_before_url}
        currentAfterUrl={form.gift2_cake_after_url}
        onUpdated={({ beforeUrl, afterUrl }) =>
          setForm((prev) => ({
            ...prev,
            ...(beforeUrl ? { gift2_cake_before_url: beforeUrl } : {}),
            ...(afterUrl ? { gift2_cake_after_url: afterUrl } : {}),
          }))
        }
      />

      <div className="editor-divider" />

      <BackgroundMusicUploadSection
        currentMusicUrl={form.background_music_url}
        onMusicUploaded={(url) =>
          setForm((prev) => ({ ...prev, background_music_url: url }))
        }
      />

      <div className="editor-divider" />

      <SecretRoomEditorSection
        currentPhotoUrl={form.secret_room_photo_url}
        onPhotoUploaded={(url) =>
          setForm((prev) => ({ ...prev, secret_room_photo_url: url }))
        }
      />

      <div className="editor-divider" />

      <FinalVideoUploadSection
        currentVideoUrl={form.final_video_note_url}
        onVideoUploaded={(url) =>
          setForm((prev) => ({ ...prev, final_video_note_url: url }))
        }
      />

      <div className="editor-divider" />

      <Button type="button" fullWidth disabled={saving} onClick={handleSave}>
        {saving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}

export default EditorPanel;