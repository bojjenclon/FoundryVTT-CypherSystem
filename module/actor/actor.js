/* global Actor:false */

import { CSR } from '../config.js';
import { valOrDefault } from '../utils.js';

import EnumPools from '../enums/enum-pool.js';

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class CypherSystemActor extends Actor {
  /**
   * Prepare Character type specific data
   */
  _preparePCData(actorData) {
    const data = actorData.data;

    data.sentence = valOrDefault(data.sentence, {
      descriptor: '',
      type: '',
      focus: ''
    });

    data.tier = valOrDefault(data.tier, 1);
    data.effort = valOrDefault(data.effort, 1);
    data.xp = valOrDefault(data.xp, 0);
    data.advances = valOrDefault(data.advances, {
      stats: false,
      edge: false,
      effort: false,
      skills: false,
      other: false
    });

    data.recoveryMod = valOrDefault(data.recoveryMod, 1);
    data.recoveries = valOrDefault(data.recoveries, {
      action: false,
      tenMins: false,
      oneHour: false,
      tenHours: false
    });

    data.damageTrack = valOrDefault(data.damageTrack, 0);
    data.armor = valOrDefault(data.armor, 0);

    data.stats = valOrDefault(data.stats, {
      might: {
        value: 0,
        pool: 0,
        edge: 0
      },
      speed: {
        value: 0,
        pool: 0,
        edge: 0
      },
      intellect: {
        value: 0,
        pool: 0,
        edge: 0
      }
    });

    data.money = valOrDefault(data.money, 0);
  }

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'pc') {
      this._preparePCData(actorData);
    }
  }

  getSkillLevel(skill) {
    const { data } = skill.data;

    return data.training - 1;
  }

  getEffortCostFromStat(pool, effortLevel) {
    const value = {
      cost: 0,
      effortLevel: 0,
      warning: null,
    };

    if (effortLevel === 0) {
      return value;
    }

    const actorData = this.data.data;
    const poolName = EnumPools[pool];
    const stat = actorData.stats[poolName.toLowerCase()];

    //The first effort level costs 3 pts from the pool, extra levels cost 2
    //Substract the related Edge, too
    const availableEffortFromPool = (stat.value + stat.edge - 1) / 2;

    //A PC can use as much as their Effort score, but not more
    //They're also limited by their current pool value
    const finalEffort = Math.min(effortLevel, actorData.effort, availableEffortFromPool);
    const cost = 1 + 2 * finalEffort - stat.edge;

    //TODO take free levels of Effort into account here

    let warning = null;
    if (effortLevel > availableEffortFromPool) {
      warning = `Not enough points in your ${poolName} pool for that level of Effort`;
    }

    value.cost = cost;
    value.effortLevel = finalEffort;
    value.warning = warning;

    return value;
  }

  canSpendFromPool(pool, amount, applyEdge = true) {
    const actorData = this.data.data;
    const poolName = EnumPools[pool].toLowerCase();
    const stat = actorData.stats[poolName];
    const poolAmount = stat.value;

    return (applyEdge ? amount - stat.edge : amount) <= poolAmount;
  }

  spendFromPool(pool, amount) {
    if (!this.canSpendFromPool(pool, amount)) {
      return false;
    }

    const actorData = this.data.data;
    const poolName = EnumPools[pool];
    const stat = actorData.stats[poolName.toLowerCase()];

    const data = {};
    data[`data.stats.${poolName.toLowerCase()}.value`] = Math.max(0, stat.value - amount);
    this.update(data);

    return true;
  }

  /**
   * @override
   */
  async createEmbeddedEntity(...args) {
    const [_, data] = args;

    // Roll the "level die" to determine the item's level, if possible
    if (data.data && CSR.hasLevelDie.includes(data.type)) {
      const itemData = data.data;

      if (!itemData.level && itemData.levelDie) {
        try {
          // See if the formula is valid
          itemData.level = new Roll(itemData.levelDie).roll().total;
          await this.update({
            _id: this._id,
            "data.level": itemData.level,
          });
        } catch (e) {
          // If not, fallback to sane default
          itemData.level = itemData.level || null;
        }
      } else {
        itemData.level = itemData.level || null;
      }
    }

    return super.createEmbeddedEntity(...args);
  }
}
