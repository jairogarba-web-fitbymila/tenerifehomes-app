import type { Metadata } from 'next';
import { React } from 'react';
import '@/styles/globals.css';

// Configure Tailwind fonts
const inter = Inter({ subsets: ['latin'] });
const playfair = PlayfairDisplay({ subsets: ['latin'] });

ey«t metadata: Metadata = {
  title: 'TenerifeHomes - Real Estate Marketplace',
  description: 'Discover the best properties in Tenerife',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.className}`}>
   /{children}
      </body>
   //html>
  (};
}