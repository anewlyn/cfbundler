import '../styles/globals.scss';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <meta name="viewport" content="width=device-width" initial-scale="1" />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
        // @ts-ignore - NextJS requires this unsupported attribute
        precedence="default"
      />
      <body>{children}</body>
      <script
        async
        src={`//loox.io/widget/loox.js?shop=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`}
      />
    </html>
  );
}
