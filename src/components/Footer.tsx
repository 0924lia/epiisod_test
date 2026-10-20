import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/smoothScroll';
import tiktok from '../assets/footer/tiktok.svg';
import facebook from '../assets/footer/facebook.svg';
import instagram from '../assets/footer/instagram.svg';
import wechat from '../assets/footer/wechat.svg';
import whatsapp from '../assets/footer/whatsapp.svg';
import wm01 from '../assets/footer/wordmark-01.svg';
import wm02 from '../assets/footer/wordmark-02.svg';
import wm03 from '../assets/footer/wordmark-03.svg';
import wm04 from '../assets/footer/wordmark-04.svg';
import wm05 from '../assets/footer/wordmark-05.svg';
import wm06 from '../assets/footer/wordmark-06.svg';
import wm07 from '../assets/footer/wordmark-07.svg';
import wm08 from '../assets/footer/wordmark-08.svg';
import wm09 from '../assets/footer/wordmark-09.svg';
import wm10 from '../assets/footer/wordmark-10.svg';
import wm11 from '../assets/footer/wordmark-11.svg';
import wm12 from '../assets/footer/wordmark-12.svg';
import './Footer.css';

/** The giant EPIISOD wordmark's parts, positioned as in Figma 539:18159 (top right bottom left, %). */
const WORDMARK: { src: string; inset: string; kind: 'arc-top' | 'arc-bottom' | 'letter' }[] = [
  // arcs
  { src: wm01, inset: '0.92% 12.3% 64.45% 72.86%', kind: 'arc-top' },
  { src: wm02, inset: '0% 43.42% 64.45% 41.46%', kind: 'arc-top' },
  { src: wm03, inset: '0.94% 74.84% 64.45% 10.33%', kind: 'arc-top' },
  { src: wm04, inset: '64.67% 27.8% -0.07% 57.1%', kind: 'arc-bottom' },
  { src: wm05, inset: '64.67% 59.11% 0.14% 25.88%', kind: 'arc-bottom' },
  // letters E P I I S O D
  { src: wm06, inset: '21.84% 95.11% 21.62% 0%', kind: 'letter' },
  { src: wm07, inset: '22.08% 79.08% 21.86% 15.4%', kind: 'letter' },
  { src: wm08, inset: '22.31% 65.95% 22.09% 32.51%', kind: 'letter' },
  { src: wm09, inset: '22.31% 50.26% 22.09% 48.2%', kind: 'letter' },
  { src: wm10, inset: '21.22% 33% 20.98% 62.31%', kind: 'letter' },
  { src: wm11, inset: '21.24% 14.85% 21.02% 75.55%', kind: 'letter' },
  { src: wm12, inset: '21.77% 0% 21.56% 92.08%', kind: 'letter' },
];

const SOCIALS = [
  { name: 'TikTok', icon: tiktok },
  { name: 'Facebook', icon: facebook },
  { name: 'Instagram', icon: instagram },
  { name: 'WeChat', icon: wechat },
  { name: 'WhatsApp', icon: whatsapp },
];

const LOCATIONS = [
  { city: 'Sydney', sites: ['Macquarie Park'] },
  { city: 'Perth', sites: ['Fairway', 'Stirling'] },
  { city: 'Melbourne', sites: ['North Melbourne', 'Central Melbourne'] },
  { city: 'London', sites: ['Euston'] },
];

const EPIISOD_LINKS = ['About', 'Why EPIISOD', 'Experience', 'For Parents', 'For International Students', 'Blog'];
const CONTACT_LINKS = ['Contact Us', 'Book a Tour', 'FAQS'];
const POLICY_LINKS = ['Cancellation', 'Policy 1', 'Policy 2'];
/** Footer links with a page so far; the rest link to '#' until their pages exist. */
const LINK_HREFS: Record<string, string> = { About: '/about', 'Why EPIISOD': '/why-epiisod', 'Contact Us': '/contact' };
const LEGAL_LINKS = ['Terms and Condition', 'Something something', 'Something something'];

function LinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="footer__group">
      <h2 className="type-h5 footer__heading">{title}</h2>
      <ul className="footer__links">
        {links.map((link) => (
          <li key={link}>
            <a href={LINK_HREFS[link] ?? '#'}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Figma 539:18251: giant wordmark over a light cream footer with three link columns.
 * As the footer scrolls in, the wordmark assembles: letters rise into place at
 * alternating depths (parallax), staggered left to right, and the arcs swing in around
 * their circle centres — landing exactly as designed at the bottom of the page.
 */
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const letters = gsap.utils.toArray<HTMLElement>('.footer__wordmark-part--letter');
        const arcsTop = gsap.utils.toArray<HTMLElement>('.footer__wordmark-part--arc-top');
        const arcsBottom = gsap.utils.toArray<HTMLElement>('.footer__wordmark-part--arc-bottom');

        const tl = gsap.timeline({
          defaults: { ease: 'sine.out' },
          scrollTrigger: {
            trigger: footer,
            // Spread over a long stretch of scroll while the wordmark is on screen: from
            // as it comes into view until it's well up the screen, so it assembles slowly
            start: 'top 95%',
            // clamp(): on very tall screens the page can't scroll that far, so it finishes
            // at the bottom of the page instead
            end: 'clamp(top 15%)',
            // A gentle catch-up, so the pieces glide after the scroll
            scrub: 1.2,
          },
        });

        // Letters: drift up out of the wordmark's band (which clips them) at alternating
        // depths, overlapping one another left → right.
        letters.forEach((el, i) => {
          tl.fromTo(
            el,
            { yPercent: i % 2 ? 140 : 90, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1 },
            i * 0.12,
          );
        });

        // Arcs: swing softly into place around their circle centres (below the top arcs,
        // above the bottom ones), alternating direction.
        [...arcsTop, ...arcsBottom].forEach((el, i) => {
          tl.fromTo(
            el,
            { rotation: i % 2 ? 60 : -60, opacity: 0 },
            { rotation: 0, opacity: 1, duration: 1.1, ease: 'sine.inOut' },
            0.3 + i * 0.12,
          );
        });
      });
    },
    { scope: footerRef },
  );

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer__brand">
        <div className="footer__wordmark" role="img" aria-label="EPIISOD">
          {WORDMARK.map((part, i) => (
            <span
              key={i}
              className={`footer__wordmark-part footer__wordmark-part--${part.kind}`}
              style={{ inset: part.inset }}
            >
              <img src={part.src} alt="" />
            </span>
          ))}
        </div>
      </div>

      <div className="footer__body">
        <div className="footer__inner">
          <div className="footer__columns">
            <div className="footer__column">
              <LinkGroup title="EPIISOD" links={EPIISOD_LINKS} />
              <div className="footer__group footer__group--follow">
                <h2 className="type-h5 footer__heading">Follow us</h2>
                <ul className="footer__socials">
                  {SOCIALS.map((s) => (
                    <li key={s.name}>
                      <a href="#" aria-label={s.name}>
                        <img src={s.icon} width={34} height={34} alt="" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer__column">
              <div className="footer__group">
                <h2 className="type-h5 footer__heading">Locations</h2>
                <div className="footer__locations">
                  {LOCATIONS.map((loc) => (
                    <ul key={loc.city} className="footer__links">
                      <li className="footer__city">{loc.city}</li>
                      {loc.sites.map((site) => (
                        <li key={site}>
                          <a href="#">{site}</a>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer__column">
              <LinkGroup title="Contact" links={CONTACT_LINKS} />
              <LinkGroup title="Policies" links={POLICY_LINKS} />
            </div>
          </div>

          <p className="footer__legal">
            {LEGAL_LINKS.map((link, i) => (
              <span key={i}>{link}</span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
