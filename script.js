const API_URL = "https://pokeapi.co/api/v2/pokemon";
const modalContainer = document.querySelector(".modal-container");
const isHidden = modalContainer.classList.contains("hidden");

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

const hideModal = () => {
  modalContainer.classList.add("hidden");
};

const showModal = (title, details, img) => {
  modalContainer.innerHTML = null;
  if (isHidden) {
    modalContainer.classList.remove("hidden");
  }

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.innerText = "X";
  closeBtn.addEventListener("click", () => hideModal());

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const modalTitle = document.createElement("h1");
  modalTitle.classList.add("modal-title");
  modalTitle.innerText = title.slice(0, 1).toUpperCase() + title.slice(1);

  /** Using loop to show more key value pairs if needed */
  let modalDetails = null;
  Object.keys(details).forEach((detailKey) => {
    modalDetails = document.createElement("p");
    modalDetails.classList.add("modal-details");
    modalDetails.innerText = `${detailKey}: ${details[detailKey]}`;
  });

  const modalImage = document.createElement("img");
  modalImage.classList.add("modal-image");
  modalImage.src = img;
  modalImage.alt = `${title}`;

  modal.appendChild(closeBtn);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalDetails);
  modalContent.appendChild(modalImage);
  modal.appendChild(modalContent);
  modalContainer.appendChild(modal);

  // Hide modal if clicked on backdrop
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) hideModal();
  });
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
    const ul = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = item.name;
    button.classList.add("pokemon-list__item");
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
// Make sure list is rendered after yove gotten all info from the server
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
