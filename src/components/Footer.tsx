import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  } = useLoopContext();

  const router = useRouter();

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

  const handleContactUs = () => {
    router.push('https://cyclingfrog.com/pages/contact-us');
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
          altText: product.productTitle,
        });
      }
    }
    return product;
  });

  // add default images to carousel if there are less than 6 products
  while (carouselImages.length < 6) {
    carouselImages.push({ imageURL: '/assets/lone-frog.png', altText: 'Cycling Frog Logo' });
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
          {!isDefaultImage && (
            <div className="carousel-item-overlay">
              <button
                className="close-button"
                onClick={() => handleRemoveFromCart(slideShopifyId, slideQty)}
              >
                X
              </button>
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
        <div className="product-price grid-cols-2">
          <h1 className={classNames('discount-price', kiro_extra_bold_700.className)}>
            {currencyFormater(currentOrderValue, bundle.currencyCode)}
          </h1>
          <h1 className={classNames('discounted-price', kiro_extra_bold_700.className)}>
            {currencyFormater(discountedPrice, bundle.currencyCode)}
          </h1>
        </div>
      );
    }
    return (
      <h1 className={classNames('current-value', kiro_extra_bold_700.className)}>
        {currencyFormater(discountedPrice, bundle.currencyCode)}
      </h1>
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
            disabled={isDisabled}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <div className="sticky-button">
        <button className="round-button" onClick={handleContactUs}>
          <span>?</span>
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;
