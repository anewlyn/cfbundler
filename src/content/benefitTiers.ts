export type BenefitTierTypes = {
  subtitle: string;
  footerMessage: string;
}[];

export const tiers: BenefitTierTypes = [
  {
    footerMessage: process.env.NEXT_PUBLIC_BENEFIT_TIER_ONE_FOOTER_TEXT || '',
    subtitle: process.env.NEXT_PUBLIC_BENEFIT_TIER_ONE_HEADER_TEXT || '',
  },
  {
    footerMessage: process.env.NEXT_PUBLIC_BENEFIT_TIER_TWO_FOOTER_TEXT || '',
    subtitle: process.env.NEXT_PUBLIC_BENEFIT_TIER_TWO_HEADER_TEXT || '',
  },
  {
    footerMessage: process.env.NEXT_PUBLIC_BENEFIT_TIER_THREE_FOOTER_TEXT || '',
    subtitle: process.env.NEXT_PUBLIC_BENEFIT_TIER_THREE_HEADER_TEXT || '',
  },
];
