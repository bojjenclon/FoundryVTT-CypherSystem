/**
 * Activates the given skill.
 * 
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
 * @param {string} itemId
 * @return {Promise}
 */
export function useCypherMacro(actorId, itemId) {
  console.warn('Cypher macros not implemented');
}

const SUPPORTED_TYPES = [
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

  const typeTitleCase = item.type.substr(0, 1).toUpperCase() + item.type.substr(1);
  const command = `game.cyphersystem.macro.use${typeTitleCase}('${data.actorId}', '${item._id}');`;

  // Determine if the macro already exists, if not, create a new one
  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: {
        'cyphersystem.itemMacro': true
      }
    });
  }

  game.user.assignHotbarMacro(macro, slot);

  return false;
}
