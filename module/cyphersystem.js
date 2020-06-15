/* global $ */

// Import Modules
import { CypherSystemActor } from "./actor/actor.js";
import { CypherSystemActorSheet } from "./actor/actor-sheet.js";
import { CypherSystemItem } from "./item/item.js";
import { CypherSystemItemSheet } from "./item/item-sheet.js";

import { registerHandlebarHelpers } from './handlebars-helpers.js';
import { preloadHandlebarsTemplates } from './template.js';

import { registerSystemSettings } from './settings.js';
import { renderChatMessage } from './chat.js';
import { actorDirectoryContext } from './context-menu.js';
import { csrSocketListeners } from './socket.js';

Hooks.once('init', async function () {
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
  Actors.unregisterSheet('core', ActorSheet);
  // TODO: Separate classes per type
  Actors.registerSheet('cyphersystemClean', CypherSystemActorSheet, {
    types: ['pc'],
    makeDefault: true,
  });
  Actors.registerSheet('cyphersystemClean', CypherSystemActorSheet, {
    types: ['npc'],
    makeDefault: true,
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('cyphersystemClean', CypherSystemItemSheet, { makeDefault: true });

  registerSystemSettings();
  registerHandlebarHelpers();
  preloadHandlebarsTemplates();
});

Hooks.on('renderChatMessage', renderChatMessage);

/**
 * Add additional system-specific sidebar directory context menu options for CSR Actor entities
 * 
 * @param {jQuery} html         The sidebar HTML
 * @param {Array} entryOptions  The default array of context menu options
 */
Hooks.on('getActorDirectoryEntryContext', actorDirectoryContext);

Hooks.once('ready', csrSocketListeners);
