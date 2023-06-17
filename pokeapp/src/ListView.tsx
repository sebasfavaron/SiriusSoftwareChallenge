import { useState } from 'react';
import { PokemonColumnButton } from './components/PokemonColumnButton';
import { PokemonTable } from './components/PokemonTable';
import { ValidPokemonColumns, validPokemonColumns } from './types';
import { usePokemons } from './usePokemons';

export default function ListView() {
  const [selectedColumns, setSelectedColumns] = useState<
    Array<ValidPokemonColumns>
  >([]);
  const [limit, setLimit] = useState<number>(3);
  const [offset, setOffset] = useState<number>(0);
  const { pokemonData, pokemonStatus } = usePokemons({
    selectedColumns,
    limit,
    offset,
  });

  const toggleColumn = (column: ValidPokemonColumns) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns((selectedColumns) =>
        selectedColumns.filter((c) => c !== column)
      );
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div className='mt-2'>
      <button onClick={() => setLimit((limit) => limit + 3)}>More</button>
      <div>{`All (${pokemonData?.count})`}</div>
      {validPokemonColumns.map((c) => (
        <PokemonColumnButton
          className='mr-2 mb-2'
          key={`pokemon-column-button-${c}`}
          column={c}
          toggleColumn={toggleColumn}
          columnIsToggled={selectedColumns.includes(c)}
        />
      ))}
      <button
        onClick={() => setSelectedColumns([])}
        className='text-gray-800 font-bold py-1 px-2 rounded-full bg-slate-100 hover:bg-slate-200'
      >
        Clear All Filters
      </button>
      <div>
        <PokemonTable
          pokemon={pokemonData?.results}
          pokemonStatus={pokemonStatus}
        />
      </div>
    </div>
  );
}
