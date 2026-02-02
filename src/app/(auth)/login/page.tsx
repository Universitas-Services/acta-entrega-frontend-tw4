import { LoginForm } from '@/components/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex w-full min-h-screen">
      {/* Panel Izquierdo (Azul) - Ahora usa 'bg-primary' */}
      <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground flex-col items-center justify-center p-12 text-center">
        <Image
          src="/LOGO BLANCO.png"
          alt="Universitas Legal Logo"
          width={250}
          height={250}
          className="mx-auto"
          priority
        />
      </div>

      {/* Panel Derecho (Formulario) y Layout Móvil */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 bg-white ">
        <div className="lg:hidden mb-8">
          <Image
            src="/LOGO_CON_BORDE.png" // Asegúrate de que esta imagen tenga el fondo transparente si es necesario
            alt="Universitas Legal Logo"
            width={250}
            height={250}
            priority
          />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
