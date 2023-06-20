import { useState } from 'react';
import { PokemonTable } from './components/PokemonTable';
import { usePokemonFull, usePokemons } from './usePokemons';

export default function ListView() {
  const [limit, setLimit] = useState<number>(3);
  const [offset, setOffset] = useState<number>(0);
  const { pokemonIds, pokemonIdsStatus } = usePokemons({
    limit,
    offset,
  });
  const { pokemonData, pokemonDataStatus } = usePokemonFull({
    names: pokemonIds?.results.map((p) => p.name) || [],
  });

  return (
    <div className='mt-2'>
      <button onClick={() => setLimit((limit) => limit + 3)}>More</button>
      <div>{`All (${pokemonIds?.count})`}</div>
      <div>
        <PokemonTable pokemon={pokemonData} pokemonStatus={pokemonDataStatus} />
      </div>
    </div>
  );
}
