'use client';

type IncrementBlockProps = {
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
};

const IncrementBlock = ({ qty, setQty, setSubscribed }: IncrementBlockProps) => {

  // Function to increment the count
  const increment = () => {
    setQty(qty + 1);
  };

  // Function to decrement the count
  const decrement = () => {
    if (qty <= 1) {
      setSubscribed(false)
      return;
    }
    setQty(qty - 1);
  };

  return (
    <div className="subscription-button">
      <button onClick={decrement} className="icon-button">
        <i className="material-icons">remove</i>
        <span className="sr-only">minus button</span>
      </button>
      <span className="icon-button">{qty}</span>
      <button name='plus' onClick={increment} className="icon-button">
        <i className="material-icons">add</i>
        <span className="sr-only">plus button</span>
      </button>
    </div>
  );
}

export default IncrementBlock;
