"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  onClose: (e: any) => void;
  children: React.ReactNode | React.ReactNode[]
};

export const Portal = ({ children, onClose }: PortalProps): JSX.Element => {
  useEffect(() => {
    const modalKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        onClose(event);
      }
    };

    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', modalKeyDown);

    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', modalKeyDown);
    };
  }, []);

  return createPortal(
    <>{children}</>,
    document.body
  );
};
