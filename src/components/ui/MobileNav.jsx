import './MobileNav.css';

function MobileNav({ chapterCount = 1, activeIndex = 0, onNavigate }) {
  return (
    <nav className="mobile-nav">
      {Array.from({ length: chapterCount }).map((_, i) => (
        <button
          key={i}
          className={`mobile-nav-dot ${i === activeIndex ? 'mobile-nav-dot-active' : ''}`}
          onClick={() => onNavigate && onNavigate(i)}
          aria-label={`Go to chapter ${i + 1}`}
        />
      ))}
    </nav>
  );
}

export default MobileNav;