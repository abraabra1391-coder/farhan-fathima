import React, { useMemo } from 'react';

// Exact 3D Gold Petal PNG images extracted from the reference photo
const petalImages = [
  'petal-1.png',
  'petal-2.png',
  'petal-3.png',
  'petal-4.png',
  'petal-5.png',
  'petal-6.png',
  'petal-7.png',
  'petal-8.png',
];

export default function PetalEffects({ count = 9 }) {
  // Configured for 100% exact 1:1 reference gold petals falling one-by-one continuously
  const petalsConfig = useMemo(() => {
    const positions = [12, 74, 36, 84, 22, 62, 48, 10, 76];
    const sways = [22, -18, 26, -24, 20, -28, 16, -22, 24];

    return Array.from({ length: count }, (_, idx) => {
      const left = positions[idx % positions.length];
      const img = petalImages[idx % petalImages.length];
      const swayX = sways[idx % sways.length];
      const size = 32 + (idx % 4) * 7; // Size: 32px to 53px for crisp photorealistic rendering
      const dur = (11.5 + (idx % 4) * 0.6).toFixed(1);
      const delay = (idx * 1.55).toFixed(2);
      const rotate = (idx * 43) % 360;

      return {
        id: idx,
        left: `${left}%`,
        img,
        size,
        dur: `${dur}s`,
        delay: `${delay}s`,
        rotate,
        swayX: `${swayX}px`,
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
            top: '-50px',
            '--pdur': p.dur,
            '--pdelay': p.delay,
            '--psway': p.swayX,
            '--protate': `${p.rotate}deg`,
          }}
        >
          <img
            src={`/images/petals/${p.img}`}
            alt=""
            className="h-auto object-contain drop-shadow-[0_4px_10px_rgba(120,85,20,0.3)]"
            style={{ width: `${p.size}px` }}
          />
        </div>
      ))}
    </div>
  );
}

export function GoldSilkPetalSvg() {
  return null;
}

export function GoldPetalSvg() {
  return null;
}

export function CreamPetalSvg() {
  return null;
}

export function PetalSvg() {
  return null;
}

export function ClickBurstEffect() {
  return null;
}
