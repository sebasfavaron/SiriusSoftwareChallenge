import { useLocation } from 'react-router-dom';
import { PokemonCard } from './components/PokemonCard';
import { SinglePokemon } from './types';
import { useEvolutionChain } from './usePokemon';

export default function PokemonDetail() {
  const location = useLocation();
  const pokemon: SinglePokemon = location.state.pokemon;

  const { evolutionData, evolutionDataStatus } = useEvolutionChain({
    name: pokemon.name,
  });
  return (
    <div className='mt-2'>
      <PokemonCard
        className='w-96'
        singlePokemon={pokemon}
        evolutions={evolutionData}
      />
    </div>
  );
}
