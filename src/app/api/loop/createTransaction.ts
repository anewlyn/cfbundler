import { CartType } from '@/contexts/LoopProvider';

const createTransaction = async (cart: CartType, id: string) => {
  const options: RequestInit = {
    method: 'POST',
    //cache: 'no-store',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  };
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
};

export default createTransaction;
