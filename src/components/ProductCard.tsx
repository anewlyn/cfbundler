'use client';

import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater } from '@/helpers/cartHelpers';
import { AllProductVariants } from '@/types/bundleTypes';
import AddToButton from './AddToButton';
import ResponsiveImage from './ResponsiveImage';
interface ProductCardProps {
  product: AllProductVariants;
  handleOpenInfoModal: (product: AllProductVariants) => void;
  isPriority: boolean;
}

const ProductCard = ({ product, handleOpenInfoModal, isPriority }: ProductCardProps) => {
  const { addProductVariant, cart, bundle } = useLoopContext();

  const cartQty =
    cart.productVariants.find((item) => item.shopifyId === product.shopifyId)?.quantity || 0;

  const { images, price, outOfStock, limits, productTitle, title, shopifyId, isVariant } = product;
  const imageURl = images[0].imageURL;
  const { maxValue } = limits[0];
  const titleInfo = productTitle.split(',');

  const handleProductQtyChange = (qty: number) => {
    addProductVariant({ shopifyId: shopifyId, quantity: qty });
  };

  const variantTitle = isVariant ? `${titleInfo[0]} (${title})` : titleInfo[0];

  return (
    <div className="product-card">
      <div className="product-image">
        <ResponsiveImage
          src={imageURl}
          alt={productTitle}
          width={309}
          height={309}
          isPriority={isPriority}
        />
        <div className={'info-screen'}>
          <button onClick={() => handleOpenInfoModal(product)} className="info-button">
            MORE INFO
          </button>
        </div>
      </div>

      <p className="product-title">{variantTitle}</p>
      <p className="product-info">{titleInfo[1]}</p>
      <p>{currencyFormater(price, bundle.currencyCode)}</p>
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
