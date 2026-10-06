import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

function GoldSparklesOverlay({ count = 20 }) {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, idx) => ({
      id: idx,
      left: 8 + ((47 * idx) % 84),
      top: 20 + ((31 * idx) % 70),
      size: 3 + (idx % 3) * 3,
      dur: 3.0 + ((17 * idx) % 30) / 10,
      delay: -((23 * idx) % 40) / 10,
      shiftX: ((19 * idx) % 24) - 12,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="gold-sparkle absolute rounded-full"
          style={{
            left: `${sp.left}%`,
            top: `${sp.top}%`,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            background: 'radial-gradient(circle, #fff3cd 20%, #d4af37 70%, transparent 100%)',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.85)',
            '--sdur': `${sp.dur}s`,
            '--sdelay': `${sp.delay}s`,
            '--sx': `${sp.shiftX}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function IntroGate({ onDismiss }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );

  const videoRef = useRef(null);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  const videoUrl = '/videos/flow_animation.mp4';

  const finishIntro = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setIsFadingOut(true);

    window.setTimeout(() => {
      document.body.style.overflow = '';
      setHidden(true);
      onDismiss?.();
    }, 500);
  }, [onDismiss]);

  const handleGateClick = useCallback(() => {
    if (isOpening) return;
    setIsOpening(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video playback error:', err);
          window.setTimeout(finishIntro, 3000);
        });
      }
    }
  }, [isOpening, finishIntro]);

  const handleKeyDown = useCallback(
    (e) => {
      if (['Enter', ' ', 'Spacebar'].includes(e.key)) {
        e.preventDefault();
        handleGateClick();
      }
    },
    [handleGateClick]
  );

  const handleTimeUpdate = () => {
    if (!videoRef.current || hasFinishedRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0 && currentTime >= duration - 0.35) {
      finishIntro();
    }
  };

  if (hidden) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={isDesktop ? 'Click to open the invitation' : 'Tap to open the invitation'}
      onClick={handleGateClick}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        background: '#FAF3E0',
        cursor: 'pointer',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* Exact Flow Video Animation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          onEnded={finishIntro}
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Floating Gold Sparkles (active before tap) */}
      {!isOpening && <GoldSparklesOverlay count={22} />}

      {/* Tap / Click to Open Text Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          pointerEvents: 'none',
          opacity: isOpening ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
            fontSize: '21px',
            fontWeight: 600,
            lineHeight: '28.8px',
            letterSpacing: '5.5px',
            textIndent: '5.5px',
            textTransform: 'uppercase',
            color: 'var(--brown-900)',
            userSelect: 'none',
            WebkitTextStroke: '0.6px var(--brown-900)',
            textShadow:
              '0 1px 1px rgba(255,255,255,0.9), 0 0 6px rgba(255,255,255,0.95), 0 0 16px rgba(255,246,210,0.9)',
          }}
        >
          {isDesktop ? 'Click to open' : 'Tap to open'}
        </p>
        <div
          style={{
            width: '40px',
            height: '1.5px',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(212, 175, 55, 0.9), rgba(0, 0, 0, 0))',
          }}
        />
      </div>
    </div>
  );
}
