import React from 'react';
import QuickPurchaseClient from './QuickPurchaseClient';

export const metadata = {
  title: 'Sivakasi Crackers Price List 2026 | Best Online Crackers Shop',
  description: 'View the latest 2026 Sivakasi crackers price list. Buy best quality sparklers, rockets, chakkars, and fancy crackers online at low cost direct from our vedi kadai shop.',
  keywords: [
    'Sivakasi crackers price list 2026',
    'buy crackers online',
    'sivakasi vedi kadai price list',
    'best crackers shop online',
    'low cost crackers list',
    'wholesale crackers price list',
    'Diwali crackers online shopping',
    'Sivakasi price list',
    'online crackers website',
    'low cost crackers online purchase'
  ],
  openGraph: {
    title: 'Sivakasi Crackers Price List 2026 | Best Online Crackers Shop',
    description: 'Shop Sivakasi fireworks & crackers online at wholesale prices. Check out our latest 2026 crackers catalog and price list with doorstep delivery.',
    url: 'https://mickeycrackers.com/quick-purchase',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sivakasi Crackers Price List | Mickey Crackers',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sivakasi Crackers Price List 2026 | Best Online Crackers Shop',
    description: 'Shop Sivakasi fireworks & crackers online at wholesale prices. Check out our latest 2026 crackers catalog and price list with doorstep delivery.',
    images: ['/og-image.png'],
  }
};

export default function Page() {
  return <QuickPurchaseClient />;
}
