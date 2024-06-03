'use client';

import Image from 'next/image';
import { useState } from 'react';
import AddToButton from './AddToButton';
interface ProductCardProps {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  product: any;
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  handleOpenInfoModal: (arg0: any) => void;
  isPriority: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleOpenInfoModal, isPriority }) => {
  const [qty, setQty] = useState(1);

  const { imageURL, price, outOfStock, limits, productTitle } = product;
  const { maxValue } = limits[0];
  const titleInfo = productTitle.split(',');

  return (
    <div className="product-card">
      <div className="product-image">
        <Image src={imageURL} alt={productTitle} width={309} height={309} priority={isPriority} />
        <div className={'info-screen'}>
          <button onClick={() => handleOpenInfoModal(product)} className="info-button">
            MORE INFO
          </button>
        </div>
      </div>

      <p className="product-title">{titleInfo[0]}</p>
      <p className="product-info sans-serif">{titleInfo[1]}</p>
      <p className="sans-serif">{Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price)}</p>
      <AddToButton
        orderQty={qty}
        maxQty={maxValue > 0 ? maxValue : 1000}
        outOfStock={outOfStock}
        setQty={setQty}
        text={'+ ADD TO SUBSCRIPTION'}
        mobileText={'+ ADD'}
      />
    </div>
  );
};

export default ProductCard;
