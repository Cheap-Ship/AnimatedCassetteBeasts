# Animated Pokémon
This is a custom Wallpaper Engine Web Wallpaper featuring **ALL** currently existing pokémon and their forms, most of the animated using Generation 5 sprites.

I do not own any rights to the sprites used in this wallpaper. The data and images used in this wallpaper were provided by [PokéAPI](https://pokeapi.co/).

## Features
- Customize the type of background and the colors;
- Click on the pokédex national number to choose a new random pokémon;
- Whitelist and blacklist pokémon to be displayed;
- Adjust the speed in which pokémon are cycle through;
- Choose the types of sprites to be displayed.

## Pokémon Sprites Types:
- **Animated**: All 649 pokémon up to generation 5 (Black & White), enabled by default;
- **Gen5**: All remaining pokémon up to 898 (Sword & Shield) have been drawn using Gen5-like sprites that aren't animated;
- **Gen8**: Some alternate forms in Sword & Shield don't have Gen5-like sprites, so they have the Gen8 sprites instead;
- **Artwork**: Pokémon in Arceus and some alternate forms in Gen8 don't have sprites, so they use the official artwork instead.

For a better experience don't allow any other sprite type in the Wallpaper Engine settings to only show animated sprites.

To see all currently available pokémon in their original form, select `Allow Static Gen 5 Sprites` and deselect `Allow Alternate Forms`.

To see all currently available pokémon and their alternate forms, allow every sprite type and select `Allow Alternate Forms`.

## Building
Requires [Python](https://www.python.org/) installed. Run `python build.py` to download all the sprites to the `sprites/` directory and build the `pokemon.js` file containing all pokémon info.

## External Resources
- Font Credit: https://www.dafont.com/pokemon-classic.font
- Data & Sprites Credit: https://github.com/PokeAPI/pokeapi