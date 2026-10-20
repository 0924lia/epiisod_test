import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import VLine from '../VLine';
import line from '../../assets/make-it-yours-line.svg';
import convenience from '../../assets/why/exp-convenience.jpg';
import wellness from '../../assets/why/exp-wellness.jpg';
import smart from '../../assets/why/exp-smart.jpg';
import app from '../../assets/why/exp-app.jpg';
import community from '../../assets/why/exp-community.jpg';
import cafe from '../../assets/why/exp-cafe.jpg';
import './WhyExperience.css';

type Feature = {
  title: ReactNode;
  /** Revealed when the card is hovered, clicked or tapped (Figma 953:4887). */
  text: string;
  image: string;
  /** Figma's crop as object-position and a zoom about that point (default: centred, no zoom). */
  crop?: { position: string; zoom: number };
};

/**
 * Three staggered columns of two, as in Figma 912:4591. Figma (953:4887) repeats the
 * Convenience copy on every card; the other five texts are placeholders until the real
 * copy is supplied.
 */
const COLUMNS: Feature[][] = [
  [
    {
      title: (
        <>
          Unmatched <em>Convenience</em>
        </>
      ),
      text:
        'Live minutes from Macquarie University, the Metro Station, and Macquarie Centre. With on-site car parking, car-share access, and secure bike storage, your campus, your transport, and your lifestyle are seamlessly aligned around one address.',
      image: convenience,
      crop: { position: '50% 90%', zoom: 1.379 },
    },
    {
      title: (
        <>
          Wellness <em>Built-in</em>
        </>
      ),
      text:
        'Spaces to move, rest and reset are part of the building, not an afterthought, so looking after yourself fits easily around lectures, study and everything in between.',
      image: wellness,
    },
  ],
  [
    {
      title: (
        <>
          Smart <em>Living</em>
        </>
      ),
      text:
        'Keyless entry, unlimited WiFi and a secure building keep everyday life simple, so you spend less time on the small things and more on what matters to you.',
      image: smart,
    },
    {
      title: (
        <>
          EPIISOD Living <em>app</em>
        </>
      ),
      text:
        'Book spaces, report maintenance, sign up for events and hear from the team, all from your phone. Everything you need to live at EPIISOD sits in one place.',
      image: app,
    },
  ],
  [
    {
      title: (
        <>
          Community and <em>Support</em>
        </>
      ),
      text:
        'Our team is on hand to help you settle in and feel at home, with a social calendar that makes it easy to meet people and build friendships from day one.',
      image: community,
      crop: { position: '77% 50%', zoom: 1 },
    },
    {
      title: (
        <>
          Resident-only <em>Cafe</em>
        </>
      ),
      text:
        'Grab a coffee before class or catch up with friends between study sessions. The cafe is a relaxed spot made just for residents, right downstairs.',
      image: cafe,
    },
  ],
];

/** A card under the mouse opens after this pause (ms), so sweeping across doesn't flick each one open. */
const HOVER_DELAY = 140;

/**
 * The EPIISOD experience (Figma 889:10327): six photo cards in three staggered columns,
 * each titled over a chocolate fade. As with the reviews, hovering a card — or clicking /
 * tapping it — deepens the fade and lifts the title to reveal its description
 * (Figma 953:4887). A click keeps it open after the pointer leaves; clicking again closes it.
 */
export default function WhyExperience({ id }: { id: string }) {
  /** Opened by click, tap or keyboard; stays open. */
  const [selected, setSelected] = useState<string | null>(null);
  /** Under the mouse; wins over `selected` while the pointer is on the grid. */
  const [hovered, setHovered] = useState<string | null>(null);
  const open = hovered ?? selected;
  const hoverTimer = useRef(0);
  /** Hover a card after a short pause; leaving (`null`) closes at once. */
  const hoverSoon = (card: typeof hovered) => {
    window.clearTimeout(hoverTimer.current);
    if (card === null) setHovered(null);
    else hoverTimer.current = window.setTimeout(() => setHovered(card), HOVER_DELAY);
  };
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  return (
    <section className="why-experience" id={id}>
      <div className="why-experience__header">
        <VLine src={line} length={100} />
        <div className="heading-group">
          <p className="eyebrow">Experience</p>
          <h2 className="type-h2">
            Built around <em>your story</em>
          </h2>
        </div>
      </div>

      <div className="why-experience__grid" onPointerLeave={() => hoverSoon(null)}>
        {COLUMNS.map((column, c) => (
          <div key={c} className="why-experience__column">
            {column.map((feature, i) => {
              const key = `${c}-${i}`;
              const isOpen = open === key;
              const textId = `why-feature-${key}`;
              return (
                <article
                  key={key}
                  className={`why-feature${isOpen ? ' is-open' : ''}`}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && hoverSoon(key)}
                >
                  <img
                    className="why-feature__image"
                    src={feature.image}
                    alt=""
                    style={
                      feature.crop &&
                      ({
                        objectPosition: feature.crop.position,
                        transformOrigin: feature.crop.position,
                        '--zoom': feature.crop.zoom,
                      } as CSSProperties)
                    }
                  />
                  <div className="why-feature__shade" aria-hidden />
                  <div className="why-feature__shade why-feature__shade--open" aria-hidden />
                  <div className="why-feature__band">
                    <span className="why-feature__band-bg" aria-hidden />
                    <span className="why-feature__band-bg why-feature__band-bg--open" aria-hidden />
                    <h3 className="type-h3 why-feature__title">
                      {/* The button covers the whole card (::after), so any spot opens it */}
                      <button
                        type="button"
                        className="why-feature__toggle"
                        aria-expanded={isOpen}
                        aria-controls={textId}
                        onClick={() => {
                          setSelected((s) => (s === key ? null : key));
                          // A click while hovering pins the card; let the hover follow the pin
                          hoverSoon(null);
                        }}
                      >
                        {feature.title}
                      </button>
                    </h3>
                    <div className="why-feature__reveal" id={textId} aria-hidden={!isOpen}>
                      <p className="why-feature__text">{feature.text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
