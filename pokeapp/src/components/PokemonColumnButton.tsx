import { ValidPokemonColumns } from '../types';

export const PokemonColumnButton = ({
  column,
  toggleColumn,
  columnIsToggled,
  className,
}: {
  column: ValidPokemonColumns;
  toggleColumn: (column: ValidPokemonColumns) => void;
  columnIsToggled: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={() => {
        toggleColumn(column);
      }}
      className={
        className +
        ` capitalize text-gray-800 font-bold py-1 px-2 rounded-full ${
          columnIsToggled
            ? 'bg-red-300 hover:bg-red-400'
            : 'bg-slate-100 hover:bg-slate-200'
        }`
      }
    >
      {column}
    </button>
  );
};
