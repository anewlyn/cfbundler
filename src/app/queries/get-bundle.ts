export async function getBundle() {
  const domain =
    process.env.NEXT_PUBLIC_APP_ENV === 'production'
      ? `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`
      : process.env.NEXT_PUBLIC_URL;
  return await fetch(`${domain}/api/loop/bundle`).then((res) => res.json());
}
