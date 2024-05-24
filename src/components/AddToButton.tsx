'use client';

import classNames from "classnames";
import { useEffect, useState } from "react";
import IncrementBlock from "./IncrementBlock";

type AddToButtonProps = {
  orderQty: number;
  maxQty: number;
  outOfStock: boolean;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
};

const AddToButton = ({ orderQty = 1, setQty, maxQty, outOfStock, className }: AddToButtonProps) => {
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
      {outOfStock && <span className="subscription-button out-of-stock">OUT OF STOCK</span>}
      {subscribed && !outOfStock && <IncrementBlock orderQty={orderQty} maxQty={maxQty} setQty={setQty} setSubscribed={setSubscribed} />}
      {
        !subscribed && !outOfStock && <button className={classNames(className, 'subscription-button', { 'not-subscribed': !subscribed })} onClick={handleClick}>{buttonText}</button>
      }
    </>
  );
}

export default AddToButton;
