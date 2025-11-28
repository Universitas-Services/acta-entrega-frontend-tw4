import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { GlobalSpinner } from '@/components/GlobalSpinner';
import { GlobalLoaderHandler } from '@/components/GlobalLoaderHandler';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Actas de Entrega',
  description: 'Gestión simplificada de Actas de Entrega',
};

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover', // Esto es clave para el safe area
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={roboto.className}>
        {/* Lógica automática para apagar el loader al terminar de navegar */}
        <GlobalLoaderHandler />

        {/* La cortina visual que aparecerá cuando lo activemos */}
        <GlobalSpinner />

        {children}

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
