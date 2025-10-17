import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    // Usando variables de tema para los fondos
    <div className="h-screen overflow-y-auto">
      <div
        className="md:min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-y-auto 
                 px-4 pt-8 pb-[calc(4rem+env(safe-area-inset-bottom))] 
                 md:p-8"
      >
        <div className="w-full max-w-lg bg-card text-card-foreground p-6 sm:p-10 rounded-xl shadow-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
