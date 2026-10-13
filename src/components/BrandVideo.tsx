import { useEffect, useRef, useState } from 'react';
import VLine from './VLine';
import { gsap, useGSAP } from '../lib/smoothScroll';
import thumbnail from '../assets/video-thumbnail.jpg';
import line from '../assets/make-it-yours-line.svg';
import playCircle from '../assets/play-circle.svg';
import './BrandVideo.css';

/** "Luxury hotel room panning shot" — Mixkit Stock Video Free License. */
const VIDEO_SRC = '/media/brand-film.mp4';
/** Side of the thumbnail square in Figma 539:10149. */
const THUMB_SIZE = 300;
/** Scroll distance (px) the pinned reveal is spread over — larger is slower. */
const EXPAND_SCROLL = 1000;

/**
 * Figma 539:10149 → 539:11535. The frame always occupies its full 1136×639 slot
 * (so nothing below shifts); scroll reveals it from a 300px square — sitting right
 * under the heading — out to the full video frame, while the image eases from
 * cover-fitting the square to filling the frame. The tint and play button arrive
 * at the end; pressing play starts the film in place.
 */
export default function BrandVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const size = () => Math.min(THUMB_SIZE, stage.clientWidth, stage.clientHeight);
        const insetY = () => (stage.clientHeight - size()) / 2;
        const insetX = () => (stage.clientWidth - size()) / 2;
        // Top of `el` within the section, summed through any offsetParents (the transformed
        // GSAP layers count as one in Chrome); offsets ignore transforms, so it's stable.
        const topInSection = (el: HTMLElement) => {
          let top = 0;
          for (let n: HTMLElement | null = el; n && n !== section; n = n.offsetParent as HTMLElement | null) {
            top += n.offsetTop;
          }
          return top;
        };
        // How far to lift the content when the frame is fully open: centre the heading
        // and frame together, as in Figma 539:11535, or just the frame if both won't fit.
        const lift = () => {
          const heading = section.querySelector<HTMLElement>('.brand-video .heading-group');
          const frameTop = topInSection(stage);
          const frameBottom = frameTop + stage.offsetHeight;
          const blockTop = heading ? topInSection(heading) : frameTop;
          const vh = window.innerHeight;
          const centreOn = frameBottom - blockTop <= vh - 48 ? (blockTop + frameBottom) / 2 : frameTop + stage.offsetHeight / 2;
          return Math.max(0, centreOn - vh / 2);
        };

        // 1) Reveal: pinned from the Figma start state (section at the top of the screen,
        //    square under the heading) and stretched over EXPAND_SCROLL px, with a soft
        //    catch-up (scrub: 1) so it glides rather than tracking the wheel exactly.
        const reveal = gsap
          .timeline({
            defaults: { ease: 'power2.inOut', duration: 1 },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: `+=${EXPAND_SCROLL}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .fromTo('.brand-video__lift', { y: 0 }, { y: () => -lift(), ease: 'power1.inOut' }, 0)
          .fromTo(
            '.brand-video__frame',
            {
              clipPath: () => `inset(${insetY()}px ${insetX()}px ${insetY()}px ${insetX()}px)`,
              y: () => -insetY(),
            },
            { clipPath: 'inset(0px 0px 0px 0px)', y: 0 },
            0,
          )
          .fromTo('.brand-video__thumb', { scale: () => size() / stage.clientHeight }, { scale: 1 }, 0)
          .fromTo('.brand-video__tint', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'none' }, 0.6)
          .fromTo(
            '.brand-video__play',
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
            0.7,
          );

        // 2) Exit — the hero's treatment: once the frame is open, the section drifts at
        //    half speed so the next section slides up over it, and the image darkens.
        const pin = reveal.scrollTrigger!;
        gsap
          .timeline({
            defaults: { ease: 'none', duration: 1 },
            scrollTrigger: {
              trigger: section,
              start: () => pin.end,
              end: () => pin.end + section.offsetHeight,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .fromTo('.brand-video__drift', { y: 0 }, { y: () => section.offsetHeight * 0.5 }, 0)
          .fromTo('.brand-video__shade', { opacity: 0 }, { opacity: 0.6 }, 0);
      });
    },
    { scope: sectionRef },
  );

  // Pause if the viewer scrolls away mid-film.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.play().catch(() => setStarted(false));
  };

  return (
    <section ref={sectionRef} className={`brand-video${started ? ' is-started' : ''}`}>
      {/* drift: exit parallax · lift: centres the frame while pinned */}
      <div className="brand-video__drift">
        <div className="brand-video__lift">
          <div className="brand-video__intro">
            <VLine src={line} length={100} />
            <div className="heading-group">
              <p className="eyebrow">Make it yours</p>
              <h2 className="display-title">
                Live <em>well</em>, study <em>better</em>
              </h2>
            </div>
          </div>

          <div ref={stageRef} className="brand-video__stage">
            <div className="brand-video__frame">
              <img className="brand-video__thumb" src={thumbnail} alt="" />
              <video
                ref={videoRef}
                className="brand-video__video"
                poster={thumbnail}
                preload="none"
                playsInline
                controls={started}
                onEnded={() => setStarted(false)}
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
              <div className="brand-video__tint" aria-hidden />
              <div className="brand-video__shade" aria-hidden />
              <button
                type="button"
                className="brand-video__play"
                onClick={play}
                aria-label="Play brand film"
              >
                <img src={playCircle} width={124} height={124} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
