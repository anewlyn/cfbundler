import React, { useState } from 'react';
import { useLoopContext } from '@/app/contexts/LoopProvider';
import Carousel from './Carousel';

const StickyFooter = () => {
  const [COV,] = useState(0); // Replace with actual value
  const { mockProducts, mockOrder, benefitTiers, currentOrderValue } = useLoopContext();

  let notice = benefitTiers[0].footerMessage;;

  const benefitText = benefitTiers.forEach((tier) => {
    if (currentOrderValue >= tier.value) {
      notice = tier.footerMessage;
    }
  })
  console.log('benefitText: ', benefitText);

  const productImages = mockOrder.productVariants.map((variant) => {
    const product = mockProducts.products[variant.shopifyId];
    return {
      image: product.variants[0]?.imageURL,
      altText: product.variants[0].title,
    };
  }
  );
  return (
    <div className='sticky-footer'>
      <div className='carousel'>
        <Carousel data={productImages} />
      </div>
      <div className='cov-info'>
        <p>{notice}</p>
        <p>${COV}</p>
        <button>ADD TO CART</button>
      </div>
    </div>
  );
};

export default StickyFooter;
