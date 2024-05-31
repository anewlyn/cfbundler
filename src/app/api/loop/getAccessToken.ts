import axios from 'axios';

const fetchAccessToken = async (sessionToken: string) => {
  const options = {
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    data: { sessionToken },
  };

  const response = await axios.post(
    'https://api.loopsubscriptions.com/storefront/2023-10/auth/refreshToken',
    options,
  );
  return response.data;
};

export default fetchAccessToken;
