import { useEffect, useMemo, useRef, useState } from 'react';
import './ProfileCard.css';

export default function ProfileCard({
  name,
  title,
  handle,
  status,
  contactText = 'Contact',
  avatarUrl,
  enableTilt = true,
  enableMobileTilt = false,
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(127, 119, 221, 0.6)',
  innerGradient = 'linear-gradient(145deg, #26215C8c 0%, #AFA9EC44 100%)',
  onContactClick,
  showUserInfo = true,
}) {
  const rootRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glare: 0 });

  const canTilt = enableTilt;

  const vars = useMemo(
    () => ({
      '--pc-glow': behindGlowColor,
      '--pc-inner': innerGradient,
    }),
    [behindGlowColor, innerGradient]
  );

  useEffect(() => {
    if (!enableMobileTilt) return;
    if (!canTilt) return;

    const el = rootRef.current;
    if (!el) return;

    const onOrientation = (e) => {
      if (typeof e.beta !== 'number' || typeof e.gamma !== 'number') return;
      const beta = Math.max(-45, Math.min(45, e.beta));
      const gamma = Math.max(-45, Math.min(45, e.gamma));
      const rx = (beta / 45) * 10;
      const ry = (gamma / 45) * 10;
      setTilt({ rx: -rx, ry, glare: (Math.abs(rx) + Math.abs(ry)) / 20 });
    };

    window.addEventListener('deviceorientation', onOrientation, true);
    return () => window.removeEventListener('deviceorientation', onOrientation, true);
  }, [enableMobileTilt, canTilt]);

  const onPointerMove = (e) => {
    if (!canTilt) return;
    const el = rootRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const ry = (px - 0.5) * 14;
    const rx = (0.5 - py) * 14;
    const glare = Math.min(1, Math.hypot(px - 0.5, py - 0.5) * 1.6);

    setTilt({ rx, ry, glare });
  };

  const resetTilt = () => {
    if (!canTilt) return;
    setTilt({ rx: 0, ry: 0, glare: 0 });
  };

  return (
    <div
      ref={rootRef}
      className={[
        'profile-card',
        canTilt ? 'profile-card--tilt' : '',
        behindGlowEnabled ? 'profile-card--glow' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...vars,
        transform: canTilt
          ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
          : undefined,
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        className="profile-card__glare"
        aria-hidden="true"
        style={{
          opacity: canTilt ? 0.22 + tilt.glare * 0.28 : 0.18,
          transform: canTilt
            ? `translate3d(${tilt.ry * 2}px, ${-tilt.rx * 2}px, 0)`
            : undefined,
        }}
      />

      <div className="profile-card__inner">
        <div className="profile-card__avatar" aria-hidden={!avatarUrl}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name ?? 'User'} avatar`} />
          ) : (
            <div className="profile-card__avatar-fallback" />
          )}
        </div>

        {showUserInfo ? (
          <div className="profile-card__meta">
            <div className="profile-card__name-row">
              <div className="profile-card__contact-line">联系方式</div>
              {status ? <span className="profile-card__status">{status}</span> : null}
            </div>
            <div className="profile-card__email">xcyy0429@gmail.com</div>
            {title ? <div className="profile-card__title">{title}</div> : null}
            {handle ? <div className="profile-card__handle">@{handle}</div> : null}
          </div>
        ) : null}

        <div className="profile-card__actions">
          <button
            type="button"
            className="profile-card__contact"
            onClick={onContactClick}
          >
            {contactText}
          </button>
        </div>
      </div>
    </div>
  );
}

