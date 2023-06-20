import { render, screen } from '@testing-library/react';
import { SinglePokemon } from '../types';
import { PokemonTable } from './PokemonTable';

describe('PokemonTable', () => {
  it('should display the correct amount of rows', () => {
    // Given
    const pokemon: SinglePokemon[] = [
      {
        name: 'John',
        id: 1,
        base_experience: 1,
        abilities: [],
        sprites: {
          front_default: '',
        },
        foundAt: [],
      },
      {
        name: 'Jane',
        id: 2,
        base_experience: 2,
        abilities: [],
        sprites: {
          front_default: '',
        },
        foundAt: [],
      },
    ];

    // When
    render(<PokemonTable pokemon={pokemon} pokemonStatus='success' />);
    const rows = screen.getAllByRole('row');

    // Then
    rows.forEach((row) => {
      expect(row).toBeInTheDocument();
    });
    expect(rows.length).toEqual(pokemon.length);
  });

  it('should display loading state if status passed is "loading"', () => {
    // When
    render(<PokemonTable pokemon={[]} pokemonStatus='loading' />);
    const loading = screen.getByText('Loading...');

    // Then
    expect(loading).toBeInTheDocument();
  });

  it('should display error state if status passed is "error"', () => {
    // When
    render(<PokemonTable pokemon={[]} pokemonStatus='error' />);
    const loading = screen.getByText('Error');

    // Then
    expect(loading).toBeInTheDocument();
  });
});
