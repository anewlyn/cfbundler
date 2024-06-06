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

    const bundleId = response.data.data[0].id;

    const bundleResponse = await axios.get(
      `https://api.loopsubscriptions.com/storefront/2023-10/bundle/${bundleId}`,
      options,
    );

    // resolve(response);
    return NextResponse.json(bundleResponse.data);
  } catch (err) {
    console.error(err);
    // reject(err);
  }
};
