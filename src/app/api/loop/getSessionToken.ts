import axios from 'axios';

const getSessionToken = async () => {
  try {
    const response = await axios.post(
      'https://api.loopsubscriptions.com/storefront/2023-10/auth/refreshToken',
      {
        username: 'your-username',
        password: 'your-password',
      },
    );

    const token = response.data.token;
    return token;
  } catch (error) {
    console.error(error);
  }
};

export default getSessionToken;
