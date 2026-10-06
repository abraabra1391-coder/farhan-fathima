import React, { useState, useEffect, useRef } from 'react';
import PetalEffects from './PetalEffects';

function RingGraphic({ id, from, mid, to, edge }) {
  return (
    <svg width={66} height={66} viewBox="-33 -33 66 66" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d="M-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0 M-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0"
        fill={`url(#${id})`}
        fillRule="evenodd"
      />
      <circle r={29.5} fill="none" stroke="#fff8e0" strokeWidth="0.8" opacity="0.55" />
      <circle r={22.5} fill="none" stroke={edge} strokeWidth="0.9" opacity="0.45" />
    </svg>
  );
}

function LatticePattern() {
  return (
    <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]" aria-hidden="true">
      <defs>
        <pattern id="petalLatticeLoader" width="88" height="128" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="var(--gold-deep)" strokeWidth="0.9" opacity="0.5">
            <path d="M44 2 C 82 30, 82 74, 44 110 C 6 74, 6 30, 44 2 Z" />
            <path d="M0 66 C 18 84, 22 106, 20 126 M88 66 C 70 84, 66 106, 68 126" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#petalLatticeLoader)" />
    </svg>
  );
}

export default function SplashLoader({ progress }) {
  const targetProgress = Math.min(Math.max(progress, 0), 1) * 100;
  const [displayProgress, setDisplayProgress] = useState(0);
  const currentRef = useRef(0);
  const [isDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches);

  const posterSrc = isDesktop
    ? '/sites/vowlee-com-d408bace/en-catalog-rose-gold-affc141d/images/archway-poster-desktop.jpg'
    : '/sites/vowlee-com-d408bace/en-catalog-rose-gold-affc141d/images/archway-poster-mobile.jpg';

  useEffect(() => {
    let animId = 0;
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      const next = Math.min(targetProgress, currentRef.current + 28 * delta);
      currentRef.current = next;
      setDisplayProgress(next);
      if (next < targetProgress) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetProgress]);

  const rounded = Math.round(displayProgress);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${posterSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-label="Loading"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'rgba(247, 227, 174, 0.4)' }} />
      <LatticePattern />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 44% at 50% 42%, rgba(253,246,234,0.55) 0%, transparent 72%),radial-gradient(130% 90% at 50% 50%, transparent 45%, rgba(253,246,234,0.55) 100%)',
        }}
      />
      <PetalEffects count={6} />

      <div className="relative mb-2 flex items-center justify-center" role="status" aria-label={`Loading, ${rounded}%`}>
        <img
          src="/images/arabic-monogram.png"
          alt="Farhan & Fathima Calligraphy Monogram"
          className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_4px_12px_rgba(180,140,50,0.35)] transition-all duration-300"
        />
      </div>

      <span aria-hidden="true" className="relative mt-4 flex items-baseline">
        <span className="font-heading text-[1.3rem] leading-none font-semibold text-[var(--brown-900)]">{rounded}</span>
        <span className="font-heading ml-[0.08em] text-[0.75rem] leading-none text-[var(--gold-ink)]">%</span>
      </span>

      <p className="font-name relative mt-6 text-[3.1rem] leading-none text-[var(--brown-800)]">Farhan &amp; Fathima</p>
    </div>
  );
}
