// Validate a pokemon if it is and object and keys match with the format.

const validatePokemon = (pokemon) => {
  //Check if the pokemon is object

  if (
    typeof pokemon === "object" &&
    !Array.isArray(pokemon) &&
    pokemon !== null
  ) {
    // Check if the keys are the same as the format
    let format = ["name", "height", "type"];
    return format.every((val, i) => val === Object.keys(pokemon)[i]);
  }
  return false;
};

let pokemonRepository = (() => {
  let pokemonList = [
    {
      name: "Bulbasaur",
      height: 0.7,
      type: ["grass", "poison"],
    },
    {
      name: "Ivyasaur",
      height: 1,
      type: ["grass", "poison"],
    },
    {
      name: "Venuasaur",
      height: 2,
      type: ["grass", "poison"],
    },
  ];

  const getAll = function () {
    return pokemonList;
  };

  const add = function (item) {
    if (validatePokemon(item)) pokemonList.push(item);
  };

  const search = function (searchText) {
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return {
    getAll,
    add,
    search,
  };
})();

function createPokemon(item) {
  let pokemon = `<p class="pokemon">
  ${item.name} (height: ${item.height})
  </p>`;
  let tallestPokemon = `<p class="pokemon">
${item.name} (height: ${item.height})- <span class="pokemon__size">Wow, that's big</span>
</p>`;
  item.height < 2 ? document.write(pokemon) : document.write(tallestPokemon);
}

pokemonRepository.getAll().forEach(createPokemon);

pokemonRepository.add({
  name: "Pikachu",
  height: 1.4,
  type: ["electric"],
});

console.log(pokemonRepository.getAll());
