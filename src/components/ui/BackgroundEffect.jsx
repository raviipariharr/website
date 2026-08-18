import './BackgroundEffect.css';

function BackgroundEffect({ variant = 'gold' }) {
  return <div className={`bg-effect bg-effect-${variant}`} />;
}

export default BackgroundEffect;