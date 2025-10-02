import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Actas de Entrega',
  description: 'Gestión simplificada de Actas de Entrega',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={roboto.className}>
        {children}
        <div id="datepicker-portal"></div>
        <div id="timepicker-portal"></div>
      </body>
    </html>
  );
}
