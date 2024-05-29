"use client";

import classNames from 'classnames';
import { ReactNode, useEffect, useRef } from 'react';
import { Portal } from './Portal';

export type ModalProps = {
  open: boolean;
  onClose: (e: any) => void;
  closeButtonIcon?: string;
  children: ReactNode;
  ariaModalLabel: string; // Describes the modal
  ariaCloseLabel?: string;
  appendClassName?: string;
  hasMobileClose?: boolean;
};

export const Modal = ({ open, onClose, children, ariaModalLabel, ariaCloseLabel = 'Close modal', closeButtonIcon = 'close', appendClassName, hasMobileClose }: ModalProps): JSX.Element | null => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  useEffect(() => {
    modalRef.current?.focus();

    const trapFocus = (e: any) => {
      const focusableEls = modalRef.current?.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
      );
      const firstFocusableEl = focusableEls && focusableEls[0];
      const lastFocusableEl = focusableEls && focusableEls[focusableEls.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableEl) {
            // @ts-ignore
            lastFocusableEl.focus();
            e.preventDefault();
          }
        } /* tab */ else {
          if (document.activeElement === lastFocusableEl) {
            // @ts-ignore
            firstFocusableEl.focus();
            e.preventDefault();
          }
        }
      }
    };

    modalRef.current?.addEventListener('keydown', trapFocus);

    return () => {
      modalRef.current?.removeEventListener('keydown', trapFocus);
    };
  }, [modalRef.current]);

  if (open) {
    return (
      <Portal onClose={onClose}>
        <aside
          ref={modalRef}
          className={classNames('modal-overlay', appendClassName)}
          aria-label={ariaModalLabel}
          tabIndex={-1}
        >
          <div className='modal'>
            <div className='modal-content'>
              {children}
              {
                hasMobileClose && (
                  <button
                    onClick={onClose}
                    className="modal-close-mobile-button"
                    aria-label={ariaCloseLabel}
                  >
                    {closeButtonIcon.toUpperCase()}
                  </button>
                )
              }
            </div>
            <button
              onClick={onClose}
              className="modal-close-button"
              aria-label={ariaCloseLabel}
            >
              <i className="material-icons">{closeButtonIcon}</i>
            </button>

          </div>
        </aside>
      </Portal>
    );
  }

  return null;
};
