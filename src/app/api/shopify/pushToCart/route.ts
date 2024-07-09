import { NextRequest, NextResponse } from 'next/server';
import { CartType } from '@/contexts/LoopProvider';

export const runtime = 'edge';

const encodeId = (id: number) => {
  return Buffer.from(`gid://shopify/ProductVariant/${id}`).toString('base64');
};

export async function POST(request: NextRequest) {
  const body: CartType = await request.json();
  const { productVariants, transactionId, cadence } = body;
  const store = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY || '';

  if (!store || !token) {
    console.error('missing env variables!');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const createCartQuery = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          createdAt
          updatedAt
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: productVariants.map((variant) => ({
        quantity: variant.quantity,
        merchandiseId: encodeId(variant.shopifyId),
        attributes: [
          { key: 'subscription', value: 'true' },
          { key: 'bundleId', value: transactionId },
          { key: 'cadence', value: cadence },
        ],
      })),
    },
  };

  try {
    const response = await fetch(`https://${store}/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: createCartQuery,
        variables: variables,
      }),
    });

    const data = await response.json();

    const cartId = data?.data?.cartCreate?.cart?.id;
    if (cartId) {
      const cartCookie = cartId.replace('gid://shopify/Cart/', '');
      // create a new response with the data
      const nextResponse = NextResponse.json(data);

      // set the cart ID as a cookie
      nextResponse.cookies.set('cart', cartCookie, {
        httpOnly: true,
        path: '/',
      });

      return nextResponse;
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error when pushing to cart:', error);
    return NextResponse.json({ message: 'Failed to add to cart', error }, { status: 500 });
  }
}
