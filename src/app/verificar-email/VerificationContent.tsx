'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Verificando tu cuenta...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const verifyToken = async () => {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/confirm-email/${token}`;

          await axios.get(apiUrl);

          setStatus(
            '¡Tu cuenta ha sido verificada con éxito! Ya puedes iniciar sesión.'
          );
          setError(false);

          setTimeout(() => {
            router.push('/login');
          }, 5000);
        } catch (err) {
          setError(true);
          // Usamos el type guard de axios que no requiere la importación de AxiosError
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            setStatus(`Error: ${err.response.data.message}`);
          } else {
            setStatus(
              'Error: No se pudo verificar la cuenta. El enlace puede haber expirado o ser inválido.'
            );
          }
        }
      };

      verifyToken();
    } else {
      setStatus('Error: No se encontró un token de verificación en el enlace.');
      setError(true);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-g1">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-2xl font-bold text-g8">
          Verificación de Correo Electrónico
        </h1>
        <p className={`mt-4 text-lg ${error ? 'text-red6' : 'text-green6'}`}>
          {status}
        </p>
        {!error && (
          <p className="text-muted">Serás redirigido en 5 segundos...</p>
        )}
        <Link
          href="/login"
          className="inline-block px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring"
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
