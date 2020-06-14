/* globals Item game */

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
    const { pool, } = item.data;
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

  roll() {
    switch (this.type) {
      case 'skill':
        this._skillRoll();
    }
  }

  /**
   * Info
   */

  _skillInfo() {
    const { data } = this;

    const training = EnumTraining[data.data.training];
    const pool = EnumPools[data.data.pool];

    const i18nTraining = game.i18n.localize(`CSR.training.${training.toLowerCase()}`);
    const i18nPool = game.i18n.localize(`CSR.pool.${pool.toLowerCase()}`);

    const i18nRoll = game.i18n.localize('CSR.tooltip.roll');
    const i18nEdit = game.i18n.localize('CSR.tooltip.edit');
    const i18nDelete = game.i18n.localize('CSR.tooltip.delete');

    return `
      <h2>${data.name}</h2>
      <div class="grid grid-3col">
        <strong class="text-left">${i18nTraining}</strong>
        <strong class="text-center">${i18nPool}</strong>
        <div class="text-center">
          <div class="grid grid-3col actions">
            <a class="roll" title="${i18nRoll}"><i class="fas fa-dice-d20"></i></a>
            <a class="edit" title="${i18nEdit}"><i class="fas fa-edit"></i></a>
            <a class="delete" title="${i18nDelete}"><i class="fas fa-trash"></i></a>
          </div>
        </div>
      </div>
      
      <hr>
      <p>${data.data.notes}</p>
    `;
  }

  get info() {
    switch (this.type) {
      case 'skill':
        return this._skillInfo();
    }

    return '';
  }
}
