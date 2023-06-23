import { useState } from 'react';
import { PokemonTable } from './components/PokemonTable';
import { usePokemon, usePokemonFull } from './usePokemon';

export default function ListView() {
  const [limit, setLimit] = useState<number>(3);
  const { pokemonIds, pokemonIdsStatus } = usePokemon({
    limit,
  });
  const { pokemonData, pokemonDataStatus } = usePokemonFull({
    names: pokemonIds?.results.map((p) => p.name) || [],
  });

  return (
    <div className='mt-2'>
      <button onClick={() => setLimit((limit) => limit + 3)}>More</button>
      <div>{`Showing ${limit} of ${pokemonIds?.count}`}</div>
      {pokemonIdsStatus === 'loading' && <div>Loading...</div>}
      {pokemonIdsStatus === 'error' && <div>Error</div>}
      {pokemonIdsStatus === 'success' && (
        <div>
          <PokemonTable
            pokemon={pokemonData}
            pokemonStatus={pokemonDataStatus}
          />
        </div>
      )}
    </div>
  );
}
