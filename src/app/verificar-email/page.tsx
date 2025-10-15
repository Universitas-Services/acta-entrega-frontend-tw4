import { Suspense } from 'react';
import VerificationContent from './VerificationContent';

// Componente simple para mostrar mientras carga el contenido dinámico
function LoadingFallback() {
  return <p>Cargando verificación...</p>;
}

export default function VerificarEmailPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<LoadingFallback />}>
        <VerificationContent />
      </Suspense>
    </div>
  );
}
