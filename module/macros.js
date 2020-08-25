import { cypherRoll } from './rolls.js';


import EnumPools from './enums/enum-pool.js';

/**
 * Rolls from the given skill.
 * 
 * @param {string} actorId
 * @param {string} pool
 * @return {Promise}
 */
export function usePoolMacro(actorId, pool) {
  const actor = game.actors.entities.find(a => a._id === actorId);
  const actorData = actor.data.data;
  const poolName = EnumPools[pool];
  const freeEffort = actor.getFreeEffortFromStat(pool);

  cypherRoll({
    parts: ['1d20'],

    data: {
      pool,
      effort: freeEffort,
      maxEffort: actorData.effort,
    },
    event,

    title: game.i18n.localize('CSR.roll.pool.title').replace('##POOL##', poolName),
    flavor: game.i18n.localize('CSR.roll.pool.flavor').replace('##ACTOR##', actor.name).replace('##POOL##', poolName),

    actor,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
}

/**
 * Activates the given skill.
 * 
 * @param {string} actorId
 * @param {string} itemId
 * @return {Promise}
 */
export function useSkillMacro(actorId, itemId) {
  const actor = game.actors.entities.find(a => a._id === actorId);
  const skill = actor.getOwnedItem(itemId);

  skill.roll();
}

/**
 * Activates the given ability.
 * 
 * @param {string} actorId
 * @param {string} itemId
 * @return {Promise}
 */
export function useAbilityMacro(actorId, itemId) {
  const actor = game.actors.entities.find(a => a._id === actorId);
  const ability = actor.getOwnedItem(itemId);

  ability.roll();
}

/**
 * Uses the given cypher.
 * 
 * @param {string} actorId
 * @param {string} itemId
 * @return {Promise}
 */
export function useCypherMacro(actorId, itemId) {
  console.warn('Cypher macros not implemented');
}

const SUPPORTED_TYPES = [
  'pool',

  'skill',
  'ability',
  // 'cypher'
];

function itemSupportsMacros(item) {
  if (!SUPPORTED_TYPES.includes(item.type)) {
    return false;
  }

  if (item.type === 'ability' && item.data.isEnabler) {
    return false;
  }

  return true;
}

function unsupportedItemMessage(item) {
  if (item.type === 'ability' && item.data.isEnabler) {
    return game.i18n.localize('CSR.macro.create.abilityEnabler');
  }

  return game.i18n.localize('CSR.macro.create.unsupportedType');
}

function generateMacroCommand(data) {
  const item = data.data;

  // Special case, must handle this separately
  if (item.type === 'pool') {
    return `game.cyphersystem.macro.usePool('${data.actorId}', ${item.pool});`;
  }

  // General cases, works most of the time
  const typeTitleCase = item.type.substr(0, 1).toUpperCase() + item.type.substr(1);
  const command = `game.cyphersystem.macro.use${typeTitleCase}('${data.actorId}', '${item._id}');`;

  return command;
}

async function createMacro(item, command) {
  if (item.type === 'pool') {
    const poolName = EnumPools[item.pool];
    item.name = game.i18n.localize('CSR.macro.pool.name').replace('##POOL##', poolName);
    item.img = 'icons/svg/d20.svg';
  } else if (item.type === 'skill') {
    // If the image would be the default, change to something more appropriate
    item.img = item.img === 'icons/svg/mystery-man.svg' ? 'icons/svg/aura.svg' : item.img;
  } else if (item.type === 'ability') {
    // If the image would be the default, change to something more appropriate
    item.img = item.img === 'icons/svg/mystery-man.svg' ? 'icons/svg/book.svg' : item.img;
  }

  return await Macro.create({
    name: item.name,
    type: 'script',
    img: item.img,
    command: command,
    flags: {
      'cyphersystem.itemMacro': true
    }
  });
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
export async function createCypherMacro(data, slot) {
  const isOwned = 'data' in data;
  if (!isOwned) {
    return ui.notifications.warn(game.i18n.localize('CSR.macro.create.notOwned'));
  }

  const item = data.data;
  if (!itemSupportsMacros(item)) {
    return ui.notifications.warn(unsupportedItemMessage(item));
  }

  const command = generateMacroCommand(data);

  // Determine if the macro already exists, if not, create a new one
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await createMacro(item, command);
  }

  game.user.assignHotbarMacro(macro, slot);

  return false;
}
