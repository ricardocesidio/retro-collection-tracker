import React, { useEffect } from 'react';
import './Modal.scss';

interface ModalProps {
  open: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  closeOnBackdrop?: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  size = 'md',
  closeOnBackdrop = true,
  onClose,
  footer,
  children,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => closeOnBackdrop && onClose()}>
      <div className={`modal modal--${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
