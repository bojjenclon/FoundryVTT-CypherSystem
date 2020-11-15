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
      "systems/cyphersystem/templates/actor/pc-sheet.html",
      "systems/cyphersystem/templates/actor/npc-sheet.html",

      // Actor Partials
      "systems/cyphersystem/templates/actor/partials/pools.html",
      "systems/cyphersystem/templates/actor/partials/advancement.html",
      "systems/cyphersystem/templates/actor/partials/damage-track.html",
      "systems/cyphersystem/templates/actor/partials/recovery.html",

      "systems/cyphersystem/templates/actor/partials/skills.html",
      "systems/cyphersystem/templates/actor/partials/abilities.html",
      "systems/cyphersystem/templates/actor/partials/inventory.html",

      "systems/cyphersystem/templates/actor/partials/info/skill-info.html",
      "systems/cyphersystem/templates/actor/partials/info/ability-info.html",
      "systems/cyphersystem/templates/actor/partials/info/armor-info.html",
      "systems/cyphersystem/templates/actor/partials/info/weapon-info.html",
      "systems/cyphersystem/templates/actor/partials/info/gear-info.html",
      "systems/cyphersystem/templates/actor/partials/info/cypher-info.html",
      "systems/cyphersystem/templates/actor/partials/info/artifact-info.html",
      "systems/cyphersystem/templates/actor/partials/info/oddity-info.html",

      // Item Sheets
      "systems/cyphersystem/templates/item/skill-sheet.html",
      "systems/cyphersystem/templates/item/armor-sheet.html",
      "systems/cyphersystem/templates/item/weapon-sheet.html",
      "systems/cyphersystem/templates/item/gear-sheet.html",
      "systems/cyphersystem/templates/item/cypher-sheet.html",
      "systems/cyphersystem/templates/item/artifact-sheet.html",
      "systems/cyphersystem/templates/item/oddity-sheet.html",

      // Dialogs
      "systems/cyphersystem/templates/dialog/roll-dialog.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
