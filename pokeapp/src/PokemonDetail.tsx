import { useLocation } from 'react-router-dom';
import { PokemonCard } from './components/PokemonTable';
import { SinglePokemon } from './types';
import { useEvolutionChain } from './usePokemons';

export default function PokemonDetail() {
  const location = useLocation();
  const pokemon: SinglePokemon = location.state.pokemon;

  const { evolutionData, evolutionDataStatus } = useEvolutionChain({
    name: pokemon.name,
  });
  return (
    <div className='mt-2'>
      <PokemonCard singlePokemon={pokemon} evolutions={evolutionData} />
    </div>
  );
}
