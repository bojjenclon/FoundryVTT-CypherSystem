/**
 * Roll initiative for one or multiple Combatants within the Combat entity
 * @param {Array|string} ids        A Combatant id or Array of ids for which to roll
 * @param {string|null} formula     A non-default initiative formula to roll. Otherwise the system default is used.
 * @param {Object} messageOptions   Additional options with which to customize created Chat Messages
 * @return {Promise.<Combat>}       A promise which resolves to the updated Combat entity once updates are complete.
 */
export async function rollInitiative(ids, formula = null, messageOptions = {}) {
  const combatantUpdates = [];
  const messages = []

  // Force ids to be an array so our for loop doesn't break
  ids = typeof ids === 'string' ? [ids] : ids;
  for (let id of ids) {
    const combatant = await this.getCombatant(id);
    if (combatant.defeated) {
      return;
    }

    const { actor } = combatant;
    const actorData = actor.data;
    const { type } = actorData;

    let initiative;
    let rollResult;
    switch (type) {
      // PCs use a simple d20 roll modified by any training in an Initiative skill
      case 'pc':
        const initBonus = actor.initiativeLevel;
        const operator = initBonus < 0 ? '-' : '+';
        const rollFormula = '1d20' + (initBonus === 0 ? '' : `${operator}${3*Math.abs(initBonus)}`);

        const roll = new Roll(rollFormula).roll();
        initiative = Math.max(roll.total, 0); // Don't let initiative go below 0
        rollResult = roll.result;
        
        break;

      // NPCs have a fixed initiative based on their level
      case 'npc':
        const { level } = actorData.data;
        initiative = 3 * level;
        break;
    }

    combatantUpdates.push({
      _id: combatant._id,
      initiative
    });

    // Since NPC initiative is fixed, don't bother showing it in chat
    if (type === 'pc') {
      const { token } = combatant;
      const isHidden = token.hidden || combatant.hidden;
      const whisper = isHidden ? game.users.entities.filter(u => u.isGM) : '';

      // TODO: Improve the chat message, this currently
      // just replicates the normal roll message.
      const template = `
        <div class="dice-roll">
          <div class="dice-result">
            <div class="dice-formula">${rollResult}</div>
            <div class="dice-tooltip">
              <section class="tooltip-part">
                <div class="dice">
                  <p class="part-formula">
                    1d20
                    <span class="part-total">${initiative}</span>
                  </p>

                  <ol class="dice-rolls">
                    <li class="roll die d20">${initiative}</li>
                  </ol>
                </div>
              </section>
            </div>
            <div class="dice-total">${initiative}</div>
          </div>
        </div>
        `;

      const messageData = mergeObject({
        speaker: {
          scene: canvas.scene._id,
          actor: actor ? actor._id : null,
          token: token._id,
          alias: token.name,
        },
        whisper,
        flavor: game.i18n.localize('CSR.initiative.flavor').replace('##ACTOR##', token.name),
        content: template,
      }, messageOptions);

      messages.push(messageData);
    }
  }

  if (!combatantUpdates.length) {
    return;
  }

  await this.updateEmbeddedEntity('Combatant', combatantUpdates);

  ChatMessage.create(messages);

  return this;
}
