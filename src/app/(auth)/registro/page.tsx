import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    // Usando variables de tema para los fondos
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg bg-card text-card-foreground p-6 sm:p-10 rounded-xl shadow-md">
        <RegisterForm />
      </div>
    </div>
  );
}
