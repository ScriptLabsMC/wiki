# Plantilla de Bloque Stackeable

Una plantilla para crear bloques stackeables personalizados en Minecraft Bedrock Edition utilizando Custom Components v2. Aprende cómo implementar comportamientos, estados y componentes de bloques...

## Código

`BP/blocks/stackable.json`:

```json
{
  "format_version": "1.21.110",
  "minecraft:block": {
    "description": {
      "identifier": "sl:stackable",
      "menu_category": {
        "category": "items"
      },
      "states": {
        "sl:stackable_state": [0, 1, 2, 3]
      }
    },
    "components": {
      "minecraft:collision_box": {
        "origin": [-6.5, 0, -6],
        "size": [7, 8, 7]
      },
      "minecraft:selection_box": {
        "origin": [-6.5, 0, -6],
        "size": [7, 8, 7]
      },
      "minecraft:material_instances": {
        "*": {
          "render_method": "alpha_test",
          "texture": "sl:stackable"
        }
      },
      "minecraft:geometry": {
        "identifier": "geometry.stackable",
        "bone_visibility": {
          "first_cube": false,
          "second_cube": false,
          "third_cube": false,
          "fourth_cube": false
        }
      },

      // El componente personalizado.
      // NO CAMBIES EL NOMBRE SI HARAS TU ADDON PUBLICO.
      // DEBES DAR CREDITOS POR EL CODIGO.
      // LEER LA LICENCIA
      "sl:stackable": {
        "state": "sl:stackable_state", // Debe ser igual que en tu "states": {}.

        "maxStack": 3, // La cantidad maxima de tu estado.

        // La lista de bloques que serviran para que
        // el estado de tu bloque aumente en +1.

        // Debe de incluir el id de tu bloque
        // si quieres que el mismo aumente el estado
        // (uso recomendado)
        "stackBlocks": [
          "sl:stackable",
          "minecraft:dirt",
          "minecraft:stone",
          "minecraft:oak_planks"
        ],

        // El sonido que hará tu bloque al colocarse 
        // y aumentar el estado.
        "sound": "beacon.activate"
      }
    },
    "permutations": [
      {
        "condition": "q.block_state('sl:stackable_state') == 0",
        "components": {
          "minecraft:geometry": {
            "identifier": "geometry.stackable",
            "bone_visibility": {
              "first_cube": true,
              "second_cube": false,
              "third_cube": false,
              "fourth_cube": false
            }
          }
        }
      },
      {
        "condition": "q.block_state('sl:stackable_state') == 1",
        "components": {
          "minecraft:geometry": {
            "identifier": "geometry.stackable",
            "bone_visibility": {
              "first_cube": true,
              "second_cube": true,
              "third_cube": false,
              "fourth_cube": false
            }
          }
        }
      },
      {
        "condition": "q.block_state('sl:stackable_state') == 2",
        "components": {
          "minecraft:geometry": {
            "identifier": "geometry.stackable",
            "bone_visibility": {
              "first_cube": true,
              "second_cube": true,
              "third_cube": true,
              "fourth_cube": false
            }
          }
        }
      },
      {
        "condition": "q.block_state('sl:stackable_state') == 3",
        "components": {
          "minecraft:geometry": {
            "identifier": "geometry.stackable",
            "bone_visibility": {
              "first_cube": true,
              "second_cube": true,
              "third_cube": true,
              "fourth_cube": true
            }
          }
        }
      }
    ]
  }
}
```

## Script

`BP/scripts/stackableComp.js`

```js
import { system, EquipmentSlot, GameMode } from "@minecraft/server";

/** @type {import('@minecraft/server').BlockCustomComponent} */
const stackableComp = {
  onPlace: ({ block }, { params }) => {
    const { state, sound } = params;
    if (!state) return;
    const perm = block.permutation;
    block.setPermutation(perm.withState(state, 0));

    if (sound) block.dimension.playSound(sound, block.location);
  },

  onPlayerInteract: ({ block, player, dimension }, { params }) => {
    const { state, maxStack, stackBlocks, sound } = params;
    const perm = block.permutation;
    const currentStackState = perm.getState(state);

    if (currentStackState >= maxStack) return console.warn("Max state reached");

    const eqComp = player.getComponent("equippable");
    if (!eqComp) return;

    const item = eqComp.getEquipment(EquipmentSlot.Mainhand);
    if (!item) return;
    const itemName = item.typeId;

    if (!Array.isArray(stackBlocks)) return;
    if (!stackBlocks.includes(itemName)) return;

    block.setPermutation(perm.withState(state, currentStackState + 1));

    if (sound) dimension.playSound(sound, block.location);

    if (player.getGameMode().match(GameMode.Creative)) return;

    const newItem = item.clone();
    newItem.amount -= 1;
    eqComp.setEquipment(EquipmentSlot.Mainhand, newItem);
  },
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    // NO CAMBIAR EL NOMBRE "sl:stackable"
    // DEL COMPONENTE SI PIENSAS PUBLICAR TU ADDON, LEE LA LICENCIA.
  blockComponentRegistry.registerCustomComponent("sl:stackable", stackableComp);
  console.warn("[STComp] Stackable comp registered");
});
```

---

## License (STAL) :

- #### Stackable Template Addon License (STAL) — 2025
- #### Copyright (c) 2025 ScriptLabsMC / a.j.r.\_.uribe

### Definitions

- "Template" means the code, assets, and documentation provided with this file.
- "Public distribution" means any making-available to the public, including publishing to public repositories or marketplaces.
- "Custom component" means the JavaScript custom element identified as "sl:stackable".

### Grant of Rights

Permission is granted to use, copy, modify, and distribute the Template, subject to the conditions below when the Template or any derivative is publicly distributed.

### Conditions for public distribution

1. Preservation of component identifier

   - When publicly distributing source form of the Template or a derivative, you must retain the custom component identifier "sl:stackable" for the component that provides the original Template's core behavior.
   - Binary, bundled, or minified forms that do not expose component identifiers in source may include a clear notice in accompanying documentation stating that the original component name is preserved in source form.
   - This requirement is intended as a branding/attribution condition and not to prevent reasonable modifications. If renaming is necessary for compatibility, contact the author.

2. Preservation of parameters and structure

   - Public derivatives that expose the component API must preserve the parameter names and fundamental structural contract for compatibility with existing content that relies on this Template.
   - Non-public/internal builds are exempt.

3. Attribution and license file
   - Any public distribution must include this license file in the project root and include credit to "ScriptLabsMC" or "a.j.r.\_.uribe" (choose one) in the project's README, credits, or about section.

### Compliance and termination

- Failure to comply with these conditions terminates the granted rights. If you become aware of non-compliance, contact the author to resolve.

### Disclaimer and liability

- THE TEMPLATE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY ARISING FROM USE OF THE TEMPLATE.

### Other

- This license does not grant any patent rights. Consult legal counsel for patent considerations.
- This license is not a substitute for legal advice. If you require legally binding terms or have questions, consult a qualified attorney.
- Questions: join [discord server](https://discord.gg/BFG3T8MBWN)

By using or distributing this Template you agree to comply with these terms.
