import React, { useState, useEffect, useRef } from 'react';
import SplashLoader from './components/SplashLoader';
import IntroGate from './components/IntroGate';
import SlideSwiper from './components/SlideSwiper';
import {
  BlossomDefs,
  SlideHero,
  SlideInvite,
  SlideReception,
  SlideVenue,
  SlideCountdown,
} from './components/Slides';
import { ClickBurstEffect } from './components/PetalEffects';

const slideLabels = ['Invitation', 'The Official Invite', 'The Nikah', 'The Venue', 'Countdown'];

export default function App() {
  const [appState, setAppState] = useState('loading'); // 'loading' | 'gate' | 'open'
  const [progress, setProgress] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isSplashingOut, setIsSplashingOut] = useState(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let canceled = false;
    startTimeRef.current = Date.now();

    const videoUrl = '/videos/flow_animation.mp4';

    const posterUrl = '/images/gold-archway-poster.jpg';

    // Progress loader while preloading video & poster
    const progressInterval = window.setInterval(() => {
      if (!canceled) {
        setProgress((prev) => Math.min(prev + 0.15, 0.95));
      }
    }, 100);

    const preloadVideo = new Promise((resolve) => {
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      const onReady = () => resolve();
      v.addEventListener('canplaythrough', onReady, { once: true });
      v.addEventListener('error', onReady, { once: true });
      v.src = videoUrl;
      v.load();
      setTimeout(onReady, 2000);
    });

    const preloadPoster = new Promise((resolve) => {
      const img = new Image();
      const onReady = () => resolve();
      img.onload = onReady;
      img.onerror = onReady;
      img.src = posterUrl;
      setTimeout(onReady, 1500);
    });

    Promise.all([preloadVideo, preloadPoster]).then(() => {
      if (!canceled) {
        setProgress(1);
        setAssetsReady(true);
      }
    });

    return () => {
      canceled = true;
      window.clearInterval(progressInterval);
    };
  }, []);

  // Transition from loading to intro gate
  useEffect(() => {
    if (appState !== 'loading' || !assetsReady) return;

    const elapsed = Date.now() - (startTimeRef.current || Date.now());
    const minWait = Math.max(0, 2500 - elapsed);

    const timer = window.setTimeout(() => {
      setIsSplashingOut(true);
      setAppState('gate');
    }, minWait);

    return () => window.clearTimeout(timer);
  }, [appState, assetsReady]);

  // Remove splash loader animation wrapper after transition
  useEffect(() => {
    if (!isSplashingOut) return;
    const timer = window.setTimeout(() => {
      setIsSplashingOut(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [isSplashingOut]);

  const isOpen = appState === 'open';

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#1a0509]">
      <div
        style={{
          position: 'relative',
          transform: 'translateZ(0)',
          height: '100dvh',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(0,0,0,0.55)',
          background: '#FAF3E0',
          color: 'var(--ink)',
          fontFamily: 'var(--font-jost), system-ui, sans-serif',
          userSelect: 'none',
        }}
      >
        <BlossomDefs />

        <SlideSwiper active={isOpen} labels={slideLabels}>
          <SlideHero />
          <SlideInvite />
          <SlideReception />
          <SlideVenue />
          <SlideCountdown />
        </SlideSwiper>

        {isOpen && <ClickBurstEffect />}

        {appState === 'gate' && (
          <IntroGate onDismiss={() => setAppState('open')} />
        )}

        {(appState === 'loading' || isSplashingOut) && (
          <div className={isSplashingOut ? 'splash-out' : undefined} style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
            <SplashLoader progress={progress} />
          </div>
        )}
      </div>

      {/* Desktop Mobile Viewport Hint */}
      <div className="pointer-events-none fixed right-5 bottom-5 z-[10001] hidden max-w-[220px] items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/80 backdrop-blur-sm sm:flex">
        For the best experience, please view on mobile.
      </div>
    </div>
  );
}
