import Image from "next/image";

const InfoCard = ({ data }: { data: any }) => {
  const { imageURL, title, price } = data.variants[0];
  return (
    <div className='info-card'>
      <div className="info-image">
        <Image src={imageURL} alt={title} width={309} height={309} />
      </div>
      <div className="info-content">
        <h1>{data.title}</h1>
        <p>ENJOY AN UPLIFTING BUZZ WITHOUT THE BOOZE
          The better-than-booze, alcohol-free summertime tonic you need in your cooler! Our Guava Passionfruit THC seltzer channels tropical serenity with every sip. With 5mg THC and 10mg CBD per can, this THC beverage is built to help you unwind, laugh, and above all else, have fun.</p>
        <p>{price}</p>
      </div>
    </div>
  );
}

export default InfoCard;
