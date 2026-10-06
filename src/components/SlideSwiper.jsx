import React, { useState, useEffect, useRef, useCallback, Children, isValidElement, cloneElement } from 'react';
import { ChevronUp } from 'lucide-react';

export default function SlideSwiper({ labels = [], active = true, children }) {
  const childrenArray = Children.toArray(children);
  const count = childrenArray.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const isThrottled = useRef(false);
  const touchStartY = useRef(null);

  const goToSlide = useCallback(
    (index) => {
      setActiveIndex(Math.max(0, Math.min(count - 1, index)));
    },
    [count]
  );

  useEffect(() => {
    if (!active) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (isThrottled.current) return;
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (Math.abs(delta) < 8) return;
      isThrottled.current = true;
      setActiveIndex((prev) => Math.max(0, Math.min(count - 1, delta > 0 ? prev + 1 : prev - 1)));
      window.setTimeout(() => {
        isThrottled.current = false;
      }, 750);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [active, count]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e) => {
      const target = e.target;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      )
        return;

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        goToSlide(activeIndex + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        goToSlide(activeIndex - 1);
      } else if (e.key === 'Home') {
        goToSlide(0);
      } else if (e.key === 'End') {
        goToSlide(count - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, activeIndex, count, goToSlide]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        touchAction: 'none',
      }}
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0]?.clientY ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartY.current === null) return;
        const diff = touchStartY.current - (e.changedTouches[0]?.clientY ?? 0);
        if (Math.abs(diff) > 48) {
          goToSlide(activeIndex + (diff > 0 ? 1 : -1));
        }
        touchStartY.current = null;
      }}
    >
      <div
        style={{
          height: `${100 * count}dvh`,
          transform: `translate3d(0, -${100 * activeIndex}dvh, 0)`,
          transition: 'transform 1.3s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {childrenArray.map((child, idx) => {
          const isCurrent = idx === activeIndex;
          const renderedChild = isValidElement(child)
            ? cloneElement(child, { active: active && isCurrent })
            : child;

          return (
            <div
              key={idx}
              style={{
                height: '100dvh',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                contentVisibility: isCurrent ? 'visible' : 'auto',
                containIntrinsicSize: '100vw 100dvh',
              }}
            >
              {renderedChild}
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <nav
        aria-label="Slides"
        style={{
          position: 'fixed',
          right: 'clamp(12px, 2.5vw, 28px)',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          opacity: active ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {labels.slice(0, count).map((label, s) => {
          const isSelected = s === activeIndex;
          return (
            <button
              key={s}
              type="button"
              className="dot-nav"
              aria-label={`Go to ${label}`}
              aria-current={isSelected}
              onClick={() => goToSlide(s)}
              style={{
                width: isSelected ? '11px' : '9px',
                height: isSelected ? '11px' : '9px',
                borderRadius: '50%',
                border: '1px solid var(--gold-deep)',
                background: isSelected ? 'var(--gold)' : 'rgba(255,250,240,0.55)',
                boxShadow: isSelected ? '0 0 8px rgba(201,162,75,0.5)' : 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          );
        })}
      </nav>

      {/* Swipe Up Prompt Indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--gold-deep)',
          pointerEvents: 'none',
          opacity: active && activeIndex < count - 1 ? 0.85 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <ChevronUp className="chevron-bob" width={20} height={20} strokeWidth={1.75} />
        <span
          style={{
            fontFamily: 'var(--font-jost), system-ui, sans-serif',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {`Swipe up for ${labels[activeIndex + 1] ?? ''}`.trim()}
        </span>
      </div>
    </div>
  );
}
