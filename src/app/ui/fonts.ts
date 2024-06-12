import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
});

export const kiro_light = localFont({
  src: [
    {
      path: './fonts/Kiro_Light.woff',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--kiro_light',
  display: 'swap',
});
