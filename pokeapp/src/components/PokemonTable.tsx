import { SinglePokemon } from '../types';
import { PokemonCard } from './PokemonCard';

export const PokemonTable = ({
  pokemon,
  pokemonStatus,
}: {
  pokemon?: SinglePokemon[];
  pokemonStatus: 'loading' | 'error' | 'success';
}) => {
  return (
    <div>
      {pokemonStatus === 'loading' && <div>Loading...</div>}
      {pokemonStatus === 'error' && <div>Error</div>}
      {pokemonStatus === 'success' && (
        <div className='flex flex-wrap'>
          {pokemon?.map((singlePokemon: SinglePokemon, i: number) => (
            <PokemonCard
              key={`pokemon-card-${i}`}
              className='w-64 h-80'
              singlePokemon={singlePokemon}
            />
          ))}
        </div>
      )}
    </div>
  );
};
