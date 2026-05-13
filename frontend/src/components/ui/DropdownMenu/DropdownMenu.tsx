import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.scss';

interface DropdownItem {
  label: string;
  icon?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ trigger, items, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={`dropdown${open ? ' dropdown--open' : ''}`} ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={`dropdown__menu dropdown__menu--${align}`}>
          {items.map((item, i) => (
            <button
              key={i}
              className={`dropdown__item${item.danger ? ' dropdown__item--danger' : ''}`}
              onClick={() => { item.onClick?.(); setOpen(false); }}
            >
              {item.icon && <span className="dropdown__item-icon"><i className={item.icon} /></span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
