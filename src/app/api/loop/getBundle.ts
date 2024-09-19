export async function getBundle() {
  const options: RequestInit = {
    method: 'GET',
    //cache: 'no-store',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_LOOP_API_KEY || '',
    },
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle?myshopifyDomain=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
    options,
  );

  const bundleId = await response.json();

  const bundleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_LOOP_API_URL}${process.env.NEXT_PUBLIC_LOOP_API_VERSION}/bundle/${bundleId.data[0].id}`,
    options,
  );

  return bundleResponse.json();
}
