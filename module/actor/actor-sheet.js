/* globals mergeObject Dialog ContextMenu */

import { CSR } from '../config.js';
import { cypherRoll } from '../rolls.js';
import { CypherSystemItem } from '../item/item.js';
import { deepProp } from '../utils.js';

import EnumPools from '../enums/enum-pool.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CypherSystemActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cyphersystem", "sheet", "actor"],
      width: 600,
      height: 500,
      tabs: [{ 
        navSelector: ".sheet-tabs", 
        contentSelector: ".sheet-body", 
        initial: "description" 
      }, {
        navSelector: '.stats-tabs',
        contentSelector: '.stats-body',
        initial: 'advancement'
      }],
      scrollY: [
        '.tab.inventory .inventory-list',
        '.tab.inventory .inventory-info',
      ]
    });
  }

  /**
   * Get the correct HTML template path to use for rendering this particular sheet
   * @type {String}
   */
  get template() {
    const { type } = this.actor.data;
    return `systems/cyphersystem/templates/actor/${type}-sheet.html`;
  }

  /* -------------------------------------------- */

  _pcInit() {
    this.skillsPoolFilter = -1;
    this.skillsTrainingFilter = -1;
    this.selectedSkill = null;

    this.abilityPoolFilter = -1;
    this.selectedAbility = null;

    this.inventoryTypeFilter = -1;
    this.selectedInvItem = null;
    this.filterEquipped = false;
  }

  _npcInit() {
  }

  constructor(...args) {
    super(...args);

    const { type } = this.actor.data;
    switch (type) {
      case 'pc':
        this._pcInit();
        break;
      case 'npc':
        this._npcInit();
        break;
    }
  }

  _generateItemData(data, type, field) {
    const items = data.data.items;
    if (!items[field]) {
      items[field] = items.filter(i => i.type === type); //.sort(sortFunction);
    }
  }

  _filterItemData(data, itemField, filterField, filterValue) {
    const items = data.data.items;
    items[itemField] = items[itemField].filter(itm => deepProp(itm, filterField) === filterValue);
  }

  async _skillData(data) {
    this._generateItemData(data, 'skill', 'skills');
    // Group skills by their pool, then alphanumerically
    data.data.items.skills.sort((a, b) => {
      if (a.data.pool === b.data.pool) {
        return (a.name > b.name) ? 1 : -1
      }

      return (a.data.pool > b.data.pool) ? 1 : -1;
    });

    data.skillsPoolFilter = this.skillsPoolFilter;
    data.skillsTrainingFilter = this.skillsTrainingFilter;

    if (data.skillsPoolFilter > -1) {
      this._filterItemData(data, 'skills', 'data.pool', parseInt(data.skillsPoolFilter, 10));
    }
    if (data.skillsTrainingFilter > -1) {
      this._filterItemData(data, 'skills', 'data.training', parseInt(data.skillsTrainingFilter, 10));
    }

    data.selectedSkill = this.selectedSkill;
    data.skillInfo = '';
    if (data.selectedSkill) {
      data.skillInfo = await data.selectedSkill.getInfo();
    }
  }

  async _abilityData(data) {
    this._generateItemData(data, 'ability', 'abilities');
    // Group abilities by their pool, then alphanumerically
    data.data.items.abilities.sort((a, b) => {
      if (a.data.cost.pool === b.data.cost.pool) {
        return (a.name > b.name) ? 1 : -1
      }

      return (a.data.cost.pool > b.data.cost.pool) ? 1 : -1;
    });

    data.abilityPoolFilter = this.abilityPoolFilter;

    if (data.abilityPoolFilter > -1) {
      this._filterItemData(data, 'abilities', 'data.cost.pool', parseInt(data.abilityPoolFilter, 10));
    }

    data.selectedAbility = this.selectedAbility;
    data.abilityInfo = '';
    if (data.selectedAbility) {
      data.abilityInfo = await data.selectedAbility.getInfo();
    }
  }

  async _inventoryData(data) {
    data.inventoryTypes = CSR.inventoryTypes;

    const items = data.data.items;
    if (!items.inventory) {
      items.inventory = items.filter(i => CSR.inventoryTypes.includes(i.type));

      if (this.filterEquipped) {
        items.inventory = items.inventory.filter(i => !!i.data.equipped);
      }

      // Group items by their type
      items.inventory.sort((a, b) => (a.type > b.type) ? 1 : -1);
    }

    data.cypherCount = items.reduce((count, i) => i.type === 'cypher' ? ++count : count, 0);
    data.overCypherLimit = this.actor.isOverCypherLimit;

    data.inventoryTypeFilter = this.inventoryTypeFilter;
    data.filterEquipped = this.filterEquipped;

    if (data.inventoryTypeFilter > -1) {
      this._filterItemData(data, 'inventory', 'type', CSR.inventoryTypes[parseInt(data.inventoryTypeFilter, 10)]);
    }

    data.selectedInvItem = this.selectedInvItem;
    data.invItemInfo = '';
    if (data.selectedInvItem) {
      data.invItemInfo = await data.selectedInvItem.getInfo();
    }
  }

  async _pcData(data) {
    data.isGM = game.user.isGM;

    data.currencyName = game.settings.get('cyphersystem', 'currencyName');

    data.ranges = CSR.ranges;
    data.stats = CSR.stats;
    data.weaponTypes = CSR.weaponTypes;
    data.weights = CSR.weightClasses;

    data.advances = Object.entries(data.actor.data.advances).map(
      ([key, value]) => {
        return {
          name: key,
          label: game.i18n.localize(`CSR.advance.${key}`),
          isChecked: value,
        };
      }
    );

    data.damageTrackData = CSR.damageTrack;
    data.damageTrack = CSR.damageTrack[data.data.damageTrack];

    data.recoveriesData = Object.entries(
      data.actor.data.recoveries
    ).map(([key, value]) => {
      return {
        key,
        label: game.i18n.localize(`CSR.recovery.${key}`),
        checked: value,
      };
    });

    data.trainingLevels = CSR.trainingLevels;

    data.data.items = data.actor.items || {};

    await this._skillData(data);
    await this._abilityData(data);
    await this._inventoryData(data);
  }

  async _npcData(data) {
    data.ranges = CSR.ranges;
  }

  /** @override */
  async getData() {
    const data = super.getData();
    
    const { type } = this.actor.data;
    switch (type) {
      case 'pc':
        await this._pcData(data);
        break;
      case 'npc':
        await this._npcData(data);
        break;
    }

    return data;
  }

  _createItem(itemName) {
    const itemData = {
      name: `New ${itemName.capitalize()}`,
      type: itemName,
      data: new CypherSystemItem({}),
    };

    this.actor.createOwnedItem(itemData, { renderSheet: true });
  }

  _rollPoolDialog(pool) {
    const { actor } = this;
    const actorData = actor.data.data;
    const poolName = EnumPools[pool];

    cypherRoll({
      parts: ['1d20'],

      data: {
        pool,
        maxEffort: actorData.effort,
      },
      event,
      
      title: game.i18n.localize('CSR.roll.pool.title'),
      flavor: game.i18n.localize('CSR.roll.pool.flavor').replace('##ACTOR##', actor.name).replace('##POOL##', poolName),

      actor,
      speaker: ChatMessage.getSpeaker({ actor }),
    });
  }

  _rollRecovery() {
    const { actor } = this;
    const actorData = actor.data.data;

    const roll = new Roll(`1d6+${actorData.recoveryMod}`).roll();

    // Flag the roll as a recovery roll
    roll.dice[0].options.recovery = true;

    roll.toMessage({
      title: game.i18n.localize('CSR.roll.recovery.title'),
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: game.i18n.localize('CSR.roll.recovery.flavor').replace('##ACTOR##', actor.name),
    });
  }

  _deleteItemDialog(itemId, callback) {
    const confirmationDialog = new Dialog({
      title: game.i18n.localize("CSR.dialog.delete.title"),
      content: `<p>${game.i18n.localize("CSR.dialog.delete.content")}</p><hr />`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("CSR.dialog.button.delete"),
          callback: () => {
            this.actor.deleteOwnedItem(itemId);

            if (callback) {
              callback(true);
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("CSR.dialog.button.cancel"),
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
    html.find('.roll-pool').click(evt => {
      evt.preventDefault();

      let el = evt.target;
      while (!el.dataset.pool) {
        el = el.parentElement;
      }
      const { pool } = el.dataset;

      this._rollPoolDialog(parseInt(pool, 10));
    });

    html.find('select[name="data.damageTrack"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });

    html.find('.recovery-roll').click(evt => {
      evt.preventDefault();

      this._rollRecovery();
    });
  }

  _skillsTabListeners(html) {
    // Skills Setup
    html.find('.add-skill').click(evt => {
      evt.preventDefault();

      this._createItem('skill');
    });
    
    const skillsPoolFilter = html.find('select[name="skillsPoolFilter"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
    skillsPoolFilter.on('change', evt => {
      this.skillsPoolFilter = evt.target.value;
      this.selectedSkill = null;
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

      let el = evt.target;
      // Account for clicking a child element
      while (!el.dataset.id) {
        el = el.parentElement;
      }
      const skillId = el.dataset.id;

      const actor = this.actor;
      const skill = actor.getOwnedItem(skillId);

      this.selectedSkill = skill;
    });

    const { selectedSkill } = this;
    if (selectedSkill) {
      html.find('.skill-info .actions .roll').click(evt => {
        evt.preventDefault();

        selectedSkill.roll();
        // this._rollItemDialog(selectedSkill.data.data.pool);
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

  _abilityTabListeners(html) {
    // Abilities Setup
    html.find('.add-ability').click(evt => {
      evt.preventDefault();

      this._createItem('ability');
    });

    const abilityPoolFilter = html.find('select[name="abilityPoolFilter"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
    abilityPoolFilter.on('change', evt => {
      this.abilityPoolFilter = evt.target.value;
      this.selectedAbility = null;
    });

    const abilities = html.find('a.ability');

    abilities.on('click', evt => {
      evt.preventDefault();

      this._onSubmit(evt);

      let el = evt.target;
      // Account for clicking a child element
      while (!el.dataset.id) {
        el = el.parentElement;
      }
      const abilityId = el.dataset.id;

      const actor = this.actor;
      const ability = actor.getOwnedItem(abilityId);

      this.selectedAbility = ability;
    });

    const { selectedAbility } = this;
    if (selectedAbility) {
      html.find('.ability-info .actions .roll').click(evt => {
        evt.preventDefault();

        selectedAbility.roll();
      });

      html.find('.ability-info .actions .edit').click(evt => {
        evt.preventDefault();

        this.selectedAbility.sheet.render(true);
      });

      html.find('.ability-info .actions .delete').click(evt => {
        evt.preventDefault();

        this._deleteItemDialog(this.selectedAbility._id, didDelete => {
          if (didDelete) {
            this.selectedAbility = null;
          }
        });
      });
    }
  }

  _inventoryTabListeners(html) {
    // Inventory Setup

    const ctxtMenuEl = html.find('.contextmenu');
    const addInvBtn = html.find('.add-inventory');

    const menuItems = [];
    CSR.inventoryTypes.forEach(type => {
      menuItems.push({
        name: game.i18n.localize(`CSR.inventory.${type}`),
        icon: '',
        callback: () => {
          this._createItem(type);
        }
      });
    });
    const ctxtMenuObj = new ContextMenu(html, '.active', menuItems);
    
    addInvBtn.click(evt => {
      evt.preventDefault();

      // A bit of a hack to ensure the context menu isn't
      // cut off due to the sheet's content relying on
      // overflow hidden. Instead, we nest the menu inside
      // a floating absolutely positioned div, set to overlap
      // the add inventory item icon.
      ctxtMenuEl.offset(addInvBtn.offset());

      ctxtMenuObj.render(ctxtMenuEl.find('.container'));
    });

    html.on('mousedown', evt => {
      if (evt.target === addInvBtn[0]) {
        return;
      }

      // Close the context menu if user clicks anywhere else
      ctxtMenuObj.close();
    });

    const inventoryTypeFilter = html.find('select[name="inventoryTypeFilter"]').select2({
      theme: 'numenera',
      width: '130px',
      minimumResultsForSearch: Infinity
    });
    inventoryTypeFilter.on('change', evt => {
      this.inventoryTypeFilter = evt.target.value;
      this.selectedInvItem = null;
    });

    html.find('.filter-equipped').click(evt => {
      evt.preventDefault();

      this.filterEquipped = !this.filterEquipped;

      this._onSubmit(evt);
    });

    const invItems = html.find('a.inv-item');

    invItems.on('click', evt => {
      evt.preventDefault();

      this._onSubmit(evt);

      let el = evt.target;
      // Account for clicking a child element
      while (!el.dataset.id) {
        el = el.parentElement;
      }
      const invItemId = el.dataset.id;

      const actor = this.actor;
      const invItem = actor.getOwnedItem(invItemId);

      this.selectedInvItem = invItem;
    });

    const { selectedInvItem } = this;
    if (selectedInvItem) {
      html.find('.inventory-info .actions .edit').click(evt => {
        evt.preventDefault();

        this.selectedInvItem.sheet.render(true);
      });

      html.find('.inventory-info .actions .delete').click(evt => {
        evt.preventDefault();

        this._deleteItemDialog(this.selectedInvItem._id, didDelete => {
          if (didDelete) {
            this.selectedInvItem = null;
          }
        });
      });
    }
  }

  _pcListeners(html) {
    html.closest('.window-app.sheet.actor').addClass('pc-window');

    // Hack, for some reason the inner tab's content doesn't show 
    // when changing primary tabs within the sheet
    html.find('.item[data-tab="stats"]').click(() => {
      const selectedSubTab = html.find('.stats-tabs .item.active').first();
      const selectedSubPage = html.find(`.stats-body .tab[data-tab="${selectedSubTab.data('tab')}"]`);

      setTimeout(() => {
        selectedSubPage.addClass('active');
      }, 0);
    });

    this._statsTabListeners(html);
    this._skillsTabListeners(html);
    this._abilityTabListeners(html);
    this._inventoryTabListeners(html);
  }

  _npcListeners(html) {
    html.closest('.window-app.sheet.actor').addClass('npc-window');

    html.find('select[name="data.movement"]').select2({
      theme: 'numenera',
      width: '120px',
      minimumResultsForSearch: Infinity
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    if (!this.options.editable) {
      return;
    }

    const { type } = this.actor.data;
    switch (type) {
      case 'pc':
        this._pcListeners(html);
        break;
      case 'npc':
        this._npcListeners(html);
        break;
    }
  }
}
