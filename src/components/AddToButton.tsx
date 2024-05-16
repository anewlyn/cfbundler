'use client';

import classNames from "classnames";
import { useEffect, useState } from "react";
import IncrementBlock from "./IncrementBlock";

type AddToButtonProps = {
  orderQty: number;
  maxQty: number;
  stockQty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
};

const AddToButton = ({ orderQty = 1, setQty, maxQty, stockQty }: AddToButtonProps) => {
  const [subscribed, setSubscribed] = useState(false);
  const [buttonText, setButtonText] = useState('+ ADD TO SUBSCRIPTION');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setButtonText('+ ADD');
      } else {
        setButtonText('+ ADD TO SUBSCRIPTION');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    setSubscribed(!subscribed);
  };


  return (
    <>
      {stockQty <= 0 && <p className="out-of-stock">OUT OF STOCK</p>}
      {subscribed && stockQty > 0 && <IncrementBlock orderQty={orderQty} maxQty={maxQty} setQty={setQty} setSubscribed={setSubscribed} />}
      {
        !subscribed && stockQty > 0 && <button className={classNames('subscription-button', { 'not-subscribed': !subscribed })} onClick={handleClick}>{buttonText}</button>
      }
    </>
  );
}

export default AddToButton;
