import axios from 'axios';
import { cartType } from '@/contexts/LoopProvider';

const createTransaction = async (cart: cartType, id: string) => {
  const options = {
    headers: { accept: 'application/json', 'content-type': 'application/json' },
  };

  const body = cart;

  try {
    const response = await axios.post(
      `https://api.loopsubscriptions.com/storefront/2023-10/bundle/${id}/transaction`,
      body,
      options,
    );
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

export default createTransaction;
