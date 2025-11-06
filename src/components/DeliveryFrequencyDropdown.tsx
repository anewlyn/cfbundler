import { useState, useRef, useEffect } from 'react';

interface DeliveryOption {
  value: number;
  label: string;
  unit: string;
  planData?: any; // Store the full selling plan data
}

const DeliveryFrequencyDropdown = ({ 
  selectedFrequency, 
  onFrequencyChange,
  options,
  className = ''
}: {
  selectedFrequency: DeliveryOption;
  onFrequencyChange: (option: DeliveryOption) => void;
  options: DeliveryOption[];
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={className}
        type="button"
      >
        <span className="uppercase">Deliver Every &nbsp;</span>
        <b>{selectedFrequency.label}</b>
        <i className={`material-icons transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </i>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full min-w-[200px] mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                onFrequencyChange(option);
                setIsOpen(false);
              }}
              type="button"
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between
                ${selectedFrequency.value === option.value && selectedFrequency.unit === option.unit 
                  ? 'bg-blue-50 text-blue-600' 
                  : ''}`}
            >
              <span>
                <span className="uppercase">Every </span>
                <b>{option.label}</b>
              </span>
              {selectedFrequency.value === option.value && selectedFrequency.unit === option.unit && (
                <i className="material-icons text-blue-600 text-base">check</i>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryFrequencyDropdown;