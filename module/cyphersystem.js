// Import Modules
import { CypherSystemActor } from "./actor/actor.js";
import { CypherSystemActorSheet } from "./actor/actor-sheet.js";
import { CypherSystemItem } from "./item/item.js";
import { CypherSystemItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.cyphersystem = {
    CypherSystemActor,
    CypherSystemItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = CypherSystemActor;
  CONFIG.Item.entityClass = CypherSystemItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("cyphersystem", CypherSystemActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cyphersystem", CypherSystemItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});