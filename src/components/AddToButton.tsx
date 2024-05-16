'use client';

import classNames from "classnames";
import { useEffect, useState } from "react";
import IncrementBlock from "./IncrementBlock";

type AddToButtonProps = {
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
};

const AddToButton = ({ qty = 1, setQty }: AddToButtonProps) => {
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
      {
        subscribed
          ?
          <IncrementBlock qty={qty} setQty={setQty} setSubscribed={setSubscribed} />
          : <button className={classNames('subscription-button', { 'not-subscribed': !subscribed })} onClick={handleClick}>{buttonText}</button>
      }
    </>


  );
}

export default AddToButton;
