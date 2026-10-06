import React, { useMemo } from 'react';

/* Photorealistic Cupped Silk Petal in 100% Rich Metallic Gold */
export function GoldSilkPetalSvg({ width = 22, height = 25, variant = 0, className = '', style = {} }) {
  const gradId = `goldPetalGrad_${variant}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 36"
      fill="none"
      className={className}
      style={{
        filter: 'drop-shadow(0 3px 6px rgba(138, 98, 26, 0.3))',
        ...style,
      }}
      aria-hidden="true"
    >
      <defs>
        {variant % 2 === 0 ? (
          <radialGradient id={gradId} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff9e6" />
            <stop offset="35%" stopColor="#e9ca77" />
            <stop offset="75%" stopColor="#c89e3a" />
            <stop offset="100%" stopColor="#8c661b" />
          </radialGradient>
        ) : (
          <radialGradient id={gradId} cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fffdf2" />
            <stop offset="35%" stopColor="#f1d892" />
            <stop offset="75%" stopColor="#d5a842" />
            <stop offset="100%" stopColor="#987222" />
          </radialGradient>
        )}
      </defs>

      {/* Cupped Rounded Rose Petal Shape */}
      <path
        d="M16 3 C25 3, 31 10, 29 19 C27 28, 20 33, 16 33 C12 33, 5 28, 3 19 C1 10, 7 3, 16 3 Z"
        fill={`url(#${gradId})`}
        stroke="rgba(255, 245, 210, 0.75)"
        strokeWidth="0.6"
        opacity="0.96"
      />
      {/* Inner Shadow Contour */}
      <path
        d="M16 7 C21 7, 25 12, 23 18 C22 23, 18 27, 16 27 C14 27, 10 23, 9 18 C7 12, 11 7, 16 7 Z"
        fill="rgba(100, 70, 10, 0.08)"
      />
      {/* Satin Top Edge Gold Highlight */}
      <path
        d="M9 5 C13 3.5, 19 3.5, 23 5"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

export default function PetalEffects({ count = 8 }) {
  // Deterministic configuration for strictly ONE BY ONE individual continuous falling
  const petalsConfig = useMemo(() => {
    const positions = [15, 74, 38, 85, 24, 62, 48, 10];
    const sways = [22, -18, 26, -24, 20, -28, 16, -22];

    return Array.from({ length: count }, (_, idx) => {
      const left = positions[idx % positions.length];
      const swayX = sways[idx % sways.length];
      const size = 18 + (idx % 3) * 4;
      // Duration per petal: 11.5s to 13.5s for smooth continuous fall velocity
      const dur = (11.5 + (idx % 4) * 0.6).toFixed(1);
      // Strictly 1.65s delay separation between consecutive petals -> NO pairing or groups
      const delay = (idx * 1.65).toFixed(2);
      const rotate = (idx * 47) % 360;

      return {
        id: idx,
        left: `${left}%`,
        size,
        dur: `${dur}s`,
        delay: `${delay}s`,
        rotate,
        swayX: `${swayX}px`,
        variant: idx,
      };
    });
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-20"
      aria-hidden="true"
    >
      {petalsConfig.map((p) => (
        <div
          key={p.id}
          className="gold-petal-continuous-fall absolute"
          style={{
            left: p.left,
            top: '-40px',
            '--pdur': p.dur,
            '--pdelay': p.delay,
            '--psway': p.swayX,
            '--protate': `${p.rotate}deg`,
          }}
        >
          <GoldSilkPetalSvg width={p.size} height={p.size * 1.14} variant={p.variant} />
        </div>
      ))}
    </div>
  );
}

export function GoldPetalSvg(props) {
  return <GoldSilkPetalSvg {...props} />;
}

export function CreamPetalSvg(props) {
  return <GoldSilkPetalSvg {...props} />;
}

export function PetalSvg() {
  return null;
}

export function ClickBurstEffect() {
  return null;
}
