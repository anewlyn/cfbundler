import classNames from 'classnames';
import '../styles/globals.scss';
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    {
      path: './fonts/Inter-VariableFont_slnt,wght.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
});

const kiroFont = localFont({
  src: [
    {
      path: './fonts/Kiro_Bold_Italic.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Kiro_Bold.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Kiro_ExtraBold_Italic.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Kiro_ExtraBold.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/Kiro_ExtraLight_Italic.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Kiro_ExtraLight.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Kiro_Italic.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Kiro_Light_Italic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/Kiro_Light.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Kiro_Thin_Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/Kiro_Thin.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Kiro.otf',
      weight: '700',
      style: 'italic',
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <body className={classNames(inter.className, kiroFont.className)}>{children}</body>
    </html>
  );
}
