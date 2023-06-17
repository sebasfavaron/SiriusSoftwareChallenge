import { useQuery } from '@tanstack/react-query';
import { ValidPokemonColumns } from './types';

type PokemonResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
};

export const usePokemons = ({
  limit,
  offset,
  selectedColumns,
}: {
  limit?: number;
  offset?: number;
  selectedColumns?: Array<ValidPokemonColumns>;
}) => {
  const { data: pokemonData, status: pokemonStatus } =
    useQuery<PokemonResponse>({
      queryKey: ['pokemon', limit, offset, selectedColumns],
      queryFn: async () => {
        const paramsObj: { [key: string]: string } = {};
        if (limit !== undefined) {
          paramsObj['limit'] = limit.toString();
        }
        if (offset !== undefined) {
          paramsObj['offset'] = offset.toString();
        }
        if (selectedColumns && selectedColumns.length > 0) {
          paramsObj['selectedColumns'] = selectedColumns.join(';');
        }

        const response = await fetch(
          `${process.env.REACT_APP_POKE_API_URL}/pokemon?${new URLSearchParams(
            paramsObj
          )}`
        );

        return response.json();
      },
      keepPreviousData: true,
    });

  return { pokemonData, pokemonStatus };
};
