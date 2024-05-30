import axios from 'axios';

// @todo not sure if this gets all products or just the ones in the bundle
// This information is also available in the getBundle.ts file
const getProducts = async (jwt: string) => {
  try {
    const response = await axios.get('https://api.loopsubscriptions.com/admin/2023-10/product', {
      headers: {
        'X-Loop-Token': jwt,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getProducts;
