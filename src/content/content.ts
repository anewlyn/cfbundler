export type TiersTypes = {
  subtitle: string;
  footerMessage: string;
}[];

export const tiers: TiersTypes = [
  {
    subtitle: 'Min. Order',
    footerMessage: 'Subscriptions require a $50 minimum order.',
  },
  {
    footerMessage: 'Yay! You have free shipping.',
    subtitle: 'Free Shipping',
  },
  {
    footerMessage: 'Yay! You have free shipping and a 10% discount.',
    subtitle: '10% off',
  },
];
