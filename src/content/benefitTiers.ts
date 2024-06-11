export type BenefitTierTypes = {
  subtitle: string;
  footerMessage: string;
}[];

export const tiers: BenefitTierTypes = [
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
