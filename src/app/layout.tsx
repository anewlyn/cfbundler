import { Metadata } from 'next';
import '../styles/globals.scss';
import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Cycling Frog',
  description:
    "Cycling Frog isn't just a brand. It's a statement. It's the belief that cannabis consumption should be normalized. Cannabis should be affordable. Cannabis should be accessible. Cannabis is fun. Cannabis should be enjoyed with the same ease as your favorite sparkling water or beer, and we at Cycling Frog are here to make that happen.",
  applicationName: 'Cycling Frog Bundler',
  icons: [
    {
      rel: 'icon',
      url: 'https://bundler.cyclingfrog.com/favicon.png',
    },
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Assemble Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Cycling Frog',
    description:
      "Cycling Frog isn't just a brand. It's a statement. It's the belief that cannabis consumption should be normalized. Cannabis should be affordable. Cannabis should be accessible. Cannabis is fun. Cannabis should be enjoyed with the same ease as your favorite sparkling water or beer, and we at Cycling Frog are here to make that happen.",
    url: 'https://cyclingfrog.com/',
    siteName: 'Cycling Frog Bundler',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
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
      <body>
        <section>{children}</section>
        <script
          async
          src={`//loox.io/widget/loox.js?shop=${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`}
        />
      </body>
    </html>
  );
}
