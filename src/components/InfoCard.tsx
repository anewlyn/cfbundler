import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import AddToButton from "./AddToButton";
import Carousel from "./Carousel";
import StarRating from "./StarRatings";

const InfoCard = ({ data }: { data: any }) => {
  const [qty, setQty] = useState(1);

  const handleOpenChangeImage = (imageIndex: number) => {
    console.log('imageIndex: ', imageIndex);
    // @todo change image
  }

  // @todo set image to imageURL when the Loop API is connected
  const {
    // imageURL,
    title, price, outOfStock
  } = data.variants[0];

  const { maxValue } = data.limits[0];

  // @todo get the following data from the Shopify API
  const rating = 4.5;
  const numberOfReviews = 120;
  const headline = 'ENJOY AN UPLIFTING BUZZ WITHOUT THE BOOZE';

  // @todo get product images from the Shopify API
  const filledData = [
    { image: '/assets/guava-passion-six-pack.png', altText: 'Cycling Frog Logo' },
    { image: '/assets/wild-cherry-seltzer.png', altText: 'Cycling Frog Logo' },
    { image: '/assets/ruby-grapefruit.png', altText: 'Cycling Frog Logo' },
    { image: '/assets/wild-cherry-seltzer.png', altText: 'Cycling Frog Logo' }
  ];
  return (
    <div className='info-card'>
      <div className="info-image-block">
        <img src={'/assets/guava-passion-six-pack.png'} alt={title} />
      </div>
      <div className="info-content">
        <section className="description">
          <h1>{data.title}</h1>
          <p className="sans-serif">{price}</p>
          <hr />
          <StarRating rating={rating} reviews={numberOfReviews} />

          <h2>{headline}</h2>
          <p className="sans-serif">
            The better-than-booze, alcohol-free summertime tonic you need in your cooler! Our Guava Passionfruit THC seltzer channels tropical serenity with every sip. With 5mg THC and 10mg CBD per can, this THC beverage is built to help you unwind, laugh, and above all else, have fun.</p>
        </section>
        <AddToButton className='info-add-button' orderQty={qty} maxQty={maxValue} outOfStock={outOfStock} setQty={setQty} text={'+ ADD TO SUBSCRIPTION'} />
      </div>
      <Carousel>
        {filledData.map((slide, index) => (
          <div
            className={classNames("embla__slide", "alt-image-block")}
            key={index}>
            <button onClick={() => handleOpenChangeImage(index)} className="alt-image-button">switch images</button>
            <Image className='carousel-item alt-image-button' src={slide.image} alt={slide.altText} width={271} height={271} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default InfoCard;
