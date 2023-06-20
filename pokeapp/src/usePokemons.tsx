import { useQuery } from '@tanstack/react-query';
import { EvolutionChain, Pokemon, SinglePokemon } from './types';

export const usePokemons = ({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) => {
  const { data: pokemonIds, status: pokemonIdsStatus } = useQuery<Pokemon>({
    queryKey: ['pokemon', limit, offset],
    queryFn: async () => {
      const paramsObj: { [key: string]: string } = {};
      if (limit !== undefined) {
        paramsObj['limit'] = limit.toString();
      }
      if (offset !== undefined) {
        paramsObj['offset'] = offset.toString();
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

  return { pokemonIds, pokemonIdsStatus };
};

const formatLocationArea = (locationArea: string) => {
  return locationArea
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};

export const usePokemonFull = ({ names }: { names: string[] }) => {
  const { data: pokemonData, status: pokemonDataStatus } = useQuery<
    SinglePokemon[]
  >({
    queryKey: ['pokemon', names],
    queryFn: async () => {
      const paramsObj: { [key: string]: string } = {};
      console.log(`${names} I choose you!!!!!!!!!!!!!!`);

      const pokemonDataFetches = names.map(async (name) => {
        const mainDataResponse = await fetch(
          `${
            process.env.REACT_APP_POKE_API_URL
          }/pokemon/${name}?${new URLSearchParams(paramsObj)}`
        );
        const mainDataResponseJson = await mainDataResponse.json();

        const extraDataResponse = await fetch(
          `${
            process.env.REACT_APP_POKE_API_URL
          }/pokemon/${name}/encounters?${new URLSearchParams(paramsObj)}`
        );
        const extraDataResponseJson = await extraDataResponse.json();

        return {
          id: mainDataResponseJson.id,
          name: mainDataResponseJson.name,
          base_experience: mainDataResponseJson.base_experience,
          abilities: mainDataResponseJson.abilities,
          sprites: mainDataResponseJson.sprites,
          foundAt: extraDataResponseJson.map(
            (d: { location_area: { name: string } }) =>
              formatLocationArea(d.location_area.name)
          ),
        };
      });
      const pokemonFullData = await Promise.all(pokemonDataFetches);

      return pokemonFullData;
    },
    keepPreviousData: true,
    enabled: names.length > 0,
  });

  return { pokemonData, pokemonDataStatus };
};

export const useEvolutionChain = ({ name }: { name: string }) => {
  const { data: evolutionData, status: evolutionDataStatus } =
    useQuery<EvolutionChain>({
      queryKey: ['evolution', name],
      queryFn: async () => {
        const speciesResponse = await fetch(
          `${process.env.REACT_APP_POKE_API_URL}/pokemon-species/${name}`
        );
        const speciesResponseJson = await speciesResponse.json();
        const evolutionChainUrl = speciesResponseJson.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionResponseJson =
          (await evolutionResponse.json()) as EvolutionChain;

        return {
          chain: {
            species: evolutionResponseJson.chain.species,
            evolves_to: evolutionResponseJson.chain.evolves_to.map(
              (evolvesTo) => ({
                species: evolvesTo.species,
                evolves_to: evolvesTo.evolves_to.map((evolvesTo) => ({
                  species: evolvesTo.species,
                })),
              })
            ),
          },
        };
      },
      keepPreviousData: true,
    });

  return { evolutionData, evolutionDataStatus };
};
