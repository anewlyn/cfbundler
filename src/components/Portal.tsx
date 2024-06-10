'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type PortalProps = {
  onClose: (e: KeyboardEvent) => void;
  children: React.ReactNode | React.ReactNode[];
};

export const Portal = ({ children, onClose }: PortalProps): JSX.Element => {
  useEffect(() => {
    const modalKeyDown = (event: KeyboardEvent) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(<>{children}</>, document.body);
};
