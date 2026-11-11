import { useRef, useState } from 'react';
import Nav from '../components/Nav';
import FilterTabs from '../../components/property/FilterTabs';
import BlogCard, { postHref } from '../components/blog/BlogCard';
import WhyLiving from '../../components/why/WhyLiving';
import AboutClosing from '../../components/about/AboutClosing';
import Footer from '../components/Footer';
import VLine from '../../components/VLine';
import { gsap, useGSAP } from '../../lib/smoothScroll';
import { AUDIENCES, POSTS, categoryTone, postMeta } from '../../components/blog/blogData';
import line from '../../assets/cta-line.svg';
import '../../components/blog/Blog.css';

const ALL = 'All';
/**
 * The tabs: first the two audiences (each showing its blog's posts) and Moving In, then
 * every other category of both blogs. Each tab maps to the posts it shows.
 */
const AUDIENCE_TABS: Record<string, string> = { 'For Parents': 'for-parents', 'For International Students': 'for-international-students' };
const CATEGORY_TABS: Record<string, string> = { 'Moving In': 'Moving in' };
/** Categories without a tab of their own; their posts show under All and their audience. */
const NO_TAB = ['Settling in', 'Staying connected', 'Safety & wellbeing', 'Exploring Sydney'];
const OTHER_CATEGORIES = [...new Set(AUDIENCES.flatMap((a) => a.categories))].filter(
  (c) => !Object.values(CATEGORY_TABS).includes(c) && !NO_TAB.includes(c),
);
const TABS = [ALL, ...Object.keys(AUDIENCE_TABS), ...Object.keys(CATEGORY_TABS), ...OTHER_CATEGORIES];
const inTab = (p: (typeof POSTS)[number], tab: string) =>
  tab === ALL || (AUDIENCE_TABS[tab] ? p.audience === AUDIENCE_TABS[tab] : p.category === (CATEGORY_TABS[tab] ?? tab));
/** Newest first, across both blogs. */
const ALL_POSTS = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
/** Posts shown at first, and added by each "Load more". */
const PAGE = 6;

/**
 * v2: v1's blog listing under v2's navigation and above v2's footer, as one blog — every
 * post from For parents and For international students, newest first, with all of both
 * blogs' categories to filter by.
 */
/**
 * A blog's listing (Figma 1082:18368): the featured post, then the rest by category, six
 * at a time, then the "Write your story" band and the footer.
 */
export default function BlogListPage() {
  const [category, setCategory] = useState(ALL);
  const [shown, setShown] = useState(PAGE);
  const [featured, ...rest] = ALL_POSTS;
  const listed = rest.filter((p) => inTab(p, category));
  const listRef = useRef<HTMLElement>(null);

  // A soft hand-over from the heading to the featured post: the heading lags and fades a
  // little as the page scrolls, the card rises over it, and its photo drifts in its frame
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.blog-list__heading', {
          y: 90,
          opacity: 0.35,
          ease: 'none',
          // From the top of the page until the heading has left the screen
          scrollTrigger: { trigger: '.blog-list__heading', start: 0, end: 'bottom top', scrub: 0.8 },
        });
        gsap.fromTo(
          '.blog-featured__image',
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: '.blog-featured',
              // clamp(): starts from the top of the page, with nothing moved
              start: 'clamp(top bottom)',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });
    },
    { scope: listRef },
  );

  return (
    <>
      <Nav tone="cream" />
      <main>
        <section ref={listRef} className="blog-list">
          <div className="blog-list__heading">
            <h1 className="type-h1">
              EPIISOD <em>blogs</em>
            </h1>
            <VLine src={line} length={100} />
          </div>

          {featured && (
            <a href={postHref(featured)} className="blog-featured">
              <span className="blog-featured__media">
                <img
                  className="blog-featured__image"
                  src={featured.image}
                  style={{ objectPosition: featured.imagePosition }}
                  alt=""
                />
              </span>
              <span className={`blog-tag blog-tag--${categoryTone(featured.category)} blog-featured__category`}>
                {featured.category}
              </span>
              <span className="blog-featured__body">
                <span className="blog-featured__text">
                  <span className="eyebrow blog-featured__eyebrow">Featured</span>
                  <span className="type-h3 blog-featured__title">{featured.title}</span>
                  <span className="type-body-l blog-featured__excerpt">{featured.excerpt}</span>
                </span>
                <span className="blog-featured__foot">
                  <span className="blog-meta">{postMeta(featured)}</span>
                  <span className="blog-button">Read more</span>
                </span>
              </span>
            </a>
          )}

          <div className="blog-list__posts">
            <FilterTabs
              className="blog-list__filters"
              label="Category"
              options={TABS}
              value={category}
              onChange={(c) => {
                setCategory(c);
                setShown(PAGE);
              }}
            />
            {listed.length ? (
              <div className="blog-grid">
                {listed.slice(0, shown).map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            ) : (
              <p className="blog-list__empty">No posts in this category yet.</p>
            )}
          </div>

          {shown < listed.length && (
            <button type="button" className="blog-button" onClick={() => setShown((n) => n + PAGE)}>
              Load more
            </button>
          )}
        </section>
        <WhyLiving bookHref="/v2/locations/macquarie-park#rooms" />
        <AboutClosing />
      </main>
      <Footer />
    </>
  );
}
