export type BenefitTierTypes = {
  subtitle: string;
  footerMessage: string;
}[];

export const tiers: BenefitTierTypes = [
  {
    footerMessage: 'Subscriptions require a $50 minimum order.',
    subtitle: 'Min. Order, $$% off',
  },
  {
    footerMessage: 'Yay! You have free shipping.',
    subtitle: '$$% off',
  },
  {
    footerMessage: 'Yay! You have free shipping and a 10% discount.',
    subtitle: '$$% off',
  },
];
