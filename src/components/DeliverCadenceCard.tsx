'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliverCadenceCardProps {
  onClose: () => void;
}

const DeliverCadenceCard = ({ onClose }: DeliverCadenceCardProps) => {
  const { sellingPlans, setCart, cart } = useLoopContext();
  const [selectedButton, setSelectedButton] = useState<number>(0);

  const handleClick = (buttonNumber: number) => {
    setSelectedButton(buttonNumber);
  };

  const handleSaveChanges = () => {
    const selectedCadence = sellingPlans[selectedButton].shopifyId;
    const newCart = { ...cart, sellingPlanId: selectedCadence };
    setCart(newCart);
    onClose();
  };

  return (
    <div className="cadance-card">
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
