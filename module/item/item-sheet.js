/* globals mergeObject */

import { CSR } from '../config.js';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CypherSystemItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cyphersystem", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/cyphersystemClean/templates/item";
    return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();

    data.stats = CSR.stats;
    data.trainingLevels = CSR.trainingLevels;

    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  _skillListeners(html) {
    html.find('select[name="data.stat"]').select2({
      theme: 'numenera',
      width: '110px',
      minimumResultsForSearch: Infinity
    });

    html.find('select[name="data.training"]').select2({
      theme: 'numenera',
      width: '110px',
      minimumResultsForSearch: Infinity
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.options.editable) {
      return;
    }

    const { type } = this.item.data;
    switch (type) {
      case 'skill':
        return this._skillListeners(html);
    }
  }
}
