import { Poppins, Roboto, Inter } from 'next/font/google';

export const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
