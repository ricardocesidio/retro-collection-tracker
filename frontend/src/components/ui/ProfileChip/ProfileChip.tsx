import React from 'react';
import './ProfileChip.scss';

interface ProfileChipProps {
  name: string;
  role?: string;
  avatar?: string;
  onClick?: () => void;
}

const ProfileChip: React.FC<ProfileChipProps> = ({ name, role = 'Collector', avatar, onClick }) => {
  return (
    <button className="profile-chip" onClick={onClick} aria-label={`Profile: ${name}`}>
      <div className="profile-chip__avatar">
        {avatar ? <img src={avatar} alt={name} /> : name.charAt(0).toUpperCase()}
      </div>
      <div className="profile-chip__info">
        <span className="profile-chip__name">{name}</span>
        <span className="profile-chip__role">{role}</span>
      </div>
      <span className="profile-chip__chevron"><i className="fa-solid fa-chevron-down" /></span>
    </button>
  );
};

export default ProfileChip;
