/* globals mergeObject Dialog */

import { CSR } from '../config.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CypherSystemActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cyphersystem", "sheet", "actor"],
      width: 672,
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

    this.skillsPoolFilter = -1;
    this.skillsTrainingFilter = -1;
    this.selectedSkill = null;
  }

  _generateItemData(data, type, field) {
    const items = data.data.items;
    if (!items[field]) {
      items[field] = items.filter(i => i.type === type); //.sort(sortFunction);
    }
  }

  _filterItemData(data, itemField, filterField, filterValue) {
    const items = data.data.items;
    items[itemField] = items[itemField].filter(itm => itm.data[filterField] === filterValue);
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

    data.trainingLevels = CSR.trainingLevels;

    data.data.items = data.actor.items || {};

    this._generateItemData(data, 'skill', 'skills');

    data.skillsPoolFilter = this.skillsPoolFilter;
    data.skillsTrainingFilter = this.skillsTrainingFilter;

    if (data.skillsPoolFilter > -1) {
      this._filterItemData(data, 'skills', 'pool', parseInt(data.skillsPoolFilter, 10));
    }
    if (data.skillsTrainingFilter > -1) {
      this._filterItemData(data, 'skills', 'training', parseInt(data.skillsTrainingFilter, 10));
    }

    data.selectedSkill = this.selectedSkill;
    data.skillInfo = data.selectedSkill ? this.selectedSkill.info : '';

    return data;
  }

  _deleteItemDialog(itemId, callback) {
    const confirmationDialog = new Dialog({
      title: game.i18n.localize("CSR.deleteDialogTitle"),
      content: `<p>${game.i18n.localize("CSR.deleteDialogContent")}</p><hr />`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("CSR.deleteButton"),
          callback: () => {
            this.actor.deleteOwnedItem(itemId);

            if (callback) {
              callback(true);
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("CSR.cancelButton"),
          callback: () => {
            if (callback) {
              callback(false);
            }
          }
        }
      },
      default: "cancel"
    });
    confirmationDialog.render(true);
  }

  _statsTabListeners(html) {
    // Stats Setup
    html.find('select[name="data.damageTrack"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
  }

  _skillsTabListeners(html) {
    // Skills Setup
    const skillsPoolFilter = html.find('select[name="skillsPoolFilter"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
    skillsPoolFilter.on('change', evt => {
      this.skillsPoolFilter = evt.target.value;
    });

    const skillsTrainingFilter = html.find('select[name="skillsTrainingFilter"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
    skillsTrainingFilter.on('change', evt => {
      this.skillsTrainingFilter = evt.target.value;
    });

    const skills = html.find('a.skill');

    skills.on('click', evt => {
      evt.preventDefault();

      this._onSubmit(evt);

      const el = evt.target;
      const skillId = el.dataset.id;

      const actor = this.actor;
      const skill = actor.getOwnedItem(skillId);

      this.selectedSkill = skill;
    });

    const { selectedSkill } = this;
    if (selectedSkill) {
      html.find('.skill-info .actions .roll').click(evt => {
        evt.preventDefault();

        console.log('roll');
      });

      html.find('.skill-info .actions .edit').click(evt => {
        evt.preventDefault();

        this.selectedSkill.sheet.render(true);
      });

      html.find('.skill-info .actions .delete').click(evt => {
        evt.preventDefault();

        this._deleteItemDialog(this.selectedSkill._id, didDelete => {
          if (didDelete) {
            this.selectedSkill = null;
          }
        });
      });
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.options.editable) {
      return;
    }

    this._statsTabListeners(html);
    this._skillsTabListeners(html);
  }
}
