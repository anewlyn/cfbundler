import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater, getDiscountValue } from '@/helpers/cartHelpers';
import Carousel from './Carousel';

type carouselImageTypes = {
  shopifyId?: number;
  imageURL: string;
  altText: string;
  qty?: number;
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

  useEffect(() => {
    const checkOverflow = () => {
      const el = carouselRef.current;
      if (el) {
        const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;
        const hasVerticalOverflow = el.scrollHeight > el.clientHeight;
        setHasOverflow(hasHorizontalOverflow || hasVerticalOverflow);
      }
    };

    checkOverflow();

    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const getFooterMessage = () => {
    if (
      currentOrderValue <=
      (Number(process.env.NEXT_PUBLIC_MINIMUM_ORDER_VALUE) ?? benefitTiers[0].value)
    )
      return process.env.NEXT_PUBLIC_MINIMUM_ORDER_VALUE_FOOTER_TEXT;

    const notice = benefitTiers.findLastIndex((tier) => {
      return currentOrderValue >= tier.value;
    });

    return notice > 0 ? benefitTiers[notice].footerMessage : benefitTiers[0].footerMessage;
  };

  const handlePostTransaction = () => {
    if (isDisabled) return;
    handleTransaction();
  };

  const handleRemoveFromCart = (shopifyId: number, qty: number) => {
    addProductVariant({ shopifyId: shopifyId, quantity: qty - 1 });
  };

  const carouselImages = [];
  cart.productVariants?.forEach((cartProduct) => {
    const product = products.find((product) => {
      return product.shopifyId === cartProduct.shopifyId;
    });

    if (product) {
      // add product to carouselImages array a number of times equal to the quantity
      for (let i = 0; i < cartProduct.quantity; i++) {
        carouselImages.push({
          qty: cartProduct.quantity,
          shopifyId: product.shopifyId,
          imageURL: product.images[0].imageURL,
          altText: product.title,
        });
      }
    }
    return product;
  });

  // add default images to carousel if there are less than 6 products
  while (carouselImages.length < 6) {
    carouselImages.push({ imageURL: 'https://bundler.cyclingfrog.com/assets/lone-frog.png', altText: 'Cycling Frog Logo' });
  }

  const renderImages = (images: carouselImageTypes[]) => {
    return images.map((slide: carouselImageTypes, index: number) => {
      const isDefaultImage = slide?.imageURL === '/assets/lone-frog.png';
      const slideShopifyId = slide?.shopifyId || 0;
      const slideQty = slide?.qty || 0;
      return (
        <div
          className={classNames(
            'carousel-item-container',
            'embla__slide',
            isDefaultImage && 'default-image',
          )}
          key={index}
        >
          <Image
            className="carousel-item"
            src={slide?.imageURL || '/assets/lone-frog.png'}
            alt={slide?.altText || 'Cycling Frog Logo'}
            width={85}
            height={85}
          />
          {!!slide.qty && (
            <button
              className="close-button"
              onClick={() => handleRemoveFromCart(slideShopifyId, slideQty)}
              aria-label="Remove from cart"
            >
              <span className="material-icons">close</span>
            </button>
          )}
          {!isDefaultImage && (
            <div className="carousel-item-overlay">
              <p className="overlay-text">{slide?.altText}</p>
            </div>
          )}
        </div>
      );
    });
  };

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
      <div className="carousel">
        <Carousel ref={carouselRef}>{renderImages(carouselImages)}</Carousel>
        <div className={classNames({ 'has-overflow': hasOverflow })} />
      </div>
      <div className="order-info">
        <p>{getFooterMessage()}</p>
        <div className="current-info">
          {renderProductPrice()}
          <button
            onClick={handlePostTransaction}
            className={classNames('add-button', {
              disabled: isDisabled,
            })}
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
