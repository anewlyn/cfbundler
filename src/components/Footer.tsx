'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { useRef, useState, useEffect, useMemo } from 'react';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater, getDiscountValue } from '@/helpers/cartHelpers';
import FooterCarousel from './FooterCarousel';

type CarouselItem = {
  id: string;        // stable per product/variant
  name: string;
  image: string;
  quantity: number;  // 0 for placeholders (non-removable)
  shopifyId?: number;
};

const StickyFooter = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

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

  // (Optional) overflow check—kept from your original, safe to remove if not needed
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

  // Decrease quantity by 1 for the selected item
  const handleRemoveOne = (it: CarouselItem) => {
    if (!it.shopifyId || !it.quantity) return;
    addProductVariant({ shopifyId: it.shopifyId, quantity: it.quantity - 1 });
  };

  // Build a de-duplicated list for the carousel, grouped by product.shopifyId.
  // If you prefer grouping by variant, change the Map key and fields below.
  const items: CarouselItem[] = useMemo(() => {
    const map = new Map<number, CarouselItem>(); // key: product.shopifyId

    cart.productVariants?.forEach((cartProduct) => {
      const product = products.find((p) => p.shopifyId === cartProduct.shopifyId);
      if (!product) return;

      const qty = cartProduct.quantity || 0;
      const existing = map.get(product.shopifyId);

      if (existing) {
        existing.quantity += qty;
      } else {
        map.set(product.shopifyId, {
          id: String(product.shopifyId),
          name: product.title,
          image:
            product.images?.[0]?.imageURL ||
            'https://bundler.cyclingfrog.com/assets/lone-frog.png',
          quantity: qty,
          shopifyId: product.shopifyId,
        });
      }
    });

    const arr = Array.from(map.values());

    // Pad to 6 slots with placeholders (non-removable)
    while (arr.length < 6) {
      arr.push({
        id: `placeholder-${arr.length}`,
        name: 'Cycling Frog Logo',
        image: 'https://bundler.cyclingfrog.com/assets/lone-frog.png',
        quantity: 0,
      });
    }

    return arr;
  }, [cart.productVariants, products]);

  const renderProductPrice = () => {
    let discountedPrice = currentOrderValue;
    if (currentDiscount) {
      discountedPrice = getDiscountValue(currentDiscount.value, currentOrderValue);
      return (
        <div className="product-price">
          <p className={classNames('discount-price', kiro_extra_bold_700.className)}>
            {currencyFormater(currentOrderValue, bundle.currencyCode)}
          </p>
          <p className={classNames('discounted-price', kiro_extra_bold_700.className)}>
            {currencyFormater(discountedPrice, bundle.currencyCode)}
          </p>
        </div>
      );
    }
    return (
      <p className={classNames('current-value', kiro_extra_bold_700.className)}>
        {currencyFormater(discountedPrice, bundle.currencyCode)}
      </p>
    );
  };

  return (
    <div className="sticky-footer">
      <div className="carousel" ref={carouselRef}>
        {/* New grouped carousel with arrows/keyboard support */}
        <FooterCarousel
          items={items}
          onRemoveOne={handleRemoveOne}
          ariaLabel="Selected bundle items"
        />
        <div className={classNames({ 'has-overflow': hasOverflow })} />
      </div>

      <div className="order-info">
        <p>{getFooterMessage()}</p>
        <div className="current-info">
          {renderProductPrice()}
          <button
            onClick={handlePostTransaction}
            className={classNames('add-button', { disabled: isDisabled })}
            disabled={isDisabled || submittingCart}
          >
            {submittingCart ? 'Adding to cart...' : 'Add to cart'}
          </button>
        </div>
      </div>

      <Link href="https://cyclingfrog.com/pages/contact-us" className="sticky-button round-button">
        <span>?</span>
      </Link>
    </div>
  );
};

export default StickyFooter;
