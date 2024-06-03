'use client';

type IncrementBlockProps = {
  orderQty: number;
  setQty: (qty: number) => void;
  maxQty: number;
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
};

const IncrementBlock = ({ orderQty, setQty, maxQty, setSubscribed }: IncrementBlockProps) => {
  // Function to increment the count
  const increment = () => {
    if (orderQty >= maxQty) {
      return;
    }
    setQty(orderQty + 1);
  };

  // Function to decrement the count
  const decrement = () => {
    if (orderQty <= 1) {
      setQty(orderQty - 1);
      setSubscribed(false);
      return;
    }
    setQty(orderQty - 1);
  };

  return (
    <div className="subscription-button">
      <button onClick={decrement} className="icon-button">
        <i className="material-icons">remove</i>
        <span className="sr-only">minus button</span>
      </button>
      <span className="icon-button">{orderQty}</span>
      <button name="plus" onClick={increment} className="icon-button">
        <i className="material-icons">add</i>
        <span className="sr-only">plus button</span>
      </button>
    </div>
  );
};

export default IncrementBlock;
