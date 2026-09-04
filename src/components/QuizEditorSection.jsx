import { useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useQuizQuestions } from '../hooks/useQuizQuestions.js';
import { useToast } from './ui/ToastContext.jsx';
import Button from './ui/Button.jsx';

function QuizEditorSection() {
  const { showToast } = useToast();
  const { questions, loading } = useQuizQuestions();

  const [questionText, setQuestionText] = useState('');
  const [optionsText, setOptionsText] = useState('Me, You, Both equally');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const parsedOptions = useMemo(() => {
    return optionsText
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
  }, [optionsText]);

  async function handleAdd(e) {
    e.preventDefault();

    if (!questionText || parsedOptions.length < 2) {
      showToast('Add a question and at least two options.', 'error');
      return;
    }

    if (!correctAnswer) {
      showToast('Pick which option is correct.', 'error');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('quiz_questions').insert({
      question_text: questionText,
      options: parsedOptions,
      correct_answer: correctAnswer,
    });

    if (error) {
      console.error('Insert error:', error);
      showToast('Something went wrong adding that question.', 'error');
    } else {
      showToast('Question added.', 'success');
      setQuestionText('');
      setOptionsText('Me, You, Both equally');
      setCorrectAnswer('');
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    setDeletingId(id);

    const { error } = await supabase.from('quiz_questions').delete().eq('id', id);

    if (error) {
      showToast("Couldn't delete that question — try again.", 'error');
    } else {
      showToast('Question removed.', 'success');
    }

    setDeletingId(null);
  }

  return (
    <div className="editor-form">
      <h2 className="editor-heading" style={{ fontSize: 'var(--font-body)' }}>
        Quiz — How Well Do You Know Us?
      </h2>

      <form onSubmit={handleAdd} className="editor-form">
        <label className="editor-label">
          Question
          <input
            className="editor-input"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. Who starts fights first?"
          />
        </label>

        <label className="editor-label">
          Options (comma-separated, at least 2)
          <input
            className="editor-input"
            value={optionsText}
            onChange={(e) => {
              setOptionsText(e.target.value);
              // If the previously-picked correct answer no longer
              // exists among the edited options, clear the selection
              // so it can never point at something invalid.
              const stillValid = e.target.value
                .split(',')
                .map((o) => o.trim())
                .includes(correctAnswer);
              if (!stillValid) setCorrectAnswer('');
            }}
            placeholder="Me, You, Both equally"
          />
        </label>

        <label className="editor-label">
          Correct Answer
          <select
            className="editor-input"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            disabled={parsedOptions.length === 0}
          >
            <option value="">
              {parsedOptions.length === 0 ? 'Type options first' : 'Select the correct option'}
            </option>
            {parsedOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" variant="secondary" fullWidth disabled={saving}>
          {saving ? 'Adding...' : 'Add Question'}
        </Button>
      </form>

      <div className="editor-divider" />

      <p className="editor-trailer-status">
        {loading
          ? 'Loading questions...'
          : `${questions.length} question${questions.length === 1 ? '' : 's'} added`}
      </p>

      <div className="editor-entry-list">
        {questions.map((q) => (
          <div className="editor-entry-row" key={q.id}>
            <span className="editor-entry-label">
              {q.question_text}
              {q.correct_answer ? ` (✓ ${q.correct_answer})` : ' (no correct answer set)'}
            </span>
            <button
              type="button"
              className="editor-entry-delete"
              onClick={() => handleDelete(q.id)}
              disabled={deletingId === q.id}
            >
              {deletingId === q.id ? '...' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizEditorSection;