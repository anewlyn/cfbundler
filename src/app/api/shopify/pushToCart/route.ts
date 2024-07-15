import { NextRequest, NextResponse } from 'next/server';
import { CartType } from '@/contexts/LoopProvider';
import { ShopifyCartLineEdge, ShopifyFetchResponse } from '@/types/app/api/shopifyTypes';

export const runtime = 'edge';

const encodeId = (id: number) => {
  return Buffer.from(`gid://shopify/ProductVariant/${id}`).toString('base64');
};

export async function POST(request: NextRequest) {
  const body: CartType = await request.json();
  const { productVariants, transactionId, cadence, discount, discountPercent } = body;
  const store = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY || '';

  if (!store || !token) {
    console.error('missing env variables!');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  const fetchCartQuery = `
    query cart($id: ID!) {
      cart(id: $id) {
        id
        lines(first: 250) {
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
  `;

  const createCartQuery = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          createdAt
          updatedAt
          lines(first: 250) {
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

  // the idea is this:
  // we will always create a new cart but we will want to preserve existing
  // non subscription items and just push updated / new bundler items forward

  try {
    const cartIdCookie = request.cookies.get('cart')?.value;
    let existingNonSubscriptionLines: ShopifyCartLineEdge[] = [];

    // get existing cart if cartId exists
    if (cartIdCookie) {
      const cartId = `gid://shopify/Cart/${cartIdCookie.split('?')[0]}`;
      const fetchResponse = await fetch(`https://${store}/api/2023-07/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: fetchCartQuery,
          variables: { id: cartId },
        }),
      });

      const fetchData: ShopifyFetchResponse = await fetchResponse.json();
      if (fetchData.data && fetchData.data.cart) {
        const existingCartLines = fetchData.data.cart.lines?.edges || [];
        existingNonSubscriptionLines = existingCartLines.filter(
          (line) =>
            !line.node.attributes.some(
              (attr) => attr.key === 'subscription' && attr.value === 'true',
            ),
        );
      }
    }

    // prepare the new subscription lines
    const newSubscriptionLines = productVariants.map((variant) => ({
      quantity: variant.quantity,
      merchandiseId: encodeId(variant.shopifyId),
      attributes: [
        { key: 'subscription', value: 'true' },
        { key: '_bundleId', value: transactionId },
        { key: 'cadence', value: cadence },
        { key: 'discount_percent', value: discountPercent?.toString() },
        { key: 'discount', value: discount },
      ],
    }));

    // prepare all lines for the new cart
    const allLines = [
      ...newSubscriptionLines,
      ...existingNonSubscriptionLines.map((line) => ({
        quantity: line.node.quantity,
        merchandiseId: line.node.merchandise.id,
        attributes: line.node.attributes,
      })),
    ];

    // new cart
    const createCartVariables = {
      input: {
        lines: allLines,
      },
    };
    const response = await fetch(`https://${store}/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: createCartQuery,
        variables: createCartVariables,
      }),
    });

    const data = await response.json();

    if (data.data && data.data.cartCreate) {
      const newCartId = data.data.cartCreate.cart.id;
      // extract the actual ID part (remove the prefix and any query parameters)
      const actualCartId = newCartId.split('/').pop().split('?')[0];
      const nextResponse = NextResponse.json(data);

      nextResponse.cookies.set('cart', actualCartId, {
        httpOnly: true,
        path: '/',
        domain: '.cyclingfrog.com',
      });

      return nextResponse;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error when processing the cart:', error);
    return NextResponse.json({ message: 'Failed to process the cart', error }, { status: 500 });
  }
}
