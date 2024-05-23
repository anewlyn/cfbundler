import { useLoopContext } from '@/app/contexts/LoopProvider';
import Carousel from './Carousel';

const StickyFooter = () => {

  const { mockProducts, mockOrder, benefitTiers, currentOrderValue } = useLoopContext();

  // sets the footer message based on the current order value
  let notice = benefitTiers[0].footerMessage;

  benefitTiers.forEach((tier) => {
    if (currentOrderValue >= tier.value) {
      notice = tier.footerMessage;
    }
  })

  // @todo if order meets minimun requirements, add to cart
  const handleAddToCart = () => {
    alert('Add to cart clicked');
  }

  // creates an array of product images and alt text for the carousel
  const productImages = mockOrder.productVariants.map((variant) => {
    const product = mockProducts.products[variant.shopifyId];
    return {
      image: product.variants[0]?.imageURL,
      altText: product.variants[0].title,
    };
  }
  );


  // Ensure there are at least 6 images
  const filledData = [...productImages];
  while (filledData.length < 6) {
    filledData.push({ image: '/assets/lone-frog.png', altText: 'Cycling Frog Logo' });
  }

  return (
    <div className='sticky-footer'>
      <div className='carousel'>
        <Carousel data={filledData} />
      </div>
      <div className='order-info'>
        <p className='sans-serif'>{notice}</p>
        <div className='cov-info'>
          <p className='cov'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentOrderValue)}</p>
          <button onClick={handleAddToCart} className='add-button' disabled={currentOrderValue < benefitTiers[0].value} >ADD TO CART</button>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;
