'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode, forwardRef } from 'react';

const Carousel = forwardRef(
  ({ children }: { children: ReactNode }, ref: React.Ref<HTMLDivElement>) => {
    const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });

    return (
      <div className={'embla'} ref={emblaRef}>
        <div className={'embla__container'} ref={ref}>
          {children}
        </div>
      </div>
    );
  },
);

export default Carousel;
