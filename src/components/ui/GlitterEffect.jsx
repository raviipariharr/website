import { useMemo } from 'react';
import './GlitterEffect.css';

const PARTICLE_COUNT = 50;
const COLORS = ['gold', 'purple', 'white'];

function GlitterEffect() {
  // Generated once per page load — stable for the whole visit,
  // different sparkle pattern on the next load.
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1.5}px`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: `${Math.random() * 3 + 2.5}s`,
      delay: `${Math.random() * 4}s`,
    }));
  }, []);

  return (
    <div className="glitter-layer" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`glitter-particle glitter-particle-${p.color}`}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default GlitterEffect;