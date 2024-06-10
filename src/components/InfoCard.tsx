import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';
import AddToButton from './AddToButton';
import Carousel from './Carousel';
import StarRating from './StarRatings';

/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
const InfoCard = ({ data }: { data: any }) => {
  const { cart, addProductVariant } = useLoopContext();

  const cartQty =
    cart.productVariants.find((item) => item.shopifyId === data.shopifyId)?.quantity || 0;

  const { images, price, outOfStock } = data;
  const { productTitle } = data;
  const { maxValue } = data.limits[0];

  const [selectedImageURL, setSelectedImageURL] = useState(0);

  const handleProductQtyChange = (qty: number) => {
    addProductVariant({ shopifyId: data.shopifyId, quantity: qty });
  };

  const handleOpenChangeImage = (imageIndex: number) => {
    setSelectedImageURL(imageIndex);
  };

  // @todo get the following data from the Loox API
  const rating = 4.5;
  const numberOfReviews = 120;

  return (
    <div className="info-card">
      <div className="info-image-block">
        <img src={images[selectedImageURL].imageURL} alt={productTitle} />
      </div>
      <div className="info-content">
        <section className="description">
          <h1>{productTitle}</h1>
          <p className="sans-serif">{price}</p>
          <hr />
          <StarRating rating={rating} reviews={numberOfReviews} />

          {data.body_html && (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: data.body_html }}
            />
          )}
        </section>
        <AddToButton
          className="info-add-button"
          orderQty={cartQty}
          maxQty={maxValue > 0 ? maxValue : 1000}
          outOfStock={outOfStock}
          setQty={handleProductQtyChange}
          text={'+ ADD TO SUBSCRIPTION'}
        />
      </div>
      <Carousel>
        {images.map((slide: { imageURL: string; altText: string }, index: number) => (
          <div
            className={classNames('embla__slide', 'alt-image-block', {
              'base-border-2': selectedImageURL === index,
            })}
            key={index}
          >
            <button onClick={() => handleOpenChangeImage(index)} className="alt-image-button">
              switch images
            </button>
            <Image
              className="carousel-item alt-image-button"
              src={slide.imageURL}
              alt={slide.altText}
              width={271}
              height={271}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default InfoCard;
