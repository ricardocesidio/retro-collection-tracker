import React from 'react';
import { Link } from 'react-router-dom';
import './Donate.scss';

const Donate: React.FC = () => {
  return (
    <div className="page-shell">
      <div className="donate-hero">
        <h1 className="donate-hero__title">Support the Project</h1>
        <p className="donate-hero__sub">Retro Collection Tracker is built by collectors, for collectors. Your support keeps the servers running and new features coming.</p>
      </div>

      <div className="donate-grid">
        <div className="panel donate-tier">
          <div className="donate-tier__icon"><i className="fa-solid fa-gamepad" /></div>
          <h2 className="donate-tier__name">Collector</h2>
          <div className="donate-tier__price">$3<span>/month</span></div>
          <ul className="donate-tier__perks">
            <li><i className="fa-solid fa-check" /> Early access to new features</li>
            <li><i className="fa-solid fa-check" /> Collector badge on profile</li>
            <li><i className="fa-solid fa-check" /> Custom profile colors</li>
          </ul>
          <a href="https://buy.stripe.com/test_123" className="btn btn--primary btn--lg donate-tier__cta" target="_blank" rel="noopener noreferrer">Support · $3/mo</a>
        </div>

        <div className="panel donate-tier donate-tier--featured">
          <div className="donate-tier__badge">Popular</div>
          <div className="donate-tier__icon"><i className="fa-solid fa-crown" /></div>
          <h2 className="donate-tier__name">Curator</h2>
          <div className="donate-tier__price">$7<span>/month</span></div>
          <ul className="donate-tier__perks">
            <li><i className="fa-solid fa-check" /> Everything in Collector</li>
            <li><i className="fa-solid fa-check" /> Curator badge on profile</li>
            <li><i className="fa-solid fa-check" /> Advanced analytics dashboard</li>
            <li><i className="fa-solid fa-check" /> Export collection to CSV</li>
          </ul>
          <a href="https://buy.stripe.com/test_456" className="btn btn--primary btn--lg donate-tier__cta" target="_blank" rel="noopener noreferrer">Support · $7/mo</a>
        </div>

        <div className="panel donate-tier">
          <div className="donate-tier__icon"><i className="fa-solid fa-gem" /></div>
          <h2 className="donate-tier__name">Museum</h2>
          <div className="donate-tier__price">$15<span>/month</span></div>
          <ul className="donate-tier__perks">
            <li><i className="fa-solid fa-check" /> Everything in Curator</li>
            <li><i className="fa-solid fa-check" /> Museum badge on profile</li>
            <li><i className="fa-solid fa-check" /> Priority feature requests</li>
            <li><i className="fa-solid fa-check" /> Name in the credits</li>
            <li><i className="fa-solid fa-check" /> Exclusive Discord role</li>
          </ul>
          <a href="https://buy.stripe.com/test_789" className="btn btn--primary btn--lg donate-tier__cta" target="_blank" rel="noopener noreferrer">Support · $15/mo</a>
        </div>
      </div>

      <div className="panel donate-onetime">
        <h2>One-Time Donation</h2>
        <p>Prefer to chip in once? Every contribution helps keep the catalog growing and the lights on.</p>
        <div className="donate-onetime__amounts">
          {[5, 10, 25, 50, 100].map((n) => (
            <a key={n} href={`https://buy.stripe.com/test_${n}00`} className="donate-onetime__chip" target="_blank" rel="noopener noreferrer">${n}</a>
          ))}
        </div>
      </div>

      <div className="donate-footer">
        <p>Total raised this month: <strong>$247</strong> · Goal: <strong>$500</strong></p>
        <div className="donate-footer__bar"><div className="donate-footer__fill" style={{ width: '49%' }} /></div>
        <p className="donate-footer__thanks">Thank you to all 34 supporters! ♥</p>
      </div>
    </div>
  );
};

export default Donate;
