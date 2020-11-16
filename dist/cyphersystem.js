/*! cyphersystem v1.0.0 | (c) 2020 Cornell Daly | MIT License | https://github.com/bojjenclon/ */

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,(function(r){var n=e[i][1][r];return o(n||r)}),p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemActorSheet = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _config = require("../config.js");

var _rolls = require("../rolls.js");

var _item = require("../item/item.js");

var _utils = require("../utils.js");

var _enumPool = _interopRequireDefault(require("../enums/enum-pool.js"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
var CypherSystemActorSheet = /*#__PURE__*/(function (_ActorSheet) {
  (0, _inherits2.default)(CypherSystemActorSheet, _ActorSheet);

  var _super = _createSuper(CypherSystemActorSheet);

  (0, _createClass2.default)(CypherSystemActorSheet, [{
    key: "_pcInit",

    /* -------------------------------------------- */
    value: function _pcInit() {
      this.skillsPoolFilter = -1;
      this.skillsTrainingFilter = -1;
      this.selectedSkill = null;
      this.abilityPoolFilter = -1;
      this.selectedAbility = null;
      this.inventoryTypeFilter = -1;
      this.selectedInvItem = null;
      this.filterEquipped = false;
    }
  }, {
    key: "_npcInit",
    value: function _npcInit() {}
  }, {
    key: "template",

    /**
     * Get the correct HTML template path to use for rendering this particular sheet
     * @type {String}
     */
    get: function get() {
      var type = this.actor.data.type;
      return "systems/cyphersystem/templates/actor/".concat(type, "-sheet.html");
    }
  }], [{
    key: "defaultOptions",

    /** @override */
    get: function get() {
      return mergeObject((0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet), "defaultOptions", this), {
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
        scrollY: ['.tab.inventory .inventory-list', '.tab.inventory .inventory-info']
      });
    }
  }]);

  function CypherSystemActorSheet() {
    var _this;

    (0, _classCallCheck2.default)(this, CypherSystemActorSheet);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    var type = _this.actor.data.type;

    switch (type) {
      case 'pc':
        _this._pcInit();

        break;

      case 'npc':
        _this._npcInit();

        break;
    }

    return _this;
  }

  (0, _createClass2.default)(CypherSystemActorSheet, [{
    key: "_generateItemData",
    value: function _generateItemData(data, type, field) {
      var items = data.data.items;

      if (!items[field]) {
        items[field] = items.filter((function (i) {
          return i.type === type;
        })); //.sort(sortFunction);
      }
    }
  }, {
    key: "_filterItemData",
    value: function _filterItemData(data, itemField, filterField, filterValue) {
      var items = data.data.items;
      items[itemField] = items[itemField].filter((function (itm) {
        return (0, _utils.deepProp)(itm, filterField) === filterValue;
      }));
    }
  }, {
    key: "_skillData",
    value: (function () {
      var _skillData2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee(data) {
        return _regenerator.default.wrap((function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._generateItemData(data, 'skill', 'skills'); // Group skills by their pool, then alphanumerically


                data.data.items.skills.sort((function (a, b) {
                  if (a.data.pool === b.data.pool) {
                    return a.name > b.name ? 1 : -1;
                  }

                  return a.data.pool > b.data.pool ? 1 : -1;
                }));
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

                if (!data.selectedSkill) {
                  _context.next = 12;
                  break;
                }

                _context.next = 11;
                return data.selectedSkill.getInfo();

              case 11:
                data.skillInfo = _context.sent;

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }), _callee, this);
      })));

      function _skillData(_x) {
        return _skillData2.apply(this, arguments);
      }

      return _skillData;
    })()
  }, {
    key: "_abilityData",
    value: (function () {
      var _abilityData2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2(data) {
        return _regenerator.default.wrap((function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this._generateItemData(data, 'ability', 'abilities'); // Group abilities by their pool, then alphanumerically


                data.data.items.abilities.sort((function (a, b) {
                  if (a.data.cost.pool === b.data.cost.pool) {
                    return a.name > b.name ? 1 : -1;
                  }

                  return a.data.cost.pool > b.data.cost.pool ? 1 : -1;
                }));
                data.abilityPoolFilter = this.abilityPoolFilter;

                if (data.abilityPoolFilter > -1) {
                  this._filterItemData(data, 'abilities', 'data.cost.pool', parseInt(data.abilityPoolFilter, 10));
                }

                data.selectedAbility = this.selectedAbility;
                data.abilityInfo = '';

                if (!data.selectedAbility) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 9;
                return data.selectedAbility.getInfo();

              case 9:
                data.abilityInfo = _context2.sent;

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }), _callee2, this);
      })));

      function _abilityData(_x2) {
        return _abilityData2.apply(this, arguments);
      }

      return _abilityData;
    })()
  }, {
    key: "_inventoryData",
    value: (function () {
      var _inventoryData2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee3(data) {
        var items;
        return _regenerator.default.wrap((function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data.inventoryTypes = _config.CSR.inventoryTypes;
                items = data.data.items;

                if (!items.inventory) {
                  items.inventory = items.filter((function (i) {
                    return _config.CSR.inventoryTypes.includes(i.type);
                  }));

                  if (this.filterEquipped) {
                    items.inventory = items.inventory.filter((function (i) {
                      return !!i.data.equipped;
                    }));
                  } // Group items by their type, then alphanumerically


                  items.inventory.sort((function (a, b) {
                    if (a.type === b.type) {
                      return a.name > b.name ? 1 : -1;
                    }

                    return a.type > b.type ? 1 : -1;
                  }));
                }

                data.cypherCount = items.reduce((function (count, i) {
                  return i.type === 'cypher' ? ++count : count;
                }), 0);
                data.overCypherLimit = this.actor.isOverCypherLimit;
                data.inventoryTypeFilter = this.inventoryTypeFilter;
                data.filterEquipped = this.filterEquipped;

                if (data.inventoryTypeFilter > -1) {
                  this._filterItemData(data, 'inventory', 'type', _config.CSR.inventoryTypes[parseInt(data.inventoryTypeFilter, 10)]);
                }

                data.selectedInvItem = this.selectedInvItem;
                data.invItemInfo = '';

                if (!data.selectedInvItem) {
                  _context3.next = 14;
                  break;
                }

                _context3.next = 13;
                return data.selectedInvItem.getInfo();

              case 13:
                data.invItemInfo = _context3.sent;

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }), _callee3, this);
      })));

      function _inventoryData(_x3) {
        return _inventoryData2.apply(this, arguments);
      }

      return _inventoryData;
    })()
  }, {
    key: "_pcData",
    value: (function () {
      var _pcData2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee4(data) {
        return _regenerator.default.wrap((function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data.isGM = game.user.isGM;
                data.currencyName = game.settings.get('cyphersystem', 'currencyName');
                data.ranges = _config.CSR.ranges;
                data.stats = _config.CSR.stats;
                data.weaponTypes = _config.CSR.weaponTypes;
                data.weights = _config.CSR.weightClasses;
                data.advances = Object.entries(data.actor.data.advances).map((function (_ref) {
                  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
                      key = _ref2[0],
                      value = _ref2[1];

                  return {
                    name: key,
                    label: game.i18n.localize("CSR.advance.".concat(key)),
                    isChecked: value
                  };
                }));
                data.damageTrackData = _config.CSR.damageTrack;
                data.damageTrack = _config.CSR.damageTrack[data.data.damageTrack];
                data.recoveriesData = Object.entries(data.actor.data.recoveries).map((function (_ref3) {
                  var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
                      key = _ref4[0],
                      value = _ref4[1];

                  return {
                    key: key,
                    label: game.i18n.localize("CSR.recovery.".concat(key)),
                    checked: value
                  };
                }));
                data.trainingLevels = _config.CSR.trainingLevels;
                data.data.items = data.actor.items || {};
                _context4.next = 14;
                return this._skillData(data);

              case 14:
                _context4.next = 16;
                return this._abilityData(data);

              case 16:
                _context4.next = 18;
                return this._inventoryData(data);

              case 18:
              case "end":
                return _context4.stop();
            }
          }
        }), _callee4, this);
      })));

      function _pcData(_x4) {
        return _pcData2.apply(this, arguments);
      }

      return _pcData;
    })()
  }, {
    key: "_npcData",
    value: (function () {
      var _npcData2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee5(data) {
        return _regenerator.default.wrap((function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                data.ranges = _config.CSR.ranges;

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }), _callee5);
      })));

      function _npcData(_x5) {
        return _npcData2.apply(this, arguments);
      }

      return _npcData;
    })()
    /** @override */

  }, {
    key: "getData",
    value: (function () {
      var _getData = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee6() {
        var data, type;
        return _regenerator.default.wrap((function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                data = (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet.prototype), "getData", this).call(this);
                type = this.actor.data.type;
                _context6.t0 = type;
                _context6.next = _context6.t0 === 'pc' ? 5 : _context6.t0 === 'npc' ? 8 : 11;
                break;

              case 5:
                _context6.next = 7;
                return this._pcData(data);

              case 7:
                return _context6.abrupt("break", 11);

              case 8:
                _context6.next = 10;
                return this._npcData(data);

              case 10:
                return _context6.abrupt("break", 11);

              case 11:
                return _context6.abrupt("return", data);

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }), _callee6, this);
      })));

      function getData() {
        return _getData.apply(this, arguments);
      }

      return getData;
    })()
  }, {
    key: "_createItem",
    value: function _createItem(itemName) {
      var itemData = {
        name: "New ".concat(itemName.capitalize()),
        type: itemName,
        data: new _item.CypherSystemItem({})
      };
      this.actor.createOwnedItem(itemData, {
        renderSheet: true
      });
    }
  }, {
    key: "_rollPoolDialog",
    value: function _rollPoolDialog(pool) {
      var actor = this.actor;
      var actorData = actor.data.data;
      var poolName = _enumPool.default[pool];
      var freeEffort = actor.getFreeEffortFromStat(pool);
      (0, _rolls.cypherRoll)({
        parts: ['1d20'],
        data: {
          pool: pool,
          effort: freeEffort,
          maxEffort: actorData.effort
        },
        event: event,
        title: game.i18n.localize('CSR.roll.pool.title').replace('##POOL##', poolName),
        flavor: game.i18n.localize('CSR.roll.pool.flavor').replace('##ACTOR##', actor.name).replace('##POOL##', poolName),
        actor: actor,
        speaker: ChatMessage.getSpeaker({
          actor: actor
        })
      });
    }
  }, {
    key: "_rollRecovery",
    value: function _rollRecovery() {
      var actor = this.actor;
      var actorData = actor.data.data;
      var roll = new Roll("1d6+".concat(actorData.recoveryMod)).roll(); // Flag the roll as a recovery roll

      roll.dice[0].options.recovery = true;
      roll.toMessage({
        title: game.i18n.localize('CSR.roll.recovery.title'),
        speaker: ChatMessage.getSpeaker({
          actor: actor
        }),
        flavor: game.i18n.localize('CSR.roll.recovery.flavor').replace('##ACTOR##', actor.name)
      });
    }
  }, {
    key: "_deleteItemDialog",
    value: function _deleteItemDialog(itemId, _callback) {
      var _this2 = this;

      var confirmationDialog = new Dialog({
        title: game.i18n.localize("CSR.dialog.delete.title"),
        content: "<p>".concat(game.i18n.localize("CSR.dialog.delete.content"), "</p><hr />"),
        buttons: {
          confirm: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("CSR.dialog.button.delete"),
            callback: function callback() {
              _this2.actor.deleteOwnedItem(itemId);

              if (_callback) {
                _callback(true);
              }
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("CSR.dialog.button.cancel"),
            callback: function callback() {
              if (_callback) {
                _callback(false);
              }
            }
          }
        },
        default: "cancel"
      });
      confirmationDialog.render(true);
    }
  }, {
    key: "_statsTabListeners",
    value: function _statsTabListeners(html) {
      var _this3 = this;

      // Stats Setup
      var poolRolls = html.find('.roll-pool');
      poolRolls.click((function (evt) {
        evt.preventDefault();
        var el = evt.target;

        while (!el.dataset.pool) {
          el = el.parentElement;
        }

        var pool = el.dataset.pool;

        _this3._rollPoolDialog(parseInt(pool, 10));
      }));

      if (this.actor.owner) {
        // Pools require custom drag logic since we're  
        // not creating a macro for an item
        var handler = function handler(ev) {
          ev.dataTransfer.setData('text/plain', JSON.stringify({
            actorId: _this3.actor.id,
            data: {
              type: 'pool',
              pool: ev.currentTarget.dataset.pool
            }
          }));
        };

        poolRolls.each((function (_, el) {
          el.setAttribute('draggable', true);
          el.addEventListener('dragstart', handler, false);
        }));
      }

      html.find('select[name="data.damageTrack"]').select2({
        theme: 'numenera',
        width: '130px',
        minimumResultsForSearch: Infinity
      });
      html.find('.recovery-roll').click((function (evt) {
        evt.preventDefault();

        _this3._rollRecovery();
      }));
    }
  }, {
    key: "_skillsTabListeners",
    value: function _skillsTabListeners(html) {
      var _this4 = this;

      // Skills Setup
      html.find('.add-skill').click((function (evt) {
        evt.preventDefault();

        _this4._createItem('skill');
      }));
      var skillsPoolFilter = html.find('select[name="skillsPoolFilter"]').select2({
        theme: 'numenera',
        width: '130px',
        minimumResultsForSearch: Infinity
      });
      skillsPoolFilter.on('change', (function (evt) {
        _this4.skillsPoolFilter = evt.target.value;
        _this4.selectedSkill = null;
      }));
      var skillsTrainingFilter = html.find('select[name="skillsTrainingFilter"]').select2({
        theme: 'numenera',
        width: '130px',
        minimumResultsForSearch: Infinity
      });
      skillsTrainingFilter.on('change', (function (evt) {
        _this4.skillsTrainingFilter = evt.target.value;
      }));
      var skills = html.find('a.skill');
      skills.on('click', (function (evt) {
        evt.preventDefault();
        var el = evt.target; // Account for clicking a child element

        while (!el.dataset.itemId) {
          el = el.parentElement;
        }

        var skillId = el.dataset.itemId;
        var actor = _this4.actor;
        var skill = actor.getOwnedItem(skillId);
        _this4.selectedSkill = skill;

        _this4.render(true);
      }));

      if (this.actor.owner) {
        var handler = function handler(ev) {
          return _this4._onDragItemStart(ev);
        };

        skills.each((function (_, el) {
          el.setAttribute('draggable', true);
          el.addEventListener('dragstart', handler, false);
        }));
      }

      var selectedSkill = this.selectedSkill;

      if (selectedSkill) {
        html.find('.skill-info .actions .roll').click((function (evt) {
          evt.preventDefault();
          selectedSkill.roll();
        }));
        html.find('.skill-info .actions .edit').click((function (evt) {
          evt.preventDefault();

          _this4.selectedSkill.sheet.render(true);
        }));
        html.find('.skill-info .actions .delete').click((function (evt) {
          evt.preventDefault();

          _this4._deleteItemDialog(_this4.selectedSkill._id, (function (didDelete) {
            if (didDelete) {
              _this4.selectedSkill = null;
            }
          }));
        }));
      }
    }
  }, {
    key: "_abilityTabListeners",
    value: function _abilityTabListeners(html) {
      var _this5 = this;

      // Abilities Setup
      html.find('.add-ability').click((function (evt) {
        evt.preventDefault();

        _this5._createItem('ability');
      }));
      var abilityPoolFilter = html.find('select[name="abilityPoolFilter"]').select2({
        theme: 'numenera',
        width: '130px',
        minimumResultsForSearch: Infinity
      });
      abilityPoolFilter.on('change', (function (evt) {
        _this5.abilityPoolFilter = evt.target.value;
        _this5.selectedAbility = null;
      }));
      var abilities = html.find('a.ability');
      abilities.on('click', (function (evt) {
        evt.preventDefault();
        var el = evt.target; // Account for clicking a child element

        while (!el.dataset.itemId) {
          el = el.parentElement;
        }

        var abilityId = el.dataset.itemId;
        var actor = _this5.actor;
        var ability = actor.getOwnedItem(abilityId);
        _this5.selectedAbility = ability;

        _this5.render(true);
      }));

      if (this.actor.owner) {
        var handler = function handler(ev) {
          return _this5._onDragItemStart(ev);
        };

        abilities.each((function (_, el) {
          el.setAttribute('draggable', true);
          el.addEventListener('dragstart', handler, false);
        }));
      }

      var selectedAbility = this.selectedAbility;

      if (selectedAbility) {
        html.find('.ability-info .actions .roll').click((function (evt) {
          evt.preventDefault();
          selectedAbility.roll();
        }));
        html.find('.ability-info .actions .edit').click((function (evt) {
          evt.preventDefault();

          _this5.selectedAbility.sheet.render(true);
        }));
        html.find('.ability-info .actions .delete').click((function (evt) {
          evt.preventDefault();

          _this5._deleteItemDialog(_this5.selectedAbility._id, (function (didDelete) {
            if (didDelete) {
              _this5.selectedAbility = null;
            }
          }));
        }));
      }
    }
  }, {
    key: "_inventoryTabListeners",
    value: function _inventoryTabListeners(html) {
      var _this6 = this;

      // Inventory Setup
      var ctxtMenuEl = html.find('.contextmenu');
      var addInvBtn = html.find('.add-inventory');
      var menuItems = [];

      _config.CSR.inventoryTypes.forEach((function (type) {
        menuItems.push({
          name: game.i18n.localize("CSR.inventory.".concat(type)),
          icon: '',
          callback: function callback() {
            _this6._createItem(type);
          }
        });
      }));

      var ctxtMenuObj = new ContextMenu(html, '.active', menuItems);
      addInvBtn.click((function (evt) {
        evt.preventDefault(); // A bit of a hack to ensure the context menu isn't
        // cut off due to the sheet's content relying on
        // overflow hidden. Instead, we nest the menu inside
        // a floating absolutely positioned div, set to overlap
        // the add inventory item icon.

        ctxtMenuEl.offset(addInvBtn.offset());
        ctxtMenuObj.render(ctxtMenuEl.find('.container'));
      }));
      html.on('mousedown', (function (evt) {
        if (evt.target === addInvBtn[0]) {
          return;
        } // Close the context menu if user clicks anywhere else


        ctxtMenuObj.close();
      }));
      var inventoryTypeFilter = html.find('select[name="inventoryTypeFilter"]').select2({
        theme: 'numenera',
        width: '130px',
        minimumResultsForSearch: Infinity
      });
      inventoryTypeFilter.on('change', (function (evt) {
        _this6.inventoryTypeFilter = evt.target.value;
        _this6.selectedInvItem = null;
      }));
      html.find('.filter-equipped').click((function (evt) {
        evt.preventDefault();
        _this6.filterEquipped = !_this6.filterEquipped;

        _this6.render(true);
      }));
      var invItems = html.find('a.inv-item');
      invItems.on('click', (function (evt) {
        evt.preventDefault();
        var el = evt.target; // Account for clicking a child element

        while (!el.dataset.itemId) {
          el = el.parentElement;
        }

        var invItemId = el.dataset.itemId;
        var actor = _this6.actor;
        var invItem = actor.getOwnedItem(invItemId);
        _this6.selectedInvItem = invItem;

        _this6.render(true);
      }));

      if (this.actor.owner) {
        var handler = function handler(ev) {
          return _this6._onDragItemStart(ev);
        };

        invItems.each((function (_, el) {
          el.setAttribute('draggable', true);
          el.addEventListener('dragstart', handler, false);
        }));
      }

      var selectedInvItem = this.selectedInvItem;

      if (selectedInvItem) {
        html.find('.inventory-info .actions .edit').click((function (evt) {
          evt.preventDefault();

          _this6.selectedInvItem.sheet.render(true);
        }));
        html.find('.inventory-info .actions .delete').click((function (evt) {
          evt.preventDefault();

          _this6._deleteItemDialog(_this6.selectedInvItem._id, (function (didDelete) {
            if (didDelete) {
              _this6.selectedInvItem = null;
            }
          }));
        }));
      }
    }
  }, {
    key: "_pcListeners",
    value: function _pcListeners(html) {
      html.closest('.window-app.sheet.actor').addClass('pc-window'); // Hack, for some reason the inner tab's content doesn't show 
      // when changing primary tabs within the sheet

      html.find('.item[data-tab="stats"]').click((function () {
        var selectedSubTab = html.find('.stats-tabs .item.active').first();
        var selectedSubPage = html.find(".stats-body .tab[data-tab=\"".concat(selectedSubTab.data('tab'), "\"]"));
        setTimeout((function () {
          selectedSubPage.addClass('active');
        }), 0);
      }));

      this._statsTabListeners(html);

      this._skillsTabListeners(html);

      this._abilityTabListeners(html);

      this._inventoryTabListeners(html);
    }
  }, {
    key: "_npcListeners",
    value: function _npcListeners(html) {
      html.closest('.window-app.sheet.actor').addClass('npc-window');
      html.find('select[name="data.movement"]').select2({
        theme: 'numenera',
        width: '120px',
        minimumResultsForSearch: Infinity
      });
    }
    /** @override */

  }, {
    key: "activateListeners",
    value: function activateListeners(html) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet.prototype), "activateListeners", this).call(this, html);

      if (!this.options.editable) {
        return;
      }

      var type = this.actor.data.type;

      switch (type) {
        case 'pc':
          this._pcListeners(html);

          break;

        case 'npc':
          this._npcListeners(html);

          break;
      }
    }
    /** @override */

  }, {
    key: "_onDragItemStart",
    value: function _onDragItemStart(event) {
      var itemId = event.currentTarget.dataset.itemId;
      var clickedItem = this.actor.getEmbeddedEntity('OwnedItem', itemId);
      event.dataTransfer.setData('text/plain', JSON.stringify({
        actorId: this.actor.id,
        data: clickedItem
      }));
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet.prototype), "_onDragItemStart", this).call(this, event);
    }
  }]);
  return CypherSystemActorSheet;
})(ActorSheet);

exports.CypherSystemActorSheet = CypherSystemActorSheet;

},{"../config.js":5,"../enums/enum-pool.js":11,"../item/item.js":18,"../rolls.js":22,"../utils.js":26,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39,"@babel/runtime/helpers/slicedToArray":41,"@babel/runtime/regenerator":46}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemActor = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get3 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _config = require("../config.js");

var _utils = require("../utils.js");

var _playerChoiceDialog = require("../dialog/player-choice-dialog.js");

var _enumPool = _interopRequireDefault(require("../enums/enum-pool.js"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
var CypherSystemActor = /*#__PURE__*/(function (_Actor) {
  (0, _inherits2.default)(CypherSystemActor, _Actor);

  var _super = _createSuper(CypherSystemActor);

  function CypherSystemActor() {
    (0, _classCallCheck2.default)(this, CypherSystemActor);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(CypherSystemActor, [{
    key: "_preparePCData",

    /**
     * Prepare Character type specific data
     */
    value: function _preparePCData(actorData) {
      var data = actorData.data;
      data.sentence = (0, _utils.valOrDefault)(data.sentence, {
        descriptor: '',
        type: '',
        focus: ''
      });
      data.tier = (0, _utils.valOrDefault)(data.tier, 1);
      data.effort = (0, _utils.valOrDefault)(data.effort, 1);
      data.xp = (0, _utils.valOrDefault)(data.xp, 0);
      data.cypherLimit = (0, _utils.valOrDefault)(data.cypherLimit, 1);
      data.advances = (0, _utils.valOrDefault)(data.advances, {
        stats: false,
        edge: false,
        effort: false,
        skills: false,
        other: false
      });
      data.recoveryMod = (0, _utils.valOrDefault)(data.recoveryMod, 1);
      data.recoveries = (0, _utils.valOrDefault)(data.recoveries, {
        action: false,
        tenMins: false,
        oneHour: false,
        tenHours: false
      });
      data.damageTrack = (0, _utils.valOrDefault)(data.damageTrack, 0);
      data.armor = (0, _utils.valOrDefault)(data.armor, 0);
      data.stats = (0, _utils.valOrDefault)(data.stats, {
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
      data.money = (0, _utils.valOrDefault)(data.money, 0);
    }
  }, {
    key: "_prepareNPCData",
    value: function _prepareNPCData(actorData) {
      var data = actorData.data;
      data.level = (0, _utils.valOrDefault)(data.level, 1);
      data.health = (0, _utils.valOrDefault)(data.health, 3);
      data.damage = (0, _utils.valOrDefault)(data.damage, 1);
      data.armor = (0, _utils.valOrDefault)(data.armor, 0);
      data.movement = (0, _utils.valOrDefault)(data.movement, 1);
      data.description = (0, _utils.valOrDefault)(data.description, '');
      data.motive = (0, _utils.valOrDefault)(data.motive, '');
      data.environment = (0, _utils.valOrDefault)(data.environment, '');
      data.modifications = (0, _utils.valOrDefault)(data.modifications, '');
      data.combat = (0, _utils.valOrDefault)(data.combat, '');
      data.interaction = (0, _utils.valOrDefault)(data.interaction, '');
      data.use = (0, _utils.valOrDefault)(data.use, '');
      data.loot = (0, _utils.valOrDefault)(data.loot, '');
    }
    /**
     * Augment the basic actor data with additional dynamic data.
     */

  }, {
    key: "prepareData",
    value: function prepareData() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(CypherSystemActor.prototype), "prepareData", this).call(this);
      var actorData = this.data;
      var data = actorData.data;
      var flags = actorData.flags;
      var type = actorData.type;

      switch (type) {
        case 'pc':
          this._preparePCData(actorData);

          break;

        case 'npc':
          this._prepareNPCData(actorData);

          break;
      }
    }
  }, {
    key: "getSkillLevel",
    value: function getSkillLevel(skill) {
      var data = skill.data.data;
      return data.training - 1;
    }
  }, {
    key: "getEffortCostFromStat",
    value: function getEffortCostFromStat(pool, effortLevel) {
      var value = {
        cost: 0,
        effortLevel: 0,
        warning: null
      };

      if (effortLevel === 0) {
        return value;
      }

      var actorData = this.data.data;
      var poolName = _enumPool.default[pool];
      var stat = actorData.stats[poolName.toLowerCase()]; // The first effort level costs 3 pts from the pool, extra levels cost 2
      // Substract the related Edge, too

      var availableEffortFromPool = (stat.value + stat.edge - 1) / 2; // A PC can use as much as their Effort score, but not more
      // They're also limited by their current pool value

      var finalEffort = Math.min(effortLevel, actorData.effort, availableEffortFromPool);
      var cost = 1 + 2 * finalEffort - stat.edge; // TODO take free levels of Effort into account here

      var warning = null;

      if (effortLevel > availableEffortFromPool) {
        warning = "Not enough points in your ".concat(poolName, " pool for that level of Effort");
      }

      value.cost = cost;
      value.effortLevel = finalEffort;
      value.warning = warning;
      return value;
    }
  }, {
    key: "getEdgeFromStat",
    value: function getEdgeFromStat(pool) {
      var actorData = this.data.data;
      var poolName = _enumPool.default[pool];
      var stat = actorData.stats[poolName.toLowerCase()];
      return stat.edge;
    }
  }, {
    key: "getFreeEffortFromStat",
    value: function getFreeEffortFromStat(pool) {
      var edge = this.getEdgeFromStat(pool);
      return Math.max(Math.floor((edge - 1) / 2), 0);
    }
  }, {
    key: "canSpendFromPool",
    value: function canSpendFromPool(pool, amount) {
      var applyEdge = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var actorData = this.data.data;

      var poolName = _enumPool.default[pool].toLowerCase();

      var stat = actorData.stats[poolName];
      var poolAmount = stat.value;
      return (applyEdge ? amount - stat.edge : amount) <= poolAmount;
    }
  }, {
    key: "spendFromPool",
    value: function spendFromPool(pool, amount) {
      if (!this.canSpendFromPool(pool, amount)) {
        return false;
      }

      var actorData = this.data.data;
      var poolName = _enumPool.default[pool];
      var stat = actorData.stats[poolName.toLowerCase()];
      var data = {};
      data["data.stats.".concat(poolName.toLowerCase(), ".value")] = Math.max(0, stat.value - amount);
      this.update(data);
      return true;
    }
  }, {
    key: "onGMIntrusion",
    value: (function () {
      var _onGMIntrusion = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee(accepted) {
        var _this = this;

        var xp, chatContent, otherActors, dialog;
        return _regenerator.default.wrap((function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                xp = this.data.data.xp;
                chatContent = "<h2>".concat(game.i18n.localize('CSR.intrusion.chat.heading'), "</h2><br>");

                if (accepted) {
                  xp++;
                  chatContent += game.i18n.localize('CSR.intrusion.chat.accept').replace('##ACTOR##', this.data.name);
                } else {
                  xp--;
                  chatContent += game.i18n.localize('CSR.intrusion.chat.refuse').replace('##ACTOR##', this.data.name);
                }

                this.update({
                  _id: this._id,
                  'data.xp': xp
                });
                ChatMessage.create({
                  content: chatContent
                });

                if (accepted) {
                  otherActors = game.actors.filter((function (actor) {
                    return actor._id !== _this._id && actor.data.type === 'pc';
                  }));
                  dialog = new _playerChoiceDialog.PlayerChoiceDialog(otherActors, function (chosenActorId) {
                    game.socket.emit('system.cyphersystem', {
                      type: 'awardXP',
                      data: {
                        actorId: chosenActorId,
                        xpAmount: 1
                      }
                    });
                  });
                  dialog.render(true);
                }

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }), _callee, this);
      })));

      function onGMIntrusion(_x) {
        return _onGMIntrusion.apply(this, arguments);
      }

      return onGMIntrusion;
    })()
    /**
     * @override
     */

  }, {
    key: "createEmbeddedEntity",
    value: (function () {
      var _createEmbeddedEntity = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2() {
        var _get2;

        var _len,
            args,
            _key,
            _,
            data,
            itemData,
            _args2 = arguments;

        return _regenerator.default.wrap((function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                for (_len = _args2.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args2[_key];
                }

                _ = args[0], data = args[1]; // Roll the "level die" to determine the item's level, if possible

                if (!(data.data && _config.CSR.hasLevelDie.includes(data.type))) {
                  _context2.next = 17;
                  break;
                }

                itemData = data.data;

                if (!(!itemData.level && itemData.levelDie)) {
                  _context2.next = 16;
                  break;
                }

                _context2.prev = 5;
                // See if the formula is valid
                itemData.level = new Roll(itemData.levelDie).roll().total;
                _context2.next = 9;
                return this.update({
                  _id: this._id,
                  "data.level": itemData.level
                });

              case 9:
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](5);
                // If not, fallback to sane default
                itemData.level = itemData.level || null;

              case 14:
                _context2.next = 17;
                break;

              case 16:
                itemData.level = itemData.level || null;

              case 17:
                return _context2.abrupt("return", (_get2 = (0, _get3.default)((0, _getPrototypeOf2.default)(CypherSystemActor.prototype), "createEmbeddedEntity", this)).call.apply(_get2, [this].concat(args)));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }), _callee2, this, [[5, 11]]);
      })));

      function createEmbeddedEntity() {
        return _createEmbeddedEntity.apply(this, arguments);
      }

      return createEmbeddedEntity;
    })()
  }, {
    key: "initiativeLevel",
    get: function get() {
      var initSkill = this.data.items.filter((function (i) {
        return i.type === 'skill' && i.data.flags.initiative;
      }))[0];
      return initSkill.data.training - 1;
    }
  }, {
    key: "canRefuseIntrusion",
    get: function get() {
      var data = this.data.data;
      return data.xp > 0;
    }
  }, {
    key: "isOverCypherLimit",
    get: function get() {
      var cyphers = this.getEmbeddedCollection("OwnedItem").filter((function (i) {
        return i.type === "cypher";
      }));
      return this.data.data.cypherLimit < cyphers.length;
    }
  }]);
  return CypherSystemActor;
})(Actor);

exports.CypherSystemActor = CypherSystemActor;

},{"../config.js":5,"../dialog/player-choice-dialog.js":9,"../enums/enum-pool.js":11,"../utils.js":26,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39,"@babel/runtime/regenerator":46}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderChatMessage = renderChatMessage;

var _rolls = require("./rolls.js");

/* global $ */
function renderChatMessage(chatMessage, html, _data) {
  // Don't apply ChatMessage enhancement to recovery rolls
  if (chatMessage.roll && !chatMessage.roll.dice[0].options.recovery) {
    var dieRoll = chatMessage.roll.dice[0].results[0].result;
    var rollTotal = chatMessage.roll.total;
    var messages = (0, _rolls.rollText)(dieRoll, rollTotal);
    var numMessages = messages.length;
    var messageContainer = $('<div/>');
    messageContainer.addClass('special-messages');
    messages.forEach((function (special, idx) {
      var text = special.text,
          color = special.color,
          cls = special.cls;
      var newContent = "<span class=\"".concat(cls, "\" style=\"color: ").concat(color, "\">").concat(text, "</span>").concat(idx < numMessages - 1 ? '<br />' : '');
      messageContainer.append(newContent);
    }));
    var dt = html.find(".dice-total");
    messageContainer.insertBefore(dt);
  }
}

},{"./rolls.js":22}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollInitiative = rollInitiative;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * Roll initiative for one or multiple Combatants within the Combat entity
 * @param {Array|string} ids        A Combatant id or Array of ids for which to roll
 * @param {string|null} formula     A non-default initiative formula to roll. Otherwise the system default is used.
 * @param {Object} messageOptions   Additional options with which to customize created Chat Messages
 * @return {Promise.<Combat>}       A promise which resolves to the updated Combat entity once updates are complete.
 */
function rollInitiative(_x) {
  return _rollInitiative.apply(this, arguments);
}

function _rollInitiative() {
  _rollInitiative = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee(ids) {
    var formula,
        messageOptions,
        combatantUpdates,
        messages,
        _iterator,
        _step,
        id,
        combatant,
        actor,
        actorData,
        type,
        initiative,
        rollResult,
        initBonus,
        operator,
        rollFormula,
        roll,
        level,
        token,
        isHidden,
        whisper,
        template,
        messageData,
        _args = arguments;

    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formula = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
            messageOptions = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
            combatantUpdates = [];
            messages = []; // Force ids to be an array so our for loop doesn't break

            ids = typeof ids === 'string' ? [ids] : ids;
            _iterator = _createForOfIteratorHelper(ids);
            _context.prev = 6;

            _iterator.s();

          case 8:
            if ((_step = _iterator.n()).done) {
              _context.next = 37;
              break;
            }

            id = _step.value;
            _context.next = 12;
            return this.getCombatant(id);

          case 12:
            combatant = _context.sent;

            if (!combatant.defeated) {
              _context.next = 15;
              break;
            }

            return _context.abrupt("return");

          case 15:
            actor = combatant.actor;
            actorData = actor.data;
            type = actorData.type;
            initiative = void 0;
            rollResult = void 0;
            _context.t0 = type;
            _context.next = _context.t0 === 'pc' ? 23 : _context.t0 === 'npc' ? 30 : 33;
            break;

          case 23:
            initBonus = actor.initiativeLevel;
            operator = initBonus < 0 ? '-' : '+';
            rollFormula = '1d20' + (initBonus === 0 ? '' : "".concat(operator).concat(3 * Math.abs(initBonus)));
            roll = new Roll(rollFormula).roll();
            initiative = Math.max(roll.total, 0); // Don't let initiative go below 0

            rollResult = roll.result;
            return _context.abrupt("break", 33);

          case 30:
            level = actorData.data.level;
            initiative = 3 * level;
            return _context.abrupt("break", 33);

          case 33:
            combatantUpdates.push({
              _id: combatant._id,
              initiative: initiative
            }); // Since NPC initiative is fixed, don't bother showing it in chat

            if (type === 'pc') {
              token = combatant.token;
              isHidden = token.hidden || combatant.hidden;
              whisper = isHidden ? game.users.entities.filter((function (u) {
                return u.isGM;
              })) : ''; // TODO: Improve the chat message, this currently
              // just replicates the normal roll message.

              template = "\n        <div class=\"dice-roll\">\n          <div class=\"dice-result\">\n            <div class=\"dice-formula\">".concat(rollResult, "</div>\n            <div class=\"dice-tooltip\">\n              <section class=\"tooltip-part\">\n                <div class=\"dice\">\n                  <p class=\"part-formula\">\n                    1d20\n                    <span class=\"part-total\">").concat(initiative, "</span>\n                  </p>\n\n                  <ol class=\"dice-rolls\">\n                    <li class=\"roll die d20\">").concat(initiative, "</li>\n                  </ol>\n                </div>\n              </section>\n            </div>\n            <div class=\"dice-total\">").concat(initiative, "</div>\n          </div>\n        </div>\n        ");
              messageData = mergeObject({
                speaker: {
                  scene: canvas.scene._id,
                  actor: actor ? actor._id : null,
                  token: token._id,
                  alias: token.name
                },
                whisper: whisper,
                flavor: game.i18n.localize('CSR.initiative.flavor').replace('##ACTOR##', token.name),
                content: template
              }, messageOptions);
              messages.push(messageData);
            }

          case 35:
            _context.next = 8;
            break;

          case 37:
            _context.next = 42;
            break;

          case 39:
            _context.prev = 39;
            _context.t1 = _context["catch"](6);

            _iterator.e(_context.t1);

          case 42:
            _context.prev = 42;

            _iterator.f();

            return _context.finish(42);

          case 45:
            if (combatantUpdates.length) {
              _context.next = 47;
              break;
            }

            return _context.abrupt("return");

          case 47:
            _context.next = 49;
            return this.updateEmbeddedEntity('Combatant', combatantUpdates);

          case 49:
            ChatMessage.create(messages);
            return _context.abrupt("return", this);

          case 51:
          case "end":
            return _context.stop();
        }
      }
    }), _callee, this, [[6, 39, 42, 45]]);
  })));
  return _rollInitiative.apply(this, arguments);
}

},{"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSR = void 0;
var CSR = {};
exports.CSR = CSR;
CSR.itemTypes = ['skills', 'abilities', 'cyphers', 'artifacts', 'oddities', 'weapons', 'armor', 'gear'];
CSR.inventoryTypes = ['weapon', 'armor', 'gear', 'cypher', 'artifact', 'oddity'];
CSR.weightClasses = ['light', 'medium', 'heavy'];
CSR.weaponTypes = ['bashing', 'bladed', 'ranged'];
CSR.stats = ['might', 'speed', 'intellect'];
CSR.trainingLevels = ['inability', 'untrained', 'trained', 'specialized'];
CSR.damageTrack = ['hale', 'impaired', 'debilitated', 'dead'];
CSR.recoveries = ['action', 'tenMins', 'oneHour', 'tenHours'];
CSR.advances = ['stats', 'edge', 'effort', 'skills', 'other'];
CSR.ranges = ['immediate', 'short', 'long', 'veryLong'];
CSR.optionalRanges = ["na"].concat(CSR.ranges);
CSR.abilityTypes = ['action', 'enabler'];
CSR.supportsMacros = ['skill', 'ability'];
CSR.hasLevelDie = ['cypher', 'artifact'];

},{}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actorDirectoryContext = actorDirectoryContext;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

/* globals ENTITY_PERMISSIONS */
function actorDirectoryContext(html, entryOptions) {
  entryOptions.push({
    name: game.i18n.localize('CSR.ctxt.intrusion.heading'),
    icon: '<i class="fas fa-exclamation-circle"></i>',
    callback: function callback(li) {
      var actor = game.actors.get(li.data('entityId'));
      var ownerIds = Object.entries(actor.data.permission).filter((function (entry) {
        var _entry = (0, _slicedToArray2.default)(entry, 2),
            id = _entry[0],
            permissionLevel = _entry[1];

        return permissionLevel >= ENTITY_PERMISSIONS.OWNER && id !== game.user.id;
      })).map((function (usersPermissions) {
        return usersPermissions[0];
      }));
      game.socket.emit('system.cyphersystem', {
        type: 'gmIntrusion',
        data: {
          userIds: ownerIds,
          actorId: actor.data._id
        }
      });
      var heading = game.i18n.localize('CSR.ctxt.intrusion.heading');
      var body = game.i18n.localize('CSR.ctxt.intrusion.heading').replace('##ACTOR##', actor.data.name);
      ChatMessage.create({
        content: "<h2>".concat(heading, "</h2><br/>").concat(body)
      });
    },
    condition: function condition(li) {
      if (!game.user.isGM) {
        return false;
      }

      var actor = game.actors.get(li.data('entityId'));
      return actor && actor.data.type === 'pc';
    }
  });
}

},{"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/slicedToArray":41}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _actor = require("./actor/actor.js");

var _actorSheet = require("./actor/actor-sheet.js");

var _item = require("./item/item.js");

var _itemSheet = require("./item/item-sheet.js");

var _handlebarsHelpers = require("./handlebars-helpers.js");

var _template = require("./template.js");

var _settings = require("./settings.js");

var _chat = require("./chat.js");

var _contextMenu = require("./context-menu.js");

var _migrate = require("./migrations/migrate");

var _socket = require("./socket.js");

var _combat = require("./combat.js");

var _macros = require("./macros.js");

/* global Combat */
// Import Modules
Hooks.once('init', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
  return _regenerator.default.wrap((function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          game.cyphersystem = {
            CypherSystemActor: _actor.CypherSystemActor,
            CypherSystemItem: _item.CypherSystemItem,
            macro: {
              usePool: _macros.usePoolMacro,
              useSkill: _macros.useSkillMacro,
              useAbility: _macros.useAbilityMacro,
              useCypher: _macros.useCypherMacro
            }
          };
          /**
           * Set an initiative formula for the system
           * @type {String}
           */

          Combat.prototype.rollInitiative = _combat.rollInitiative; // Define custom Entity classes

          CONFIG.Actor.entityClass = _actor.CypherSystemActor;
          CONFIG.Item.entityClass = _item.CypherSystemItem; // Register sheet application classes

          Actors.unregisterSheet('core', ActorSheet); // TODO: Separate classes per type

          Actors.registerSheet('cyphersystem', _actorSheet.CypherSystemActorSheet, {
            types: ['pc'],
            makeDefault: true
          });
          Actors.registerSheet('cyphersystem', _actorSheet.CypherSystemActorSheet, {
            types: ['npc'],
            makeDefault: true
          });
          Items.unregisterSheet('core', ItemSheet);
          Items.registerSheet('cyphersystem', _itemSheet.CypherSystemItemSheet, {
            makeDefault: true
          });
          (0, _settings.registerSystemSettings)();
          (0, _handlebarsHelpers.registerHandlebarHelpers)();
          (0, _template.preloadHandlebarsTemplates)();

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }), _callee);
}))));
Hooks.on('renderChatMessage', _chat.renderChatMessage);
Hooks.on('getActorDirectoryEntryContext', _contextMenu.actorDirectoryContext); // Hooks.on('createActor', async function(actor, options, userId) {

Hooks.on('createActor', /*#__PURE__*/(function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2(actor) {
    var type;
    return _regenerator.default.wrap((function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            type = actor.data.type;

            if (type === 'pc') {
              // Give PCs the "Initiative" skill by default, as it will be used
              // by the intiative formula in combat.
              actor.createOwnedItem({
                name: game.i18n.localize('CSR.skill.initiative'),
                type: 'skill',
                data: new _item.CypherSystemItem({
                  'pool': 1,
                  // Speed
                  'training': 1,
                  // Untrained
                  'flags.initiative': true
                })
              });
            }

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }), _callee2);
  })));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})());
Hooks.once('ready', _migrate.migrate);
Hooks.once('ready', _socket.csrSocketListeners); // Register hooks

Hooks.once('ready', (function () {
  Hooks.on('hotbarDrop', (function (_, data, slot) {
    return (0, _macros.createCypherMacro)(data, slot);
  }));
}));

},{"./actor/actor-sheet.js":1,"./actor/actor.js":2,"./chat.js":3,"./combat.js":4,"./context-menu.js":6,"./handlebars-helpers.js":16,"./item/item-sheet.js":17,"./item/item.js":18,"./macros.js":19,"./migrations/migrate":20,"./settings.js":23,"./socket.js":24,"./template.js":25,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GMIntrusionDialog = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/* globals mergeObject Dialog */

/**
 * Prompts the user with a choice of a GM Intrusion.
 * 
 * @export
 * @class GMIntrusionDialog
 * @extends {Dialog}
 */
var GMIntrusionDialog = /*#__PURE__*/(function (_Dialog) {
  (0, _inherits2.default)(GMIntrusionDialog, _Dialog);

  var _super = _createSuper(GMIntrusionDialog);

  (0, _createClass2.default)(GMIntrusionDialog, null, [{
    key: "defaultOptions",

    /** @override */
    get: function get() {
      return mergeObject((0, _get2.default)((0, _getPrototypeOf2.default)(GMIntrusionDialog), "defaultOptions", this), {
        template: "templates/hud/dialog.html",
        classes: ["csr", "dialog"],
        width: 500
      });
    }
  }]);

  function GMIntrusionDialog(actor) {
    var _thisSuper, _thisSuper2, _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, GMIntrusionDialog);
    var acceptQuestion = game.i18n.localize('CSR.dialog.intrusion.doYouAccept');
    var acceptInstructions = game.i18n.localize('CSR.dialog.intrusion.acceptInstructions').replace('##ACCEPT##', "<span style=\"color: green\">".concat(game.i18n.localize('CSR.accept'), "</span>"));
    var refuseInstructions = game.i18n.localize('CSR.dialog.intrusion.refuseInstructions').replace('##REFUSE##', "<span style=\"color: red\">".concat(game.i18n.localize('CSR.refuse'), "</span>"));
    var dialogContent = "\n    <div class=\"row\">\n      <div class=\"col-xs-12\">\n        <p>".concat(acceptQuestion, "</p>\n      </div>\n    </div>\n    <hr />\n    <div class=\"row\">\n      <div class=\"col-xs-6\">\n        <p>").concat(acceptInstructions, "</p>\n      </div>\n      <div class=\"col-xs-6\">\n        <p>").concat(refuseInstructions, "</p>\n      </div>\n    </div>\n    <hr />");
    var dialogButtons = {
      ok: {
        icon: '<i class="fas fa-check" style="color: green"></i>',
        label: game.i18n.localize('CSR.dialog.button.accept'),
        callback: (function () {
          var _callback = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
            return _regenerator.default.wrap((function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return actor.onGMIntrusion(true);

                  case 2:
                    (0, _get2.default)((_thisSuper = (0, _assertThisInitialized2.default)(_this), (0, _getPrototypeOf2.default)(GMIntrusionDialog.prototype)), "close", _thisSuper).call(_thisSuper);

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }), _callee);
          })));

          function callback() {
            return _callback.apply(this, arguments);
          }

          return callback;
        })()
      },
      cancel: {
        icon: '<i class="fas fa-times" style="color: red"></i>',
        label: game.i18n.localize('CSR.dialog.button.refuse'),
        callback: (function () {
          var _callback2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2() {
            return _regenerator.default.wrap((function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return actor.onGMIntrusion(false);

                  case 2:
                    (0, _get2.default)((_thisSuper2 = (0, _assertThisInitialized2.default)(_this), (0, _getPrototypeOf2.default)(GMIntrusionDialog.prototype)), "close", _thisSuper2).call(_thisSuper2);

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            }), _callee2);
          })));

          function callback() {
            return _callback2.apply(this, arguments);
          }

          return callback;
        })()
      }
    };

    if (!actor.canRefuseIntrusion) {
      var notEnoughXP = game.i18n.localize('CSR.dialog.intrusion.notEnoughXP');
      dialogContent += "\n      <div class=\"row\">\n        <div class=\"col-xs-12\">\n          <p><strong>".concat(notEnoughXP, "</strong></p>\n        </div>\n      </div>\n      <hr />");
      delete dialogButtons.cancel;
    }

    var dialogData = {
      title: game.i18n.localize('CSR.dialog.intrusion.title'),
      content: dialogContent,
      buttons: dialogButtons,
      defaultYes: false
    };
    _this = _super.call(this, dialogData, options);
    _this.actor = actor;
    return _this;
  }
  /** @override */


  (0, _createClass2.default)(GMIntrusionDialog, [{
    key: "_getHeaderButtons",
    value: function _getHeaderButtons() {
      // Don't include any header buttons, force an option to be chosen
      return [];
    }
    /** @override */

  }, {
    key: "close",
    value: function close() {// Prevent default closing behavior
    }
  }]);
  return GMIntrusionDialog;
})(Dialog);

exports.GMIntrusionDialog = GMIntrusionDialog;

},{"@babel/runtime/helpers/assertThisInitialized":29,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39,"@babel/runtime/regenerator":46}],9:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerChoiceDialog = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/* globals mergeObject Dialog */

/**
 * Allows the user to choose one of the other player characters.
 * 
 * @export
 * @class PlayerChoiceDialog
 * @extends {Dialog}
 */
var PlayerChoiceDialog = /*#__PURE__*/(function (_Dialog) {
  (0, _inherits2.default)(PlayerChoiceDialog, _Dialog);

  var _super = _createSuper(PlayerChoiceDialog);

  (0, _createClass2.default)(PlayerChoiceDialog, null, [{
    key: "defaultOptions",

    /** @override */
    get: function get() {
      return mergeObject((0, _get2.default)((0, _getPrototypeOf2.default)(PlayerChoiceDialog), "defaultOptions", this), {
        template: "templates/hud/dialog.html",
        classes: ["csr", "dialog", "player-choice"],
        width: 300,
        height: 175
      });
    }
  }]);

  function PlayerChoiceDialog(actors, onAcceptFn) {
    var _thisSuper, _this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, PlayerChoiceDialog);
    var dialogSelectOptions = [];
    actors.forEach((function (actor) {
      dialogSelectOptions.push("<option value=\"".concat(actor._id, "\">").concat(actor.name, "</option>"));
    }));
    var dialogText = game.i18n.localize('CSR.dialog.player.content');
    var dialogContent = "\n    <div class=\"row\">\n      <div class=\"col-xs-12\">\n        <p>".concat(dialogText, "</p>\n      </div>\n    </div>\n    <hr />\n    <div class=\"row\">\n      <div class=\"col-xs-12\">\n        <select name=\"player\">\n          ").concat(dialogSelectOptions.join('\n'), "\n        </select>\n      </div>\n    </div>\n    <hr />");
    var dialogButtons = {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('CSR.dialog.button.accept'),
        callback: function callback() {
          var actorId = document.querySelector('.player-choice select[name="player"]').value;
          onAcceptFn(actorId);
          (0, _get2.default)((_thisSuper = (0, _assertThisInitialized2.default)(_this), (0, _getPrototypeOf2.default)(PlayerChoiceDialog.prototype)), "close", _thisSuper).call(_thisSuper);
        }
      }
    };
    var dialogData = {
      title: game.i18n.localize('CSR.dialog.player.title'),
      content: dialogContent,
      buttons: dialogButtons,
      defaultYes: false
    };
    _this = _super.call(this, dialogData, options);
    _this.actors = actors;
    return _this;
  }

  (0, _createClass2.default)(PlayerChoiceDialog, [{
    key: "getData",
    value: function getData() {
      var data = (0, _get2.default)((0, _getPrototypeOf2.default)(PlayerChoiceDialog.prototype), "getData", this).call(this);
      data.actors = this.actors;
      return data;
    }
  }, {
    key: "activateListeners",
    value: function activateListeners(html) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(PlayerChoiceDialog.prototype), "activateListeners", this).call(this, html);
      html.find('select[name="player"]').select2({
        theme: 'numenera',
        width: '100%' // minimumResultsForSearch: Infinity

      });
    }
    /** @override */

  }, {
    key: "_getHeaderButtons",
    value: function _getHeaderButtons() {
      // Don't include any header buttons, force an option to be chosen
      return [];
    }
    /** @override */

  }, {
    key: "close",
    value: function close() {// Prevent default closing behavior
    }
  }]);
  return PlayerChoiceDialog;
})(Dialog);

exports.PlayerChoiceDialog = PlayerChoiceDialog;

},{"@babel/runtime/helpers/assertThisInitialized":29,"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39}],10:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollDialog = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/* globals Dialog */
var RollDialog = /*#__PURE__*/(function (_Dialog) {
  (0, _inherits2.default)(RollDialog, _Dialog);

  var _super = _createSuper(RollDialog);

  function RollDialog(dialogData, options) {
    (0, _classCallCheck2.default)(this, RollDialog);
    return _super.call(this, dialogData, options);
  }

  (0, _createClass2.default)(RollDialog, [{
    key: "activateListeners",
    value: function activateListeners(html) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(RollDialog.prototype), "activateListeners", this).call(this, html);
      html.find('select[name="rollMode"]').select2({
        theme: 'numenera',
        width: '135px',
        minimumResultsForSearch: Infinity
      });
    }
  }]);
  return RollDialog;
})(Dialog);

exports.RollDialog = RollDialog;

},{"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumPool = ["Might", "Speed", "Intellect"];
var _default = EnumPool;
exports.default = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumRange = ["Immediate", "Short", "Long", "Very Long"];
var _default = EnumRange;
exports.default = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumTraining = ["Inability", "Untrained", "Trained", "Specialized"];
var _default = EnumTraining;
exports.default = _default;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumWeaponCategory = ["Bashing", "Bladed", "Ranged"];
var _default = EnumWeaponCategory;
exports.default = _default;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumWeight = ["Light", "Medium", "Heavy"];
var _default = EnumWeight;
exports.default = _default;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHandlebarHelpers = void 0;

var registerHandlebarHelpers = function registerHandlebarHelpers() {
  Handlebars.registerHelper('toLowerCase', (function (str) {
    return str.toLowerCase();
  }));
  Handlebars.registerHelper('toUpperCase', (function (text) {
    return text.toUpperCase();
  }));
  Handlebars.registerHelper('eq', (function (v1, v2) {
    return v1 === v2;
  }));
  Handlebars.registerHelper('neq', (function (v1, v2) {
    return v1 !== v2;
  }));
  Handlebars.registerHelper('or', (function (v1, v2) {
    return v1 || v2;
  }));
  Handlebars.registerHelper('ternary', (function (cond, v1, v2) {
    return cond ? v1 : v2;
  }));
  Handlebars.registerHelper('concat', (function (v1, v2) {
    return "".concat(v1).concat(v2);
  }));
  Handlebars.registerHelper('strOrSpace', (function (val) {
    if (typeof val === 'string') {
      return val && !!val.length ? val : '&nbsp;';
    }

    return val;
  }));
  Handlebars.registerHelper('trainingIcon', (function (val) {
    switch (val) {
      case 0:
        return "<span title=\"".concat(game.i18n.localize('CSR.training.inability'), "\">[I]</span>");

      case 1:
        return "<span title=\"".concat(game.i18n.localize('CSR.training.untrained'), "\">[U]</span>");

      case 2:
        return "<span title=\"".concat(game.i18n.localize('CSR.training.trained'), "\">[T]</span>");

      case 3:
        return "<span title=\"".concat(game.i18n.localize('CSR.training.specialized'), "\">[S]</span>");
    }

    return '';
  }));
  Handlebars.registerHelper('poolIcon', (function (val) {
    switch (val) {
      case 0:
        return "<span title=\"".concat(game.i18n.localize('CSR.pool.might'), "\">[M]</span>");

      case 1:
        return "<span title=\"".concat(game.i18n.localize('CSR.pool.speed'), "\">[S]</span>");

      case 2:
        return "<span title=\"".concat(game.i18n.localize('CSR.pool.intellect'), "\">[I]</span>");
    }

    return '';
  }));
  Handlebars.registerHelper('typeIcon', (function (val) {
    switch (val) {
      // TODO: Add skill and ability?
      case 'armor':
        return "<span title=\"".concat(game.i18n.localize('CSR.inventory.armor'), "\">[a]</span>");

      case 'weapon':
        return "<span title=\"".concat(game.i18n.localize('CSR.inventory.weapon'), "\">[w]</span>");

      case 'gear':
        return "<span title=\"".concat(game.i18n.localize('CSR.inventory.gear'), "\">[g]</span>");

      case 'cypher':
        return "<span title=\"".concat(game.i18n.localize('CSR.inventory.cypher'), "\">[C]</span>");

      case 'artifact':
        return "<span title=\"".concat(game.i18n.localize('CSR.inventory.armor'), "\">[A]</span>");

      case 'oddity':
        return "<span title=\"".concat(game.i18n.localize('CSR.inventory.armor'), "\">[O]</span>");
    }

    return '';
  }));
};

exports.registerHandlebarHelpers = registerHandlebarHelpers;

},{}],17:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemItemSheet = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _config = require("../config.js");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
var CypherSystemItemSheet = /*#__PURE__*/(function (_ItemSheet) {
  (0, _inherits2.default)(CypherSystemItemSheet, _ItemSheet);

  var _super = _createSuper(CypherSystemItemSheet);

  function CypherSystemItemSheet() {
    (0, _classCallCheck2.default)(this, CypherSystemItemSheet);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(CypherSystemItemSheet, [{
    key: "_skillData",

    /* -------------------------------------------- */
    value: function _skillData(data) {
      data.stats = _config.CSR.stats;
      data.trainingLevels = _config.CSR.trainingLevels;
    }
  }, {
    key: "_abilityData",
    value: function _abilityData(data) {
      data.ranges = _config.CSR.optionalRanges;
      data.stats = _config.CSR.stats;
    }
  }, {
    key: "_armorData",
    value: function _armorData(data) {
      data.weightClasses = _config.CSR.weightClasses;
    }
  }, {
    key: "_weaponData",
    value: function _weaponData(data) {
      data.ranges = _config.CSR.ranges;
      data.weaponTypes = _config.CSR.weaponTypes;
      data.weightClasses = _config.CSR.weightClasses;
    }
  }, {
    key: "_gearData",
    value: function _gearData(data) {}
  }, {
    key: "_cypherData",
    value: function _cypherData(data) {
      data.isGM = game.user.isGM;
    }
  }, {
    key: "_artifactData",
    value: function _artifactData(data) {
      data.isGM = game.user.isGM;
    }
  }, {
    key: "_oddityData",
    value: function _oddityData(data) {
      data.isGM = game.user.isGM;
    }
    /** @override */

  }, {
    key: "getData",
    value: function getData() {
      var data = (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet.prototype), "getData", this).call(this);
      var type = this.item.data.type;

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

  }, {
    key: "setPosition",
    value: function setPosition() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var position = (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet.prototype), "setPosition", this).call(this, options);
      var sheetBody = this.element.find(".sheet-body");
      var bodyHeight = position.height - 192;
      sheetBody.css("height", bodyHeight);
      return position;
    }
    /* -------------------------------------------- */

  }, {
    key: "_skillListeners",
    value: function _skillListeners(html) {
      html.closest('.window-app.sheet.item').addClass('skill-window');

      if (!this.options.editable) {
        return;
      }

      html.find('select[name="data.pool"]').select2({
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
  }, {
    key: "_abilityListeners",
    value: function _abilityListeners(html) {
      var _this = this;

      html.closest('.window-app.sheet.item').addClass('ability-window');

      if (!this.options.editable) {
        return;
      }

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
      var cbIdentified = html.find('#cb-identified');
      cbIdentified.on('change', (function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        _this.item.update({
          'data.identified': ev.target.checked
        });
      }));
    }
  }, {
    key: "_armorListeners",
    value: function _armorListeners(html) {
      html.closest('.window-app.sheet.item').addClass('armor-window');

      if (!this.options.editable) {
        return;
      }

      html.find('select[name="data.weight"]').select2({
        theme: 'numenera',
        width: '100px',
        minimumResultsForSearch: Infinity
      });
    }
  }, {
    key: "_weaponListeners",
    value: function _weaponListeners(html) {
      html.closest('.window-app.sheet.item').addClass('weapon-window');

      if (!this.options.editable) {
        return;
      }

      html.find('select[name="data.weight"]').select2({
        theme: 'numenera',
        width: '110px',
        minimumResultsForSearch: Infinity
      });
      html.find('select[name="data.category"]').select2({
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
  }, {
    key: "_gearListeners",
    value: function _gearListeners(html) {
      html.closest('.window-app.sheet.item').addClass('gear-window');
    }
  }, {
    key: "_cypherListeners",
    value: function _cypherListeners(html) {
      html.closest('.window-app.sheet.item').addClass('cypher-window');
    }
  }, {
    key: "_artifactListeners",
    value: function _artifactListeners(html) {
      html.closest('.window-app.sheet.item').addClass('artifact-window');
    }
  }, {
    key: "_oddityListeners",
    value: function _oddityListeners(html) {
      html.closest('.window-app.sheet.item').addClass('oddity-window');
    }
    /** @override */

  }, {
    key: "activateListeners",
    value: function activateListeners(html) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet.prototype), "activateListeners", this).call(this, html);
      var type = this.item.data.type;

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
  }, {
    key: "template",

    /** @override */
    get: function get() {
      var path = "systems/cyphersystem/templates/item";
      return "".concat(path, "/").concat(this.item.data.type, "-sheet.html");
    }
  }], [{
    key: "defaultOptions",

    /** @override */
    get: function get() {
      return mergeObject((0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet), "defaultOptions", this), {
        classes: ["cyphersystem", "sheet", "item"],
        width: 300,
        height: 200
      });
    }
  }]);
  return CypherSystemItemSheet;
})(ItemSheet);

exports.CypherSystemItemSheet = CypherSystemItemSheet;

},{"../config.js":5,"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39}],18:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemItem = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _rolls = require("../rolls.js");

var _utils = require("../utils.js");

var _enumPool = _interopRequireDefault(require("../enums/enum-pool.js"));

var _enumTraining = _interopRequireDefault(require("../enums/enum-training.js"));

var _enumWeight = _interopRequireDefault(require("../enums/enum-weight.js"));

var _enumRange = _interopRequireDefault(require("../enums/enum-range.js"));

var _enumWeaponCategory = _interopRequireDefault(require("../enums/enum-weapon-category.js"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
var CypherSystemItem = /*#__PURE__*/(function (_Item) {
  (0, _inherits2.default)(CypherSystemItem, _Item);

  var _super = _createSuper(CypherSystemItem);

  function CypherSystemItem() {
    (0, _classCallCheck2.default)(this, CypherSystemItem);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(CypherSystemItem, [{
    key: "_prepareSkillData",
    value: function _prepareSkillData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.skill'));
      data.pool = (0, _utils.valOrDefault)(data.pool, 0);
      data.training = (0, _utils.valOrDefault)(data.training, 1);
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
      data.flags = (0, _utils.valOrDefault)(data.flags, {});
    }
  }, {
    key: "_prepareAbilityData",
    value: function _prepareAbilityData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.ability'));
      data.sourceType = (0, _utils.valOrDefault)(data.sourceType, '');
      data.sourceValue = (0, _utils.valOrDefault)(data.sourceValue, '');
      data.isEnabler = (0, _utils.valOrDefault)(data.isEnabler, true);
      data.cost = (0, _utils.valOrDefault)(data.cost, {
        value: 0,
        pool: 0
      });
      data.range = (0, _utils.valOrDefault)(data.range, 0);
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
  }, {
    key: "_prepareArmorData",
    value: function _prepareArmorData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.armor'));
      data.armor = (0, _utils.valOrDefault)(data.armor, 1);
      data.additionalSpeedEffortCost = (0, _utils.valOrDefault)(data.additionalSpeedEffortCost, 1);
      data.price = (0, _utils.valOrDefault)(data.price, 0);
      data.weight = (0, _utils.valOrDefault)(data.weight, 0);
      data.quantity = (0, _utils.valOrDefault)(data.quantity, 1);
      data.equipped = (0, _utils.valOrDefault)(data.equipped, false);
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
  }, {
    key: "_prepareWeaponData",
    value: function _prepareWeaponData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.weapon'));
      data.damage = (0, _utils.valOrDefault)(data.damage, 1);
      data.category = (0, _utils.valOrDefault)(data.category, 0);
      data.range = (0, _utils.valOrDefault)(data.range, 0);
      data.price = (0, _utils.valOrDefault)(data.price, 0);
      data.weight = (0, _utils.valOrDefault)(data.weight, 0);
      data.quantity = (0, _utils.valOrDefault)(data.quantity, 1);
      data.equipped = (0, _utils.valOrDefault)(data.equipped, false);
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
  }, {
    key: "_prepareGearData",
    value: function _prepareGearData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.gear'));
      data.price = (0, _utils.valOrDefault)(data.price, 0);
      data.quantity = (0, _utils.valOrDefault)(data.quantity, 1);
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
  }, {
    key: "_prepareCypherData",
    value: function _prepareCypherData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.cypher'));
      data.identified = (0, _utils.valOrDefault)(data.identified, false);
      data.level = (0, _utils.valOrDefault)(data.level, null);
      data.levelDie = (0, _utils.valOrDefault)(data.levelDie, '');
      data.form = (0, _utils.valOrDefault)(data.form, '');
      data.effect = (0, _utils.valOrDefault)(data.effect, '');
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
  }, {
    key: "_prepareArtifactData",
    value: function _prepareArtifactData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.artifact'));
      data.identified = (0, _utils.valOrDefault)(data.identified, false);
      data.level = (0, _utils.valOrDefault)(data.level, null);
      data.levelDie = (0, _utils.valOrDefault)(data.levelDie, '');
      data.form = (0, _utils.valOrDefault)(data.form, '');
      data.effect = (0, _utils.valOrDefault)(data.effect, '');
      data.depletion = (0, _utils.valOrDefault)(data.depletion, {
        isDepleting: true,
        die: 'd6',
        threshold: 1
      });
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
  }, {
    key: "_prepareOddityData",
    value: function _prepareOddityData() {
      var itemData = this.data;
      var data = itemData.data;
      data.name = (0, _utils.valOrDefault)(itemData.name, game.i18n.localize('CSR.new.oddity'));
      data.notes = (0, _utils.valOrDefault)(data.notes, '');
    }
    /**
     * Augment the basic Item data model with additional dynamic data.
     */

  }, {
    key: "prepareData",
    value: function prepareData() {
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItem.prototype), "prepareData", this).call(this);

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

  }, {
    key: "_skillRoll",
    value: function _skillRoll() {
      var actor = this.actor;
      var actorData = actor.data.data;
      var name = this.name;
      var item = this.data;
      var pool = item.data.pool;
      var assets = actor.getSkillLevel(this);
      var freeEffort = actor.getFreeEffortFromStat(pool);
      var parts = ['1d20'];

      if (assets !== 0) {
        var sign = assets < 0 ? '-' : '+';
        parts.push("".concat(sign, " ").concat(Math.abs(assets) * 3));
      }

      (0, _rolls.cypherRoll)({
        parts: parts,
        data: {
          pool: pool,
          poolCost: 0,
          effort: freeEffort,
          maxEffort: actorData.effort,
          assets: assets
        },
        event: event,
        title: game.i18n.localize('CSR.roll.skill.title'),
        flavor: game.i18n.localize('CSR.roll.skill.flavor').replace('##ACTOR##', actor.name).replace('##SKILL##', name),
        actor: actor,
        speaker: ChatMessage.getSpeaker({
          actor: actor
        })
      });
    }
  }, {
    key: "_abilityRoll",
    value: function _abilityRoll() {
      var actor = this.actor;
      var actorData = actor.data.data;
      var name = this.name;
      var item = this.data;
      var _item$data = item.data,
          isEnabler = _item$data.isEnabler,
          cost = _item$data.cost;

      if (!isEnabler) {
        var pool = cost.pool,
            amount = cost.value;
        var edge = actor.getEdgeFromStat(pool);
        var adjustedAmounted = Math.max(amount - edge, 0);
        var freeEffort = actor.getFreeEffortFromStat(pool); // Edge has made this ability free, so just use it

        if (actor.canSpendFromPool(pool, parseInt(amount, 10))) {
          (0, _rolls.cypherRoll)({
            event: event,
            parts: ['1d20'],
            data: {
              pool: pool,
              poolCost: adjustedAmounted,
              effort: freeEffort,
              maxEffort: actorData.effort
            },
            speaker: ChatMessage.getSpeaker({
              actor: actor
            }),
            flavor: "".concat(actor.name, " used ").concat(name),
            title: game.i18n.localize('CSR.roll.ability.title'),
            actor: actor
          });
        } else {
          var poolName = _enumPool.default[pool];
          ChatMessage.create([{
            speaker: ChatMessage.getSpeaker({
              actor: actor
            }),
            flavor: game.i18n.localize('CSR.roll.ability.failed.flavor'),
            content: game.i18n.localize('CSR.roll.ability.failed.content').replace('##POOL##', poolName)
          }]);
        }
      } else {
        ChatMessage.create([{
          speaker: ChatMessage.getSpeaker({
            actor: actor
          }),
          flavor: game.i18n.localize('CSR.roll.ability.invalid.flavor'),
          content: game.i18n.localize('CSR.roll.ability.invalid.content')
        }]);
      }
    }
  }, {
    key: "roll",
    value: function roll() {
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

  }, {
    key: "_skillInfo",
    value: (function () {
      var _skillInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
        var skillData, data, training, pool, params, html;
        return _regenerator.default.wrap((function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                skillData = this.data;
                data = skillData.data;
                training = _enumTraining.default[skillData.data.training];
                pool = _enumPool.default[skillData.data.pool];
                params = {
                  name: skillData.name,
                  training: training.toLowerCase(),
                  pool: pool.toLowerCase(),
                  notes: data.notes,
                  initiative: !!data.flags.initiative
                };
                _context.next = 7;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/skill-info.html', params);

              case 7:
                html = _context.sent;
                return _context.abrupt("return", html);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }), _callee, this);
      })));

      function _skillInfo() {
        return _skillInfo2.apply(this, arguments);
      }

      return _skillInfo;
    })()
  }, {
    key: "_abilityInfo",
    value: (function () {
      var _abilityInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2() {
        var data, ability, pool, params, html;
        return _regenerator.default.wrap((function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = this.data;
                ability = data.data;
                pool = _enumPool.default[ability.cost.pool];
                params = {
                  name: data.name,
                  pool: pool.toLowerCase(),
                  isEnabler: ability.isEnabler,
                  cost: ability.cost.value,
                  notes: ability.notes
                };
                _context2.next = 6;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/ability-info.html', params);

              case 6:
                html = _context2.sent;
                return _context2.abrupt("return", html);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }), _callee2, this);
      })));

      function _abilityInfo() {
        return _abilityInfo2.apply(this, arguments);
      }

      return _abilityInfo;
    })()
  }, {
    key: "_armorInfo",
    value: (function () {
      var _armorInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee3() {
        var data, weight, params, html;
        return _regenerator.default.wrap((function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = this.data;
                weight = _enumWeight.default[data.data.weight];
                params = {
                  name: this.name,
                  type: this.type,
                  equipped: data.data.equipped,
                  quantity: data.data.quantity,
                  weight: weight.toLowerCase(),
                  armor: data.data.armor,
                  additionalSpeedEffortCost: data.data.additionalSpeedEffortCost,
                  price: data.data.price,
                  notes: data.data.notes
                };
                _context3.next = 5;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/armor-info.html', params);

              case 5:
                html = _context3.sent;
                return _context3.abrupt("return", html);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }), _callee3, this);
      })));

      function _armorInfo() {
        return _armorInfo2.apply(this, arguments);
      }

      return _armorInfo;
    })()
  }, {
    key: "_weaponInfo",
    value: (function () {
      var _weaponInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee4() {
        var data, weight, range, category, params, html;
        return _regenerator.default.wrap((function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = this.data;
                weight = _enumWeight.default[data.data.weight];
                range = _enumRange.default[data.data.range];
                category = _enumWeaponCategory.default[data.data.category];
                params = {
                  name: this.name,
                  type: this.type,
                  equipped: data.data.equipped,
                  quantity: data.data.quantity,
                  weight: weight.toLowerCase(),
                  range: range.toLowerCase(),
                  category: category.toLowerCase(),
                  damage: data.data.damage,
                  price: data.data.price,
                  notes: data.data.notes
                };
                _context4.next = 7;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/weapon-info.html', params);

              case 7:
                html = _context4.sent;
                return _context4.abrupt("return", html);

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }), _callee4, this);
      })));

      function _weaponInfo() {
        return _weaponInfo2.apply(this, arguments);
      }

      return _weaponInfo;
    })()
  }, {
    key: "_gearInfo",
    value: (function () {
      var _gearInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee5() {
        var data, params, html;
        return _regenerator.default.wrap((function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                data = this.data;
                params = {
                  name: data.name,
                  type: this.type,
                  quantity: data.data.quantity,
                  price: data.data.price,
                  notes: data.data.notes
                };
                _context5.next = 4;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/gear-info.html', params);

              case 4:
                html = _context5.sent;
                return _context5.abrupt("return", html);

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }), _callee5, this);
      })));

      function _gearInfo() {
        return _gearInfo2.apply(this, arguments);
      }

      return _gearInfo;
    })()
  }, {
    key: "_cypherInfo",
    value: (function () {
      var _cypherInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee6() {
        var data, params, html;
        return _regenerator.default.wrap((function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                data = this.data;
                params = {
                  name: data.name,
                  type: this.type,
                  isGM: game.user.isGM,
                  identified: data.data.identified,
                  level: data.data.level,
                  form: data.data.form,
                  effect: data.data.effect
                };
                _context6.next = 4;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/cypher-info.html', params);

              case 4:
                html = _context6.sent;
                return _context6.abrupt("return", html);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }), _callee6, this);
      })));

      function _cypherInfo() {
        return _cypherInfo2.apply(this, arguments);
      }

      return _cypherInfo;
    })()
  }, {
    key: "_artifactInfo",
    value: (function () {
      var _artifactInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee7() {
        var data, params, html;
        return _regenerator.default.wrap((function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                data = this.data;
                params = {
                  name: data.name,
                  type: this.type,
                  isGM: game.user.isGM,
                  identified: data.data.identified,
                  level: data.data.level,
                  form: data.data.form,
                  isDepleting: data.data.depletion.isDepleting,
                  depletionThreshold: data.data.depletion.threshold,
                  depletionDie: data.data.depletion.die,
                  effect: data.data.effect
                };
                _context7.next = 4;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/artifact-info.html', params);

              case 4:
                html = _context7.sent;
                return _context7.abrupt("return", html);

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }), _callee7, this);
      })));

      function _artifactInfo() {
        return _artifactInfo2.apply(this, arguments);
      }

      return _artifactInfo;
    })()
  }, {
    key: "_oddityInfo",
    value: (function () {
      var _oddityInfo2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee8() {
        var data, params, html;
        return _regenerator.default.wrap((function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                data = this.data;
                params = {
                  name: data.name,
                  type: this.type,
                  notes: data.data.notes
                };
                _context8.next = 4;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/oddity-info.html', params);

              case 4:
                html = _context8.sent;
                return _context8.abrupt("return", html);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }), _callee8, this);
      })));

      function _oddityInfo() {
        return _oddityInfo2.apply(this, arguments);
      }

      return _oddityInfo;
    })()
  }, {
    key: "getInfo",
    value: (function () {
      var _getInfo = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee9() {
        var html;
        return _regenerator.default.wrap((function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                html = '';
                _context9.t0 = this.type;
                _context9.next = _context9.t0 === 'skill' ? 4 : _context9.t0 === 'ability' ? 8 : _context9.t0 === 'armor' ? 12 : _context9.t0 === 'weapon' ? 16 : _context9.t0 === 'gear' ? 20 : _context9.t0 === 'cypher' ? 24 : _context9.t0 === 'artifact' ? 28 : _context9.t0 === 'oddity' ? 32 : 36;
                break;

              case 4:
                _context9.next = 6;
                return this._skillInfo();

              case 6:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 8:
                _context9.next = 10;
                return this._abilityInfo();

              case 10:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 12:
                _context9.next = 14;
                return this._armorInfo();

              case 14:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 16:
                _context9.next = 18;
                return this._weaponInfo();

              case 18:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 20:
                _context9.next = 22;
                return this._gearInfo();

              case 22:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 24:
                _context9.next = 26;
                return this._cypherInfo();

              case 26:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 28:
                _context9.next = 30;
                return this._artifactInfo();

              case 30:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 32:
                _context9.next = 34;
                return this._oddityInfo();

              case 34:
                html = _context9.sent;
                return _context9.abrupt("break", 36);

              case 36:
                return _context9.abrupt("return", html);

              case 37:
              case "end":
                return _context9.stop();
            }
          }
        }), _callee9, this);
      })));

      function getInfo() {
        return _getInfo.apply(this, arguments);
      }

      return getInfo;
    })()
  }]);
  return CypherSystemItem;
})(Item);

exports.CypherSystemItem = CypherSystemItem;

},{"../enums/enum-pool.js":11,"../enums/enum-range.js":12,"../enums/enum-training.js":13,"../enums/enum-weapon-category.js":14,"../enums/enum-weight.js":15,"../rolls.js":22,"../utils.js":26,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/classCallCheck":31,"@babel/runtime/helpers/createClass":32,"@babel/runtime/helpers/get":33,"@babel/runtime/helpers/getPrototypeOf":34,"@babel/runtime/helpers/inherits":35,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/helpers/possibleConstructorReturn":39,"@babel/runtime/regenerator":46}],19:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePoolMacro = usePoolMacro;
exports.useSkillMacro = useSkillMacro;
exports.useAbilityMacro = useAbilityMacro;
exports.useCypherMacro = useCypherMacro;
exports.createCypherMacro = createCypherMacro;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _rolls = require("./rolls.js");

var _enumPool = _interopRequireDefault(require("./enums/enum-pool.js"));

/**
 * Rolls from the given skill.
 * 
 * @param {string} actorId
 * @param {string} pool
 * @return {Promise}
 */
function usePoolMacro(actorId, pool) {
  var actor = game.actors.entities.find((function (a) {
    return a._id === actorId;
  }));
  var actorData = actor.data.data;
  var poolName = _enumPool.default[pool];
  var freeEffort = actor.getFreeEffortFromStat(pool);
  (0, _rolls.cypherRoll)({
    parts: ['1d20'],
    data: {
      pool: pool,
      effort: freeEffort,
      maxEffort: actorData.effort
    },
    event: event,
    title: game.i18n.localize('CSR.roll.pool.title').replace('##POOL##', poolName),
    flavor: game.i18n.localize('CSR.roll.pool.flavor').replace('##ACTOR##', actor.name).replace('##POOL##', poolName),
    actor: actor,
    speaker: ChatMessage.getSpeaker({
      actor: actor
    })
  });
}
/**
 * Activates the given skill.
 * 
 * @param {string} actorId
 * @param {string} itemId
 * @return {Promise}
 */


function useSkillMacro(actorId, itemId) {
  var actor = game.actors.entities.find((function (a) {
    return a._id === actorId;
  }));
  var skill = actor.getOwnedItem(itemId);
  skill.roll();
}
/**
 * Activates the given ability.
 * 
 * @param {string} actorId
 * @param {string} itemId
 * @return {Promise}
 */


function useAbilityMacro(actorId, itemId) {
  var actor = game.actors.entities.find((function (a) {
    return a._id === actorId;
  }));
  var ability = actor.getOwnedItem(itemId);
  ability.roll();
}
/**
 * Uses the given cypher.
 * 
 * @param {string} actorId
 * @param {string} itemId
 * @return {Promise}
 */


function useCypherMacro(actorId, itemId) {
  console.warn('Cypher macros not implemented');
}

var SUPPORTED_TYPES = ['pool', 'skill', 'ability' // 'cypher'
];

function itemSupportsMacros(item) {
  if (!SUPPORTED_TYPES.includes(item.type)) {
    return false;
  }

  if (item.type === 'ability' && item.data.isEnabler) {
    return false;
  }

  return true;
}

function unsupportedItemMessage(item) {
  if (item.type === 'ability' && item.data.isEnabler) {
    return game.i18n.localize('CSR.macro.create.abilityEnabler');
  }

  return game.i18n.localize('CSR.macro.create.unsupportedType');
}

function generateMacroCommand(data) {
  var item = data.data; // Special case, must handle this separately

  if (item.type === 'pool') {
    return "game.cyphersystem.macro.usePool('".concat(data.actorId, "', ").concat(item.pool, ");");
  } // General cases, works most of the time


  var typeTitleCase = item.type.substr(0, 1).toUpperCase() + item.type.substr(1);
  var command = "game.cyphersystem.macro.use".concat(typeTitleCase, "('").concat(data.actorId, "', '").concat(item._id, "');");
  return command;
}

function createMacro(_x, _x2) {
  return _createMacro.apply(this, arguments);
}
/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */


function _createMacro() {
  _createMacro = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee(item, command) {
    var poolName;
    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (item.type === 'pool') {
              poolName = _enumPool.default[item.pool];
              item.name = game.i18n.localize('CSR.macro.pool.name').replace('##POOL##', poolName);
              item.img = 'icons/svg/d20.svg';
            } else if (item.type === 'skill') {
              // If the image would be the default, change to something more appropriate
              item.img = item.img === 'icons/svg/mystery-man.svg' ? 'icons/svg/aura.svg' : item.img;
            } else if (item.type === 'ability') {
              // If the image would be the default, change to something more appropriate
              item.img = item.img === 'icons/svg/mystery-man.svg' ? 'icons/svg/book.svg' : item.img;
            }

            _context.next = 3;
            return Macro.create({
              name: item.name,
              type: 'script',
              img: item.img,
              command: command,
              flags: {
                'cyphersystem.itemMacro': true
              }
            });

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));
  return _createMacro.apply(this, arguments);
}

function createCypherMacro(_x3, _x4) {
  return _createCypherMacro.apply(this, arguments);
}

function _createCypherMacro() {
  _createCypherMacro = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2(data, slot) {
    var isOwned, item, command, macro;
    return _regenerator.default.wrap((function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isOwned = 'data' in data;

            if (isOwned) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", ui.notifications.warn(game.i18n.localize('CSR.macro.create.notOwned')));

          case 3:
            item = data.data;

            if (itemSupportsMacros(item)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", ui.notifications.warn(unsupportedItemMessage(item)));

          case 6:
            command = generateMacroCommand(data); // Determine if the macro already exists, if not, create a new one

            macro = game.macros.entities.find((function (m) {
              return m.name === item.name && m.command === command;
            }));

            if (macro) {
              _context2.next = 12;
              break;
            }

            _context2.next = 11;
            return createMacro(item, command);

          case 11:
            macro = _context2.sent;

          case 12:
            game.user.assignHotbarMacro(macro, slot);
            return _context2.abrupt("return", false);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }), _callee2);
  })));
  return _createCypherMacro.apply(this, arguments);
}

},{"./enums/enum-pool.js":11,"./rolls.js":22,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],20:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrate = migrate;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _npcMigrations = require("./npc-migrations");

function migrate() {
  return _migrate.apply(this, arguments);
}

function _migrate() {
  _migrate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
    var npcActors, i, npc, newData;
    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (game.user.isGM) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            console.info('--- Starting Migration Process ---');
            npcActors = game.actors.entities.filter((function (actor) {
              return actor.data.type === 'npc';
            }));
            i = 0;

          case 5:
            if (!(i < npcActors.length)) {
              _context.next = 15;
              break;
            }

            npc = npcActors[i];
            _context.next = 9;
            return (0, _npcMigrations.NPCMigrator)(npc);

          case 9:
            newData = _context.sent;
            _context.next = 12;
            return npc.update(newData);

          case 12:
            i++;
            _context.next = 5;
            break;

          case 15:
            console.info('--- Migration Process Finished ---');

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));
  return _migrate.apply(this, arguments);
}

},{"./npc-migrations":21,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],21:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NPCMigrator = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var migrations = [{
  version: 2,
  action: function action(npc, data) {
    data['data.health'] = npc.data.data.health.max;
    return data;
  }
}];

function migrator(_x) {
  return _migrator.apply(this, arguments);
}

function _migrator() {
  _migrator = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee(npc) {
    var obj,
        newData,
        _args = arguments;
    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            obj = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            newData = Object.assign({
              _id: npc._id,
              data: {
                version: npc.data.data.version
              }
            }, obj);
            migrations.forEach((function (handler) {
              var version = newData.data.version;

              if (version < handler.version) {
                newData = handler.action(npc, newData);
                newData.version = handler.version;
              }
            }));
            return _context.abrupt("return", newData);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));
  return _migrator.apply(this, arguments);
}

var NPCMigrator = migrator;
exports.NPCMigrator = NPCMigrator;

},{"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],22:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollText = rollText;
exports.cypherRoll = cypherRoll;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _rollDialog = require("./dialog/roll-dialog.js");

var _enumPool = _interopRequireDefault(require("./enums/enum-pool.js"));

/* globals renderTemplate */
function rollText(dieRoll, rollTotal) {
  var parts = [];
  var taskLevel = Math.floor(rollTotal / 3);
  var skillLevel = Math.floor((rollTotal - dieRoll) / 3 + 0.5);
  var totalAchieved = taskLevel + skillLevel;
  var tnColor = '#000000';

  if (totalAchieved < 3) {
    tnColor = '#0a860a';
  } else if (totalAchieved < 7) {
    tnColor = '#848409';
  } else {
    tnColor = '#0a860a';
  }

  var successText = "<".concat(totalAchieved, ">");

  if (skillLevel !== 0) {
    var sign = skillLevel > 0 ? "+" : "";
    successText += " (".concat(taskLevel).concat(sign).concat(skillLevel, ")");
  }

  parts.push({
    text: successText,
    color: tnColor,
    cls: 'target-number'
  });

  switch (dieRoll) {
    case 1:
      parts.push({
        text: game.i18n.localize('CSR.chat.intrusion'),
        color: '#000000',
        cls: 'effect'
      });
      break;

    case 19:
      parts.push({
        text: game.i18n.localize('CSR.chat.effect.minor'),
        color: '#000000',
        cls: 'effect'
      });
      break;

    case 20:
      parts.push({
        text: game.i18n.localize('CSR.chat.effect.major'),
        color: '#000000',
        cls: 'effect'
      });
      break;
  }

  return parts;
}

function cypherRoll() {
  return _cypherRoll.apply(this, arguments);
}

function _cypherRoll() {
  _cypherRoll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
    var _ref,
        _ref$parts,
        parts,
        _ref$data,
        data,
        _ref$actor,
        actor,
        _ref$event,
        event,
        _ref$speaker,
        speaker,
        _ref$flavor,
        flavor,
        _ref$title,
        title,
        _ref$item,
        item,
        rollMode,
        rolled,
        filtered,
        startingEffort,
        minEffort,
        maxEffort,
        _roll,
        template,
        dialogData,
        html,
        roll,
        _args = arguments;

    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref$parts = _ref.parts, parts = _ref$parts === void 0 ? [] : _ref$parts, _ref$data = _ref.data, data = _ref$data === void 0 ? {} : _ref$data, _ref$actor = _ref.actor, actor = _ref$actor === void 0 ? null : _ref$actor, _ref$event = _ref.event, event = _ref$event === void 0 ? null : _ref$event, _ref$speaker = _ref.speaker, speaker = _ref$speaker === void 0 ? null : _ref$speaker, _ref$flavor = _ref.flavor, flavor = _ref$flavor === void 0 ? null : _ref$flavor, _ref$title = _ref.title, title = _ref$title === void 0 ? null : _ref$title, _ref$item = _ref.item, item = _ref$item === void 0 ? false : _ref$item;
            rollMode = game.settings.get('core', 'rollMode');
            rolled = false;
            filtered = parts.filter((function (el) {
              return el != '' && el;
            })); // Indicates free levels of effort

            startingEffort = 0;
            minEffort = 0;

            if (data['effort']) {
              startingEffort = parseInt(data['effort'], 10) || 0;
              minEffort = startingEffort;
            }

            maxEffort = 1;

            if (data['maxEffort']) {
              maxEffort = parseInt(data['maxEffort'], 10) || 1;
            }

            _roll = function _roll() {
              var form = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

              // Optionally include effort
              if (form) {
                data['effort'] = parseInt(form.effort.value, 10);
              }

              if (data['effort']) {
                filtered.push("+".concat(data['effort'] * 3)); // TODO: Find a better way to localize this, concating strings doesn't work for all languages

                flavor += game.i18n.localize('CSR.roll.effort.flavor').replace('##EFFORT##', data['effort']);
              }

              var roll = new Roll(filtered.join(''), data).roll(); // Convert the roll to a chat message and return the roll

              rollMode = form ? form.rollMode.value : rollMode;
              rolled = true;
              return roll;
            };

            template = 'systems/cyphersystem/templates/dialog/roll-dialog.html';
            dialogData = {
              formula: filtered.join(' '),
              effort: startingEffort,
              minEffort: minEffort,
              maxEffort: maxEffort,
              data: data,
              rollMode: rollMode,
              rollModes: CONFIG.Dice.rollModes
            };
            _context.next = 14;
            return renderTemplate(template, dialogData);

          case 14:
            html = _context.sent;
            return _context.abrupt("return", new Promise(function (resolve) {
              new _rollDialog.RollDialog({
                title: title,
                content: html,
                buttons: {
                  ok: {
                    label: 'OK',
                    icon: '<i class="fas fa-check"></i>',
                    callback: function callback(html) {
                      roll = _roll(html.find('form')[0]); // TODO: check roll.result against target number

                      var pool = data.pool;
                      var amountOfEffort = parseInt(data['effort'] || 0, 10);
                      var effortCost = actor.getEffortCostFromStat(pool, amountOfEffort);
                      var totalCost = parseInt(data['poolCost'] || 0, 10) + parseInt(effortCost.cost, 10);

                      if (actor.canSpendFromPool(pool, totalCost) && !effortCost.warning) {
                        roll.toMessage({
                          speaker: speaker,
                          flavor: flavor
                        }, {
                          rollMode: rollMode
                        });
                        actor.spendFromPool(pool, Math.max(totalCost, 0));
                      } else {
                        var poolName = _enumPool.default[pool];
                        ChatMessage.create([{
                          speaker: speaker,
                          flavor: game.i18n.localize('CSR.roll.failed.flavor'),
                          content: game.i18n.localize('CSR.roll.failed.content').replace('##POOL##', poolName)
                        }]);
                      }
                    }
                  },
                  cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'Cancel'
                  }
                },
                default: 'ok',
                close: function close() {
                  resolve(rolled ? roll : false);
                }
              }).render(true);
            }));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));
  return _cypherRoll.apply(this, arguments);
}

},{"./dialog/roll-dialog.js":10,"./enums/enum-pool.js":11,"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSystemSettings = void 0;

var registerSystemSettings = function registerSystemSettings() {
  /**
   * Configure the currency name
   */
  game.settings.register('cyphersystem', 'currencyName', {
    name: 'SETTINGS.name.currencyName',
    hint: 'SETTINGS.hint.currencyName',
    scope: 'world',
    config: true,
    type: String,
    default: 'Money'
  });
};

exports.registerSystemSettings = registerSystemSettings;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csrSocketListeners = csrSocketListeners;

var _gmIntrusionDialog = require("./dialog/gm-intrusion-dialog.js");

function csrSocketListeners() {
  game.socket.on('system.cyphersystem', handleMessage);
}

function handleMessage(args) {
  var type = args.type;

  switch (type) {
    case 'gmIntrusion':
      handleGMIntrusion(args);
      break;

    case 'awardXP':
      handleAwardXP(args);
      break;
  }
}

function handleGMIntrusion(args) {
  var data = args.data;
  var actorId = data.actorId,
      userIds = data.userIds;

  if (!game.ready || game.user.isGM || !userIds.find((function (id) {
    return id === game.userId;
  }))) {
    return;
  }

  var actor = game.actors.entities.find((function (a) {
    return a.data._id === actorId;
  }));
  var dialog = new _gmIntrusionDialog.GMIntrusionDialog(actor);
  dialog.render(true);
}

function handleAwardXP(args) {
  var data = args.data;
  var actorId = data.actorId,
      xpAmount = data.xpAmount;

  if (!game.ready || !game.user.isGM) {
    return;
  }

  var actor = game.actors.get(actorId);
  actor.update({
    'data.xp': actor.data.data.xp + xpAmount
  });
  ChatMessage.create({
    content: game.i18n.localize('CSR.intrusion.awardXP').replace('##ACTOR##', actor.data.name)
  });
}

},{"./dialog/gm-intrusion-dialog.js":8}],25:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preloadHandlebarsTemplates = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/* globals loadTemplates */

/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
var preloadHandlebarsTemplates = /*#__PURE__*/(function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
    var templatePaths;
    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Define template paths to load
            templatePaths = [// Actor Sheets
            "systems/cyphersystem/templates/actor/pc-sheet.html", "systems/cyphersystem/templates/actor/npc-sheet.html", // Actor Partials
            "systems/cyphersystem/templates/actor/partials/pools.html", "systems/cyphersystem/templates/actor/partials/advancement.html", "systems/cyphersystem/templates/actor/partials/damage-track.html", "systems/cyphersystem/templates/actor/partials/recovery.html", "systems/cyphersystem/templates/actor/partials/skills.html", "systems/cyphersystem/templates/actor/partials/abilities.html", "systems/cyphersystem/templates/actor/partials/inventory.html", "systems/cyphersystem/templates/actor/partials/info/skill-info.html", "systems/cyphersystem/templates/actor/partials/info/ability-info.html", "systems/cyphersystem/templates/actor/partials/info/armor-info.html", "systems/cyphersystem/templates/actor/partials/info/weapon-info.html", "systems/cyphersystem/templates/actor/partials/info/gear-info.html", "systems/cyphersystem/templates/actor/partials/info/cypher-info.html", "systems/cyphersystem/templates/actor/partials/info/artifact-info.html", "systems/cyphersystem/templates/actor/partials/info/oddity-info.html", // Item Sheets
            "systems/cyphersystem/templates/item/skill-sheet.html", "systems/cyphersystem/templates/item/armor-sheet.html", "systems/cyphersystem/templates/item/weapon-sheet.html", "systems/cyphersystem/templates/item/gear-sheet.html", "systems/cyphersystem/templates/item/cypher-sheet.html", "systems/cyphersystem/templates/item/artifact-sheet.html", "systems/cyphersystem/templates/item/oddity-sheet.html", // Dialogs
            "systems/cyphersystem/templates/dialog/roll-dialog.html"]; // Load the template parts

            return _context.abrupt("return", loadTemplates(templatePaths));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));

  return function preloadHandlebarsTemplates() {
    return _ref.apply(this, arguments);
  };
})();

exports.preloadHandlebarsTemplates = preloadHandlebarsTemplates;

},{"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepProp = deepProp;
exports.isDefined = isDefined;
exports.valOrDefault = valOrDefault;

function deepProp(obj, path) {
  var props = path.split('.');
  var val = obj;
  props.forEach((function (p) {
    if (p in val) {
      val = val[p];
    }
  }));
  return val;
}

function isDefined(val) {
  return !(val === null || typeof val === 'undefined');
}

function valOrDefault(val, def) {
  return isDefined(val) ? val : def;
}

},{}],27:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],28:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],29:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],30:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],31:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],32:[function(require,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],33:[function(require,module,exports){
var superPropBase = require("./superPropBase");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;
},{"./superPropBase":42}],34:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],35:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":40}],36:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],37:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],38:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],39:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":43,"./assertThisInitialized":29}],40:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],41:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":28,"./iterableToArrayLimit":37,"./nonIterableRest":38,"./unsupportedIterableToArray":44}],42:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":34}],43:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],44:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":27}],45:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach((function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    }));
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then((function(value) {
            invoke("next", value, resolve, reject);
          }), (function(err) {
            invoke("throw", err, resolve, reject);
          }));
        }

        return PromiseImpl.resolve(value).then((function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }), (function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        }));
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then((function(result) {
          return result.done ? result.value : iter.next();
        }));
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],46:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":45}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY2hhdC5qcyIsIm1vZHVsZS9jb21iYXQuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2NvbnRleHQtbWVudS5qcyIsIm1vZHVsZS9jeXBoZXJzeXN0ZW0uanMiLCJtb2R1bGUvZGlhbG9nL2dtLWludHJ1c2lvbi1kaWFsb2cuanMiLCJtb2R1bGUvZGlhbG9nL3BsYXllci1jaG9pY2UtZGlhbG9nLmpzIiwibW9kdWxlL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXBvb2wuanMiLCJtb2R1bGUvZW51bXMvZW51bS1yYW5nZS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXRyYWluaW5nLmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VpZ2h0LmpzIiwibW9kdWxlL2hhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1vZHVsZS9pdGVtL2l0ZW0tc2hlZXQuanMiLCJtb2R1bGUvaXRlbS9pdGVtLmpzIiwibW9kdWxlL21hY3Jvcy5qcyIsIm1vZHVsZS9taWdyYXRpb25zL21pZ3JhdGUuanMiLCJtb2R1bGUvbWlncmF0aW9ucy9ucGMtbWlncmF0aW9ucy5qcyIsIm1vZHVsZS9yb2xscy5qcyIsIm1vZHVsZS9zZXR0aW5ncy5qcyIsIm1vZHVsZS9zb2NrZXQuanMiLCJtb2R1bGUvdGVtcGxhdGUuanMiLCJtb2R1bGUvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zZXRQcm90b3R5cGVPZi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zdXBlclByb3BCYXNlLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0VBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFQTs7OztJQUlhLHNCOzs7Ozs7OztBQWlDWDs4QkFFVTtBQUNSLFdBQUssZ0JBQUwsR0FBd0IsQ0FBQyxDQUF6QjtBQUNBLFdBQUssb0JBQUwsR0FBNEIsQ0FBQyxDQUE3QjtBQUNBLFdBQUssYUFBTCxHQUFxQixJQUFyQjtBQUVBLFdBQUssaUJBQUwsR0FBeUIsQ0FBQyxDQUExQjtBQUNBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUVBLFdBQUssbUJBQUwsR0FBMkIsQ0FBQyxDQUE1QjtBQUNBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLFdBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNEOzs7K0JBRVUsQ0FDVjs7OztBQXpCRDs7Ozt3QkFJZTtBQUFBLFVBQ0wsSUFESyxHQUNJLEtBQUssS0FBTCxDQUFXLElBRGYsQ0FDTCxJQURLO0FBRWIsNERBQStDLElBQS9DO0FBQ0Q7Ozs7QUE3QkQ7d0JBQzRCO0FBQzFCLGFBQU8sV0FBVyxvR0FBdUI7QUFDdkMsUUFBQSxPQUFPLEVBQUUsQ0FBQyxjQUFELEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCLENBRDhCO0FBRXZDLFFBQUEsS0FBSyxFQUFFLEdBRmdDO0FBR3ZDLFFBQUEsTUFBTSxFQUFFLEdBSCtCO0FBSXZDLFFBQUEsSUFBSSxFQUFFLENBQUM7QUFDTCxVQUFBLFdBQVcsRUFBRSxhQURSO0FBRUwsVUFBQSxlQUFlLEVBQUUsYUFGWjtBQUdMLFVBQUEsT0FBTyxFQUFFO0FBSEosU0FBRCxFQUlIO0FBQ0QsVUFBQSxXQUFXLEVBQUUsYUFEWjtBQUVELFVBQUEsZUFBZSxFQUFFLGFBRmhCO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dEJBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0IERpYWxvZyBDb250ZXh0TWVudSAqL1xuXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xuaW1wb3J0IHsgY3lwaGVyUm9sbCB9IGZyb20gJy4uL3JvbGxzLmpzJztcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tICcuLi9pdGVtL2l0ZW0uanMnO1xuaW1wb3J0IHsgZGVlcFByb3AgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEFjdG9yU2hlZXQgd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnNcbiAqIEBleHRlbmRzIHtBY3RvclNoZWV0fVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCBleHRlbmRzIEFjdG9yU2hlZXQge1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIGNsYXNzZXM6IFtcImN5cGhlcnN5c3RlbVwiLCBcInNoZWV0XCIsIFwiYWN0b3JcIl0sXG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICB0YWJzOiBbe1xuICAgICAgICBuYXZTZWxlY3RvcjogXCIuc2hlZXQtdGFic1wiLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6IFwiLnNoZWV0LWJvZHlcIixcbiAgICAgICAgaW5pdGlhbDogXCJkZXNjcmlwdGlvblwiXG4gICAgICB9LCB7XG4gICAgICAgIG5hdlNlbGVjdG9yOiAnLnN0YXRzLXRhYnMnLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6ICcuc3RhdHMtYm9keScsXG4gICAgICAgIGluaXRpYWw6ICdhZHZhbmNlbWVudCdcbiAgICAgIH1dLFxuICAgICAgc2Nyb2xsWTogW1xuICAgICAgICAnLnRhYi5pbnZlbnRvcnkgLmludmVudG9yeS1saXN0JyxcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktaW5mbycsXG4gICAgICBdXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3JyZWN0IEhUTUwgdGVtcGxhdGUgcGF0aCB0byB1c2UgZm9yIHJlbmRlcmluZyB0aGlzIHBhcnRpY3VsYXIgc2hlZXRcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcbiAgICByZXR1cm4gYHN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci8ke3R5cGV9LXNoZWV0Lmh0bWxgO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfcGNJbml0KCkge1xuICAgIHRoaXMuc2tpbGxzUG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSAtMTtcbiAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xuXG4gICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcblxuICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICB0aGlzLmZpbHRlckVxdWlwcGVkID0gZmFsc2U7XG4gIH1cblxuICBfbnBjSW5pdCgpIHtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICB0aGlzLl9wY0luaXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9ucGNJbml0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsIHR5cGUsIGZpZWxkKSB7XG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XG4gICAgaWYgKCFpdGVtc1tmaWVsZF0pIHtcbiAgICAgIGl0ZW1zW2ZpZWxkXSA9IGl0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gdHlwZSk7IC8vLnNvcnQoc29ydEZ1bmN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBfZmlsdGVySXRlbURhdGEoZGF0YSwgaXRlbUZpZWxkLCBmaWx0ZXJGaWVsZCwgZmlsdGVyVmFsdWUpIHtcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcbiAgICBpdGVtc1tpdGVtRmllbGRdID0gaXRlbXNbaXRlbUZpZWxkXS5maWx0ZXIoaXRtID0+IGRlZXBQcm9wKGl0bSwgZmlsdGVyRmllbGQpID09PSBmaWx0ZXJWYWx1ZSk7XG4gIH1cblxuICBhc3luYyBfc2tpbGxEYXRhKGRhdGEpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdza2lsbCcsICdza2lsbHMnKTtcbiAgICAvLyBHcm91cCBza2lsbHMgYnkgdGhlaXIgcG9vbCwgdGhlbiBhbHBoYW51bWVyaWNhbGx5XG4gICAgZGF0YS5kYXRhLml0ZW1zLnNraWxscy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5kYXRhLnBvb2wgPT09IGIuZGF0YS5wb29sKSB7XG4gICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGEuZGF0YS5wb29sID4gYi5kYXRhLnBvb2wpID8gMSA6IC0xO1xuICAgIH0pO1xuXG4gICAgZGF0YS5za2lsbHNQb29sRmlsdGVyID0gdGhpcy5za2lsbHNQb29sRmlsdGVyO1xuICAgIGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSB0aGlzLnNraWxsc1RyYWluaW5nRmlsdGVyO1xuXG4gICAgaWYgKGRhdGEuc2tpbGxzUG9vbEZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ2RhdGEucG9vbCcsIHBhcnNlSW50KGRhdGEuc2tpbGxzUG9vbEZpbHRlciwgMTApKTtcbiAgICB9XG4gICAgaWYgKGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ3NraWxscycsICdkYXRhLnRyYWluaW5nJywgcGFyc2VJbnQoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciwgMTApKTtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkU2tpbGwgPSB0aGlzLnNlbGVjdGVkU2tpbGw7XG4gICAgZGF0YS5za2lsbEluZm8gPSAnJztcbiAgICBpZiAoZGF0YS5zZWxlY3RlZFNraWxsKSB7XG4gICAgICBkYXRhLnNraWxsSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRTa2lsbC5nZXRJbmZvKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2FiaWxpdHlEYXRhKGRhdGEpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdhYmlsaXR5JywgJ2FiaWxpdGllcycpO1xuICAgIC8vIEdyb3VwIGFiaWxpdGllcyBieSB0aGVpciBwb29sLCB0aGVuIGFscGhhbnVtZXJpY2FsbHlcbiAgICBkYXRhLmRhdGEuaXRlbXMuYWJpbGl0aWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmRhdGEuY29zdC5wb29sID09PSBiLmRhdGEuY29zdC5wb29sKSB7XG4gICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGEuZGF0YS5jb3N0LnBvb2wgPiBiLmRhdGEuY29zdC5wb29sKSA/IDEgOiAtMTtcbiAgICB9KTtcblxuICAgIGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPSB0aGlzLmFiaWxpdHlQb29sRmlsdGVyO1xuXG4gICAgaWYgKGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ2FiaWxpdGllcycsICdkYXRhLmNvc3QucG9vbCcsIHBhcnNlSW50KGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIsIDEwKSk7XG4gICAgfVxuXG4gICAgZGF0YS5zZWxlY3RlZEFiaWxpdHkgPSB0aGlzLnNlbGVjdGVkQWJpbGl0eTtcbiAgICBkYXRhLmFiaWxpdHlJbmZvID0gJyc7XG4gICAgaWYgKGRhdGEuc2VsZWN0ZWRBYmlsaXR5KSB7XG4gICAgICBkYXRhLmFiaWxpdHlJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZEFiaWxpdHkuZ2V0SW5mbygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9pbnZlbnRvcnlEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmludmVudG9yeVR5cGVzID0gQ1NSLmludmVudG9yeVR5cGVzO1xuXG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XG4gICAgaWYgKCFpdGVtcy5pbnZlbnRvcnkpIHtcbiAgICAgIGl0ZW1zLmludmVudG9yeSA9IGl0ZW1zLmZpbHRlcihpID0+IENTUi5pbnZlbnRvcnlUeXBlcy5pbmNsdWRlcyhpLnR5cGUpKTtcblxuICAgICAgaWYgKHRoaXMuZmlsdGVyRXF1aXBwZWQpIHtcbiAgICAgICAgaXRlbXMuaW52ZW50b3J5ID0gaXRlbXMuaW52ZW50b3J5LmZpbHRlcihpID0+ICEhaS5kYXRhLmVxdWlwcGVkKTtcbiAgICAgIH1cblxuICAgICAgLy8gR3JvdXAgaXRlbXMgYnkgdGhlaXIgdHlwZSwgdGhlbiBhbHBoYW51bWVyaWNhbGx5XG4gICAgICBpdGVtcy5pbnZlbnRvcnkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS50eXBlID09PSBiLnR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gKGEubmFtZSA+IGIubmFtZSkgPyAxIDogLTFcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoYS50eXBlID4gYi50eXBlKSA/IDEgOiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRhdGEuY3lwaGVyQ291bnQgPSBpdGVtcy5yZWR1Y2UoKGNvdW50LCBpKSA9PiBpLnR5cGUgPT09ICdjeXBoZXInID8gKytjb3VudCA6IGNvdW50LCAwKTtcbiAgICBkYXRhLm92ZXJDeXBoZXJMaW1pdCA9IHRoaXMuYWN0b3IuaXNPdmVyQ3lwaGVyTGltaXQ7XG5cbiAgICBkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIgPSB0aGlzLmludmVudG9yeVR5cGVGaWx0ZXI7XG4gICAgZGF0YS5maWx0ZXJFcXVpcHBlZCA9IHRoaXMuZmlsdGVyRXF1aXBwZWQ7XG5cbiAgICBpZiAoZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyID4gLTEpIHtcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdpbnZlbnRvcnknLCAndHlwZScsIENTUi5pbnZlbnRvcnlUeXBlc1twYXJzZUludChkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIsIDEwKV0pO1xuICAgIH1cblxuICAgIGRhdGEuc2VsZWN0ZWRJbnZJdGVtID0gdGhpcy5zZWxlY3RlZEludkl0ZW07XG4gICAgZGF0YS5pbnZJdGVtSW5mbyA9ICcnO1xuICAgIGlmIChkYXRhLnNlbGVjdGVkSW52SXRlbSkge1xuICAgICAgZGF0YS5pbnZJdGVtSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRJbnZJdGVtLmdldEluZm8oKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBfcGNEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcblxuICAgIGRhdGEuY3VycmVuY3lOYW1lID0gZ2FtZS5zZXR0aW5ncy5nZXQoJ2N5cGhlcnN5c3RlbScsICdjdXJyZW5jeU5hbWUnKTtcblxuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEud2VhcG9uVHlwZXMgPSBDU1Iud2VhcG9uVHlwZXM7XG4gICAgZGF0YS53ZWlnaHRzID0gQ1NSLndlaWdodENsYXNzZXM7XG5cbiAgICBkYXRhLmFkdmFuY2VzID0gT2JqZWN0LmVudHJpZXMoZGF0YS5hY3Rvci5kYXRhLmFkdmFuY2VzKS5tYXAoXG4gICAgICAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi5hZHZhbmNlLiR7a2V5fWApLFxuICAgICAgICAgIGlzQ2hlY2tlZDogdmFsdWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGRhdGEuZGFtYWdlVHJhY2tEYXRhID0gQ1NSLmRhbWFnZVRyYWNrO1xuICAgIGRhdGEuZGFtYWdlVHJhY2sgPSBDU1IuZGFtYWdlVHJhY2tbZGF0YS5kYXRhLmRhbWFnZVRyYWNrXTtcblxuICAgIGRhdGEucmVjb3Zlcmllc0RhdGEgPSBPYmplY3QuZW50cmllcyhcbiAgICAgIGRhdGEuYWN0b3IuZGF0YS5yZWNvdmVyaWVzXG4gICAgKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5LFxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IucmVjb3ZlcnkuJHtrZXl9YCksXG4gICAgICAgIGNoZWNrZWQ6IHZhbHVlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGRhdGEudHJhaW5pbmdMZXZlbHMgPSBDU1IudHJhaW5pbmdMZXZlbHM7XG5cbiAgICBkYXRhLmRhdGEuaXRlbXMgPSBkYXRhLmFjdG9yLml0ZW1zIHx8IHt9O1xuXG4gICAgYXdhaXQgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX2FiaWxpdHlEYXRhKGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX2ludmVudG9yeURhdGEoZGF0YSk7XG4gIH1cblxuICBhc3luYyBfbnBjRGF0YShkYXRhKSB7XG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhc3luYyBnZXREYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3BjJzpcbiAgICAgICAgYXdhaXQgdGhpcy5fcGNEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIGF3YWl0IHRoaXMuX25wY0RhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX2NyZWF0ZUl0ZW0oaXRlbU5hbWUpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHtcbiAgICAgIG5hbWU6IGBOZXcgJHtpdGVtTmFtZS5jYXBpdGFsaXplKCl9YCxcbiAgICAgIHR5cGU6IGl0ZW1OYW1lLFxuICAgICAgZGF0YTogbmV3IEN5cGhlclN5c3RlbUl0ZW0oe30pLFxuICAgIH07XG5cbiAgICB0aGlzLmFjdG9yLmNyZWF0ZU93bmVkSXRlbShpdGVtRGF0YSwgeyByZW5kZXJTaGVldDogdHJ1ZSB9KTtcbiAgfVxuXG4gIF9yb2xsUG9vbERpYWxvZyhwb29sKSB7XG4gICAgY29uc3QgeyBhY3RvciB9ID0gdGhpcztcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICAgIGN5cGhlclJvbGwoe1xuICAgICAgcGFydHM6IFsnMWQyMCddLFxuXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBvb2wsXG4gICAgICAgIGVmZm9ydDogZnJlZUVmZm9ydCxcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxuICAgICAgfSxcbiAgICAgIGV2ZW50LFxuXG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5wb29sLnRpdGxlJykucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSksXG4gICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucG9vbC5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKSxcblxuICAgICAgYWN0b3IsXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgfSk7XG4gIH1cblxuICBfcm9sbFJlY292ZXJ5KCkge1xuICAgIGNvbnN0IHsgYWN0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xuXG4gICAgY29uc3Qgcm9sbCA9IG5ldyBSb2xsKGAxZDYrJHthY3RvckRhdGEucmVjb3ZlcnlNb2R9YCkucm9sbCgpO1xuXG4gICAgLy8gRmxhZyB0aGUgcm9sbCBhcyBhIHJlY292ZXJ5IHJvbGxcbiAgICByb2xsLmRpY2VbMF0ub3B0aW9ucy5yZWNvdmVyeSA9IHRydWU7XG5cbiAgICByb2xsLnRvTWVzc2FnZSh7XG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5yZWNvdmVyeS50aXRsZScpLFxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnJlY292ZXJ5LmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLFxuICAgIH0pO1xuICB9XG5cbiAgX2RlbGV0ZUl0ZW1EaWFsb2coaXRlbUlkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvbkRpYWxvZyA9IG5ldyBEaWFsb2coe1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlLnRpdGxlXCIpLFxuICAgICAgY29udGVudDogYDxwPiR7Z2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5kZWxldGUuY29udGVudFwiKX08L3A+PGhyIC8+YCxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgY29uZmlybToge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1jaGVja1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmJ1dHRvbi5kZWxldGVcIiksXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWN0b3IuZGVsZXRlT3duZWRJdGVtKGl0ZW1JZCk7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmJ1dHRvbi5jYW5jZWxcIiksXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogXCJjYW5jZWxcIlxuICAgIH0pO1xuICAgIGNvbmZpcm1hdGlvbkRpYWxvZy5yZW5kZXIodHJ1ZSk7XG4gIH1cblxuICBfc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIFN0YXRzIFNldHVwXG4gICAgY29uc3QgcG9vbFJvbGxzID0gaHRtbC5maW5kKCcucm9sbC1wb29sJyk7XG4gICAgcG9vbFJvbGxzLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5wb29sKSB7XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZWwuZGF0YXNldDtcblxuICAgICAgdGhpcy5fcm9sbFBvb2xEaWFsb2cocGFyc2VJbnQocG9vbCwgMTApKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmFjdG9yLm93bmVyKSB7XG4gICAgICAvLyBQb29scyByZXF1aXJlIGN1c3RvbSBkcmFnIGxvZ2ljIHNpbmNlIHdlJ3JlICBcbiAgICAgIC8vIG5vdCBjcmVhdGluZyBhIG1hY3JvIGZvciBhbiBpdGVtXG4gICAgICBjb25zdCBoYW5kbGVyID0gZXYgPT4ge1xuICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICAgICAndGV4dC9wbGFpbicsXG4gICAgXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgYWN0b3JJZDogdGhpcy5hY3Rvci5pZCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvb2wnLFxuICAgICAgICAgICAgICBwb29sOiBldi5jdXJyZW50VGFyZ2V0LmRhdGFzZXQucG9vbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfTtcblxuICAgICAgcG9vbFJvbGxzLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmRhbWFnZVRyYWNrXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJy5yZWNvdmVyeS1yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9yb2xsUmVjb3ZlcnkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9za2lsbHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIFNraWxscyBTZXR1cFxuICAgIGh0bWwuZmluZCgnLmFkZC1za2lsbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnc2tpbGwnKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNraWxsc1Bvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2tpbGxzUG9vbEZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIHNraWxsc1Bvb2xGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLnNraWxsc1Bvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNraWxsc1RyYWluaW5nRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInNraWxsc1RyYWluaW5nRmlsdGVyXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gICAgc2tpbGxzVHJhaW5pbmdGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLnNraWxsc1RyYWluaW5nRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNraWxscyA9IGh0bWwuZmluZCgnYS5za2lsbCcpO1xuXG4gICAgc2tpbGxzLm9uKCdjbGljaycsIGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0Lml0ZW1JZCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBza2lsbElkID0gZWwuZGF0YXNldC5pdGVtSWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IHNraWxsID0gYWN0b3IuZ2V0T3duZWRJdGVtKHNraWxsSWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBza2lsbDtcblxuICAgICAgdGhpcy5yZW5kZXIodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5hY3Rvci5vd25lcikge1xuICAgICAgY29uc3QgaGFuZGxlciA9IGV2ID0+IHRoaXMuX29uRHJhZ0l0ZW1TdGFydChldik7XG4gICAgICBza2lsbHMuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZWxlY3RlZFNraWxsIH0gPSB0aGlzO1xuICAgIGlmIChzZWxlY3RlZFNraWxsKSB7XG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0ZWRTa2lsbC5yb2xsKCk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbC5zaGVldC5yZW5kZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAuZGVsZXRlJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fZGVsZXRlSXRlbURpYWxvZyh0aGlzLnNlbGVjdGVkU2tpbGwuX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9hYmlsaXR5VGFiTGlzdGVuZXJzKGh0bWwpIHtcbiAgICAvLyBBYmlsaXRpZXMgU2V0dXBcbiAgICBodG1sLmZpbmQoJy5hZGQtYWJpbGl0eScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnYWJpbGl0eScpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWJpbGl0eVBvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiYWJpbGl0eVBvb2xGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBhYmlsaXR5UG9vbEZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcbiAgICAgIHRoaXMuYWJpbGl0eVBvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWJpbGl0aWVzID0gaHRtbC5maW5kKCdhLmFiaWxpdHknKTtcblxuICAgIGFiaWxpdGllcy5vbignY2xpY2snLCBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pdGVtSWQpIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgY29uc3QgYWJpbGl0eUlkID0gZWwuZGF0YXNldC5pdGVtSWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IGFiaWxpdHkgPSBhY3Rvci5nZXRPd25lZEl0ZW0oYWJpbGl0eUlkKTtcblxuICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBhYmlsaXR5O1xuXG4gICAgICB0aGlzLnJlbmRlcih0cnVlKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmFjdG9yLm93bmVyKSB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gZXYgPT4gdGhpcy5fb25EcmFnSXRlbVN0YXJ0KGV2KTtcbiAgICAgIGFiaWxpdGllcy5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlbGVjdGVkQWJpbGl0eSB9ID0gdGhpcztcbiAgICBpZiAoc2VsZWN0ZWRBYmlsaXR5KSB7XG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLnJvbGwnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzZWxlY3RlZEFiaWxpdHkucm9sbCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5LnNoZWV0LnJlbmRlcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEFiaWxpdHkuX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2ludmVudG9yeVRhYkxpc3RlbmVycyhodG1sKSB7XG4gICAgLy8gSW52ZW50b3J5IFNldHVwXG5cbiAgICBjb25zdCBjdHh0TWVudUVsID0gaHRtbC5maW5kKCcuY29udGV4dG1lbnUnKTtcbiAgICBjb25zdCBhZGRJbnZCdG4gPSBodG1sLmZpbmQoJy5hZGQtaW52ZW50b3J5Jyk7XG5cbiAgICBjb25zdCBtZW51SXRlbXMgPSBbXTtcbiAgICBDU1IuaW52ZW50b3J5VHlwZXMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgIG1lbnVJdGVtcy5wdXNoKHtcbiAgICAgICAgbmFtZTogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IuaW52ZW50b3J5LiR7dHlwZX1gKSxcbiAgICAgICAgaWNvbjogJycsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY3JlYXRlSXRlbSh0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29uc3QgY3R4dE1lbnVPYmogPSBuZXcgQ29udGV4dE1lbnUoaHRtbCwgJy5hY3RpdmUnLCBtZW51SXRlbXMpO1xuXG4gICAgYWRkSW52QnRuLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgLy8gQSBiaXQgb2YgYSBoYWNrIHRvIGVuc3VyZSB0aGUgY29udGV4dCBtZW51IGlzbid0XG4gICAgICAvLyBjdXQgb2ZmIGR1ZSB0byB0aGUgc2hlZXQncyBjb250ZW50IHJlbHlpbmcgb25cbiAgICAgIC8vIG92ZXJmbG93IGhpZGRlbi4gSW5zdGVhZCwgd2UgbmVzdCB0aGUgbWVudSBpbnNpZGVcbiAgICAgIC8vIGEgZmxvYXRpbmcgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGRpdiwgc2V0IHRvIG92ZXJsYXBcbiAgICAgIC8vIHRoZSBhZGQgaW52ZW50b3J5IGl0ZW0gaWNvbi5cbiAgICAgIGN0eHRNZW51RWwub2Zmc2V0KGFkZEludkJ0bi5vZmZzZXQoKSk7XG5cbiAgICAgIGN0eHRNZW51T2JqLnJlbmRlcihjdHh0TWVudUVsLmZpbmQoJy5jb250YWluZXInKSk7XG4gICAgfSk7XG5cbiAgICBodG1sLm9uKCdtb3VzZWRvd24nLCBldnQgPT4ge1xuICAgICAgaWYgKGV2dC50YXJnZXQgPT09IGFkZEludkJ0blswXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIENsb3NlIHRoZSBjb250ZXh0IG1lbnUgaWYgdXNlciBjbGlja3MgYW55d2hlcmUgZWxzZVxuICAgICAgY3R4dE1lbnVPYmouY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGludmVudG9yeVR5cGVGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiaW52ZW50b3J5VHlwZUZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIGludmVudG9yeVR5cGVGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLmludmVudG9yeVR5cGVGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBudWxsO1xuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCcuZmlsdGVyLWVxdWlwcGVkJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLmZpbHRlckVxdWlwcGVkID0gIXRoaXMuZmlsdGVyRXF1aXBwZWQ7XG5cbiAgICAgIHRoaXMucmVuZGVyKHRydWUpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW52SXRlbXMgPSBodG1sLmZpbmQoJ2EuaW52LWl0ZW0nKTtcblxuICAgIGludkl0ZW1zLm9uKCdjbGljaycsIGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0Lml0ZW1JZCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBpbnZJdGVtSWQgPSBlbC5kYXRhc2V0Lml0ZW1JZDtcblxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgICAgY29uc3QgaW52SXRlbSA9IGFjdG9yLmdldE93bmVkSXRlbShpbnZJdGVtSWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IGludkl0ZW07XG5cbiAgICAgIHRoaXMucmVuZGVyKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuYWN0b3Iub3duZXIpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBldiA9PiB0aGlzLl9vbkRyYWdJdGVtU3RhcnQoZXYpO1xuICAgICAgaW52SXRlbXMuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZWxlY3RlZEludkl0ZW0gfSA9IHRoaXM7XG4gICAgaWYgKHNlbGVjdGVkSW52SXRlbSkge1xuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbS5zaGVldC5yZW5kZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEludkl0ZW0uX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3BjTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0LmFjdG9yJykuYWRkQ2xhc3MoJ3BjLXdpbmRvdycpO1xuXG4gICAgLy8gSGFjaywgZm9yIHNvbWUgcmVhc29uIHRoZSBpbm5lciB0YWIncyBjb250ZW50IGRvZXNuJ3Qgc2hvdyBcbiAgICAvLyB3aGVuIGNoYW5naW5nIHByaW1hcnkgdGFicyB3aXRoaW4gdGhlIHNoZWV0XG4gICAgaHRtbC5maW5kKCcuaXRlbVtkYXRhLXRhYj1cInN0YXRzXCJdJykuY2xpY2soKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJUYWIgPSBodG1sLmZpbmQoJy5zdGF0cy10YWJzIC5pdGVtLmFjdGl2ZScpLmZpcnN0KCk7XG4gICAgICBjb25zdCBzZWxlY3RlZFN1YlBhZ2UgPSBodG1sLmZpbmQoYC5zdGF0cy1ib2R5IC50YWJbZGF0YS10YWI9XCIke3NlbGVjdGVkU3ViVGFiLmRhdGEoJ3RhYicpfVwiXWApO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2VsZWN0ZWRTdWJQYWdlLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5fc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpO1xuICAgIHRoaXMuX2FiaWxpdHlUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5faW52ZW50b3J5VGFiTGlzdGVuZXJzKGh0bWwpO1xuICB9XG5cbiAgX25wY0xpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5hY3RvcicpLmFkZENsYXNzKCducGMtd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5tb3ZlbWVudFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICB0aGlzLl9wY0xpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9ucGNMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgX29uRHJhZ0l0ZW1TdGFydChldmVudCkge1xuICAgIGNvbnN0IGl0ZW1JZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pdGVtSWQ7XG4gICAgY29uc3QgY2xpY2tlZEl0ZW0gPSB0aGlzLmFjdG9yLmdldEVtYmVkZGVkRW50aXR5KCdPd25lZEl0ZW0nLCBpdGVtSWQpXG5cbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICd0ZXh0L3BsYWluJyxcblxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBhY3RvcklkOiB0aGlzLmFjdG9yLmlkLFxuICAgICAgICBkYXRhOiBjbGlja2VkSXRlbSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBzdXBlci5fb25EcmFnSXRlbVN0YXJ0KGV2ZW50KTtcbiAgfVxufVxuIiwiLyogZ2xvYmFsIEFjdG9yOmZhbHNlICovXG5cbmltcG9ydCB7IENTUiB9IGZyb20gJy4uL2NvbmZpZy5qcyc7XG5pbXBvcnQgeyB2YWxPckRlZmF1bHQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCB7IFBsYXllckNob2ljZURpYWxvZyB9IGZyb20gJy4uL2RpYWxvZy9wbGF5ZXItY2hvaWNlLWRpYWxvZy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2UgQWN0b3IgZW50aXR5IGJ5IGRlZmluaW5nIGEgY3VzdG9tIHJvbGwgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggaXMgaWRlYWwgZm9yIHRoZSBTaW1wbGUgc3lzdGVtLlxuICogQGV4dGVuZHMge0FjdG9yfVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3IgZXh0ZW5kcyBBY3RvciB7XG4gIC8qKlxuICAgKiBQcmVwYXJlIENoYXJhY3RlciB0eXBlIHNwZWNpZmljIGRhdGFcbiAgICovXG4gIF9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYWN0b3JEYXRhO1xuXG4gICAgZGF0YS5zZW50ZW5jZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNlbnRlbmNlLCB7XG4gICAgICBkZXNjcmlwdG9yOiAnJyxcbiAgICAgIHR5cGU6ICcnLFxuICAgICAgZm9jdXM6ICcnXG4gICAgfSk7XG5cbiAgICBkYXRhLnRpZXIgPSB2YWxPckRlZmF1bHQoZGF0YS50aWVyLCAxKTtcbiAgICBkYXRhLmVmZm9ydCA9IHZhbE9yRGVmYXVsdChkYXRhLmVmZm9ydCwgMSk7XG4gICAgZGF0YS54cCA9IHZhbE9yRGVmYXVsdChkYXRhLnhwLCAwKTtcbiAgICBkYXRhLmN5cGhlckxpbWl0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY3lwaGVyTGltaXQsIDEpO1xuXG4gICAgZGF0YS5hZHZhbmNlcyA9IHZhbE9yRGVmYXVsdChkYXRhLmFkdmFuY2VzLCB7XG4gICAgICBzdGF0czogZmFsc2UsXG4gICAgICBlZGdlOiBmYWxzZSxcbiAgICAgIGVmZm9ydDogZmFsc2UsXG4gICAgICBza2lsbHM6IGZhbHNlLFxuICAgICAgb3RoZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBkYXRhLnJlY292ZXJ5TW9kID0gdmFsT3JEZWZhdWx0KGRhdGEucmVjb3ZlcnlNb2QsIDEpO1xuICAgIGRhdGEucmVjb3ZlcmllcyA9IHZhbE9yRGVmYXVsdChkYXRhLnJlY292ZXJpZXMsIHtcbiAgICAgIGFjdGlvbjogZmFsc2UsXG4gICAgICB0ZW5NaW5zOiBmYWxzZSxcbiAgICAgIG9uZUhvdXI6IGZhbHNlLFxuICAgICAgdGVuSG91cnM6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBkYXRhLmRhbWFnZVRyYWNrID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlVHJhY2ssIDApO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMCk7XG5cbiAgICBkYXRhLnN0YXRzID0gdmFsT3JEZWZhdWx0KGRhdGEuc3RhdHMsIHtcbiAgICAgIG1pZ2h0OiB7XG4gICAgICAgIHZhbHVlOiAwLFxuICAgICAgICBwb29sOiAwLFxuICAgICAgICBlZGdlOiAwXG4gICAgICB9LFxuICAgICAgc3BlZWQ6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH0sXG4gICAgICBpbnRlbGxlY3Q6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRhdGEubW9uZXkgPSB2YWxPckRlZmF1bHQoZGF0YS5tb25leSwgMCk7XG4gIH1cblxuICBfcHJlcGFyZU5QQ0RhdGEoYWN0b3JEYXRhKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhY3RvckRhdGE7XG5cbiAgICBkYXRhLmxldmVsID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWwsIDEpO1xuXG4gICAgZGF0YS5oZWFsdGggPSB2YWxPckRlZmF1bHQoZGF0YS5oZWFsdGgsIDMpO1xuICAgIGRhdGEuZGFtYWdlID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlLCAxKTtcbiAgICBkYXRhLmFybW9yID0gdmFsT3JEZWZhdWx0KGRhdGEuYXJtb3IsIDApO1xuICAgIGRhdGEubW92ZW1lbnQgPSB2YWxPckRlZmF1bHQoZGF0YS5tb3ZlbWVudCwgMSk7XG5cbiAgICBkYXRhLmRlc2NyaXB0aW9uID0gdmFsT3JEZWZhdWx0KGRhdGEuZGVzY3JpcHRpb24sICcnKTtcbiAgICBkYXRhLm1vdGl2ZSA9IHZhbE9yRGVmYXVsdChkYXRhLm1vdGl2ZSwgJycpO1xuICAgIGRhdGEuZW52aXJvbm1lbnQgPSB2YWxPckRlZmF1bHQoZGF0YS5lbnZpcm9ubWVudCwgJycpO1xuICAgIGRhdGEubW9kaWZpY2F0aW9ucyA9IHZhbE9yRGVmYXVsdChkYXRhLm1vZGlmaWNhdGlvbnMsICcnKTtcbiAgICBkYXRhLmNvbWJhdCA9IHZhbE9yRGVmYXVsdChkYXRhLmNvbWJhdCwgJycpO1xuICAgIGRhdGEuaW50ZXJhY3Rpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5pbnRlcmFjdGlvbiwgJycpO1xuICAgIGRhdGEudXNlID0gdmFsT3JEZWZhdWx0KGRhdGEudXNlLCAnJyk7XG4gICAgZGF0YS5sb290ID0gdmFsT3JEZWZhdWx0KGRhdGEubG9vdCwgJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIGFjdG9yIGRhdGEgd2l0aCBhZGRpdGlvbmFsIGR5bmFtaWMgZGF0YS5cbiAgICovXG4gIHByZXBhcmVEYXRhKCkge1xuICAgIHN1cGVyLnByZXBhcmVEYXRhKCk7XG5cbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgZGF0YSA9IGFjdG9yRGF0YS5kYXRhO1xuICAgIGNvbnN0IGZsYWdzID0gYWN0b3JEYXRhLmZsYWdzO1xuXG4gICAgY29uc3QgeyB0eXBlIH0gPSBhY3RvckRhdGE7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdwYyc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVQQ0RhdGEoYWN0b3JEYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9wcmVwYXJlTlBDRGF0YShhY3RvckRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBnZXQgaW5pdGlhdGl2ZUxldmVsKCkge1xuICAgIGNvbnN0IGluaXRTa2lsbCA9IHRoaXMuZGF0YS5pdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09ICdza2lsbCcgJiYgaS5kYXRhLmZsYWdzLmluaXRpYXRpdmUpWzBdO1xuICAgIHJldHVybiBpbml0U2tpbGwuZGF0YS50cmFpbmluZyAtIDE7XG4gIH1cblxuICBnZXQgY2FuUmVmdXNlSW50cnVzaW9uKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcy5kYXRhO1xuXG4gICAgcmV0dXJuIGRhdGEueHAgPiAwO1xuICB9XG5cbiAgZ2V0IGlzT3ZlckN5cGhlckxpbWl0KCkge1xuICAgIGNvbnN0IGN5cGhlcnMgPSB0aGlzLmdldEVtYmVkZGVkQ29sbGVjdGlvbihcIk93bmVkSXRlbVwiKS5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IFwiY3lwaGVyXCIpO1xuICAgIHJldHVybiB0aGlzLmRhdGEuZGF0YS5jeXBoZXJMaW1pdCA8IGN5cGhlcnMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0U2tpbGxMZXZlbChza2lsbCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gc2tpbGwuZGF0YTtcblxuICAgIHJldHVybiBkYXRhLnRyYWluaW5nIC0gMTtcbiAgfVxuXG4gIGdldEVmZm9ydENvc3RGcm9tU3RhdChwb29sLCBlZmZvcnRMZXZlbCkge1xuICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgY29zdDogMCxcbiAgICAgIGVmZm9ydExldmVsOiAwLFxuICAgICAgd2FybmluZzogbnVsbCxcbiAgICB9O1xuXG4gICAgaWYgKGVmZm9ydExldmVsID09PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIC8vIFRoZSBmaXJzdCBlZmZvcnQgbGV2ZWwgY29zdHMgMyBwdHMgZnJvbSB0aGUgcG9vbCwgZXh0cmEgbGV2ZWxzIGNvc3QgMlxuICAgIC8vIFN1YnN0cmFjdCB0aGUgcmVsYXRlZCBFZGdlLCB0b29cbiAgICBjb25zdCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCA9IChzdGF0LnZhbHVlICsgc3RhdC5lZGdlIC0gMSkgLyAyO1xuXG4gICAgLy8gQSBQQyBjYW4gdXNlIGFzIG11Y2ggYXMgdGhlaXIgRWZmb3J0IHNjb3JlLCBidXQgbm90IG1vcmVcbiAgICAvLyBUaGV5J3JlIGFsc28gbGltaXRlZCBieSB0aGVpciBjdXJyZW50IHBvb2wgdmFsdWVcbiAgICBjb25zdCBmaW5hbEVmZm9ydCA9IE1hdGgubWluKGVmZm9ydExldmVsLCBhY3RvckRhdGEuZWZmb3J0LCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCk7XG4gICAgY29uc3QgY29zdCA9IDEgKyAyICogZmluYWxFZmZvcnQgLSBzdGF0LmVkZ2U7XG5cbiAgICAvLyBUT0RPIHRha2UgZnJlZSBsZXZlbHMgb2YgRWZmb3J0IGludG8gYWNjb3VudCBoZXJlXG5cbiAgICBsZXQgd2FybmluZyA9IG51bGw7XG4gICAgaWYgKGVmZm9ydExldmVsID4gYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wpIHtcbiAgICAgIHdhcm5pbmcgPSBgTm90IGVub3VnaCBwb2ludHMgaW4geW91ciAke3Bvb2xOYW1lfSBwb29sIGZvciB0aGF0IGxldmVsIG9mIEVmZm9ydGA7XG4gICAgfVxuXG4gICAgdmFsdWUuY29zdCA9IGNvc3Q7XG4gICAgdmFsdWUuZWZmb3J0TGV2ZWwgPSBmaW5hbEVmZm9ydDtcbiAgICB2YWx1ZS53YXJuaW5nID0gd2FybmluZztcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGdldEVkZ2VGcm9tU3RhdChwb29sKSB7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIHJldHVybiBzdGF0LmVkZ2U7XG4gIH1cblxuICBnZXRGcmVlRWZmb3J0RnJvbVN0YXQocG9vbCkge1xuICAgIGNvbnN0IGVkZ2UgPSB0aGlzLmdldEVkZ2VGcm9tU3RhdChwb29sKTtcblxuICAgIHJldHVybiBNYXRoLm1heChNYXRoLmZsb29yKChlZGdlIC0gMSkgLyAyKSwgMCk7XG4gIH1cblxuICBjYW5TcGVuZEZyb21Qb29sKHBvb2wsIGFtb3VudCwgYXBwbHlFZGdlID0gdHJ1ZSkge1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xuICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZV07XG4gICAgY29uc3QgcG9vbEFtb3VudCA9IHN0YXQudmFsdWU7XG5cbiAgICByZXR1cm4gKGFwcGx5RWRnZSA/IGFtb3VudCAtIHN0YXQuZWRnZSA6IGFtb3VudCkgPD0gcG9vbEFtb3VudDtcbiAgfVxuXG4gIHNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50KSB7XG4gICAgaWYgKCF0aGlzLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xuICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWUudG9Mb3dlckNhc2UoKV07XG5cbiAgICBjb25zdCBkYXRhID0ge307XG4gICAgZGF0YVtgZGF0YS5zdGF0cy4ke3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCl9LnZhbHVlYF0gPSBNYXRoLm1heCgwLCBzdGF0LnZhbHVlIC0gYW1vdW50KTtcbiAgICB0aGlzLnVwZGF0ZShkYXRhKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgb25HTUludHJ1c2lvbihhY2NlcHRlZCkge1xuICAgIGxldCB4cCA9IHRoaXMuZGF0YS5kYXRhLnhwO1xuXG4gICAgbGV0IGNoYXRDb250ZW50ID0gYDxoMj4ke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5jaGF0LmhlYWRpbmcnKX08L2gyPjxicj5gO1xuICAgIGlmIChhY2NlcHRlZCkge1xuICAgICAgeHArKztcblxuICAgICAgY2hhdENvbnRlbnQgKz0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW50cnVzaW9uLmNoYXQuYWNjZXB0JykucmVwbGFjZSgnIyNBQ1RPUiMjJywgdGhpcy5kYXRhLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB4cC0tO1xuXG4gICAgICBjaGF0Q29udGVudCArPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnRydXNpb24uY2hhdC5yZWZ1c2UnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCB0aGlzLmRhdGEubmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLl9pZCxcbiAgICAgICdkYXRhLnhwJzogeHAsXG4gICAgfSk7XG5cbiAgICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgICAgY29udGVudDogY2hhdENvbnRlbnRcbiAgICB9KTtcblxuICAgIGlmIChhY2NlcHRlZCkge1xuICAgICAgY29uc3Qgb3RoZXJBY3RvcnMgPSBnYW1lLmFjdG9ycy5maWx0ZXIoYWN0b3IgPT4gYWN0b3IuX2lkICE9PSB0aGlzLl9pZCAmJiBhY3Rvci5kYXRhLnR5cGUgPT09ICdwYycpO1xuXG4gICAgICBjb25zdCBkaWFsb2cgPSBuZXcgUGxheWVyQ2hvaWNlRGlhbG9nKG90aGVyQWN0b3JzLCAoY2hvc2VuQWN0b3JJZCkgPT4ge1xuICAgICAgICBnYW1lLnNvY2tldC5lbWl0KCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywge1xuICAgICAgICAgIHR5cGU6ICdhd2FyZFhQJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhY3RvcklkOiBjaG9zZW5BY3RvcklkLFxuICAgICAgICAgICAgeHBBbW91bnQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIGRpYWxvZy5yZW5kZXIodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlRW1iZWRkZWRFbnRpdHkoLi4uYXJncykge1xuICAgIGNvbnN0IFtfLCBkYXRhXSA9IGFyZ3M7XG5cbiAgICAvLyBSb2xsIHRoZSBcImxldmVsIGRpZVwiIHRvIGRldGVybWluZSB0aGUgaXRlbSdzIGxldmVsLCBpZiBwb3NzaWJsZVxuICAgIGlmIChkYXRhLmRhdGEgJiYgQ1NSLmhhc0xldmVsRGllLmluY2x1ZGVzKGRhdGEudHlwZSkpIHtcbiAgICAgIGNvbnN0IGl0ZW1EYXRhID0gZGF0YS5kYXRhO1xuXG4gICAgICBpZiAoIWl0ZW1EYXRhLmxldmVsICYmIGl0ZW1EYXRhLmxldmVsRGllKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2VlIGlmIHRoZSBmb3JtdWxhIGlzIHZhbGlkXG4gICAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBuZXcgUm9sbChpdGVtRGF0YS5sZXZlbERpZSkucm9sbCgpLnRvdGFsO1xuICAgICAgICAgIGF3YWl0IHRoaXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogdGhpcy5faWQsXG4gICAgICAgICAgICBcImRhdGEubGV2ZWxcIjogaXRlbURhdGEubGV2ZWwsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBJZiBub3QsIGZhbGxiYWNrIHRvIHNhbmUgZGVmYXVsdFxuICAgICAgICAgIGl0ZW1EYXRhLmxldmVsID0gaXRlbURhdGEubGV2ZWwgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBpdGVtRGF0YS5sZXZlbCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5jcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKTtcbiAgfVxufVxuIiwiLyogZ2xvYmFsICQgKi9cblxuaW1wb3J0IHsgcm9sbFRleHQgfSBmcm9tICcuL3JvbGxzLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoYXRNZXNzYWdlKGNoYXRNZXNzYWdlLCBodG1sLCBfZGF0YSkge1xuICAvLyBEb24ndCBhcHBseSBDaGF0TWVzc2FnZSBlbmhhbmNlbWVudCB0byByZWNvdmVyeSByb2xsc1xuICBpZiAoY2hhdE1lc3NhZ2Uucm9sbCAmJiAhY2hhdE1lc3NhZ2Uucm9sbC5kaWNlWzBdLm9wdGlvbnMucmVjb3ZlcnkpIHtcbiAgICBjb25zdCBkaWVSb2xsID0gY2hhdE1lc3NhZ2Uucm9sbC5kaWNlWzBdLnJlc3VsdHNbMF0ucmVzdWx0O1xuICAgIGNvbnN0IHJvbGxUb3RhbCA9IGNoYXRNZXNzYWdlLnJvbGwudG90YWw7XG4gICAgY29uc3QgbWVzc2FnZXMgPSByb2xsVGV4dChkaWVSb2xsLCByb2xsVG90YWwpO1xuICAgIGNvbnN0IG51bU1lc3NhZ2VzID0gbWVzc2FnZXMubGVuZ3RoO1xuXG4gICAgY29uc3QgbWVzc2FnZUNvbnRhaW5lciA9ICQoJzxkaXYvPicpO1xuICAgIG1lc3NhZ2VDb250YWluZXIuYWRkQ2xhc3MoJ3NwZWNpYWwtbWVzc2FnZXMnKTtcblxuICAgIG1lc3NhZ2VzLmZvckVhY2goKHNwZWNpYWwsIGlkeCkgPT4ge1xuICAgICAgY29uc3QgeyB0ZXh0LCBjb2xvciwgY2xzIH0gPSBzcGVjaWFsO1xuXG4gICAgICBjb25zdCBuZXdDb250ZW50ID0gYDxzcGFuIGNsYXNzPVwiJHtjbHN9XCIgc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj4ke3RleHR9PC9zcGFuPiR7aWR4IDwgbnVtTWVzc2FnZXMgLSAxID8gJzxiciAvPicgOiAnJ31gO1xuXG4gICAgICBtZXNzYWdlQ29udGFpbmVyLmFwcGVuZChuZXdDb250ZW50KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGR0ID0gaHRtbC5maW5kKFwiLmRpY2UtdG90YWxcIik7XG4gICAgbWVzc2FnZUNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZHQpO1xuICB9XG59XG4iLCIvKipcbiAqIFJvbGwgaW5pdGlhdGl2ZSBmb3Igb25lIG9yIG11bHRpcGxlIENvbWJhdGFudHMgd2l0aGluIHRoZSBDb21iYXQgZW50aXR5XG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gaWRzICAgICAgICBBIENvbWJhdGFudCBpZCBvciBBcnJheSBvZiBpZHMgZm9yIHdoaWNoIHRvIHJvbGxcbiAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGZvcm11bGEgICAgIEEgbm9uLWRlZmF1bHQgaW5pdGlhdGl2ZSBmb3JtdWxhIHRvIHJvbGwuIE90aGVyd2lzZSB0aGUgc3lzdGVtIGRlZmF1bHQgaXMgdXNlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlT3B0aW9ucyAgIEFkZGl0aW9uYWwgb3B0aW9ucyB3aXRoIHdoaWNoIHRvIGN1c3RvbWl6ZSBjcmVhdGVkIENoYXQgTWVzc2FnZXNcbiAqIEByZXR1cm4ge1Byb21pc2UuPENvbWJhdD59ICAgICAgIEEgcHJvbWlzZSB3aGljaCByZXNvbHZlcyB0byB0aGUgdXBkYXRlZCBDb21iYXQgZW50aXR5IG9uY2UgdXBkYXRlcyBhcmUgY29tcGxldGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByb2xsSW5pdGlhdGl2ZShpZHMsIGZvcm11bGEgPSBudWxsLCBtZXNzYWdlT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGNvbWJhdGFudFVwZGF0ZXMgPSBbXTtcbiAgY29uc3QgbWVzc2FnZXMgPSBbXVxuXG4gIC8vIEZvcmNlIGlkcyB0byBiZSBhbiBhcnJheSBzbyBvdXIgZm9yIGxvb3AgZG9lc24ndCBicmVha1xuICBpZHMgPSB0eXBlb2YgaWRzID09PSAnc3RyaW5nJyA/IFtpZHNdIDogaWRzO1xuICBmb3IgKGxldCBpZCBvZiBpZHMpIHtcbiAgICBjb25zdCBjb21iYXRhbnQgPSBhd2FpdCB0aGlzLmdldENvbWJhdGFudChpZCk7XG4gICAgaWYgKGNvbWJhdGFudC5kZWZlYXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYWN0b3IgfSA9IGNvbWJhdGFudDtcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhO1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gYWN0b3JEYXRhO1xuXG4gICAgbGV0IGluaXRpYXRpdmU7XG4gICAgbGV0IHJvbGxSZXN1bHQ7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAvLyBQQ3MgdXNlIGEgc2ltcGxlIGQyMCByb2xsIG1vZGlmaWVkIGJ5IGFueSB0cmFpbmluZyBpbiBhbiBJbml0aWF0aXZlIHNraWxsXG4gICAgICBjYXNlICdwYyc6XG4gICAgICAgIGNvbnN0IGluaXRCb251cyA9IGFjdG9yLmluaXRpYXRpdmVMZXZlbDtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBpbml0Qm9udXMgPCAwID8gJy0nIDogJysnO1xuICAgICAgICBjb25zdCByb2xsRm9ybXVsYSA9ICcxZDIwJyArIChpbml0Qm9udXMgPT09IDAgPyAnJyA6IGAke29wZXJhdG9yfSR7MypNYXRoLmFicyhpbml0Qm9udXMpfWApO1xuXG4gICAgICAgIGNvbnN0IHJvbGwgPSBuZXcgUm9sbChyb2xsRm9ybXVsYSkucm9sbCgpO1xuICAgICAgICBpbml0aWF0aXZlID0gTWF0aC5tYXgocm9sbC50b3RhbCwgMCk7IC8vIERvbid0IGxldCBpbml0aWF0aXZlIGdvIGJlbG93IDBcbiAgICAgICAgcm9sbFJlc3VsdCA9IHJvbGwucmVzdWx0O1xuICAgICAgICBcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIE5QQ3MgaGF2ZSBhIGZpeGVkIGluaXRpYXRpdmUgYmFzZWQgb24gdGhlaXIgbGV2ZWxcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIGNvbnN0IHsgbGV2ZWwgfSA9IGFjdG9yRGF0YS5kYXRhO1xuICAgICAgICBpbml0aWF0aXZlID0gMyAqIGxldmVsO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb21iYXRhbnRVcGRhdGVzLnB1c2goe1xuICAgICAgX2lkOiBjb21iYXRhbnQuX2lkLFxuICAgICAgaW5pdGlhdGl2ZVxuICAgIH0pO1xuXG4gICAgLy8gU2luY2UgTlBDIGluaXRpYXRpdmUgaXMgZml4ZWQsIGRvbid0IGJvdGhlciBzaG93aW5nIGl0IGluIGNoYXRcbiAgICBpZiAodHlwZSA9PT0gJ3BjJykge1xuICAgICAgY29uc3QgeyB0b2tlbiB9ID0gY29tYmF0YW50O1xuICAgICAgY29uc3QgaXNIaWRkZW4gPSB0b2tlbi5oaWRkZW4gfHwgY29tYmF0YW50LmhpZGRlbjtcbiAgICAgIGNvbnN0IHdoaXNwZXIgPSBpc0hpZGRlbiA/IGdhbWUudXNlcnMuZW50aXRpZXMuZmlsdGVyKHUgPT4gdS5pc0dNKSA6ICcnO1xuXG4gICAgICAvLyBUT0RPOiBJbXByb3ZlIHRoZSBjaGF0IG1lc3NhZ2UsIHRoaXMgY3VycmVudGx5XG4gICAgICAvLyBqdXN0IHJlcGxpY2F0ZXMgdGhlIG5vcm1hbCByb2xsIG1lc3NhZ2UuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImRpY2Utcm9sbFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXJlc3VsdFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpY2UtZm9ybXVsYVwiPiR7cm9sbFJlc3VsdH08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXRvb2x0aXBcIj5cbiAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ0b29sdGlwLXBhcnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZVwiPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJwYXJ0LWZvcm11bGFcIj5cbiAgICAgICAgICAgICAgICAgICAgMWQyMFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBhcnQtdG90YWxcIj4ke2luaXRpYXRpdmV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgICAgICA8b2wgY2xhc3M9XCJkaWNlLXJvbGxzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInJvbGwgZGllIGQyMFwiPiR7aW5pdGlhdGl2ZX08L2xpPlxuICAgICAgICAgICAgICAgICAgPC9vbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS10b3RhbFwiPiR7aW5pdGlhdGl2ZX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0gbWVyZ2VPYmplY3Qoe1xuICAgICAgICBzcGVha2VyOiB7XG4gICAgICAgICAgc2NlbmU6IGNhbnZhcy5zY2VuZS5faWQsXG4gICAgICAgICAgYWN0b3I6IGFjdG9yID8gYWN0b3IuX2lkIDogbnVsbCxcbiAgICAgICAgICB0b2tlbjogdG9rZW4uX2lkLFxuICAgICAgICAgIGFsaWFzOiB0b2tlbi5uYW1lLFxuICAgICAgICB9LFxuICAgICAgICB3aGlzcGVyLFxuICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmluaXRpYXRpdmUuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgdG9rZW4ubmFtZSksXG4gICAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlLFxuICAgICAgfSwgbWVzc2FnZU9wdGlvbnMpO1xuXG4gICAgICBtZXNzYWdlcy5wdXNoKG1lc3NhZ2VEYXRhKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbWJhdGFudFVwZGF0ZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXdhaXQgdGhpcy51cGRhdGVFbWJlZGRlZEVudGl0eSgnQ29tYmF0YW50JywgY29tYmF0YW50VXBkYXRlcyk7XG5cbiAgQ2hhdE1lc3NhZ2UuY3JlYXRlKG1lc3NhZ2VzKTtcblxuICByZXR1cm4gdGhpcztcbn1cbiIsImV4cG9ydCBjb25zdCBDU1IgPSB7fTtcblxuQ1NSLml0ZW1UeXBlcyA9IFtcbiAgJ3NraWxscycsXG4gICdhYmlsaXRpZXMnLFxuICAnY3lwaGVycycsXG4gICdhcnRpZmFjdHMnLFxuICAnb2RkaXRpZXMnLFxuICAnd2VhcG9ucycsXG4gICdhcm1vcicsXG4gICdnZWFyJ1xuXTtcblxuQ1NSLmludmVudG9yeVR5cGVzID0gW1xuICAnd2VhcG9uJyxcbiAgJ2FybW9yJyxcbiAgJ2dlYXInLFxuXG4gICdjeXBoZXInLFxuICAnYXJ0aWZhY3QnLFxuICAnb2RkaXR5J1xuXTtcblxuQ1NSLndlaWdodENsYXNzZXMgPSBbXG4gICdsaWdodCcsXG4gICdtZWRpdW0nLFxuICAnaGVhdnknXG5dO1xuXG5DU1Iud2VhcG9uVHlwZXMgPSBbXG4gICdiYXNoaW5nJyxcbiAgJ2JsYWRlZCcsXG4gICdyYW5nZWQnLFxuXVxuXG5DU1Iuc3RhdHMgPSBbXG4gICdtaWdodCcsXG4gICdzcGVlZCcsXG4gICdpbnRlbGxlY3QnLFxuXTtcblxuQ1NSLnRyYWluaW5nTGV2ZWxzID0gW1xuICAnaW5hYmlsaXR5JyxcbiAgJ3VudHJhaW5lZCcsXG4gICd0cmFpbmVkJyxcbiAgJ3NwZWNpYWxpemVkJ1xuXTtcblxuQ1NSLmRhbWFnZVRyYWNrID0gW1xuICAnaGFsZScsXG4gICdpbXBhaXJlZCcsXG4gICdkZWJpbGl0YXRlZCcsXG4gICdkZWFkJ1xuXTtcblxuQ1NSLnJlY292ZXJpZXMgPSBbXG4gICdhY3Rpb24nLFxuICAndGVuTWlucycsXG4gICdvbmVIb3VyJyxcbiAgJ3RlbkhvdXJzJ1xuXTtcblxuQ1NSLmFkdmFuY2VzID0gW1xuICAnc3RhdHMnLFxuICAnZWRnZScsXG4gICdlZmZvcnQnLFxuICAnc2tpbGxzJyxcbiAgJ290aGVyJ1xuXTtcblxuQ1NSLnJhbmdlcyA9IFtcbiAgJ2ltbWVkaWF0ZScsXG4gICdzaG9ydCcsXG4gICdsb25nJyxcbiAgJ3ZlcnlMb25nJ1xuXTtcblxuQ1NSLm9wdGlvbmFsUmFuZ2VzID0gW1wibmFcIl0uY29uY2F0KENTUi5yYW5nZXMpO1xuXG5DU1IuYWJpbGl0eVR5cGVzID0gW1xuICAnYWN0aW9uJyxcbiAgJ2VuYWJsZXInLFxuXTtcblxuQ1NSLnN1cHBvcnRzTWFjcm9zID0gW1xuICAnc2tpbGwnLFxuICAnYWJpbGl0eSdcbl07XG5cbkNTUi5oYXNMZXZlbERpZSA9IFtcbiAgJ2N5cGhlcicsXG4gICdhcnRpZmFjdCdcbl07XG4iLCIvKiBnbG9iYWxzIEVOVElUWV9QRVJNSVNTSU9OUyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0b3JEaXJlY3RvcnlDb250ZXh0KGh0bWwsIGVudHJ5T3B0aW9ucykge1xuICBlbnRyeU9wdGlvbnMucHVzaCh7XG4gICAgbmFtZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpLFxuICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1leGNsYW1hdGlvbi1jaXJjbGVcIj48L2k+JyxcblxuICAgIGNhbGxiYWNrOiBsaSA9PiB7XG4gICAgICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmdldChsaS5kYXRhKCdlbnRpdHlJZCcpKTtcbiAgICAgIGNvbnN0IG93bmVySWRzID0gT2JqZWN0LmVudHJpZXMoYWN0b3IuZGF0YS5wZXJtaXNzaW9uKVxuICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IHtcbiAgICAgICAgICBjb25zdCBbaWQsIHBlcm1pc3Npb25MZXZlbF0gPSBlbnRyeTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbkxldmVsID49IEVOVElUWV9QRVJNSVNTSU9OUy5PV05FUiAmJiBpZCAhPT0gZ2FtZS51c2VyLmlkO1xuICAgICAgICB9KVxuICAgICAgICAubWFwKHVzZXJzUGVybWlzc2lvbnMgPT4gdXNlcnNQZXJtaXNzaW9uc1swXSk7XG5cbiAgICAgIGdhbWUuc29ja2V0LmVtaXQoJ3N5c3RlbS5jeXBoZXJzeXN0ZW0nLCB7XG4gICAgICAgIHR5cGU6ICdnbUludHJ1c2lvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB1c2VySWRzOiBvd25lcklkcyxcbiAgICAgICAgICBhY3RvcklkOiBhY3Rvci5kYXRhLl9pZCxcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5jdHh0LmludHJ1c2lvbi5oZWFkaW5nJyk7XG4gICAgICBjb25zdCBib2R5ID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLmRhdGEubmFtZSk7XG5cbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZSh7XG4gICAgICAgIGNvbnRlbnQ6IGA8aDI+JHtoZWFkaW5nfTwvaDI+PGJyLz4ke2JvZHl9YCxcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjb25kaXRpb246IGxpID0+IHtcbiAgICAgIGlmICghZ2FtZS51c2VyLmlzR00pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmdldChsaS5kYXRhKCdlbnRpdHlJZCcpKTtcbiAgICAgIHJldHVybiBhY3RvciAmJiBhY3Rvci5kYXRhLnR5cGUgPT09ICdwYyc7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIGdsb2JhbCBDb21iYXQgKi9cblxuLy8gSW1wb3J0IE1vZHVsZXNcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yIH0gZnJvbSBcIi4vYWN0b3IvYWN0b3IuanNcIjtcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yU2hlZXQgfSBmcm9tIFwiLi9hY3Rvci9hY3Rvci1zaGVldC5qc1wiO1xuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtSXRlbSB9IGZyb20gXCIuL2l0ZW0vaXRlbS5qc1wiO1xuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IH0gZnJvbSBcIi4vaXRlbS9pdGVtLXNoZWV0LmpzXCI7XG5cbmltcG9ydCB7IHJlZ2lzdGVySGFuZGxlYmFySGVscGVycyB9IGZyb20gJy4vaGFuZGxlYmFycy1oZWxwZXJzLmpzJztcbmltcG9ydCB7IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzIH0gZnJvbSAnLi90ZW1wbGF0ZS5qcyc7XG5cbmltcG9ydCB7IHJlZ2lzdGVyU3lzdGVtU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzLmpzJztcbmltcG9ydCB7IHJlbmRlckNoYXRNZXNzYWdlIH0gZnJvbSAnLi9jaGF0LmpzJztcbmltcG9ydCB7IGFjdG9yRGlyZWN0b3J5Q29udGV4dCB9IGZyb20gJy4vY29udGV4dC1tZW51LmpzJztcbmltcG9ydCB7IG1pZ3JhdGUgfSBmcm9tICcuL21pZ3JhdGlvbnMvbWlncmF0ZSc7XG5pbXBvcnQgeyBjc3JTb2NrZXRMaXN0ZW5lcnMgfSBmcm9tICcuL3NvY2tldC5qcyc7XG5pbXBvcnQgeyByb2xsSW5pdGlhdGl2ZSB9IGZyb20gJy4vY29tYmF0LmpzJztcbmltcG9ydCB7IHVzZVBvb2xNYWNybywgdXNlU2tpbGxNYWNybywgdXNlQWJpbGl0eU1hY3JvLCB1c2VDeXBoZXJNYWNybywgY3JlYXRlQ3lwaGVyTWFjcm8gfSBmcm9tICcuL21hY3Jvcy5qcyc7XG5cbkhvb2tzLm9uY2UoJ2luaXQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGdhbWUuY3lwaGVyc3lzdGVtID0ge1xuICAgIEN5cGhlclN5c3RlbUFjdG9yLFxuICAgIEN5cGhlclN5c3RlbUl0ZW0sXG5cbiAgICBtYWNybzoge1xuICAgICAgdXNlUG9vbDogdXNlUG9vbE1hY3JvLFxuICAgICAgdXNlU2tpbGw6IHVzZVNraWxsTWFjcm8sXG4gICAgICB1c2VBYmlsaXR5OiB1c2VBYmlsaXR5TWFjcm8sXG4gICAgICB1c2VDeXBoZXI6IHVzZUN5cGhlck1hY3JvXG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgYW4gaW5pdGlhdGl2ZSBmb3JtdWxhIGZvciB0aGUgc3lzdGVtXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBDb21iYXQucHJvdG90eXBlLnJvbGxJbml0aWF0aXZlID0gcm9sbEluaXRpYXRpdmU7XG5cbiAgLy8gRGVmaW5lIGN1c3RvbSBFbnRpdHkgY2xhc3Nlc1xuICBDT05GSUcuQWN0b3IuZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1BY3RvcjtcbiAgQ09ORklHLkl0ZW0uZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1JdGVtO1xuXG4gIC8vIFJlZ2lzdGVyIHNoZWV0IGFwcGxpY2F0aW9uIGNsYXNzZXNcbiAgQWN0b3JzLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEFjdG9yU2hlZXQpO1xuICAvLyBUT0RPOiBTZXBhcmF0ZSBjbGFzc2VzIHBlciB0eXBlXG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW0nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsncGMnXSxcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcbiAgfSk7XG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW0nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsnbnBjJ10sXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXG4gIH0pO1xuXG4gIEl0ZW1zLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEl0ZW1TaGVldCk7XG4gIEl0ZW1zLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbScsIEN5cGhlclN5c3RlbUl0ZW1TaGVldCwgeyBtYWtlRGVmYXVsdDogdHJ1ZSB9KTtcblxuICByZWdpc3RlclN5c3RlbVNldHRpbmdzKCk7XG4gIHJlZ2lzdGVySGFuZGxlYmFySGVscGVycygpO1xuICBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcygpO1xufSk7XG5cbkhvb2tzLm9uKCdyZW5kZXJDaGF0TWVzc2FnZScsIHJlbmRlckNoYXRNZXNzYWdlKTtcblxuSG9va3Mub24oJ2dldEFjdG9yRGlyZWN0b3J5RW50cnlDb250ZXh0JywgYWN0b3JEaXJlY3RvcnlDb250ZXh0KTtcblxuLy8gSG9va3Mub24oJ2NyZWF0ZUFjdG9yJywgYXN5bmMgZnVuY3Rpb24oYWN0b3IsIG9wdGlvbnMsIHVzZXJJZCkge1xuSG9va3Mub24oJ2NyZWF0ZUFjdG9yJywgYXN5bmMgZnVuY3Rpb24oYWN0b3IpIHtcbiAgY29uc3QgeyB0eXBlIH0gPSBhY3Rvci5kYXRhO1xuICBpZiAodHlwZSA9PT0gJ3BjJykge1xuICAgIC8vIEdpdmUgUENzIHRoZSBcIkluaXRpYXRpdmVcIiBza2lsbCBieSBkZWZhdWx0LCBhcyBpdCB3aWxsIGJlIHVzZWRcbiAgICAvLyBieSB0aGUgaW50aWF0aXZlIGZvcm11bGEgaW4gY29tYmF0LlxuICAgIGFjdG9yLmNyZWF0ZU93bmVkSXRlbSh7XG4gICAgICBuYW1lOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5za2lsbC5pbml0aWF0aXZlJyksXG4gICAgICB0eXBlOiAnc2tpbGwnLFxuICAgICAgZGF0YTogbmV3IEN5cGhlclN5c3RlbUl0ZW0oe1xuICAgICAgICAncG9vbCc6IDEsIC8vIFNwZWVkXG4gICAgICAgICd0cmFpbmluZyc6IDEsIC8vIFVudHJhaW5lZFxuXG4gICAgICAgICdmbGFncy5pbml0aWF0aXZlJzogdHJ1ZVxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Ib29rcy5vbmNlKCdyZWFkeScsIG1pZ3JhdGUpO1xuSG9va3Mub25jZSgncmVhZHknLCBjc3JTb2NrZXRMaXN0ZW5lcnMpO1xuLy8gUmVnaXN0ZXIgaG9va3Ncbkhvb2tzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICBIb29rcy5vbignaG90YmFyRHJvcCcsIChfLCBkYXRhLCBzbG90KSA9PiBjcmVhdGVDeXBoZXJNYWNybyhkYXRhLCBzbG90KSk7XG59KTtcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXG5cbi8qKlxuICogUHJvbXB0cyB0aGUgdXNlciB3aXRoIGEgY2hvaWNlIG9mIGEgR00gSW50cnVzaW9uLlxuICogXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgR01JbnRydXNpb25EaWFsb2dcbiAqIEBleHRlbmRzIHtEaWFsb2d9XG4gKi9cbmV4cG9ydCBjbGFzcyBHTUludHJ1c2lvbkRpYWxvZyBleHRlbmRzIERpYWxvZyB7XG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIHRlbXBsYXRlOiBcInRlbXBsYXRlcy9odWQvZGlhbG9nLmh0bWxcIixcbiAgICAgIGNsYXNzZXM6IFtcImNzclwiLCBcImRpYWxvZ1wiXSxcbiAgICAgIHdpZHRoOiA1MDBcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhY2NlcHRRdWVzdGlvbiA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24uZG9Zb3VBY2NlcHQnKTtcbiAgICBjb25zdCBhY2NlcHRJbnN0cnVjdGlvbnMgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLmFjY2VwdEluc3RydWN0aW9ucycpXG4gICAgICAucmVwbGFjZSgnIyNBQ0NFUFQjIycsIGA8c3BhbiBzdHlsZT1cImNvbG9yOiBncmVlblwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuYWNjZXB0Jyl9PC9zcGFuPmApO1xuICAgIGNvbnN0IHJlZnVzZUluc3RydWN0aW9ucyA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24ucmVmdXNlSW5zdHJ1Y3Rpb25zJylcbiAgICAgIC5yZXBsYWNlKCcjI1JFRlVTRSMjJywgYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucmVmdXNlJyl9PC9zcGFuPmApO1xuXG4gICAgbGV0IGRpYWxvZ0NvbnRlbnQgPSBgXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICA8cD4ke2FjY2VwdFF1ZXN0aW9ufTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNlwiPlxuICAgICAgICA8cD4ke2FjY2VwdEluc3RydWN0aW9uc308L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNlwiPlxuICAgICAgICA8cD4ke3JlZnVzZUluc3RydWN0aW9uc308L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8aHIgLz5gO1xuXG4gICAgbGV0IGRpYWxvZ0J1dHRvbnMgPSB7XG4gICAgICBvazoge1xuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIiBzdHlsZT1cImNvbG9yOiBncmVlblwiPjwvaT4nLFxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmJ1dHRvbi5hY2NlcHQnKSxcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBhY3Rvci5vbkdNSW50cnVzaW9uKHRydWUpO1xuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjYW5jZWw6IHtcbiAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCIgc3R5bGU9XCJjb2xvcjogcmVkXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLnJlZnVzZScpLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IGFjdG9yLm9uR01JbnRydXNpb24oZmFsc2UpO1xuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFhY3Rvci5jYW5SZWZ1c2VJbnRydXNpb24pIHtcbiAgICAgIGNvbnN0IG5vdEVub3VnaFhQID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi5ub3RFbm91Z2hYUCcpO1xuXG4gICAgICBkaWFsb2dDb250ZW50ICs9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgIDxwPjxzdHJvbmc+JHtub3RFbm91Z2hYUH08L3N0cm9uZz48L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8aHIgLz5gXG5cbiAgICAgIGRlbGV0ZSBkaWFsb2dCdXR0b25zLmNhbmNlbDtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFsb2dEYXRhID0ge1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24udGl0bGUnKSxcbiAgICAgIGNvbnRlbnQ6IGRpYWxvZ0NvbnRlbnQsXG4gICAgICBidXR0b25zOiBkaWFsb2dCdXR0b25zLFxuICAgICAgZGVmYXVsdFllczogZmFsc2UsXG4gICAgfTtcblxuICAgIHN1cGVyKGRpYWxvZ0RhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hY3RvciA9IGFjdG9yO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBfZ2V0SGVhZGVyQnV0dG9ucygpIHtcbiAgICAvLyBEb24ndCBpbmNsdWRlIGFueSBoZWFkZXIgYnV0dG9ucywgZm9yY2UgYW4gb3B0aW9uIHRvIGJlIGNob3NlblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgY2xvc2UoKSB7XG4gICAgLy8gUHJldmVudCBkZWZhdWx0IGNsb3NpbmcgYmVoYXZpb3JcbiAgfVxufSBcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXG5cbi8qKlxuICogQWxsb3dzIHRoZSB1c2VyIHRvIGNob29zZSBvbmUgb2YgdGhlIG90aGVyIHBsYXllciBjaGFyYWN0ZXJzLlxuICogXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nXG4gKiBAZXh0ZW5kcyB7RGlhbG9nfVxuICovXG5leHBvcnQgY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICAvKiogQG92ZXJyaWRlICovXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XG4gICAgICB0ZW1wbGF0ZTogXCJ0ZW1wbGF0ZXMvaHVkL2RpYWxvZy5odG1sXCIsXG4gICAgICBjbGFzc2VzOiBbXCJjc3JcIiwgXCJkaWFsb2dcIiwgXCJwbGF5ZXItY2hvaWNlXCJdLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTc1XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhY3RvcnMsIG9uQWNjZXB0Rm4sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRpYWxvZ1NlbGVjdE9wdGlvbnMgPSBbXTtcbiAgICBhY3RvcnMuZm9yRWFjaChhY3RvciA9PiB7XG4gICAgICBkaWFsb2dTZWxlY3RPcHRpb25zLnB1c2goYDxvcHRpb24gdmFsdWU9XCIke2FjdG9yLl9pZH1cIj4ke2FjdG9yLm5hbWV9PC9vcHRpb24+YClcbiAgICB9KTtcblxuICAgIGNvbnN0IGRpYWxvZ1RleHQgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLmNvbnRlbnQnKTtcbiAgICBjb25zdCBkaWFsb2dDb250ZW50ID0gYFxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgPHA+JHtkaWFsb2dUZXh0fTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgPHNlbGVjdCBuYW1lPVwicGxheWVyXCI+XG4gICAgICAgICAgJHtkaWFsb2dTZWxlY3RPcHRpb25zLmpvaW4oJ1xcbicpfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPmA7XG5cbiAgICBjb25zdCBkaWFsb2dCdXR0b25zID0ge1xuICAgICAgb2s6IHtcbiAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLmFjY2VwdCcpLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdG9ySWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNob2ljZSBzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnZhbHVlO1xuXG4gICAgICAgICAgb25BY2NlcHRGbihhY3RvcklkKTtcblxuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZGlhbG9nRGF0YSA9IHtcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLnRpdGxlJyksXG4gICAgICBjb250ZW50OiBkaWFsb2dDb250ZW50LFxuICAgICAgYnV0dG9uczogZGlhbG9nQnV0dG9ucyxcbiAgICAgIGRlZmF1bHRZZXM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBzdXBlcihkaWFsb2dEYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYWN0b3JzID0gYWN0b3JzO1xuICB9XG5cbiAgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuXG4gICAgZGF0YS5hY3RvcnMgPSB0aGlzLmFjdG9ycztcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgLy8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIF9nZXRIZWFkZXJCdXR0b25zKCkge1xuICAgIC8vIERvbid0IGluY2x1ZGUgYW55IGhlYWRlciBidXR0b25zLCBmb3JjZSBhbiBvcHRpb24gdG8gYmUgY2hvc2VuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBjbG9zZSgpIHtcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgY2xvc2luZyBiZWhhdmlvclxuICB9XG59IFxuIiwiLyogZ2xvYmFscyBEaWFsb2cgKi9cblxuZXhwb3J0IGNsYXNzIFJvbGxEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuICBjb25zdHJ1Y3RvcihkaWFsb2dEYXRhLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwicm9sbE1vZGVcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzVweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IEVudW1Qb29sID0gW1xuICBcIk1pZ2h0XCIsXG4gIFwiU3BlZWRcIixcbiAgXCJJbnRlbGxlY3RcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVBvb2w7XG4iLCJjb25zdCBFbnVtUmFuZ2UgPSBbXG4gIFwiSW1tZWRpYXRlXCIsXG4gIFwiU2hvcnRcIixcbiAgXCJMb25nXCIsXG4gIFwiVmVyeSBMb25nXCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1SYW5nZTtcbiIsImNvbnN0IEVudW1UcmFpbmluZyA9IFtcbiAgXCJJbmFiaWxpdHlcIixcbiAgXCJVbnRyYWluZWRcIixcbiAgXCJUcmFpbmVkXCIsXG4gIFwiU3BlY2lhbGl6ZWRcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVRyYWluaW5nO1xuIiwiY29uc3QgRW51bVdlYXBvbkNhdGVnb3J5ID0gW1xuICBcIkJhc2hpbmdcIixcbiAgXCJCbGFkZWRcIixcbiAgXCJSYW5nZWRcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVdlYXBvbkNhdGVnb3J5O1xuIiwiY29uc3QgRW51bVdlaWdodCA9IFtcbiAgXCJMaWdodFwiLFxuICBcIk1lZGl1bVwiLFxuICBcIkhlYXZ5XCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1XZWlnaHQ7XG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzID0gKCkgPT4ge1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0b0xvd2VyQ2FzZScsIHN0ciA9PiBzdHIudG9Mb3dlckNhc2UoKSk7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvVXBwZXJDYXNlJywgdGV4dCA9PiB0ZXh0LnRvVXBwZXJDYXNlKCkpO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2VxJywgKHYxLCB2MikgPT4gdjEgPT09IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbmVxJywgKHYxLCB2MikgPT4gdjEgIT09IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignb3InLCAodjEsIHYyKSA9PiB2MSB8fCB2Mik7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Rlcm5hcnknLCAoY29uZCwgdjEsIHYyKSA9PiBjb25kID8gdjEgOiB2Mik7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2NvbmNhdCcsICh2MSwgdjIpID0+IGAke3YxfSR7djJ9YCk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc3RyT3JTcGFjZScsIHZhbCA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gKHZhbCAmJiAhIXZhbC5sZW5ndGgpID8gdmFsIDogJyZuYnNwOyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndHJhaW5pbmdJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5pbmFiaWxpdHknKX1cIj5bSV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudW50cmFpbmVkJyl9XCI+W1VdPC9zcGFuPmA7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLnRyYWluZWQnKX1cIj5bVF08L3NwYW4+YDtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcuc3BlY2lhbGl6ZWQnKX1cIj5bU108L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Bvb2xJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLm1pZ2h0Jyl9XCI+W01dPC9zcGFuPmA7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wuc3BlZWQnKX1cIj5bU108L3NwYW4+YDtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5pbnRlbGxlY3QnKX1cIj5bSV08L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3R5cGVJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgLy8gVE9ETzogQWRkIHNraWxsIGFuZCBhYmlsaXR5P1xuICAgICAgXG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPlthXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LndlYXBvbicpfVwiPlt3XTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnZ2Vhcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5nZWFyJyl9XCI+W2ddPC9zcGFuPmA7XG4gICAgICBcbiAgICAgIGNhc2UgJ2N5cGhlcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5jeXBoZXInKX1cIj5bQ108L3NwYW4+YDtcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W0FdPC9zcGFuPmA7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bT108L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xufTtcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgKi9cblxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW1TaGVldCB3aXRoIHNvbWUgdmVyeSBzaW1wbGUgbW9kaWZpY2F0aW9uc1xuICogQGV4dGVuZHMge0l0ZW1TaGVldH1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW1TaGVldCBleHRlbmRzIEl0ZW1TaGVldCB7XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xuICAgICAgY2xhc3NlczogW1wiY3lwaGVyc3lzdGVtXCIsIFwic2hlZXRcIiwgXCJpdGVtXCJdLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMjAwXG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCBwYXRoID0gXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbVwiO1xuICAgIHJldHVybiBgJHtwYXRofS8ke3RoaXMuaXRlbS5kYXRhLnR5cGV9LXNoZWV0Lmh0bWxgO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfc2tpbGxEYXRhKGRhdGEpIHtcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEudHJhaW5pbmdMZXZlbHMgPSBDU1IudHJhaW5pbmdMZXZlbHM7XG4gIH1cblxuICBfYWJpbGl0eURhdGEoZGF0YSkge1xuICAgIGRhdGEucmFuZ2VzID0gQ1NSLm9wdGlvbmFsUmFuZ2VzO1xuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XG4gIH1cblxuICBfYXJtb3JEYXRhKGRhdGEpIHtcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcbiAgfVxuXG4gIF93ZWFwb25EYXRhKGRhdGEpIHtcbiAgICBkYXRhLnJhbmdlcyA9IENTUi5yYW5nZXM7XG4gICAgZGF0YS53ZWFwb25UeXBlcyA9IENTUi53ZWFwb25UeXBlcztcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcbiAgfVxuXG4gIF9nZWFyRGF0YShkYXRhKSB7XG4gIH1cblxuICBfY3lwaGVyRGF0YShkYXRhKSB7XG4gICAgZGF0YS5pc0dNID0gZ2FtZS51c2VyLmlzR007XG4gIH1cblxuICBfYXJ0aWZhY3REYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIF9vZGRpdHlEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuXG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLml0ZW0uZGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9hYmlsaXR5RGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX2FybW9yRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICB0aGlzLl93ZWFwb25EYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9nZWFyRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9jeXBoZXJEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgdGhpcy5fYXJ0aWZhY3REYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX29kZGl0eURhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAvKiogQG92ZXJyaWRlICovXG4gIHNldFBvc2l0aW9uKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gc3VwZXIuc2V0UG9zaXRpb24ob3B0aW9ucyk7XG4gICAgY29uc3Qgc2hlZXRCb2R5ID0gdGhpcy5lbGVtZW50LmZpbmQoXCIuc2hlZXQtYm9keVwiKTtcbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gcG9zaXRpb24uaGVpZ2h0IC0gMTkyO1xuICAgIHNoZWV0Qm9keS5jc3MoXCJoZWlnaHRcIiwgYm9keUhlaWdodCk7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfc2tpbGxMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdza2lsbC13aW5kb3cnKTtcbiAgICBcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnBvb2xcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnRyYWluaW5nXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICBfYWJpbGl0eUxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FiaWxpdHktd2luZG93Jyk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmlzRW5hYmxlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzIyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuY29zdC5wb29sXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnODVweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnJhbmdlXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBjb25zdCBjYklkZW50aWZpZWQgPSBodG1sLmZpbmQoJyNjYi1pZGVudGlmaWVkJyk7XG4gICAgY2JJZGVudGlmaWVkLm9uKCdjaGFuZ2UnLCAoZXYpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgdGhpcy5pdGVtLnVwZGF0ZSh7XG4gICAgICAgICdkYXRhLmlkZW50aWZpZWQnOiBldi50YXJnZXQuY2hlY2tlZFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfYXJtb3JMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdhcm1vci13aW5kb3cnKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmVkaXRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEud2VpZ2h0XCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICBfd2VhcG9uTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnd2VhcG9uLXdpbmRvdycpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZWRpdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEud2VpZ2h0XCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5jYXRlZ29yeVwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzExMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEucmFuZ2VcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMjBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxuXG4gIF9nZWFyTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnZ2Vhci13aW5kb3cnKTtcbiAgfVxuXG4gIF9jeXBoZXJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdjeXBoZXItd2luZG93Jyk7XG4gIH1cblxuICBfYXJ0aWZhY3RMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdhcnRpZmFjdC13aW5kb3cnKTtcbiAgfVxuXG4gIF9vZGRpdHlMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdvZGRpdHktd2luZG93Jyk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBzdXBlci5hY3RpdmF0ZUxpc3RlbmVycyhodG1sKTtcblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5pdGVtLmRhdGE7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdza2lsbCc6XG4gICAgICAgIHRoaXMuX3NraWxsTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9hYmlsaXR5TGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FybW9yJzpcbiAgICAgICAgdGhpcy5fYXJtb3JMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgdGhpcy5fd2VhcG9uTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9nZWFyTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2N5cGhlcic6XG4gICAgICAgIHRoaXMuX2N5cGhlckxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnRpZmFjdCc6XG4gICAgICAgIHRoaXMuX2FydGlmYWN0TGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX29kZGl0eUxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG4iLCIvKiBnbG9iYWxzIEl0ZW0gcmVuZGVyVGVtcGxhdGUgKi9cblxuaW1wb3J0IHsgY3lwaGVyUm9sbCB9IGZyb20gJy4uL3JvbGxzLmpzJztcbmltcG9ydCB7IHZhbE9yRGVmYXVsdCB9IGZyb20gJy4uL3V0aWxzLmpzJztcblxuaW1wb3J0IEVudW1Qb29scyBmcm9tICcuLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuaW1wb3J0IEVudW1UcmFpbmluZyBmcm9tICcuLi9lbnVtcy9lbnVtLXRyYWluaW5nLmpzJztcbmltcG9ydCBFbnVtV2VpZ2h0IGZyb20gJy4uL2VudW1zL2VudW0td2VpZ2h0LmpzJztcbmltcG9ydCBFbnVtUmFuZ2UgZnJvbSAnLi4vZW51bXMvZW51bS1yYW5nZS5qcyc7XG5pbXBvcnQgRW51bVdlYXBvbkNhdGVnb3J5IGZyb20gJy4uL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW0gd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnMuXG4gKiBAZXh0ZW5kcyB7SXRlbX1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW0gZXh0ZW5kcyBJdGVtIHtcbiAgX3ByZXBhcmVTa2lsbERhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuc2tpbGwnKSk7XG4gICAgZGF0YS5wb29sID0gdmFsT3JEZWZhdWx0KGRhdGEucG9vbCwgMCk7XG4gICAgZGF0YS50cmFpbmluZyA9IHZhbE9yRGVmYXVsdChkYXRhLnRyYWluaW5nLCAxKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcblxuICAgIGRhdGEuZmxhZ3MgPSB2YWxPckRlZmF1bHQoZGF0YS5mbGFncywge30pO1xuICB9XG5cbiAgX3ByZXBhcmVBYmlsaXR5RGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hYmlsaXR5JykpO1xuICAgIGRhdGEuc291cmNlVHlwZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNvdXJjZVR5cGUsICcnKTtcbiAgICBkYXRhLnNvdXJjZVZhbHVlID0gdmFsT3JEZWZhdWx0KGRhdGEuc291cmNlVmFsdWUsICcnKTtcbiAgICBkYXRhLmlzRW5hYmxlciA9IHZhbE9yRGVmYXVsdChkYXRhLmlzRW5hYmxlciwgdHJ1ZSk7XG4gICAgZGF0YS5jb3N0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY29zdCwge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICBwb29sOiAwXG4gICAgfSk7XG4gICAgZGF0YS5yYW5nZSA9IHZhbE9yRGVmYXVsdChkYXRhLnJhbmdlLCAwKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlQXJtb3JEYXRhKCkge1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XG5cbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LmFybW9yJykpO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMSk7XG4gICAgZGF0YS5hZGRpdGlvbmFsU3BlZWRFZmZvcnRDb3N0ID0gdmFsT3JEZWZhdWx0KGRhdGEuYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdCwgMSk7XG4gICAgZGF0YS5wcmljZSA9IHZhbE9yRGVmYXVsdChkYXRhLnByaWNlLCAwKTtcbiAgICBkYXRhLndlaWdodCA9IHZhbE9yRGVmYXVsdChkYXRhLndlaWdodCwgMCk7XG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcbiAgICBkYXRhLmVxdWlwcGVkID0gdmFsT3JEZWZhdWx0KGRhdGEuZXF1aXBwZWQsIGZhbHNlKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlV2VhcG9uRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy53ZWFwb24nKSk7XG4gICAgZGF0YS5kYW1hZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5kYW1hZ2UsIDEpO1xuICAgIGRhdGEuY2F0ZWdvcnkgPSB2YWxPckRlZmF1bHQoZGF0YS5jYXRlZ29yeSwgMCk7XG4gICAgZGF0YS5yYW5nZSA9IHZhbE9yRGVmYXVsdChkYXRhLnJhbmdlLCAwKTtcbiAgICBkYXRhLnByaWNlID0gdmFsT3JEZWZhdWx0KGRhdGEucHJpY2UsIDApO1xuICAgIGRhdGEud2VpZ2h0ID0gdmFsT3JEZWZhdWx0KGRhdGEud2VpZ2h0LCAwKTtcbiAgICBkYXRhLnF1YW50aXR5ID0gdmFsT3JEZWZhdWx0KGRhdGEucXVhbnRpdHksIDEpO1xuICAgIGRhdGEuZXF1aXBwZWQgPSB2YWxPckRlZmF1bHQoZGF0YS5lcXVpcHBlZCwgZmFsc2UpO1xuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xuICB9XG5cbiAgX3ByZXBhcmVHZWFyRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5nZWFyJykpO1xuICAgIGRhdGEucHJpY2UgPSB2YWxPckRlZmF1bHQoZGF0YS5wcmljZSwgMCk7XG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlQ3lwaGVyRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5jeXBoZXInKSk7XG4gICAgZGF0YS5pZGVudGlmaWVkID0gdmFsT3JEZWZhdWx0KGRhdGEuaWRlbnRpZmllZCwgZmFsc2UpO1xuICAgIGRhdGEubGV2ZWwgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbCwgbnVsbCk7XG4gICAgZGF0YS5sZXZlbERpZSA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsRGllLCAnJyk7XG4gICAgZGF0YS5mb3JtID0gdmFsT3JEZWZhdWx0KGRhdGEuZm9ybSwgJycpO1xuICAgIGRhdGEuZWZmZWN0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmZWN0LCAnJyk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZUFydGlmYWN0RGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hcnRpZmFjdCcpKTtcbiAgICBkYXRhLmlkZW50aWZpZWQgPSB2YWxPckRlZmF1bHQoZGF0YS5pZGVudGlmaWVkLCBmYWxzZSk7XG4gICAgZGF0YS5sZXZlbCA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsLCBudWxsKTtcbiAgICBkYXRhLmxldmVsRGllID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWxEaWUsICcnKTtcbiAgICBkYXRhLmZvcm0gPSB2YWxPckRlZmF1bHQoZGF0YS5mb3JtLCAnJyk7XG4gICAgZGF0YS5lZmZlY3QgPSB2YWxPckRlZmF1bHQoZGF0YS5lZmZlY3QsICcnKTtcbiAgICBkYXRhLmRlcGxldGlvbiA9IHZhbE9yRGVmYXVsdChkYXRhLmRlcGxldGlvbiwge1xuICAgICAgaXNEZXBsZXRpbmc6IHRydWUsXG4gICAgICBkaWU6ICdkNicsXG4gICAgICB0aHJlc2hvbGQ6IDFcbiAgICB9KTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlT2RkaXR5RGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5vZGRpdHknKSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICAvKipcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgSXRlbSBkYXRhIG1vZGVsIHdpdGggYWRkaXRpb25hbCBkeW5hbWljIGRhdGEuXG4gICAqL1xuICBwcmVwYXJlRGF0YSgpIHtcbiAgICBzdXBlci5wcmVwYXJlRGF0YSgpO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZVNraWxsRGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9wcmVwYXJlQWJpbGl0eURhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVBcm1vckRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICB0aGlzLl9wcmVwYXJlV2VhcG9uRGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9wcmVwYXJlR2VhckRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9wcmVwYXJlQ3lwaGVyRGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUFydGlmYWN0RGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVPZGRpdHlEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSb2xsXG4gICAqL1xuXG4gIF9za2lsbFJvbGwoKSB7XG4gICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcblxuICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcztcbiAgICBjb25zdCBpdGVtID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgcG9vbCB9ID0gaXRlbS5kYXRhO1xuICAgIGNvbnN0IGFzc2V0cyA9IGFjdG9yLmdldFNraWxsTGV2ZWwodGhpcyk7XG4gICAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICAgIGNvbnN0IHBhcnRzID0gWycxZDIwJ107XG4gICAgaWYgKGFzc2V0cyAhPT0gMCkge1xuICAgICAgY29uc3Qgc2lnbiA9IGFzc2V0cyA8IDAgPyAnLScgOiAnKyc7XG4gICAgICBwYXJ0cy5wdXNoKGAke3NpZ259ICR7TWF0aC5hYnMoYXNzZXRzKSAqIDN9YCk7XG4gICAgfVxuXG4gICAgY3lwaGVyUm9sbCh7XG4gICAgICBwYXJ0cyxcblxuICAgICAgZGF0YToge1xuICAgICAgICBwb29sLFxuICAgICAgICBwb29sQ29zdDogMCxcbiAgICAgICAgZWZmb3J0OiBmcmVlRWZmb3J0LFxuICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnQsXG4gICAgICAgIGFzc2V0c1xuICAgICAgfSxcbiAgICAgIGV2ZW50LFxuXG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5za2lsbC50aXRsZScpLFxuICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnNraWxsLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLnJlcGxhY2UoJyMjU0tJTEwjIycsIG5hbWUpLFxuXG4gICAgICBhY3RvcixcbiAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIF9hYmlsaXR5Um9sbCgpIHtcbiAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xuXG4gICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzO1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBpc0VuYWJsZXIsIGNvc3QgfSA9IGl0ZW0uZGF0YTtcblxuICAgIGlmICghaXNFbmFibGVyKSB7XG4gICAgICBjb25zdCB7IHBvb2wsIHZhbHVlOiBhbW91bnQgfSA9IGNvc3Q7XG4gICAgICBjb25zdCBlZGdlID0gYWN0b3IuZ2V0RWRnZUZyb21TdGF0KHBvb2wpO1xuICAgICAgY29uc3QgYWRqdXN0ZWRBbW91bnRlZCA9IE1hdGgubWF4KGFtb3VudCAtIGVkZ2UsIDApO1xuICAgICAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICAgICAgLy8gRWRnZSBoYXMgbWFkZSB0aGlzIGFiaWxpdHkgZnJlZSwgc28ganVzdCB1c2UgaXRcbiAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHBhcnNlSW50KGFtb3VudCwgMTApKSkge1xuICAgICAgICBjeXBoZXJSb2xsKHtcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgICBwYXJ0czogWycxZDIwJ10sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcG9vbCxcbiAgICAgICAgICAgIHBvb2xDb3N0OiBhZGp1c3RlZEFtb3VudGVkLFxuICAgICAgICAgICAgZWZmb3J0OiBmcmVlRWZmb3J0LFxuICAgICAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICAgICAgZmxhdm9yOiBgJHthY3Rvci5uYW1lfSB1c2VkICR7bmFtZX1gLFxuICAgICAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkudGl0bGUnKSxcbiAgICAgICAgICBhY3RvclxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xuICAgICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcbiAgICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkuZmFpbGVkLmZsYXZvcicpLFxuICAgICAgICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS5mYWlsZWQuY29udGVudCcpLnJlcGxhY2UoJyMjUE9PTCMjJywgcG9vbE5hbWUpXG4gICAgICAgIH1dKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XG4gICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkuaW52YWxpZC5mbGF2b3InKSxcbiAgICAgICAgY29udGVudDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5hYmlsaXR5LmludmFsaWQuY29udGVudCcpXG4gICAgICB9XSk7XG4gICAgfVxuICB9XG5cbiAgcm9sbCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAnc2tpbGwnOlxuICAgICAgICB0aGlzLl9za2lsbFJvbGwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhYmlsaXR5JzpcbiAgICAgICAgdGhpcy5fYWJpbGl0eVJvbGwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluZm9cbiAgICovXG5cbiAgYXN5bmMgX3NraWxsSW5mbygpIHtcbiAgICBjb25zdCBza2lsbERhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBza2lsbERhdGE7XG5cbiAgICBjb25zdCB0cmFpbmluZyA9IEVudW1UcmFpbmluZ1tza2lsbERhdGEuZGF0YS50cmFpbmluZ107XG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1tza2lsbERhdGEuZGF0YS5wb29sXTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IHNraWxsRGF0YS5uYW1lLFxuICAgICAgdHJhaW5pbmc6IHRyYWluaW5nLnRvTG93ZXJDYXNlKCksXG4gICAgICBwb29sOiBwb29sLnRvTG93ZXJDYXNlKCksXG4gICAgICBub3RlczogZGF0YS5ub3RlcyxcblxuICAgICAgaW5pdGlhdGl2ZTogISFkYXRhLmZsYWdzLmluaXRpYXRpdmVcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vc2tpbGwtaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX2FiaWxpdHlJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcbiAgICBjb25zdCBhYmlsaXR5ID0gZGF0YS5kYXRhO1xuXG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1thYmlsaXR5LmNvc3QucG9vbF07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICBwb29sOiBwb29sLnRvTG93ZXJDYXNlKCksXG4gICAgICBpc0VuYWJsZXI6IGFiaWxpdHkuaXNFbmFibGVyLFxuICAgICAgY29zdDogYWJpbGl0eS5jb3N0LnZhbHVlLFxuICAgICAgbm90ZXM6IGFiaWxpdHkubm90ZXMsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FiaWxpdHktaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX2FybW9ySW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB3ZWlnaHQgPSBFbnVtV2VpZ2h0W2RhdGEuZGF0YS53ZWlnaHRdO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgZXF1aXBwZWQ6IGRhdGEuZGF0YS5lcXVpcHBlZCxcbiAgICAgIHF1YW50aXR5OiBkYXRhLmRhdGEucXVhbnRpdHksXG4gICAgICB3ZWlnaHQ6IHdlaWdodC50b0xvd2VyQ2FzZSgpLFxuICAgICAgYXJtb3I6IGRhdGEuZGF0YS5hcm1vcixcbiAgICAgIGFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3Q6IGRhdGEuZGF0YS5hZGRpdGlvbmFsU3BlZWRFZmZvcnRDb3N0LFxuICAgICAgcHJpY2U6IGRhdGEuZGF0YS5wcmljZSxcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FybW9yLWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIF93ZWFwb25JbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHdlaWdodCA9IEVudW1XZWlnaHRbZGF0YS5kYXRhLndlaWdodF07XG4gICAgY29uc3QgcmFuZ2UgPSBFbnVtUmFuZ2VbZGF0YS5kYXRhLnJhbmdlXTtcbiAgICBjb25zdCBjYXRlZ29yeSA9IEVudW1XZWFwb25DYXRlZ29yeVtkYXRhLmRhdGEuY2F0ZWdvcnldO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgZXF1aXBwZWQ6IGRhdGEuZGF0YS5lcXVpcHBlZCxcbiAgICAgIHF1YW50aXR5OiBkYXRhLmRhdGEucXVhbnRpdHksXG4gICAgICB3ZWlnaHQ6IHdlaWdodC50b0xvd2VyQ2FzZSgpLFxuICAgICAgcmFuZ2U6IHJhbmdlLnRvTG93ZXJDYXNlKCksXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkudG9Mb3dlckNhc2UoKSxcbiAgICAgIGRhbWFnZTogZGF0YS5kYXRhLmRhbWFnZSxcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby93ZWFwb24taW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX2dlYXJJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHF1YW50aXR5OiBkYXRhLmRhdGEucXVhbnRpdHksXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vZ2Vhci1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfY3lwaGVySW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBpc0dNOiBnYW1lLnVzZXIuaXNHTSxcbiAgICAgIGlkZW50aWZpZWQ6IGRhdGEuZGF0YS5pZGVudGlmaWVkLFxuICAgICAgbGV2ZWw6IGRhdGEuZGF0YS5sZXZlbCxcbiAgICAgIGZvcm06IGRhdGEuZGF0YS5mb3JtLFxuICAgICAgZWZmZWN0OiBkYXRhLmRhdGEuZWZmZWN0LFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9jeXBoZXItaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX2FydGlmYWN0SW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBpc0dNOiBnYW1lLnVzZXIuaXNHTSxcbiAgICAgIGlkZW50aWZpZWQ6IGRhdGEuZGF0YS5pZGVudGlmaWVkLFxuICAgICAgbGV2ZWw6IGRhdGEuZGF0YS5sZXZlbCxcbiAgICAgIGZvcm06IGRhdGEuZGF0YS5mb3JtLFxuICAgICAgaXNEZXBsZXRpbmc6IGRhdGEuZGF0YS5kZXBsZXRpb24uaXNEZXBsZXRpbmcsXG4gICAgICBkZXBsZXRpb25UaHJlc2hvbGQ6IGRhdGEuZGF0YS5kZXBsZXRpb24udGhyZXNob2xkLFxuICAgICAgZGVwbGV0aW9uRGllOiBkYXRhLmRhdGEuZGVwbGV0aW9uLmRpZSxcbiAgICAgIGVmZmVjdDogZGF0YS5kYXRhLmVmZmVjdCxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJ0aWZhY3QtaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX29kZGl0eUluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vb2RkaXR5LWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIGdldEluZm8oKSB7XG4gICAgbGV0IGh0bWwgPSAnJztcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdza2lsbCc6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9za2lsbEluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhYmlsaXR5JzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FiaWxpdHlJbmZvKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJtb3InOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYXJtb3JJbmZvKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX3dlYXBvbkluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnZWFyJzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2dlYXJJbmZvKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3lwaGVyJzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2N5cGhlckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnRpZmFjdCc6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hcnRpZmFjdEluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fb2RkaXR5SW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgY3lwaGVyUm9sbCB9IGZyb20gJy4vcm9sbHMuanMnO1xuXG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuXG4vKipcbiAqIFJvbGxzIGZyb20gdGhlIGdpdmVuIHNraWxsLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0b3JJZFxuICogQHBhcmFtIHtzdHJpbmd9IHBvb2xcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VQb29sTWFjcm8oYWN0b3JJZCwgcG9vbCkge1xuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLl9pZCA9PT0gYWN0b3JJZCk7XG4gIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcbiAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gIGNvbnN0IGZyZWVFZmZvcnQgPSBhY3Rvci5nZXRGcmVlRWZmb3J0RnJvbVN0YXQocG9vbCk7XG5cbiAgY3lwaGVyUm9sbCh7XG4gICAgcGFydHM6IFsnMWQyMCddLFxuXG4gICAgZGF0YToge1xuICAgICAgcG9vbCxcbiAgICAgIGVmZm9ydDogZnJlZUVmZm9ydCxcbiAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydCxcbiAgICB9LFxuICAgIGV2ZW50LFxuXG4gICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucG9vbC50aXRsZScpLnJlcGxhY2UoJyMjUE9PTCMjJywgcG9vbE5hbWUpLFxuICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5wb29sLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLnJlcGxhY2UoJyMjUE9PTCMjJywgcG9vbE5hbWUpLFxuXG4gICAgYWN0b3IsXG4gICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICB9KTtcbn1cblxuLyoqXG4gKiBBY3RpdmF0ZXMgdGhlIGdpdmVuIHNraWxsLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0b3JJZFxuICogQHBhcmFtIHtzdHJpbmd9IGl0ZW1JZFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVNraWxsTWFjcm8oYWN0b3JJZCwgaXRlbUlkKSB7XG4gIGNvbnN0IGFjdG9yID0gZ2FtZS5hY3RvcnMuZW50aXRpZXMuZmluZChhID0+IGEuX2lkID09PSBhY3RvcklkKTtcbiAgY29uc3Qgc2tpbGwgPSBhY3Rvci5nZXRPd25lZEl0ZW0oaXRlbUlkKTtcblxuICBza2lsbC5yb2xsKCk7XG59XG5cbi8qKlxuICogQWN0aXZhdGVzIHRoZSBnaXZlbiBhYmlsaXR5LlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0b3JJZFxuICogQHBhcmFtIHtzdHJpbmd9IGl0ZW1JZFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFiaWxpdHlNYWNybyhhY3RvcklkLCBpdGVtSWQpIHtcbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5lbnRpdGllcy5maW5kKGEgPT4gYS5faWQgPT09IGFjdG9ySWQpO1xuICBjb25zdCBhYmlsaXR5ID0gYWN0b3IuZ2V0T3duZWRJdGVtKGl0ZW1JZCk7XG5cbiAgYWJpbGl0eS5yb2xsKCk7XG59XG5cbi8qKlxuICogVXNlcyB0aGUgZ2l2ZW4gY3lwaGVyLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gYWN0b3JJZFxuICogQHBhcmFtIHtzdHJpbmd9IGl0ZW1JZFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUN5cGhlck1hY3JvKGFjdG9ySWQsIGl0ZW1JZCkge1xuICBjb25zb2xlLndhcm4oJ0N5cGhlciBtYWNyb3Mgbm90IGltcGxlbWVudGVkJyk7XG59XG5cbmNvbnN0IFNVUFBPUlRFRF9UWVBFUyA9IFtcbiAgJ3Bvb2wnLFxuXG4gICdza2lsbCcsXG4gICdhYmlsaXR5JyxcbiAgLy8gJ2N5cGhlcidcbl07XG5cbmZ1bmN0aW9uIGl0ZW1TdXBwb3J0c01hY3JvcyhpdGVtKSB7XG4gIGlmICghU1VQUE9SVEVEX1RZUEVTLmluY2x1ZGVzKGl0ZW0udHlwZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXRlbS50eXBlID09PSAnYWJpbGl0eScgJiYgaXRlbS5kYXRhLmlzRW5hYmxlcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB1bnN1cHBvcnRlZEl0ZW1NZXNzYWdlKGl0ZW0pIHtcbiAgaWYgKGl0ZW0udHlwZSA9PT0gJ2FiaWxpdHknICYmIGl0ZW0uZGF0YS5pc0VuYWJsZXIpIHtcbiAgICByZXR1cm4gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubWFjcm8uY3JlYXRlLmFiaWxpdHlFbmFibGVyJyk7XG4gIH1cblxuICByZXR1cm4gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubWFjcm8uY3JlYXRlLnVuc3VwcG9ydGVkVHlwZScpO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZU1hY3JvQ29tbWFuZChkYXRhKSB7XG4gIGNvbnN0IGl0ZW0gPSBkYXRhLmRhdGE7XG5cbiAgLy8gU3BlY2lhbCBjYXNlLCBtdXN0IGhhbmRsZSB0aGlzIHNlcGFyYXRlbHlcbiAgaWYgKGl0ZW0udHlwZSA9PT0gJ3Bvb2wnKSB7XG4gICAgcmV0dXJuIGBnYW1lLmN5cGhlcnN5c3RlbS5tYWNyby51c2VQb29sKCcke2RhdGEuYWN0b3JJZH0nLCAke2l0ZW0ucG9vbH0pO2A7XG4gIH1cblxuICAvLyBHZW5lcmFsIGNhc2VzLCB3b3JrcyBtb3N0IG9mIHRoZSB0aW1lXG4gIGNvbnN0IHR5cGVUaXRsZUNhc2UgPSBpdGVtLnR5cGUuc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnR5cGUuc3Vic3RyKDEpO1xuICBjb25zdCBjb21tYW5kID0gYGdhbWUuY3lwaGVyc3lzdGVtLm1hY3JvLnVzZSR7dHlwZVRpdGxlQ2FzZX0oJyR7ZGF0YS5hY3RvcklkfScsICcke2l0ZW0uX2lkfScpO2A7XG5cbiAgcmV0dXJuIGNvbW1hbmQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZU1hY3JvKGl0ZW0sIGNvbW1hbmQpIHtcbiAgaWYgKGl0ZW0udHlwZSA9PT0gJ3Bvb2wnKSB7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbaXRlbS5wb29sXTtcbiAgICBpdGVtLm5hbWUgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5tYWNyby5wb29sLm5hbWUnKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKTtcbiAgICBpdGVtLmltZyA9ICdpY29ucy9zdmcvZDIwLnN2Zyc7XG4gIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSAnc2tpbGwnKSB7XG4gICAgLy8gSWYgdGhlIGltYWdlIHdvdWxkIGJlIHRoZSBkZWZhdWx0LCBjaGFuZ2UgdG8gc29tZXRoaW5nIG1vcmUgYXBwcm9wcmlhdGVcbiAgICBpdGVtLmltZyA9IGl0ZW0uaW1nID09PSAnaWNvbnMvc3ZnL215c3RlcnktbWFuLnN2ZycgPyAnaWNvbnMvc3ZnL2F1cmEuc3ZnJyA6IGl0ZW0uaW1nO1xuICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gJ2FiaWxpdHknKSB7XG4gICAgLy8gSWYgdGhlIGltYWdlIHdvdWxkIGJlIHRoZSBkZWZhdWx0LCBjaGFuZ2UgdG8gc29tZXRoaW5nIG1vcmUgYXBwcm9wcmlhdGVcbiAgICBpdGVtLmltZyA9IGl0ZW0uaW1nID09PSAnaWNvbnMvc3ZnL215c3RlcnktbWFuLnN2ZycgPyAnaWNvbnMvc3ZnL2Jvb2suc3ZnJyA6IGl0ZW0uaW1nO1xuICB9XG5cbiAgcmV0dXJuIGF3YWl0IE1hY3JvLmNyZWF0ZSh7XG4gICAgbmFtZTogaXRlbS5uYW1lLFxuICAgIHR5cGU6ICdzY3JpcHQnLFxuICAgIGltZzogaXRlbS5pbWcsXG4gICAgY29tbWFuZDogY29tbWFuZCxcbiAgICBmbGFnczoge1xuICAgICAgJ2N5cGhlcnN5c3RlbS5pdGVtTWFjcm8nOiB0cnVlXG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBNYWNybyBmcm9tIGFuIEl0ZW0gZHJvcC5cbiAqIEdldCBhbiBleGlzdGluZyBpdGVtIG1hY3JvIGlmIG9uZSBleGlzdHMsIG90aGVyd2lzZSBjcmVhdGUgYSBuZXcgb25lLlxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgICAgIFRoZSBkcm9wcGVkIGRhdGFcbiAqIEBwYXJhbSB7bnVtYmVyfSBzbG90ICAgICBUaGUgaG90YmFyIHNsb3QgdG8gdXNlXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUN5cGhlck1hY3JvKGRhdGEsIHNsb3QpIHtcbiAgY29uc3QgaXNPd25lZCA9ICdkYXRhJyBpbiBkYXRhO1xuICBpZiAoIWlzT3duZWQpIHtcbiAgICByZXR1cm4gdWkubm90aWZpY2F0aW9ucy53YXJuKGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm1hY3JvLmNyZWF0ZS5ub3RPd25lZCcpKTtcbiAgfVxuXG4gIGNvbnN0IGl0ZW0gPSBkYXRhLmRhdGE7XG4gIGlmICghaXRlbVN1cHBvcnRzTWFjcm9zKGl0ZW0pKSB7XG4gICAgcmV0dXJuIHVpLm5vdGlmaWNhdGlvbnMud2Fybih1bnN1cHBvcnRlZEl0ZW1NZXNzYWdlKGl0ZW0pKTtcbiAgfVxuXG4gIGNvbnN0IGNvbW1hbmQgPSBnZW5lcmF0ZU1hY3JvQ29tbWFuZChkYXRhKTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIG1hY3JvIGFscmVhZHkgZXhpc3RzLCBpZiBub3QsIGNyZWF0ZSBhIG5ldyBvbmVcbiAgbGV0IG1hY3JvID0gZ2FtZS5tYWNyb3MuZW50aXRpZXMuZmluZChtID0+IChtLm5hbWUgPT09IGl0ZW0ubmFtZSkgJiYgKG0uY29tbWFuZCA9PT0gY29tbWFuZCkpO1xuICBpZiAoIW1hY3JvKSB7XG4gICAgbWFjcm8gPSBhd2FpdCBjcmVhdGVNYWNybyhpdGVtLCBjb21tYW5kKTtcbiAgfVxuXG4gIGdhbWUudXNlci5hc3NpZ25Ib3RiYXJNYWNybyhtYWNybywgc2xvdCk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgTlBDTWlncmF0b3IgfSBmcm9tICcuL25wYy1taWdyYXRpb25zJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGUoKSB7XG4gIGlmICghZ2FtZS51c2VyLmlzR00pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zb2xlLmluZm8oJy0tLSBTdGFydGluZyBNaWdyYXRpb24gUHJvY2VzcyAtLS0nKTtcblxuICBjb25zdCBucGNBY3RvcnMgPSBnYW1lLmFjdG9ycy5lbnRpdGllcy5maWx0ZXIoYWN0b3IgPT4gYWN0b3IuZGF0YS50eXBlID09PSAnbnBjJyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBucGNBY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBucGMgPSBucGNBY3RvcnNbaV07XG4gICAgY29uc3QgbmV3RGF0YSA9IGF3YWl0IE5QQ01pZ3JhdG9yKG5wYyk7XG4gICAgYXdhaXQgbnBjLnVwZGF0ZShuZXdEYXRhKTtcbiAgfVxuXG4gIGNvbnNvbGUuaW5mbygnLS0tIE1pZ3JhdGlvbiBQcm9jZXNzIEZpbmlzaGVkIC0tLScpO1xufVxuIiwiY29uc3QgbWlncmF0aW9ucyA9IFtcbiAge1xuICAgIHZlcnNpb246IDIsXG4gICAgYWN0aW9uOiAobnBjLCBkYXRhKSA9PiB7XG4gICAgICBkYXRhWydkYXRhLmhlYWx0aCddID0gbnBjLmRhdGEuZGF0YS5oZWFsdGgubWF4O1xuICBcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxuXTtcblxuYXN5bmMgZnVuY3Rpb24gbWlncmF0b3IobnBjLCBvYmogPSB7fSkge1xuICBsZXQgbmV3RGF0YSA9IE9iamVjdC5hc3NpZ24oeyBfaWQ6IG5wYy5faWQsIGRhdGE6IHsgdmVyc2lvbjogbnBjLmRhdGEuZGF0YS52ZXJzaW9uIH0gfSwgb2JqKTtcblxuICBtaWdyYXRpb25zLmZvckVhY2goaGFuZGxlciA9PiB7XG4gICAgY29uc3QgeyB2ZXJzaW9uIH0gPSBuZXdEYXRhLmRhdGE7XG4gICAgaWYgKHZlcnNpb24gPCBoYW5kbGVyLnZlcnNpb24pIHtcbiAgICAgIG5ld0RhdGEgPSBoYW5kbGVyLmFjdGlvbihucGMsIG5ld0RhdGEpO1xuICAgICAgbmV3RGF0YS52ZXJzaW9uID0gaGFuZGxlci52ZXJzaW9uO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5ld0RhdGE7XG59XG5cbmV4cG9ydCBjb25zdCBOUENNaWdyYXRvciA9IG1pZ3JhdG9yO1xuIiwiLyogZ2xvYmFscyByZW5kZXJUZW1wbGF0ZSAqL1xuXG5pbXBvcnQgeyBSb2xsRGlhbG9nIH0gZnJvbSAnLi9kaWFsb2cvcm9sbC1kaWFsb2cuanMnO1xuXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4vZW51bXMvZW51bS1wb29sLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxUZXh0KGRpZVJvbGwsIHJvbGxUb3RhbCkge1xuICBsZXQgcGFydHMgPSBbXTtcblxuICBjb25zdCB0YXNrTGV2ZWwgPSBNYXRoLmZsb29yKHJvbGxUb3RhbCAvIDMpO1xuICBjb25zdCBza2lsbExldmVsID0gTWF0aC5mbG9vcigocm9sbFRvdGFsIC0gZGllUm9sbCkgLyAzICsgMC41KTtcbiAgY29uc3QgdG90YWxBY2hpZXZlZCA9IHRhc2tMZXZlbCArIHNraWxsTGV2ZWw7XG5cbiAgbGV0IHRuQ29sb3IgPSAnIzAwMDAwMCc7XG4gIGlmICh0b3RhbEFjaGlldmVkIDwgMykge1xuICAgIHRuQ29sb3IgPSAnIzBhODYwYSc7XG4gIH0gZWxzZSBpZiAodG90YWxBY2hpZXZlZCA8IDcpIHtcbiAgICB0bkNvbG9yID0gJyM4NDg0MDknO1xuICB9IGVsc2Uge1xuICAgIHRuQ29sb3IgPSAnIzBhODYwYSc7XG4gIH1cblxuICBsZXQgc3VjY2Vzc1RleHQgPSBgPCR7dG90YWxBY2hpZXZlZH0+YDtcbiAgaWYgKHNraWxsTGV2ZWwgIT09IDApIHtcbiAgICBjb25zdCBzaWduID0gc2tpbGxMZXZlbCA+IDAgPyBcIitcIiA6IFwiXCI7XG4gICAgc3VjY2Vzc1RleHQgKz0gYCAoJHt0YXNrTGV2ZWx9JHtzaWdufSR7c2tpbGxMZXZlbH0pYDtcbiAgfVxuXG4gIHBhcnRzLnB1c2goe1xuICAgIHRleHQ6IHN1Y2Nlc3NUZXh0LFxuICAgIGNvbG9yOiB0bkNvbG9yLFxuICAgIGNsczogJ3RhcmdldC1udW1iZXInXG4gIH0pXG5cbiAgc3dpdGNoIChkaWVSb2xsKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuaW50cnVzaW9uJyksXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgIGNsczogJ2VmZmVjdCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDE5OlxuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuZWZmZWN0Lm1pbm9yJyksXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgIGNsczogJ2VmZmVjdCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDIwOlxuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuZWZmZWN0Lm1ham9yJyksXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgIGNsczogJ2VmZmVjdCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjeXBoZXJSb2xsKHsgcGFydHMgPSBbXSwgZGF0YSA9IHt9LCBhY3RvciA9IG51bGwsIGV2ZW50ID0gbnVsbCwgc3BlYWtlciA9IG51bGwsIGZsYXZvciA9IG51bGwsIHRpdGxlID0gbnVsbCwgaXRlbSA9IGZhbHNlIH0gPSB7fSkge1xuICBsZXQgcm9sbE1vZGUgPSBnYW1lLnNldHRpbmdzLmdldCgnY29yZScsICdyb2xsTW9kZScpO1xuICBsZXQgcm9sbGVkID0gZmFsc2U7XG4gIGxldCBmaWx0ZXJlZCA9IHBhcnRzLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICByZXR1cm4gZWwgIT0gJycgJiYgZWw7XG4gIH0pO1xuXG4gIC8vIEluZGljYXRlcyBmcmVlIGxldmVscyBvZiBlZmZvcnRcbiAgbGV0IHN0YXJ0aW5nRWZmb3J0ID0gMDtcbiAgbGV0IG1pbkVmZm9ydCA9IDA7XG4gIGlmIChkYXRhWydlZmZvcnQnXSkge1xuICAgIHN0YXJ0aW5nRWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnZWZmb3J0J10sIDEwKSB8fCAwO1xuICAgIG1pbkVmZm9ydCA9IHN0YXJ0aW5nRWZmb3J0O1xuICB9XG5cbiAgbGV0IG1heEVmZm9ydCA9IDE7XG4gIGlmIChkYXRhWydtYXhFZmZvcnQnXSkge1xuICAgIG1heEVmZm9ydCA9IHBhcnNlSW50KGRhdGFbJ21heEVmZm9ydCddLCAxMCkgfHwgMTtcbiAgfVxuXG4gIGNvbnN0IF9yb2xsID0gKGZvcm0gPSBudWxsKSA9PiB7XG4gICAgLy8gT3B0aW9uYWxseSBpbmNsdWRlIGVmZm9ydFxuICAgIGlmIChmb3JtKSB7XG4gICAgICBkYXRhWydlZmZvcnQnXSA9IHBhcnNlSW50KGZvcm0uZWZmb3J0LnZhbHVlLCAxMCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGFbJ2VmZm9ydCddKSB7XG4gICAgICBmaWx0ZXJlZC5wdXNoKGArJHtkYXRhWydlZmZvcnQnXSAqIDN9YCk7XG5cbiAgICAgIC8vIFRPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIGxvY2FsaXplIHRoaXMsIGNvbmNhdGluZyBzdHJpbmdzIGRvZXNuJ3Qgd29yayBmb3IgYWxsIGxhbmd1YWdlc1xuICAgICAgZmxhdm9yICs9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZWZmb3J0LmZsYXZvcicpLnJlcGxhY2UoJyMjRUZGT1JUIyMnLCBkYXRhWydlZmZvcnQnXSk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9sbCA9IG5ldyBSb2xsKGZpbHRlcmVkLmpvaW4oJycpLCBkYXRhKS5yb2xsKCk7XG4gICAgLy8gQ29udmVydCB0aGUgcm9sbCB0byBhIGNoYXQgbWVzc2FnZSBhbmQgcmV0dXJuIHRoZSByb2xsXG4gICAgcm9sbE1vZGUgPSBmb3JtID8gZm9ybS5yb2xsTW9kZS52YWx1ZSA6IHJvbGxNb2RlO1xuICAgIHJvbGxlZCA9IHRydWU7XG5cbiAgICByZXR1cm4gcm9sbDtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlID0gJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9kaWFsb2cvcm9sbC1kaWFsb2cuaHRtbCc7XG4gIGxldCBkaWFsb2dEYXRhID0ge1xuICAgIGZvcm11bGE6IGZpbHRlcmVkLmpvaW4oJyAnKSxcbiAgICBlZmZvcnQ6IHN0YXJ0aW5nRWZmb3J0LFxuICAgIG1pbkVmZm9ydDogbWluRWZmb3J0LFxuICAgIG1heEVmZm9ydDogbWF4RWZmb3J0LFxuICAgIGRhdGE6IGRhdGEsXG4gICAgcm9sbE1vZGU6IHJvbGxNb2RlLFxuICAgIHJvbGxNb2RlczogQ09ORklHLkRpY2Uucm9sbE1vZGVzXG4gIH07XG5cbiAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCBkaWFsb2dEYXRhKTtcbiAgLy9DcmVhdGUgRGlhbG9nIHdpbmRvd1xuICBsZXQgcm9sbDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIG5ldyBSb2xsRGlhbG9nKHtcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIGNvbnRlbnQ6IGh0bWwsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIG9rOiB7XG4gICAgICAgICAgbGFiZWw6ICdPSycsXG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICAgY2FsbGJhY2s6IChodG1sKSA9PiB7XG4gICAgICAgICAgICByb2xsID0gX3JvbGwoaHRtbC5maW5kKCdmb3JtJylbMF0pO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBjaGVjayByb2xsLnJlc3VsdCBhZ2FpbnN0IHRhcmdldCBudW1iZXJcblxuICAgICAgICAgICAgY29uc3QgeyBwb29sIH0gPSBkYXRhO1xuICAgICAgICAgICAgY29uc3QgYW1vdW50T2ZFZmZvcnQgPSBwYXJzZUludChkYXRhWydlZmZvcnQnXSB8fCAwLCAxMCk7XG4gICAgICAgICAgICBjb25zdCBlZmZvcnRDb3N0ID0gYWN0b3IuZ2V0RWZmb3J0Q29zdEZyb21TdGF0KHBvb2wsIGFtb3VudE9mRWZmb3J0KTtcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsQ29zdCA9IHBhcnNlSW50KGRhdGFbJ3Bvb2xDb3N0J10gfHwgMCwgMTApICsgcGFyc2VJbnQoZWZmb3J0Q29zdC5jb3N0LCAxMCk7XG5cbiAgICAgICAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCkgJiYgIWVmZm9ydENvc3Qud2FybmluZykge1xuICAgICAgICAgICAgICByb2xsLnRvTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgc3BlYWtlcjogc3BlYWtlcixcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGZsYXZvclxuICAgICAgICAgICAgICB9LCB7IHJvbGxNb2RlIH0pO1xuXG4gICAgICAgICAgICAgIGFjdG9yLnNwZW5kRnJvbVBvb2wocG9vbCwgTWF0aC5tYXgodG90YWxDb3N0LCAwKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XG4gICAgICAgICAgICAgICAgc3BlYWtlcixcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmZsYXZvcicpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmNvbnRlbnQnKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKVxuICAgICAgICAgICAgICB9XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiAnQ2FuY2VsJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiAnb2snLFxuICAgICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShyb2xsZWQgPyByb2xsIDogZmFsc2UpO1xuICAgICAgfVxuICAgIH0pLnJlbmRlcih0cnVlKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJTeXN0ZW1TZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBjdXJyZW5jeSBuYW1lXG4gICAqL1xuICBnYW1lLnNldHRpbmdzLnJlZ2lzdGVyKCdjeXBoZXJzeXN0ZW0nLCAnY3VycmVuY3lOYW1lJywge1xuICAgIG5hbWU6ICdTRVRUSU5HUy5uYW1lLmN1cnJlbmN5TmFtZScsXG4gICAgaGludDogJ1NFVFRJTkdTLmhpbnQuY3VycmVuY3lOYW1lJyxcbiAgICBzY29wZTogJ3dvcmxkJyxcbiAgICBjb25maWc6IHRydWUsXG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdNb25leSdcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBHTUludHJ1c2lvbkRpYWxvZyB9IGZyb20gXCIuL2RpYWxvZy9nbS1pbnRydXNpb24tZGlhbG9nLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3JTb2NrZXRMaXN0ZW5lcnMoKSB7XG4gIGdhbWUuc29ja2V0Lm9uKCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywgaGFuZGxlTWVzc2FnZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoYXJncykge1xuICBjb25zdCB7IHR5cGUgfSA9IGFyZ3M7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnZ21JbnRydXNpb24nOlxuICAgICAgaGFuZGxlR01JbnRydXNpb24oYXJncyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdhd2FyZFhQJzpcbiAgICAgIGhhbmRsZUF3YXJkWFAoYXJncyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHTUludHJ1c2lvbihhcmdzKSB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcbiAgY29uc3QgeyBhY3RvcklkLCB1c2VySWRzIH0gPSBkYXRhO1xuXG4gIGlmICghZ2FtZS5yZWFkeSB8fCBnYW1lLnVzZXIuaXNHTSB8fCAhdXNlcklkcy5maW5kKGlkID0+IGlkID09PSBnYW1lLnVzZXJJZCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLmRhdGEuX2lkID09PSBhY3RvcklkKTtcbiAgY29uc3QgZGlhbG9nID0gbmV3IEdNSW50cnVzaW9uRGlhbG9nKGFjdG9yKTtcbiAgZGlhbG9nLnJlbmRlcih0cnVlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXdhcmRYUChhcmdzKSB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcbiAgY29uc3QgeyBhY3RvcklkLCB4cEFtb3VudCB9ID0gZGF0YTtcblxuICBpZiAoIWdhbWUucmVhZHkgfHwgIWdhbWUudXNlci5pc0dNKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQoYWN0b3JJZCk7XG4gIGFjdG9yLnVwZGF0ZSh7XG4gICAgJ2RhdGEueHAnOiBhY3Rvci5kYXRhLmRhdGEueHAgKyB4cEFtb3VudFxuICB9KTtcblxuICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5hd2FyZFhQJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IuZGF0YS5uYW1lKVxuICB9KTtcbn1cbiIsIi8qIGdsb2JhbHMgbG9hZFRlbXBsYXRlcyAqL1xuXG4vKipcbiAqIERlZmluZSBhIHNldCBvZiB0ZW1wbGF0ZSBwYXRocyB0byBwcmUtbG9hZFxuICogUHJlLWxvYWRlZCB0ZW1wbGF0ZXMgYXJlIGNvbXBpbGVkIGFuZCBjYWNoZWQgZm9yIGZhc3QgYWNjZXNzIHdoZW4gcmVuZGVyaW5nXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgY29uc3QgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMgPSBhc3luYygpID0+IHtcbiAgLy8gRGVmaW5lIHRlbXBsYXRlIHBhdGhzIHRvIGxvYWRcbiAgY29uc3QgdGVtcGxhdGVQYXRocyA9IFtcblxuICAgICAgLy8gQWN0b3IgU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYy1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9ucGMtc2hlZXQuaHRtbFwiLFxuXG4gICAgICAvLyBBY3RvciBQYXJ0aWFsc1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvcG9vbHMuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvYWR2YW5jZW1lbnQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvZGFtYWdlLXRyYWNrLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3JlY292ZXJ5Lmh0bWxcIixcblxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvc2tpbGxzLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2FiaWxpdGllcy5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbnZlbnRvcnkuaHRtbFwiLFxuXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hYmlsaXR5LWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcm1vci1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vd2VhcG9uLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9jeXBoZXItaW5mby5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FydGlmYWN0LWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sXCIsXG5cbiAgICAgIC8vIEl0ZW0gU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL3NraWxsLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vYXJtb3Itc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS93ZWFwb24tc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9nZWFyLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vY3lwaGVyLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vYXJ0aWZhY3Qtc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9vZGRpdHktc2hlZXQuaHRtbFwiLFxuXG4gICAgICAvLyBEaWFsb2dzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9kaWFsb2cvcm9sbC1kaWFsb2cuaHRtbFwiLFxuICBdO1xuXG4gIC8vIExvYWQgdGhlIHRlbXBsYXRlIHBhcnRzXG4gIHJldHVybiBsb2FkVGVtcGxhdGVzKHRlbXBsYXRlUGF0aHMpO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBkZWVwUHJvcChvYmosIHBhdGgpIHtcbiAgY29uc3QgcHJvcHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIGxldCB2YWwgPSBvYmo7XG4gIHByb3BzLmZvckVhY2gocCA9PiB7XG4gICAgaWYgKHAgaW4gdmFsKSB7XG4gICAgICB2YWwgPSB2YWxbcF07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHZhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVmaW5lZCh2YWwpIHtcbiAgcmV0dXJuICEodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbE9yRGVmYXVsdCh2YWwsIGRlZikge1xuICByZXR1cm4gaXNEZWZpbmVkKHZhbCkgPyB2YWwgOiBkZWY7XG59XG4iLCJmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5TGlrZVRvQXJyYXk7IiwiZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheVdpdGhIb2xlczsiLCJmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQ7IiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FzeW5jVG9HZW5lcmF0b3I7IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY2xhc3NDYWxsQ2hlY2s7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jcmVhdGVDbGFzczsiLCJ2YXIgc3VwZXJQcm9wQmFzZSA9IHJlcXVpcmUoXCIuL3N1cGVyUHJvcEJhc2VcIik7XG5cbmZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfZ2V0ID0gUmVmbGVjdC5nZXQ7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfZ2V0ID0gZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICAgICAgdmFyIGJhc2UgPSBzdXBlclByb3BCYXNlKHRhcmdldCwgcHJvcGVydHkpO1xuICAgICAgaWYgKCFiYXNlKSByZXR1cm47XG4gICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZSwgcHJvcGVydHkpO1xuXG4gICAgICBpZiAoZGVzYy5nZXQpIHtcbiAgICAgICAgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIgfHwgdGFyZ2V0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0OyIsImZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICB9O1xuICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZjsiLCJ2YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi9zZXRQcm90b3R5cGVPZlwiKTtcblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pbmhlcml0czsiLCJmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0OyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwidW5kZWZpbmVkXCIgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpKSByZXR1cm47XG4gIHZhciBfYXJyID0gW107XG4gIHZhciBfbiA9IHRydWU7XG4gIHZhciBfZCA9IGZhbHNlO1xuICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfZCA9IHRydWU7XG4gICAgX2UgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2Fycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5TGltaXQ7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVSZXN0OyIsInZhciBfdHlwZW9mID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgYXNzZXJ0VGhpc0luaXRpYWxpemVkID0gcmVxdWlyZShcIi4vYXNzZXJ0VGhpc0luaXRpYWxpemVkXCIpO1xuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuOyIsImZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3NldFByb3RvdHlwZU9mOyIsInZhciBhcnJheVdpdGhIb2xlcyA9IHJlcXVpcmUoXCIuL2FycmF5V2l0aEhvbGVzXCIpO1xuXG52YXIgaXRlcmFibGVUb0FycmF5TGltaXQgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlMaW1pdFwiKTtcblxudmFyIHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5ID0gcmVxdWlyZShcIi4vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXlcIik7XG5cbnZhciBub25JdGVyYWJsZVJlc3QgPSByZXF1aXJlKFwiLi9ub25JdGVyYWJsZVJlc3RcIik7XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkge1xuICByZXR1cm4gYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgbm9uSXRlcmFibGVSZXN0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3NsaWNlZFRvQXJyYXk7IiwidmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vZ2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9zdXBlclByb3BCYXNlKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgd2hpbGUgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICBvYmplY3QgPSBnZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfc3VwZXJQcm9wQmFzZTsiLCJmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF90eXBlb2Y7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5XCIpO1xuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheTsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiJdfQ==
