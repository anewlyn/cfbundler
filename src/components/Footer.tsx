'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { useRef, useState, useEffect, useMemo, CSSProperties } from 'react';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater, getDiscountValue } from '@/helpers/cartHelpers';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: true })

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()) // Access API
    }
  }, [emblaApi])

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
  } = useLoopContext();

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

  // de-duplicated list
  const items: CarouselItem[] = useMemo(() => {
    const map = new Map<number, CarouselItem>(); // key: product.shopifyId

    cart.productVariants?.forEach((cartProduct) => {
      const product = products.find((p) => p.shopifyId === cartProduct.shopifyId);
      if (!product) return;

      console.log('product', product)
      console.log('customProducts', customProducts)

      const customData = customProducts.find(prod => prod.productId === product.looxReviewId)
      console.log('customData', customData)

      const qty = cartProduct.quantity || 0;
      const existing = map.get(product.shopifyId);

      if (existing) {
        existing.quantity += qty;
      } else {
        map.set(product.shopifyId, {
          id: String(product.shopifyId),
          customTitle: 'title',
          name: product.title,
          colors: ['#FFF2F0', '#FFB3AB', '#FFB3AB', '#FFB3AB'],
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
  }, [cart.productVariants, products]);

  const renderProductPrice = () => {
    let discountedPrice = currentOrderValue;
    if (currentDiscount) {
      discountedPrice = getDiscountValue(currentDiscount.value, currentOrderValue);
      return (
        <div className="product-price">
          <p className={classNames('discount-price')}>
            {currencyFormater(currentOrderValue, bundle.currencyCode)}
          </p>
          <p className={classNames('discounted-price')}>
            {currencyFormater(discountedPrice, bundle.currencyCode)}
          </p>
        </div>
      );
    }
    return (
      <p className={classNames('current-value')}>
        {currencyFormater(discountedPrice, bundle.currencyCode)}
      </p>
    );
  };

  return (
    <div className="cf-footer">
      <div className="cf-carousel" ref={emblaRef}>
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
              {handleRemoveOne && item.quantity > 0 && item.shopifyId && (
              <div 
                className="cf-carousel-remove"
                onClick={() => handleRemoveOne(item)}
              >
                x 
              </div>
              )}
              <div className="cf-carousel-product-image">
                <img 
                  width="100%"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="cf-carousel-product-details">
                <div className="cf-carousel-product-title">{ item.customTitle }</div>
                <div className="cf-carousel-product-variant">{ item.name }</div>
              </div>
            </div>
          ))}

        </div>
      </div>

      <div className="order-info">
        <p>{getFooterMessage()}</p>
        <div className="current-info">
          <button
            onClick={handlePostTransaction}
            className={classNames('add-button', { disabled: isDisabled })}
            disabled={isDisabled || submittingCart}
          >
            {submittingCart ? `Adding to cart...` : `Add to cart • ${renderProductPrice()}`}
          </button>
        </div>
      </div>

      <Link href="https://cyclingfrog.com/pages/contact-us" className="cf-footer-atc">
        <span>?</span>
      </Link>
    </div>
  );
};

export default StickyFooter;
