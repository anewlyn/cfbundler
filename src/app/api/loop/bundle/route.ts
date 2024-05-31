import axios from 'axios';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: process.env.NEXT_PUBLIC_LOOP_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
    };

    const response = await axios.get(
      `https://api.loopsubscriptions.com/storefront/2023-10/bundle?myshopifyDomain=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
      options,
    );
    console.log('response: ', response.data.data[0].id);

    const bundleId = response.data.data[0].id;

    const bundleResponse = await axios.get(
      `https://api.loopsubscriptions.com/storefront/2023-10/bundle/${bundleId}`,
      options,
    );
    console.log('bundleResponse: ', bundleResponse.data);

    // resolve(response);
    return NextResponse.json(bundleResponse.data);
  } catch (err) {
    console.error(err);
    // reject(err);
  }
};

// export const POST = async (request: NextRequest) => {
//   // Get JSON payload
//   const data = await request.json();

//   // Return Response
//   return NextResponse.json(
//     {
//       data,
//     },
//     {
//       status: 200,
//       // headers: getCorsHeaders(request.headers.get("origin") || ""),
//     },
//   );
// };
