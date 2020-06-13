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
      "systems/cyphersystemClean/templates/actor/actor-sheet.html",
      "systems/cyphersystemClean/templates/actor/pc-sheet.html",

      // Actor Partials
      "systems/cyphersystemClean/templates/actor/partials/pools.html",

      //Item Sheets
      "systems/cyphersystemClean/templates/item/item-sheet.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
