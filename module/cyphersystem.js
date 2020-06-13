// Import Modules
import { CypherSystemActor } from "./actor/actor.js";
import { CypherSystemActorSheet } from "./actor/actor-sheet.js";
import { CypherSystemItem } from "./item/item.js";
import { CypherSystemItemSheet } from "./item/item-sheet.js";

import { registerHandlebarHelpers } from './handlebars-helpers.js';
import { preloadHandlebarsTemplates } from './template.js';

Hooks.once('init', async function() {

  game.cyphersystemClean = {
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
  Actors.registerSheet('cyphersystemClean', CypherSystemActorSheet, {
    types: ['pc'],
    makeDefault: true,
  });
  Actors.registerSheet('cyphersystemClean', CypherSystemActorSheet, {
    types: ['npc'],
    makeDefault: true,
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cyphersystemClean", CypherSystemItemSheet, { makeDefault: true });

  registerHandlebarHelpers();
  preloadHandlebarsTemplates();
});
