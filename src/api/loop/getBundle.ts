import axios from 'axios';

const getBundle = async () => {
  try {
    const options = {
      headers: { accept: 'application/json' },
    };

    const response = await axios.get(
      `https://api.loopsubscriptions.com/storefront/2023-10/bundle?myshopifyDomain=${process.env.SHOPIFY_STORE}`,
      options,
    );
    // @todo will the be only one bundle?
    const bundleId = response.data.id;

    const bundleResponse = await axios.get(
      `https://api.loopsubscriptions.com/storefront/2023-10/bundle/${bundleId}`,
      options,
    );
    console.log(bundleResponse.data);
  } catch (err) {
    console.error(err);
  }
};

export default getBundle;
