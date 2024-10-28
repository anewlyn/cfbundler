import { NextRequest, NextResponse } from 'next/server';
import { CartType } from '@/contexts/LoopProvider';
import { ShopifyCartLineEdge, ShopifyFetchResponse } from '@/types/app/api/shopifyTypes';

export const runtime = 'edge';

const encodeId = (id: number) => {
  return Buffer.from(`gid://shopify/ProductVariant/${id}`).toString('base64');
};

const getCartCookie = (req: NextRequest): { cartId: string | null, cartKey: string | null } => {
  const cartCookie = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('cart='));
  if (!cartCookie) return { cartId: null, cartKey: null };

  // Decode and parse the cart cookie value
  const decodedValue = decodeURIComponent(cartCookie.split('=')[1]);
  const [cartId, cartKey] = decodedValue.split('?key=');
  
  return { cartId: cartId || null, cartKey: cartKey || null };
};

// Define your GraphQL queries and mutations here (same as in original code)

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
    // Retrieve cart ID and key from cookie if `existingCartId` is not provided
    const { cartId: cookieCartId, cartKey } = getCartCookie(request);
    let cartId = existingCartId || cookieCartId;
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

          const removeData = await removeResponse.json();

          if (
            removeData.errors ||
            (removeData.data && removeData.data.cartLinesRemove.userErrors.length > 0)
          ) {
            const messages: string[] = [];

            if (removeData.errors) {
              messages.push(...removeData.errors.map((error: { message: string }) => error.message || "An error occurred."));
            }

            if (removeData.data && removeData.data.cartLinesRemove.userErrors.length > 0) {
              messages.push(
                ...removeData.data.cartLinesRemove.userErrors.map(
                  (userError: { message: string }) => userError.message || "A user error occurred."
                )
              );
            }

            console.error('Error removing existing lines:', messages);

            return NextResponse.json(
              {
                message: 'Failed to remove existing lines',
                errors: messages + ", id: " + cartId,
              },
              { status: 500 }
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

    // Add lines, apply discount, etc. (continue with original logic)

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('Error when processing the cart:', error);
    return NextResponse.json({ message: 'Failed to process the cart', error }, { status: 500 });
  }
}
