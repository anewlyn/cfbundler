'use client';

type CounterBlockProps = {
  orderQty: number;
  setQty: (qty: number) => void;
  maxQty: number;
};

const CounterBlock = ({ orderQty, setQty, maxQty }: CounterBlockProps) => {
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
      return;
    }
    setQty(orderQty - 1);
  };

  return (
    <div className="subscription-button">
      <button onClick={decrement} className="icon-button">
        { orderQty === 1
          ? <svg width="16px" viewBox="0 0 16 16"><path fill="currentColor" d="M5.2,13.6c-.3,0-.6-.1-.8-.4-.2-.2-.4-.5-.4-.8v-8h-.2c-.2,0-.3,0-.4-.2-.1-.1-.2-.3-.2-.4s0-.3.2-.4c.1-.1.3-.2.4-.2h2.6v-.2c0-.2,0-.3.2-.4.1-.1.3-.2.4-.2h2c.2,0,.3,0,.4.2s.2.3.2.4v.2h2.6c.2,0,.3,0,.4.2.1.1.2.3.2.4s0,.3-.2.4c-.1.1-.3.2-.4.2h-.2v8c0,.3-.1.6-.4.9-.2.2-.5.4-.8.4h-5.6ZM10.8,4.4h-5.6v8h5.6v-8ZM7,11.2c.2,0,.3,0,.4-.2.1-.1.2-.3.2-.4v-4.4c0-.2,0-.3-.2-.4-.1-.1-.3-.2-.4-.2s-.3,0-.4.2c-.1.1-.2.3-.2.4v4.4c0,.2,0,.3.2.4.1.1.3.2.4.2ZM9,11.2c.2,0,.3,0,.4-.2.1-.1.2-.3.2-.4v-4.4c0-.2,0-.3-.2-.4-.1-.1-.3-.2-.4-.2s-.3,0-.4.2c-.1.1-.2.3-.2.4v4.4c0,.2,0,.3.2.4.1.1.3.2.4.2Z"/></svg> 
          : <svg width="16px" viewBox="0 0 16 16"><path fill="currentColor" d="M4.3,9c-.3,0-.5,0-.7-.3-.2-.2-.3-.4-.3-.7s0-.5.3-.7c.2-.2.4-.3.7-.3h7.4c.3,0,.5,0,.7.3.2.2.3.4.3.7s0,.5-.3.7c-.2.2-.4.3-.7.3h-7.4Z"/></svg>
        }
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

export default CounterBlock;
