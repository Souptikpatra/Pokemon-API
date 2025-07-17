const url = "https://pokeapi.co/api/v2/pokemon/";
const url_spec = "https://pokeapi.co/api/v2/pokemon-species/"
const button = document.getElementById("button");

const typesColor = {
    water: "#6493EB",
    grass: "#74CB48",
    fire: "#F57D31",
    bug: "#A7B723",
    dark: "#75574C",
    electric: "#F9CF30",
    ghost: "#70559B",
    normal: "#AAA67F",
    poison: "#A43E9E",
    psychic: "#FB5584",
    steel: "#B7B9D0",
    dragon: "#7037FF",
    fairy: "#E69EAC",
    fighting: "#C12239",
    flying: "#A891EC",
    ground: "#DEC16B",
    ice: "#9AD6DF",
    rock: "#B69E31"
}

let id;
let name = "";
let height;
let weight;
let imURL = "";
let abilities = [];
let stat = []; // 0 -> HP | 1 -> ATK | 2 -> DEF | 3 -> SPD
let moves = [];
let type = [];
let color = "";
let flavourText = ""

handleButton(); // initial render

button.addEventListener('click', () => {
    handleButton();
})

// ------------------------Internal functions start -----------------------------------------------------------------

async function handleButton() {
    id = Math.floor(Math.random() * 1025) + 1; // get random id
    console.log(id);
    await getPokemon();
    await getPokemonSpecie();
    changeDOM();
}

async function getPokemon() {
    try {
        const response = await fetch(url + `${id}`);
        const data = await response.json();
        console.log(data)
        setPokemon(data);
    }
    catch (err) {
        console.log("something went wrong");
    }
}

async function getPokemonSpecie() {
    try {
        const response = await fetch(url_spec + `${id}`);
        const data = await response.json();
        setPokemonSpecie(data);
    }
    catch (err) {
        console.log("somethig went wrong : " + err.message);

    }
}

function setPokemon(data) {
    // setting all the data
    name = data.name; // set name
    height = data.height; // set height
    weight = data.weight; // set weight
    imURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    let rawAbilities = data.abilities; // set ability
    for (let i = 0; i < rawAbilities.length; i++) { // filtering ability
        abilities[i] = rawAbilities[i].ability.name;
    }
    let rawStat = data.stats; // setting stats % 
    stat[0] = rawStat[0].base_stat;
    stat[1] = rawStat[1].base_stat;
    stat[2] = rawStat[2].base_stat;
    stat[3] = rawStat[5].base_stat;

    let rawMoves = data.moves; // setting moves
    for (let i = 0; i < 5; i++) {
        moves[i] = rawMoves[i].move.name;
    }

    let rawType = data.types; // setting type
    for (let i = 0; i < rawType.length; i++) {
        type[i] = rawType[i].type.name;
    }

}

function setPokemonSpecie(data) {
    color = data.color.name; // set colour

    for (let i = 0; i < data.flavor_text_entries.length; i++) {
        const entry = data.flavor_text_entries[i];

        if (entry.language.name === "en") {
            let text = entry.flavor_text.replace(/\n|\f/g, " "); // clean up line breaks and form feeds
            if (text.length > 10 && text.length < 100) { // avoid broken short text
                flavourText = text;
                break; // exit the loop after finding the first good one
            }
        }
    }
}


// ---------------------------------------Internal Function End ---------------------------------------------------

// -----------------------------DOM manupulation Start -------------------------------------

function changeDOM() {
    // set name
    let name_DOM = document.getElementById("name");
    name_DOM.textContent = name;

    // set id
    let id_DOM = document.getElementById("id");
    id_DOM.textContent = "#" + id;

    // set image
    let img_DOM = document.getElementById("img").children[0];
    img_DOM.src = imURL;

    // set types

    let pokemon_type = document.getElementById("pokemon-type"); // get parent
    pokemon_type.innerHTML = ""; // clear previous childs

    for (let i = 0; i < type.length; i++) {
        let typeElement = document.createElement("p");
        typeElement.textContent = type[i];
        typeElement.setAttribute("class", "type libertinus-math-regular");
        typeElement.style.backgroundColor = typesColor[type[i]];
        pokemon_type.appendChild(typeElement)
    }

    // set weight
    let weight_parent = document.getElementById("weight");
    weight_parent.innerHTML = ""; // clear previous child
    let weight_DOM = document.createElement("p");
    weight_DOM.textContent = weight;
    weight_parent.appendChild(weight_DOM);

    // set height
    let height_parent = document.getElementById("height");
    height_parent.innerHTML = ""; // clear previous child
    let height_DOM = document.createElement("p");
    height_DOM.textContent = height;
    height_parent.appendChild(height_DOM);

    // set moves
    let moves_parent = document.getElementById("moves"); // get parent
    moves_parent.innerHTML = ""; // clear previous childs

    for (let i = 0; i < moves.length; i++) {
        let moveElement = document.createElement("p");
        moveElement.textContent = moves[i];
        moveElement.setAttribute("style", "margin: 0px");
        moves_parent.appendChild(moveElement)
    }

    // set flavour text
    let flavorText_parent = document.getElementById("flavour-text");
    flavorText_parent.textContent = flavourText;

    // set states

    let HP_percent = Math.floor((stat[0] / 255) * 100);
    let ATK_percent = Math.floor((stat[1] / 255) * 100);
    let DEF_percent = Math.floor((stat[2] / 255) * 100);
    let SPD_percent = Math.floor((stat[3] / 255) * 100);

    // set HP bar
    document.getElementById("HP-text").textContent = HP_percent;
    let HP_bar = document.getElementById("HP-bar");
    HP_bar.style.width = HP_percent + "%";

    // set ATK bar
    document.getElementById("ATK-text").textContent = ATK_percent;
    let ATK_bar = document.getElementById("ATK-bar");
    ATK_bar.style.width = ATK_percent + "%";

    // set DEF bar

    document.getElementById("DEF-text").textContent = DEF_percent;
    let DEF_bar = document.getElementById("DEF-bar");
    DEF_bar.style.width = DEF_percent + "%";

    // set SPD bar

    document.getElementById("SPD-text").textContent = SPD_percent;
    let SPD_bar = document.getElementById("SPD-bar");
    SPD_bar.style.width = SPD_percent + "%";

    // set container color
    if(color === "black"){ // if color is black then change the color of name and id to white
        name_DOM.style.color = "white";
        id_DOM.style.color = "white";
    }
    document.getElementById("container").style.backgroundColor = color;

}