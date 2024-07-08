'use client';

import { CartType } from '@/contexts/LoopProvider';

const getCookie = (cookieName: string) => {
  if (document) {
    // Split document.cookie into an array of cookies
    const cookies = document.cookie.split('; ');

    // Find the cookie that matches the cookieName
    const cookie = cookies.find((cookie) => {
      const [name] = cookie.split('=');
      return name === cookieName;
    });

    // Return the cookie value
    return cookie ? cookie.split('=')[1] : '';
  }
  return '';
};

const setCookie = (cookieName: string, cookieValue: string, expirationDays: number) => {
  if (document) {
    // Get the current date
    const date = new Date();

    // Set the expiration date
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);

    // Set the cookie
    document.cookie = `${cookieName}=${cookieValue}; expires=${date.toUTCString()}; path=/`;
  }
};

export const getCartCookie = () => {
  const cartCookie = getCookie('cf_cart');
  return cartCookie ? JSON.parse(cartCookie) : null;
};

export const setCartCookie = (cart: CartType) => {
  setCookie('cf_cart', JSON.stringify(cart), 0.25);
};
