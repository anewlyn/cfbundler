'use client';

import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliverCadenceCardProps {
  onClose: () => void;
}

const DeliverCadenceCard = ({ onClose }: DeliverCadenceCardProps) => {
  const { sellingPlans, setCart, cart } = useLoopContext();
  const [selectedButton, setSelectedButton] = useState<number>(() =>
    sellingPlans.findIndex((cadence) => cadence.shopifyId === cart.sellingPlanId),
  );
  const modalRef = useRef<HTMLDivElement>(null); // Step 1: Create a ref

  const handleClick = (buttonNumber: number) => {
    setSelectedButton(buttonNumber);
  };

  const handleSaveChanges = () => {
    const selectedCadence = sellingPlans[selectedButton].shopifyId;
    const newCart = { ...cart, sellingPlanId: selectedCadence };
    setCart(newCart);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); // Step 3: Determine if the click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Step 2: Set up an event listener

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Step 4: Clean up
    };
  }, [onClose]);

  return (
    <div ref={modalRef} className="cadance-card">
      <p className="uppercase">Deliver Every...</p>
      {sellingPlans.map((cadence, index) => {
        const interval =
          Number(cadence?.deliveryIntervalCount) > 1
            ? `${cadence?.deliveryInterval}S`
            : cadence?.deliveryInterval;
        return (
          <button
            key={index}
            className={classNames(
              'cadance-card-button base-border-1',
              selectedButton === index ? 'selected' : '',
            )}
            onClick={() => handleClick(index)}
          >
            {`${cadence.deliveryIntervalCount} ${interval}`}
          </button>
        );
      })}
      <hr />
      <button className="uppercase cadance-card-button selected" onClick={handleSaveChanges}>
        Save Changes
      </button>
      <button className="uppercase cadance-card-button cancel" onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};

export default DeliverCadenceCard;
