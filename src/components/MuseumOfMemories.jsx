import { motion } from 'framer-motion';
import { useMuseumEntries } from '../hooks/useMuseumEntries.js';
import Button from './ui/Button.jsx';
import HiddenHeart from './HiddenHeart.jsx';
import './MuseumOfMemories.css';

function MuseumOfMemories({ onContinue }) {
  const { entries, loading } = useMuseumEntries();

  return (
    <section className="museum">
      <HiddenHeart id="heart-3" />
      <HiddenHeart id="heart-4" />

      <h2 className="museum-title">Museum of Memories</h2>

      {loading && <p className="museum-status">Loading the gallery...</p>}

      {!loading && entries.length === 0 && (
        <p className="museum-status">The exhibits are being hung...</p>
      )}

      <div className="museum-gallery">
        {entries.map((entry, index) => (
          <div className="museum-exhibit" key={entry.id}>
            <motion.div
              className="museum-photo-frame"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={entry.photo_url}
                alt={entry.caption || `Memory ${index + 1}`}
                className="museum-photo"
              />
            </motion.div>

            <p className="museum-exhibit-label">
              EXHIBIT {String(index + 1).padStart(2, '0')}
            </p>

            {entry.caption && <p className="museum-caption">{entry.caption}</p>}
          </div>
        ))}
      </div>

      {!loading && (
        <div className="museum-continue">
          <Button variant="primary" onClick={onContinue}>
            CONTINUE →
          </Button>
        </div>
      )}
    </section>
  );
}

export default MuseumOfMemories;