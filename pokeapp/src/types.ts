export type Pokemon = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
};

export type SinglePokemon = {
  id: number;
  name: string;
  base_experience: number;
  abilities: Array<{
    is_hidden: boolean;
    slot: number;
    ability: {
      name: string;
      url: string;
    };
  }>;
  sprites: {
    front_default: string;
  };
  foundAt: string[];
};

type PokemonSpecies = {
  name: string;
  url: string;
};

export type EvolutionChain = {
  chain: {
    evolves_to: {
      evolves_to: {
        species: PokemonSpecies;
      }[];
      species: PokemonSpecies;
    }[];
    species: PokemonSpecies;
  };
};
