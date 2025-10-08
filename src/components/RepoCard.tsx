import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RepoCardProps {
  imageUrl: string;
  description: string;
  buttonText: string;
  linkHref: string;
  isGratis?: boolean;
  priority?: boolean;
}

export function RepoCard({
  imageUrl,
  description,
  buttonText,
  linkHref,
  isGratis = false,
  priority = false,
}: RepoCardProps) {
  return (
    // Se usan las variables del tema: bg-card y border-border
    <Card className="flex flex-col overflow-hidden rounded-xl border border-border shadow-md transition-all hover:shadow-lg p-4 bg-card">
      <div className="relative w-full aspect-video mb-4">
        {isGratis && (
          // Se usa un verde estándar de Tailwind que combina bien
          <div className="absolute top-3 right-3 z-10 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            GRATIS
          </div>
        )}
        <Image
          src={imageUrl}
          alt={description}
          fill
          className="rounded-xl object-cover"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* La línea separadora ahora usa el color primario del tema */}
      <div className="w-full h-[2px] bg-primary mb-4 rounded-full" />

      <CardContent className="flex flex-1 flex-col p-0">
        {/* El texto de la descripción usa el color muted-foreground */}
        <p className="flex-grow text-sm text-muted-foreground text-center">
          {description}
        </p>
        <div className="mt-4 flex justify-center">
          <Button
            asChild
            className="bg-button-gold hover:bg-button-gold/90 text-primary-blue font-semibold w-full max-w-[200px] text-base h-11"
          >
            <Link href={linkHref} target="_blank" rel="noopener noreferrer">
              {buttonText}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
