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

        emblaApi.reInit();

        return () => {
            emblaApi.off?.('select', onSelect);
            emblaApi.off?.('reInit', onSelect);
        };
    }, [emblaApi, onSelect, slides.length]);

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
    const isPlaceholderItem = (it: CarouselItem) =>
        !it.shopifyId || it.quantity === 0 || /lone-frog\.png/i.test(it.image);


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
                        {slides.map((item, idx) => {
                            const isPlaceholder =
                                !item.shopifyId || item.quantity === 0 || /lone-frog\.png/i.test(item.image);
                            const ariaLabel = isPlaceholder ? 'Empty slot' : item.name;

                            return (
                                <div
                                    key={item.id}
                                    className={`embla__slide carousel-item-container ${isPlaceholder ? 'is-placeholder' : ''}`}
                                    role="option"
                                    aria-selected={!isPlaceholder && idx === selectedIndex}
                                    aria-disabled={isPlaceholder || undefined}
                                    aria-label={ariaLabel}
                                >
                                    {/* FIXED-WIDTH TILE WRAPPER */}
                                    <div className="fc-tile">
                                        <div className="carousel-card">
                                            {!isPlaceholder && item.quantity > 1 && (
                                                <span className="fc-badge" aria-label={`${item.quantity} in bundle`}>
                                                    {item.quantity}
                                                </span>
                                            )}

                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.image}
                                                alt={ariaLabel}
                                                className="carousel-item"
                                                loading="lazy"
                                            />

                                            {/* caption only for real products */}
                                            {!isPlaceholder && <p className="carousel-caption">{item.name}</p>}

                                            {!isPlaceholder && onRemoveOne && item.shopifyId && (
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
                                </div>
                            );
                        })}
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

            <style jsx>{`
  :root {
    --fc-bg: var(--cf-footer-bg, #f7f7f7);
    --fc-padding-y: 0.5rem;
    --fc-padding-x: 1rem;

    --fc-arrow-size: 24px;
    --fc-arrow-size-sm: 22px;
    --fc-arrow-x: 6px;
    --fc-arrow-x-sm: 4px;
    --fc-arrow-shadow: 0 1px 5px rgba(0,0,0,0.1);
    --fc-arrow-shadow-hover: 0 2px 8px rgba(0,0,0,0.15);

    --fc-gap: 8px;
    --fc-slide-w: 85px;
    --fc-slide-w-md: 80px;
    --fc-slide-w-sm: 76px;
    --fc-slide-w-xs: 72px;

    --fc-card-bg: #fff;
    --fc-card-border: #e5e5e5;
    --fc-card-border-hover: #d9d9d9;
    --fc-card-radius: 4px;
    --fc-card-pad: 4px;
    --fc-card-shadow-hover: 0 1px 6px rgba(0,0,0,0.05);

    --fc-img-h: 70px;
    --fc-img-h-ph: 50px;

    --fc-caption-color: #444;
    --fc-caption-fs: 10px;

    --fc-badge-bg: #111;
    --fc-badge-fg: #fff;
    --fc-badge-size: 16px;

    --fc-close-shadow: 0 1px 3px rgba(0,0,0,0.18);
  }

  .footer-carousel {
    padding: var(--fc-padding-y) var(--fc-padding-x);
    background: var(--fc-bg);
    border-radius: 6px;
    position: relative;
  }

  .fc-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: #fff;
    border-radius: 999px;
    width: var(--fc-arrow-size);
    height: var(--fc-arrow-size);
    display: grid;
    place-items: center;
    box-shadow: var(--fc-arrow-shadow);
    z-index: 5;
    transition: box-shadow .15s ease, transform .15s ease, opacity .15s ease;
  }
  .fc-arrow--prev { left: var(--fc-arrow-x); }
  .fc-arrow--next { right: var(--fc-arrow-x); left: auto; }
  .fc-arrow:hover:not(.is-disabled) {
    box-shadow: var(--fc-arrow-shadow-hover);
    transform: translateY(-50%) scale(1.06);
  }
  .fc-arrow.is-disabled { opacity: .4; cursor: not-allowed; }

  .embla { position: relative; }
  .embla__viewport {
    overflow: hidden;
    cursor: grab;
    user-select: none;
  }
  .embla__viewport:active { cursor: grabbing; }
  .embla__container { display: flex; gap: var(--fc-gap); }
  .embla__slide { flex: 0 0 auto; width: var(--fc-slide-w); }

  .carousel-card {
    position: relative;
    background: var(--fc-card-bg);
    border: 1px solid var(--fc-card-border);
    border-radius: var(--fc-card-radius);
    padding: var(--fc-card-pad);
    transition: box-shadow .15s ease, border-color .15s ease, opacity .2s ease;
    opacity: 0.99;
    cursor: default;
    user-select: text;
    width: 100%;
    height: auto;
  }

  .carousel-card:hover {
    border-color: var(--fc-card-border-hover);
    box-shadow: var(--fc-card-shadow-hover);
  }

  .carousel-item {
    width: 100%;
    max-width: 70px;      /* hard cap to stop 720×720 scaling */
    height: var(--fc-img-h);
    object-fit: contain;
    margin: 0 auto;
    display: block;
  }

  .is-placeholder .carousel-item {
    height: var(--fc-img-h-ph);
    opacity: 0.8;
  }

  .is-placeholder .carousel-card {
    border-color: #eee;
    pointer-events: none;
  }

  .carousel-caption {
    margin-top: 4px;
    color: var(--fc-caption-color);
    font-size: var(--fc-caption-fs);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fc-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: var(--fc-badge-size);
    height: var(--fc-badge-size);
    border-radius: 999px;
    background: var(--fc-badge-bg);
    color: var(--fc-badge-fg);
    font-size: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  .close-button {
    position: absolute;
    top: -6px;
    left: -6px;
    background: #fff;
    border-radius: 999px;
    padding: 2px;
    box-shadow: var(--fc-close-shadow);
  }

  @media (max-width: 1024px) { .embla__slide { width: var(--fc-slide-w-md); } }
  @media (max-width: 768px)  { .embla__slide { width: var(--fc-slide-w-sm); } }
  @media (max-width: 640px)  {
    .embla__slide { width: var(--fc-slide-w-xs); }
    .fc-arrow { width: var(--fc-arrow-size-sm); height: var(--fc-arrow-size-sm); }
    .fc-arrow--prev { left: var(--fc-arrow-x-sm); }
    .fc-arrow--next { right: var(--fc-arrow-x-sm); left: auto; }
  }
    /* ===== Container clamps & caption height ===== */

/* Slide itself: fixed basis + no shrinking */
.footer-carousel :global(.embla__slide) {
  flex: 0 0 var(--fc-slide-w) !important;
  width: var(--fc-slide-w) !important;
  max-width: var(--fc-slide-w) !important;
  min-width: var(--fc-slide-w) !important;
}

/* Inner tile ensures content can’t expand the slide */
.fc-tile {
  width: var(--fc-slide-w);
  max-width: var(--fc-slide-w);
  margin: 0 auto;
}

/* Make card a simple grid: image then caption; no growth */
.carousel-card {
  display: grid;
  grid-template-rows: auto auto; /* image, caption */
  align-items: start;
  width: 100%;
  max-width: var(--fc-slide-w);
}

/* Image already constrained by your vars; ensure no overflow */
.carousel-item {
  width: 100% !important;
  max-width: 70px !important;   /* hard cap to prevent intrinsic upscaling */
  height: var(--fc-img-h) !important;
  margin: 0 auto;
  object-fit: contain;
}

/* Caption: fixed 2-line height so all tiles match and badges align */
.carousel-caption {
  line-height: 1.2;
  max-height: calc(1.2em * 2);  /* exactly two lines */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 4px;
  text-align: center;
}

/* Badge & close button align relative to a fixed-size card */
.fc-badge {
  top: -5px;
  right: -5px;
}
.close-button {
  top: -6px;
  left: -6px;
}

/* Placeholders smaller & inert (keeps exact tile metrics) */
.is-placeholder .carousel-item { height: var(--fc-img-h-ph) !important; opacity: .85; }
.is-placeholder .carousel-caption { display: none; } /* no caption for placeholders */
.is-placeholder .carousel-card { pointer-events: none; }

`}</style>
        </section>
    );
};

export default FooterCarousel;
