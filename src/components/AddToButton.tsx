'use client';

import classNames from 'classnames';
import { useEffect, useState } from 'react';
import IncrementBlock from './IncrementBlock';

type AddToButtonProps = {
  orderQty: number;
  maxQty: number;
  outOfStock: boolean;
  setQty: (qty: number) => void;
  className?: string;
  text?: string;
  mobileText?: string;
};

const AddToButton = ({
  orderQty,
  setQty,
  maxQty,
  outOfStock,
  className,
  text,
  mobileText,
}: AddToButtonProps) => {
  const [subscribed, setSubscribed] = useState(false);
  const [buttonText, setButtonText] = useState('+ ADD TO SUBSCRIPTION');

  useEffect(() => {
    if (orderQty > 0) {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }
  }, [orderQty]);

  useEffect(() => {
    if (mobileText && text) {
      const handleResize = () => {
        if (window.innerWidth <= 768) {
          setButtonText(mobileText);
        } else {
          setButtonText(text);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [mobileText, text]);

  const handleClick = () => {
    setQty(1);
    setSubscribed(!subscribed);
  };

  return (
    <>
      {outOfStock && <span className="subscription-button out-of-stock">OUT OF STOCK</span>}
      {subscribed && !outOfStock && (
        <IncrementBlock
          orderQty={orderQty}
          maxQty={maxQty}
          setQty={setQty}
          setSubscribed={setSubscribed}
        />
      )}
      {!subscribed && !outOfStock && (
        <button
          className={classNames(className, 'subscription-button', {
            'not-subscribed': !subscribed,
          })}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      )}
    </>
  );
};

export default AddToButton;
