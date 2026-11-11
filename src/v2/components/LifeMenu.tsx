import { MegaMenuPanel } from './MegaMenu';
import image from '../../assets/v2/mega-life.jpg';
import './MenuPanels.css';

type LifeMenuProps = {
  id: string;
  open: boolean;
  onNavigate: () => void;
};

type Item = { title: string; text: string; href: string };

/** Figma 1465:13198: two columns of two. */
const COLUMNS: Item[][] = [
  [
    { title: 'Why EPIISOD', text: 'Where your story finds its place', href: '/v2/why-epiisod' },
    { title: 'Experience', text: 'The EPIISOD Experience that goes beyond accommodation', href: '/v2/experience' },
  ],
  [
    // Figma's lines for these two are placeholders ("Something")
    { title: 'Blogs', text: 'Guides and stories for student life', href: '/v2/blog' },
    { title: 'Promotions', text: 'EPIISOD’s exclusive deals', href: '/v2/promotions' },
  ],
];

/** Life @ EPIISOD mega menu (Figma 1465:13198): photo beside two columns of page links. */
export default function LifeMenu({ id, open, onNavigate }: LifeMenuProps) {
  return (
    <MegaMenuPanel id={id} open={open} heading="Life @ EPIISOD">
      <div className="menu2">
        <img className="menu2__image menu2__image--life" src={image} alt="" />
        <div className="menu2__cols">
          {COLUMNS.map((col, i) => (
            <div key={i} className="menu2__col">
              {col.map((item) => (
                <a key={item.title} href={item.href} className="menu2__item" onClick={onNavigate}>
                  <span className="menu2__item-title">{item.title}</span>
                  <span className="menu2__item-text">{item.text}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </MegaMenuPanel>
  );
}
