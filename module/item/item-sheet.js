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
      width: 500,
      height: 500,
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

  _skillData(data) {
    data.stats = CSR.stats;
    data.trainingLevels = CSR.trainingLevels;
  }

  _abilityData(data) {
    data.data.ranges = CSR.optionalRanges;
    data.data.stats = CSR.stats;
  }

  /** @override */
  getData() {
    const data = super.getData();

    const { type } = this.item.data;
    switch (type) {
      case 'skill':
        this._skillData(data);
        break;
      case 'ability':
        this._abilityData(data);
        break;
    }

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
    html.closest('.window-app.sheet.item').addClass('skill-window');

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

  _abilityListeners(html) {
    html.closest('.window-app.sheet.item').addClass('ability-window');

    html.find('select[name="data.isEnabler"]').select2({
      theme: 'numenera',
      width: '220px',
      minimumResultsForSearch: Infinity
    });

    html.find('select[name="data.cost.pool"]').select2({
      theme: 'numenera',
      width: '85px',
      minimumResultsForSearch: Infinity
    });

    html.find('select[name="data.range"]').select2({
      theme: 'numenera',
      width: '120px',
      minimumResultsForSearch: Infinity
    });

    const cbIdentified = html.find('#cb-identified');
    cbIdentified.on('change', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      this.item.update({
        'data.identified': ev.target.checked
      });
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
        this._skillListeners(html);
        break;
      case 'ability':
        this._abilityListeners(html);
        break;
    }
  }
}
