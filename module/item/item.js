/* globals Item renderTemplate */

import { cypherRoll } from '../rolls.js';
import { valOrDefault } from '../utils.js';

import EnumPools from '../enums/enum-pool.js';
import EnumTraining from '../enums/enum-training.js';
import EnumWeight from '../enums/enum-weight.js';
import EnumRange from '../enums/enum-range.js';
import EnumWeaponCategory from '../enums/enum-weapon-category.js';

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class CypherSystemItem extends Item {
  _prepareSkillData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.skill'));
    data.pool = valOrDefault(data.pool, 0);
    data.training = valOrDefault(data.training, 1);
    data.notes = valOrDefault(data.notes, '');

    data.flags = valOrDefault(data.flags, {});
  }

  _prepareAbilityData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.ability'));
    data.sourceType = valOrDefault(data.sourceType, '');
    data.sourceValue = valOrDefault(data.sourceValue, '');
    data.isEnabler = valOrDefault(data.isEnabler, true);
    data.cost = valOrDefault(data.cost, {
      value: 0,
      pool: 0
    });
    data.range = valOrDefault(data.range, 0);
    data.notes = valOrDefault(data.notes, '');
  }

  _prepareArmorData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.armor'));
    data.armor = valOrDefault(data.armor, 1);
    data.additionalSpeedEffortCost = valOrDefault(data.additionalSpeedEffortCost, 1);
    data.price = valOrDefault(data.price, 0);
    data.weight = valOrDefault(data.weight, 0);
    data.quantity = valOrDefault(data.quantity, 1);
    data.equipped = valOrDefault(data.equipped, false);
    data.notes = valOrDefault(data.notes, '');
  }

  _prepareWeaponData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.weapon'));
    data.damage = valOrDefault(data.damage, 1);
    data.category = valOrDefault(data.category, 0);
    data.range = valOrDefault(data.range, 0);
    data.price = valOrDefault(data.price, 0);
    data.weight = valOrDefault(data.weight, 0);
    data.quantity = valOrDefault(data.quantity, 1);
    data.equipped = valOrDefault(data.equipped, false);
    data.notes = valOrDefault(data.notes, '');
  }

  _prepareGearData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.gear'));
    data.price = valOrDefault(data.price, 0);
    data.quantity = valOrDefault(data.quantity, 1);
    data.notes = valOrDefault(data.notes, '');
  }

  _prepareCypherData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.cypher'));
    data.identified = valOrDefault(data.identified, false);
    data.level = valOrDefault(data.level, null);
    data.levelDie = valOrDefault(data.levelDie, '');
    data.form = valOrDefault(data.form, '');
    data.effect = valOrDefault(data.effect, '');
    data.notes = valOrDefault(data.notes, '');
  }

  _prepareArtifactData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.artifact'));
    data.identified = valOrDefault(data.identified, false);
    data.level = valOrDefault(data.level, null);
    data.levelDie = valOrDefault(data.levelDie, '');
    data.form = valOrDefault(data.form, '');
    data.effect = valOrDefault(data.effect, '');
    data.depletion = valOrDefault(data.depletion, {
      isDepleting: true,
      die: 'd6',
      threshold: 1
    });
    data.notes = valOrDefault(data.notes, '');
  }

  _prepareOddityData() {
    const itemData = this.data;
    const { data } = itemData;

    data.name = valOrDefault(itemData.name, game.i18n.localize('CSR.new.oddity'));
    data.notes = valOrDefault(data.notes, '');
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    switch (this.type) {
      case 'skill':
        this._prepareSkillData();
        break;
      case 'ability':
        this._prepareAbilityData();
        break;
      case 'armor':
        this._prepareArmorData();
        break;
      case 'weapon':
        this._prepareWeaponData();
        break;
      case 'gear':
        this._prepareGearData();
        break;
      case 'cypher':
        this._prepareCypherData();
        break;
      case 'artifact':
        this._prepareArtifactData();
        break;
      case 'oddity':
        this._prepareOddityData();
        break;
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
    const freeEffort = actor.getFreeEffortFromStat(pool);

    const parts = ['1d20'];
    if (assets !== 0) {
      const sign = assets < 0 ? '-' : '+';
      parts.push(`${sign} ${Math.abs(assets) * 3}`);
    }

    cypherRoll({
      parts,

      data: {
        pool,
        poolCost: 0,
        effort: freeEffort,
        maxEffort: actorData.effort,
        assets
      },
      event,

      title: game.i18n.localize('CSR.roll.skill.title'),
      flavor: game.i18n.localize('CSR.roll.skill.flavor').replace('##ACTOR##', actor.name).replace('##SKILL##', name),

      actor,
      speaker: ChatMessage.getSpeaker({ actor }),
    });
  }

  _abilityRoll() {
    const actor = this.actor;
    const actorData = actor.data.data;

    const { name } = this;
    const item = this.data;
    const { isEnabler, cost } = item.data;

    if (!isEnabler) {
      const { pool, value: amount } = cost;
      const edge = actor.getEdgeFromStat(pool);
      const adjustedAmounted = Math.max(amount - edge, 0);
      const freeEffort = actor.getFreeEffortFromStat(pool);

      // Edge has made this ability free, so just use it
      if (actor.canSpendFromPool(pool, parseInt(amount, 10))) {
        cypherRoll({
          event,
          parts: ['1d20'],
          data: {
            pool,
            poolCost: adjustedAmounted,
            effort: freeEffort,
            maxEffort: actorData.effort
          },
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor: `${actor.name} used ${name}`,
          title: game.i18n.localize('CSR.roll.ability.title'),
          actor
        });
      } else {
        const poolName = EnumPools[pool];
        ChatMessage.create([{
          speaker: ChatMessage.getSpeaker({ actor }),
          flavor: game.i18n.localize('CSR.roll.ability.failed.flavor'),
          content: game.i18n.localize('CSR.roll.ability.failed.content').replace('##POOL##', poolName)
        }]);
      }
    } else {
      ChatMessage.create([{
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: game.i18n.localize('CSR.roll.ability.invalid.flavor'),
        content: game.i18n.localize('CSR.roll.ability.invalid.content')
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
    const skillData = this.data;
    const { data } = skillData;

    const training = EnumTraining[skillData.data.training];
    const pool = EnumPools[skillData.data.pool];

    const params = {
      name: skillData.name,
      training: training.toLowerCase(),
      pool: pool.toLowerCase(),
      notes: data.notes,

      initiative: !!data.flags.initiative
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/skill-info.html', params);

    return html;
  }

  async _abilityInfo() {
    const { data } = this;
    const ability = data.data;

    const pool = EnumPools[ability.cost.pool];

    const params = {
      name: data.name,
      pool: pool.toLowerCase(),
      isEnabler: ability.isEnabler,
      cost: ability.cost.value,
      notes: ability.notes,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/ability-info.html', params);

    return html;
  }

  async _armorInfo() {
    const { data } = this;

    const weight = EnumWeight[data.data.weight];

    const params = {
      name: this.name,
      type: this.type,
      equipped: data.data.equipped,
      quantity: data.data.quantity,
      weight: weight.toLowerCase(),
      armor: data.data.armor,
      additionalSpeedEffortCost: data.data.additionalSpeedEffortCost,
      price: data.data.price,
      notes: data.data.notes,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/armor-info.html', params);

    return html;
  }

  async _weaponInfo() {
    const { data } = this;

    const weight = EnumWeight[data.data.weight];
    const range = EnumRange[data.data.range];
    const category = EnumWeaponCategory[data.data.category];

    const params = {
      name: this.name,
      type: this.type,
      equipped: data.data.equipped,
      quantity: data.data.quantity,
      weight: weight.toLowerCase(),
      range: range.toLowerCase(),
      category: category.toLowerCase(),
      damage: data.data.damage,
      price: data.data.price,
      notes: data.data.notes,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/weapon-info.html', params);

    return html;
  }

  async _gearInfo() {
    const { data } = this;

    const params = {
      name: data.name,
      type: this.type,
      quantity: data.data.quantity,
      price: data.data.price,
      notes: data.data.notes,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/gear-info.html', params);

    return html;
  }

  async _cypherInfo() {
    const { data } = this;

    const params = {
      name: data.name,
      type: this.type,
      isGM: game.user.isGM,
      identified: data.data.identified,
      level: data.data.level,
      form: data.data.form,
      effect: data.data.effect,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/cypher-info.html', params);

    return html;
  }

  async _artifactInfo() {
    const { data } = this;

    const params = {
      name: data.name,
      type: this.type,
      isGM: game.user.isGM,
      identified: data.data.identified,
      level: data.data.level,
      form: data.data.form,
      isDepleting: data.data.depletion.isDepleting,
      depletionThreshold: data.data.depletion.threshold,
      depletionDie: data.data.depletion.die,
      effect: data.data.effect,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/artifact-info.html', params);

    return html;
  }

  async _oddityInfo() {
    const { data } = this;

    const params = {
      name: data.name,
      type: this.type,
      notes: data.data.notes,
    };
    const html = await renderTemplate('systems/cyphersystem/templates/actor/partials/info/oddity-info.html', params);

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
      case 'armor':
        html = await this._armorInfo();
        break;
      case 'weapon':
        html = await this._weaponInfo();
        break;
      case 'gear':
        html = await this._gearInfo();
        break;
      case 'cypher':
        html = await this._cypherInfo();
        break;
      case 'artifact':
        html = await this._artifactInfo();
        break;
      case 'oddity':
        html = await this._oddityInfo();
        break;
    }

    return html;
  }
}
