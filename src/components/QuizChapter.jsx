import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizQuestions } from '../hooks/useQuizQuestions.js';
import { useSiteContent } from '../hooks/useSiteContent.js';
import Button from './ui/Button.jsx';
import './QuizChapter.css';

function QuizChapter({ onContinue }) {
  const { questions, loading } = useQuizQuestions();
  const { content } = useSiteContent();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  function handleSelect(option) {
    if (selected) return;
    setSelected(option);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 700);
  }

  const showContinue = !loading && (questions.length === 0 || finished);

  return (
    <section className="quiz-chapter">
      <h2 className="quiz-title">How Well Do You Know Us?</h2>
      <p className="quiz-subtitle">A mini quiz about your relationship.</p>

      {loading && <p className="quiz-status">Loading the quiz...</p>}
      {!loading && questions.length === 0 && (
        <p className="quiz-status">The quiz hasn't been set up yet.</p>
      )}

      {!loading && questions.length > 0 && !finished && current && (
        <div className="quiz-card">
          <p className="quiz-progress">
            QUESTION {index + 1} OF {questions.length}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="quiz-question">{current.question_text}</p>

              <div className="quiz-options">
                {(current.options || []).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`quiz-option ${
                      selected === opt ? 'quiz-option-selected' : ''
                    }`}
                    onClick={() => handleSelect(opt)}
                    disabled={!!selected}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {!loading && finished && (
        <motion.div
          className="quiz-end"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="quiz-end-message">{content.quiz?.endMessage}</p>
        </motion.div>
      )}

      {showContinue && (
        <div className="quiz-continue">
          <Button variant="primary" onClick={onContinue}>
            CONTINUE →
          </Button>
        </div>
      )}
    </section>
  );
}

export default QuizChapter;