'use client';

import Image from 'next/image';
import { useLoopContext } from '@/contexts/LoopProvider';
import AddToButton from './AddToButton';
interface ProductCardProps {
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  product: any;
  /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
  handleOpenInfoModal: (arg0: any) => void;
  isPriority: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleOpenInfoModal, isPriority }) => {
  const { addProductVariant, cart } = useLoopContext();

  const cartQty =
    cart.productVariants.find((item) => item.shopifyId === product.shopifyId)?.quantity || 0;

  const { imageURL, price, outOfStock, limits, productTitle, title, shopifyId, isVariant } =
    product;

  const { maxValue } = limits[0];
  const titleInfo = productTitle.split(',');

  const handleProductQtyChange = (qty: number) => {
    addProductVariant({ shopifyId: shopifyId, quantity: qty });
  };

  const variantTitle = isVariant ? `${titleInfo[0]} (${title})` : titleInfo[0];

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

      <p className="product-title">{variantTitle}</p>
      <p className="product-info sans-serif">{titleInfo[1]}</p>
      <p className="sans-serif">
        {Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price)}
      </p>
      <AddToButton
        orderQty={cartQty}
        maxQty={maxValue > 0 ? maxValue : 1000}
        outOfStock={outOfStock}
        setQty={handleProductQtyChange}
        text={'+ ADD TO SUBSCRIPTION'}
        mobileText={'+ ADD'}
      />
    </div>
  );
};

export default ProductCard;
