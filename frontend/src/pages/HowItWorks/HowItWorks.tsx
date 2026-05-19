import React from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.scss';

const sections = [
  {
    id: 'overview',
    icon: 'fa-solid fa-compass',
    title: 'Overview',
    content: 'Retro Collection Tracker is a community platform for retro game collectors. Track your collection, discover new games via RAWG, trade with other collectors, earn XP, and connect with fellow enthusiasts — all in one place.',
  },
  {
    id: 'xp',
    icon: 'fa-solid fa-arrow-trend-up',
    title: 'XP & Master Levels',
    content: 'Every action you take earns XP: +10 for adding a game, +15 for writing a review, +5 for wishlisting, +20 for gaining a follower. Level up from New Collector (0 XP) → Avid Collector (50 XP) → Master Collector (200 XP) → Museum Curator (500 XP). Your level and progress bar appear on your profile.',
  },
  {
    id: 'profiles',
    icon: 'fa-solid fa-circle-user',
    title: 'Profiles & Collectors',
    content: 'Your profile showcases your collection size, XP level, follower count, and recent activity. Follow other collectors to see their collections and reviews. The leaderboard ranks collectors by total collection value.',
  },
  {
    id: 'games',
    icon: 'fa-solid fa-layer-group',
    title: 'Adding Games',
    content: 'Search the Explore page to find games from the RAWG database (800K+ titles). Click any game to import it into the local database, then add it to your collection with condition, region, estimated value, and your personal rating. You can edit or remove games anytime.',
  },
  {
    id: 'trades',
    icon: 'fa-solid fa-handshake',
    title: 'Trade Requests',
    content: 'Propose trades with other collectors from their profile page. Specify which game you\'re offering and which you want. The other user can accept or decline. Trades are agreements — the actual exchange happens between collectors. Location badges help determine shipping feasibility.',
  },
  {
    id: 'chat',
    icon: 'fa-solid fa-envelope',
    title: 'Chat System',
    content: 'Send direct messages to any collector. Conversations are real-time via WebSocket. You can send text messages and photos. Use the chat widget (bottom-right) for quick replies or the full Messages page for detailed conversations.',
  },
  {
    id: 'reviews',
    icon: 'fa-solid fa-star',
    title: 'Reviews & Ratings',
    content: 'Every game has two ratings: a RAWG community score (from the global gaming community) and a Community Rating (average from our collectors). You can write reviews with star ratings (1-5), optional title and body. Other users can like your reviews and comment on them.',
  },
  {
    id: 'wishlist',
    icon: 'fa-solid fa-bookmark',
    title: 'Wishlist',
    content: 'Save games you want to collect in the future. Set priority levels (P1-P4) and estimated values. Sort by priority, title, or value. You can move items from your wishlist to your collection when you acquire them.',
  },
  {
    id: 'dashboard',
    icon: 'fa-solid fa-border-all',
    title: 'Dashboard & Analytics',
    content: 'Your dashboard shows total games, collection value, wishlist count, recently added games, collection value over time, recent reviews, platform distribution (donut chart), top genres, recent activity, and wishlist spotlight. Most valuable and highest-rated games are highlighted.',
  },
  {
    id: 'notifications',
    icon: 'fa-solid fa-bell',
    title: 'Notifications',
    content: 'Get notified when someone follows you, reviews a game you own, or when a wishlisted item becomes available. Unread count shows on the bell icon. Click to view and manage notifications. Mark individual or all notifications as read.',
  },
  {
    id: 'rawg',
    icon: 'fa-solid fa-globe',
    title: 'RAWG Integration',
    content: 'RAWG is the world\'s largest video game database with 800K+ games. We use it to power the Explore page — search, browse, and import games with real cover art, ratings, platforms, and genres. RAWG ratings are clearly labeled and separate from community ratings.',
  },
  {
    id: 'moderation',
    icon: 'fa-solid fa-shield-halved',
    title: 'Moderation & Safety',
    content: 'Block users to prevent them from messaging you — blocked conversations remain visible but messaging is disabled. Unblock anytime. Report users for harassment, racism, spam, threats, or other issues. Reports are stored with reason and context. Chat deletion is a separate action from blocking.',
  },
  {
    id: 'demo',
    icon: 'fa-solid fa-flask',
    title: 'Demo Accounts & Data',
    content: 'The app includes demo accounts (bob_collector, retro_charlie, diana_gamer) with pre-seeded collections and follower relationships. These demonstrate how the platform works. Trade requests, chat messages, and reviews from demo accounts are real backend data. XP values are calculated from actual game counts and actions.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="page-shell" style={{ maxWidth: 800 }}>
      <h1 className="page-title">How It Works</h1>
      <p className="page-sub">Everything you need to know about Retro Collection Tracker</p>

      <div className="hiw-grid">
        {sections.map((s) => (
          <div key={s.id} className="hiw-card" id={s.id}>
            <div className="hiw-card__header">
              <span className="hiw-card__icon"><i className={s.icon} /></span>
              <h2 className="hiw-card__title">{s.title}</h2>
            </div>
            <p className="hiw-card__text">{s.content}</p>
          </div>
        ))}
      </div>

      <div className="hiw-footer">
        <p>Still have questions? <Link to="/settings">Visit Settings</Link> or check the <Link to="/leaderboard">Leaderboard</Link> to see top collectors.</p>
      </div>
    </div>
  );
};

export default HowItWorks;
