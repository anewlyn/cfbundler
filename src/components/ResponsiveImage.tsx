import Image from 'next/image'

type ResponsiveImageProps = {
  className?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  isPriority?: boolean;
};
const ResponsiveImage = ({ className, src, alt, width, height, isPriority }: ResponsiveImageProps) => {
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={isPriority}
      sizes="100vw"

      style={{ width: '100%', height: 'auto' }}
    />
  );
}

export default ResponsiveImage;
