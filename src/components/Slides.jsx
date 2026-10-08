import React, { useState, useEffect } from 'react';
import PetalEffects, { PetalSvg } from './PetalEffects';
import ScratchCard from './ScratchCard';

/* Swaying Blossom Branch SVG */
const branchPaths = [
  'M28 18 C 46 8, 62 4, 78 6',
  'M96 40 C 112 30, 128 27, 142 30',
  'M150 86 C 166 78, 182 75, 198 78',
  'M186 118 C 196 108, 206 103, 214 102',
  'M246 139 C 258 131, 270 128, 282 130',
];

function BloomGraphic({ deep = false }) {
  const fillMain = deep ? 'var(--gold-deep)' : 'var(--gold)';
  const fillInner = deep ? 'var(--gold)' : 'var(--cream-soft)';

  return (
    <>
      {[0, 72, 144, 216, 288].map((rot) => (
        <g key={rot} transform={`rotate(${rot})`}>
          <path d="M0 -2 C 6 -6, 8 -13, 3 -17.5 L 0 -14.5 L -3 -17.5 C -8 -13, -6 -6, 0 -2 Z" fill={fillMain} />
          <path d="M0 -3.5 C 3.4 -6.4, 4.6 -11, 1.8 -14.6 L 0 -12.6 L -1.8 -14.6 C -4.6 -11, -3.4 -6.4, 0 -3.5 Z" fill={fillInner} opacity="0.7" />
        </g>
      ))}
      <circle r="2.8" fill="#fbe58a" />
    </>
  );
}

function BudGraphic() {
  return (
    <g>
      <line x1="0" y1="0" x2="0" y2="9" stroke="#5d3a2e" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="0" cy="-3" rx="4.4" ry="5.6" fill="var(--gold-deep)" />
      <ellipse cx="-1" cy="-4" rx="2.2" ry="3.4" fill="var(--gold)" />
    </g>
  );
}

export function BlossomDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="pointer-events-none absolute">
      <defs>
        <g id="bloomPale"><BloomGraphic deep={false} /></g>
        <g id="bloomDeep"><BloomGraphic deep={true} /></g>
        <g id="budSprite"><BudGraphic /></g>
      </defs>
    </svg>
  );
}

function BloomItem({ x, y, scale = 1, deep = false, breeze = false, seed = 0 }) {
  const transformStr = `translate(${x} ${y}) scale(${scale}) rotate(${x % 40})`;
  const useElem = <use href={deep ? '#bloomDeep' : '#bloomPale'} />;

  if (breeze) {
    return (
      <g transform={transformStr}>
        <g
          className="breeze"
          style={{
            '--bdur': `${3.4 + ((7 * seed) % 26) / 10}s`,
            '--bdelay': `-${((13 * seed) % 40) / 10}s`,
            '--sw': `${2 + ((5 * seed) % 22) / 10}deg`,
          }}
        >
          {useElem}
        </g>
      </g>
    );
  }
  return <g transform={transformStr}>{useElem}</g>;
}

function BudItem({ x, y, seed = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="breeze"
        style={{
          '--bdur': `${3.8 + ((9 * seed) % 24) / 10}s`,
          '--bdelay': `-${((17 * seed) % 38) / 10}s`,
          '--sw': `${2.4 + ((3 * seed) % 18) / 10}deg`,
        }}
      >
        <use href="#budSprite" />
      </g>
    </g>
  );
}

export function BranchSvg() {
  return null;
}

/* Gold Overlapping Rings Graphic */
const ringA = { cx: 47, cy: 48, r: 26 };
const ringB = { cx: 74, cy: 44, r: 26 };

function makeRingPath(cx, cy, r, thick) {
  const innerR = r - thick;
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-(2 * r)} 0 M${cx - innerR} ${cy} a${innerR} ${innerR} 0 1 0 ${2 * innerR} 0 a${innerR} ${innerR} 0 1 0 ${-(2 * innerR)} 0`;
}

function formatNum(n) {
  return Math.round(100 * n) / 100;
}

function polarToPoint(deg, len) {
  const rad = (deg * Math.PI) / 180;
  return `${formatNum(Math.cos(rad) * len)} ${formatNum(Math.sin(rad) * len)}`;
}

const diamondFacets = Array.from({ length: 6 }, (_, idx) => {
  const p1 = polarToPoint(60 * idx, 2.4);
  const p2 = polarToPoint((idx + 1) * 60, 2.4);
  const p3 = polarToPoint(60 * idx + 30, 5.4);
  const p0 = polarToPoint(60 * idx - 30, 5.4);
  return {
    bezel: `M${p1} L${p3} L${p2} Z`,
    upper: `M${p0} L${p1} L${p3} Z`,
  };
});

const diamondOutline = `M${Array.from({ length: 6 }, (_, idx) => polarToPoint(60 * idx, 2.4)).join(' L')} Z`;

export function GoldRingsSvg({ className, width = 120 }) {
  const pathA = makeRingPath(ringA.cx, ringA.cy, ringA.r, 6.4);
  const pathB = makeRingPath(ringB.cx, ringB.cy, ringB.r, 6.4);

  return (
    <svg className={className} width={width} viewBox="0 0 120 84" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ringGoldA" x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#fdf1c8" />
          <stop offset="0.22" stopColor="#e3c273" />
          <stop offset="0.5" stopColor="#b98f38" />
          <stop offset="0.74" stopColor="#8a6524" />
          <stop offset="1" stopColor="#dcb964" />
        </linearGradient>
        <linearGradient id="ringGoldB" x1="0.9" y1="0.05" x2="0.15" y2="1">
          <stop offset="0" stopColor="#fff8dd" />
          <stop offset="0.26" stopColor="#e8cb85" />
          <stop offset="0.56" stopColor="#a87f30" />
          <stop offset="0.8" stopColor="#8b6626" />
          <stop offset="1" stopColor="#e6c47a" />
        </linearGradient>
        <linearGradient id="ringStone" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#e4f1fb" />
          <stop offset="1" stopColor="#b9d5ea" />
        </linearGradient>
        <radialGradient id="ringShadow">
          <stop offset="0" stopColor="#5a3d24" stopOpacity="0.3" />
          <stop offset="1" stopColor="#5a3d24" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ringCross">
          <circle cx="63" cy="69" r="12" />
        </clipPath>
      </defs>

      <ellipse cx="61" cy="77" rx="34" ry="5" fill="url(#ringShadow)" />
      <g fillRule="evenodd">
        <path d={pathB} fill="url(#ringGoldB)" />
        <path d={pathA} fill="url(#ringGoldA)" />
        <g clipPath="url(#ringCross)">
          <path d={pathB} fill="url(#ringGoldB)" />
        </g>
      </g>
      <g fill="none">
        {[ringA, ringB].map((ring) => (
          <circle key={`o${ring.cx}`} cx={ring.cx} cy={ring.cy} r={ring.r - 0.4} stroke="#fff3cd" strokeWidth="0.8" opacity="0.5" />
        ))}
        {[ringA, ringB].map((ring) => (
          <circle key={`i${ring.cx}`} cx={ring.cx} cy={ring.cy} r={ring.r - 6.4 + 0.4} stroke="#6b4d18" strokeWidth="0.9" opacity="0.4" />
        ))}
      </g>
      <g transform={`translate(${ringA.cx} ${ringA.cy - ringA.r + 1.4})`}>
        <path d="M-4.9 0.6 L-2.4 -5.4 L2.4 -5.4 L4.9 0.6 Z" fill="url(#ringGoldA)" />
        <path d="M-4.9 0.6 L-2.4 -5.4" stroke="#fff3cd" strokeWidth="0.6" opacity="0.6" />
        <g fill="url(#ringGoldA)" stroke="#8a6524" strokeWidth="0.3">
          <path d="M-4.6 -4.4 L-5.9 -8.4 L-3.6 -9.4 L-2.9 -6.2 Z" />
          <path d="M4.6 -4.4 L5.9 -8.4 L3.6 -9.4 L2.9 -6.2 Z" />
        </g>
        <g transform="translate(0 -7.6)">
          <circle r={5.4} fill="url(#ringStone)" />
          {diamondFacets.map((facet, idx) => (
            <g key={idx}>
              <path d={facet.bezel} fill={idx % 2 ? '#cfe6f6' : '#eef7fd'} />
              <path d={facet.upper} fill={idx % 2 ? '#ffffff' : '#b9d5ea'} />
            </g>
          ))}
          <path d={diamondOutline} fill="#f7fcff" />
          <g fill="none" stroke="#8fb4cf" strokeWidth="0.28" opacity="0.8">
            <path d={diamondOutline} />
            <circle r={5.4} />
          </g>
          <path d="M-1.5 -4.2 C 0.4 -4.6, 2.2 -3.6, 3 -2" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        </g>
        <g fill="url(#ringGoldB)" stroke="#8a6524" strokeWidth="0.3">
          <path d="M-5.2 -6.6 L-3.4 -10.6 L-1.9 -9.6 L-3.1 -6.1 Z" />
          <path d="M5.2 -6.6 L3.4 -10.6 L1.9 -9.6 L3.1 -6.1 Z" />
        </g>
      </g>
    </svg>
  );
}

export function LatticePatternSvg() {
  return null;
}

/* Gold Divider Ornament SVG */
export function GoldOrnamentSvg({ className, width = 180 }) {
  return (
    <svg className={className} width={width} viewBox="0 0 180 24" fill="none" aria-hidden="true">
      <path d="M6 12 C 40 4, 60 20, 84 12 M174 12 C 140 4, 120 20, 96 12" stroke="var(--gold)" strokeWidth="1.6" />
      <circle cx="90" cy="12" r="3.4" fill="var(--gold)" />
      <circle cx="6" cy="12" r="2" fill="var(--gold)" />
      <circle cx="174" cy="12" r="2" fill="var(--gold)" />
    </svg>
  );
}

export function SubtleBackgroundPatternSvg() {
  return null;
}

/* Slide Outer Container Wrapper with Background Pattern */
export function SlideSection({ children, active = true, topPadClassName = 'pt-32', bgImage = '/images/hero-bg-mandala.png' }) {
  return (
    <section className={`relative h-full w-full overflow-hidden bg-[#FAF3E0] ${active ? '' : 'section-idle'}`}>
      {/* Background Image Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />
      <div className={`relative z-10 flex h-full flex-col items-center overflow-y-auto overscroll-contain px-7 ${topPadClassName} pb-24 text-center`}>
        {children}
      </div>
    </section>
  );
}

/* SLIDE 1: Hero Slide */
export function SlideHero({ active = true }) {
  return (
    <SlideSection active={active} seed={2} topPadClassName="pt-10 sm:pt-16" bgImage="/images/hero-bg-mandala.png">
      {active && (
        <>
          <PetalEffects count={18} />
          <div className="flex h-full -translate-y-6 flex-col items-center justify-center gap-4 sm:translate-y-0 relative z-10">
            <img
              src="/images/arabic-monogram.png"
              alt="Farhan &amp; Fathima Monogram"
              className="rise-in h-auto w-36 sm:w-44 max-w-[180px] mix-blend-multiply drop-shadow-[0_6px_16px_rgba(156,116,41,0.28)]"
              style={{ '--d': '0.18s' }}
            />
            <p className="rise-in mt-1 text-[0.76rem] font-medium tracking-[0.34em] text-[var(--gold-ink)] uppercase" style={{ '--d': '0.32s' }}>
              Together with their families
            </p>
            <div className="flex flex-col items-center">
              <h1 className="font-name rise-in text-[2.9rem] leading-tight text-[var(--brown-800)]" style={{ '--d': '0.48s' }}>
                Farhan Marzoock
              </h1>
              <span className="font-script gold-text rise-in text-[1.9rem] leading-none" style={{ '--d': '0.6s' }}>
                &amp;
              </span>
              <h1 className="font-name rise-in text-[2.7rem] leading-tight text-[var(--brown-800)]" style={{ '--d': '0.72s' }}>
                Fathima Fahim
              </h1>
            </div>
            <GoldOrnamentSvg className="rise-in mt-1" width={150} />
          </div>
        </>
      )}
    </SlideSection>
  );
}

/* SLIDE 2: The Official Invite Slide */
function PersonDetails({ name, parents, grandparents, address, delay }) {
  return (
    <div className="rise-in flex flex-col items-center" style={{ '--d': delay }}>
      <h2 className="font-name text-[2.1rem] leading-tight text-[var(--brown-800)]">{name}</h2>
      {parents && <p className="font-heading mt-0.5 max-w-[21rem] text-[0.86rem] leading-snug text-[var(--ink-soft)] italic">{parents}</p>}
      {grandparents && <p className="font-heading max-w-[21rem] text-[0.82rem] leading-snug text-[var(--ink-soft)] italic">{grandparents}</p>}
      {address && <p className="mt-0.5 text-[0.74rem] tracking-[0.06em] text-[var(--gold-ink)] uppercase">{address}</p>}
    </div>
  );
}

export function SlideInvite({ active = true }) {
  return (
    <SlideSection active={active} seed={3} topPadClassName="pt-20 sm:pt-28">
      {active && (
        <div className="my-auto flex flex-col items-center gap-3.5">
          <div className="flex flex-col items-center">
            <img src="/images/bismillah2.png" alt="Bismillahir Rahmanir Raheem" className="rise-in h-auto w-[15rem]" style={{ '--d': '0.1s' }} />
            <p className="font-heading rise-in mt-0.5 text-[0.74rem] whitespace-nowrap text-[var(--brown-800)] italic" style={{ '--d': '0.22s' }}>
              In the name of Allah, the most beneficent and the most merciful
            </p>
          </div>

          <div className="rise-in flex flex-col items-center text-center" style={{ '--d': '0.28s' }}>
            <p className="font-heading text-[1.05rem] font-semibold text-[var(--brown-900)]">
              Mr. Marzoock Moideen &amp; Mrs. Seena Mammu
            </p>
            <p className="text-[0.72rem] tracking-[0.08em] text-[var(--gold-ink)] uppercase">
              Thindikkal House, Edamuttam, Thrissur
            </p>
          </div>

          <p className="font-heading rise-in max-w-[22rem] text-center text-[0.9rem] leading-snug font-medium text-[var(--brown-800)] italic" style={{ '--d': '0.36s' }}>
            Invite your esteemed presence with family on the auspicious occasion of the wedding of our beloved son
          </p>

          <PersonDetails
            name="Farhan Marzoock"
            grandparents="(Grand S/o. Late Moideen TA & Kunjipathu Moideen, Late Mammu AK & Nafeesa Mammu)"
            delay="0.46s"
          />

          <span className="font-script gold-text rise-in text-[1.6rem] leading-none" style={{ '--d': '0.56s' }}>
            with
          </span>

          <PersonDetails
            name="Fathima Fahim Kabir"
            parents="(Daughter of Mr. Kabir & Mrs. Jaseena Kabir)"
            address="FAMANS, Poovalupurambil House, Koolimuttam, Mathilakam, Thrissur"
            grandparents="Grand D/o. Late Beeravu & Late Nafeesa, Mr. Shahul Hameed & Mrs. Noorjahan"
            delay="0.66s"
          />

          <div className="rise-in flex flex-col items-center pt-1" style={{ '--d': '0.8s' }}>
            <p className="font-heading text-[0.78rem] font-semibold text-[var(--brown-900)] italic">
              Best Wishes from: Hafis Anwar, Fidha and Haroon
            </p>
            <img src="/images/inshallah2.png" alt="إن شاء اللّه" className="mt-1 h-auto w-[4.5rem]" />
          </div>
        </div>
      )}
    </SlideSection>
  );
}

/* SLIDE 3: The Nikah (Scratch Card) Slide */
const dateColumns = [
  { v: '31', label: 'Day', color: '#331a0e' },
  { v: '12', label: 'Month', color: '#6b4737' },
  { v: '26', label: 'Year', color: '#9c7429' },
];

export function SlideReception({ active = true }) {
  return (
    <SlideSection active={active} petals={12} seed={5} topPadClassName="pt-16 sm:pt-28">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="font-script rise-in text-[2.8rem] text-[var(--brown-800)]" style={{ '--d': '0.1s' }}>
            The Nikah
          </h2>
          <GoldOrnamentSvg className="rise-in mt-1" width={170} />
        </div>

        <div aria-hidden="true" className="max-h-16 w-full flex-1" />

        <div className="rise-in" style={{ '--d': '0.3s' }}>
          <div className="relative flex w-[300px] h-[208px] select-none flex-col items-center justify-center overflow-hidden rounded-[18px] border border-[var(--gold)] bg-[radial-gradient(120%_100%_at_50%_0%,#fffaf0_0%,#f7ecd8_60%,#eeddc0_100%)] shadow-[0_10px_30px_rgba(107,77,24,0.18)]">
            <div className="flex flex-col items-center">
              <span className="text-[0.65rem] font-semibold tracking-[0.34em] text-[var(--gold-ink)] uppercase">Thursday</span>
              <div className="mt-1 grid items-center justify-center" style={{ gridTemplateColumns: 'auto auto auto auto auto', columnGap: '0.55rem' }}>
                {dateColumns.map((col, idx) => (
                  <React.Fragment key={col.label}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="font-date" style={{ fontSize: '3.4rem', lineHeight: 1, color: 'var(--gold)' }}>
                        –
                      </span>
                    )}
                    <span className="font-date" style={{ fontSize: '4.2rem', lineHeight: 1, color: col.color, textShadow: '0 1px 1px rgba(255,255,255,0.5)' }}>
                      {col.v}
                    </span>
                  </React.Fragment>
                ))}
                <span className="text-[0.52rem] font-semibold tracking-[0.22em] text-[var(--gold-ink)] uppercase">{dateColumns[0].label}</span>
                <span aria-hidden="true" />
                <span className="text-[0.52rem] font-semibold tracking-[0.22em] text-[var(--gold-ink)] uppercase">{dateColumns[1].label}</span>
                <span aria-hidden="true" />
                <span className="text-[0.52rem] font-semibold tracking-[0.22em] text-[var(--gold-ink)] uppercase">{dateColumns[2].label}</span>
              </div>

              <span className="my-2 flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]" />
                <span className="h-1 w-1 rotate-45 bg-[var(--gold)]" />
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--gold)]" />
              </span>

              <span className="text-[0.75rem] font-bold tracking-[0.22em] text-[var(--brown-800)] uppercase">11:00 AM Onwards</span>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="max-h-16 w-full flex-1" />

        <p className="rise-in max-w-[18rem] text-[0.82rem] leading-relaxed text-[var(--ink-soft)]" style={{ '--d': '0.7s' }}>
          We would be honoured to share this special day with you.
        </p>
      </div>
    </SlideSection>
  );
}

/* SLIDE 4: The Venue Slide */
export function SlideVenue({ active = true }) {
  return (
    <SlideSection active={active} petals={11} seed={8} topPadClassName="pt-16 sm:pt-28">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="font-script rise-in text-[2.6rem] text-[var(--brown-800)]" style={{ '--d': '0.1s' }}>
            The Venue
          </h2>
          <GoldOrnamentSvg className="rise-in mt-2" width={160} />
        </div>

        <div aria-hidden="true" className="max-h-16 w-full flex-1" />

        <a
          href="https://maps.app.goo.gl/FsZZpXaTQys6S2GYA"
          target="_blank"
          rel="noopener noreferrer"
          className="rise-in group relative flex w-full max-w-[26rem] flex-col overflow-hidden rounded-2xl border border-[var(--gold)] bg-[var(--cream-soft)] shadow-[0_10px_30px_rgba(54,29,20,0.12)] transition-transform active:scale-[0.98]"
          style={{ '--d': '0.35s' }}
        >
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src="/images/lulu-convention-center.jpg"
              alt="LULU International Convention Center"
              aria-hidden="true"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--cream-soft)] via-[var(--cream-soft)]/70 to-transparent" />
          </div>

          <div className="relative z-10 -mt-6 flex flex-col items-center px-6 pb-6 text-center">
            <img
              src="/sites/vowlee-com-d408bace/en-catalog-rose-gold-affc141d/images/google-maps-icon.webp"
              alt="Google Maps"
              width={22}
              height={32}
              className="h-7 w-auto"
              aria-hidden="true"
            />
            <span className="font-heading mt-2 text-[1.3rem] leading-tight font-semibold text-[var(--brown-800)]">
              LULU International Convention Center
            </span>
            <span className="mt-1 text-[0.88rem] text-[var(--ink-soft)]">Thrissur, Kerala</span>
            <span className="my-3 flex items-center gap-2">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--gold)]" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--gold)]" />
            </span>
            <span className="text-[0.7rem] font-semibold tracking-[0.22em] text-[var(--gold-ink)] uppercase underline underline-offset-4">
              Tap for Google Maps
            </span>
          </div>
        </a>
      </div>
    </SlideSection>
  );
}

/* SLIDE 5: Countdown Slide */
const targetWeddingDate = new Date('2026-12-31T11:00:00+05:30').getTime();

export function SlideCountdown({ active = true }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    let animId = 0;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    animId = requestAnimationFrame(() => setNow(Date.now()));
    return () => {
      cancelAnimationFrame(animId);
      window.clearInterval(interval);
    };
  }, []);

  const getTimeLeft = () => {
    if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = Math.max(0, targetWeddingDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const pad = (n) => String(n).padStart(2, '0');
  const { days, hours, minutes, seconds } = getTimeLeft();

  const timerUnits = [
    [String(days), 'Days'],
    [pad(hours), 'Hours'],
    [pad(minutes), 'Minutes'],
    [pad(seconds), 'Seconds'],
  ];

  return (
    <SlideSection active={active} petals={11} seed={17} topPadClassName="pt-24 sm:pt-32">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="font-script rise-in text-[2.8rem] text-[var(--brown-800)]" style={{ '--d': '0.1s' }}>
            See you in
          </h2>
          <GoldOrnamentSvg className="rise-in mt-2" width={160} />
        </div>

        <div aria-hidden="true" className="max-h-16 w-full flex-1" />

        <div className="rise-in flex items-stretch gap-2" style={{ '--d': '0.3s' }} suppressHydrationWarning>
          {timerUnits.map(([val, label], idx) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex min-w-[3.6rem] flex-col items-center rounded-2xl border border-[var(--gold)]/70 bg-[var(--cream-soft)]/90 px-3 py-4 shadow-[0_4px_16px_rgba(54,29,20,0.08)]">
                <span className="font-heading text-[2.1rem] leading-none font-semibold text-[var(--brown-800)]" style={{ fontVariantNumeric: 'lining-nums' }}>
                  {val}
                </span>
                <span className="mt-1 text-[0.56rem] font-medium tracking-[0.24em] text-[var(--gold-ink)] uppercase">{label}</span>
              </div>
              {idx < timerUnits.length - 1 && <span className="h-1 w-1 rotate-45 bg-[var(--gold)]" aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="max-h-16 w-full flex-1" />

        <div className="rise-in flex flex-col items-center text-center" style={{ '--d': '0.6s' }}>
          <p dir="rtl" lang="ar" className="font-arabic gold-text text-[1.3rem]">
            وَخَلَقْنَاكُمْ أَزْوَاجًا
          </p>
          <p className="mt-1.5 text-[0.82rem] leading-relaxed text-[var(--brown-800)]">
            “And We created you in pairs.”
          </p>
          <p className="font-heading mt-1 text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--gold-ink)] uppercase">
            Qur'an 78:8
          </p>

          <div className="mt-3.5 flex flex-col items-center gap-1 text-[var(--brown-800)]">
            <p className="font-heading text-[0.92rem] font-semibold italic">
              Two hearts, one beautiful journey.
            </p>
            <p className="text-[0.82rem] leading-relaxed text-[var(--brown-900)] max-w-[20rem]">
              We can’t wait to celebrate this special day with you.
            </p>
          </div>
        </div>
      </div>
    </SlideSection>
  );
}
