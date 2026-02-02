import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// La función ahora se debe llamar 'proxy' (o ser export default)
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/pro', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard',
};
