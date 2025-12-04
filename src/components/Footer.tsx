'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { useRef, useState, useEffect, useMemo, CSSProperties } from 'react';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormatter, getDiscountValue } from '@/helpers/cartHelpers';
import useEmblaCarousel from 'embla-carousel-react';

type CarouselItem = {
  id: string;        
  customTitle: string;
  name: string;
  image: string;
  colors: string[],
  quantity: number;  // 0 for placeholders (non-removable)
  shopifyId?: number;
};

const StickyFooter = ({ customProducts }) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    dragFree: false, 
    containScroll: false, 
  })

  const {
    products,
    cart,
    benefitTiers,
    currentOrderValue,
    handleTransaction,
    bundle,
    addProductVariant,
    currentDiscount,
    submittingCart,
  } = useLoopContext()

  const isDisabled =
    currentOrderValue <
    (Number(process.env.NEXT_PUBLIC_MINIMUM_ORDER_VALUE) ?? benefitTiers[0].value);

  useEffect(() => {
    const checkOverflow = () => {
      const el = carouselRef.current;
      if (!el) return;
      const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;
      const hasVerticalOverflow = el.scrollHeight > el.clientHeight;
      setHasOverflow(hasHorizontalOverflow || hasVerticalOverflow);
    };

    checkOverflow();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }
  }, []);

  const getFooterMessage = () => {
    if (
      currentOrderValue <=
      (Number(process.env.NEXT_PUBLIC_MINIMUM_ORDER_VALUE) ?? benefitTiers[0].value)
    ) {
      return process.env.NEXT_PUBLIC_MINIMUM_ORDER_VALUE_FOOTER_TEXT;
    }

    const notice = benefitTiers.findLastIndex((tier) => currentOrderValue >= tier.value);
    return notice > 0 ? benefitTiers[notice].footerMessage : benefitTiers[0].footerMessage;
  };

  const handlePostTransaction = () => {
    if (isDisabled) return;
    handleTransaction();
  };

  // decrease quantity by 1 for the selected item
  const handleRemoveOne = (it: CarouselItem) => {
    if (!it.shopifyId || !it.quantity) return;
    addProductVariant({ shopifyId: it.shopifyId, quantity: it.quantity - 1 });
  };
  const handleAddOne = (it: CarouselItem) => {
    if (!it.shopifyId || !it.quantity) return;
    addProductVariant({ shopifyId: it.shopifyId, quantity: it.quantity + 1 });
  };

  // de-duplicated list
  const items: CarouselItem[] = useMemo(() => {
    const map = new Map<number, CarouselItem>(); // key: product.shopifyId

    cart.productVariants?.forEach((cartProduct) => {
      const product = products.find((p) => p.shopifyId === cartProduct.shopifyId);
      if (!product) return;

      const customData = customProducts.find(prod => prod.productId === product.looxReviewId)

      const qty = cartProduct.quantity || 0;
      const existing = map.get(product.shopifyId);

      if (existing) {
        existing.quantity += qty;
      } else {
        map.set(product.shopifyId, {
          id: String(product.shopifyId),
          customTitle: customData.title,
          name: product.title,
          colors: customData.colors,
          image:
            product.images?.[0]?.imageURL ||
            'https://bundler.cyclingfrog.com/assets/lone-frog.png',
          quantity: qty,
          shopifyId: product.shopifyId,
        });
      }
    });

    const arr = Array.from(map.values());

    console.log('arr', arr)

    return arr;
  }, [cart.productVariants, products])

  useEffect(() => {
    if(emblaContainer && items.length > emblaContainer.current.children.length) {
      console.log('\n\n\n emblaContainer', emblaContainer.current.children.length, 'items', items.length)
    }
  }, [emblaContainer])

  const renderProductPrice = () => {
    if (currentDiscount) {
      const discountedPrice = getDiscountValue(currentDiscount.value, currentOrderValue);
      return (
        <span className="cf-product-price">
          <span className="cf-product-price-discounted">
            {currencyFormatter(discountedPrice, bundle.currencyCode)}
          </span>
          <span className="cf-product-price-original">
            {currencyFormatter(currentOrderValue, bundle.currencyCode)}
          </span>
        </span>
      );
    }
    return (
      <span className={classNames('cf-product-price')}>
        <span className='cf-product-price-original'>{currencyFormatter(currentOrderValue, bundle.currencyCode)}</span>
      </span>
    );
  };

  return (
    <div className="cf-footer">
      <div className={`cf-carousel ${items.length ? 'shown' : ''}`} ref={emblaRef}>
        <div className="cf-carousel-container">
          {items.map((item) => (
            <div 
              key={item.id}
              className="cf-carousel-product" 
              style={{
                '--color1': item.colors[0],
                '--color2': item.colors[1],
                '--color3': item.colors[2],
                '--color4': item.colors[3]
              } as CSSProperties}
            >
              <div className="cf-carousel-product-image">
                <img 
                  width="100%"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="cf-carousel-product-details">
                <span className={`cf-carousel-product-title ${kiro_extra_bold_700.className}`}>{ item.customTitle }</span>
                <span className="cf-carousel-product-variant">{ item.name }</span>
                {handleRemoveOne && item.quantity > 0 && item.shopifyId && (
                  <div className="cf-carousel-controls">
                    <div 
                      className="cf-carousel-remove"
                      onClick={() => handleRemoveOne(item)}
                    >
                      { item.quantity === 1 
                        ? <svg width="16px" viewBox="0 0 16 16"><path fill="currentColor" d="M5.2,13.6c-.3,0-.6-.1-.8-.4-.2-.2-.4-.5-.4-.8v-8h-.2c-.2,0-.3,0-.4-.2-.1-.1-.2-.3-.2-.4s0-.3.2-.4c.1-.1.3-.2.4-.2h2.6v-.2c0-.2,0-.3.2-.4.1-.1.3-.2.4-.2h2c.2,0,.3,0,.4.2s.2.3.2.4v.2h2.6c.2,0,.3,0,.4.2.1.1.2.3.2.4s0,.3-.2.4c-.1.1-.3.2-.4.2h-.2v8c0,.3-.1.6-.4.9-.2.2-.5.4-.8.4h-5.6ZM10.8,4.4h-5.6v8h5.6v-8ZM7,11.2c.2,0,.3,0,.4-.2.1-.1.2-.3.2-.4v-4.4c0-.2,0-.3-.2-.4-.1-.1-.3-.2-.4-.2s-.3,0-.4.2c-.1.1-.2.3-.2.4v4.4c0,.2,0,.3.2.4.1.1.3.2.4.2ZM9,11.2c.2,0,.3,0,.4-.2.1-.1.2-.3.2-.4v-4.4c0-.2,0-.3-.2-.4-.1-.1-.3-.2-.4-.2s-.3,0-.4.2c-.1.1-.2.3-.2.4v4.4c0,.2,0,.3.2.4.1.1.3.2.4.2Z"/></svg> 
                        : <svg width="16px" viewBox="0 0 16 16"><path fill="currentColor" d="M4.3,9c-.3,0-.5,0-.7-.3-.2-.2-.3-.4-.3-.7s0-.5.3-.7c.2-.2.4-.3.7-.3h7.4c.3,0,.5,0,.7.3.2.2.3.4.3.7s0,.5-.3.7c-.2.2-.4.3-.7.3h-7.4Z"/></svg>
                      }
                    </div>
                    <div className="cf-carousel-qty">{ item.quantity }</div>
                    <div 
                      className="cf-carousel-add"
                      onClick={() => handleAddOne(item)}
                    >
                      <svg width="16px" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M7,9h-2.6c-.3,0-.5,0-.7-.3-.2-.2-.3-.4-.3-.7s0-.5.3-.7c.2-.2.4-.3.7-.3h2.6v-2.6c0-.3,0-.5.3-.7.2-.2.4-.3.7-.3s.5,0,.7.3c.2.2.3.4.3.7v2.6h2.6c.3,0,.5,0,.7.3.2.2.3.4.3.7s0,.5-.3.7c-.2.2-.4.3-.7.3h-2.6v2.6c0,.3,0,.5-.3.7-.2.2-.4.3-.7.3s-.5,0-.7-.3c-.2-.2-.3-.4-.3-.7v-2.6Z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className="cf-footer-actions">
        <p className="cf-footer-message">{ getFooterMessage() }</p>
        {items.length 
          ? <button
            onClick={handlePostTransaction}
            className={classNames('cf-btn-atc')}
            disabled={isDisabled || submittingCart}
          >
            { submittingCart ? `Adding to cart...` : `Add to Cart • ` }
            { renderProductPrice() }
          </button>
          : ''
        }
      </div>
    </div>
  );
};

export default StickyFooter;
