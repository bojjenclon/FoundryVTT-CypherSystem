/* global Combat */

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
import { rollInitiative } from './combat.js';

Hooks.once('init', async function () {
  game.cyphersystemClean = {
    CypherSystemActor,
    CypherSystemItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  Combat.prototype.rollInitiative = rollInitiative;

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

Hooks.on('getActorDirectoryEntryContext', actorDirectoryContext);

Hooks.on('createActor', async function(actor, options, userId) {
  const { type } = actor.data;
  if (type === 'pc') {
    // Give PCs the "Initiative" skill by default, as it will be used
    // by the intiative formula in combat.
    actor.createOwnedItem({
      name: game.i18n.localize('CSR.skill.initiative'),
      type: 'skill',
      data: new CypherSystemItem({
        'pool': 1, // Speed
        'training': 1, // Untrained

        'flags.initiative': true
      }),
    });
  }
});

Hooks.once('ready', csrSocketListeners);
