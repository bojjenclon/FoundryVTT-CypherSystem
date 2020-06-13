/* globals $ mergeObject duplicate */

import { CSR } from '../config.js';

//Sort function for order
const sortFunction = (a, b) => a.data.order < b.data.order ? -1 : a.data.order > b.data.order ? 1 : 0;

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CypherSystemActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cyphersystem", "sheet", "actor"],
      width: 700,
      height: 600,
      tabs: [{ 
        navSelector: ".sheet-tabs", 
        contentSelector: ".sheet-body", 
        initial: "description" 
      }, {
        navSelector: '.stats-tabs',
        contentSelector: '.stats-body',
        initial: 'advancement'
      }]
    });
  }

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {
    return "systems/cyphersystemClean/templates/actor/pc-sheet.html";
  }

  /* -------------------------------------------- */

  constructor(...args) {
    super(...args);

    this.skillsStatFilter = -1;
  }

  _sortItemData(data, type, field) {
    const items = data.data.items;
    if (!items[field]) {
      items[field] = items.filter(i => i.type === type).sort(sortFunction);
    }
  }

  /** @override */
  getData() {
    const data = super.getData();
    
    data.isGM = game.user.isGM;

    data.ranges = CSR.ranges;
    data.stats = CSR.stats;
    data.weaponTypes = CSR.weaponTypes;
    data.weights = CSR.weightClasses;

    data.advances = Object.entries(data.actor.data.advances).map(
      ([key, value]) => {
        return {
          name: key,
          label: CSR.advances[key],
          isChecked: value,
        };
      }
    );

    data.damageTrackData = CSR.damageTrack;
    data.damageTrackDescription = CSR.damageTrack[data.data.damageTrack].description;

    data.recoveriesData = Object.entries(
      data.actor.data.recoveries
    ).map(([key, value]) => {
      return {
        key,
        label: CSR.recoveries[key],
        checked: value,
      };
    });

    data.data.items = data.actor.items || {};
    data.data.sorts = this.sorts || {};

    this._sortItemData(data, 'skill', 'skills');

    data.skillsStatFilter = this.skillsStatFilter;

    return data;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) {
      return;
    }

    // Setup select elements
    html.find('select[name="data.damageTrack"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });

    const skillsStatFilter = html.find('select[name="skillsStatFilter"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
    skillsStatFilter.on('change', evt => {
      this.skillsStatFilter = evt.target.value;
    });
  }
}
