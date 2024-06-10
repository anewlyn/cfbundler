import { cartType } from '@/contexts/LoopProvider';

const createTransaction = async (cart: cartType, id: string) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };

  const body = cart;

  try {
    // @todo this returns a transaction id that needs to be add to
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle/${id}/transaction`,
      {
        ...options,
        body: JSON.stringify(body),
      },
    );
    console.log(await response.json());
  } catch (err) {
    console.error(err);
  }
};

export default createTransaction;
