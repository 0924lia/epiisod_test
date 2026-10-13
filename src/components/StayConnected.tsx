import { useState } from 'react';
import type { FormEvent } from 'react';
import VLine from './VLine';
import ctaLine from '../assets/cta-line.svg';
import arrowRight from '../assets/arrow-right-submit.svg';
import arrowRightWhite from '../assets/arrow-right-white-sm.svg';
import './StayConnected.css';

/**
 * Figma 539:11773 / 539:11875. Fields turn white with a bronze border while focused;
 * once both are filled, SUBMIT becomes a solid bronze button with white type.
 */
export default function StayConnected() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ready = name.trim() !== '' && email.trim() !== '';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: connect to the newsletter provider.
    setSubmitted(true);
  };

  return (
    <section className="stay-connected">
      <VLine src={ctaLine} length={100} />
      <h2 className="display-title stay-connected__title">
        Stay <em className="medium">connected</em> to the story
      </h2>

      <form className="stay-connected__form" onSubmit={onSubmit}>
        <label className="stay-connected__field">
          <span className="visually-hidden">Your name</span>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="stay-connected__field">
          <span className="visually-hidden">Email address</span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit" className={`stay-connected__submit${ready ? ' is-ready' : ''}`}>
          <span>{submitted ? 'Thank you' : 'Submit'}</span>
          <span className="stay-connected__arrow">
            <img className="stay-connected__arrow-default" src={arrowRight} width={24} height={24} alt="" />
            <img className="stay-connected__arrow-ready" src={arrowRightWhite} width={24} height={24} alt="" />
          </span>
        </button>
      </form>
    </section>
  );
}
