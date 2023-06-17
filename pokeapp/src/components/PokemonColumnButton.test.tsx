import { render, screen } from '@testing-library/react';
import { PokemonColumnButton } from './PokemonColumnButton';

describe('PokemonColumnButton', () => {
  it('should display the text sent as "column" prop', () => {
    // Given
    const column = 'name';

    // When
    render(
      <PokemonColumnButton
        column={column}
        columnIsToggled={true}
        toggleColumn={(_) => null}
      />
    );
    const button = screen.getByRole('button');

    // Then
    expect(button).toHaveTextContent(column);
  });

  it('should be red if toggled', () => {
    // Given
    const column = 'name';

    // When
    render(
      <PokemonColumnButton
        column={column}
        columnIsToggled={true}
        toggleColumn={(_) => null}
      />
    );
    const button = screen.getByRole('button');

    // Then
    expect(button).toHaveClass('bg-red-300');
  });

  it('should be grey if not toggled', () => {
    // Given
    const column = 'name';

    // When
    render(
      <PokemonColumnButton
        column={column}
        columnIsToggled={false}
        toggleColumn={(_) => null}
      />
    );
    const button = screen.getByRole('button');

    // Then
    expect(button).toHaveClass('bg-slate-100');
  });
});
