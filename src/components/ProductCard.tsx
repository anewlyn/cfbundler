'use client';

import React, { useRef } from 'react';
import { kiro_extra_bold_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater, getDiscountValue } from '@/helpers/cartHelpers';
import { AllProductVariants } from '@/types/bundleTypes';
import AddToButton from './AddToButton';
import ResponsiveImage from './ResponsiveImage';

interface ProductCardProps {
  customProduct: object;
  product: AllProductVariants;
  handleOpenInfoModal: (product: AllProductVariants) => void;
  isPriority: boolean;
}

const ProductCard = ({ customProduct, product, handleOpenInfoModal, isPriority }: ProductCardProps) => {
  const infoScreenRef = useRef<HTMLDivElement>(null);

  const { addProductVariant, cart, bundle, currentDiscount } = useLoopContext();

  const cartQty =
    cart.productVariants.find((item) => item.shopifyId === product.shopifyId)?.quantity || 0;

  const { price, outOfStock, limits, productTitle, title, shopifyId } = product;
  const customVariant = customProduct.variants.find(x => x.id === shopifyId)
  const imageURl = customVariant.images[0].imageURL;
  const { maxValue } = limits[0];

  const handleProductQtyChange = (qty: number) =>
    addProductVariant({ shopifyId: shopifyId, quantity: qty });

  const renderProductPrice = () => {
    if (currentDiscount) {
      const discountedPrice = getDiscountValue(currentDiscount.value, price);
      return (
        <div className="product-price">
          Price: 
          <span className="discount-price">{currencyFormater(price, bundle.currencyCode)}</span>
          <span className="discounted-price">
            {currencyFormater(discountedPrice, bundle.currencyCode)}
          </span>
        </div>
      );
    }
    return <span className="product-price">{currencyFormater(price, bundle.currencyCode)}</span>;
  };

  return (
    <div className="product-card"
      style={{
        '--color1': customProduct.colors[0],
        '--color2': customProduct.colors[1],
        '--color3': customProduct.colors[2],
        '--color4': customProduct.colors[3]
      } as React.CSSProperties}
    >
      <div className="product-image">
        <ResponsiveImage
          src={imageURl}
          alt={productTitle}
          width={309}
          height={309}
          isPriority={isPriority}
        />
        <button
        type="button"   
          className="mobile-info-button"
          onClick={() => {
            handleOpenInfoModal(product);
          }}
        />

        <div ref={infoScreenRef} className="info-screen">
          <button
          type="button"   
            onClick={() => {
              handleOpenInfoModal(product);
            }}
            className="info-button"
          >
            More Info
          </button>
        </div>
      </div>

      <span className={`product-title ${kiro_extra_bold_700.className}`}>{customProduct.title}</span>
      <span className="product-info">{title}</span>
      {renderProductPrice()}

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
