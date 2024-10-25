import { NextRequest, NextResponse } from 'next/server';
import { CartType } from '@/contexts/LoopProvider';
import { ShopifyCartLineEdge, ShopifyFetchResponse } from '@/types/app/api/shopifyTypes';

export const runtime = 'edge';

const encodeId = (id: number) => {
  return Buffer.from(`gid://shopify/ProductVariant/${id}`).toString('base64');
};

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

const cartLinesRemoveQuery = `
mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      lines(first: 250) {
        edges {
          node {
            id
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;

const cartLinesAddQuery = `
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
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
    userErrors {
      field
      message
    }
  }
}
`;

const cartDiscountCodesUpdateMutation = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  const body: CartType = await request.json();
  const {
    productVariants,
    transactionId,
    cadence,
    discountPercent,
    discount,
    existingCartId,
    sellingPlanId,
  } = body;

  const store = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_KEY || '';

  if (!store || !token) {
    console.error('missing env variables!');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    let cartId = existingCartId;
    let existingNonSubscriptionLines: ShopifyCartLineEdge[] = [];
    let isNewCart = false;

    if (cartId) {
      cartId = `gid://shopify/Cart/${cartId}`;

      // Fetch existing cart
      const fetchResponse = await fetch(`https://${store}/api/2024-04/graphql.json`, {
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
        const existingCartLines = fetchData.data.cart.lines.edges;

        // Separate non-subscription items
        existingNonSubscriptionLines = existingCartLines.filter(
          (line) =>
            !line.node.attributes.some(
              (attr) => attr.key === 'subscription' && attr.value === 'true',
            ),
        );

        // Remove all existing lines
        const lineIds = existingCartLines.map((line) => line.node.id);
        if (lineIds.length > 0) {
          const removeResponse = await fetch(`https://${store}/api/2024-04/graphql.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({
              query: cartLinesRemoveQuery,
              variables: { cartId, lineIds },
            }),
          });

interface RemoveData {
  errors?: { message: string }[];
  data?: {
    cartLinesRemove: {
      userErrors: { message: string }[];
    };
  };
}
          
          const removeData = await removeResponse.json();
          if (
            removeData.errors ||
            (removeData.data && removeData.data.cartLinesRemove.userErrors.length > 0)
          ) {
            console.error(
              'Error removing existing lines:',
              removeData.errors || removeData.data.cartLinesRemove.userErrors,
            );

  // Consolidate all error messages
  const messages = [];

  if (removeData.errors) {
    messages.push(...removeData.errors.map(error => error.message || "An error occurred."));
  }

  if (removeData.data && removeData.data.cartLinesRemove.userErrors.length > 0) {
    messages.push(
      ...removeData.data.cartLinesRemove.userErrors.map(
        userError => userError.message || "A user error occurred."
      )
    );
  }

            
            return NextResponse.json(
              { message: 'Failed to remove existing lines' ,
               error:  messages},
              { status: 500 },
            );
          }
        }
      } else {
        console.error('Failed to fetch existing cart:', fetchData);
        return NextResponse.json({ message: 'Failed to fetch existing cart' }, { status: 500 });
      }
    } else {
      // Create new cart
      const createCartResponse = await fetch(`https://${store}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({
          query: createCartQuery,
          variables: { input: {} },
        }),
      });

      const createCartData = await createCartResponse.json();
      if (createCartData.errors || !createCartData.data || !createCartData.data.cartCreate) {
        console.error(
          'Error creating new cart:',
          createCartData.errors || 'Unexpected response structure',
        );
        return NextResponse.json({ message: 'Failed to create new cart' }, { status: 500 });
      }

      cartId = createCartData.data.cartCreate.cart.id;
      isNewCart = true;
    }

    // Prepare lines to add: new subscription items and existing non-subscription items
    const linesToAdd = [
      ...productVariants.map((variant) => ({
        quantity: variant.quantity,
        merchandiseId: encodeId(variant.shopifyId),
        sellingPlanId: Buffer.from(`gid://shopify/SellingPlan/${sellingPlanId}`).toString('base64'),
        attributes: [
          { key: 'subscription', value: 'true' },
          { key: '_bundleId', value: transactionId },
          { key: 'cadence', value: cadence },
          { key: 'discount_percent', value: discountPercent?.toString() },
          // { key: 'discount', value: discount },
        ],
      })),
      ...existingNonSubscriptionLines.map((line) => ({
        quantity: line.node.quantity,
        merchandiseId: line.node.merchandise.id,
        attributes: line.node.attributes,
      })),
    ];

    // Add all lines to cart
    const addResponse = await fetch(`https://${store}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: cartLinesAddQuery,
        variables: { cartId, lines: linesToAdd },
      }),
    });

    const addData = await addResponse.json();
    if (addData.errors || (addData.data && addData.data.cartLinesAdd.userErrors.length > 0)) {
      console.error(
        'Error adding lines to cart:',
        addData.errors || addData.data.cartLinesAdd.userErrors,
      );
      return NextResponse.json({ message: 'Failed to add lines to cart' }, { status: 500 });
    }

    // now apply the selected discount code

    const applyResult = await fetch(`https://${store}/api/2024-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: cartDiscountCodesUpdateMutation,
        variables: { cartId, discountCodes: [discount] },
      }),
    });
    const applyData = await applyResult.json();

    if (
      applyData.errors ||
      (applyData.data && applyData.data.cartDiscountCodesUpdate.userErrors.length > 0)
    ) {
      console.error(
        'Error applying discount code:',
        applyData.errors || applyData.data.cartDiscountCodesUpdate.userErrors,
      );
      return NextResponse.json({ message: 'Error applying discount code' }, { status: 500 });
    }
    const cartResponse = addData.data.cartLinesAdd.cart;

    const responseBody = {
      cart: cartResponse,
      isNewCart: isNewCart,
      prevCart: cartId,
    };

    const nextResponse = NextResponse.json(responseBody);

    return nextResponse;
  } catch (error) {
    console.error('Error when processing the cart:', error);
    return NextResponse.json({ message: 'Failed to process the cart', error }, { status: 500 });
  }
}
