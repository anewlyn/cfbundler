export type BenefitTierTypes = {
  subtitle: string;
  footerMessage: string;
}[];

export const tiers: BenefitTierTypes = [
  {
    footerMessage: 'Subscriptions require a $50 minimum order.',
    subtitle: '$$% off',
  },
  {
    footerMessage: 'You got $$% off!',
    subtitle: '$$% off',
  },
  {
    footerMessage: 'Yay! You have free shipping and a 10% discount.',
    subtitle: '$$% off',
  },
];
