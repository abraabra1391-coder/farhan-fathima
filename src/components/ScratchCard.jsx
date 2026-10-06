import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function ScratchCard({ children, width = 300, height = 208, live = true }) {
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const animFrameRef = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const isScratching = useRef(false);
  const lastPos = useRef(null);
  const checkScheduled = useRef(false);

  const drawMask = useCallback(
    (ctx, shimmerX) => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 18);
      ctx.clip();

      // Gold Metallic Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#e6c273');
      bgGrad.addColorStop(0.28, '#c9a24b');
      bgGrad.addColorStop(0.46, '#f6e4b0');
      bgGrad.addColorStop(0.62, '#c9a24b');
      bgGrad.addColorStop(1, '#8f6a26');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Metallic Wave Texture Lines
      ctx.strokeStyle = 'rgba(122,92,38,0.16)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 26; i++) {
        const offset = i / 26;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 4) {
          const y = height / 2 + (height / 2.6) * Math.sin(x / 26 + offset * Math.PI * 2) * (0.35 + 0.6 * offset);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Glitter Noise
      for (let i = 0; i < 90; i++) {
        const nx = (137.5 * i) % width;
        const ny = (71.3 * i) % height;
        const size = 0.8 + ((13 * i) % 5) * 0.4;
        ctx.fillStyle = i % 3 ? 'rgba(255,255,255,0.45)' : 'rgba(122,92,38,0.3)';
        ctx.fillRect(nx, ny, size, size);
      }

      // Animated Shimmer Beam
      const shimmerWidth = 0.42 * width;
      const shimGrad = ctx.createLinearGradient(shimmerX - shimmerWidth, height, shimmerX + shimmerWidth, 0);
      shimGrad.addColorStop(0, 'rgba(255,255,255,0)');
      shimGrad.addColorStop(0.42, 'rgba(255,255,255,0.16)');
      shimGrad.addColorStop(0.5, 'rgba(255,255,255,0.55)');
      shimGrad.addColorStop(0.58, 'rgba(255,255,255,0.16)');
      shimGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = shimGrad;
      ctx.fillRect(0, 0, width, height);

      // Gold Double Borders
      ctx.strokeStyle = 'rgba(107,77,24,0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(1.5, 1.5, width - 3, height - 3, 17);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,246,210,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(4.5, 4.5, width - 9, height - 9, 14);
      ctx.stroke();

      // Foil Typography
      const centerY = height / 2;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(66,46,12,0.94)';
      ctx.letterSpacing = '3px';
      ctx.font = '700 23px var(--font-jost), system-ui, sans-serif';
      ctx.fillText('SCRATCH HERE', width / 2, centerY + 6);

      ctx.letterSpacing = '0px';
      ctx.font = 'italic 500 15px var(--font-cormorant), Georgia, serif';
      ctx.fillStyle = 'rgba(66,46,12,0.72)';
      ctx.fillText('to reveal the day', width / 2, centerY + 30);

      // Sparkle Icon & Horizontal Lines
      const lineY = centerY - 34;
      ctx.strokeStyle = 'rgba(66,46,12,0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 74, lineY);
      ctx.lineTo(width / 2 - 22, lineY);
      ctx.moveTo(width / 2 + 22, lineY);
      ctx.lineTo(width / 2 + 74, lineY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, lineY, 13, 0, 2 * Math.PI);
      ctx.lineWidth = 1.8;
      ctx.stroke();

      for (let t = 0; t < 14; t++) {
        const a = (t / 14) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 + 9.5 * Math.cos(a), lineY + 9.5 * Math.sin(a));
        ctx.lineTo(width / 2 + 13 * Math.cos(a), lineY + 13 * Math.sin(a));
        ctx.stroke();
      }

      // Corner Flourishes
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(255,246,210,0.75)';
      [
        [14, 14, 1, 1],
        [width - 14, 14, -1, 1],
        [14, height - 14, 1, -1],
        [width - 14, height - 14, -1, -1],
      ].forEach(([x, y, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(x + 16 * dx, y);
        ctx.lineTo(x + 5 * dx, y);
        ctx.quadraticCurveTo(x, y, x, y + 5 * dy);
        ctx.lineTo(x, y + 16 * dy);
        ctx.stroke();
      });

      ctx.restore();
    },
    [width, height]
  );

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    if (!maskCanvasRef.current) {
      const offscreen = document.createElement('canvas');
      offscreen.width = width * dpr;
      offscreen.height = height * dpr;
      maskCanvasRef.current = offscreen;
    }

    const ctx = canvas.getContext('2d');
    const maskCanvas = maskCanvasRef.current;
    if (!ctx || !maskCanvas) return;

    const reduceMotion = !live || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startTime = performance.now();

    const render = (now) => {
      const shimmerPos = -0.5 * width + 2 * width * (reduceMotion ? 0.5 : ((now - startTime) % 2600) / 2600);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);

      drawMask(ctx, shimmerPos);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(maskCanvas, 0, 0);

      ctx.globalCompositeOperation = 'source-over';
      if (!reduceMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [drawMask, width, height, revealed, live]);

  const checkCompletion = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas?.getContext('2d', { willReadFrequently: true });
    if (!maskCanvas || !maskCtx) return;

    const imgData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const pixels = imgData.data;
    let scratched = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 32) {
      total++;
      if (pixels[i] > 200) scratched++;
    }

    if (total && scratched / total >= 0.42) {
      setRevealed(true);
    }
  }, []);

  const scratchAt = (e) => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas || revealed) return;

    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) return;

    const scale = maskCanvas.width / width;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;

    maskCtx.strokeStyle = '#000';
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.lineWidth = 46 * scale;
    maskCtx.beginPath();

    if (lastPos.current) {
      maskCtx.moveTo(lastPos.current.x, lastPos.current.y);
      maskCtx.lineTo(x, y);
    } else {
      maskCtx.moveTo(x, y);
      maskCtx.lineTo(x + 0.1, y);
    }
    maskCtx.stroke();
    lastPos.current = { x, y };

    if (!checkScheduled.current) {
      checkScheduled.current = true;
      requestAnimationFrame(() => {
        checkScheduled.current = false;
        checkCompletion();
      });
    }
  };

  return (
    <div
      className="relative select-none"
      style={{ width, height }}
      role="button"
      tabIndex={0}
      aria-label={revealed ? 'The date' : 'Scratch to reveal the date'}
      onKeyDown={(e) => {
        if (['Enter', ' '].includes(e.key)) {
          e.preventDefault();
          setRevealed(true);
        }
      }}
    >
      {/* Revealed Date Layer */}
      <div
        className={`absolute inset-0 overflow-hidden rounded-[18px] border transition-shadow duration-500 ${
          revealed
            ? 'border-[var(--gold)] shadow-[0_10px_30px_rgba(107,77,24,0.22)]'
            : 'border-[var(--gold-deep)]/60'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_100%_at_50%_0%,#fffaf0_0%,#f7ecd8_60%,#eeddc0_100%)]">
          {children}
        </div>
      </div>

      {/* Foil Scratch Layer */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 touch-none rounded-[18px] ${
            isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ width, height }}
          onPointerDown={(e) => {
            isScratching.current = true;
            setIsGrabbing(true);
            lastPos.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratchAt(e);
          }}
          onPointerMove={(e) => {
            if (isScratching.current) scratchAt(e);
          }}
          onPointerUp={() => {
            isScratching.current = false;
            setIsGrabbing(false);
            lastPos.current = null;
          }}
          onPointerCancel={() => {
            isScratching.current = false;
            setIsGrabbing(false);
            lastPos.current = null;
          }}
          onDoubleClick={() => setRevealed(true)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
