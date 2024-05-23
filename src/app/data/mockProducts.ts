// Temporary file to define the shape of the data that will be used in the app.

export type mockProductsTypes = {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  type: string;
  status: string;
  currencyCode: string;
  currencySymbol: string;
  purchaseType: string;
  boxSizes: {
    id: string;
    name: string;
    minSize: number;
    maxSize: number;
    defaultSelected: boolean;
  }[];
  discounts: {
    id: string;
    name: string;
    code: string;
    type: string;
    value: number;
    conditionType: string;
    minCartValue: number;
    minCartQuantity: number;
    purchaseType: string;
    appliesOnEachItem: boolean;
  }[];
  sellingPlans: {
    shopifyId: string;
    name: string;
    description: string;
    discounts: {
      type: string;
      value: number;
    }[];
    deliveryInterval: string;
    deliveryIntervalCount: number;
    billingInterval: string;
    billingIntervalCount: number;
  }[];
  categories: {
    id: string;
    title: string;
    subTitle: string;
    imageURL: string;
    limits: {
      boxSizeId: string;
      minValue: number;
      maxValue: number;
    }[];
  }[];
  products: {
    shopifyId: number;
    title: string;
    handle: string;
    status: string;
    options: {
      id: string;
      name: string;
      values: string[];
      position: number;
    }[];
    variants: {
      shopifyId: string;
      title: string;
      price: number;
      position: number;
      taxable: boolean;
      imageURL: string;
      requiresShipping: boolean;
      outOfStock: boolean;
    }[];
    categoryId: string;
    limits: {
      boxSizeId: string;
      categoryId: string;
      maxValue: number;
    }[];
  }[];
};

const mockProducts = {
  id: '1',
  name: 'Product 1',
  description: 'This is product 1',
  imageURL: 'https://example.com/product1.jpg',
  type: 'Physical',
  status: 'Available',
  currencyCode: 'USD',
  currencySymbol: '$',
  purchaseType: 'One-time',
  boxSizes: [
    {
      id: 'default',
      name: 'Default',
      minSize: 0,
      maxSize: 0,
      defaultSelected: true,
    },
    {
      id: 'box1',
      name: 'Small Box',
      minSize: 1,
      maxSize: 10,
      defaultSelected: true,
    },
  ],
  discounts: [
    {
      id: 'discount1',
      name: 'Discount 1',
      code: 'DISC1',
      type: 'Percentage',
      value: 10,
      conditionType: 'Minimum Purchase',
      minCartValue: 100,
      minCartQuantity: 1,
      purchaseType: 'One-time',
      appliesOnEachItem: true,
    },
  ],
  sellingPlans: [
    {
      shopifyId: 'plan1',
      name: 'Plan 1',
      description: 'This is plan 1',
      discounts: [
        {
          type: 'Percentage',
          value: 5,
        },
      ],
      deliveryInterval: 'Monthly',
      deliveryIntervalCount: 1,
      billingInterval: 'Monthly',
      billingIntervalCount: 1,
    },
  ],
  categories: [
    {
      id: 'category1',
      title: 'Category 1',
      subTitle: 'This is category 1',
      imageURL: 'https://example.com/category1.jpg',
      limits: [
        {
          boxSizeId: 'box1',
          minValue: 1,
          maxValue: 10,
        },
      ],
    },
  ],
  products: [
    {
      shopifyId: 1,
      title: 'Wild Cherry THC Seltzer',
      handle: 'product-1',
      status: 'Available',
      options: [
        {
          id: 'option1',
          name: 'Color',
          values: ['Red', 'Blue'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant1',
          title: 'Wild Cherry THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/wild-cherry-seltzer.png',
          requiresShipping: true,
          outOfStock: false,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category1',
          maxValue: 5,
        },
      ],
    },

    {
      shopifyId: 2,
      title: 'Black Currant THC Seltzer',
      handle: 'product-2',
      status: 'Available',
      options: [
        {
          id: 'option2',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant2',
          title: 'Black Currant THC Seltzer',
          price: 11.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/black-currant.png',
          requiresShipping: true,
          outOfStock: false,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 3,
      title: 'Ruby Grapefruit THC Seltzer',
      handle: 'product-3',
      status: 'Available',
      options: [
        {
          id: 'option3',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant3',
          title: 'Ruby Grapefruit THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/ruby-grapefruit.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 4,
      title: 'Wild Cherry THC Seltzer',
      handle: 'product-1',
      status: 'Available',
      options: [
        {
          id: 'option1',
          name: 'Color',
          values: ['Red', 'Blue'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant1',
          title: 'Wild Cherry THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/wild-cherry-seltzer.png',
          requiresShipping: true,
          outOfStock: false,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 5,
      title: 'Black Currant THC Seltzer',
      handle: 'product-2',
      status: 'Available',
      options: [
        {
          id: 'option2',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant2',
          title: 'Black Currant THC Seltzer',
          price: 11.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/black-currant.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 6,
      title: 'Ruby Grapefruit THC Seltzer',
      handle: 'product-3',
      status: 'Available',
      options: [
        {
          id: 'option3',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant3',
          title: 'Ruby Grapefruit THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/ruby-grapefruit.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 7,
      title: 'Black Currant THC Seltzer',
      handle: 'product-2',
      status: 'Available',
      options: [
        {
          id: 'option2',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant2',
          title: 'Black Currant THC Seltzer',
          price: 11.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/black-currant.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 8,
      title: 'Ruby Grapefruit THC Seltzer',
      handle: 'product-3',
      status: 'Available',
      options: [
        {
          id: 'option3',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant3',
          title: 'Ruby Grapefruit THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/ruby-grapefruit.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 5,
      title: 'Black Currant THC Seltzer',
      handle: 'product-2',
      status: 'Available',
      options: [
        {
          id: 'option2',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant2',
          title: 'Black Currant THC Seltzer',
          price: 11.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/black-currant.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 6,
      title: 'Ruby Grapefruit THC Seltzer',
      handle: 'product-3',
      status: 'Available',
      options: [
        {
          id: 'option3',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant3',
          title: 'Ruby Grapefruit THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/ruby-grapefruit.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 7,
      title: 'Black Currant THC Seltzer',
      handle: 'product-2',
      status: 'Available',
      options: [
        {
          id: 'option2',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant2',
          title: 'Black Currant THC Seltzer',
          price: 11.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/black-currant.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
    {
      shopifyId: 8,
      title: 'Ruby Grapefruit THC Seltzer',
      handle: 'product-3',
      status: 'Available',
      options: [
        {
          id: 'option3',
          name: 'Size',
          values: ['Small', 'Large'],
          position: 1,
        },
      ],
      variants: [
        {
          shopifyId: 'variant3',
          title: 'Ruby Grapefruit THC Seltzer',
          price: 19.99,
          position: 1,
          taxable: true,
          imageURL: '/assets/ruby-grapefruit.png',
          requiresShipping: true,
          outOfStock: true,
        },
      ],
      categoryId: 'category1',
      limits: [
        {
          boxSizeId: 'box1',
          categoryId: 'category 1',
          maxValue: 5,
        },
      ],
    },
  ],
};

export default mockProducts;
