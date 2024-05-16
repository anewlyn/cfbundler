// Temporary file to define the shape of the data that will be used in the app.

export const dataShape = {
  "id": "string",
  "name": "string",
  "description": "string",
  "imageURL": "string",
  "type": "string",
  "status": "string",
  "currencyCode": "string",
  "currencySymbol": "string",
  "purchaseType": "string",
  "boxSizes": [
    {
      "id": "string",
      "name": "string",
      "minSize": 0,
      "maxSize": 0,
      "defaultSelected": true
    }
  ],
  "discounts": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "type": "string",
      "value": 0,
      "conditionType": "string",
      "minCartValue": 0,
      "minCartQuantity": 0,
      "purchaseType": "string",
      "appliesOnEachItem": true
    }
  ],
  "sellingPlans": [
    {
      "shopifyId": "string",
      "name": "string",
      "description": "string",
      "discounts": [
        {
          "type": "string",
          "value": 0
        }
      ],
      "deliveryInterval": "string",
      "deliveryIntervalCount": 0,
      "billingInterval": "string",
      "billingIntervalCount": 0
    }
  ],
  "categories": [
    {
      "id": "string",
      "title": "string",
      "subTitle": "string",
      "imageURL": "string",
      "limits": [
        {
          "boxSizeId": "string",
          "minValue": 0,
          "maxValue": 0
        }
      ]
    }
  ],
  "products": [
    {
      "shopifyId": "string",
      "title": "string",
      "handle": "string",
      "status": "string",
      "options": [
        {
          "id": "string",
          "name": "string",
          "values": [
            "string"
          ],
          "position": 0
        }
      ],
      "variants": [
        {
          "shopifyId": "string",
          "title": "string",
          "price": 0,
          "position": 0,
          "taxable": true,
          "imageURL": "string",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "string",
      "limits": [
        {
          "boxSizeId": "string",
          "categoryId": "string",
          "maxValue": 0
        }
      ]
    }
  ]
};

const mockData = {
  "id": "1",
  "name": "Product 1",
  "description": "This is product 1",
  "imageURL": "https://example.com/product1.jpg",
  "type": "Physical",
  "status": "Available",
  "currencyCode": "USD",
  "currencySymbol": "$",
  "purchaseType": "One-time",
  "boxSizes": [
    {
      "id": "box1",
      "name": "Small Box",
      "minSize": 1,
      "maxSize": 10,
      "defaultSelected": true
    }
  ],
  "discounts": [
    {
      "id": "discount1",
      "name": "Discount 1",
      "code": "DISC1",
      "type": "Percentage",
      "value": 10,
      "conditionType": "Minimum Purchase",
      "minCartValue": 100,
      "minCartQuantity": 1,
      "purchaseType": "One-time",
      "appliesOnEachItem": true
    }
  ],
  "sellingPlans": [
    {
      "shopifyId": "plan1",
      "name": "Plan 1",
      "description": "This is plan 1",
      "discounts": [
        {
          "type": "Percentage",
          "value": 5
        }
      ],
      "deliveryInterval": "Monthly",
      "deliveryIntervalCount": 1,
      "billingInterval": "Monthly",
      "billingIntervalCount": 1
    }
  ],
  "categories": [
    {
      "id": "category1",
      "title": "Category 1",
      "subTitle": "This is category 1",
      "imageURL": "https://example.com/category1.jpg",
      "limits": [
        {
          "boxSizeId": "box1",
          "minValue": 1,
          "maxValue": 10
        }
      ]
    }
  ],
  "products": [
    {
      "shopifyId": "product1",
      "title": "Wild Cherry THC Seltzer",
      "handle": "product-1",
      "status": "Available",
      "options": [
        {
          "id": "option1",
          "name": "Color",
          "values": [
            "Red",
            "Blue"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant1",
          "title": "Wild Cherry THC Seltzer",
          "price": 19.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/wild-cherry-seltzer.png",
          "requiresShipping": true,
          "outOfStock": false
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category1",
          "maxValue": 5
        }
      ]
    },

    {
      "shopifyId": "product2",
      "title": "Black Currant THC Seltzer",
      "handle": "product-2",
      "status": "Available",
      "options": [
        {
          "id": "option2",
          "name": "Size",
          "values": [
            "Small",
            "Large"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant2",
          "title": "Black Currant THC Seltzer",
          "price": 11.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/black-currant.png",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category 1",
          "maxValue": 5
        }

      ]
    },
    {
      "shopifyId": "product3",
      "title": "Ruby Grapefruit THC Seltzer",
      "handle": "product-3",
      "status": "Available",
      "options": [
        {
          "id": "option3",
          "name": "Size",
          "values": [
            "Small",
            "Large"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant3",
          "title": "Ruby Grapefruit THC Seltzer",
          "price": 19.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/ruby-grapefruit.png",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category 1",
          "maxValue": 5
        }
      ]
    },
    {
      "shopifyId": "product1",
      "title": "Wild Cherry THC Seltzer",
      "handle": "product-1",
      "status": "Available",
      "options": [
        {
          "id": "option1",
          "name": "Color",
          "values": [
            "Red",
            "Blue"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant1",
          "title": "Wild Cherry THC Seltzer",
          "price": 19.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/wild-cherry-seltzer.png",
          "requiresShipping": true,
          "outOfStock": false
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category1",
          "maxValue": 5
        }
      ]
    },
    {
      "shopifyId": "product2",
      "title": "Black Currant THC Seltzer",
      "handle": "product-2",
      "status": "Available",
      "options": [
        {
          "id": "option2",
          "name": "Size",
          "values": [
            "Small",
            "Large"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant2",
          "title": "Black Currant THC Seltzer",
          "price": 11.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/black-currant.png",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category 1",
          "maxValue": 5
        }

      ]
    },
    {
      "shopifyId": "product3",
      "title": "Ruby Grapefruit THC Seltzer",
      "handle": "product-3",
      "status": "Available",
      "options": [
        {
          "id": "option3",
          "name": "Size",
          "values": [
            "Small",
            "Large"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant3",
          "title": "Ruby Grapefruit THC Seltzer",
          "price": 19.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/ruby-grapefruit.png",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category 1",
          "maxValue": 5
        }
      ]
    },
    {
      "shopifyId": "product2",
      "title": "Black Currant THC Seltzer",
      "handle": "product-2",
      "status": "Available",
      "options": [
        {
          "id": "option2",
          "name": "Size",
          "values": [
            "Small",
            "Large"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant2",
          "title": "Black Currant THC Seltzer",
          "price": 11.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/black-currant.png",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category 1",
          "maxValue": 5
        }

      ]
    },
    {
      "shopifyId": "product3",
      "title": "Ruby Grapefruit THC Seltzer",
      "handle": "product-3",
      "status": "Available",
      "options": [
        {
          "id": "option3",
          "name": "Size",
          "values": [
            "Small",
            "Large"
          ],
          "position": 1
        }
      ],
      "variants": [
        {
          "shopifyId": "variant3",
          "title": "Ruby Grapefruit THC Seltzer",
          "price": 19.99,
          "position": 1,
          "taxable": true,
          "imageURL": "/assets/ruby-grapefruit.png",
          "requiresShipping": true,
          "outOfStock": true
        }
      ],
      "categoryId": "category1",
      "limits": [
        {
          "boxSizeId": "box1",
          "categoryId": "category 1",
          "maxValue": 5
        }
      ]
    }
  ]
};

export default mockData;
