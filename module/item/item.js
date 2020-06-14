/* globals Item game */

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

  _skillInfo() {
    const { data } = this;

    const training = EnumTraining[data.data.training];
    const pool = EnumPools[data.data.pool];

    const i18nTraining = game.i18n.localize(`CSR.training.${training.toLowerCase()}`);
    const i18nPool = game.i18n.localize(`CSR.pool.${pool.toLowerCase()}`);

    return `
      <h2>${data.name}</h2>
      <div class="grid grid-3col">
        <strong class="text-left">${i18nTraining}</strong>
        <strong class="text-center">${i18nPool}</strong>
        <div class="text-center">
          <div class="grid grid-3col actions">
            <a class="roll"><i class="fas fa-dice-d20"></i></a>
            <a class="edit"><i class="fas fa-edit"></i></a>
            <a class="delete"><i class="fas fa-trash"></i></a>
          </div>
        </div>
      </div>
      
      <hr>
      <p>${data.data.notes}</p>
    `;
  }

  /**
   * Returns specific 
   */
  get info() {
    switch (this.type) {
      case 'skill':
        return this._skillInfo();
    }

    return '';
  }
}
