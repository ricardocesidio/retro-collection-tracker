import React from 'react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'collection' | 'wishlist' | 'reviews' | 'activity' | 'friends' | 'notifications';
}

const presets: Record<string, { icon: string; title: string; message: string }> = {
  collection: { icon: 'fa-solid fa-gamepad', title: 'Your collection awaits', message: 'Every great collection starts with the first game. Browse the catalog and start building your legacy.' },
  wishlist: { icon: 'fa-solid fa-bookmark', title: 'Dream big, collect bigger', message: 'Save games you want to hunt down. Your wishlist is your roadmap to greatness.' },
  reviews: { icon: 'fa-solid fa-star', title: 'Your voice matters', message: 'Review games you own. Help other collectors discover hidden gems.' },
  activity: { icon: 'fa-solid fa-clock', title: 'The calm before the storm', message: 'Your activity will appear here once you start collecting, reviewing, and connecting.' },
  friends: { icon: 'fa-solid fa-users', title: 'Find your collector crew', message: 'Follow other collectors to see their collections and build your network.' },
  notifications: { icon: 'fa-solid fa-bell', title: 'All quiet on the western front', message: 'Notifications will appear when someone follows you, reviews your game, or adds to their wishlist.' },
};

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, children, variant = 'default' }) => {
  const preset = presets[variant];
  return (
    <div className={`empty-state empty-state--${variant}`}>
      <div className="empty-state__icon"><i className={icon || preset?.icon || 'fa-solid fa-box-open'} /></div>
      <h3 className="empty-state__title">{title || preset?.title || 'Nothing here yet'}</h3>
      <p className="empty-state__message">{message || preset?.message || ''}</p>
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
};

export default EmptyState;
