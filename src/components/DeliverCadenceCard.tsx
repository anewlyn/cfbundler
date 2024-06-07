'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliverCadenceCardProps {
  onClose: () => void;
}

const DeliverCadenceCard = ({ onClose }: DeliverCadenceCardProps) => {
  const { deliverCadence, setCart, cart } = useLoopContext();
  const [selectedButton, setSelectedButton] = useState<number>(0);

  const handleClick = (buttonNumber: number) => {
    setSelectedButton(buttonNumber);
  };

  const handleSaveChanges = () => {
    const selectedCadence = deliverCadence[selectedButton].shopifyId;
    const newCart = { ...cart, sellingPlanId: selectedCadence };
    setCart(newCart);
    onClose();
  };

  return (
    <div className="cadance-card">
      {deliverCadence.map((cadence, index) => (
        <button
          key={index}
          className={classNames(
            'cadance-card-button base-border-1',
            selectedButton === index ? 'selected' : '',
          )}
          onClick={() => handleClick(index)}
        >
          {`${cadence.deliveryIntervalCount} ${cadence.deliveryInterval}`}
        </button>
      ))}
      <hr />
      <button className="cadance-card-button selected" onClick={handleSaveChanges}>
        SAVE CHANGES
      </button>
      <button className="cadance-card-button cancel" onClick={onClose}>
        CANCEL
      </button>
    </div>
  );
};

export default DeliverCadenceCard;
