'use client';

import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater, getDiscountValue } from '@/helpers/cartHelpers';
import { AllProductVariants } from '@/types/bundleTypes';
import AddToButton from './AddToButton';
import ResponsiveImage from './ResponsiveImage';
interface ProductCardProps {
  product: AllProductVariants;
  handleOpenInfoModal: (product: AllProductVariants) => void;
  isPriority: boolean;
}

const ProductCard = ({ product, handleOpenInfoModal, isPriority }: ProductCardProps) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const infoScreenRef = useRef<HTMLDivElement>(null);

  const toggleInfoVisibilityOn = () => {
    setIsInfoVisible(true);
  }

  const toggleInfoVisibilityOff = () => {
    setIsInfoVisible(false);
  }

  // toggle info screen visibility off when clicking outside of the info screen. Used specifically for Iphone mobile devices
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoScreenRef.current && !infoScreenRef.current.contains(event.target as Node)) {
        toggleInfoVisibilityOff();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { addProductVariant, cart, bundle, currentDiscount } = useLoopContext();

  const cartQty =
    cart.productVariants.find((item) => item.shopifyId === product.shopifyId)?.quantity || 0;

  const { images, price, outOfStock, limits, productTitle, title, shopifyId, isVariant } = product;
  const imageURl = images[0].imageURL;
  const { maxValue } = limits[0];
  const titleInfo = productTitle.split(',');

  const handleProductQtyChange = (qty: number) =>
    addProductVariant({ shopifyId: shopifyId, quantity: qty });

  const variantTitle = isVariant ? `${titleInfo[0]} (${title})` : titleInfo[0];

  const renderProductPrice = () => {
    if (currentDiscount) {
      const discountedPrice = getDiscountValue(currentDiscount.value, price);
      return (
        <div className="product-price">
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
    <div className="product-card">
      <div className="product-image" onTouchStart={toggleInfoVisibilityOn} >
        <ResponsiveImage
          src={imageURl}
          alt={productTitle}
          width={309}
          height={309}
          isPriority={isPriority}
        />
        <div
          ref={infoScreenRef}
          className={
            classNames(
              'info-screen'
              , { active: isInfoVisible }
            )
          }
        >
          <button onClick={() => { handleOpenInfoModal(product); toggleInfoVisibilityOff(); }} className="info-button">
            MORE INFO
          </button>
        </div>
      </div>

      <span className="product-title">{variantTitle}</span>
      <span className="product-info">{titleInfo[1]}</span>
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
