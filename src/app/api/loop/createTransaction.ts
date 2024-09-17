import { CartType } from '@/contexts/LoopProvider';

const createTransaction = async (cart: CartType, id: string) => {
  const options: RequestInit = {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };

  try {
    // @todo this returns a transaction id that needs to be passed to shopify cart
    // TODO: remove / from public-loop-api-version env variable
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle/${id}/transaction`,
      {
        ...options,
        body: JSON.stringify(cart),
      },
    );

    const transactionResponse = await response.json();
    const txnId = transactionResponse.data.txnId;

    return txnId;
  } catch (err) {
    console.error(err);
  }
};

export default createTransaction;
