'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

export interface CarouselItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  shopifyId?: number;
}

interface Props {
  items: CarouselItem[];
  ariaLabel?: string;
  onRemoveOne?: (item: CarouselItem) => void;
}

const FooterCarousel = ({ items, ariaLabel = 'Selected bundle items', onRemoveOne }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off?.('select', onSelect);
      emblaApi.off?.('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!items?.length) return null;

  return (
    <section role="region" aria-label={ariaLabel} className="footer-carousel">
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {items.map((item) => (
              <div className="embla__slide" key={item.id}>
                <div className="carousel-card">
                  {item.quantity > 1 && (
                    <span className="fc-badge">{item.quantity}</span>
                  )}

                  <img
                    src={item.image}
                    alt={item.name}
                    className="carousel-item"
                    loading="lazy"
                  />

                  <p className="carousel-caption">{item.name}</p>

                  {onRemoveOne && item.quantity > 0 && item.shopifyId && (
                    <button
                      type="button"
                      className="close-button"
                      onClick={() => onRemoveOne(item)}
                    >
                      <span className="material-icons">close</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canPrev}
        className={`fc-arrow fc-arrow--prev ${!canPrev ? 'is-disabled' : ''}`}
        aria-label="Scroll left"
      >
        <i className="material-icons">chevron_left</i>
      </button>

      <button
        type="button"
        onClick={scrollNext}
        disabled={!canNext}
        className={`fc-arrow fc-arrow--next ${!canNext ? 'is-disabled' : ''}`}
        aria-label="Scroll right"
      >
        <i className="material-icons">chevron_right</i>
      </button>
    </section>
  );
};

export default FooterCarousel;
