import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import DataRoute from '../route/DataRoute';
import '../index.css';

export const metadata = {
  metadataBase: new URL('https://mickeycrackers.com'),
  title: {
    default: 'Mickey Crackers | Best Crackers Shop & Online Crackers Website',
    template: '%s | Mickey Crackers Sivakasi'
  },
  description: 'Mickey Crackers Sivakasi: The best online crackers website to buy premium quality fireworks at low cost. Certified green crackers and vedi kadai online with safe doorstep delivery.',
  keywords: [
    'Mickey Crackers',
    'Sivakasi crackers',
    'buy crackers online',
    'best crackers shop',
    'online crackers website',
    'low cost crackers',
    'vedi kadai',
    'sivakasi vedi kadai online',
    'sivakasi crackers price list 2026',
    'online cracker shopping',
    'diwali crackers online booking',
    'cheap crackers online sivakasi',
    'standard crackers online',
    'green crackers online',
    'doorstep delivery crackers',
    'crackers wholesale shop'
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Mickey Crackers | Best Crackers Shop & Online Crackers Website',
    description: 'Shop premium Sivakasi fireworks online at Mickey Crackers. Buy low cost, high quality green crackers directly from our online vedi kadai with shipping across India.',
    url: 'https://mickeycrackers.com',
    siteName: 'Mickey Crackers',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mickey Crackers Sivakasi Wholesale Fireworks Store',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mickey Crackers | Best Crackers Shop & Online Crackers Website',
    description: 'Shop premium Sivakasi fireworks online at Mickey Crackers. Buy low cost, high quality green crackers directly from our online vedi kadai with shipping across India.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mickey Crackers",
    "image": "https://mickeycrackers.com/og-image.png",
    "@id": "https://mickeycrackers.com/#localbusiness",
    "url": "https://mickeycrackers.com",
    "telephone": "+919025399060",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D Amman Township, Southside school & Government college opposite, Chenakaman Patti",
      "addressLocality": "Sivakasi",
      "addressRegion": "Tamil Nadu",
      "postalCode": "626189",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.4532,
      "longitude": 77.8021
    },
    "sameAs": [
      "https://wa.me/919025399060"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: '#D4AF37', // Premium Gold primary
                colorSuccess: '#52c41a',
                colorWarning: '#faad14',
                colorError: '#ff4d4f',
                colorInfo: '#D4AF37',
                colorBgContainer: '#121212',
                colorBgLayout: '#0a0a0a',
                colorBgElevated: '#161616',
                colorBorder: '#1c1c1c', // Darker borders instead of too white
                colorBorderSecondary: '#161616',
                colorText: '#ffffff',
                colorTextSecondary: '#a3a3a3',
                colorIcon: '#a3a3a3',
                colorIconHover: '#D4AF37',
              },
              components: {
                Menu: {
                  itemSelectedColor: '#000000', // Selected item text color set to dark
                  itemSelectedBg: '#D4AF37',    // Selected item background color set to gold
                },
                Table: {
                  borderColor: '#1a1a1a', // Darker table border dividers
                },
                Button: {
                  primaryShadow: 'none',
                  dangerShadow: 'none',
                  defaultShadow: 'none',
                },
                Select: {
                  optionSelectedBg: '#D4AF37',
                  optionSelectedColor: '#000000',
                  optionActiveBg: '#1c1c1c',
                },
              }
            }}
          >
            <AntdApp>
              <DataRoute>
                {children}
              </DataRoute>
            </AntdApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
