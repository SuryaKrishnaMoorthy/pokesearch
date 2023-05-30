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

for (let i = 0; i < pokemonList.length; i++) {
  let pokemon = `<p class="pokemon">
${pokemonList[i].name} (height: ${pokemonList[i].height})
</p>`;

  let tallestPokemon = `<p class="pokemon">
${pokemonList[i].name} (height: ${pokemonList[i].height})- <span class="pokemon__size">Wow, that's big</span>
</p>`;

  pokemonList[i].height < 2
    ? document.write(pokemon)
    : document.write(tallestPokemon);
}
