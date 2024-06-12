import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
});

export const kiro_bold_italic_400 = localFont({
  src: [
    {
      path: './fonts/Kiro_Bold_Italic.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--kiro_bold_italic_400',
  display: 'swap',
});

export const kiro_bold_400 = localFont({
  src: [
    {
      path: './fonts/Kiro_Bold.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--kiro_bold_400',
  display: 'swap',
});

export const kiro_extra_bold_italic_700 = localFont({
  src: [
    {
      path: './fonts/Kiro_ExtraBold_Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--kiro_extra_bold_italic_700',
  display: 'swap',
});

export const kiro_extra_bold_700 = localFont({
  src: [
    {
      path: './fonts/Kiro_ExtraBold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--kiro_extra_bold_700',
  display: 'swap',
});

export const kiro_extra_light_italic_400 = localFont({
  src: [
    {
      path: './fonts/Kiro_ExtraLight_Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--kiro_extra_light_italic_400',
  display: 'swap',
});

export const kiro_extra_light_400 = localFont({
  src: [
    {
      path: './fonts/Kiro_ExtraLight.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--kiro_extra_light_400',
  display: 'swap',
});

export const kiro_italic_700 = localFont({
  src: [
    {
      path: './fonts/Kiro_Italic.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--kiro_italic_700',
  display: 'swap',
});

export const kiro_light_italic_700 = localFont({
  src: [
    {
      path: './fonts/Kiro_Light_Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--kiro_light_italic_700',
  display: 'swap',
});

export const kiro_light_400 = localFont({
  src: [
    {
      path: './fonts/Kiro_Light.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--kiro_light_400',
  display: 'swap',
});

export const kiro_thin_italic_400 = localFont({
  src: [
    {
      path: './fonts/Kiro_Thin_Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--kiro_thin_italic_400',
  display: 'swap',
});

export const kiro_thin_700 = localFont({
  src: [
    {
      path: './fonts/Kiro_Thin.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--kiro_thin_700',
  display: 'swap',
});

export const kiro_700 = localFont({
  src: [
    {
      path: './fonts/Kiro.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--kiro_700',
  display: 'swap',
});
