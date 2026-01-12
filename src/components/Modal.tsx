'use client';

import classNames from 'classnames';
import { ReactNode, useEffect, useRef } from 'react';
import { Portal } from './Portal';

export type ModalProps = {
  open: boolean;
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  onClose: (e?: any) => void;
  closeButtonIcon?: string;
  children: ReactNode;
  ariaModalLabel: string; // Describes the modal
  ariaCloseLabel?: string;
  appendClassName?: string;
  hasCloseButton?: boolean;
};

export const Modal = ({
  open,
  onClose,
  children,
  ariaModalLabel,
  ariaCloseLabel = 'Close modal',
  closeButtonIcon = 'close',
  appendClassName,
  hasCloseButton,
}: ModalProps): JSX.Element | null => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  useEffect(() => {
    modalRef.current?.focus();
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    const trapFocus = (e: any) => {
      const focusableEls = modalRef.current?.querySelectorAll(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])',
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
  }, []);

  if (open) {
    return (
      <Portal onClose={onClose}>
        <aside
          ref={modalRef}
          className={classNames('product-modal-overlay', appendClassName)}
          aria-label={ariaModalLabel}
          tabIndex={-1}
        >
          <div className="product-modal">
            <div className="product-modal-content">{children}</div>
            {hasCloseButton && (
              <button onClick={onClose} className="product-modal-close-button" aria-label={ariaCloseLabel}>
                <i className="material-icons">{closeButtonIcon}</i>
              </button>
            )}
          </div>
        </aside>
      </Portal>
    );
  }

  return null;
};
