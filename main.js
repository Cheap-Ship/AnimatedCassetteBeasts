// Handling error if the pokemon list is not loaded
try { pokemon_list } catch {
    console.error("pokemon_list is not defined (pokemon.js probably wasnt't built)")
    pokemon_list = [];
}



// Elements
const main = document.getElementById("main");
const legendContainer = document.getElementById("legend-container");
const legend = document.getElementById("legend");
const number = document.getElementById("number");
const name = document.getElementById("name");
const type1 = document.getElementById("type1");
const type2 = document.getElementById("type2");
const legendSeparator = document.getElementById("legend-separator");
const typeSeparator = document.getElementById("type-separator");
const sprite = document.getElementById("sprite");
const info = document.getElementById("info");
const infoTimer = document.getElementById("info-timer");
const debug = document.getElementById("debug");



// Properties
let allowstaticartworks = false;
let allowstaticgen5sprites = false;
let allowstaticgen8sprites = false;
let allowalternateforms = true;
let automaticpokemonswitching = true;
let backgroundtype = "lineargradient";
let gradientangle = 135;
let whitelistedpokemon = [];
let blacklistedpokemon = [];
let pokemonswitchingtimer = 300;
let schemecolor = [255, 255, 0];
let backgroundcolor = [127, 127, 127];
let customtypecolor = true;
let enabletextshadow = true;
let shadowcolor = [0, 0, 0];
let textcolor = [255, 255, 255];
let displaydetailedinfo = false;
let displaylegend = true;



let update_interval_number = 0;
let info_interval_number = 0;
let last_update_time;
let current_pokemon = null;
let pokemon_list_filtered = [];



const type_colors = {
    "normal": "A8A77A",
    "fire": "EE8130",
    "water": "6390F0",
    "electric": "F7D02C",
    "grass": "7AC74C",
    "ice": "96D9D6",
    "fighting": "C22E28",
    "poison": "A33EA1",
    "ground": "E2BF65",
    "flying": "A98FF3",
    "psychic": "F95587",
    "bug": "A6B91A",
    "rock": "B6A136",
    "ghost": "735797",
    "dragon": "6F35FC",
    "dark": "705746",
    "steel": "B7B7CE",
    "fairy": "D685AD"
};

const substitute = { "id": 0, "entry": 0, "name": "substitute", "form_name": "substitute", "type1": "normal", "type2": null, "has_female": false, "has_shiny": false, "sprite_type": "none", "sprites": { "front_default": null, "front_shiny": null, "front_female": null, "front_shiny_female": null } };
const substitute_base64 = "iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAAIVBMVEUAAAAAAABKYzpSUkp7jFqUpWulvYS9vbW91pzWzsX////yT6gnAAAAAXRSTlMAQObYZgAAATtJREFUWMPtlE1qAkEQhduJB7B0EOJKJ50h5AABl3YewQPI4HYmzsMreIDIbBMEaZeBEKZOmY0HqCzc9Qe9649+9UM7l0gkEonEzcD1WBly7obd3C5krN1TN7ILJYD9sbEnQluRrM3318dtt5uQ1iLePvZdJ3yhNdN62x3fSVqFjBWv2DJltchVsTU2yz2kYvvDjU0YwAMyflYg2IrIAwCEb2Dl7E8AMAuZBA8AhVUom0kAEOhhq7qkP8cTpqyNQlbrRfU05S43CjO9qPY5kS9sRcx6VdVPH2AT7rRXVT0BCKZMD5deVWPhjUL2Gn+1jwUbj2CZhMfyHGNBskGwNLbAMh6+SHLjLaMbwK/i4bEgW3gvltULuD+PUbbAQmzbHRaSw9oj5wYizgkCVvKP39WJyMglEolEInEz/gCH72C9Catf4wAAAABJRU5ErkJggg=="









// Wallpaper Engine Properties
window.wallpaperPropertyListener = {
    applyUserProperties: update_properties
};










function update_properties(properties = {}) {
    // don't change the timer and update the pokemon if the display detailed info is toggled
    if (!properties.displaydetailedinfo)
        clearInterval(update_interval_number);

    if (properties.allowalternateforms) {
        allowalternateforms = properties.allowalternateforms.value;

        if (!allowalternateforms && current_pokemon.id >= 10000) {
            update(true);
        }
    }
    if (properties.allowstaticartworks) {
        allowstaticartworks = properties.allowstaticartworks.value;

        if (!allowstaticartworks && current_pokemon.sprite_type == "artwork") {
            update(true);
        }
    }
    if (properties.allowstaticgen5sprites) {
        allowstaticgen5sprites = properties.allowstaticgen5sprites.value;

        if (!allowstaticgen5sprites && current_pokemon.sprite_type == "gen5") {
            update(true);
        }
    }
    if (properties.allowstaticgen8sprites) {
        allowstaticgen8sprites = properties.allowstaticgen8sprites.value;

        if (!allowstaticgen8sprites && current_pokemon.sprite_type == "gen8") {
            update(true);
        }
    }
    if (properties.automaticpokemonswitching) {
        automaticpokemonswitching = properties.automaticpokemonswitching.value;
    }
    if (properties.backgroundtype) {
        backgroundtype = properties.backgroundtype.value;
    }
    if (properties.gradientangle) {
        gradientangle = properties.gradientangle.value;
    }
    if (properties.whitelistedpokemon) {
        try {
            if (properties.whitelistedpokemon.value === "")
                whitelistedpokemon = [];
            else
                whitelistedpokemon = properties.whitelistedpokemon.value.split(",").map((value) => {
                    return parseInt(value) || value.trim();
                });
        } catch (e) {
            whitelistedpokemon = [];
        }

        // Update if not in the whitelist
        if (whitelistedpokemon.length > 0 && (!(whitelistedpokemon.includes(current_pokemon.id) || whitelistedpokemon.includes(current_pokemon.name) || whitelistedpokemon.includes(current_pokemon.form_name)))) {
            update(true);
        }
    }
    if (properties.blacklistedpokemon) {
        try {
            if (properties.blacklistedpokemon.value == "")
                blacklistedpokemon = [];
            else
                blacklistedpokemon = properties.blacklistedpokemon.value.split(",").map((value) => {
                    return parseInt(value) || value.trim();
                });
        } catch (e) {
            blacklistedpokemon = [];
        }

        // Update if in the blacklist
        if (blacklistedpokemon.includes(current_pokemon.id) || blacklistedpokemon.includes(current_pokemon.name) || blacklistedpokemon.includes(current_pokemon.form_name)) {
            update(true);
        }
    }
    if (properties.pokemonswitchingtimer) {
        pokemonswitchingtimer = properties.pokemonswitchingtimer.value;
    }
    if (properties.schemecolor) {
        // convert "0.0 0.0 0.0" to [r, g, b]
        schemecolor = properties.schemecolor.value.split(" ").map((number) => {
            return parseInt(number * 255);
        });
    }
    if (properties.backgroundcolor) {
        // convert "0.0 0.0 0.0" to [r, g, b]
        backgroundcolor = properties.backgroundcolor.value.split(" ").map((number) => {
            return parseInt(number * 255);
        });
    }
    if (properties.textcolor) {
        // convert "0.0 0.0 0.0" to [r, g, b]
        textcolor = properties.textcolor.value.split(" ").map((number) => {
            return parseInt(number * 255);
        });
    }
    if (properties.shadowcolor) {
        // convert "0.0 0.0 0.0" to [r, g, b]
        shadowcolor = properties.shadowcolor.value.split(" ").map((number) => {
            return parseInt(number * 255);
        });
    }
    if (properties.customtypecolor) {
        customtypecolor = properties.customtypecolor.value;
    }
    if (properties.enabletextshadow) {
        enabletextshadow = properties.enabletextshadow.value;
    }
    if (properties.displaydetailedinfo) {
        displaydetailedinfo = properties.displaydetailedinfo.value;

        if (displaydetailedinfo) {
            debug.style.display = "block";

            update_info();
            update_info_timer();
            info_interval_number = setInterval(update_info_timer, 10);
        } else {
            debug.style.display = "none";

            clearInterval(info_interval_number);
        }
    }
    if (properties.displaylegend) {
        displaylegend = properties.displaylegend.value;
    }



    if (automaticpokemonswitching && !properties.displaydetailedinfo) {
        update_interval_number = setInterval(() => {
            update(true);
        }, 1000 * pokemonswitchingtimer);
    }


    if (!properties.displaydetailedinfo)
        update(current_pokemon.id === 0);
}










function filter_pokemon_list() {
    pokemon_list_filtered = pokemon_list.filter(pokemon => {
        return !(
            (pokemon.sprite_type == "gen5" && !allowstaticgen5sprites) ||
            (pokemon.sprite_type == "gen8" && !allowstaticgen8sprites) ||
            (pokemon.sprite_type == "artwork" && !allowstaticartworks) ||
            (pokemon.id >= 10000 && !allowalternateforms) ||
            (blacklistedpokemon.length > 0 && (blacklistedpokemon.includes(pokemon.id) || blacklistedpokemon.includes(pokemon.entry) || blacklistedpokemon.includes(pokemon.name) || blacklistedpokemon.includes(pokemon.form_name))) ||
            (whitelistedpokemon.length > 0 && !(whitelistedpokemon.includes(pokemon.id) || whitelistedpokemon.includes(pokemon.entry) || whitelistedpokemon.includes(pokemon.name) || whitelistedpokemon.includes(pokemon.form_name)))
        );
    });
}










function randomize_pokemon() {
    if (pokemon_list_filtered.length > 0) {
        current_pokemon = pokemon_list_filtered[Math.floor(Math.random() * pokemon_list_filtered.length)];
    } else {
        current_pokemon = substitute;
    }
}










function update_background() {
    let type1_color = type_colors[current_pokemon.type1];
    let type2_color = type_colors[current_pokemon.type2];

    // convert hex to [r, g, b]
    type1_color = type1_color.match(/.{1,2}/g).map((number) => {
        return parseInt(number, 16);
    });

    if (type2_color) {
        type2_color = type2_color.match(/.{1,2}/g).map((number) => {
            return parseInt(number, 16);
        });
    }

    if (backgroundtype == "lineargradient") {
        type2_color = type2_color || backgroundcolor;

        main.style.background = `linear-gradient(${gradientangle}deg, rgb(${type1_color[0]}, ${type1_color[1]}, ${type1_color[2]}), rgb(${type2_color[0]}, ${type2_color[1]}, ${type2_color[2]}))`;
    } else if (backgroundtype == "radialgradient") {
        type2_color = type2_color || backgroundcolor;

        main.style.background = `radial-gradient(circle, rgb(${type1_color[0]}, ${type1_color[1]}, ${type1_color[2]}), rgb(${type2_color[0]}, ${type2_color[1]}, ${type2_color[2]}))`;
    } else if (backgroundtype == "mixtypes") {
        type2_color = type2_color || type1_color;

        // mix the colors of the types
        let mixed_color = [
            Math.floor((type1_color[0] + type2_color[0]) / 2),
            Math.floor((type1_color[1] + type2_color[1]) / 2),
            Math.floor((type1_color[2] + type2_color[2]) / 2)
        ];

        main.style.background = `rgb(${mixed_color[0]}, ${mixed_color[1]}, ${mixed_color[2]})`;
    } else if (backgroundtype == "firsttype") {
        main.style.background = `rgb(${type1_color[0]}, ${type1_color[1]}, ${type1_color[2]})`;
    } else if (backgroundtype == "secondtype") {
        type2_color = type2_color || type1_color;

        main.style.background = `rgb(${type2_color[0]}, ${type2_color[1]}, ${type2_color[2]})`;
    } else {
        main.style.background = `rgb(${backgroundcolor[0]}, ${backgroundcolor[1]}, ${backgroundcolor[2]})`;
    }
}










function update_legend() {
    if (displaylegend) {
        legendContainer.style.display = "flex";
    } else {
        legendContainer.style.display = "none";
        return;
    }

    let pokemon_name = current_pokemon.name;
    let entry = current_pokemon.entry;

    let type1_name = current_pokemon.type1;
    let type2_name = current_pokemon.type2;

    legendContainer.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;

    if (customtypecolor) {
        type1.style.color = `#${type_colors[type1_name]}`;
        type2.style.color = `#${type_colors[type2_name]}`;
    } else {
        type1.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;
        type2.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;
    }



    type1.innerText = type1_name.toUpperCase();
    if (type2_name) {
        type2.innerText = type2_name.toUpperCase();

        type2.style.display = "inline";
        typeSeparator.style.display = "inline";
    } else {
        type2.style.display = "none";
        typeSeparator.style.display = "none";
    }

    if (enabletextshadow) {
        legendContainer.style.textShadow =
            "1px 1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")," +
            "-1px -1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")," +
            "1px -1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")," +
            "-1px 1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")";
    } else {
        legendContainer.style.textShadow = "none";
    }

    pokemon_name = pokemon_name.charAt(0).toUpperCase() + pokemon_name.slice(1);

    number.innerText = "#" + entry;
    name.innerText = pokemon_name;
}










function update_info() {
    info.innerText = `current_pokemon = ${JSON.stringify(current_pokemon, null, 4)}
allowstaticartworks = ${allowstaticartworks}
allowstaticgen5sprites = ${allowstaticgen5sprites}
allowstaticgen8sprites = ${allowstaticgen8sprites}
allowalternateforms = ${allowalternateforms}
automaticpokemonswitching = ${automaticpokemonswitching}
backgroundtype = ${backgroundtype}
gradientangle = ${gradientangle}
whitelistedpokemon = ${whitelistedpokemon}
blacklistedpokemon = ${blacklistedpokemon}
pokemonswitchingtimer = ${pokemonswitchingtimer}
schemecolor = ${schemecolor}
backgroundcolor = ${backgroundcolor}
customtypecolor = ${customtypecolor}
enabletextshadow = ${enabletextshadow}
shadowcolor = ${shadowcolor}
textcolor = ${textcolor}
displaydetailedinfo = ${displaydetailedinfo}
update_interval_number = ${update_interval_number}
pokemon_list.length = ${pokemon_list.length}
pokemon_list_filtered.length = ${pokemon_list_filtered.length}`;

    debug.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;
}


function update_info_timer() {
    infoTimer.innerText = `next_update = ${Math.ceil((last_update_time - Date.now()) / 1000) + pokemonswitchingtimer}`;
}









function update_pokemon() {
    let sprite_source = "sprites/" + current_pokemon.sprite_type + "/";
    let sprite_index = "front";

    // 50/50 chances of female even though some pokemon have different gender rates
    let is_female = current_pokemon.has_female && Math.random() < 0.5;
    // shiny chance for newer pokemon games
    let is_shiny = current_pokemon.has_shiny && Math.random() < 1 / 4096;



    if (is_female && is_shiny)
        sprite_index += "_shiny_female";
    else if (!is_female && is_shiny)
        sprite_index += "_shiny";
    else if (is_female && !is_shiny)
        sprite_index += "_female";
    else
        sprite_index += "_default";

    sprite_source += current_pokemon.sprites[sprite_index];



    if (current_pokemon.sprite_type == "none")
        sprite_source = "data:image/png;base64," + substitute_base64;



    sprite.src = sprite_source;
    sprite.alt = current_pokemon.name;
}










function update(randomize = false) {
    filter_pokemon_list();

    if (randomize) randomize_pokemon();

    update_background();
    update_legend();
    update_info();
    update_info_timer();
    update_pokemon();

    last_update_time = Date.now();
}










update(true);










// when clicking on number, update pokémon
number.addEventListener("click", () => {
    clearInterval(update_interval_number);
    update(true);
    update_interval_number = setInterval(() => {update(true)}, pokemonswitchingtimer * 1000);
});
info_interval_number = setInterval(update_info_timer, 10);