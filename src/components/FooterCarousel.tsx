'use client';

import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react';

export interface CarouselItem {
  id: string;          // stable key (product or variant id)
  name: string;
  image: string;
  quantity: number;    // 0 for placeholders (non-removable)
  shopifyId?: number;  // present when removable
}

interface Props {
  items: CarouselItem[];                // can include placeholders (quantity = 0)
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
      case 'ArrowLeft': e.preventDefault(); scrollPrev(); break;
      case 'ArrowRight': e.preventDefault(); scrollNext(); break;
      case 'Home': e.preventDefault(); scrollTo(0); break;
      case 'End': e.preventDefault(); scrollTo(slides.length - 1); break;
      case 'PageUp': e.preventDefault(); scrollPrev(); break;
      case 'PageDown': e.preventDefault(); scrollNext(); break;
    }
  };

  if (!slides.length) return null;

  return (
    <section role="region" aria-label={ariaLabel} className="relative bg-gray-50 py-4 px-8 rounded-lg">
      {/* Prev */}
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canPrev}
        className={`absolute left-2 z-10 p-2 rounded-full bg-white shadow-md transition-all
          ${!canPrev ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:shadow-lg'}`}
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
                className="embla__slide"
                role="option"
                aria-selected={idx === selectedIndex}
                aria-label={item.name}
                // width handled by your existing CSS; if needed, constrain with inline style:
                // style={{ flex: '0 0 20%' }}
              >
                <div className="relative bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                  {/* Quantity badge */}
                  {item.quantity > 1 && (
                    <span className="absolute -top-2 -right-2 z-10 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-16 object-contain"
                    loading="lazy"
                  />

                  <p className="text-xs text-center mt-2 text-gray-700 truncate">{item.name}</p>

                  {/* Remove one (hide for placeholders) */}
                  {onRemoveOne && item.quantity > 0 && item.shopifyId && (
                    <button
                      type="button"
                      className="absolute -top-2 -left-2 z-10 bg-white/90 hover:bg-white p-1 rounded-full shadow"
                      aria-label={`Remove one ${item.name}`}
                      onClick={() => onRemoveOne(item)}
                    >
                      <span className="material-icons text-sm">close</span>
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
        className={`absolute right-2 z-10 p-2 rounded-full bg-white shadow-md transition-all
          ${!canNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:shadow-lg'}`}
        aria-label="Scroll selected items right"
      >
        <i className="material-icons">chevron_right</i>
      </button>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center mt-3 gap-1" aria-hidden>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FooterCarousel;
