import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Tu adición es una buena práctica
import Page from '../src/app/page'; // La ruta correcta desde 'src/tests'

describe('Home Page', () => {
  it('should render the introductory text', () => {
    // 1. Arrange
    render(<Page />);

    // 2. Act
    // CAMBIO CLAVE: Usamos getByText en lugar de getByRole('heading').
    // Esta consulta es más flexible y busca el texto sin importar la etiqueta.
    const introText = screen.getByText(/Get started by editing/i);

    // 3. Assert
    // La aserción sigue siendo la misma y ahora debería pasar.
    expect(introText).toBeInTheDocument();
  });
});
