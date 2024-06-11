import { TiersTypes } from '@/content/content';
import { DiscountTypes } from '@/types/bundleTypes';

export const setBenefitTierContents = (discounts: DiscountTypes[], tiers: TiersTypes) => {
  return tiers.map((tier, index) => ({
    ...tier,
    value: discounts[index].minCartQuantity,
  }));
};
