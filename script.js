const API_URL = "https://pokeapi.co/api/v2/pokemon";

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

const showModal = (title, details, img) => {
  const modalTitle = $(".modal-title");
  const modalBody = $(".modal-body");
  const modalHeader = $(".modal-header");
  modalTitle.empty();
  modalBody.empty();
  const name = $(
    `<h1>${title.slice(0, 1).toUpperCase() + title.slice(1)}</h1>`
  );
  modalTitle.append(name);

  /** Using loop to show more key value pairs if needed */
  Object.keys(details).forEach((detailKey) => {
    modalBody.append(
      `<p class="modal-details">${detailKey}: ${details[detailKey]}</p>`
    );
  });

  const modalImage = $(`<img class="modal-img" src=${img} alt=${title}}/>`);
  modalBody.append(modalImage);
};

let pokemonRepository = (() => {
  let pokemonList = [];

  const getAll = function () {
    return pokemonList;
  };

  const showLoadingMessage = () => {
    const loading = document.querySelector(".loading");

    const loadingMessage = document.createElement("p");
    loadingMessage.classList.add("pokemon-loading");
    loading.appendChild(loadingMessage);
    loadingMessage.innerText = "Loading...";
  };

  const hideLoadingMessage = () => {
    const loadingMessage = document.querySelector(".pokemon-loading");
    if (loadingMessage) {
      loadingMessage.parentNode.removeChild(loadingMessage);
    }
  };

  //Fetch single pokemon details
  const loadDetails = (pokemon) => {
    showLoadingMessage();
    return fetch(pokemon.detailsUrl)
      .then((res) => res.json())
      .then((result) => {
        hideLoadingMessage();
        pokemon.imageUrl = result.sprites.front_default;
        pokemon.height = result.height;
        pokemon.types = result.types;
        return pokemon;
      })
      .catch((err) => {
        hideLoadingMessage();
        console.log(err);
      });
  };
  const showDetails = (pokemon) => {
    loadDetails(pokemon).then(() => {
      const { name, imageUrl, height } = pokemon;
      showModal(name, { height: height }, imageUrl);
    });
  };

  // create a pokemon button and add to the button list
  const addListItem = function (item) {
    if (validatePokemon(item)) pokemonList.push(item);
    const ul = document.querySelector(".list-group");
    let listItem = document.createElement("li");
    listItem.classList.add("w-25");

    let button = document.createElement("button");
    button.innerText = item.name;
    button.classList.add("list-group-item", "list-group-item-action", "w-100");
    $("li").attr("data-toggle", "modal");
    $("li").attr("data-target", "#exampleModalCenter");
    listItem.appendChild(button);
    ul.appendChild(listItem);

    //Event listener for pokemon button
    button.addEventListener("click", () => {
      showDetails(item);
    });
  };

  // Api call to get pokemon data and add to the button list
  const loadList = () => {
    showLoadingMessage();
    return fetch(API_URL)
      .then((res) => {
        hideLoadingMessage();
        return res.json();
      })
      .then((json) =>
        json.results.forEach((item) =>
          addListItem({ name: item.name, detailsUrl: item.url })
        )
      )
      .catch((err) => {
        hideLoadingMessage();
        console.log(err);
      });
  };

  const search = function (searchText) {
    return (
      pokemonList.length &&
      pokemonList.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(searchText.toLowerCase());
      })
    );
  };

  return {
    getAll,
    addListItem,
    search,
    loadList,
    loadDetails,
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

/**Function calls */
pokemonRepository
  .loadList()
  .then(() =>
    pokemonRepository
      .getAll()
      .forEach((item) => pokemonRepository.addListItem(item))
  );

// pokemonRepository.addListItem({
//   name: "Pikachu",
//   height: 1.4,
//   type: ["electric"],
// });
