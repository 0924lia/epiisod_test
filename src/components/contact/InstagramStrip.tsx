import { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/smoothScroll';
import { useExitParallax } from '../../lib/useExitParallax';
import background from '../../assets/property/hero.jpg';
import ig1 from '../../assets/contact/instagram-1.jpg';
import ig2 from '../../assets/contact/instagram-2.jpg';
import ig3 from '../../assets/contact/instagram-3.jpg';
import ig4 from '../../assets/contact/instagram-4.jpg';
import ig5 from '../../assets/contact/instagram-5.jpg';
import ig6 from '../../assets/contact/instagram-6.jpg';
import tiktok from '../../assets/contact/tiktok-light.svg';
import facebook from '../../assets/contact/facebook-light.svg';
import instagram from '../../assets/contact/instagram-light.svg';
import './InstagramStrip.css';

const POSTS = [ig1, ig2, ig3, ig4, ig5, ig6];
const SOCIALS = [
  { name: 'TikTok', icon: tiktok },
  { name: 'Facebook', icon: facebook },
  { name: 'Instagram', icon: instagram },
];

/**
 * "Life is good @EPIISOD" (Figma 539:23924): Instagram posts over a blurred photo.
 * The posts drift past in a slow loop (paused on hover); the backdrop lags behind the
 * scroll, and the section drifts and dims as the next one slides over it.
 */
export default function InstagramStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  useExitParallax(sectionRef);

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.instagram__backdrop',
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="instagram exit-parallax">
      <img className="instagram__backdrop" src={background} alt="" />
      <div className="instagram__tint" aria-hidden />

      <div className="instagram__content" data-exit-content>
        <div className="heading-group">
          <p className="eyebrow instagram__eyebrow">EPIISOD living</p>
          <h2 className="display-title instagram__title">
            Life is <em>good</em> @EPIISOD
          </h2>
        </div>

        <div className="instagram__bar">
          <p>#EPIISOD is on Instagram</p>
          <div className="instagram__follow">
            <p>Follow Us</p>
            <ul>
              {SOCIALS.map(({ name, icon }) => (
                <li key={name}>
                  <a href="#" aria-label={name}>
                    <img src={icon} width={34} height={34} alt="" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="instagram__strip">
          {/* Posts twice over, so the loop wraps seamlessly */}
          <ul className="instagram__track">
            {[...POSTS, ...POSTS].map((src, i) => (
              <li key={i} aria-hidden={i >= POSTS.length}>
                <a href="#" tabIndex={i >= POSTS.length ? -1 : undefined} aria-label={`Instagram post ${(i % POSTS.length) + 1}`}>
                  <img src={src} alt="" draggable={false} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="exit-shade" aria-hidden />
    </section>
  );
}
