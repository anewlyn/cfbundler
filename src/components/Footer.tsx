import classNames from 'classnames';
import Image from 'next/image';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater } from '@/helpers/cartHelpers';
import Carousel from './Carousel';

const StickyFooter = () => {
  const { products, cart, benefitTiers, currentOrderValue, handleTransaction, bundle } =
    useLoopContext();

  // sets the footer message based on the current order value
  let notice = benefitTiers[0].footerMessage;

  benefitTiers.forEach((tier) => {
    if (currentOrderValue >= tier.value) {
      notice = tier.footerMessage;
    }
  });

  // @todo if order meets minimun requirements, add to cart
  const handlePostTransaction = () => {
    handleTransaction();
    alert('Add to cart clicked');
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
          imageURL: product.images[0].imageURL,
          productTitle: product.productTitle,
        });
      }
    }
    return product;
  });

  // add default images to carousel if there are less than 6 products
  while (carouselImages.length < 6) {
    carouselImages.push({ imageURL: '/assets/lone-frog.png', productTitle: 'Cycling Frog Logo' });
  }

  return (
    <div className="sticky-footer">
      <div className="carousel">
        <Carousel>
          {carouselImages.map((slide, index) => (
            <div
              className={classNames(
                'embla__slide',
                slide?.imageURL === '/assets/lone-frog.png' && 'default-image',
              )}
              key={index}
            >
              <Image
                className="carousel-item"
                src={slide?.imageURL || '/assets/lone-frog.png'}
                alt={slide?.productTitle || 'Cycling Frog Logo'}
                width={85}
                height={85}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="order-info">
        <p className="sans-serif">{notice}</p>
        <div className="current-info">
          <p className="current-value">
            {currencyFormater(currentOrderValue, bundle.currencyCode)}
          </p>
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
