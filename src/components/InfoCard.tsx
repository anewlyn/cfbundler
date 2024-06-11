import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { kiro_bold_400 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormater } from '@/helpers/cartHelpers';
import { AllProductVariants } from '@/types/bundleTypes';
import AddToButton from './AddToButton';
import Carousel from './Carousel';
import ResponsiveImage from './ResponsiveImage';
import StarRating from './StarRatings';

const InfoCard = ({
  images,
  price,
  outOfStock,
  shopifyId,
  limits,
  body_html,
  productTitle,
}: AllProductVariants) => {
  const { cart, addProductVariant, bundle } = useLoopContext();
  const cartQty = cart.productVariants.find((item) => item.shopifyId === shopifyId)?.quantity || 0;

  const { maxValue } = limits[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleProductQtyChange = (qty: number) => {
    addProductVariant({ shopifyId: shopifyId, quantity: qty });
  };

  const handleOpenChangeImage = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
  };

  // @todo get the following data from the Loox API
  const rating = 4.5;
  const numberOfReviews = 120;

  const body_html_sanitized = body_html && sanitizeHtml(body_html);

  return (
    <div className="info-card">
      <div className="info-image-block">
        <ResponsiveImage
          src={images[selectedImageIndex].imageURL}
          alt={productTitle}
          width={309}
          height={309}
        />
      </div>
      <div className="info-content">
        <section className="description">
          <h1 className={kiro_bold_400.className}>{productTitle}</h1>
          <p>{currencyFormater(price, bundle.currencyCode)}</p>
          <hr />
          <StarRating rating={rating} reviews={numberOfReviews} />

          {body_html_sanitized && (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: body_html_sanitized }}
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
              'base-border-2': selectedImageIndex === index,
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
