import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initSmoothScroll } from './lib/smoothScroll';
import './styles/global.css';

initSmoothScroll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
