import './globals.css';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";

const lato = Lato({ 
  weight: ['400', '700'],
  subsets: ['latin'] 
});

export const metadata: Metadata = {
  title: 'Product Store',
  description: 'Browse our collection of products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lato.className} bg-black text-white`}>
        <div className="max-w-md mx-auto min-h-screen">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}