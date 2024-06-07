import axios from 'axios';

export async function getBundle() {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: process.env.NEXT_PUBLIC_LOOP_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle?myshopifyDomain=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
      options,
    );

    const bundleId = response.data.data[0].id;

    const bundleResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle/${bundleId}`,
      options,
    );

    return bundleResponse.data;
  } catch (err) {
    console.error(err);
  }
}
