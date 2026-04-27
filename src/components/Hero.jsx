import { useEffect, useRef } from 'react';
import TextType from './TextType';
import './Hero.css';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4';

const NAV_ITEMS = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
];

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let rafId = null;
    let resetTimer = null;
    let fadingOut = false;

    const fadeTo = (target, ms) => {
      cancelAnimationFrame(rafId);
      const start = performance.now();
      const from = parseFloat(vid.style.opacity) || 0;
      const step = (now) => {
        const p = Math.min((now - start) / ms, 1);
        vid.style.opacity = String(from + (target - from) * p);
        if (p < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    const handleLoadedData = () => {
      // Video is already visible (CSS opacity: 1). Just kick playback;
      // if it's blocked we'll retry on the user-interaction fallback below.
      vid.style.opacity = '1';
      vid.play().catch(() => {});
    };

    const handleTimeUpdate = () => {
      if (!vid.duration) return;
      const remaining = vid.duration - vid.currentTime;
      if (!fadingOut && remaining > 0 && remaining <= 0.6) {
        fadingOut = true;
        fadeTo(0, 600);
      }
    };

    const handleEnded = () => {
      vid.style.opacity = '0';
      resetTimer = setTimeout(() => {
        vid.currentTime = 0;
        vid.play().catch(() => {});
        fadingOut = false;
        fadeTo(1, 800);
      }, 100);
    };

    // iOS Safari often refuses programmatic autoplay (Low Power Mode, etc.).
    // Retry once on the first user interaction — common pattern that works
    // even after the autoplay rejection.
    const retryPlay = () => {
      if (vid.paused) vid.play().catch(() => {});
    };

    vid.addEventListener('loadeddata', handleLoadedData);
    vid.addEventListener('timeupdate', handleTimeUpdate);
    vid.addEventListener('ended', handleEnded);
    window.addEventListener('touchstart', retryPlay, { once: true, passive: true });
    window.addEventListener('click', retryPlay, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resetTimer);
      vid.removeEventListener('loadeddata', handleLoadedData);
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      vid.removeEventListener('ended', handleEnded);
      window.removeEventListener('touchstart', retryPlay);
      window.removeEventListener('click', retryPlay);
    };
  }, []);

  return (
    <section className="hero" id="top">
      <video
        ref={videoRef}
        className="hero__video"
        muted
        autoPlay
        playsInline
        preload="auto"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <nav className="hero__nav">
        <ul className="hero__pill">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className="hero__nav-link">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a className="hero__pill-cta" href="#contact">
          Say Hi ↗
        </a>
      </nav>

      <div className="hero__pressure-area">
        <div className="hero__pressure-container">
          <TextType
            className="hero__texttype"
            text={['Nice to meet you!', 'Nice to meet you!']}
            typingSpeed={150}
            pauseDuration={1800}
            deletingSpeed={60}
            showCursor={false}
          />
        </div>
      </div>
    </section>
  );
}
