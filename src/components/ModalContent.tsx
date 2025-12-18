
import classNames from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import { kiro_bold_400, kiro_extra_bold_700 } from '@/app/ui/fonts';
import { useLoopContext } from '@/contexts/LoopProvider';
import { currencyFormatter, getDiscountValue } from '@/helpers/cartHelpers';
import { AllProductVariants } from '@/types/bundleTypes';
import AddToButton from './AddToButton';
import Carousel from './Carousel';
import ResponsiveImage from './ResponsiveImage';
import { RichText } from './RichText';
import { Accordion, Modal } from 'react-bootstrap';
import useEmblaCarousel from 'embla-carousel-react';

const ModalContent = ({
  handleClose,
  customProduct,
  price,
  outOfStock,
  shopifyId,
  limits,
  title,
  body_html,
  looxReviewId,
}: AllProductVariants) => {
  const { cart, addProductVariant, bundle, currentDiscount } = useLoopContext();
  const cartQty = cart.productVariants.find((item) => item.shopifyId === shopifyId)?.quantity || 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    dragFree: true, 
  })

  useEffect(() => {
    console.log('customProduct', customProduct)
  }, [])

  const { maxValue } = limits[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const renderProductPrice = () => {
    if (currentDiscount) {
      const discountedPrice = getDiscountValue(currentDiscount.value, price);
      return (
        <div className="product-price">
          <span className="discount-price">{currencyFormatter(price, bundle.currencyCode)}</span>
          <span className="discounted-price">
            {currencyFormatter(discountedPrice, bundle.currencyCode)}
          </span>
        </div>
      );
    }
    return <span className="product-price">{currencyFormatter(price, bundle.currencyCode)}</span>;
  };

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
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'span', 'ul', 'li'],
  });

  const customVariant = customProduct.variants.find(x => x.id === shopifyId)
  console.log('customVariant', customVariant)

  return (<>
    <Modal.Body 
        className='p-0'
        style={{
            '--color1': customProduct.colors[0],
            '--color2': customProduct.colors[1],
            '--color3': customProduct.colors[2],
            '--color4': customProduct.colors[3],
            backgroundColor: customProduct.colors[0],
        } as React.CSSProperties}
    >
      <div className='cf-carousel shown'>
        <div className="cf-carousel-viewport w-100" ref={emblaRef}>
          <div className="cf-carousel-container">
            {customVariant.images.map((slide: { imageURL: string; altText: string }, index: number) => slide.imageURL && (
              <div 
                key={index}
                className={`cf-carousel-item`} 
              >
                <img className='cf-carousel-item-image' src={slide.imageURL} alt={slide.altText} />  
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="cf-modal-content p-3 p-md-4">
        <h2 className={`${kiro_extra_bold_700.className} product-title`}>{customProduct.title}</h2>
        <p className="product-info">
          {customProduct.preferTagline ? customProduct.tagline : title}
        </p>
        <p className='mb-0'>{ renderProductPrice() }</p>
        <div className="loox-rating" data-fetch data-id={looxReviewId} />

        <Accordion flush defaultActiveKey='0'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Description</Accordion.Header>
            <Accordion.Body>
              {body_html_sanitized && (
                <div
                  dangerouslySetInnerHTML={{ __html: body_html_sanitized }}
                />
              )}
            </Accordion.Body>
          </Accordion.Item>
          {customProduct.details.map((deet, i) => (
            deet.value && 
              <Accordion.Item eventKey={i+1}>
                <Accordion.Header>{ deet.title }</Accordion.Header>
                <Accordion.Body>
                  <RichText data={ deet.value } />
                </Accordion.Body>
              </Accordion.Item>
          ))}
        </Accordion>

      </div>
    </Modal.Body>
    <Modal.Footer 
      style={{
        '--color1': customProduct.colors[0],
        '--color2': customProduct.colors[1],
        '--color3': customProduct.colors[2],
        '--color4': customProduct.colors[3],
        backgroundColor: customProduct.colors[1], 
        borderTop: `1px solid ${customProduct.colors[2]}` 
      } as React.CSSProperties}
    >
      <button className='btn btn-icon btn-white py-0' onClick={handleClose}>
          <i className="material-icons">close</i>
      </button>
      <AddToButton
          className="btn btn-black w-auto flex-grow-1"
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
