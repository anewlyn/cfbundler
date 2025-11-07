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

            <style jsx>{`
        /* ================================
        * FooterCarousel styles (scoped)
        * Tweak tokens below as needed
        * ================================ */
        :root {
            --fc-bg: var(--cf-footer-bg, #f7f7f7);
            --fc-padding-y: 1rem;
            --fc-padding-x: 2rem;

            --fc-arrow-size: 32px;
            --fc-arrow-size-sm: 28px;
            --fc-arrow-x: 8px;
            --fc-arrow-x-sm: 4px;
            --fc-arrow-shadow: 0 2px 8px rgba(0,0,0,0.12);
            --fc-arrow-shadow-hover: 0 4px 12px rgba(0,0,0,0.16);

            --fc-gap: 12px;
            --fc-slide-w: 96px;
            --fc-slide-w-md: 88px;
            --fc-slide-w-sm: 80px;
            --fc-slide-w-xs: 72px;

            --fc-card-bg: #fff;
            --fc-card-border: #e5e5e5;
            --fc-card-border-hover: #d9d9d9;
            --fc-card-radius: 10px;
            --fc-card-pad: 8px;
            --fc-card-shadow-hover: 0 2px 10px rgba(0,0,0,0.06);

            --fc-img-h: 70px;

            --fc-caption-color: #444;
            --fc-caption-fs: 11px;

            --fc-badge-bg: #111;
            --fc-badge-fg: #fff;
            --fc-badge-size: 20px;

            --fc-close-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }

        .footer-carousel {
            padding: var(--fc-padding-y) var(--fc-padding-x);
            background: var(--fc-bg);
            border-radius: 8px;
            position: relative;
        }

        /* Arrows */
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
        .fc-arrow--next { right: var(--fc-arrow-x); }
        .fc-arrow:hover:not(.is-disabled) {
            box-shadow: var(--fc-arrow-shadow-hover);
            transform: translateY(-50%) scale(1.04);
        }
        .fc-arrow.is-disabled { opacity: .4; cursor: not-allowed; }

        /* Embla essentials */
        .embla { position: relative; }
        .embla__viewport { overflow: hidden; }
        .embla__container { display: flex; gap: var(--fc-gap); }

        /* Fixed-basis slides so arrows behave */
        .embla__slide {
            flex: 0 0 auto;
            width: var(--fc-slide-w);
        }

        /* Cards / tiles */
        .carousel-card {
            position: relative;
            background: var(--fc-card-bg);
            border: 1px solid var(--fc-card-border);
            border-radius: var(--fc-card-radius);
            padding: var(--fc-card-pad);
            transition: box-shadow .15s ease, border-color .15s ease, transform .15s ease, opacity .2s ease;
            will-change: transform, opacity;
            opacity: 0.99; /* subtle text rendering improvement in Safari */
        }
        .carousel-card:hover {
            border-color: var(--fc-card-border-hover);
            box-shadow: var(--fc-card-shadow-hover);
        }

        .carousel-item {
            width: 100%;
            height: var(--fc-img-h);
            object-fit: contain;
        }

        /* 2-line clamp with reserved height to prevent jump */
        .carousel-caption {
            margin-top: 6px;
            color: var(--fc-caption-color);
            font-size: var(--fc-caption-fs);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 28px;
            text-align: center;
        }

        /* Quantity badge */
        .fc-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            min-width: var(--fc-badge-size);
            height: var(--fc-badge-size);
            border-radius: 999px;
            background: var(--fc-badge-bg);
            color: var(--fc-badge-fg);
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
        }

        /* Remove-one button (top-left) */
        .close-button {
            position: absolute;
            top: -8px; /* nudged for optical alignment */
            left: -8px;
            background: #fff;
            border-radius: 999px;
            padding: 2px;
            box-shadow: var(--fc-close-shadow);
        }

        /* Responsive sizing */
        @media (max-width: 1024px) { .embla__slide { width: var(--fc-slide-w-md); } }
        @media (max-width: 768px)  { .embla__slide { width: var(--fc-slide-w-sm); } }
        @media (max-width: 640px)  {
            .embla__slide { width: var(--fc-slide-w-xs); }
            .fc-arrow {
            width: var(--fc-arrow-size-sm);
            height: var(--fc-arrow-size-sm);
            }
            .fc-arrow--prev { left: var(--fc-arrow-x-sm); }
            .fc-arrow--next { right: var(--fc-arrow-x-sm); }
            /* Bring arrows a bit closer to content on small screens */
            .embla.mx-12 { margin-left: 2.25rem; margin-right: 2.25rem; }
        }

        /* Respect user’s reduced motion */
        @media (prefers-reduced-motion: reduce) {
            .fc-arrow,
            .carousel-card { transition: none; }
        }
`}</style>
        </section>
    );
};

export default FooterCarousel;
