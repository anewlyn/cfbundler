import axios from 'axios';

const createTransaction = async (
  id: string,
  boxSizeId: string,
  discountId: string,
  sellingPlanId: string,
  productVariants: { shopifyId: string; quantity: number }[],
) => {
  const options = {
    headers: { accept: 'application/json', 'content-type': 'application/json' },
  };

  const body = {
    boxSizeId,
    discountId,
    sellingPlanId,
    productVariants,
  };

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
