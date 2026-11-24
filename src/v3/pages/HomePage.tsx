import './HomePage.css';

/**
 * v3's starting page: a placeholder until the new brand and layout are in. It shows the
 * type scale and colour roles so token changes can be seen at a glance.
 */
export default function HomePage() {
  return (
    <main className="v3-start">
      <p className="v3-start__label">EPIISOD v3 · new brand in progress</p>
      <h1 className="v3-start__display">Thoughtfully designed student living</h1>
      <h2 className="v3-start__h2">Heading two</h2>
      <h3 className="v3-start__h3">Heading three</h3>
      <p className="v3-start__body-lg">Large body copy for introductions and lead paragraphs.</p>
      <p>Body copy for everything else, set on the v3 tokens.</p>
      <a href="/v2" className="v3-start__button">
        View v2
      </a>
    </main>
  );
}
