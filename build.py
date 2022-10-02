import json
import os
import time
import urllib.request



api = "https://pokeapi.co/api/v2/"

animated_url_prefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/"
gen5_url_prefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/"
gen8_url_prefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/"
artwork_url_prefix = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"











# creating all possible folders
folders = "", "animated", "animated/female", "animated/shiny", "animated/shiny/female", "gen5", "gen5/female", "gen5/shiny", "gen5/shiny/female", "gen8", "gen8/female", "artwork"

for folder in folders:
    if not os.path.exists("sprites/" + folder):
        os.makedirs("sprites/" + folder)










# Starting the pokemon.js file
with open("pokemon.js", "w") as f:
    f.write("// Generated on " + time.strftime("%Y-%m-%d %H:%M:%S"))
    f.write("\nconst pokemon_list = [\n")

if not os.path.exists("cache/"):
    os.makedirs("cache/")










# Getting all pokemon
if (os.path.isfile("cache/pokemon.json")):
    with open("cache/pokemon.json", "r") as f:
        all_pokemon = json.load(f)
else:
    all_pokemon = requests.get(api + "pokemon/?limit=99999").json()
    with open("cache/pokemon.json", "w") as f:
        json.dump(all_pokemon, f)
        print("Cached pokemon.json")










# Looping through all pokemon
for pokemon_entry in all_pokemon["results"]:
    pokemon = None

    # if the file cache/{name}.json exists, use that otherwise fetch from the API and save it
    if os.path.isfile("cache/" + pokemon_entry["name"] + ".json"):
        with open("cache/" + pokemon_entry["name"] + ".json", "r") as f:
            pokemon = json.load(f)
    else:
        pokemon = requests.get(pokemon_entry["url"]).json()
        with open("cache/" + pokemon_entry["name"] + ".json", "w") as f:
            json.dump(pokemon, f)
            print("Cached:\t" + pokemon_entry["name"])



    sprite_type = None # animated, gen5, gen8, artwork, none

    front_default = None
    front_shiny = None
    front_female = None
    front_shiny_female = None

    front_default_url = None
    front_shiny_url = None
    front_female_url = None
    front_shiny_female_url = None





    if pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]:
        sprite_type = "animated"

        front_default_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]
        front_shiny_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_shiny"]
        front_female_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_female"]
        front_shiny_female_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_shiny_female"]
    elif pokemon["sprites"]["versions"]["generation-v"]["black-white"]["front_default"]:
        sprite_type = "gen5"

        front_default_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["front_default"]
        front_shiny_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["front_shiny"]
        front_female_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["front_female"]
        front_shiny_female_url = pokemon["sprites"]["versions"]["generation-v"]["black-white"]["front_shiny_female"]
    elif pokemon["sprites"]["versions"]["generation-viii"]["icons"]["front_default"]:
        sprite_type = "gen8"

        front_default_url = pokemon["sprites"]["versions"]["generation-viii"]["icons"]["front_default"]
        front_female_url = pokemon["sprites"]["versions"]["generation-viii"]["icons"]["front_female"]
    elif pokemon["sprites"]["other"]["official-artwork"]["front_default"]:
        sprite_type = "artwork"

        front_default_url = pokemon["sprites"]["other"]["official-artwork"]["front_default"]
    else:
        sprite_type = "none"





    sprites_download = []

    if sprite_type == "animated":
        if front_default_url: front_default = front_default_url.replace(animated_url_prefix, "")
        if front_shiny_url: front_shiny = front_shiny_url.replace(animated_url_prefix, "")
        if front_female_url: front_female = front_female_url.replace(animated_url_prefix, "")
        if front_shiny_female_url: front_shiny_female = front_shiny_female_url.replace(animated_url_prefix, "")

        sprites_download = [
            (front_default, front_default_url),
            (front_shiny, front_shiny_url),
            (front_female, front_female_url),
            (front_shiny_female, front_shiny_female_url),
        ]
    elif sprite_type == "gen5":
        if front_default_url: front_default = front_default_url.replace(gen5_url_prefix, "")
        if front_shiny_url: front_shiny = front_shiny_url.replace(gen5_url_prefix, "")
        if front_female_url: front_female = front_female_url.replace(gen5_url_prefix, "")
        if front_shiny_female_url: front_shiny_female = front_shiny_female_url.replace(gen5_url_prefix, "")

        sprites_download = [
            (front_default, front_default_url),
            (front_shiny, front_shiny_url),
            (front_female, front_female_url),
            (front_shiny_female, front_shiny_female_url),
        ]
    elif sprite_type == "gen8":
        if front_default_url: front_default = front_default_url.replace(gen8_url_prefix, "")
        if front_female_url: front_female = front_female_url.replace(gen8_url_prefix, "")

        sprites_download = [
            (front_default, front_default_url),
            (front_female, front_female_url),
        ]
    elif sprite_type == "artwork":
        if front_default_url: front_default = front_default_url.replace(artwork_url_prefix, "")

        sprites_download = [
            (front_default, front_default_url),
        ]





    # Download the sprites
    for sprite in sprites_download:
        if sprite[0] and sprite[1] and not os.path.isfile("sprites/" + sprite_type + "/" + sprite[0]):
            print("Downloading:\t" + "sprites/" + sprite_type + "/" + sprite[0])
            urllib.request.urlretrieve(sprite[1], "sprites/" + sprite_type + "/" + sprite[0])





    pokemon_name = pokemon["name"]
    species_name = pokemon["species"]["name"]
    id = pokemon["id"]
    entry = int(pokemon["species"]["url"].split("/")[-2])
    type1_name = pokemon["types"][0]["type"]["name"]
    type2_name = pokemon["types"][1]["type"]["name"] if len(pokemon["types"]) > 1 else None
    has_female = front_female is not None
    has_shiny = front_shiny is not None



    pokemon_data = {
        "id": id,
        "entry": entry,
        "name": species_name,
        "form_name": pokemon_name,
        "type1": type1_name,
        "type2": type2_name,
        "has_female": has_female,
        "has_shiny": has_shiny,
        "sprite_type": sprite_type,
        "sprites": {
            "front_default": front_default,
            "front_shiny": front_shiny,
            "front_female": front_female,
            "front_shiny_female": front_shiny_female,
        }
    }



    with open("pokemon.js", "a") as f:
        f.write("\t")
        json.dump(pokemon_data, f)
        f.write(",\n")



    print("\nAdding:\t\t" + str(id) + " - " + pokemon_name)



with open("pokemon.js", "a") as f:
    f.write("];")