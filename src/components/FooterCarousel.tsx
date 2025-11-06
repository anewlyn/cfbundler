import { useState, useEffect } from 'react';

interface CarouselItem {
  id: string;
  name: string;
  image: string;
  quantity?: number;
}

const FooterCarousel = ({ items }: { items: CarouselItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [groupedItems, setGroupedItems] = useState<Map<string, CarouselItem>>(new Map());
  const [visibleItems, setVisibleItems] = useState(4);

  // Group items by ID and sum quantities
  useEffect(() => {
    const grouped = new Map<string, CarouselItem>();
    
    items.forEach(item => {
      const existing = grouped.get(item.id);
      if (existing) {
        grouped.set(item.id, {
          ...existing,
          quantity: (existing.quantity || 1) + (item.quantity || 1)
        });
      } else {
        grouped.set(item.id, { ...item, quantity: item.quantity || 1 });
      }
    });
    
    setGroupedItems(grouped);
  }, [items]);

  // Responsive visible items
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleItems(2);
      else if (window.innerWidth < 768) setVisibleItems(3);
      else if (window.innerWidth < 1024) setVisibleItems(4);
      else setVisibleItems(5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsArray = Array.from(groupedItems.values());
  const maxIndex = Math.max(0, itemsArray.length - visibleItems);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  if (itemsArray.length === 0) return null;

  return (
    <div className="relative bg-gray-50 py-4 px-8 rounded-lg">
      <div className="flex items-center justify-between">
        {/* Previous Arrow */}
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`absolute left-2 z-10 p-2 rounded-full bg-white shadow-md transition-all
            ${currentIndex === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100 hover:shadow-lg'}`}
          aria-label="Previous items"
        >
          <i className="material-icons">chevron_left</i>
        </button>

        {/* Carousel Items */}
        <div className="overflow-hidden mx-12 w-full">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` 
            }}
          >
            {itemsArray.map((item) => (
              <div 
                key={item.id}
                className="flex-shrink-0 relative"
                style={{ width: `calc(${100 / visibleItems}% - 1rem)` }}
              >
                <div className="relative bg-white rounded-lg p-3 hover:shadow-md transition-shadow">
                  {/* Quantity Badge */}
                  {item.quantity && item.quantity > 1 && (
                    <span className="absolute -top-2 -right-2 z-10 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}
                  
                  {/* Item Image */}
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-16 object-contain"
                  />
                  
                  {/* Item Name */}
                  <p className="text-xs text-center mt-2 text-gray-700 truncate">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className={`absolute right-2 z-10 p-2 rounded-full bg-white shadow-md transition-all
            ${currentIndex >= maxIndex 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-100 hover:shadow-lg'}`}
          aria-label="Next items"
        >
          <i className="material-icons">chevron_right</i>
        </button>
      </div>

      {/* Dots Indicator (optional) */}
      {itemsArray.length > visibleItems && (
        <div className="flex justify-center mt-3 gap-1">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterCarousel;