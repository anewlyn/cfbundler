'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import createTransaction from '@/app/api/loop/createTransaction';
import { BenefitTierTypes, tiers } from '@/content/benefitTiers';
import {
  getCartValue,
  getDiscount,
  setProductsForRender,
  sortByProductType,
} from '@/helpers/cartHelpers';
import { getCartCookie, setCartCookie } from '@/helpers/cookies';
import { ShopifyProductType } from '@/types/app/api/shopifyTypes';
import { AllProductVariants, BundleTypes, DiscountTypes } from '@/types/bundleTypes';

export type LoopContextType = {
  addProductVariant: ({ shopifyId, quantity }: VariantType) => void;
  benefitTiers: { subtitle: string; footerMessage: string; value: number }[];
  bundle: BundleTypes;
  cart: CartType;
  currentOrderValue: number;
  currentDiscount: DiscountTypes | null;
  handleTransaction: () => void;
  products: AllProductVariants[];
  sellingPlans: BundleTypes['sellingPlans'];
  setCart: (arg0: CartType) => void;
};

const LoopContext = createContext<LoopContextType>({} as LoopContextType);

const useLoopContext = () => useContext(LoopContext);

type VariantType = {
  shopifyId: number;
  quantity: number;
};

export type CartType = {
  boxSizeId: string;
  discountId: string | null;
  productVariants: VariantType[];
  quantity: number;
  sellingPlanId: number;
  transactionId: string | null;
  cadence?: string;
  discount?: string;
  discountPercent?: number;
  existingCartId?: string | null;
};

const setBenefitTierContents = (discounts: DiscountTypes[], tiers: BenefitTierTypes) => {
  return tiers.map((tier, index) => {
    return {
      ...tier,
      footerMessage: tier.footerMessage.replace('$$', discounts[index].value.toString()),
      subtitle: tier.subtitle.replace('$$', discounts[index].value.toString()),
      value: discounts[index].minCartQuantity,
    };
  });
};

const LoopProvider = ({
  bundleData,
  shopifyProducts,
  children,
}: {
  bundleData: BundleTypes;
  shopifyProducts: Record<string, ShopifyProductType>;
  children: React.ReactNode;
}) => {
  const defaultCart: CartType = {
    boxSizeId: bundleData.boxSizes[0].id,
    discountId: null,
    productVariants: [],
    quantity: 0,
    sellingPlanId: bundleData.sellingPlans[0].shopifyId,
    transactionId: null,
  };
  const [cart, setCart] = useState<CartType>(defaultCart);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const startCart = document ? getCartCookie() : null;
      if (startCart?.productVariants.length > 0) {
        setCart(startCart);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setCartCookie(cart);
    }
  }, [cart]);

  const { products, discounts, sellingPlans } = bundleData;

  const shopifyDomain = process.env.NEXT_PUBLIC_REDIRECT_URL || '';
  const productsForRender = setProductsForRender(products, shopifyProducts);
  const sortProductsByType = sortByProductType(productsForRender);
  const currentOrderValue = getCartValue(productsForRender, cart);
  const currentDiscount = getDiscount(discounts, getCartValue(productsForRender, cart));

  const addProductVariant = ({ shopifyId, quantity }: VariantType) => {
    const productVariant = cart?.productVariants?.find(
      (variant: VariantType) => variant.shopifyId === shopifyId,
    );

    if (productVariant) {
      if (quantity === 0) {
        setCart((prevCart) => ({
          ...prevCart,
          productVariants: prevCart.productVariants.filter(
            (variant: VariantType) => variant.shopifyId !== shopifyId,
          ),
        }));
      } else {
        setCart((prevCart) => ({
          ...prevCart,
          productVariants: prevCart.productVariants.map((variant) =>
            variant.shopifyId === shopifyId ? { ...variant, quantity: quantity } : variant,
          ),
        }));
      }
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        productVariants: [...prevCart.productVariants, { shopifyId, quantity }],
      }));
    }
    setCartCookie(cart);
  };

  const handleTransaction = async () => {
    const cadence = sellingPlans.find((plan) => plan.shopifyId === cart.sellingPlanId);
    const transactionId = await createTransaction(cart, bundleData.id);
    const url =
      process.env.NEXT_PUBLIC_API_URL || 'https://bundler.cyclingfrog.com/api/shopify/pushToCart';

    // pull cookie from the client side
    let existingCartId = null;
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const cartCookie = cookies.find((cookie) => cookie.startsWith('cart='));
      if (cartCookie) {
        // strip the cookie and then decode the shopify cartId
        // cookie is setup like: cartId?key=keyValue
        existingCartId = decodeURIComponent(cartCookie).split('=')[1].split('?')[0];
      }
    }
    console.log('existingCartId', existingCartId);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productVariants: cart.productVariants,
          transactionId,
          cadence: cadence?.name,
          discount: currentDiscount?.name,
          discountPercent: currentDiscount?.value,
          existingCartId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.cart) {
        const newCartId = data.cart.id;
        const actualCartId = newCartId.split('/').pop();

        console.log('cart stuff', {
          isNewCart: data.isNewCart,
          prevCart: data.prevCart,
        });
        // only set the cookie if it's a new cart
        if (data.isNewCart) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1); // 1 day from now

          document.cookie = `cart=${actualCartId}; expires=${expirationDate.toUTCString()}; path=/;  SameSite=none; Secure=false`;

          console.log('New cart created, cookie set:', actualCartId);
        } else {
          console.log('Existing cart updated, no new cookie set');
        }

        const cartUrl = `${shopifyDomain}/?open_cart=true`;

        // redirect to the cart
        window.location.href = cartUrl;
      } else {
        console.error('Error processing cart: Unexpected response structure', data);
      }
    } catch (error) {
      console.error('Error processing cart:', error);
    }
  };

  const benefitTiers = setBenefitTierContents(discounts, tiers);

  const contextValue = {
    addProductVariant,
    benefitTiers,
    bundle: bundleData,
    cart,
    currentOrderValue,
    currentDiscount,
    handleTransaction,
    products: sortProductsByType,
    sellingPlans,
    setCart,
  };

  return <LoopContext.Provider value={contextValue}>{children}</LoopContext.Provider>;
};

export { useLoopContext };
export default LoopProvider;
