'use client'

import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useLoopContext } from "@/app/contexts/LoopProvider";
import AddToButton from "./AddToButton";


const ProductCard = ({ product }: any) => {
  const { isMobile } = useLoopContext();
  const [qty, setQty] = useState(1);

  const { imageURL, title, price, outOfStock } = product.variants[0];
  const { maxValue } = product.limits[0];

  const handleOpenInfoModal = () => {
    // @todo open modal with product info
    alert('info modal opened')
  }

  return (
    <div className={classNames('product-card')}>
      <div className={classNames("product-image", { 'info-button-mobile': isMobile })}>
        <Image src={imageURL} alt={title} width={200} height={250} />
        <div className={"info-screen"}>
          <button onClick={handleOpenInfoModal} className="info-button">More Info</button>
        </div>
      </div>

      <p className="product-title">{title}</p>
      {/* @todo get product-info once we get data */}
      <p className="product-info">5mg * 6-pack</p>
      <p>${price}</p>
      <AddToButton orderQty={qty} maxQty={maxValue} outOfStock={outOfStock} setQty={setQty} />
    </div>
  );
}

export default ProductCard;
