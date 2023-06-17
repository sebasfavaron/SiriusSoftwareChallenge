export type Pokemon = {
  name: string;
  url: string;
};

export type ValidPokemonColumns = keyof Pokemon;
export const validPokemonColumns: ValidPokemonColumns[] = ['name', 'url'];
