import { useEffect, useRef, useState } from 'react';
import './Photos.css';

const PHOTOS = [
  { src: '/images/snapshots/photo-1.jpg', caption: '2025 春' },
  { src: '/images/snapshots/photo-2.jpg', caption: '临沧的风' },
  { src: '/images/snapshots/photo-3.jpg', caption: 'Claude Code' },
  { src: '/images/snapshots/photo-4.jpg', caption: '随手拍' },
  { src: '/images/snapshots/photo-5.jpg', caption: '某个下午' },
];

// Hand-tuned placements — looks "scattered" but stable across reloads
const PLACEMENTS = [
  { left: '4%',  top: '14%', rotate: -4 },
  { left: '20%', top: '2%',  rotate: 3  },
  { left: '38%', top: '20%', rotate: -2 },
  { left: '54%', top: '5%',  rotate: 4  },
  { left: '70%', top: '22%', rotate: -3 },
];

export default function Photos() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Click-outside to close
  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e) => {
      if (!e.target.closest('.photo-card')) {
        setActiveIndex(null);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveIndex(null);
    };
    document.addEventListener('click', handler);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', handler);
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex]);

  const handleClick = (idx) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section ref={sectionRef} className="photos" id="photos">
      <div className="photos__header">
        <p className="photos__eyebrow reveal reveal--up">Snapshots</p>
        <h2 className="photos__heading reveal reveal--up reveal--delay-1">
          Moments I've <em>kept</em>
        </h2>
        <p className="photos__sub reveal reveal--up reveal--delay-2">
          点一张照片放大,再点空白处或同一张照片收起。
        </p>
      </div>

      <div
        className={`photos__stage reveal reveal--up reveal--delay-3 ${
          activeIndex !== null ? 'has-active' : ''
        }`}
      >
        {PHOTOS.map((p, i) => {
          const placement = PLACEMENTS[i];
          const isActive = activeIndex === i;
          return (
            <button
              key={i}
              type="button"
              className={`photo-card ${isActive ? 'is-active' : ''}`}
              style={{
                '--ph-left': placement.left,
                '--ph-top': placement.top,
                '--ph-rotate': `${placement.rotate}deg`,
                '--ph-stagger': i,
              }}
              onClick={() => handleClick(i)}
              aria-label={`照片:${p.caption}`}
            >
              <span className="photo-card__frame">
                <img src={p.src} alt={p.caption} loading="lazy" />
                <span className="photo-card__caption">{p.caption}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
