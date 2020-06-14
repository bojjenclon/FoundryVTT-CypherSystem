/* globals Item renderTemplate */

import { CypherRolls } from '../rolls.js';

import EnumPools from '../enums/enum-pool.js';
import EnumTraining from '../enums/enum-training.js';

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class CypherSystemItem extends Item {
  _prepareSkillData() {
    const itemData = this.data;
    const { data } = itemData;


  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    if (this.type === 'skill') {
      this._prepareSkillData();
    }
  }

  /**
   * Roll
   */

  _skillRoll() {
    const actor = this.actor;
    const actorData = actor.data.data;

    const { name } = this;
    const item = this.data;
    const { pool } = item.data;
    const assets = actor.getSkillLevel(this);
    
    const parts = ['1d20'];
    if (assets !== 0) {
      const sign = assets < 0 ? '-' : '+';
      parts.push(`${sign} ${Math.abs(assets) * 3}`);
    }

    CypherRolls.Roll({
      event,
      parts,
      data: {
        pool,
        abilityCost: 0,
        maxEffort: actorData.effort,
        assets
      },
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${actor.name} used ${name}`,
      title: 'Use Skill',
      actor
    });
  }

  _abilityRoll() {
    const actor = this.actor;
    const actorData = actor.data.data;

    const { name } = this;
    const item = this.data;
    const { isEnabler, cost } = item.data;

    if (!isEnabler) {
      const { pool } = cost;

      if (actor.canSpendFromPool(pool, parseInt(cost.amount, 10))) {
        CypherRolls.Roll({
          event,
          parts: ['1d20'],
          data: {
            pool,
            abilityCost: cost.amount,
            maxEffort: actorData.effort
          },
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor: `${actor.name} used ${name}`,
          title: 'Use Ability',
          actor
        });
      } else {
        const poolName = EnumPools[pool];
        ChatMessage.create([{
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor: 'Ability Failed',
          content: `Not enough points in ${poolName} pool.`
        }]);
      }
    } else {
      ChatMessage.create([{
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: 'Invalid Ability',
        content: `This ability is an Enabler and cannot be rolled for.`
      }]);
    }
  }

  roll() {
    switch (this.type) {
      case 'skill':
        this._skillRoll();
        break;
      case 'ability':
        this._abilityRoll();
        break;
    }
  }

  /**
   * Info
   */

  async _skillInfo() {
    const { data } = this;

    const training = EnumTraining[data.data.training];
    const pool = EnumPools[data.data.pool];

    const params = {
      name: data.name,
      training: training.toLowerCase(),
      pool: pool.toLowerCase(),
      notes: data.data.notes,
    };
    const html = await renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/skill-info.html', params);

    return html;
  }

  async _abilityInfo() {
    const { data } = this;

    const pool = EnumPools[data.data.cost.pool];

    const params = {
      name: data.name,
      pool: pool.toLowerCase(),
      isEnabler: data.data.isEnabler,
      notes: data.data.notes,
    };
    const html = await renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/ability-info.html', params);

    return html;
  }

  async getInfo() {
    let html = '';

    switch (this.type) {
      case 'skill':
        html = await this._skillInfo();
        break;
      case 'ability':
        html = await this._abilityInfo();
        break;
    }

    return html;
  }
}
