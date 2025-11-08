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
                    <span className="fc-badge" aria-label={`${item.quantity} in bundle`}>
                      {item.quantity}
                    </span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="carousel-item" loading="lazy" />
                  <p className="carousel-caption">{item.name}</p>
                  {onRemoveOne && item.quantity > 0 && item.shopifyId && (
                    <button
                      type="button"
                      className="close-button"
                      aria-label={`Remove one ${item.name}`}
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

      {/* Navigation Arrows */}
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

      <style jsx>{`
        .footer-carousel {
          position: relative;
          padding: 1rem 2rem;
          background: var(--cf-footer-bg, #f7f7f7);
          border-radius: 8px;
        }

        .embla {
          overflow: hidden;
        }

        .embla__container {
          display: flex;
          gap: 12px;
        }

        .embla__slide {
          flex: 0 0 auto;
          width: 90px;
        }

        .carousel-card {
          position: relative;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 6px;
        }

        .carousel-item {
          width: 100%;
          height: 70px;
          object-fit: contain;
        }

        .carousel-caption {
          font-size: 11px;
          text-align: center;
          margin-top: 6px;
          color: #444;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fc-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          min-width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #111;
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button {
          position: absolute;
          top: -6px;
          left: -6px;
          background: black;
          border-radius: 50%;
          padding: 2px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        /* Arrows */
        .fc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: #fff;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }
        .fc-arrow--prev {
          left: 4px;
        }
        .fc-arrow--next {
          right: 4px;
        }
        .fc-arrow.is-disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .embla__slide {
            width: 80px;
          }
        }
        @media (max-width: 640px) {
          .embla__slide {
            width: 72px;
          }
        }
      `}</style>
    </section>
  );
};

export default FooterCarousel;
