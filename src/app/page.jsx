import React from 'react';
import HomePageClient from './HomePageClient';

export const metadata = {
  title: 'Mickey Crackers | Best Online Crackers Website & Sivakasi Crackers Shop',
  description: 'Mickey Crackers Sivakasi: The best online crackers website to buy premium quality fireworks at low cost. Purchase direct from our Sivakasi vedi kadai shop with safe, door-to-door shipping.',
  keywords: [
    'Mickey Crackers Sivakasi',
    'Buy Crackers Online',
    'Best Crackers Shop',
    'Online Crackers Website',
    'Low Cost Crackers',
    'Vedi Kadai',
    'Sivakasi Vedi Kadai Online',
    'Crackers Shop in Sivakasi',
    'Fireworks Online Shopping',
    'Wholesale Crackers Price List 2026',
    'Diwali Crackers Sivakasi',
    'Cheap Crackers Online',
    'Online Cracker Booking',
    'Best crackers shop near me'
  ],
  openGraph: {
    type: 'website',
    url: 'https://mickeycrackers.com',
    title: 'Mickey Crackers | Best Online Crackers Website & Sivakasi Crackers Shop',
    description: 'Welcome to Mickey Crackers, your best online crackers website. Order low cost, high quality green crackers directly from Sivakasi vedi kadai with doorstep shipping.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mickey Crackers Sivakasi Wholesale Fireworks Shop',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mickey Crackers | Best Online Crackers Website & Sivakasi Crackers Shop',
    description: 'Welcome to Mickey Crackers, your best online crackers website. Order low cost, high quality green crackers directly from Sivakasi vedi kadai with doorstep shipping.',
    images: ['/og-image.png'],
  }
};

export default function Page() {
  return <HomePageClient />;
}
