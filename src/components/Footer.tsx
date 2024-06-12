import classNames from 'classnames';
import Image from 'next/image';
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

  // sets the footer message based on the current order value
  const notice = currentDiscount
    ? `You got ${currentDiscount.value}% off!`
    : 'Subscriptions require a $50 minimum order.';

  // @todo if order meets minimun requirements, add to cart
  const handlePostTransaction = () => {
    handleTransaction();
    alert('Add to cart clicked');
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
          <h1 className="discount-price">
            {currencyFormater(currentOrderValue, bundle.currencyCode)}
          </h1>
          <h1 className="discounted-price">
            {currencyFormater(discountedPrice, bundle.currencyCode)}
          </h1>
        </div>
      );
    }
    return (
      <h1 className="current-value">{currencyFormater(discountedPrice, bundle.currencyCode)}</h1>
    );
  };

  return (
    <div className="sticky-footer">
      <div className="carousel">
        <Carousel>{renderImages(carouselImages)}</Carousel>
      </div>
      <div className="order-info">
        <p>{notice}</p>
        <div className="current-info">
          {renderProductPrice()}
          <button
            onClick={handlePostTransaction}
            className={classNames('add-button', {
              disabled: currentOrderValue < benefitTiers[0].value,
            })}
            disabled={currentOrderValue < benefitTiers[0].value}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;
