import axios from 'axios';
import { cartType } from '@/contexts/LoopProvider';

const createTransaction = async (cart: cartType, id: string) => {
  const options = {
    headers: { accept: 'application/json', 'content-type': 'application/json' },
  };

  const body = cart;

  try {
    // @todo this returns a transaction id that needs to be add to
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle/${id}/transaction`,
      body,
      options,
    );
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

export default createTransaction;
