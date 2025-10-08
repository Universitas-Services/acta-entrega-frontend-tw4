// src/components/Card.tsx
'use client';

import { useRouter } from 'next/navigation';
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

// ... (interfaz sin cambios)
interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  hashtag: string;
  href: string;
  pro?: boolean;
  gratis?: boolean; // 'gratis' se mapea a 'Express'
}

function CardComponent({
  icon,
  title,
  description,
  hashtag,
  href,
  pro = false,
  gratis = false,
}: CardProps) {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(href);
  };

  // Clases actualizadas para usar variables de tema
  const cardClasses =
    'bg-card rounded-2xl border hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer w-full max-w-sm h-64 flex flex-col';

  return (
    <ShadcnCard className={cardClasses} onClick={handleNavigation}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg bg-muted shadow-lg',
              gratis && 'bg-gris-card-express', // Si es gratis, usa el color dorado
              pro && 'bg-primary' // Si es pro, usa el color primario
            )}
          >
            {/* El ícono ya tiene color blanco en page.tsx, si no, se lo pones aquí */}
            {icon}
          </div>
          <div className="flex items-center gap-2">
            {pro && (
              <div className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                PRO
              </div>
            )}
            {/* Usando las nuevas variables para la insignia "Express" */}
            {gratis && (
              <div className="rounded-full bg-badge-express text-badge-express-foreground px-3 py-1 text-xs font-bold shadow-md">
                Express
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <div>
          <CardTitle className="mb-1 text-xl font-bold text-card-foreground">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="border-t pt-2">
          <p className="text-xs font-semibold text-primary">{hashtag}</p>
        </div>
      </CardContent>
    </ShadcnCard>
  );
}

export default CardComponent;
