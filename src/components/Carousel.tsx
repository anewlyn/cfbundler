'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode } from 'react';

const Carousel = ({ children }: { children: ReactNode }) => {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">{children}</div>
    </div>
  );
};

export default Carousel;
