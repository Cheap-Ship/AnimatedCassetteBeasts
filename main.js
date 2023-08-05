// Elements
const main = document.getElementById("main");
const legendContainer = document.getElementById("legend-container");
const legend = document.getElementById("legend");
const legendNumber = document.getElementById("number");
const legendName = document.getElementById("name");
const type = document.getElementById("type");
const legendSeparator = document.getElementById("legend-separator");
const sprite = document.getElementById("sprite");
const info = document.getElementById("info");
const infoTimer = document.getElementById("info-timer");
const debug = document.getElementById("debug");

//---

// Properties
let allowstaticartworks = true;
let allowalternateforms = true;
let automaticcassetteswitching = true;
let backgroundtype = "type";
let gradientangle = 135;
let whitelistedcassette = [];
let blacklistedcassette = [];
let cassetteswitchingtimer = 300;
let schemecolor = [255, 255, 0];
let backgroundcolor = [127, 127, 127];
let customtypecolor = true;
let enabletextshadow = true;
let shadowcolor = [0, 0, 0];
let textcolor = [255, 255, 255];
let displaydetailedinfo = false;
let displaylegend = true;

//---

let update_interval_number = 0;
let info_interval_number = 0;
let last_update_time = Date.now();
let current_cassette = null;
let cassette_list_filtered = [];

//---

const type_colors = {
    "Beast": "b0aa82",
    "Air": "3fbd98",
    "Astral": "57628e",
    "Earth": "935353",
    "Fire": "f28245",
    "Ice": "41b1e1",
    "Lightning": "f1c255",
    "Metal": "9792b9",
    "Plant": "56bf4a",
    "Plastic": "e9423f",
    "Poison": "b654f2",
    "Water": "607aeb",
    "Glass": "9dacc3",
    "Glitter": "f382c5",
    "Typeless": "ffffff"
};

//---

//const rogue = current_cassette = { "id": -1, "number": "#???", "name": "rogue", "type": "typeless" };
const rogue = current_cassette = { "id": 11, "number": "#011", "name": "Traffikrab", "type": "Plastic" };
let folder = allowstaticartworks ? "spritework" : "animated";
let extention = allowstaticartworks ? ".png" : ".gif";
const rogue_base64 = "sprites/" + folder + "/Traffikrab" + extention;

//---

// wallpaper Engine Properties
window.wallpaperPropertyListener = {
    applyUserProperties: update_properties
};

//---

function update_properties(properties = {}) {
    // deals with the switching of cassette
    if (properties.cassetteswitchingtimer) {
        clearInterval(update_interval_number);
        cassetteswitchingtimer = properties.cassetteswitchingtimer.value;

        if (automaticcassetteswitching) {
            update_interval_number = setInterval(() => { update(true); }, cassetteswitchingtimer * 1000);
        }
        update();
    }

    if (properties.automaticcassetteswitching) {
        clearInterval(update_interval_number);
        automaticcassetteswitching = properties.automaticcassetteswitching.value;

        if (automaticcassetteswitching) {
            update_interval_number = setInterval(() => { update(true); }, cassetteswitchingtimer * 1000);
        }
        update();
    }

    /*
    if (properties.allowstaticartworks) {
        allowstaticartworks = properties.allowstaticartworks.value;

        if (!allowstaticartworks && current_cassette.sprite_type == "spritework") {
            update(true);
        }
    }
    */

    if (properties.backgroundtype) {
        backgroundtype = properties.backgroundtype.value;
    }

    if (properties.whitelistedcassette) {
        try {
            if (properties.whitelistedcassette.value === "")
                whitelistedcassette = [];
            else
                whitelistedcassette = properties.whitelistedcassette.value.split(",").map((value) => {
                    return parseInt(value) || value.trim();
                });
        } catch {
            whitelistedcassette = [];
        }

        filter_cassette_list();

        // Update if not in the whitelist
        if (whitelistedcassette.length > 0 && (!(whitelistedcassette.includes(current_cassette.id) || whitelistedcassette.includes(current_cassette.name) || whitelistedcassette.includes(current_cassette.form_name))) || whitelistedcassette.length == 0 && current_cassette.id == 0) {
            update(true);
        }
    }

    if (properties.blacklistedcassette) {
        try {
            if (properties.blacklistedcassette.value == "")
                blacklistedcassette = [];
            else
                blacklistedcassette = properties.blacklistedcassette.value.split(",").map((value) => {
                    return parseInt(value) || value.trim();
                });
        } catch {
            blacklistedcassette = [];
        }

        filter_cassette_list();

        // Update if in the blacklist
        if (blacklistedcassette.includes(current_cassette.id) || blacklistedcassette.includes(current_cassette.name) || blacklistedcassette.includes(current_cassette.form_name) || blacklistedcassette.length == 0 && current_cassette.id == 0) {
            update(true);
        }
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

    // update everything but the cassette
    update_background();
    update_legend();
    update_info();
    update_info_timer();
}

//---

function filter_cassette_list() {
    cassette_list_filtered = cassette_list.filter(cassette => {
        return !(
            (cassette.sprite_type == "artwork" && !allowstaticartworks) ||
            (cassette.id >= 10000 && !allowalternateforms) ||
            (blacklistedcassette.length > 0 && (blacklistedcassette.includes(cassette.id))) ||
            (whitelistedcassette.length > 0 && !(whitelistedcassette.includes(cassette.id)))
        );
    });
}

//--

function randomize_cassette() {
    if (cassette_list_filtered.length > 0) {
        current_cassette = cassette_list_filtered[Math.floor(Math.random() * cassette_list_filtered.length)];
    } else {
        current_cassette = rogue;
    }
}

//--

function update_background() {
    let type_color = type_colors[current_cassette.type]

    // convert hex to [r, g, b]
    type_color = type_color.match(/.{1,2}/g).map((number) => {
        return parseInt(number, 16);
    });

    if (backgroundtype == "type") {
        main.style.background = `rgb(${type_color[0]}, ${type_color[1]}, ${type_color[2]})`;
    } else {
        main.style.background = `rgb(${backgroundcolor[0]}, ${backgroundcolor[1]}, ${backgroundcolor[2]})`;
    }
}

//--

function update_legend() {
    if (displaylegend) {
        legendContainer.style.display = "flex";
    } else {
        legendContainer.style.display = "none";
        return;
    }

    let cassette_name = current_cassette.name;
    let number = current_cassette.number;

    let type_name = current_cassette.type;

    legendContainer.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;

    if (customtypecolor) {
        type.style.color = `#${type_colors[type_name]}`;
    } else {
        type.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;
    }

    type.innerText = type_name.toUpperCase();

    if (enabletextshadow) {
        legendContainer.style.textShadow =
            "1px 1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")," +
            "-1px -1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")," +
            "1px -1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")," +
            "-1px 1px 5px rgb(" + shadowcolor[0] + ", " + shadowcolor[1] + ", " + shadowcolor[2] + ")";
    } else {
        legendContainer.style.textShadow = "none";
    }

    cassette_name = cassette_name.charAt(0).toUpperCase() + cassette_name.slice(1);

    legendNumber.innerText = number;
    legendName.innerText = cassette_name;
}

//---

function update_info() {
    info.innerText =    `current_cassette = ${JSON.stringify(current_cassette, null, 4)}
                        allowstaticartworks = ${allowstaticartworks}
                        automaticcassetteswitching = ${automaticcassetteswitching}
                        backgroundtype = ${backgroundtype}
                        whitelistedcassette = ${whitelistedcassette}
                        blacklistedcassette = ${blacklistedcassette}
                        cassetteswitchingtimer = ${cassetteswitchingtimer}
                        schemecolor = ${schemecolor}
                        backgroundcolor = ${backgroundcolor}
                        customtypecolor = ${customtypecolor}
                        enabletextshadow = ${enabletextshadow}
                        shadowcolor = ${shadowcolor}
                        textcolor = ${textcolor}
                        displaydetailedinfo = ${displaydetailedinfo}
                        update_interval_number = ${update_interval_number}
                        cassette_list.length = ${cassette_list.length}
                        cassette_list_filtered.length = ${cassette_list_filtered.length}`;
    debug.style.color = `rgb(${textcolor[0]}, ${textcolor[1]}, ${textcolor[2]})`;
}

//---

function update_info_timer() {
    infoTimer.innerText = automaticcassetteswitching ? `next_update = ${Math.ceil((last_update_time - Date.now()) / 1000) + cassetteswitchingtimer}` : "next_update = null";
}

//---

function update_cassette() {
    let sprite_source = "sprites/" + folder + "/" + current_cassette.name + extention;

    sprite.src = sprite_source;
    sprite.alt = current_cassette.name;
}

//---

function update(randomize = false) {
    filter_cassette_list();

    if (randomize) randomize_cassette();

    update_background();
    update_legend();
    update_info();
    update_info_timer();
    update_cassette();

    last_update_time = Date.now();
}

//---

// update once on page load
clearInterval(update_interval_number);
update_interval_number = setInterval(() => { update(true); }, cassetteswitchingtimer * 1000);
update(true);

//---

// when clicking on the id number update the cassette
number.addEventListener("click", () => {
    clearInterval(update_interval_number);
    update_interval_number = setInterval(() => { update(true); }, cassetteswitchingtimer * 1000);
    update(true);
});