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

const InfoCard = ({
  customProduct,
  images,
  price,
  outOfStock,
  shopifyId,
  limits,
  body_html,
  productTitle,
  looxReviewId,
}: AllProductVariants) => {
  const { cart, addProductVariant, bundle } = useLoopContext();
  const cartQty = cart.productVariants.find((item) => item.shopifyId === shopifyId)?.quantity || 0;

  const { maxValue } = limits[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // loox.io/widget/VJZ5Kxo3Xi/loox.1632874857413.js?shop=cyclingfrog.myshopify.com
  // https://loox.io/widget/VJZ5Kxo3Xi/ratings?products_ids=no&h=1718658000000
  // https://cyclingfrog.com/products/bluerazz-gummies?variant=40847671722193#looxReviews

  const handleProductQtyChange = (qty: number) => {
    addProductVariant({ shopifyId: shopifyId, quantity: qty });
  };

  const handleOpenChangeImage = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
  };

  const body_html_sanitized =
    body_html &&
    sanitizeHtml(body_html, {
      disallowedTagsMode: 'completelyDiscard',
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'span'],
  });

  const customVariant = customProduct.variants.find(x => x.id === shopifyId)

  return (
    <div className="info-card"
      style={{
        '--color1': customProduct.colors[0],
        '--color2': customProduct.colors[1],
        '--color3': customProduct.colors[2],
        '--color4': customProduct.colors[3]
      } as React.CSSProperties}
    >
      <div className="info-image-block carousel"> 
        <div className='info-image-block-selected'>
          <ResponsiveImage
            src={customVariant.images[selectedImageIndex].imageURL}
            alt={productTitle}
            width={309}
            height={309}
          />
        </div>
        <Carousel>
          {customVariant.images.map((slide: { imageURL: string; altText: string }, index: number) => slide.imageURL && (
            <div
              className={classNames('embla__slide alt-image-block', {
                'base-border-2': selectedImageIndex === index,
              })}
              key={index}
            >
              <button onClick={() => handleOpenChangeImage(index)} className="alt-image-button">
                switch images
              </button>
              <Image
                className="carousel-item"
                src={slide.imageURL}
                alt={slide.altText}
                width={271}
                height={271}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="info-content">
        <section className="description">
          <p className={`${kiro_bold_400.className} product-title`}>{productTitle}</p>
          <p>{currencyFormater(price, bundle.currencyCode)}</p>
          <hr />
          <div className="loox-rating" data-fetch data-id={looxReviewId} />

          {body_html_sanitized && (
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: body_html_sanitized }}
            />
          )}
        </section>
        <div className='info-card-sticky-button'>
          <AddToButton
            className="info-add-button"
            orderQty={cartQty}
            maxQty={maxValue > 0 ? maxValue : 1000}
            outOfStock={outOfStock}
            setQty={handleProductQtyChange}
            text={'+ ADD TO SUBSCRIPTION'}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
