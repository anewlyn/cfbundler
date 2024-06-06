import classNames from 'classnames';
import Image from 'next/image';
import { useLoopContext } from '@/contexts/LoopProvider';
import Carousel from './Carousel';

const StickyFooter = () => {
  const { products, cart, benefitTiers, currentOrderValue } = useLoopContext();

  // sets the footer message based on the current order value
  let notice = benefitTiers[0].footerMessage;

  benefitTiers.forEach((tier) => {
    if (currentOrderValue >= tier.value) {
      notice = tier.footerMessage;
    }
  });

  // @todo if order meets minimun requirements, add to cart
  const handleAddToCart = () => {
    alert('Add to cart clicked');
  };

  const filledData =
    cart.productVariants?.map((cartProduct) => {
      const product = products.find((product) => {
        return product.shopifyId === cartProduct.shopifyId;
      });
      if (product) {
        return {
          imageURL: product.imageURL,
          productTitle: product.productTitle,
        };
      }
      return product;
    }) || [];

  while (filledData.length < 6) {
    filledData.push({ imageURL: '/assets/lone-frog.png', productTitle: 'Cycling Frog Logo' });
  }

  return (
    <div className="sticky-footer">
      <div className="carousel">
        <Carousel>
          {filledData.map((slide, index) => (
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
        <div className="cov-info">
          <p className="cov">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              currentOrderValue,
            )}
          </p>
          <button
            onClick={handleAddToCart}
            className="add-button"
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
