import { FC, useState, Fragment } from 'react';
import { useLoopContext } from '@/contexts/LoopProvider';

interface DeliverCadenceCardProps {
  onClose: () => void;
}

const DeliverCadenceCard: FC<DeliverCadenceCardProps> = ({ onClose }) => {
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
        <Fragment key={index}>
          {index === 4 && <hr />}
          <button
            className={`cadance-card-button base-border-1 ${selectedButton === index ? 'selected' : ''}`}
            onClick={() => handleClick(index)}
          >
            {buttonText}
          </button>
        </Fragment>
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
