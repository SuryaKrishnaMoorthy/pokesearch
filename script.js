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

  const showDetails = (pokemon) => {
    console.log(pokemon);
  };

  const addListItem = function (item) {
    if (validatePokemon(item)) pokemonList.push(item);
    const ul = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = item.name;
    button.classList.add("pokemon-list__item");
    listItem.appendChild(button);
    ul.appendChild(listItem);

    //Event listener for pokemon button
    button.addEventListener("click", () => showDetails(item));
  };

  const search = function (searchText) {
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return {
    getAll,
    addListItem,
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
  pokemonRepository.addListItem(item);
}

pokemonRepository
  .getAll()
  .forEach((item) => pokemonRepository.addListItem(item));

pokemonRepository.addListItem({
  name: "Pikachu",
  height: 1.4,
  type: ["electric"],
});
