'use client';

import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react';

export interface CarouselItem {
  id: string;
  name: string;
  image: string;
  quantity: number;   // 0 for placeholders
  shopifyId?: number;
}

interface Props {
  items: CarouselItem[];
  ariaLabel?: string;
  onRemoveOne?: (item: CarouselItem) => void;
}

const FooterCarousel = ({ items, ariaLabel = 'Selected bundle items', onRemoveOne }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const listboxRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(() => items ?? [], [items]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        scrollPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        scrollNext();
        break;
      case 'Home':
        e.preventDefault();
        scrollTo(0);
        break;
      case 'End':
        e.preventDefault();
        scrollTo(slides.length - 1);
        break;
      case 'PageUp':
        e.preventDefault();
        scrollPrev();
        break;
      case 'PageDown':
        e.preventDefault();
        scrollNext();
        break;
    }
  };

  if (!slides.length) return null;

  return (
    <section role="region" aria-label={ariaLabel} className="footer-carousel relative">
      {/* Prev */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canPrev}
        className={`fc-arrow fc-arrow--prev ${!canPrev ? 'is-disabled' : ''}`}
        aria-label="Scroll selected items left"
      >
        <i className="material-icons">chevron_left</i>
      </button>

      {/* Embla root */}
      <div
        className="embla mx-12"
        role="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
        ref={listboxRef}
        onKeyDown={onKeyDown}
      >
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((item, idx) => (
              <div
                key={item.id}
                className="embla__slide carousel-item-container"
                role="option"
                aria-selected={idx === selectedIndex}
                aria-label={item.name}
              >
                <div className="carousel-card">
                  {item.quantity > 1 && (
                    <span className="fc-badge" aria-label={`${item.quantity} in bundle`}>
                      {item.quantity}
                    </span>
                  )}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Next */}
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canNext}
        className={`fc-arrow fc-arrow--next ${!canNext ? 'is-disabled' : ''}`}
        aria-label="Scroll selected items right"
      >
        <i className="material-icons">chevron_right</i>
      </button>

      {/* Minimal baseline styles (scoped) */}
      <style jsx>{`
        .footer-carousel {
          padding: 1rem 2rem;
          background: var(--cf-footer-bg, #f7f7f7);
          border-radius: 8px;
        }
        .fc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: #fff;
          border-radius: 999px;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          z-index: 5;
        }
        .fc-arrow--prev {
          left: 8px;
        }
        .fc-arrow--next {
          right: 8px;
        }
        .fc-arrow.is-disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Embla essentials */
        .embla {
          position: relative;
        }
        .embla__viewport {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
          gap: 12px;
        }
        .embla__slide {
          flex: 0 0 auto;
          width: 96px; /* fallback width; your existing SCSS can override */
        }

        /* Card styling similar to previous */
        .carousel-card {
          position: relative;
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          padding: 8px;
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
          border-radius: 999px;
          background: #111;
          color: #fff;
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }

        .close-button {
          position: absolute;
          top: -6px;
          left: -6px;
          background: #fff;
          border-radius: 999px;
          padding: 2px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        /* Responsive sizing */
        @media (max-width: 1024px) {
          .embla__slide {
            width: 88px;
          }
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
