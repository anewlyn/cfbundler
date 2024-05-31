import axios from 'axios';

const getProducts = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://api.loopsubscriptions.com/admin/2023-10/product', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*',
          'X-Loop-Token': process.env.NEXT_PUBLIC_LOOP_API_KEY,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

export default getProducts;
