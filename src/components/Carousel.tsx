'use client'
import classNames from 'classnames'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

const Carousel = ({
  data,
}: {
  data: {
    image: string
    altText: string
  }[]
}) => {

  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {data.map((slide, index) => (
          <div
            className={classNames("embla__slide",
              slide.image === '/assets/lone-frog.png' && 'default-image'
            )}
            key={index}>
            <Image className='carousel-item' src={slide.image} alt={slide.altText} width={85} height={85} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Carousel
