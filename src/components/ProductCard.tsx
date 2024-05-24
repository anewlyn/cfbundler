'use client'

import Image from "next/image";
import { useState } from "react";
import AddToButton from "./AddToButton";
interface ProductCardProps {
  product: any;
  handleOpenInfoModal: (arg0: any) => void;
  isPriority: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleOpenInfoModal, isPriority }) => {
  const [qty, setQty] = useState(1);

  const { imageURL, title, price, outOfStock } = product.variants[0];
  const { maxValue } = product.limits[0];

  return (
    <div className='product-card'>
      <div className="product-image">
        <Image src={imageURL} alt={title} width={309} height={309} priority={isPriority} />
        <div className={"info-screen"}>
          <button onClick={() => handleOpenInfoModal(product)} className="info-button">MORE INFO</button>
        </div>
      </div>

      <p className="product-title">{title}</p>
      {/* @todo get product-info once we get data */}
      <p className="product-info sans-serif">5mg * 6-pack</p>
      <p className="sans-serif">${price}</p>
      <AddToButton orderQty={qty} maxQty={maxValue} outOfStock={outOfStock} setQty={setQty} />
    </div>
  );
}

export default ProductCard;
