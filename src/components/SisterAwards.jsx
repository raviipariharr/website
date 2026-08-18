import { motion } from 'framer-motion';
import { useSisterAwards } from '../hooks/useSisterAwards.js';
import HiddenHeart from './HiddenHeart.jsx';
import Button from './ui/Button.jsx';
import './SisterAwards.css';

function SisterAwards({ onContinue }) {
  const { awards, loading } = useSisterAwards();

  return (
    <section className="sister-awards">
      <HiddenHeart id="heart-5" />

      <h2 className="sister-awards-title">Sister Awards</h2>

      {loading && <p className="sister-awards-status">Loading the awards...</p>}
      {!loading && awards.length === 0 && (
        <p className="sister-awards-status">The ceremony is being prepared...</p>
      )}

      <div className="sister-awards-grid">
        {awards.map((award, index) => (
          <motion.div
            className="sister-award-card"
            key={award.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sister-award-badge">🏆</div>
            <p className="sister-award-label">
              SUPERLATIVE #{String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="sister-award-name">{award.title}</h3>
            {award.description && (
              <p className="sister-award-description">{award.description}</p>
            )}
          </motion.div>
        ))}
      </div>

      {!loading && (
        <div className="sister-awards-continue">
          <Button variant="primary" onClick={onContinue}>
            CONTINUE →
          </Button>
        </div>
      )}
    </section>
  );
}

export default SisterAwards;