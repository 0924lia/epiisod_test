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

function LinkGroup({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="footer__group">
      <p className="footer__heading">{title}</p>
      <ul className="footer__links">
        {links.map((link) => (
          <li key={link}>
            <a href="#">{link}</a>
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
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            // Settles a little before the very bottom so it rests as designed
            end: 'top 15%',
            scrub: true,
          },
        });

        // Letters: rise from below at alternating depths, staggered left → right.
        letters.forEach((el, i) => {
          tl.fromTo(
            el,
            { yPercent: i % 2 ? 55 : 30, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6 },
            i * 0.06,
          );
        });

        // Arcs: swing into place around their circle centres (below the top arcs,
        // above the bottom ones), alternating direction.
        [...arcsTop, ...arcsBottom].forEach((el, i) => {
          tl.fromTo(
            el,
            { rotation: i % 2 ? 22 : -22, opacity: 0 },
            { rotation: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
            0.15 + i * 0.07,
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
              <div className="footer__group">
                <p className="footer__heading">Follow us</p>
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
                <p className="footer__heading">Locations</p>
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
            Terms and Condition&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Something something&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Something
            something
          </p>
        </div>
      </div>
    </footer>
  );
}
