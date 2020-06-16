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
      width: 300,
      height: 200
    });
  }

  /** @override */
  get template() {
    const path = "systems/cyphersystem/templates/item";
    return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  _skillData(data) {
    data.stats = CSR.stats;
    data.trainingLevels = CSR.trainingLevels;
  }

  _abilityData(data) {
    data.ranges = CSR.optionalRanges;
    data.stats = CSR.stats;
  }

  _armorData(data) {
    data.weightClasses = CSR.weightClasses;
  }

  _weaponData(data) {
    data.ranges = CSR.ranges;
    data.weaponTypes = CSR.weaponTypes;
    data.weightClasses = CSR.weightClasses;
  }

  _gearData(data) {
  }

  _cypherData(data) {
    data.isGM = game.user.isGM;
  }

  _artifactData(data) {
    data.isGM = game.user.isGM;
  }

  _oddityData(data) {
    data.isGM = game.user.isGM;
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
      case 'armor':
        this._armorData(data);
        break;
      case 'weapon':
        this._weaponData(data);
        break;
      case 'gear':
        this._gearData(data);
        break;
      case 'cypher':
        this._cypherData(data);
        break;
      case 'artifact':
        this._artifactData(data);
        break;
      case 'oddity':
        this._oddityData(data);
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

  _armorListeners(html) {
    html.closest('.window-app.sheet.item').addClass('armor-window');

    html.find('select[name="data.weight"]').select2({
      theme: 'numenera',
      width: '100px',
      minimumResultsForSearch: Infinity
    });
  }

  _weaponListeners(html) {
    html.closest('.window-app.sheet.item').addClass('weapon-window');

    html.find('select[name="data.weight"]').select2({
      theme: 'numenera',
      width: '110px',
      minimumResultsForSearch: Infinity
    });

    html.find('select[name="data.weaponType"]').select2({
      theme: 'numenera',
      width: '110px',
      minimumResultsForSearch: Infinity
    });

    html.find('select[name="data.range"]').select2({
      theme: 'numenera',
      width: '120px',
      minimumResultsForSearch: Infinity
    });
  }

  _gearListeners(html) {
    html.closest('.window-app.sheet.item').addClass('gear-window');
  }

  _cypherListeners(html) {
    html.closest('.window-app.sheet.item').addClass('cypher-window');
  }

  _artifactListeners(html) {
    html.closest('.window-app.sheet.item').addClass('artifact-window');
  }

  _oddityListeners(html) {
    html.closest('.window-app.sheet.item').addClass('oddity-window');
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
      case 'armor':
        this._armorListeners(html);
        break;
      case 'weapon':
        this._weaponListeners(html);
        break;
      case 'gear':
        this._gearListeners(html);
        break;
      case 'cypher':
        this._cypherListeners(html);
        break;
      case 'artifact':
        this._artifactListeners(html);
        break;
      case 'oddity':
        this._oddityListeners(html);
        break;
    }
  }
}
