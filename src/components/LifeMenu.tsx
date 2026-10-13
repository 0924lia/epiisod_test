import { MegaMenuPanel } from './MegaMenu';
import './LifeMenu.css';

type LifeMenuProps = {
  id: string;
  open: boolean;
  onNavigate: () => void;
};

const LINKS = [
  { title: 'Why EPIISOD', description: 'Where Your Story Finds Its Place' },
  {
    title: 'Experience',
    description:
      'The EPIISOD Experience goes beyond accommodation to create a living environment shaped around everyday ease, wellbeing, and connection.',
  },
];

/**
 * Life @ EPIISOD mega menu (Figma 539:20915): page links with a short description,
 * highlighting on hover (Figma 539:21311).
 */
export default function LifeMenu({ id, open, onNavigate }: LifeMenuProps) {
  return (
    <MegaMenuPanel id={id} open={open} heading="Life @ EPIISOD">
      <div className="life-menu__links">
        {LINKS.map(({ title, description }) => (
          <a key={title} href="#" className="life-menu__link" onClick={onNavigate}>
            <span className="life-menu__title">{title}</span>
            <span className="life-menu__description">{description}</span>
          </a>
        ))}
      </div>
    </MegaMenuPanel>
  );
}
