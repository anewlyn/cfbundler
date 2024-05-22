// Temporary file to define the shape of the data that will be used in the app.

type productVariantsTypes = {
  shopifyId: number;
  quantity: number;
};

export type mockOrderTypes = {
  deliverySchedule: string;
  productVariants: productVariantsTypes[];
  boxSizeId: string;
  discountId: string;
  sellingPlanId: number;
};

const mockOrder = {
  deliverySchedule: '4 WEEKS',
  productVariants: [
    {
      shopifyId: 3,
      quantity: 2,
    },
    {
      shopifyId: 2,
      quantity: 1,
    },
    {
      shopifyId: 7,
      quantity: 1,
    },
    {
      shopifyId: 2,
      quantity: 1,
    },
    {
      shopifyId: 7,
      quantity: 1,
    },
  ],
  boxSizeId: '01',
  discountId: '012',
  sellingPlanId: 123,
};

export default mockOrder;
