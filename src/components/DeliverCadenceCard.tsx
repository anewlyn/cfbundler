'use client';

import classNames from 'classnames';
import { useState } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliverCadenceCardProps {
  onClose: () => void;
}

const DeliverCadenceCard = ({ onClose }: DeliverCadenceCardProps) => {
  const { deliverCadence } = useLoopContext();
  const [selectedButton, setSelectedButton] = useState<number | null>(0);

  const handleClick = (buttonNumber: number) => {
    setSelectedButton(buttonNumber);
  };

  const handleSaveChanges = () => {
    // @todo save/set selectedButton as cadence
    onClose();
  };

  return (
    <div className="cadance-card">
      {deliverCadence.map((buttonText, index) => (
        <button
          key={index}
          className={classNames(
            'cadance-card-button base-border-1',
            selectedButton === index ? 'selected' : '',
          )}
          onClick={() => handleClick(index)}
        >
          {buttonText}
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
