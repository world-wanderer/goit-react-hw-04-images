import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BsXLg } from 'react-icons/bs';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({
  title,
  onClose,
  currentImageUrl,
  currentImageDescription,
}) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleClickBackdrop = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return createPortal(
    <div onClick={handleClickBackdrop} className={css.overlay}>
      <div className={css.modal}>
        <div className={css.wrapper}>
          {title && <h1 className={css.title}>{title}</h1>}
          <button className={css.button} type="button" onClick={onClose}>
            <BsXLg className={css.icon} />
          </button>
        </div>
        <img
          src={currentImageUrl}
          alt={currentImageDescription}
          loading="lazy"
        />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  currentImageUrl: PropTypes.string,
  currentImageDescription: PropTypes.string,
};

export default Modal;
