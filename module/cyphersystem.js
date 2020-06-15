/* global $ */

// Import Modules
import { CypherSystemActor } from "./actor/actor.js";
import { CypherSystemActorSheet } from "./actor/actor-sheet.js";
import { CypherSystemItem } from "./item/item.js";
import { CypherSystemItemSheet } from "./item/item-sheet.js";

import { registerHandlebarHelpers } from './handlebars-helpers.js';
import { preloadHandlebarsTemplates } from './template.js';

import { rollText } from './rolls.js';

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

Hooks.on("renderChatMessage", (chatMessage, html, data) => {
  // Don't apply ChatMessage enhancement to recovery rolls
  if (chatMessage.roll && !chatMessage.roll.dice[0].options.recovery) {
    const dieRoll = chatMessage.roll.dice[0].rolls[0].roll;
    const rollTotal = chatMessage.roll.total;
    const messages = rollText(dieRoll, rollTotal);
    const numMessages = messages.length;

    const messageContainer = $('<div/>');
    messageContainer.addClass('special-messages');

    messages.forEach((special, idx) => {
      const { text, color, cls } = special;

      const newContent = `<span class="${cls}" style="color: ${color}">${text}</span>${idx < numMessages - 1 ? '<br />' : ''}`;

      messageContainer.append(newContent);
    });

    const dt = html.find(".dice-total");
    messageContainer.insertBefore(dt);
  }
});