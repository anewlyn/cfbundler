
import classNames from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { kiro_bold_400 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormatter } from '@/helpers/cartHelpers';
import { AllProductVariants } from '@/types/bundleTypes';
import AddToButton from './AddToButton';
import Carousel from './Carousel';
import ResponsiveImage from './ResponsiveImage';
import { Modal } from 'react-bootstrap';

const ModalContent = ({
  customProduct,
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

  return (<>
    <Modal.Body 
        style={{
            '--color1': customProduct.colors[0],
            '--color2': customProduct.colors[1],
            '--color3': customProduct.colors[2],
            '--color4': customProduct.colors[3]
        } as React.CSSProperties}
    >
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
      <p className={`${kiro_bold_400.className} product-title`}>{productTitle}</p>
      <p>{currencyFormatter(price, bundle.currencyCode)}</p>
      <hr />
      <div className="loox-rating" data-fetch data-id={looxReviewId} />

      {body_html_sanitized && (
        <div
          className="product-description"
          dangerouslySetInnerHTML={{ __html: body_html_sanitized }}
        />
      )}
    </Modal.Body>
    <Modal.Footer>
        <button className='btn btn-black-hollow' onClick={handleClose}>
            Close
        </button>
        <AddToButton
            className="btn btn-black"
            orderQty={cartQty}
            maxQty={maxValue > 0 ? maxValue : 1000}
            outOfStock={outOfStock}
            setQty={handleProductQtyChange}
            text={'+ ADD TO SUBSCRIPTION'}
        />
    </Modal.Footer>
  </>)
}

export default ModalContent;
