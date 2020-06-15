/* globals loadTemplates */

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async() => {
  // Define template paths to load
  const templatePaths = [

      // Actor Sheets
      "systems/cyphersystemClean/templates/actor/pc-sheet.html",
      "systems/cyphersystemClean/templates/actor/npc-sheet.html",

      // Actor Partials
      "systems/cyphersystemClean/templates/actor/partials/pools.html",
      "systems/cyphersystemClean/templates/actor/partials/advancement.html",
      "systems/cyphersystemClean/templates/actor/partials/damage-track.html",
      "systems/cyphersystemClean/templates/actor/partials/recovery.html",

      "systems/cyphersystemClean/templates/actor/partials/skills.html",
      "systems/cyphersystemClean/templates/actor/partials/abilities.html",
      "systems/cyphersystemClean/templates/actor/partials/inventory.html",

      "systems/cyphersystemClean/templates/actor/partials/info/skill-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/ability-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/armor-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/weapon-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/gear-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/cypher-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/artifact-info.html",
      "systems/cyphersystemClean/templates/actor/partials/info/oddity-info.html",

      // Item Sheets
      "systems/cyphersystemClean/templates/item/item-sheet.html",
      "systems/cyphersystemClean/templates/item/skill-sheet.html",
      "systems/cyphersystemClean/templates/item/armor-sheet.html",
      "systems/cyphersystemClean/templates/item/weapon-sheet.html",
      "systems/cyphersystemClean/templates/item/gear-sheet.html",
      "systems/cyphersystemClean/templates/item/cypher-sheet.html",
      "systems/cyphersystemClean/templates/item/artifact-sheet.html",
      "systems/cyphersystemClean/templates/item/oddity-sheet.html",

      // Dialogs
      "systems/cyphersystemClean/templates/dialog/roll-dialog.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
