// 'use server';

import axios from 'axios';

const getBundles = () => {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_LOOP_API_KEY,
          'Access-Control-Allow-Origin': '*',
        },
      };

      const response = axios.get(
        `https://api.loopsubscriptions.com/storefront/2023-10/bundle?myshopifyDomain=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
        options,
      );
      console.log('response: ', response);

      // const bundleId = response.data.id;

      // const bundleResponse = await axios.get(
      //   `https://api.loopsubscriptions.com/storefront/2023-10/bundle/${bundleId}`,
      //   options,
      // );

      resolve(response);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

export default getBundles;
