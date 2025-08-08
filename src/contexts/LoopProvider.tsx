'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  submittingCart: boolean;
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
      footerMessage: tier.footerMessage
        .replace('$$', discounts[index].value.toString())
        .replace('^^', discounts[index + 1] ? discounts[index + 1].value.toString() : ''),
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
  const searchParams = useSearchParams();
  const [submittingCart, setSubmittingCart] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
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
    if (typeof document !== 'undefined' && !isInitialized) {
      // Check for pre-fill parameters first
      const variantId = searchParams.get('variant');
      const productId = searchParams.get('product');
      const quantity = searchParams.get('quantity');
      
      // Check if we have a saved cart
      const savedCart = getCartCookie();
      
      if (variantId || productId) {
        // Pre-fill logic
        let prefillVariantId: number | null = null;
        let prefillQuantity = quantity ? parseInt(quantity, 10) : 1;
        
        if (variantId) {
          // Direct variant ID provided
          prefillVariantId = parseInt(variantId, 10);
        } else if (productId) {
          // Product ID provided - find the first variant for this product
          const productIdNum = parseInt(productId, 10);
          const product = bundleData.products.find(p => p.shopifyId === productIdNum);
          if (product && product.variants.length > 0) {
            prefillVariantId = product.variants[0].shopifyId;
          }
        }
        
        if (prefillVariantId) {
          // Check if this variant exists in the bundle
          const variantExists = bundleData.products.some(product =>
            product.variants.some(variant => variant.shopifyId === prefillVariantId)
          );
          
          if (variantExists) {
            // If we have a saved cart, add to it; otherwise create new cart with pre-filled item
            if (savedCart?.productVariants.length > 0) {
              // Check if this variant is already in the cart
              const existingVariant = savedCart.productVariants.find(
                v => v.shopifyId === prefillVariantId
              );
              
              if (existingVariant) {
                // Update quantity
                savedCart.productVariants = savedCart.productVariants.map(v =>
                  v.shopifyId === prefillVariantId
                    ? { ...v, quantity: v.quantity + prefillQuantity }
                    : v
                );
              } else {
                // Add new variant
                savedCart.productVariants.push({
                  shopifyId: prefillVariantId,
                  quantity: prefillQuantity,
                });
              }
              setCart(savedCart);
            } else {
              // Create new cart with pre-filled item
              setCart({
                ...defaultCart,
                productVariants: [{
                  shopifyId: prefillVariantId,
                  quantity: prefillQuantity,
                }],
              });
            }
          } else {
            // Variant not found in bundle, load saved cart or default
            if (savedCart?.productVariants.length > 0) {
              setCart(savedCart);
            }
          }
        } else {
          // No valid variant found, load saved cart or default
          if (savedCart?.productVariants.length > 0) {
            setCart(savedCart);
          }
        }
      } else if (savedCart?.productVariants.length > 0) {
        // No pre-fill params, just load saved cart
        setCart(savedCart);
      }
      
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isInitialized]);

  useEffect(() => {
    if (typeof document !== 'undefined' && isInitialized) {
      setCartCookie(cart);
    }
  }, [cart, isInitialized]);

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
    setSubmittingCart(true);
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
          discount: currentDiscount?.code,
          discountPercent: currentDiscount?.value,
          existingCartId,
          sellingPlanId: cart.sellingPlanId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.cart) {
        const newCartId = data.cart.id;
        const actualCartId = newCartId.split('/').pop();

        // only set the cookie if it's a new cart
        if (data.isNewCart) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 1); // 1 day from now

          document.cookie = `cart=${actualCartId}; expires=${expirationDate.toUTCString()}; path=/;  SameSite=none; Secure=false`;
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
    setSubmittingCart(false);
  };

  const benefitTiers = setBenefitTierContents(discounts, tiers);

  const contextValue = {
    addProductVariant,
    benefitTiers,
    bundle: bundleData,
    cart,
    submittingCart,
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