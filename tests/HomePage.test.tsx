import { render } from '@testing-library/react';
import Page from '../src/app/page';
import { useRouter } from 'next/navigation';

// --- PASO 1: MOCK (SIMULACIÓN) DE NEXT/NAVIGATION ---
// Le decimos a Jest que intercepte cualquier importación de 'next/navigation'
// y la reemplace con nuestra implementación falsa.
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(), // Simulamos el hook useRouter
}));

describe('Home Page', () => {
  it('should redirect to the /dashboard page', () => {
    // --- PASO 2: PREPARACIÓN DEL MOCK (Arrange) ---
    // Creamos una función espía para el método 'replace'.
    // Esto nos permitirá comprobar si fue llamada.
    const mockReplace = jest.fn();

    // Hacemos que nuestro useRouter simulado devuelva un objeto
    // que contiene nuestra función espía 'replace'.
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    // --- PASO 3: RENDERIZAR EL COMPONENTE (Act) ---
    // Renderizamos el componente. Ahora, cuando llame a useRouter(),
    // obtendrá nuestro objeto falso con el 'replace' espía.
    render(<Page />);

    // --- PASO 4: VERIFICAR EL COMPORTAMIENTO (Assert) ---
    // Verificamos que la función de redirección fue llamada exactamente una vez.
    expect(mockReplace).toHaveBeenCalledTimes(1);

    // Verificamos que fue llamada con el argumento correcto.
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
