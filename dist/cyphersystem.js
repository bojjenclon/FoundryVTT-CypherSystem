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

        _this4._onSubmit(evt);

        var el = evt.target; // Account for clicking a child element

        while (!el.dataset.itemId) {
          el = el.parentElement;
        }

        var skillId = el.dataset.itemId;
        var actor = _this4.actor;
        var skill = actor.getOwnedItem(skillId);
        _this4.selectedSkill = skill;
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

        _this5._onSubmit(evt);

        var el = evt.target; // Account for clicking a child element

        while (!el.dataset.itemId) {
          el = el.parentElement;
        }

        var abilityId = el.dataset.itemId;
        var actor = _this5.actor;
        var ability = actor.getOwnedItem(abilityId);
        _this5.selectedAbility = ability;
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

        _this6._onSubmit(evt);
      }));
      var invItems = html.find('a.inv-item');
      invItems.on('click', (function (evt) {
        evt.preventDefault();

        _this6._onSubmit(evt);

        var el = evt.target; // Account for clicking a child element

        while (!el.dataset.itemId) {
          el = el.parentElement;
        }

        var invItemId = el.dataset.itemId;
        var actor = _this6.actor;
        var invItem = actor.getOwnedItem(invItemId);
        _this6.selectedInvItem = invItem;
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
      return Math.floor((edge - 1) / 2);
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

function renderChatMessage(chatMessage, html, data) {
  // Don't apply ChatMessage enhancement to recovery rolls
  if (chatMessage.roll && !chatMessage.roll.dice[0].options.recovery) {
    var dieRoll = chatMessage.roll.dice[0].rolls[0].roll;
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

      if (!this.options.editable) {
        return;
      }

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

        if (adjustedAmounted === 0) {
          ChatMessage.create([{
            speaker: ChatMessage.getSpeaker({
              actor: actor
            }),
            flavor: game.i18n.localize('CSR.roll.ability.flavor').replace('##ACTOR##', actor.name).replace('##ABILITY##', name),
            content: game.i18n.localize('CSR.roll.ability.free')
          }]);
        } else if (actor.canSpendFromPool(pool, parseInt(amount, 10))) {
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
              if (form !== null) {
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
                      roll = _roll(html[0].children[0]); // TODO: check roll.result against target number

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
                        actor.spendFromPool(pool, totalCost);
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
            "systems/cyphersystem/templates/item/item-sheet.html", "systems/cyphersystem/templates/item/skill-sheet.html", "systems/cyphersystem/templates/item/armor-sheet.html", "systems/cyphersystem/templates/item/weapon-sheet.html", "systems/cyphersystem/templates/item/gear-sheet.html", "systems/cyphersystem/templates/item/cypher-sheet.html", "systems/cyphersystem/templates/item/artifact-sheet.html", "systems/cyphersystem/templates/item/oddity-sheet.html", // Dialogs
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY2hhdC5qcyIsIm1vZHVsZS9jb21iYXQuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2NvbnRleHQtbWVudS5qcyIsIm1vZHVsZS9jeXBoZXJzeXN0ZW0uanMiLCJtb2R1bGUvZGlhbG9nL2dtLWludHJ1c2lvbi1kaWFsb2cuanMiLCJtb2R1bGUvZGlhbG9nL3BsYXllci1jaG9pY2UtZGlhbG9nLmpzIiwibW9kdWxlL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXBvb2wuanMiLCJtb2R1bGUvZW51bXMvZW51bS1yYW5nZS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXRyYWluaW5nLmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VpZ2h0LmpzIiwibW9kdWxlL2hhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1vZHVsZS9pdGVtL2l0ZW0tc2hlZXQuanMiLCJtb2R1bGUvaXRlbS9pdGVtLmpzIiwibW9kdWxlL21hY3Jvcy5qcyIsIm1vZHVsZS9taWdyYXRpb25zL21pZ3JhdGUuanMiLCJtb2R1bGUvbWlncmF0aW9ucy9ucGMtbWlncmF0aW9ucy5qcyIsIm1vZHVsZS9yb2xscy5qcyIsIm1vZHVsZS9zZXR0aW5ncy5qcyIsIm1vZHVsZS9zb2NrZXQuanMiLCJtb2R1bGUvdGVtcGxhdGUuanMiLCJtb2R1bGUvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zZXRQcm90b3R5cGVPZi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zdXBlclByb3BCYXNlLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0VBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFQTs7OztJQUlhLHNCOzs7Ozs7OztBQWlDWDs4QkFFVTtBQUNSLFdBQUssZ0JBQUwsR0FBd0IsQ0FBQyxDQUF6QjtBQUNBLFdBQUssb0JBQUwsR0FBNEIsQ0FBQyxDQUE3QjtBQUNBLFdBQUssYUFBTCxHQUFxQixJQUFyQjtBQUVBLFdBQUssaUJBQUwsR0FBeUIsQ0FBQyxDQUExQjtBQUNBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUVBLFdBQUssbUJBQUwsR0FBMkIsQ0FBQyxDQUE1QjtBQUNBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLFdBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNEOzs7K0JBRVUsQ0FDVjs7OztBQXpCRDs7Ozt3QkFJZTtBQUFBLFVBQ0wsSUFESyxHQUNJLEtBQUssS0FBTCxDQUFXLElBRGYsQ0FDTCxJQURLO0FBRWIsNERBQStDLElBQS9DO0FBQ0Q7Ozs7QUE3QkQ7d0JBQzRCO0FBQzFCLGFBQU8sV0FBVyxvR0FBdUI7QUFDdkMsUUFBQSxPQUFPLEVBQUUsQ0FBQyxjQUFELEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCLENBRDhCO0FBRXZDLFFBQUEsS0FBSyxFQUFFLEdBRmdDO0FBR3ZDLFFBQUEsTUFBTSxFQUFFLEdBSCtCO0FBSXZDLFFBQUEsSUFBSSxFQUFFLENBQUM7QUFDTCxVQUFBLFdBQVcsRUFBRSxhQURSO0FBRUwsVUFBQSxlQUFlLEVBQUUsYUFGWjtBQUdMLFVBQUEsT0FBTyxFQUFFO0FBSEosU0FBRCxFQUlIO0FBQ0QsVUFBQSxXQUFXLEVBQUUsYUFEWjtBQUVELFVBQUEsZUFBZSxFQUFFLGFBRmhCO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dEJBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0IERpYWxvZyBDb250ZXh0TWVudSAqL1xuXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xuaW1wb3J0IHsgY3lwaGVyUm9sbCB9IGZyb20gJy4uL3JvbGxzLmpzJztcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tICcuLi9pdGVtL2l0ZW0uanMnO1xuaW1wb3J0IHsgZGVlcFByb3AgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEFjdG9yU2hlZXQgd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnNcbiAqIEBleHRlbmRzIHtBY3RvclNoZWV0fVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCBleHRlbmRzIEFjdG9yU2hlZXQge1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIGNsYXNzZXM6IFtcImN5cGhlcnN5c3RlbVwiLCBcInNoZWV0XCIsIFwiYWN0b3JcIl0sXG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICB0YWJzOiBbe1xuICAgICAgICBuYXZTZWxlY3RvcjogXCIuc2hlZXQtdGFic1wiLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6IFwiLnNoZWV0LWJvZHlcIixcbiAgICAgICAgaW5pdGlhbDogXCJkZXNjcmlwdGlvblwiXG4gICAgICB9LCB7XG4gICAgICAgIG5hdlNlbGVjdG9yOiAnLnN0YXRzLXRhYnMnLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6ICcuc3RhdHMtYm9keScsXG4gICAgICAgIGluaXRpYWw6ICdhZHZhbmNlbWVudCdcbiAgICAgIH1dLFxuICAgICAgc2Nyb2xsWTogW1xuICAgICAgICAnLnRhYi5pbnZlbnRvcnkgLmludmVudG9yeS1saXN0JyxcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktaW5mbycsXG4gICAgICBdXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3JyZWN0IEhUTUwgdGVtcGxhdGUgcGF0aCB0byB1c2UgZm9yIHJlbmRlcmluZyB0aGlzIHBhcnRpY3VsYXIgc2hlZXRcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcbiAgICByZXR1cm4gYHN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci8ke3R5cGV9LXNoZWV0Lmh0bWxgO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfcGNJbml0KCkge1xuICAgIHRoaXMuc2tpbGxzUG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSAtMTtcbiAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xuXG4gICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcblxuICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICB0aGlzLmZpbHRlckVxdWlwcGVkID0gZmFsc2U7XG4gIH1cblxuICBfbnBjSW5pdCgpIHtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICB0aGlzLl9wY0luaXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9ucGNJbml0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsIHR5cGUsIGZpZWxkKSB7XG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XG4gICAgaWYgKCFpdGVtc1tmaWVsZF0pIHtcbiAgICAgIGl0ZW1zW2ZpZWxkXSA9IGl0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gdHlwZSk7IC8vLnNvcnQoc29ydEZ1bmN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBfZmlsdGVySXRlbURhdGEoZGF0YSwgaXRlbUZpZWxkLCBmaWx0ZXJGaWVsZCwgZmlsdGVyVmFsdWUpIHtcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcbiAgICBpdGVtc1tpdGVtRmllbGRdID0gaXRlbXNbaXRlbUZpZWxkXS5maWx0ZXIoaXRtID0+IGRlZXBQcm9wKGl0bSwgZmlsdGVyRmllbGQpID09PSBmaWx0ZXJWYWx1ZSk7XG4gIH1cblxuICBhc3luYyBfc2tpbGxEYXRhKGRhdGEpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdza2lsbCcsICdza2lsbHMnKTtcbiAgICAvLyBHcm91cCBza2lsbHMgYnkgdGhlaXIgcG9vbCwgdGhlbiBhbHBoYW51bWVyaWNhbGx5XG4gICAgZGF0YS5kYXRhLml0ZW1zLnNraWxscy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5kYXRhLnBvb2wgPT09IGIuZGF0YS5wb29sKSB7XG4gICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGEuZGF0YS5wb29sID4gYi5kYXRhLnBvb2wpID8gMSA6IC0xO1xuICAgIH0pO1xuXG4gICAgZGF0YS5za2lsbHNQb29sRmlsdGVyID0gdGhpcy5za2lsbHNQb29sRmlsdGVyO1xuICAgIGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSB0aGlzLnNraWxsc1RyYWluaW5nRmlsdGVyO1xuXG4gICAgaWYgKGRhdGEuc2tpbGxzUG9vbEZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ2RhdGEucG9vbCcsIHBhcnNlSW50KGRhdGEuc2tpbGxzUG9vbEZpbHRlciwgMTApKTtcbiAgICB9XG4gICAgaWYgKGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ3NraWxscycsICdkYXRhLnRyYWluaW5nJywgcGFyc2VJbnQoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciwgMTApKTtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkU2tpbGwgPSB0aGlzLnNlbGVjdGVkU2tpbGw7XG4gICAgZGF0YS5za2lsbEluZm8gPSAnJztcbiAgICBpZiAoZGF0YS5zZWxlY3RlZFNraWxsKSB7XG4gICAgICBkYXRhLnNraWxsSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRTa2lsbC5nZXRJbmZvKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2FiaWxpdHlEYXRhKGRhdGEpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdhYmlsaXR5JywgJ2FiaWxpdGllcycpO1xuICAgIC8vIEdyb3VwIGFiaWxpdGllcyBieSB0aGVpciBwb29sLCB0aGVuIGFscGhhbnVtZXJpY2FsbHlcbiAgICBkYXRhLmRhdGEuaXRlbXMuYWJpbGl0aWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmRhdGEuY29zdC5wb29sID09PSBiLmRhdGEuY29zdC5wb29sKSB7XG4gICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGEuZGF0YS5jb3N0LnBvb2wgPiBiLmRhdGEuY29zdC5wb29sKSA/IDEgOiAtMTtcbiAgICB9KTtcblxuICAgIGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPSB0aGlzLmFiaWxpdHlQb29sRmlsdGVyO1xuXG4gICAgaWYgKGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ2FiaWxpdGllcycsICdkYXRhLmNvc3QucG9vbCcsIHBhcnNlSW50KGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIsIDEwKSk7XG4gICAgfVxuXG4gICAgZGF0YS5zZWxlY3RlZEFiaWxpdHkgPSB0aGlzLnNlbGVjdGVkQWJpbGl0eTtcbiAgICBkYXRhLmFiaWxpdHlJbmZvID0gJyc7XG4gICAgaWYgKGRhdGEuc2VsZWN0ZWRBYmlsaXR5KSB7XG4gICAgICBkYXRhLmFiaWxpdHlJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZEFiaWxpdHkuZ2V0SW5mbygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9pbnZlbnRvcnlEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmludmVudG9yeVR5cGVzID0gQ1NSLmludmVudG9yeVR5cGVzO1xuXG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XG4gICAgaWYgKCFpdGVtcy5pbnZlbnRvcnkpIHtcbiAgICAgIGl0ZW1zLmludmVudG9yeSA9IGl0ZW1zLmZpbHRlcihpID0+IENTUi5pbnZlbnRvcnlUeXBlcy5pbmNsdWRlcyhpLnR5cGUpKTtcblxuICAgICAgaWYgKHRoaXMuZmlsdGVyRXF1aXBwZWQpIHtcbiAgICAgICAgaXRlbXMuaW52ZW50b3J5ID0gaXRlbXMuaW52ZW50b3J5LmZpbHRlcihpID0+ICEhaS5kYXRhLmVxdWlwcGVkKTtcbiAgICAgIH1cblxuICAgICAgLy8gR3JvdXAgaXRlbXMgYnkgdGhlaXIgdHlwZSwgdGhlbiBhbHBoYW51bWVyaWNhbGx5XG4gICAgICBpdGVtcy5pbnZlbnRvcnkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS50eXBlID09PSBiLnR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gKGEubmFtZSA+IGIubmFtZSkgPyAxIDogLTFcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoYS50eXBlID4gYi50eXBlKSA/IDEgOiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRhdGEuY3lwaGVyQ291bnQgPSBpdGVtcy5yZWR1Y2UoKGNvdW50LCBpKSA9PiBpLnR5cGUgPT09ICdjeXBoZXInID8gKytjb3VudCA6IGNvdW50LCAwKTtcbiAgICBkYXRhLm92ZXJDeXBoZXJMaW1pdCA9IHRoaXMuYWN0b3IuaXNPdmVyQ3lwaGVyTGltaXQ7XG5cbiAgICBkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIgPSB0aGlzLmludmVudG9yeVR5cGVGaWx0ZXI7XG4gICAgZGF0YS5maWx0ZXJFcXVpcHBlZCA9IHRoaXMuZmlsdGVyRXF1aXBwZWQ7XG5cbiAgICBpZiAoZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyID4gLTEpIHtcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdpbnZlbnRvcnknLCAndHlwZScsIENTUi5pbnZlbnRvcnlUeXBlc1twYXJzZUludChkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIsIDEwKV0pO1xuICAgIH1cblxuICAgIGRhdGEuc2VsZWN0ZWRJbnZJdGVtID0gdGhpcy5zZWxlY3RlZEludkl0ZW07XG4gICAgZGF0YS5pbnZJdGVtSW5mbyA9ICcnO1xuICAgIGlmIChkYXRhLnNlbGVjdGVkSW52SXRlbSkge1xuICAgICAgZGF0YS5pbnZJdGVtSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRJbnZJdGVtLmdldEluZm8oKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBfcGNEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcblxuICAgIGRhdGEuY3VycmVuY3lOYW1lID0gZ2FtZS5zZXR0aW5ncy5nZXQoJ2N5cGhlcnN5c3RlbScsICdjdXJyZW5jeU5hbWUnKTtcblxuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEud2VhcG9uVHlwZXMgPSBDU1Iud2VhcG9uVHlwZXM7XG4gICAgZGF0YS53ZWlnaHRzID0gQ1NSLndlaWdodENsYXNzZXM7XG5cbiAgICBkYXRhLmFkdmFuY2VzID0gT2JqZWN0LmVudHJpZXMoZGF0YS5hY3Rvci5kYXRhLmFkdmFuY2VzKS5tYXAoXG4gICAgICAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi5hZHZhbmNlLiR7a2V5fWApLFxuICAgICAgICAgIGlzQ2hlY2tlZDogdmFsdWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGRhdGEuZGFtYWdlVHJhY2tEYXRhID0gQ1NSLmRhbWFnZVRyYWNrO1xuICAgIGRhdGEuZGFtYWdlVHJhY2sgPSBDU1IuZGFtYWdlVHJhY2tbZGF0YS5kYXRhLmRhbWFnZVRyYWNrXTtcblxuICAgIGRhdGEucmVjb3Zlcmllc0RhdGEgPSBPYmplY3QuZW50cmllcyhcbiAgICAgIGRhdGEuYWN0b3IuZGF0YS5yZWNvdmVyaWVzXG4gICAgKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5LFxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IucmVjb3ZlcnkuJHtrZXl9YCksXG4gICAgICAgIGNoZWNrZWQ6IHZhbHVlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGRhdGEudHJhaW5pbmdMZXZlbHMgPSBDU1IudHJhaW5pbmdMZXZlbHM7XG5cbiAgICBkYXRhLmRhdGEuaXRlbXMgPSBkYXRhLmFjdG9yLml0ZW1zIHx8IHt9O1xuXG4gICAgYXdhaXQgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX2FiaWxpdHlEYXRhKGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX2ludmVudG9yeURhdGEoZGF0YSk7XG4gIH1cblxuICBhc3luYyBfbnBjRGF0YShkYXRhKSB7XG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhc3luYyBnZXREYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3BjJzpcbiAgICAgICAgYXdhaXQgdGhpcy5fcGNEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIGF3YWl0IHRoaXMuX25wY0RhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX2NyZWF0ZUl0ZW0oaXRlbU5hbWUpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHtcbiAgICAgIG5hbWU6IGBOZXcgJHtpdGVtTmFtZS5jYXBpdGFsaXplKCl9YCxcbiAgICAgIHR5cGU6IGl0ZW1OYW1lLFxuICAgICAgZGF0YTogbmV3IEN5cGhlclN5c3RlbUl0ZW0oe30pLFxuICAgIH07XG5cbiAgICB0aGlzLmFjdG9yLmNyZWF0ZU93bmVkSXRlbShpdGVtRGF0YSwgeyByZW5kZXJTaGVldDogdHJ1ZSB9KTtcbiAgfVxuXG4gIF9yb2xsUG9vbERpYWxvZyhwb29sKSB7XG4gICAgY29uc3QgeyBhY3RvciB9ID0gdGhpcztcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICAgIGN5cGhlclJvbGwoe1xuICAgICAgcGFydHM6IFsnMWQyMCddLFxuXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBvb2wsXG4gICAgICAgIGVmZm9ydDogZnJlZUVmZm9ydCxcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxuICAgICAgfSxcbiAgICAgIGV2ZW50LFxuXG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5wb29sLnRpdGxlJykucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSksXG4gICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucG9vbC5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKSxcblxuICAgICAgYWN0b3IsXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgfSk7XG4gIH1cblxuICBfcm9sbFJlY292ZXJ5KCkge1xuICAgIGNvbnN0IHsgYWN0b3IgfSA9IHRoaXM7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xuXG4gICAgY29uc3Qgcm9sbCA9IG5ldyBSb2xsKGAxZDYrJHthY3RvckRhdGEucmVjb3ZlcnlNb2R9YCkucm9sbCgpO1xuXG4gICAgLy8gRmxhZyB0aGUgcm9sbCBhcyBhIHJlY292ZXJ5IHJvbGxcbiAgICByb2xsLmRpY2VbMF0ub3B0aW9ucy5yZWNvdmVyeSA9IHRydWU7XG5cbiAgICByb2xsLnRvTWVzc2FnZSh7XG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5yZWNvdmVyeS50aXRsZScpLFxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnJlY292ZXJ5LmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLFxuICAgIH0pO1xuICB9XG5cbiAgX2RlbGV0ZUl0ZW1EaWFsb2coaXRlbUlkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvbkRpYWxvZyA9IG5ldyBEaWFsb2coe1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlLnRpdGxlXCIpLFxuICAgICAgY29udGVudDogYDxwPiR7Z2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5kZWxldGUuY29udGVudFwiKX08L3A+PGhyIC8+YCxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgY29uZmlybToge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1jaGVja1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmJ1dHRvbi5kZWxldGVcIiksXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWN0b3IuZGVsZXRlT3duZWRJdGVtKGl0ZW1JZCk7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmJ1dHRvbi5jYW5jZWxcIiksXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogXCJjYW5jZWxcIlxuICAgIH0pO1xuICAgIGNvbmZpcm1hdGlvbkRpYWxvZy5yZW5kZXIodHJ1ZSk7XG4gIH1cblxuICBfc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIFN0YXRzIFNldHVwXG4gICAgY29uc3QgcG9vbFJvbGxzID0gaHRtbC5maW5kKCcucm9sbC1wb29sJyk7XG4gICAgcG9vbFJvbGxzLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5wb29sKSB7XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZWwuZGF0YXNldDtcblxuICAgICAgdGhpcy5fcm9sbFBvb2xEaWFsb2cocGFyc2VJbnQocG9vbCwgMTApKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmFjdG9yLm93bmVyKSB7XG4gICAgICAvLyBQb29scyByZXF1aXJlIGN1c3RvbSBkcmFnIGxvZ2ljIHNpbmNlIHdlJ3JlICBcbiAgICAgIC8vIG5vdCBjcmVhdGluZyBhIG1hY3JvIGZvciBhbiBpdGVtXG4gICAgICBjb25zdCBoYW5kbGVyID0gZXYgPT4ge1xuICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICAgICAndGV4dC9wbGFpbicsXG4gICAgXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgYWN0b3JJZDogdGhpcy5hY3Rvci5pZCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3Bvb2wnLFxuICAgICAgICAgICAgICBwb29sOiBldi5jdXJyZW50VGFyZ2V0LmRhdGFzZXQucG9vbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfTtcblxuICAgICAgcG9vbFJvbGxzLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmRhbWFnZVRyYWNrXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJy5yZWNvdmVyeS1yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9yb2xsUmVjb3ZlcnkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9za2lsbHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIFNraWxscyBTZXR1cFxuICAgIGh0bWwuZmluZCgnLmFkZC1za2lsbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnc2tpbGwnKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNraWxsc1Bvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2tpbGxzUG9vbEZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIHNraWxsc1Bvb2xGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLnNraWxsc1Bvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNraWxsc1RyYWluaW5nRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInNraWxsc1RyYWluaW5nRmlsdGVyXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gICAgc2tpbGxzVHJhaW5pbmdGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLnNraWxsc1RyYWluaW5nRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNraWxscyA9IGh0bWwuZmluZCgnYS5za2lsbCcpO1xuXG4gICAgc2tpbGxzLm9uKCdjbGljaycsIGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0Lml0ZW1JZCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBza2lsbElkID0gZWwuZGF0YXNldC5pdGVtSWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IHNraWxsID0gYWN0b3IuZ2V0T3duZWRJdGVtKHNraWxsSWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBza2lsbDtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmFjdG9yLm93bmVyKSB7XG4gICAgICBjb25zdCBoYW5kbGVyID0gZXYgPT4gdGhpcy5fb25EcmFnSXRlbVN0YXJ0KGV2KTtcbiAgICAgIHNraWxscy5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlbGVjdGVkU2tpbGwgfSA9IHRoaXM7XG4gICAgaWYgKHNlbGVjdGVkU2tpbGwpIHtcbiAgICAgIGh0bWwuZmluZCgnLnNraWxsLWluZm8gLmFjdGlvbnMgLnJvbGwnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzZWxlY3RlZFNraWxsLnJvbGwoKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5lZGl0JykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNraWxsLnNoZWV0LnJlbmRlcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5kZWxldGUnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9kZWxldGVJdGVtRGlhbG9nKHRoaXMuc2VsZWN0ZWRTa2lsbC5faWQsIGRpZERlbGV0ZSA9PiB7XG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2FiaWxpdHlUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIEFiaWxpdGllcyBTZXR1cFxuICAgIGh0bWwuZmluZCgnLmFkZC1hYmlsaXR5JykuY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9jcmVhdGVJdGVtKCdhYmlsaXR5Jyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhYmlsaXR5UG9vbEZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJhYmlsaXR5UG9vbEZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIGFiaWxpdHlQb29sRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhYmlsaXRpZXMgPSBodG1sLmZpbmQoJ2EuYWJpbGl0eScpO1xuXG4gICAgYWJpbGl0aWVzLm9uKCdjbGljaycsIGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0Lml0ZW1JZCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBhYmlsaXR5SWQgPSBlbC5kYXRhc2V0Lml0ZW1JZDtcblxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgICAgY29uc3QgYWJpbGl0eSA9IGFjdG9yLmdldE93bmVkSXRlbShhYmlsaXR5SWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IGFiaWxpdHk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5hY3Rvci5vd25lcikge1xuICAgICAgY29uc3QgaGFuZGxlciA9IGV2ID0+IHRoaXMuX29uRHJhZ0l0ZW1TdGFydChldik7XG4gICAgICBhYmlsaXRpZXMuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZWxlY3RlZEFiaWxpdHkgfSA9IHRoaXM7XG4gICAgaWYgKHNlbGVjdGVkQWJpbGl0eSkge1xuICAgICAgaHRtbC5maW5kKCcuYWJpbGl0eS1pbmZvIC5hY3Rpb25zIC5yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0ZWRBYmlsaXR5LnJvbGwoKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eS5zaGVldC5yZW5kZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuYWJpbGl0eS1pbmZvIC5hY3Rpb25zIC5kZWxldGUnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9kZWxldGVJdGVtRGlhbG9nKHRoaXMuc2VsZWN0ZWRBYmlsaXR5Ll9pZCwgZGlkRGVsZXRlID0+IHtcbiAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9pbnZlbnRvcnlUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIEludmVudG9yeSBTZXR1cFxuXG4gICAgY29uc3QgY3R4dE1lbnVFbCA9IGh0bWwuZmluZCgnLmNvbnRleHRtZW51Jyk7XG4gICAgY29uc3QgYWRkSW52QnRuID0gaHRtbC5maW5kKCcuYWRkLWludmVudG9yeScpO1xuXG4gICAgY29uc3QgbWVudUl0ZW1zID0gW107XG4gICAgQ1NSLmludmVudG9yeVR5cGVzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICBtZW51SXRlbXMucHVzaCh7XG4gICAgICAgIG5hbWU6IGdhbWUuaTE4bi5sb2NhbGl6ZShgQ1NSLmludmVudG9yeS4ke3R5cGV9YCksXG4gICAgICAgIGljb246ICcnLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NyZWF0ZUl0ZW0odHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNvbnN0IGN0eHRNZW51T2JqID0gbmV3IENvbnRleHRNZW51KGh0bWwsICcuYWN0aXZlJywgbWVudUl0ZW1zKTtcblxuICAgIGFkZEludkJ0bi5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vIEEgYml0IG9mIGEgaGFjayB0byBlbnN1cmUgdGhlIGNvbnRleHQgbWVudSBpc24ndFxuICAgICAgLy8gY3V0IG9mZiBkdWUgdG8gdGhlIHNoZWV0J3MgY29udGVudCByZWx5aW5nIG9uXG4gICAgICAvLyBvdmVyZmxvdyBoaWRkZW4uIEluc3RlYWQsIHdlIG5lc3QgdGhlIG1lbnUgaW5zaWRlXG4gICAgICAvLyBhIGZsb2F0aW5nIGFic29sdXRlbHkgcG9zaXRpb25lZCBkaXYsIHNldCB0byBvdmVybGFwXG4gICAgICAvLyB0aGUgYWRkIGludmVudG9yeSBpdGVtIGljb24uXG4gICAgICBjdHh0TWVudUVsLm9mZnNldChhZGRJbnZCdG4ub2Zmc2V0KCkpO1xuXG4gICAgICBjdHh0TWVudU9iai5yZW5kZXIoY3R4dE1lbnVFbC5maW5kKCcuY29udGFpbmVyJykpO1xuICAgIH0pO1xuXG4gICAgaHRtbC5vbignbW91c2Vkb3duJywgZXZ0ID0+IHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBhZGRJbnZCdG5bMF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDbG9zZSB0aGUgY29udGV4dCBtZW51IGlmIHVzZXIgY2xpY2tzIGFueXdoZXJlIGVsc2VcbiAgICAgIGN0eHRNZW51T2JqLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBpbnZlbnRvcnlUeXBlRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImludmVudG9yeVR5cGVGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBpbnZlbnRvcnlUeXBlRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5pbnZlbnRvcnlUeXBlRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnLmZpbHRlci1lcXVpcHBlZCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5maWx0ZXJFcXVpcHBlZCA9ICF0aGlzLmZpbHRlckVxdWlwcGVkO1xuXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW52SXRlbXMgPSBodG1sLmZpbmQoJ2EuaW52LWl0ZW0nKTtcblxuICAgIGludkl0ZW1zLm9uKCdjbGljaycsIGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0Lml0ZW1JZCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBpbnZJdGVtSWQgPSBlbC5kYXRhc2V0Lml0ZW1JZDtcblxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgICAgY29uc3QgaW52SXRlbSA9IGFjdG9yLmdldE93bmVkSXRlbShpbnZJdGVtSWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IGludkl0ZW07XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5hY3Rvci5vd25lcikge1xuICAgICAgY29uc3QgaGFuZGxlciA9IGV2ID0+IHRoaXMuX29uRHJhZ0l0ZW1TdGFydChldik7XG4gICAgICBpbnZJdGVtcy5lYWNoKChfLCBlbCkgPT4ge1xuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsIHRydWUpO1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdkcmFnc3RhcnQnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlbGVjdGVkSW52SXRlbSB9ID0gdGhpcztcbiAgICBpZiAoc2VsZWN0ZWRJbnZJdGVtKSB7XG4gICAgICBodG1sLmZpbmQoJy5pbnZlbnRvcnktaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtLnNoZWV0LnJlbmRlcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5pbnZlbnRvcnktaW5mbyAuYWN0aW9ucyAuZGVsZXRlJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fZGVsZXRlSXRlbURpYWxvZyh0aGlzLnNlbGVjdGVkSW52SXRlbS5faWQsIGRpZERlbGV0ZSA9PiB7XG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfcGNMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuYWN0b3InKS5hZGRDbGFzcygncGMtd2luZG93Jyk7XG5cbiAgICAvLyBIYWNrLCBmb3Igc29tZSByZWFzb24gdGhlIGlubmVyIHRhYidzIGNvbnRlbnQgZG9lc24ndCBzaG93IFxuICAgIC8vIHdoZW4gY2hhbmdpbmcgcHJpbWFyeSB0YWJzIHdpdGhpbiB0aGUgc2hlZXRcbiAgICBodG1sLmZpbmQoJy5pdGVtW2RhdGEtdGFiPVwic3RhdHNcIl0nKS5jbGljaygoKSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RlZFN1YlRhYiA9IGh0bWwuZmluZCgnLnN0YXRzLXRhYnMgLml0ZW0uYWN0aXZlJykuZmlyc3QoKTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkU3ViUGFnZSA9IGh0bWwuZmluZChgLnN0YXRzLWJvZHkgLnRhYltkYXRhLXRhYj1cIiR7c2VsZWN0ZWRTdWJUYWIuZGF0YSgndGFiJyl9XCJdYCk7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZWxlY3RlZFN1YlBhZ2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfSwgMCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zdGF0c1RhYkxpc3RlbmVycyhodG1sKTtcbiAgICB0aGlzLl9za2lsbHNUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5fYWJpbGl0eVRhYkxpc3RlbmVycyhodG1sKTtcbiAgICB0aGlzLl9pbnZlbnRvcnlUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gIH1cblxuICBfbnBjTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0LmFjdG9yJykuYWRkQ2xhc3MoJ25wYy13aW5kb3cnKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLm1vdmVtZW50XCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBzdXBlci5hY3RpdmF0ZUxpc3RlbmVycyhodG1sKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLmVkaXRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLmFjdG9yLmRhdGE7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdwYyc6XG4gICAgICAgIHRoaXMuX3BjTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIHRoaXMuX25wY0xpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBfb25EcmFnSXRlbVN0YXJ0KGV2ZW50KSB7XG4gICAgY29uc3QgaXRlbUlkID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0Lml0ZW1JZDtcbiAgICBjb25zdCBjbGlja2VkSXRlbSA9IHRoaXMuYWN0b3IuZ2V0RW1iZWRkZWRFbnRpdHkoJ093bmVkSXRlbScsIGl0ZW1JZClcblxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgJ3RleHQvcGxhaW4nLFxuXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGFjdG9ySWQ6IHRoaXMuYWN0b3IuaWQsXG4gICAgICAgIGRhdGE6IGNsaWNrZWRJdGVtLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHN1cGVyLl9vbkRyYWdJdGVtU3RhcnQoZXZlbnQpO1xuICB9XG59XG4iLCIvKiBnbG9iYWwgQWN0b3I6ZmFsc2UgKi9cblxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcbmltcG9ydCB7IHZhbE9yRGVmYXVsdCB9IGZyb20gJy4uL3V0aWxzLmpzJztcblxuaW1wb3J0IHsgUGxheWVyQ2hvaWNlRGlhbG9nIH0gZnJvbSAnLi4vZGlhbG9nL3BsYXllci1jaG9pY2UtZGlhbG9nLmpzJztcblxuaW1wb3J0IEVudW1Qb29scyBmcm9tICcuLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuXG4vKipcbiAqIEV4dGVuZCB0aGUgYmFzZSBBY3RvciBlbnRpdHkgYnkgZGVmaW5pbmcgYSBjdXN0b20gcm9sbCBkYXRhIHN0cnVjdHVyZSB3aGljaCBpcyBpZGVhbCBmb3IgdGhlIFNpbXBsZSBzeXN0ZW0uXG4gKiBAZXh0ZW5kcyB7QWN0b3J9XG4gKi9cbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1BY3RvciBleHRlbmRzIEFjdG9yIHtcbiAgLyoqXG4gICAqIFByZXBhcmUgQ2hhcmFjdGVyIHR5cGUgc3BlY2lmaWMgZGF0YVxuICAgKi9cbiAgX3ByZXBhcmVQQ0RhdGEoYWN0b3JEYXRhKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhY3RvckRhdGE7XG5cbiAgICBkYXRhLnNlbnRlbmNlID0gdmFsT3JEZWZhdWx0KGRhdGEuc2VudGVuY2UsIHtcbiAgICAgIGRlc2NyaXB0b3I6ICcnLFxuICAgICAgdHlwZTogJycsXG4gICAgICBmb2N1czogJydcbiAgICB9KTtcblxuICAgIGRhdGEudGllciA9IHZhbE9yRGVmYXVsdChkYXRhLnRpZXIsIDEpO1xuICAgIGRhdGEuZWZmb3J0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmb3J0LCAxKTtcbiAgICBkYXRhLnhwID0gdmFsT3JEZWZhdWx0KGRhdGEueHAsIDApO1xuICAgIGRhdGEuY3lwaGVyTGltaXQgPSB2YWxPckRlZmF1bHQoZGF0YS5jeXBoZXJMaW1pdCwgMSk7XG5cbiAgICBkYXRhLmFkdmFuY2VzID0gdmFsT3JEZWZhdWx0KGRhdGEuYWR2YW5jZXMsIHtcbiAgICAgIHN0YXRzOiBmYWxzZSxcbiAgICAgIGVkZ2U6IGZhbHNlLFxuICAgICAgZWZmb3J0OiBmYWxzZSxcbiAgICAgIHNraWxsczogZmFsc2UsXG4gICAgICBvdGhlcjogZmFsc2VcbiAgICB9KTtcblxuICAgIGRhdGEucmVjb3ZlcnlNb2QgPSB2YWxPckRlZmF1bHQoZGF0YS5yZWNvdmVyeU1vZCwgMSk7XG4gICAgZGF0YS5yZWNvdmVyaWVzID0gdmFsT3JEZWZhdWx0KGRhdGEucmVjb3Zlcmllcywge1xuICAgICAgYWN0aW9uOiBmYWxzZSxcbiAgICAgIHRlbk1pbnM6IGZhbHNlLFxuICAgICAgb25lSG91cjogZmFsc2UsXG4gICAgICB0ZW5Ib3VyczogZmFsc2VcbiAgICB9KTtcblxuICAgIGRhdGEuZGFtYWdlVHJhY2sgPSB2YWxPckRlZmF1bHQoZGF0YS5kYW1hZ2VUcmFjaywgMCk7XG4gICAgZGF0YS5hcm1vciA9IHZhbE9yRGVmYXVsdChkYXRhLmFybW9yLCAwKTtcblxuICAgIGRhdGEuc3RhdHMgPSB2YWxPckRlZmF1bHQoZGF0YS5zdGF0cywge1xuICAgICAgbWlnaHQ6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH0sXG4gICAgICBzcGVlZDoge1xuICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgcG9vbDogMCxcbiAgICAgICAgZWRnZTogMFxuICAgICAgfSxcbiAgICAgIGludGVsbGVjdDoge1xuICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgcG9vbDogMCxcbiAgICAgICAgZWRnZTogMFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGF0YS5tb25leSA9IHZhbE9yRGVmYXVsdChkYXRhLm1vbmV5LCAwKTtcbiAgfVxuXG4gIF9wcmVwYXJlTlBDRGF0YShhY3RvckRhdGEpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGFjdG9yRGF0YTtcblxuICAgIGRhdGEubGV2ZWwgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbCwgMSk7XG5cbiAgICBkYXRhLmhlYWx0aCA9IHZhbE9yRGVmYXVsdChkYXRhLmhlYWx0aCwgMyk7XG4gICAgZGF0YS5kYW1hZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5kYW1hZ2UsIDEpO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMCk7XG4gICAgZGF0YS5tb3ZlbWVudCA9IHZhbE9yRGVmYXVsdChkYXRhLm1vdmVtZW50LCAxKTtcblxuICAgIGRhdGEuZGVzY3JpcHRpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5kZXNjcmlwdGlvbiwgJycpO1xuICAgIGRhdGEubW90aXZlID0gdmFsT3JEZWZhdWx0KGRhdGEubW90aXZlLCAnJyk7XG4gICAgZGF0YS5lbnZpcm9ubWVudCA9IHZhbE9yRGVmYXVsdChkYXRhLmVudmlyb25tZW50LCAnJyk7XG4gICAgZGF0YS5tb2RpZmljYXRpb25zID0gdmFsT3JEZWZhdWx0KGRhdGEubW9kaWZpY2F0aW9ucywgJycpO1xuICAgIGRhdGEuY29tYmF0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY29tYmF0LCAnJyk7XG4gICAgZGF0YS5pbnRlcmFjdGlvbiA9IHZhbE9yRGVmYXVsdChkYXRhLmludGVyYWN0aW9uLCAnJyk7XG4gICAgZGF0YS51c2UgPSB2YWxPckRlZmF1bHQoZGF0YS51c2UsICcnKTtcbiAgICBkYXRhLmxvb3QgPSB2YWxPckRlZmF1bHQoZGF0YS5sb290LCAnJyk7XG4gIH1cblxuICAvKipcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgYWN0b3IgZGF0YSB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxuICAgKi9cbiAgcHJlcGFyZURhdGEoKSB7XG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcblxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCBkYXRhID0gYWN0b3JEYXRhLmRhdGE7XG4gICAgY29uc3QgZmxhZ3MgPSBhY3RvckRhdGEuZmxhZ3M7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yRGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3BjJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZVBDRGF0YShhY3RvckRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVOUENEYXRhKGFjdG9yRGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpbml0aWF0aXZlTGV2ZWwoKSB7XG4gICAgY29uc3QgaW5pdFNraWxsID0gdGhpcy5kYXRhLml0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gJ3NraWxsJyAmJiBpLmRhdGEuZmxhZ3MuaW5pdGlhdGl2ZSlbMF07XG4gICAgcmV0dXJuIGluaXRTa2lsbC5kYXRhLnRyYWluaW5nIC0gMTtcbiAgfVxuXG4gIGdldCBjYW5SZWZ1c2VJbnRydXNpb24oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLmRhdGE7XG5cbiAgICByZXR1cm4gZGF0YS54cCA+IDA7XG4gIH1cblxuICBnZXQgaXNPdmVyQ3lwaGVyTGltaXQoKSB7XG4gICAgY29uc3QgY3lwaGVycyA9IHRoaXMuZ2V0RW1iZWRkZWRDb2xsZWN0aW9uKFwiT3duZWRJdGVtXCIpLmZpbHRlcihpID0+IGkudHlwZSA9PT0gXCJjeXBoZXJcIik7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5kYXRhLmN5cGhlckxpbWl0IDwgY3lwaGVycy5sZW5ndGg7XG4gIH1cblxuICBnZXRTa2lsbExldmVsKHNraWxsKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBza2lsbC5kYXRhO1xuXG4gICAgcmV0dXJuIGRhdGEudHJhaW5pbmcgLSAxO1xuICB9XG5cbiAgZ2V0RWZmb3J0Q29zdEZyb21TdGF0KHBvb2wsIGVmZm9ydExldmVsKSB7XG4gICAgY29uc3QgdmFsdWUgPSB7XG4gICAgICBjb3N0OiAwLFxuICAgICAgZWZmb3J0TGV2ZWw6IDAsXG4gICAgICB3YXJuaW5nOiBudWxsLFxuICAgIH07XG5cbiAgICBpZiAoZWZmb3J0TGV2ZWwgPT09IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgLy8gVGhlIGZpcnN0IGVmZm9ydCBsZXZlbCBjb3N0cyAzIHB0cyBmcm9tIHRoZSBwb29sLCBleHRyYSBsZXZlbHMgY29zdCAyXG4gICAgLy8gU3Vic3RyYWN0IHRoZSByZWxhdGVkIEVkZ2UsIHRvb1xuICAgIGNvbnN0IGF2YWlsYWJsZUVmZm9ydEZyb21Qb29sID0gKHN0YXQudmFsdWUgKyBzdGF0LmVkZ2UgLSAxKSAvIDI7XG5cbiAgICAvLyBBIFBDIGNhbiB1c2UgYXMgbXVjaCBhcyB0aGVpciBFZmZvcnQgc2NvcmUsIGJ1dCBub3QgbW9yZVxuICAgIC8vIFRoZXkncmUgYWxzbyBsaW1pdGVkIGJ5IHRoZWlyIGN1cnJlbnQgcG9vbCB2YWx1ZVxuICAgIGNvbnN0IGZpbmFsRWZmb3J0ID0gTWF0aC5taW4oZWZmb3J0TGV2ZWwsIGFjdG9yRGF0YS5lZmZvcnQsIGF2YWlsYWJsZUVmZm9ydEZyb21Qb29sKTtcbiAgICBjb25zdCBjb3N0ID0gMSArIDIgKiBmaW5hbEVmZm9ydCAtIHN0YXQuZWRnZTtcblxuICAgIC8vIFRPRE8gdGFrZSBmcmVlIGxldmVscyBvZiBFZmZvcnQgaW50byBhY2NvdW50IGhlcmVcblxuICAgIGxldCB3YXJuaW5nID0gbnVsbDtcbiAgICBpZiAoZWZmb3J0TGV2ZWwgPiBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCkge1xuICAgICAgd2FybmluZyA9IGBOb3QgZW5vdWdoIHBvaW50cyBpbiB5b3VyICR7cG9vbE5hbWV9IHBvb2wgZm9yIHRoYXQgbGV2ZWwgb2YgRWZmb3J0YDtcbiAgICB9XG5cbiAgICB2YWx1ZS5jb3N0ID0gY29zdDtcbiAgICB2YWx1ZS5lZmZvcnRMZXZlbCA9IGZpbmFsRWZmb3J0O1xuICAgIHZhbHVlLndhcm5pbmcgPSB3YXJuaW5nO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgZ2V0RWRnZUZyb21TdGF0KHBvb2wpIHtcbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgcmV0dXJuIHN0YXQuZWRnZTtcbiAgfVxuXG4gIGdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKSB7XG4gICAgY29uc3QgZWRnZSA9IHRoaXMuZ2V0RWRnZUZyb21TdGF0KHBvb2wpO1xuXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKGVkZ2UgLSAxKSAvIDIpO1xuICB9XG5cbiAgY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQsIGFwcGx5RWRnZSA9IHRydWUpIHtcbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWVdO1xuICAgIGNvbnN0IHBvb2xBbW91bnQgPSBzdGF0LnZhbHVlO1xuXG4gICAgcmV0dXJuIChhcHBseUVkZ2UgPyBhbW91bnQgLSBzdGF0LmVkZ2UgOiBhbW91bnQpIDw9IHBvb2xBbW91bnQ7XG4gIH1cblxuICBzcGVuZEZyb21Qb29sKHBvb2wsIGFtb3VudCkge1xuICAgIGlmICghdGhpcy5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIGFtb3VudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgY29uc3QgZGF0YSA9IHt9O1xuICAgIGRhdGFbYGRhdGEuc3RhdHMuJHtwb29sTmFtZS50b0xvd2VyQ2FzZSgpfS52YWx1ZWBdID0gTWF0aC5tYXgoMCwgc3RhdC52YWx1ZSAtIGFtb3VudCk7XG4gICAgdGhpcy51cGRhdGUoZGF0YSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIG9uR01JbnRydXNpb24oYWNjZXB0ZWQpIHtcbiAgICBsZXQgeHAgPSB0aGlzLmRhdGEuZGF0YS54cDtcbiAgICBcbiAgICBsZXQgY2hhdENvbnRlbnQgPSBgPGgyPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW50cnVzaW9uLmNoYXQuaGVhZGluZycpfTwvaDI+PGJyPmA7XG4gICAgaWYgKGFjY2VwdGVkKSB7XG4gICAgICB4cCsrO1xuXG4gICAgICBjaGF0Q29udGVudCArPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnRydXNpb24uY2hhdC5hY2NlcHQnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCB0aGlzLmRhdGEubmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhwLS07XG5cbiAgICAgIGNoYXRDb250ZW50ICs9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5jaGF0LnJlZnVzZScpLnJlcGxhY2UoJyMjQUNUT1IjIycsIHRoaXMuZGF0YS5uYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMuX2lkLFxuICAgICAgJ2RhdGEueHAnOiB4cCxcbiAgICB9KTtcblxuICAgIENoYXRNZXNzYWdlLmNyZWF0ZSh7XG4gICAgICBjb250ZW50OiBjaGF0Q29udGVudFxuICAgIH0pO1xuXG4gICAgaWYgKGFjY2VwdGVkKSB7XG4gICAgICBjb25zdCBvdGhlckFjdG9ycyA9IGdhbWUuYWN0b3JzLmZpbHRlcihhY3RvciA9PiBhY3Rvci5faWQgIT09IHRoaXMuX2lkICYmIGFjdG9yLmRhdGEudHlwZSA9PT0gJ3BjJyk7XG5cbiAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBQbGF5ZXJDaG9pY2VEaWFsb2cob3RoZXJBY3RvcnMsIChjaG9zZW5BY3RvcklkKSA9PiB7XG4gICAgICAgIGdhbWUuc29ja2V0LmVtaXQoJ3N5c3RlbS5jeXBoZXJzeXN0ZW0nLCB7XG4gICAgICAgICAgdHlwZTogJ2F3YXJkWFAnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFjdG9ySWQ6IGNob3NlbkFjdG9ySWQsXG4gICAgICAgICAgICB4cEFtb3VudDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgICAgZGlhbG9nLnJlbmRlcih0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG92ZXJyaWRlXG4gICAqL1xuICBhc3luYyBjcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKSB7XG4gICAgY29uc3QgW18sIGRhdGFdID0gYXJncztcblxuICAgIC8vIFJvbGwgdGhlIFwibGV2ZWwgZGllXCIgdG8gZGV0ZXJtaW5lIHRoZSBpdGVtJ3MgbGV2ZWwsIGlmIHBvc3NpYmxlXG4gICAgaWYgKGRhdGEuZGF0YSAmJiBDU1IuaGFzTGV2ZWxEaWUuaW5jbHVkZXMoZGF0YS50eXBlKSkge1xuICAgICAgY29uc3QgaXRlbURhdGEgPSBkYXRhLmRhdGE7XG5cbiAgICAgIGlmICghaXRlbURhdGEubGV2ZWwgJiYgaXRlbURhdGEubGV2ZWxEaWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBTZWUgaWYgdGhlIGZvcm11bGEgaXMgdmFsaWRcbiAgICAgICAgICBpdGVtRGF0YS5sZXZlbCA9IG5ldyBSb2xsKGl0ZW1EYXRhLmxldmVsRGllKS5yb2xsKCkudG90YWw7XG4gICAgICAgICAgYXdhaXQgdGhpcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiB0aGlzLl9pZCxcbiAgICAgICAgICAgIFwiZGF0YS5sZXZlbFwiOiBpdGVtRGF0YS5sZXZlbCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIElmIG5vdCwgZmFsbGJhY2sgdG8gc2FuZSBkZWZhdWx0XG4gICAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBpdGVtRGF0YS5sZXZlbCB8fCBudWxsO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtRGF0YS5sZXZlbCA9IGl0ZW1EYXRhLmxldmVsIHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUVtYmVkZGVkRW50aXR5KC4uLmFyZ3MpO1xuICB9XG59XG4iLCJpbXBvcnQgeyByb2xsVGV4dCB9IGZyb20gJy4vcm9sbHMuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hhdE1lc3NhZ2UoY2hhdE1lc3NhZ2UsIGh0bWwsIGRhdGEpIHtcbiAgLy8gRG9uJ3QgYXBwbHkgQ2hhdE1lc3NhZ2UgZW5oYW5jZW1lbnQgdG8gcmVjb3Zlcnkgcm9sbHNcbiAgaWYgKGNoYXRNZXNzYWdlLnJvbGwgJiYgIWNoYXRNZXNzYWdlLnJvbGwuZGljZVswXS5vcHRpb25zLnJlY292ZXJ5KSB7XG4gICAgY29uc3QgZGllUm9sbCA9IGNoYXRNZXNzYWdlLnJvbGwuZGljZVswXS5yb2xsc1swXS5yb2xsO1xuICAgIGNvbnN0IHJvbGxUb3RhbCA9IGNoYXRNZXNzYWdlLnJvbGwudG90YWw7XG4gICAgY29uc3QgbWVzc2FnZXMgPSByb2xsVGV4dChkaWVSb2xsLCByb2xsVG90YWwpO1xuICAgIGNvbnN0IG51bU1lc3NhZ2VzID0gbWVzc2FnZXMubGVuZ3RoO1xuXG4gICAgY29uc3QgbWVzc2FnZUNvbnRhaW5lciA9ICQoJzxkaXYvPicpO1xuICAgIG1lc3NhZ2VDb250YWluZXIuYWRkQ2xhc3MoJ3NwZWNpYWwtbWVzc2FnZXMnKTtcblxuICAgIG1lc3NhZ2VzLmZvckVhY2goKHNwZWNpYWwsIGlkeCkgPT4ge1xuICAgICAgY29uc3QgeyB0ZXh0LCBjb2xvciwgY2xzIH0gPSBzcGVjaWFsO1xuXG4gICAgICBjb25zdCBuZXdDb250ZW50ID0gYDxzcGFuIGNsYXNzPVwiJHtjbHN9XCIgc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj4ke3RleHR9PC9zcGFuPiR7aWR4IDwgbnVtTWVzc2FnZXMgLSAxID8gJzxiciAvPicgOiAnJ31gO1xuXG4gICAgICBtZXNzYWdlQ29udGFpbmVyLmFwcGVuZChuZXdDb250ZW50KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGR0ID0gaHRtbC5maW5kKFwiLmRpY2UtdG90YWxcIik7XG4gICAgbWVzc2FnZUNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZHQpO1xuICB9XG59XG4iLCIvKipcbiAqIFJvbGwgaW5pdGlhdGl2ZSBmb3Igb25lIG9yIG11bHRpcGxlIENvbWJhdGFudHMgd2l0aGluIHRoZSBDb21iYXQgZW50aXR5XG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gaWRzICAgICAgICBBIENvbWJhdGFudCBpZCBvciBBcnJheSBvZiBpZHMgZm9yIHdoaWNoIHRvIHJvbGxcbiAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGZvcm11bGEgICAgIEEgbm9uLWRlZmF1bHQgaW5pdGlhdGl2ZSBmb3JtdWxhIHRvIHJvbGwuIE90aGVyd2lzZSB0aGUgc3lzdGVtIGRlZmF1bHQgaXMgdXNlZC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlT3B0aW9ucyAgIEFkZGl0aW9uYWwgb3B0aW9ucyB3aXRoIHdoaWNoIHRvIGN1c3RvbWl6ZSBjcmVhdGVkIENoYXQgTWVzc2FnZXNcbiAqIEByZXR1cm4ge1Byb21pc2UuPENvbWJhdD59ICAgICAgIEEgcHJvbWlzZSB3aGljaCByZXNvbHZlcyB0byB0aGUgdXBkYXRlZCBDb21iYXQgZW50aXR5IG9uY2UgdXBkYXRlcyBhcmUgY29tcGxldGUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByb2xsSW5pdGlhdGl2ZShpZHMsIGZvcm11bGEgPSBudWxsLCBtZXNzYWdlT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IGNvbWJhdGFudFVwZGF0ZXMgPSBbXTtcbiAgY29uc3QgbWVzc2FnZXMgPSBbXVxuXG4gIC8vIEZvcmNlIGlkcyB0byBiZSBhbiBhcnJheSBzbyBvdXIgZm9yIGxvb3AgZG9lc24ndCBicmVha1xuICBpZHMgPSB0eXBlb2YgaWRzID09PSAnc3RyaW5nJyA/IFtpZHNdIDogaWRzO1xuICBmb3IgKGxldCBpZCBvZiBpZHMpIHtcbiAgICBjb25zdCBjb21iYXRhbnQgPSBhd2FpdCB0aGlzLmdldENvbWJhdGFudChpZCk7XG4gICAgaWYgKGNvbWJhdGFudC5kZWZlYXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgYWN0b3IgfSA9IGNvbWJhdGFudDtcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhO1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gYWN0b3JEYXRhO1xuXG4gICAgbGV0IGluaXRpYXRpdmU7XG4gICAgbGV0IHJvbGxSZXN1bHQ7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAvLyBQQ3MgdXNlIGEgc2ltcGxlIGQyMCByb2xsIG1vZGlmaWVkIGJ5IGFueSB0cmFpbmluZyBpbiBhbiBJbml0aWF0aXZlIHNraWxsXG4gICAgICBjYXNlICdwYyc6XG4gICAgICAgIGNvbnN0IGluaXRCb251cyA9IGFjdG9yLmluaXRpYXRpdmVMZXZlbDtcbiAgICAgICAgY29uc3Qgb3BlcmF0b3IgPSBpbml0Qm9udXMgPCAwID8gJy0nIDogJysnO1xuICAgICAgICBjb25zdCByb2xsRm9ybXVsYSA9ICcxZDIwJyArIChpbml0Qm9udXMgPT09IDAgPyAnJyA6IGAke29wZXJhdG9yfSR7MypNYXRoLmFicyhpbml0Qm9udXMpfWApO1xuXG4gICAgICAgIGNvbnN0IHJvbGwgPSBuZXcgUm9sbChyb2xsRm9ybXVsYSkucm9sbCgpO1xuICAgICAgICBpbml0aWF0aXZlID0gTWF0aC5tYXgocm9sbC50b3RhbCwgMCk7IC8vIERvbid0IGxldCBpbml0aWF0aXZlIGdvIGJlbG93IDBcbiAgICAgICAgcm9sbFJlc3VsdCA9IHJvbGwucmVzdWx0O1xuICAgICAgICBcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIE5QQ3MgaGF2ZSBhIGZpeGVkIGluaXRpYXRpdmUgYmFzZWQgb24gdGhlaXIgbGV2ZWxcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIGNvbnN0IHsgbGV2ZWwgfSA9IGFjdG9yRGF0YS5kYXRhO1xuICAgICAgICBpbml0aWF0aXZlID0gMyAqIGxldmVsO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb21iYXRhbnRVcGRhdGVzLnB1c2goe1xuICAgICAgX2lkOiBjb21iYXRhbnQuX2lkLFxuICAgICAgaW5pdGlhdGl2ZVxuICAgIH0pO1xuXG4gICAgLy8gU2luY2UgTlBDIGluaXRpYXRpdmUgaXMgZml4ZWQsIGRvbid0IGJvdGhlciBzaG93aW5nIGl0IGluIGNoYXRcbiAgICBpZiAodHlwZSA9PT0gJ3BjJykge1xuICAgICAgY29uc3QgeyB0b2tlbiB9ID0gY29tYmF0YW50O1xuICAgICAgY29uc3QgaXNIaWRkZW4gPSB0b2tlbi5oaWRkZW4gfHwgY29tYmF0YW50LmhpZGRlbjtcbiAgICAgIGNvbnN0IHdoaXNwZXIgPSBpc0hpZGRlbiA/IGdhbWUudXNlcnMuZW50aXRpZXMuZmlsdGVyKHUgPT4gdS5pc0dNKSA6ICcnO1xuXG4gICAgICAvLyBUT0RPOiBJbXByb3ZlIHRoZSBjaGF0IG1lc3NhZ2UsIHRoaXMgY3VycmVudGx5XG4gICAgICAvLyBqdXN0IHJlcGxpY2F0ZXMgdGhlIG5vcm1hbCByb2xsIG1lc3NhZ2UuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImRpY2Utcm9sbFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXJlc3VsdFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpY2UtZm9ybXVsYVwiPiR7cm9sbFJlc3VsdH08L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXRvb2x0aXBcIj5cbiAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ0b29sdGlwLXBhcnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZVwiPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJwYXJ0LWZvcm11bGFcIj5cbiAgICAgICAgICAgICAgICAgICAgMWQyMFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBhcnQtdG90YWxcIj4ke2luaXRpYXRpdmV9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgICAgICA8b2wgY2xhc3M9XCJkaWNlLXJvbGxzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInJvbGwgZGllIGQyMFwiPiR7aW5pdGlhdGl2ZX08L2xpPlxuICAgICAgICAgICAgICAgICAgPC9vbD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS10b3RhbFwiPiR7aW5pdGlhdGl2ZX08L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0gbWVyZ2VPYmplY3Qoe1xuICAgICAgICBzcGVha2VyOiB7XG4gICAgICAgICAgc2NlbmU6IGNhbnZhcy5zY2VuZS5faWQsXG4gICAgICAgICAgYWN0b3I6IGFjdG9yID8gYWN0b3IuX2lkIDogbnVsbCxcbiAgICAgICAgICB0b2tlbjogdG9rZW4uX2lkLFxuICAgICAgICAgIGFsaWFzOiB0b2tlbi5uYW1lLFxuICAgICAgICB9LFxuICAgICAgICB3aGlzcGVyLFxuICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmluaXRpYXRpdmUuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgdG9rZW4ubmFtZSksXG4gICAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlLFxuICAgICAgfSwgbWVzc2FnZU9wdGlvbnMpO1xuXG4gICAgICBtZXNzYWdlcy5wdXNoKG1lc3NhZ2VEYXRhKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbWJhdGFudFVwZGF0ZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgYXdhaXQgdGhpcy51cGRhdGVFbWJlZGRlZEVudGl0eSgnQ29tYmF0YW50JywgY29tYmF0YW50VXBkYXRlcyk7XG5cbiAgQ2hhdE1lc3NhZ2UuY3JlYXRlKG1lc3NhZ2VzKTtcblxuICByZXR1cm4gdGhpcztcbn1cbiIsImV4cG9ydCBjb25zdCBDU1IgPSB7fTtcblxuQ1NSLml0ZW1UeXBlcyA9IFtcbiAgJ3NraWxscycsXG4gICdhYmlsaXRpZXMnLFxuICAnY3lwaGVycycsXG4gICdhcnRpZmFjdHMnLFxuICAnb2RkaXRpZXMnLFxuICAnd2VhcG9ucycsXG4gICdhcm1vcicsXG4gICdnZWFyJ1xuXTtcblxuQ1NSLmludmVudG9yeVR5cGVzID0gW1xuICAnd2VhcG9uJyxcbiAgJ2FybW9yJyxcbiAgJ2dlYXInLFxuXG4gICdjeXBoZXInLFxuICAnYXJ0aWZhY3QnLFxuICAnb2RkaXR5J1xuXTtcblxuQ1NSLndlaWdodENsYXNzZXMgPSBbXG4gICdsaWdodCcsXG4gICdtZWRpdW0nLFxuICAnaGVhdnknXG5dO1xuXG5DU1Iud2VhcG9uVHlwZXMgPSBbXG4gICdiYXNoaW5nJyxcbiAgJ2JsYWRlZCcsXG4gICdyYW5nZWQnLFxuXVxuXG5DU1Iuc3RhdHMgPSBbXG4gICdtaWdodCcsXG4gICdzcGVlZCcsXG4gICdpbnRlbGxlY3QnLFxuXTtcblxuQ1NSLnRyYWluaW5nTGV2ZWxzID0gW1xuICAnaW5hYmlsaXR5JyxcbiAgJ3VudHJhaW5lZCcsXG4gICd0cmFpbmVkJyxcbiAgJ3NwZWNpYWxpemVkJ1xuXTtcblxuQ1NSLmRhbWFnZVRyYWNrID0gW1xuICAnaGFsZScsXG4gICdpbXBhaXJlZCcsXG4gICdkZWJpbGl0YXRlZCcsXG4gICdkZWFkJ1xuXTtcblxuQ1NSLnJlY292ZXJpZXMgPSBbXG4gICdhY3Rpb24nLFxuICAndGVuTWlucycsXG4gICdvbmVIb3VyJyxcbiAgJ3RlbkhvdXJzJ1xuXTtcblxuQ1NSLmFkdmFuY2VzID0gW1xuICAnc3RhdHMnLFxuICAnZWRnZScsXG4gICdlZmZvcnQnLFxuICAnc2tpbGxzJyxcbiAgJ290aGVyJ1xuXTtcblxuQ1NSLnJhbmdlcyA9IFtcbiAgJ2ltbWVkaWF0ZScsXG4gICdzaG9ydCcsXG4gICdsb25nJyxcbiAgJ3ZlcnlMb25nJ1xuXTtcblxuQ1NSLm9wdGlvbmFsUmFuZ2VzID0gW1wibmFcIl0uY29uY2F0KENTUi5yYW5nZXMpO1xuXG5DU1IuYWJpbGl0eVR5cGVzID0gW1xuICAnYWN0aW9uJyxcbiAgJ2VuYWJsZXInLFxuXTtcblxuQ1NSLnN1cHBvcnRzTWFjcm9zID0gW1xuICAnc2tpbGwnLFxuICAnYWJpbGl0eSdcbl07XG5cbkNTUi5oYXNMZXZlbERpZSA9IFtcbiAgJ2N5cGhlcicsXG4gICdhcnRpZmFjdCdcbl07XG4iLCIvKiBnbG9iYWxzIEVOVElUWV9QRVJNSVNTSU9OUyAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0b3JEaXJlY3RvcnlDb250ZXh0KGh0bWwsIGVudHJ5T3B0aW9ucykge1xuICBlbnRyeU9wdGlvbnMucHVzaCh7XG4gICAgbmFtZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpLFxuICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1leGNsYW1hdGlvbi1jaXJjbGVcIj48L2k+JyxcblxuICAgIGNhbGxiYWNrOiBsaSA9PiB7XG4gICAgICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmdldChsaS5kYXRhKCdlbnRpdHlJZCcpKTtcbiAgICAgIGNvbnN0IG93bmVySWRzID0gT2JqZWN0LmVudHJpZXMoYWN0b3IuZGF0YS5wZXJtaXNzaW9uKVxuICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IHtcbiAgICAgICAgICBjb25zdCBbaWQsIHBlcm1pc3Npb25MZXZlbF0gPSBlbnRyeTtcbiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbkxldmVsID49IEVOVElUWV9QRVJNSVNTSU9OUy5PV05FUiAmJiBpZCAhPT0gZ2FtZS51c2VyLmlkO1xuICAgICAgICB9KVxuICAgICAgICAubWFwKHVzZXJzUGVybWlzc2lvbnMgPT4gdXNlcnNQZXJtaXNzaW9uc1swXSk7XG5cbiAgICAgIGdhbWUuc29ja2V0LmVtaXQoJ3N5c3RlbS5jeXBoZXJzeXN0ZW0nLCB7XG4gICAgICAgIHR5cGU6ICdnbUludHJ1c2lvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB1c2VySWRzOiBvd25lcklkcyxcbiAgICAgICAgICBhY3RvcklkOiBhY3Rvci5kYXRhLl9pZCxcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5jdHh0LmludHJ1c2lvbi5oZWFkaW5nJyk7XG4gICAgICBjb25zdCBib2R5ID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLmRhdGEubmFtZSk7XG5cbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZSh7XG4gICAgICAgIGNvbnRlbnQ6IGA8aDI+JHtoZWFkaW5nfTwvaDI+PGJyLz4ke2JvZHl9YCxcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjb25kaXRpb246IGxpID0+IHtcbiAgICAgIGlmICghZ2FtZS51c2VyLmlzR00pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmdldChsaS5kYXRhKCdlbnRpdHlJZCcpKTtcbiAgICAgIHJldHVybiBhY3RvciAmJiBhY3Rvci5kYXRhLnR5cGUgPT09ICdwYyc7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIGdsb2JhbCBDb21iYXQgKi9cblxuLy8gSW1wb3J0IE1vZHVsZXNcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yIH0gZnJvbSBcIi4vYWN0b3IvYWN0b3IuanNcIjtcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yU2hlZXQgfSBmcm9tIFwiLi9hY3Rvci9hY3Rvci1zaGVldC5qc1wiO1xuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtSXRlbSB9IGZyb20gXCIuL2l0ZW0vaXRlbS5qc1wiO1xuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IH0gZnJvbSBcIi4vaXRlbS9pdGVtLXNoZWV0LmpzXCI7XG5cbmltcG9ydCB7IHJlZ2lzdGVySGFuZGxlYmFySGVscGVycyB9IGZyb20gJy4vaGFuZGxlYmFycy1oZWxwZXJzLmpzJztcbmltcG9ydCB7IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzIH0gZnJvbSAnLi90ZW1wbGF0ZS5qcyc7XG5cbmltcG9ydCB7IHJlZ2lzdGVyU3lzdGVtU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzLmpzJztcbmltcG9ydCB7IHJlbmRlckNoYXRNZXNzYWdlIH0gZnJvbSAnLi9jaGF0LmpzJztcbmltcG9ydCB7IGFjdG9yRGlyZWN0b3J5Q29udGV4dCB9IGZyb20gJy4vY29udGV4dC1tZW51LmpzJztcbmltcG9ydCB7IG1pZ3JhdGUgfSBmcm9tICcuL21pZ3JhdGlvbnMvbWlncmF0ZSc7XG5pbXBvcnQgeyBjc3JTb2NrZXRMaXN0ZW5lcnMgfSBmcm9tICcuL3NvY2tldC5qcyc7XG5pbXBvcnQgeyByb2xsSW5pdGlhdGl2ZSB9IGZyb20gJy4vY29tYmF0LmpzJztcbmltcG9ydCB7IHVzZVBvb2xNYWNybywgdXNlU2tpbGxNYWNybywgdXNlQWJpbGl0eU1hY3JvLCB1c2VDeXBoZXJNYWNybywgY3JlYXRlQ3lwaGVyTWFjcm8gfSBmcm9tICcuL21hY3Jvcy5qcyc7XG5cbkhvb2tzLm9uY2UoJ2luaXQnLCBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGdhbWUuY3lwaGVyc3lzdGVtID0ge1xuICAgIEN5cGhlclN5c3RlbUFjdG9yLFxuICAgIEN5cGhlclN5c3RlbUl0ZW0sXG5cbiAgICBtYWNybzoge1xuICAgICAgdXNlUG9vbDogdXNlUG9vbE1hY3JvLFxuICAgICAgdXNlU2tpbGw6IHVzZVNraWxsTWFjcm8sXG4gICAgICB1c2VBYmlsaXR5OiB1c2VBYmlsaXR5TWFjcm8sXG4gICAgICB1c2VDeXBoZXI6IHVzZUN5cGhlck1hY3JvXG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgYW4gaW5pdGlhdGl2ZSBmb3JtdWxhIGZvciB0aGUgc3lzdGVtXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBDb21iYXQucHJvdG90eXBlLnJvbGxJbml0aWF0aXZlID0gcm9sbEluaXRpYXRpdmU7XG5cbiAgLy8gRGVmaW5lIGN1c3RvbSBFbnRpdHkgY2xhc3Nlc1xuICBDT05GSUcuQWN0b3IuZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1BY3RvcjtcbiAgQ09ORklHLkl0ZW0uZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1JdGVtO1xuXG4gIC8vIFJlZ2lzdGVyIHNoZWV0IGFwcGxpY2F0aW9uIGNsYXNzZXNcbiAgQWN0b3JzLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEFjdG9yU2hlZXQpO1xuICAvLyBUT0RPOiBTZXBhcmF0ZSBjbGFzc2VzIHBlciB0eXBlXG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW0nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsncGMnXSxcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcbiAgfSk7XG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW0nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsnbnBjJ10sXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXG4gIH0pO1xuXG4gIEl0ZW1zLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEl0ZW1TaGVldCk7XG4gIEl0ZW1zLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbScsIEN5cGhlclN5c3RlbUl0ZW1TaGVldCwgeyBtYWtlRGVmYXVsdDogdHJ1ZSB9KTtcblxuICByZWdpc3RlclN5c3RlbVNldHRpbmdzKCk7XG4gIHJlZ2lzdGVySGFuZGxlYmFySGVscGVycygpO1xuICBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcygpO1xufSk7XG5cbkhvb2tzLm9uKCdyZW5kZXJDaGF0TWVzc2FnZScsIHJlbmRlckNoYXRNZXNzYWdlKTtcblxuSG9va3Mub24oJ2dldEFjdG9yRGlyZWN0b3J5RW50cnlDb250ZXh0JywgYWN0b3JEaXJlY3RvcnlDb250ZXh0KTtcblxuLy8gSG9va3Mub24oJ2NyZWF0ZUFjdG9yJywgYXN5bmMgZnVuY3Rpb24oYWN0b3IsIG9wdGlvbnMsIHVzZXJJZCkge1xuSG9va3Mub24oJ2NyZWF0ZUFjdG9yJywgYXN5bmMgZnVuY3Rpb24oYWN0b3IpIHtcbiAgY29uc3QgeyB0eXBlIH0gPSBhY3Rvci5kYXRhO1xuICBpZiAodHlwZSA9PT0gJ3BjJykge1xuICAgIC8vIEdpdmUgUENzIHRoZSBcIkluaXRpYXRpdmVcIiBza2lsbCBieSBkZWZhdWx0LCBhcyBpdCB3aWxsIGJlIHVzZWRcbiAgICAvLyBieSB0aGUgaW50aWF0aXZlIGZvcm11bGEgaW4gY29tYmF0LlxuICAgIGFjdG9yLmNyZWF0ZU93bmVkSXRlbSh7XG4gICAgICBuYW1lOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5za2lsbC5pbml0aWF0aXZlJyksXG4gICAgICB0eXBlOiAnc2tpbGwnLFxuICAgICAgZGF0YTogbmV3IEN5cGhlclN5c3RlbUl0ZW0oe1xuICAgICAgICAncG9vbCc6IDEsIC8vIFNwZWVkXG4gICAgICAgICd0cmFpbmluZyc6IDEsIC8vIFVudHJhaW5lZFxuXG4gICAgICAgICdmbGFncy5pbml0aWF0aXZlJzogdHJ1ZVxuICAgICAgfSksXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Ib29rcy5vbmNlKCdyZWFkeScsIG1pZ3JhdGUpO1xuSG9va3Mub25jZSgncmVhZHknLCBjc3JTb2NrZXRMaXN0ZW5lcnMpO1xuLy8gUmVnaXN0ZXIgaG9va3Ncbkhvb2tzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICBIb29rcy5vbignaG90YmFyRHJvcCcsIChfLCBkYXRhLCBzbG90KSA9PiBjcmVhdGVDeXBoZXJNYWNybyhkYXRhLCBzbG90KSk7XG59KTtcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXG5cbi8qKlxuICogUHJvbXB0cyB0aGUgdXNlciB3aXRoIGEgY2hvaWNlIG9mIGEgR00gSW50cnVzaW9uLlxuICogXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgR01JbnRydXNpb25EaWFsb2dcbiAqIEBleHRlbmRzIHtEaWFsb2d9XG4gKi9cbmV4cG9ydCBjbGFzcyBHTUludHJ1c2lvbkRpYWxvZyBleHRlbmRzIERpYWxvZyB7XG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIHRlbXBsYXRlOiBcInRlbXBsYXRlcy9odWQvZGlhbG9nLmh0bWxcIixcbiAgICAgIGNsYXNzZXM6IFtcImNzclwiLCBcImRpYWxvZ1wiXSxcbiAgICAgIHdpZHRoOiA1MDBcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhY2NlcHRRdWVzdGlvbiA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24uZG9Zb3VBY2NlcHQnKTtcbiAgICBjb25zdCBhY2NlcHRJbnN0cnVjdGlvbnMgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLmFjY2VwdEluc3RydWN0aW9ucycpXG4gICAgICAucmVwbGFjZSgnIyNBQ0NFUFQjIycsIGA8c3BhbiBzdHlsZT1cImNvbG9yOiBncmVlblwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuYWNjZXB0Jyl9PC9zcGFuPmApO1xuICAgIGNvbnN0IHJlZnVzZUluc3RydWN0aW9ucyA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24ucmVmdXNlSW5zdHJ1Y3Rpb25zJylcbiAgICAgIC5yZXBsYWNlKCcjI1JFRlVTRSMjJywgYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucmVmdXNlJyl9PC9zcGFuPmApO1xuXG4gICAgbGV0IGRpYWxvZ0NvbnRlbnQgPSBgXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICA8cD4ke2FjY2VwdFF1ZXN0aW9ufTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNlwiPlxuICAgICAgICA8cD4ke2FjY2VwdEluc3RydWN0aW9uc308L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNlwiPlxuICAgICAgICA8cD4ke3JlZnVzZUluc3RydWN0aW9uc308L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8aHIgLz5gO1xuXG4gICAgbGV0IGRpYWxvZ0J1dHRvbnMgPSB7XG4gICAgICBvazoge1xuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIiBzdHlsZT1cImNvbG9yOiBncmVlblwiPjwvaT4nLFxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmJ1dHRvbi5hY2NlcHQnKSxcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBhY3Rvci5vbkdNSW50cnVzaW9uKHRydWUpO1xuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjYW5jZWw6IHtcbiAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCIgc3R5bGU9XCJjb2xvcjogcmVkXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLnJlZnVzZScpLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IGFjdG9yLm9uR01JbnRydXNpb24oZmFsc2UpO1xuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFhY3Rvci5jYW5SZWZ1c2VJbnRydXNpb24pIHtcbiAgICAgIGNvbnN0IG5vdEVub3VnaFhQID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi5ub3RFbm91Z2hYUCcpO1xuXG4gICAgICBkaWFsb2dDb250ZW50ICs9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgIDxwPjxzdHJvbmc+JHtub3RFbm91Z2hYUH08L3N0cm9uZz48L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8aHIgLz5gXG5cbiAgICAgIGRlbGV0ZSBkaWFsb2dCdXR0b25zLmNhbmNlbDtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFsb2dEYXRhID0ge1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24udGl0bGUnKSxcbiAgICAgIGNvbnRlbnQ6IGRpYWxvZ0NvbnRlbnQsXG4gICAgICBidXR0b25zOiBkaWFsb2dCdXR0b25zLFxuICAgICAgZGVmYXVsdFllczogZmFsc2UsXG4gICAgfTtcblxuICAgIHN1cGVyKGRpYWxvZ0RhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hY3RvciA9IGFjdG9yO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBfZ2V0SGVhZGVyQnV0dG9ucygpIHtcbiAgICAvLyBEb24ndCBpbmNsdWRlIGFueSBoZWFkZXIgYnV0dG9ucywgZm9yY2UgYW4gb3B0aW9uIHRvIGJlIGNob3NlblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgY2xvc2UoKSB7XG4gICAgLy8gUHJldmVudCBkZWZhdWx0IGNsb3NpbmcgYmVoYXZpb3JcbiAgfVxufSBcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXG5cbi8qKlxuICogQWxsb3dzIHRoZSB1c2VyIHRvIGNob29zZSBvbmUgb2YgdGhlIG90aGVyIHBsYXllciBjaGFyYWN0ZXJzLlxuICogXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nXG4gKiBAZXh0ZW5kcyB7RGlhbG9nfVxuICovXG5leHBvcnQgY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICAvKiogQG92ZXJyaWRlICovXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XG4gICAgICB0ZW1wbGF0ZTogXCJ0ZW1wbGF0ZXMvaHVkL2RpYWxvZy5odG1sXCIsXG4gICAgICBjbGFzc2VzOiBbXCJjc3JcIiwgXCJkaWFsb2dcIiwgXCJwbGF5ZXItY2hvaWNlXCJdLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTc1XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhY3RvcnMsIG9uQWNjZXB0Rm4sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRpYWxvZ1NlbGVjdE9wdGlvbnMgPSBbXTtcbiAgICBhY3RvcnMuZm9yRWFjaChhY3RvciA9PiB7XG4gICAgICBkaWFsb2dTZWxlY3RPcHRpb25zLnB1c2goYDxvcHRpb24gdmFsdWU9XCIke2FjdG9yLl9pZH1cIj4ke2FjdG9yLm5hbWV9PC9vcHRpb24+YClcbiAgICB9KTtcblxuICAgIGNvbnN0IGRpYWxvZ1RleHQgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLmNvbnRlbnQnKTtcbiAgICBjb25zdCBkaWFsb2dDb250ZW50ID0gYFxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgPHA+JHtkaWFsb2dUZXh0fTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgPHNlbGVjdCBuYW1lPVwicGxheWVyXCI+XG4gICAgICAgICAgJHtkaWFsb2dTZWxlY3RPcHRpb25zLmpvaW4oJ1xcbicpfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPmA7XG5cbiAgICBjb25zdCBkaWFsb2dCdXR0b25zID0ge1xuICAgICAgb2s6IHtcbiAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLmFjY2VwdCcpLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdG9ySWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNob2ljZSBzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnZhbHVlO1xuXG4gICAgICAgICAgb25BY2NlcHRGbihhY3RvcklkKTtcblxuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZGlhbG9nRGF0YSA9IHtcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLnRpdGxlJyksXG4gICAgICBjb250ZW50OiBkaWFsb2dDb250ZW50LFxuICAgICAgYnV0dG9uczogZGlhbG9nQnV0dG9ucyxcbiAgICAgIGRlZmF1bHRZZXM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBzdXBlcihkaWFsb2dEYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYWN0b3JzID0gYWN0b3JzO1xuICB9XG5cbiAgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuXG4gICAgZGF0YS5hY3RvcnMgPSB0aGlzLmFjdG9ycztcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgLy8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIF9nZXRIZWFkZXJCdXR0b25zKCkge1xuICAgIC8vIERvbid0IGluY2x1ZGUgYW55IGhlYWRlciBidXR0b25zLCBmb3JjZSBhbiBvcHRpb24gdG8gYmUgY2hvc2VuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBjbG9zZSgpIHtcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgY2xvc2luZyBiZWhhdmlvclxuICB9XG59IFxuIiwiLyogZ2xvYmFscyBEaWFsb2cgKi9cblxuZXhwb3J0IGNsYXNzIFJvbGxEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuICBjb25zdHJ1Y3RvcihkaWFsb2dEYXRhLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwicm9sbE1vZGVcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzVweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IEVudW1Qb29sID0gW1xuICBcIk1pZ2h0XCIsXG4gIFwiU3BlZWRcIixcbiAgXCJJbnRlbGxlY3RcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVBvb2w7XG4iLCJjb25zdCBFbnVtUmFuZ2UgPSBbXG4gIFwiSW1tZWRpYXRlXCIsXG4gIFwiU2hvcnRcIixcbiAgXCJMb25nXCIsXG4gIFwiVmVyeSBMb25nXCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1SYW5nZTtcbiIsImNvbnN0IEVudW1UcmFpbmluZyA9IFtcbiAgXCJJbmFiaWxpdHlcIixcbiAgXCJVbnRyYWluZWRcIixcbiAgXCJUcmFpbmVkXCIsXG4gIFwiU3BlY2lhbGl6ZWRcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVRyYWluaW5nO1xuIiwiY29uc3QgRW51bVdlYXBvbkNhdGVnb3J5ID0gW1xuICBcIkJhc2hpbmdcIixcbiAgXCJCbGFkZWRcIixcbiAgXCJSYW5nZWRcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVdlYXBvbkNhdGVnb3J5O1xuIiwiY29uc3QgRW51bVdlaWdodCA9IFtcbiAgXCJMaWdodFwiLFxuICBcIk1lZGl1bVwiLFxuICBcIkhlYXZ5XCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1XZWlnaHQ7XG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzID0gKCkgPT4ge1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0b0xvd2VyQ2FzZScsIHN0ciA9PiBzdHIudG9Mb3dlckNhc2UoKSk7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvVXBwZXJDYXNlJywgdGV4dCA9PiB0ZXh0LnRvVXBwZXJDYXNlKCkpO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2VxJywgKHYxLCB2MikgPT4gdjEgPT09IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbmVxJywgKHYxLCB2MikgPT4gdjEgIT09IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignb3InLCAodjEsIHYyKSA9PiB2MSB8fCB2Mik7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Rlcm5hcnknLCAoY29uZCwgdjEsIHYyKSA9PiBjb25kID8gdjEgOiB2Mik7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2NvbmNhdCcsICh2MSwgdjIpID0+IGAke3YxfSR7djJ9YCk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc3RyT3JTcGFjZScsIHZhbCA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gKHZhbCAmJiAhIXZhbC5sZW5ndGgpID8gdmFsIDogJyZuYnNwOyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndHJhaW5pbmdJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5pbmFiaWxpdHknKX1cIj5bSV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudW50cmFpbmVkJyl9XCI+W1VdPC9zcGFuPmA7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLnRyYWluZWQnKX1cIj5bVF08L3NwYW4+YDtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcuc3BlY2lhbGl6ZWQnKX1cIj5bU108L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Bvb2xJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLm1pZ2h0Jyl9XCI+W01dPC9zcGFuPmA7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wuc3BlZWQnKX1cIj5bU108L3NwYW4+YDtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5pbnRlbGxlY3QnKX1cIj5bSV08L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3R5cGVJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgLy8gVE9ETzogQWRkIHNraWxsIGFuZCBhYmlsaXR5P1xuICAgICAgXG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPlthXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LndlYXBvbicpfVwiPlt3XTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnZ2Vhcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5nZWFyJyl9XCI+W2ddPC9zcGFuPmA7XG4gICAgICBcbiAgICAgIGNhc2UgJ2N5cGhlcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5jeXBoZXInKX1cIj5bQ108L3NwYW4+YDtcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W0FdPC9zcGFuPmA7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bT108L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xufTtcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgKi9cblxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW1TaGVldCB3aXRoIHNvbWUgdmVyeSBzaW1wbGUgbW9kaWZpY2F0aW9uc1xuICogQGV4dGVuZHMge0l0ZW1TaGVldH1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW1TaGVldCBleHRlbmRzIEl0ZW1TaGVldCB7XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xuICAgICAgY2xhc3NlczogW1wiY3lwaGVyc3lzdGVtXCIsIFwic2hlZXRcIiwgXCJpdGVtXCJdLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMjAwXG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCBwYXRoID0gXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbVwiO1xuICAgIHJldHVybiBgJHtwYXRofS8ke3RoaXMuaXRlbS5kYXRhLnR5cGV9LXNoZWV0Lmh0bWxgO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfc2tpbGxEYXRhKGRhdGEpIHtcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEudHJhaW5pbmdMZXZlbHMgPSBDU1IudHJhaW5pbmdMZXZlbHM7XG4gIH1cblxuICBfYWJpbGl0eURhdGEoZGF0YSkge1xuICAgIGRhdGEucmFuZ2VzID0gQ1NSLm9wdGlvbmFsUmFuZ2VzO1xuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XG4gIH1cblxuICBfYXJtb3JEYXRhKGRhdGEpIHtcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcbiAgfVxuXG4gIF93ZWFwb25EYXRhKGRhdGEpIHtcbiAgICBkYXRhLnJhbmdlcyA9IENTUi5yYW5nZXM7XG4gICAgZGF0YS53ZWFwb25UeXBlcyA9IENTUi53ZWFwb25UeXBlcztcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcbiAgfVxuXG4gIF9nZWFyRGF0YShkYXRhKSB7XG4gIH1cblxuICBfY3lwaGVyRGF0YShkYXRhKSB7XG4gICAgZGF0YS5pc0dNID0gZ2FtZS51c2VyLmlzR007XG4gIH1cblxuICBfYXJ0aWZhY3REYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIF9vZGRpdHlEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuXG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLml0ZW0uZGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9hYmlsaXR5RGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX2FybW9yRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICB0aGlzLl93ZWFwb25EYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9nZWFyRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9jeXBoZXJEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgdGhpcy5fYXJ0aWZhY3REYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX29kZGl0eURhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAvKiogQG92ZXJyaWRlICovXG4gIHNldFBvc2l0aW9uKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gc3VwZXIuc2V0UG9zaXRpb24ob3B0aW9ucyk7XG4gICAgY29uc3Qgc2hlZXRCb2R5ID0gdGhpcy5lbGVtZW50LmZpbmQoXCIuc2hlZXQtYm9keVwiKTtcbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gcG9zaXRpb24uaGVpZ2h0IC0gMTkyO1xuICAgIHNoZWV0Qm9keS5jc3MoXCJoZWlnaHRcIiwgYm9keUhlaWdodCk7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfc2tpbGxMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdza2lsbC13aW5kb3cnKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnBvb2xcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnRyYWluaW5nXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICBfYWJpbGl0eUxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FiaWxpdHktd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5pc0VuYWJsZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcyMjBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmNvc3QucG9vbFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzg1cHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5yYW5nZVwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgY29uc3QgY2JJZGVudGlmaWVkID0gaHRtbC5maW5kKCcjY2ItaWRlbnRpZmllZCcpO1xuICAgIGNiSWRlbnRpZmllZC5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuaXRlbS51cGRhdGUoe1xuICAgICAgICAnZGF0YS5pZGVudGlmaWVkJzogZXYudGFyZ2V0LmNoZWNrZWRcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX2FybW9yTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnYXJtb3Itd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWlnaHRcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxuXG4gIF93ZWFwb25MaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCd3ZWFwb24td2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWlnaHRcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmNhdGVnb3J5XCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5yYW5nZVwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgX2dlYXJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdnZWFyLXdpbmRvdycpO1xuICB9XG5cbiAgX2N5cGhlckxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2N5cGhlci13aW5kb3cnKTtcbiAgfVxuXG4gIF9hcnRpZmFjdExpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FydGlmYWN0LXdpbmRvdycpO1xuICB9XG5cbiAgX29kZGl0eUxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ29kZGl0eS13aW5kb3cnKTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZWRpdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuaXRlbS5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc2tpbGwnOlxuICAgICAgICB0aGlzLl9za2lsbExpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhYmlsaXR5JzpcbiAgICAgICAgdGhpcy5fYWJpbGl0eUxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX2FybW9yTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlYXBvbic6XG4gICAgICAgIHRoaXMuX3dlYXBvbkxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnZWFyJzpcbiAgICAgICAgdGhpcy5fZ2Vhckxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9jeXBoZXJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxuICAgICAgICB0aGlzLl9hcnRpZmFjdExpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICB0aGlzLl9vZGRpdHlMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZ2xvYmFscyBJdGVtIHJlbmRlclRlbXBsYXRlICovXG5cbmltcG9ydCB7IGN5cGhlclJvbGwgfSBmcm9tICcuLi9yb2xscy5qcyc7XG5pbXBvcnQgeyB2YWxPckRlZmF1bHQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcbmltcG9ydCBFbnVtVHJhaW5pbmcgZnJvbSAnLi4vZW51bXMvZW51bS10cmFpbmluZy5qcyc7XG5pbXBvcnQgRW51bVdlaWdodCBmcm9tICcuLi9lbnVtcy9lbnVtLXdlaWdodC5qcyc7XG5pbXBvcnQgRW51bVJhbmdlIGZyb20gJy4uL2VudW1zL2VudW0tcmFuZ2UuanMnO1xuaW1wb3J0IEVudW1XZWFwb25DYXRlZ29yeSBmcm9tICcuLi9lbnVtcy9lbnVtLXdlYXBvbi1jYXRlZ29yeS5qcyc7XG5cbi8qKlxuICogRXh0ZW5kIHRoZSBiYXNpYyBJdGVtIHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zLlxuICogQGV4dGVuZHMge0l0ZW19XG4gKi9cbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1JdGVtIGV4dGVuZHMgSXRlbSB7XG4gIF9wcmVwYXJlU2tpbGxEYXRhKCkge1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XG5cbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LnNraWxsJykpO1xuICAgIGRhdGEucG9vbCA9IHZhbE9yRGVmYXVsdChkYXRhLnBvb2wsIDApO1xuICAgIGRhdGEudHJhaW5pbmcgPSB2YWxPckRlZmF1bHQoZGF0YS50cmFpbmluZywgMSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG5cbiAgICBkYXRhLmZsYWdzID0gdmFsT3JEZWZhdWx0KGRhdGEuZmxhZ3MsIHt9KTtcbiAgfVxuXG4gIF9wcmVwYXJlQWJpbGl0eURhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuYWJpbGl0eScpKTtcbiAgICBkYXRhLnNvdXJjZVR5cGUgPSB2YWxPckRlZmF1bHQoZGF0YS5zb3VyY2VUeXBlLCAnJyk7XG4gICAgZGF0YS5zb3VyY2VWYWx1ZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNvdXJjZVZhbHVlLCAnJyk7XG4gICAgZGF0YS5pc0VuYWJsZXIgPSB2YWxPckRlZmF1bHQoZGF0YS5pc0VuYWJsZXIsIHRydWUpO1xuICAgIGRhdGEuY29zdCA9IHZhbE9yRGVmYXVsdChkYXRhLmNvc3QsIHtcbiAgICAgIHZhbHVlOiAwLFxuICAgICAgcG9vbDogMFxuICAgIH0pO1xuICAgIGRhdGEucmFuZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5yYW5nZSwgMCk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZUFybW9yRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hcm1vcicpKTtcbiAgICBkYXRhLmFybW9yID0gdmFsT3JEZWZhdWx0KGRhdGEuYXJtb3IsIDEpO1xuICAgIGRhdGEuYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdCA9IHZhbE9yRGVmYXVsdChkYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsIDEpO1xuICAgIGRhdGEucHJpY2UgPSB2YWxPckRlZmF1bHQoZGF0YS5wcmljZSwgMCk7XG4gICAgZGF0YS53ZWlnaHQgPSB2YWxPckRlZmF1bHQoZGF0YS53ZWlnaHQsIDApO1xuICAgIGRhdGEucXVhbnRpdHkgPSB2YWxPckRlZmF1bHQoZGF0YS5xdWFudGl0eSwgMSk7XG4gICAgZGF0YS5lcXVpcHBlZCA9IHZhbE9yRGVmYXVsdChkYXRhLmVxdWlwcGVkLCBmYWxzZSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZVdlYXBvbkRhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcud2VhcG9uJykpO1xuICAgIGRhdGEuZGFtYWdlID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlLCAxKTtcbiAgICBkYXRhLmNhdGVnb3J5ID0gdmFsT3JEZWZhdWx0KGRhdGEuY2F0ZWdvcnksIDApO1xuICAgIGRhdGEucmFuZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5yYW5nZSwgMCk7XG4gICAgZGF0YS5wcmljZSA9IHZhbE9yRGVmYXVsdChkYXRhLnByaWNlLCAwKTtcbiAgICBkYXRhLndlaWdodCA9IHZhbE9yRGVmYXVsdChkYXRhLndlaWdodCwgMCk7XG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcbiAgICBkYXRhLmVxdWlwcGVkID0gdmFsT3JEZWZhdWx0KGRhdGEuZXF1aXBwZWQsIGZhbHNlKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlR2VhckRhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuZ2VhcicpKTtcbiAgICBkYXRhLnByaWNlID0gdmFsT3JEZWZhdWx0KGRhdGEucHJpY2UsIDApO1xuICAgIGRhdGEucXVhbnRpdHkgPSB2YWxPckRlZmF1bHQoZGF0YS5xdWFudGl0eSwgMSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZUN5cGhlckRhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuY3lwaGVyJykpO1xuICAgIGRhdGEuaWRlbnRpZmllZCA9IHZhbE9yRGVmYXVsdChkYXRhLmlkZW50aWZpZWQsIGZhbHNlKTtcbiAgICBkYXRhLmxldmVsID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWwsIG51bGwpO1xuICAgIGRhdGEubGV2ZWxEaWUgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbERpZSwgJycpO1xuICAgIGRhdGEuZm9ybSA9IHZhbE9yRGVmYXVsdChkYXRhLmZvcm0sICcnKTtcbiAgICBkYXRhLmVmZmVjdCA9IHZhbE9yRGVmYXVsdChkYXRhLmVmZmVjdCwgJycpO1xuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xuICB9XG5cbiAgX3ByZXBhcmVBcnRpZmFjdERhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuYXJ0aWZhY3QnKSk7XG4gICAgZGF0YS5pZGVudGlmaWVkID0gdmFsT3JEZWZhdWx0KGRhdGEuaWRlbnRpZmllZCwgZmFsc2UpO1xuICAgIGRhdGEubGV2ZWwgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbCwgbnVsbCk7XG4gICAgZGF0YS5sZXZlbERpZSA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsRGllLCAnJyk7XG4gICAgZGF0YS5mb3JtID0gdmFsT3JEZWZhdWx0KGRhdGEuZm9ybSwgJycpO1xuICAgIGRhdGEuZWZmZWN0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmZWN0LCAnJyk7XG4gICAgZGF0YS5kZXBsZXRpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5kZXBsZXRpb24sIHtcbiAgICAgIGlzRGVwbGV0aW5nOiB0cnVlLFxuICAgICAgZGllOiAnZDYnLFxuICAgICAgdGhyZXNob2xkOiAxXG4gICAgfSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZU9kZGl0eURhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcub2RkaXR5JykpO1xuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIEl0ZW0gZGF0YSBtb2RlbCB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxuICAgKi9cbiAgcHJlcGFyZURhdGEoKSB7XG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdza2lsbCc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVTa2lsbERhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhYmlsaXR5JzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUFiaWxpdHlEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJtb3InOlxuICAgICAgICB0aGlzLl9wcmVwYXJlQXJtb3JEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZVdlYXBvbkRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnZWFyJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUdlYXJEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3lwaGVyJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUN5cGhlckRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnRpZmFjdCc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVBcnRpZmFjdERhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICB0aGlzLl9wcmVwYXJlT2RkaXR5RGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUm9sbFxuICAgKi9cblxuICBfc2tpbGxSb2xsKCkge1xuICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XG5cbiAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXM7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IHBvb2wgfSA9IGl0ZW0uZGF0YTtcbiAgICBjb25zdCBhc3NldHMgPSBhY3Rvci5nZXRTa2lsbExldmVsKHRoaXMpO1xuICAgIGNvbnN0IGZyZWVFZmZvcnQgPSBhY3Rvci5nZXRGcmVlRWZmb3J0RnJvbVN0YXQocG9vbCk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IFsnMWQyMCddO1xuICAgIGlmIChhc3NldHMgIT09IDApIHtcbiAgICAgIGNvbnN0IHNpZ24gPSBhc3NldHMgPCAwID8gJy0nIDogJysnO1xuICAgICAgcGFydHMucHVzaChgJHtzaWdufSAke01hdGguYWJzKGFzc2V0cykgKiAzfWApO1xuICAgIH1cblxuICAgIGN5cGhlclJvbGwoe1xuICAgICAgcGFydHMsXG5cbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcG9vbCxcbiAgICAgICAgcG9vbENvc3Q6IDAsXG4gICAgICAgIGVmZm9ydDogZnJlZUVmZm9ydCxcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxuICAgICAgICBhc3NldHNcbiAgICAgIH0sXG4gICAgICBldmVudCxcblxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuc2tpbGwudGl0bGUnKSxcbiAgICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5za2lsbC5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKS5yZXBsYWNlKCcjI1NLSUxMIyMnLCBuYW1lKSxcblxuICAgICAgYWN0b3IsXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgfSk7XG4gIH1cblxuICBfYWJpbGl0eVJvbGwoKSB7XG4gICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcblxuICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcztcbiAgICBjb25zdCBpdGVtID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgaXNFbmFibGVyLCBjb3N0IH0gPSBpdGVtLmRhdGE7XG5cbiAgICBpZiAoIWlzRW5hYmxlcikge1xuICAgICAgY29uc3QgeyBwb29sLCB2YWx1ZTogYW1vdW50IH0gPSBjb3N0O1xuICAgICAgY29uc3QgZWRnZSA9IGFjdG9yLmdldEVkZ2VGcm9tU3RhdChwb29sKTtcbiAgICAgIGNvbnN0IGFkanVzdGVkQW1vdW50ZWQgPSBNYXRoLm1heChhbW91bnQgLSBlZGdlLCAwKTtcbiAgICAgIGNvbnN0IGZyZWVFZmZvcnQgPSBhY3Rvci5nZXRGcmVlRWZmb3J0RnJvbVN0YXQocG9vbCk7XG5cbiAgICAgIC8vIEVkZ2UgaGFzIG1hZGUgdGhpcyBhYmlsaXR5IGZyZWUsIHNvIGp1c3QgdXNlIGl0XG4gICAgICBpZiAoYWRqdXN0ZWRBbW91bnRlZCA9PT0gMCkge1xuICAgICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcbiAgICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IubmFtZSkucmVwbGFjZSgnIyNBQklMSVRZIyMnLCBuYW1lKSxcbiAgICAgICAgICBjb250ZW50OiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkuZnJlZScpLFxuICAgICAgICB9XSk7XG4gICAgICB9IGVsc2UgaWYgKGFjdG9yLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgcGFyc2VJbnQoYW1vdW50LCAxMCkpKSB7XG4gICAgICAgIGN5cGhlclJvbGwoe1xuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIHBhcnRzOiBbJzFkMjAnXSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwb29sLFxuICAgICAgICAgICAgcG9vbENvc3Q6IGFkanVzdGVkQW1vdW50ZWQsXG4gICAgICAgICAgICBlZmZvcnQ6IGZyZWVFZmZvcnQsXG4gICAgICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnRcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICAgICAgICBmbGF2b3I6IGAke2FjdG9yLm5hbWV9IHVzZWQgJHtuYW1lfWAsXG4gICAgICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS50aXRsZScpLFxuICAgICAgICAgIGFjdG9yXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS5mYWlsZWQuZmxhdm9yJyksXG4gICAgICAgICAgY29udGVudDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5hYmlsaXR5LmZhaWxlZC5jb250ZW50JykucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSlcbiAgICAgICAgfV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcbiAgICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS5pbnZhbGlkLmZsYXZvcicpLFxuICAgICAgICBjb250ZW50OiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkuaW52YWxpZC5jb250ZW50JylcbiAgICAgIH1dKTtcbiAgICB9XG4gIH1cblxuICByb2xsKCkge1xuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdza2lsbCc6XG4gICAgICAgIHRoaXMuX3NraWxsUm9sbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9hYmlsaXR5Um9sbCgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5mb1xuICAgKi9cblxuICBhc3luYyBfc2tpbGxJbmZvKCkge1xuICAgIGNvbnN0IHNraWxsRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHNraWxsRGF0YTtcblxuICAgIGNvbnN0IHRyYWluaW5nID0gRW51bVRyYWluaW5nW3NraWxsRGF0YS5kYXRhLnRyYWluaW5nXTtcbiAgICBjb25zdCBwb29sID0gRW51bVBvb2xzW3NraWxsRGF0YS5kYXRhLnBvb2xdO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogc2tpbGxEYXRhLm5hbWUsXG4gICAgICB0cmFpbmluZzogdHJhaW5pbmcudG9Mb3dlckNhc2UoKSxcbiAgICAgIHBvb2w6IHBvb2wudG9Mb3dlckNhc2UoKSxcbiAgICAgIG5vdGVzOiBkYXRhLm5vdGVzLFxuXG4gICAgICBpbml0aWF0aXZlOiAhIWRhdGEuZmxhZ3MuaW5pdGlhdGl2ZVxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9za2lsbC1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYWJpbGl0eUluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuICAgIGNvbnN0IGFiaWxpdHkgPSBkYXRhLmRhdGE7XG5cbiAgICBjb25zdCBwb29sID0gRW51bVBvb2xzW2FiaWxpdHkuY29zdC5wb29sXTtcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHBvb2w6IHBvb2wudG9Mb3dlckNhc2UoKSxcbiAgICAgIGlzRW5hYmxlcjogYWJpbGl0eS5pc0VuYWJsZXIsXG4gICAgICBjb3N0OiBhYmlsaXR5LmNvc3QudmFsdWUsXG4gICAgICBub3RlczogYWJpbGl0eS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYXJtb3JJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHdlaWdodCA9IEVudW1XZWlnaHRbZGF0YS5kYXRhLndlaWdodF07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBlcXVpcHBlZDogZGF0YS5kYXRhLmVxdWlwcGVkLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXG4gICAgICBhcm1vcjogZGF0YS5kYXRhLmFybW9yLFxuICAgICAgYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdDogZGF0YS5kYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJtb3ItaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX3dlYXBvbkluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qgd2VpZ2h0ID0gRW51bVdlaWdodFtkYXRhLmRhdGEud2VpZ2h0XTtcbiAgICBjb25zdCByYW5nZSA9IEVudW1SYW5nZVtkYXRhLmRhdGEucmFuZ2VdO1xuICAgIGNvbnN0IGNhdGVnb3J5ID0gRW51bVdlYXBvbkNhdGVnb3J5W2RhdGEuZGF0YS5jYXRlZ29yeV07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBlcXVpcHBlZDogZGF0YS5kYXRhLmVxdWlwcGVkLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXG4gICAgICByYW5nZTogcmFuZ2UudG9Mb3dlckNhc2UoKSxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeS50b0xvd2VyQ2FzZSgpLFxuICAgICAgZGFtYWdlOiBkYXRhLmRhdGEuZGFtYWdlLFxuICAgICAgcHJpY2U6IGRhdGEuZGF0YS5wcmljZSxcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3dlYXBvbi1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfZ2VhckluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIF9jeXBoZXJJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXG4gICAgICBsZXZlbDogZGF0YS5kYXRhLmxldmVsLFxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXG4gICAgICBlZmZlY3Q6IGRhdGEuZGF0YS5lZmZlY3QsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2N5cGhlci1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYXJ0aWZhY3RJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXG4gICAgICBsZXZlbDogZGF0YS5kYXRhLmxldmVsLFxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXG4gICAgICBpc0RlcGxldGluZzogZGF0YS5kYXRhLmRlcGxldGlvbi5pc0RlcGxldGluZyxcbiAgICAgIGRlcGxldGlvblRocmVzaG9sZDogZGF0YS5kYXRhLmRlcGxldGlvbi50aHJlc2hvbGQsXG4gICAgICBkZXBsZXRpb25EaWU6IGRhdGEuZGF0YS5kZXBsZXRpb24uZGllLFxuICAgICAgZWZmZWN0OiBkYXRhLmRhdGEuZWZmZWN0LFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcnRpZmFjdC1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfb2RkaXR5SW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgZ2V0SW5mbygpIHtcbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX3NraWxsSW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYWJpbGl0eUluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hcm1vckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fd2VhcG9uSW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fZ2VhckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fY3lwaGVySW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FydGlmYWN0SW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9vZGRpdHlJbmZvKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sO1xuICB9XG59XG4iLCJpbXBvcnQgeyBjeXBoZXJSb2xsIH0gZnJvbSAnLi9yb2xscy5qcyc7XG5cblxuaW1wb3J0IEVudW1Qb29scyBmcm9tICcuL2VudW1zL2VudW0tcG9vbC5qcyc7XG5cbi8qKlxuICogUm9sbHMgZnJvbSB0aGUgZ2l2ZW4gc2tpbGwuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3RvcklkXG4gKiBAcGFyYW0ge3N0cmluZ30gcG9vbFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVBvb2xNYWNybyhhY3RvcklkLCBwb29sKSB7XG4gIGNvbnN0IGFjdG9yID0gZ2FtZS5hY3RvcnMuZW50aXRpZXMuZmluZChhID0+IGEuX2lkID09PSBhY3RvcklkKTtcbiAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xuICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICBjeXBoZXJSb2xsKHtcbiAgICBwYXJ0czogWycxZDIwJ10sXG5cbiAgICBkYXRhOiB7XG4gICAgICBwb29sLFxuICAgICAgZWZmb3J0OiBmcmVlRWZmb3J0LFxuICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxuICAgIH0sXG4gICAgZXZlbnQsXG5cbiAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5wb29sLnRpdGxlJykucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSksXG4gICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnBvb2wuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IubmFtZSkucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSksXG5cbiAgICBhY3RvcixcbiAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gIH0pO1xufVxuXG4vKipcbiAqIEFjdGl2YXRlcyB0aGUgZ2l2ZW4gc2tpbGwuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3RvcklkXG4gKiBAcGFyYW0ge3N0cmluZ30gaXRlbUlkXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlU2tpbGxNYWNybyhhY3RvcklkLCBpdGVtSWQpIHtcbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5lbnRpdGllcy5maW5kKGEgPT4gYS5faWQgPT09IGFjdG9ySWQpO1xuICBjb25zdCBza2lsbCA9IGFjdG9yLmdldE93bmVkSXRlbShpdGVtSWQpO1xuXG4gIHNraWxsLnJvbGwoKTtcbn1cblxuLyoqXG4gKiBBY3RpdmF0ZXMgdGhlIGdpdmVuIGFiaWxpdHkuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3RvcklkXG4gKiBAcGFyYW0ge3N0cmluZ30gaXRlbUlkXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQWJpbGl0eU1hY3JvKGFjdG9ySWQsIGl0ZW1JZCkge1xuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLl9pZCA9PT0gYWN0b3JJZCk7XG4gIGNvbnN0IGFiaWxpdHkgPSBhY3Rvci5nZXRPd25lZEl0ZW0oaXRlbUlkKTtcblxuICBhYmlsaXR5LnJvbGwoKTtcbn1cblxuLyoqXG4gKiBVc2VzIHRoZSBnaXZlbiBjeXBoZXIuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3RvcklkXG4gKiBAcGFyYW0ge3N0cmluZ30gaXRlbUlkXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQ3lwaGVyTWFjcm8oYWN0b3JJZCwgaXRlbUlkKSB7XG4gIGNvbnNvbGUud2FybignQ3lwaGVyIG1hY3JvcyBub3QgaW1wbGVtZW50ZWQnKTtcbn1cblxuY29uc3QgU1VQUE9SVEVEX1RZUEVTID0gW1xuICAncG9vbCcsXG5cbiAgJ3NraWxsJyxcbiAgJ2FiaWxpdHknLFxuICAvLyAnY3lwaGVyJ1xuXTtcblxuZnVuY3Rpb24gaXRlbVN1cHBvcnRzTWFjcm9zKGl0ZW0pIHtcbiAgaWYgKCFTVVBQT1JURURfVFlQRVMuaW5jbHVkZXMoaXRlbS50eXBlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpdGVtLnR5cGUgPT09ICdhYmlsaXR5JyAmJiBpdGVtLmRhdGEuaXNFbmFibGVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVuc3VwcG9ydGVkSXRlbU1lc3NhZ2UoaXRlbSkge1xuICBpZiAoaXRlbS50eXBlID09PSAnYWJpbGl0eScgJiYgaXRlbS5kYXRhLmlzRW5hYmxlcikge1xuICAgIHJldHVybiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5tYWNyby5jcmVhdGUuYWJpbGl0eUVuYWJsZXInKTtcbiAgfVxuXG4gIHJldHVybiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5tYWNyby5jcmVhdGUudW5zdXBwb3J0ZWRUeXBlJyk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTWFjcm9Db21tYW5kKGRhdGEpIHtcbiAgY29uc3QgaXRlbSA9IGRhdGEuZGF0YTtcblxuICAvLyBTcGVjaWFsIGNhc2UsIG11c3QgaGFuZGxlIHRoaXMgc2VwYXJhdGVseVxuICBpZiAoaXRlbS50eXBlID09PSAncG9vbCcpIHtcbiAgICByZXR1cm4gYGdhbWUuY3lwaGVyc3lzdGVtLm1hY3JvLnVzZVBvb2woJyR7ZGF0YS5hY3RvcklkfScsICR7aXRlbS5wb29sfSk7YDtcbiAgfVxuXG4gIC8vIEdlbmVyYWwgY2FzZXMsIHdvcmtzIG1vc3Qgb2YgdGhlIHRpbWVcbiAgY29uc3QgdHlwZVRpdGxlQ2FzZSA9IGl0ZW0udHlwZS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0udHlwZS5zdWJzdHIoMSk7XG4gIGNvbnN0IGNvbW1hbmQgPSBgZ2FtZS5jeXBoZXJzeXN0ZW0ubWFjcm8udXNlJHt0eXBlVGl0bGVDYXNlfSgnJHtkYXRhLmFjdG9ySWR9JywgJyR7aXRlbS5faWR9Jyk7YDtcblxuICByZXR1cm4gY29tbWFuZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlTWFjcm8oaXRlbSwgY29tbWFuZCkge1xuICBpZiAoaXRlbS50eXBlID09PSAncG9vbCcpIHtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1tpdGVtLnBvb2xdO1xuICAgIGl0ZW0ubmFtZSA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm1hY3JvLnBvb2wubmFtZScpLnJlcGxhY2UoJyMjUE9PTCMjJywgcG9vbE5hbWUpO1xuICAgIGl0ZW0uaW1nID0gJ2ljb25zL3N2Zy9kMjAuc3ZnJztcbiAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09ICdza2lsbCcpIHtcbiAgICAvLyBJZiB0aGUgaW1hZ2Ugd291bGQgYmUgdGhlIGRlZmF1bHQsIGNoYW5nZSB0byBzb21ldGhpbmcgbW9yZSBhcHByb3ByaWF0ZVxuICAgIGl0ZW0uaW1nID0gaXRlbS5pbWcgPT09ICdpY29ucy9zdmcvbXlzdGVyeS1tYW4uc3ZnJyA/ICdpY29ucy9zdmcvYXVyYS5zdmcnIDogaXRlbS5pbWc7XG4gIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSAnYWJpbGl0eScpIHtcbiAgICAvLyBJZiB0aGUgaW1hZ2Ugd291bGQgYmUgdGhlIGRlZmF1bHQsIGNoYW5nZSB0byBzb21ldGhpbmcgbW9yZSBhcHByb3ByaWF0ZVxuICAgIGl0ZW0uaW1nID0gaXRlbS5pbWcgPT09ICdpY29ucy9zdmcvbXlzdGVyeS1tYW4uc3ZnJyA/ICdpY29ucy9zdmcvYm9vay5zdmcnIDogaXRlbS5pbWc7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgTWFjcm8uY3JlYXRlKHtcbiAgICBuYW1lOiBpdGVtLm5hbWUsXG4gICAgdHlwZTogJ3NjcmlwdCcsXG4gICAgaW1nOiBpdGVtLmltZyxcbiAgICBjb21tYW5kOiBjb21tYW5kLFxuICAgIGZsYWdzOiB7XG4gICAgICAnY3lwaGVyc3lzdGVtLml0ZW1NYWNybyc6IHRydWVcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIE1hY3JvIGZyb20gYW4gSXRlbSBkcm9wLlxuICogR2V0IGFuIGV4aXN0aW5nIGl0ZW0gbWFjcm8gaWYgb25lIGV4aXN0cywgb3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBvbmUuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgVGhlIGRyb3BwZWQgZGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IHNsb3QgICAgIFRoZSBob3RiYXIgc2xvdCB0byB1c2VcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ3lwaGVyTWFjcm8oZGF0YSwgc2xvdCkge1xuICBjb25zdCBpc093bmVkID0gJ2RhdGEnIGluIGRhdGE7XG4gIGlmICghaXNPd25lZCkge1xuICAgIHJldHVybiB1aS5ub3RpZmljYXRpb25zLndhcm4oZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubWFjcm8uY3JlYXRlLm5vdE93bmVkJykpO1xuICB9XG5cbiAgY29uc3QgaXRlbSA9IGRhdGEuZGF0YTtcbiAgaWYgKCFpdGVtU3VwcG9ydHNNYWNyb3MoaXRlbSkpIHtcbiAgICByZXR1cm4gdWkubm90aWZpY2F0aW9ucy53YXJuKHVuc3VwcG9ydGVkSXRlbU1lc3NhZ2UoaXRlbSkpO1xuICB9XG5cbiAgY29uc3QgY29tbWFuZCA9IGdlbmVyYXRlTWFjcm9Db21tYW5kKGRhdGEpO1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgbWFjcm8gYWxyZWFkeSBleGlzdHMsIGlmIG5vdCwgY3JlYXRlIGEgbmV3IG9uZVxuICBsZXQgbWFjcm8gPSBnYW1lLm1hY3Jvcy5lbnRpdGllcy5maW5kKG0gPT4gKG0ubmFtZSA9PT0gaXRlbS5uYW1lKSAmJiAobS5jb21tYW5kID09PSBjb21tYW5kKSk7XG4gIGlmICghbWFjcm8pIHtcbiAgICBtYWNybyA9IGF3YWl0IGNyZWF0ZU1hY3JvKGl0ZW0sIGNvbW1hbmQpO1xuICB9XG5cbiAgZ2FtZS51c2VyLmFzc2lnbkhvdGJhck1hY3JvKG1hY3JvLCBzbG90KTtcblxuICByZXR1cm4gZmFsc2U7XG59XG4iLCJpbXBvcnQgeyBOUENNaWdyYXRvciB9IGZyb20gJy4vbnBjLW1pZ3JhdGlvbnMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWlncmF0ZSgpIHtcbiAgaWYgKCFnYW1lLnVzZXIuaXNHTSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnNvbGUuaW5mbygnLS0tIFN0YXJ0aW5nIE1pZ3JhdGlvbiBQcm9jZXNzIC0tLScpO1xuXG4gIGNvbnN0IG5wY0FjdG9ycyA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbHRlcihhY3RvciA9PiBhY3Rvci5kYXRhLnR5cGUgPT09ICducGMnKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5wY0FjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG5wYyA9IG5wY0FjdG9yc1tpXTtcbiAgICBjb25zdCBuZXdEYXRhID0gYXdhaXQgTlBDTWlncmF0b3IobnBjKTtcbiAgICBhd2FpdCBucGMudXBkYXRlKG5ld0RhdGEpO1xuICB9XG5cbiAgY29uc29sZS5pbmZvKCctLS0gTWlncmF0aW9uIFByb2Nlc3MgRmluaXNoZWQgLS0tJyk7XG59XG4iLCJjb25zdCBtaWdyYXRpb25zID0gW1xuICB7XG4gICAgdmVyc2lvbjogMixcbiAgICBhY3Rpb246IChucGMsIGRhdGEpID0+IHtcbiAgICAgIGRhdGFbJ2RhdGEuaGVhbHRoJ10gPSBucGMuZGF0YS5kYXRhLmhlYWx0aC5tYXg7XG4gIFxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9XG5dO1xuXG5hc3luYyBmdW5jdGlvbiBtaWdyYXRvcihucGMsIG9iaiA9IHt9KSB7XG4gIGxldCBuZXdEYXRhID0gT2JqZWN0LmFzc2lnbih7IF9pZDogbnBjLl9pZCwgZGF0YTogeyB2ZXJzaW9uOiBucGMuZGF0YS5kYXRhLnZlcnNpb24gfSB9LCBvYmopO1xuXG4gIG1pZ3JhdGlvbnMuZm9yRWFjaChoYW5kbGVyID0+IHtcbiAgICBjb25zdCB7IHZlcnNpb24gfSA9IG5ld0RhdGEuZGF0YTtcbiAgICBpZiAodmVyc2lvbiA8IGhhbmRsZXIudmVyc2lvbikge1xuICAgICAgbmV3RGF0YSA9IGhhbmRsZXIuYWN0aW9uKG5wYywgbmV3RGF0YSk7XG4gICAgICBuZXdEYXRhLnZlcnNpb24gPSBoYW5kbGVyLnZlcnNpb247XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbmV3RGF0YTtcbn1cblxuZXhwb3J0IGNvbnN0IE5QQ01pZ3JhdG9yID0gbWlncmF0b3I7XG4iLCIvKiBnbG9iYWxzIHJlbmRlclRlbXBsYXRlICovXG5cbmltcG9ydCB7IFJvbGxEaWFsb2cgfSBmcm9tICcuL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcm9sbFRleHQoZGllUm9sbCwgcm9sbFRvdGFsKSB7XG4gIGxldCBwYXJ0cyA9IFtdO1xuXG4gIGNvbnN0IHRhc2tMZXZlbCA9IE1hdGguZmxvb3Iocm9sbFRvdGFsIC8gMyk7XG4gIGNvbnN0IHNraWxsTGV2ZWwgPSBNYXRoLmZsb29yKChyb2xsVG90YWwgLSBkaWVSb2xsKSAvIDMgKyAwLjUpO1xuICBjb25zdCB0b3RhbEFjaGlldmVkID0gdGFza0xldmVsICsgc2tpbGxMZXZlbDtcblxuICBsZXQgdG5Db2xvciA9ICcjMDAwMDAwJztcbiAgaWYgKHRvdGFsQWNoaWV2ZWQgPCAzKSB7XG4gICAgdG5Db2xvciA9ICcjMGE4NjBhJztcbiAgfSBlbHNlIGlmICh0b3RhbEFjaGlldmVkIDwgNykge1xuICAgIHRuQ29sb3IgPSAnIzg0ODQwOSc7XG4gIH0gZWxzZSB7XG4gICAgdG5Db2xvciA9ICcjMGE4NjBhJztcbiAgfVxuXG4gIGxldCBzdWNjZXNzVGV4dCA9IGA8JHt0b3RhbEFjaGlldmVkfT5gO1xuICBpZiAoc2tpbGxMZXZlbCAhPT0gMCkge1xuICAgIGNvbnN0IHNpZ24gPSBza2lsbExldmVsID4gMCA/IFwiK1wiIDogXCJcIjtcbiAgICBzdWNjZXNzVGV4dCArPSBgICgke3Rhc2tMZXZlbH0ke3NpZ259JHtza2lsbExldmVsfSlgO1xuICB9XG5cbiAgcGFydHMucHVzaCh7XG4gICAgdGV4dDogc3VjY2Vzc1RleHQsXG4gICAgY29sb3I6IHRuQ29sb3IsXG4gICAgY2xzOiAndGFyZ2V0LW51bWJlcidcbiAgfSlcblxuICBzd2l0Y2ggKGRpZVJvbGwpIHtcbiAgICBjYXNlIDE6XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5pbnRydXNpb24nKSxcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMTk6XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5lZmZlY3QubWlub3InKSxcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMjA6XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5lZmZlY3QubWFqb3InKSxcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGN5cGhlclJvbGwoeyBwYXJ0cyA9IFtdLCBkYXRhID0ge30sIGFjdG9yID0gbnVsbCwgZXZlbnQgPSBudWxsLCBzcGVha2VyID0gbnVsbCwgZmxhdm9yID0gbnVsbCwgdGl0bGUgPSBudWxsLCBpdGVtID0gZmFsc2UgfSA9IHt9KSB7XG4gIGxldCByb2xsTW9kZSA9IGdhbWUuc2V0dGluZ3MuZ2V0KCdjb3JlJywgJ3JvbGxNb2RlJyk7XG4gIGxldCByb2xsZWQgPSBmYWxzZTtcbiAgbGV0IGZpbHRlcmVkID0gcGFydHMuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgIHJldHVybiBlbCAhPSAnJyAmJiBlbDtcbiAgfSk7XG5cbiAgLy8gSW5kaWNhdGVzIGZyZWUgbGV2ZWxzIG9mIGVmZm9ydFxuICBsZXQgc3RhcnRpbmdFZmZvcnQgPSAwO1xuICBsZXQgbWluRWZmb3J0ID0gMDtcbiAgaWYgKGRhdGFbJ2VmZm9ydCddKSB7XG4gICAgc3RhcnRpbmdFZmZvcnQgPSBwYXJzZUludChkYXRhWydlZmZvcnQnXSwgMTApIHx8IDA7XG4gICAgbWluRWZmb3J0ID0gc3RhcnRpbmdFZmZvcnQ7XG4gIH1cblxuICBsZXQgbWF4RWZmb3J0ID0gMTtcbiAgaWYgKGRhdGFbJ21heEVmZm9ydCddKSB7XG4gICAgbWF4RWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnbWF4RWZmb3J0J10sIDEwKSB8fCAxO1xuICB9XG5cbiAgY29uc3QgX3JvbGwgPSAoZm9ybSA9IG51bGwpID0+IHtcbiAgICAvLyBPcHRpb25hbGx5IGluY2x1ZGUgZWZmb3J0XG4gICAgaWYgKGZvcm0gIT09IG51bGwpIHtcbiAgICAgIGRhdGFbJ2VmZm9ydCddID0gcGFyc2VJbnQoZm9ybS5lZmZvcnQudmFsdWUsIDEwKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YVsnZWZmb3J0J10pIHtcbiAgICAgIGZpbHRlcmVkLnB1c2goYCske2RhdGFbJ2VmZm9ydCddICogM31gKTtcblxuICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gbG9jYWxpemUgdGhpcywgY29uY2F0aW5nIHN0cmluZ3MgZG9lc24ndCB3b3JrIGZvciBhbGwgbGFuZ3VhZ2VzXG4gICAgICBmbGF2b3IgKz0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5lZmZvcnQuZmxhdm9yJykucmVwbGFjZSgnIyNFRkZPUlQjIycsIGRhdGFbJ2VmZm9ydCddKTtcbiAgICB9XG5cbiAgICBjb25zdCByb2xsID0gbmV3IFJvbGwoZmlsdGVyZWQuam9pbignJyksIGRhdGEpLnJvbGwoKTtcbiAgICAvLyBDb252ZXJ0IHRoZSByb2xsIHRvIGEgY2hhdCBtZXNzYWdlIGFuZCByZXR1cm4gdGhlIHJvbGxcbiAgICByb2xsTW9kZSA9IGZvcm0gPyBmb3JtLnJvbGxNb2RlLnZhbHVlIDogcm9sbE1vZGU7XG4gICAgcm9sbGVkID0gdHJ1ZTtcblxuICAgIHJldHVybiByb2xsO1xuICB9XG5cbiAgY29uc3QgdGVtcGxhdGUgPSAnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2RpYWxvZy9yb2xsLWRpYWxvZy5odG1sJztcbiAgbGV0IGRpYWxvZ0RhdGEgPSB7XG4gICAgZm9ybXVsYTogZmlsdGVyZWQuam9pbignICcpLFxuICAgIGVmZm9ydDogc3RhcnRpbmdFZmZvcnQsXG4gICAgbWluRWZmb3J0OiBtaW5FZmZvcnQsXG4gICAgbWF4RWZmb3J0OiBtYXhFZmZvcnQsXG4gICAgZGF0YTogZGF0YSxcbiAgICByb2xsTW9kZTogcm9sbE1vZGUsXG4gICAgcm9sbE1vZGVzOiBDT05GSUcuRGljZS5yb2xsTW9kZXNcbiAgfTtcblxuICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUodGVtcGxhdGUsIGRpYWxvZ0RhdGEpO1xuICAvL0NyZWF0ZSBEaWFsb2cgd2luZG93XG4gIGxldCByb2xsO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgbmV3IFJvbGxEaWFsb2coe1xuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgY29udGVudDogaHRtbCxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgb2s6IHtcbiAgICAgICAgICBsYWJlbDogJ09LJyxcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgICBjYWxsYmFjazogKGh0bWwpID0+IHtcbiAgICAgICAgICAgIHJvbGwgPSBfcm9sbChodG1sWzBdLmNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgLy8gVE9ETzogY2hlY2sgcm9sbC5yZXN1bHQgYWdhaW5zdCB0YXJnZXQgbnVtYmVyXG5cbiAgICAgICAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGFtb3VudE9mRWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnZWZmb3J0J10gfHwgMCwgMTApO1xuICAgICAgICAgICAgY29uc3QgZWZmb3J0Q29zdCA9IGFjdG9yLmdldEVmZm9ydENvc3RGcm9tU3RhdChwb29sLCBhbW91bnRPZkVmZm9ydCk7XG4gICAgICAgICAgICBjb25zdCB0b3RhbENvc3QgPSBwYXJzZUludChkYXRhWydwb29sQ29zdCddIHx8IDAsIDEwKSArIHBhcnNlSW50KGVmZm9ydENvc3QuY29zdCwgMTApO1xuXG4gICAgICAgICAgICBpZiAoYWN0b3IuY2FuU3BlbmRGcm9tUG9vbChwb29sLCB0b3RhbENvc3QpICYmICFlZmZvcnRDb3N0Lndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgcm9sbC50b01lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHNwZWFrZXI6IHNwZWFrZXIsXG4gICAgICAgICAgICAgICAgZmxhdm9yOiBmbGF2b3JcbiAgICAgICAgICAgICAgfSwgeyByb2xsTW9kZSB9KTtcblxuICAgICAgICAgICAgICBhY3Rvci5zcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XG4gICAgICAgICAgICAgICAgc3BlYWtlcixcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmZsYXZvcicpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmNvbnRlbnQnKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKVxuICAgICAgICAgICAgICB9XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiAnQ2FuY2VsJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiAnb2snLFxuICAgICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShyb2xsZWQgPyByb2xsIDogZmFsc2UpO1xuICAgICAgfVxuICAgIH0pLnJlbmRlcih0cnVlKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJTeXN0ZW1TZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBjdXJyZW5jeSBuYW1lXG4gICAqL1xuICBnYW1lLnNldHRpbmdzLnJlZ2lzdGVyKCdjeXBoZXJzeXN0ZW0nLCAnY3VycmVuY3lOYW1lJywge1xuICAgIG5hbWU6ICdTRVRUSU5HUy5uYW1lLmN1cnJlbmN5TmFtZScsXG4gICAgaGludDogJ1NFVFRJTkdTLmhpbnQuY3VycmVuY3lOYW1lJyxcbiAgICBzY29wZTogJ3dvcmxkJyxcbiAgICBjb25maWc6IHRydWUsXG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdNb25leSdcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBHTUludHJ1c2lvbkRpYWxvZyB9IGZyb20gXCIuL2RpYWxvZy9nbS1pbnRydXNpb24tZGlhbG9nLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3JTb2NrZXRMaXN0ZW5lcnMoKSB7XG4gIGdhbWUuc29ja2V0Lm9uKCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywgaGFuZGxlTWVzc2FnZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoYXJncykge1xuICBjb25zdCB7IHR5cGUgfSA9IGFyZ3M7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnZ21JbnRydXNpb24nOlxuICAgICAgaGFuZGxlR01JbnRydXNpb24oYXJncyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdhd2FyZFhQJzpcbiAgICAgIGhhbmRsZUF3YXJkWFAoYXJncyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHTUludHJ1c2lvbihhcmdzKSB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcbiAgY29uc3QgeyBhY3RvcklkLCB1c2VySWRzIH0gPSBkYXRhO1xuXG4gIGlmICghZ2FtZS5yZWFkeSB8fCBnYW1lLnVzZXIuaXNHTSB8fCAhdXNlcklkcy5maW5kKGlkID0+IGlkID09PSBnYW1lLnVzZXJJZCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLmRhdGEuX2lkID09PSBhY3RvcklkKTtcbiAgY29uc3QgZGlhbG9nID0gbmV3IEdNSW50cnVzaW9uRGlhbG9nKGFjdG9yKTtcbiAgZGlhbG9nLnJlbmRlcih0cnVlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXdhcmRYUChhcmdzKSB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcbiAgY29uc3QgeyBhY3RvcklkLCB4cEFtb3VudCB9ID0gZGF0YTtcblxuICBpZiAoIWdhbWUucmVhZHkgfHwgIWdhbWUudXNlci5pc0dNKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQoYWN0b3JJZCk7XG4gIGFjdG9yLnVwZGF0ZSh7XG4gICAgJ2RhdGEueHAnOiBhY3Rvci5kYXRhLmRhdGEueHAgKyB4cEFtb3VudFxuICB9KTtcblxuICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5hd2FyZFhQJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IuZGF0YS5uYW1lKVxuICB9KTtcbn1cbiIsIi8qIGdsb2JhbHMgbG9hZFRlbXBsYXRlcyAqL1xuXG4vKipcbiAqIERlZmluZSBhIHNldCBvZiB0ZW1wbGF0ZSBwYXRocyB0byBwcmUtbG9hZFxuICogUHJlLWxvYWRlZCB0ZW1wbGF0ZXMgYXJlIGNvbXBpbGVkIGFuZCBjYWNoZWQgZm9yIGZhc3QgYWNjZXNzIHdoZW4gcmVuZGVyaW5nXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgY29uc3QgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMgPSBhc3luYygpID0+IHtcbiAgLy8gRGVmaW5lIHRlbXBsYXRlIHBhdGhzIHRvIGxvYWRcbiAgY29uc3QgdGVtcGxhdGVQYXRocyA9IFtcblxuICAgICAgLy8gQWN0b3IgU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYy1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9ucGMtc2hlZXQuaHRtbFwiLFxuXG4gICAgICAvLyBBY3RvciBQYXJ0aWFsc1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvcG9vbHMuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvYWR2YW5jZW1lbnQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvZGFtYWdlLXRyYWNrLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3JlY292ZXJ5Lmh0bWxcIixcblxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvc2tpbGxzLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2FiaWxpdGllcy5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbnZlbnRvcnkuaHRtbFwiLFxuXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hYmlsaXR5LWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcm1vci1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vd2VhcG9uLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9jeXBoZXItaW5mby5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FydGlmYWN0LWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sXCIsXG5cbiAgICAgIC8vIEl0ZW0gU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2l0ZW0tc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9za2lsbC1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2FybW9yLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vd2VhcG9uLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vZ2Vhci1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2N5cGhlci1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2FydGlmYWN0LXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vb2RkaXR5LXNoZWV0Lmh0bWxcIixcblxuICAgICAgLy8gRGlhbG9nc1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvZGlhbG9nL3JvbGwtZGlhbG9nLmh0bWxcIixcbiAgXTtcblxuICAvLyBMb2FkIHRoZSB0ZW1wbGF0ZSBwYXJ0c1xuICByZXR1cm4gbG9hZFRlbXBsYXRlcyh0ZW1wbGF0ZVBhdGhzKTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVlcFByb3Aob2JqLCBwYXRoKSB7XG4gIGNvbnN0IHByb3BzID0gcGF0aC5zcGxpdCgnLicpO1xuICBsZXQgdmFsID0gb2JqO1xuICBwcm9wcy5mb3JFYWNoKHAgPT4ge1xuICAgIGlmIChwIGluIHZhbCkge1xuICAgICAgdmFsID0gdmFsW3BdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB2YWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQodmFsKSB7XG4gIHJldHVybiAhKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxPckRlZmF1bHQodmFsLCBkZWYpIHtcbiAgcmV0dXJuIGlzRGVmaW5lZCh2YWwpID8gdmFsIDogZGVmO1xufVxuIiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheUxpa2VUb0FycmF5OyIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkOyIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwidmFyIHN1cGVyUHJvcEJhc2UgPSByZXF1aXJlKFwiLi9zdXBlclByb3BCYXNlXCIpO1xuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IFJlZmxlY3QuZ2V0O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICAgIHZhciBiYXNlID0gc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmICghYmFzZSkgcmV0dXJuO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTtcblxuICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dldDsiLCJmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0UHJvdG90eXBlT2Y7IiwidmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vc2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW5oZXJpdHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgX3R5cGVvZiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIGFzc2VydFRoaXNJbml0aWFsaXplZCA9IHJlcXVpcmUoXCIuL2Fzc2VydFRoaXNJbml0aWFsaXplZFwiKTtcblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIGFzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjsiLCJmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZjsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuL2dldFByb3RvdHlwZU9mXCIpO1xuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhaztcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3N1cGVyUHJvcEJhc2U7IiwiZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iXX0=
