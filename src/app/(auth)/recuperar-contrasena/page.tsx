import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  return (
    // Usando variables de tema para los fondos
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 relative">
      <Link
        replace
        href="/login"
        // Clases de texto actualizadas para el enlace
        className="absolute top-8 left-8 flex items-center text-muted-foreground hover:text-foreground"
      >
        <FaArrowLeft className="mr-2 h-4 w-4" />
        Volver al inicio de sesión
      </Link>

      {/* Contenedor del formulario ahora usa 'bg-card' */}
      <div className="w-full max-w-lg bg-card p-8 sm:p-12 rounded-xl shadow-lg">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
