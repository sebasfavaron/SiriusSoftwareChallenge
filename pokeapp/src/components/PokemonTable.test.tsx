import { render, screen } from '@testing-library/react';
import { Pokemon } from '../types';
import { PokemonTable } from './PokemonTable';

describe('PokemonTable', () => {
  it('should display the correct amount of rows', () => {
    // Given
    const pokemon: Pokemon[] = [
      {
        name: 'John',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      },
      {
        name: 'Jane',
        url: 'https://pokeapi.co/api/v2/pokemon/2/',
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
