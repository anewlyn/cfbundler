'use client'

import useEmblaCarousel from 'embla-carousel-react'

const Carousel = ({
  children
}: {
  children: React.ReactNode
}) => {

  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {children}
      </div>
    </div>
  )
}

export default Carousel
