import React from 'react';
import { Link } from 'react-router-dom';
import { EvolutionChain, SinglePokemon } from '../types';

export const PokemonCard = ({
  singlePokemon,
  evolutions,
  className,
}: {
  singlePokemon: SinglePokemon;
  evolutions?: EvolutionChain;
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}) => {
  return (
    <Link
      to={`/pokemon/${singlePokemon.id}`}
      state={{ pokemon: singlePokemon }}
      className={`text-black no-underline`}
    >
      <div
        className={`${className} overflow-hidden border-[10px] border-solid border-yellow-200 shadow-md rounded-lg p-2 m-2 bg-orange-200`}
      >
        <h2 className='text-lg font-bold mb-2 capitalize mt-0'>
          {singlePokemon.name}
        </h2>
        <img
          className='w-32 h-32'
          src={singlePokemon.sprites.front_default}
          alt={singlePokemon.name}
        />
        <div className='p-2'>
          {Object.entries(singlePokemon).map(([key, value]) =>
            key !== 'abilities' && key !== 'sprites' ? (
              <div key={`pokemon-card-detail-${key}`}>{`${key}: ${value}`}</div>
            ) : null
          )}
        </div>
        {evolutions && (
          <div className='p-2'>
            <h4 className='mb-2'>Evolutions</h4>
            {`${evolutions.chain.species.name} -> ${evolutions.chain.evolves_to[0].species.name} -> ${evolutions.chain.evolves_to[0].evolves_to[0].species.name}`}
          </div>
        )}
      </div>
    </Link>
  );
};
