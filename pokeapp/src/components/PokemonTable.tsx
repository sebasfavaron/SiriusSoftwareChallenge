import { Pokemon } from '../types';

export const PokemonTable = ({
  pokemon,
  pokemonStatus,
}: {
  pokemon?: Pokemon[];
  pokemonStatus: 'loading' | 'error' | 'success';
}) => {
  return (
    <div>
      {pokemonStatus === 'loading' && <div>Loading...</div>}
      {pokemonStatus === 'error' && <div>Error</div>}
      {pokemonStatus === 'success' && (
        <table>
          <thead></thead>
          <tbody>
            {pokemon?.map((c: Pokemon, i: number) => (
              <tr key={`listview-tr-${i}`}>
                {Object.values(c).map((v, i) => (
                  <td key={`listview-td-${i}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
