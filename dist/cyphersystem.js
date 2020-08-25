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
      (0, _rolls.cypherRoll)({
        parts: ['1d20'],
        data: {
          pool: pool,
          maxEffort: actorData.effort
        },
        event: event,
        title: game.i18n.localize('CSR.roll.pool.title'),
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
      html.find('.roll-pool').click((function (evt) {
        evt.preventDefault();
        var el = evt.target;

        while (!el.dataset.pool) {
          el = el.parentElement;
        }

        var pool = el.dataset.pool;

        _this3._rollPoolDialog(parseInt(pool, 10));
      }));
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
        var data, pool, params, html;
        return _regenerator.default.wrap((function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = this.data;
                pool = _enumPool.default[data.data.cost.pool];
                params = {
                  name: data.name,
                  pool: pool.toLowerCase(),
                  isEnabler: data.data.isEnabler,
                  notes: data.data.notes
                };
                _context2.next = 5;
                return renderTemplate('systems/cyphersystem/templates/actor/partials/info/ability-info.html', params);

              case 5:
                html = _context2.sent;
                return _context2.abrupt("return", html);

              case 7:
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
exports.useSkillMacro = useSkillMacro;
exports.useAbilityMacro = useAbilityMacro;
exports.useCypherMacro = useCypherMacro;
exports.createCypherMacro = createCypherMacro;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

/**
 * Activates the given skill.
 * 
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
 * @param {string} itemId
 * @return {Promise}
 */


function useCypherMacro(actorId, itemId) {
  // const actor = game.actors.entities.find(a => a._id === actorId);
  // return actor.useItemById(itemId);
  console.warn('Cypher macros not implemented');
}

var SUPPORTED_TYPES = ['skill', 'ability', 'cypher'];
/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */

function createCypherMacro(_x, _x2) {
  return _createCypherMacro.apply(this, arguments);
}

function _createCypherMacro() {
  _createCypherMacro = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee(data, slot) {
    var isOwned, item, typeTitleCase, command, macro;
    return _regenerator.default.wrap((function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isOwned = 'data' in data;

            if (isOwned) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", ui.notifications.warn(game.i18n.localize('CSR.macro.create.notOwned')));

          case 3:
            item = data.data;

            if (SUPPORTED_TYPES.includes(item.type)) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", ui.notifications.warn(game.i18n.localize('CSR.macro.create.unsupportedType')));

          case 6:
            typeTitleCase = item.type.substr(0, 1).toUpperCase() + item.type.substr(1);
            command = "game.cyphersystem.macro.use".concat(typeTitleCase, "('").concat(data.actorId, "', '").concat(item._id, "');"); // Determine if the macro already exists, if not, create a new one

            macro = game.macros.entities.find((function (m) {
              return m.name === item.name && m.command === command;
            }));

            if (macro) {
              _context.next = 13;
              break;
            }

            _context.next = 12;
            return Macro.create({
              name: item.name,
              type: 'script',
              img: item.img,
              command: command,
              flags: {
                'cyphersystem.itemMacro': true
              }
            });

          case 12:
            macro = _context.sent;

          case 13:
            game.user.assignHotbarMacro(macro, slot);
            return _context.abrupt("return", false);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));
  return _createCypherMacro.apply(this, arguments);
}

},{"@babel/runtime/helpers/asyncToGenerator":30,"@babel/runtime/helpers/interopRequireDefault":36,"@babel/runtime/regenerator":46}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY2hhdC5qcyIsIm1vZHVsZS9jb21iYXQuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2NvbnRleHQtbWVudS5qcyIsIm1vZHVsZS9jeXBoZXJzeXN0ZW0uanMiLCJtb2R1bGUvZGlhbG9nL2dtLWludHJ1c2lvbi1kaWFsb2cuanMiLCJtb2R1bGUvZGlhbG9nL3BsYXllci1jaG9pY2UtZGlhbG9nLmpzIiwibW9kdWxlL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXBvb2wuanMiLCJtb2R1bGUvZW51bXMvZW51bS1yYW5nZS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXRyYWluaW5nLmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VpZ2h0LmpzIiwibW9kdWxlL2hhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1vZHVsZS9pdGVtL2l0ZW0tc2hlZXQuanMiLCJtb2R1bGUvaXRlbS9pdGVtLmpzIiwibW9kdWxlL21hY3Jvcy5qcyIsIm1vZHVsZS9taWdyYXRpb25zL21pZ3JhdGUuanMiLCJtb2R1bGUvbWlncmF0aW9ucy9ucGMtbWlncmF0aW9ucy5qcyIsIm1vZHVsZS9yb2xscy5qcyIsIm1vZHVsZS9zZXR0aW5ncy5qcyIsIm1vZHVsZS9zb2NrZXQuanMiLCJtb2R1bGUvdGVtcGxhdGUuanMiLCJtb2R1bGUvdXRpbHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zZXRQcm90b3R5cGVPZi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zdXBlclByb3BCYXNlLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0VBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOzs7Ozs7QUFFQTs7OztJQUlhLHNCOzs7Ozs7OztBQWlDWDs4QkFFVTtBQUNSLFdBQUssZ0JBQUwsR0FBd0IsQ0FBQyxDQUF6QjtBQUNBLFdBQUssb0JBQUwsR0FBNEIsQ0FBQyxDQUE3QjtBQUNBLFdBQUssYUFBTCxHQUFxQixJQUFyQjtBQUVBLFdBQUssaUJBQUwsR0FBeUIsQ0FBQyxDQUExQjtBQUNBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUVBLFdBQUssbUJBQUwsR0FBMkIsQ0FBQyxDQUE1QjtBQUNBLFdBQUssZUFBTCxHQUF1QixJQUF2QjtBQUNBLFdBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNEOzs7K0JBRVUsQ0FDVjs7OztBQXpCRDs7Ozt3QkFJZTtBQUFBLFVBQ0wsSUFESyxHQUNJLEtBQUssS0FBTCxDQUFXLElBRGYsQ0FDTCxJQURLO0FBRWIsNERBQStDLElBQS9DO0FBQ0Q7Ozs7QUE3QkQ7d0JBQzRCO0FBQzFCLGFBQU8sV0FBVyxvR0FBdUI7QUFDdkMsUUFBQSxPQUFPLEVBQUUsQ0FBQyxjQUFELEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCLENBRDhCO0FBRXZDLFFBQUEsS0FBSyxFQUFFLEdBRmdDO0FBR3ZDLFFBQUEsTUFBTSxFQUFFLEdBSCtCO0FBSXZDLFFBQUEsSUFBSSxFQUFFLENBQUM7QUFDTCxVQUFBLFdBQVcsRUFBRSxhQURSO0FBRUwsVUFBQSxlQUFlLEVBQUUsYUFGWjtBQUdMLFVBQUEsT0FBTyxFQUFFO0FBSEosU0FBRCxFQUlIO0FBQ0QsVUFBQSxXQUFXLEVBQUUsYUFEWjtBQUVELFVBQUEsZUFBZSxFQUFFLGFBRmhCO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dEJBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0IERpYWxvZyBDb250ZXh0TWVudSAqL1xuXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xuaW1wb3J0IHsgY3lwaGVyUm9sbCB9IGZyb20gJy4uL3JvbGxzLmpzJztcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tICcuLi9pdGVtL2l0ZW0uanMnO1xuaW1wb3J0IHsgZGVlcFByb3AgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEFjdG9yU2hlZXQgd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnNcbiAqIEBleHRlbmRzIHtBY3RvclNoZWV0fVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCBleHRlbmRzIEFjdG9yU2hlZXQge1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIGNsYXNzZXM6IFtcImN5cGhlcnN5c3RlbVwiLCBcInNoZWV0XCIsIFwiYWN0b3JcIl0sXG4gICAgICB3aWR0aDogNjAwLFxuICAgICAgaGVpZ2h0OiA1MDAsXG4gICAgICB0YWJzOiBbe1xuICAgICAgICBuYXZTZWxlY3RvcjogXCIuc2hlZXQtdGFic1wiLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6IFwiLnNoZWV0LWJvZHlcIixcbiAgICAgICAgaW5pdGlhbDogXCJkZXNjcmlwdGlvblwiXG4gICAgICB9LCB7XG4gICAgICAgIG5hdlNlbGVjdG9yOiAnLnN0YXRzLXRhYnMnLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6ICcuc3RhdHMtYm9keScsXG4gICAgICAgIGluaXRpYWw6ICdhZHZhbmNlbWVudCdcbiAgICAgIH1dLFxuICAgICAgc2Nyb2xsWTogW1xuICAgICAgICAnLnRhYi5pbnZlbnRvcnkgLmludmVudG9yeS1saXN0JyxcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktaW5mbycsXG4gICAgICBdXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3JyZWN0IEhUTUwgdGVtcGxhdGUgcGF0aCB0byB1c2UgZm9yIHJlbmRlcmluZyB0aGlzIHBhcnRpY3VsYXIgc2hlZXRcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcbiAgICByZXR1cm4gYHN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci8ke3R5cGV9LXNoZWV0Lmh0bWxgO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfcGNJbml0KCkge1xuICAgIHRoaXMuc2tpbGxzUG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSAtMTtcbiAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xuXG4gICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcblxuICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICB0aGlzLmZpbHRlckVxdWlwcGVkID0gZmFsc2U7XG4gIH1cblxuICBfbnBjSW5pdCgpIHtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICB0aGlzLl9wY0luaXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9ucGNJbml0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsIHR5cGUsIGZpZWxkKSB7XG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XG4gICAgaWYgKCFpdGVtc1tmaWVsZF0pIHtcbiAgICAgIGl0ZW1zW2ZpZWxkXSA9IGl0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gdHlwZSk7IC8vLnNvcnQoc29ydEZ1bmN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBfZmlsdGVySXRlbURhdGEoZGF0YSwgaXRlbUZpZWxkLCBmaWx0ZXJGaWVsZCwgZmlsdGVyVmFsdWUpIHtcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcbiAgICBpdGVtc1tpdGVtRmllbGRdID0gaXRlbXNbaXRlbUZpZWxkXS5maWx0ZXIoaXRtID0+IGRlZXBQcm9wKGl0bSwgZmlsdGVyRmllbGQpID09PSBmaWx0ZXJWYWx1ZSk7XG4gIH1cblxuICBhc3luYyBfc2tpbGxEYXRhKGRhdGEpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdza2lsbCcsICdza2lsbHMnKTtcbiAgICAvLyBHcm91cCBza2lsbHMgYnkgdGhlaXIgcG9vbCwgdGhlbiBhbHBoYW51bWVyaWNhbGx5XG4gICAgZGF0YS5kYXRhLml0ZW1zLnNraWxscy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICBpZiAoYS5kYXRhLnBvb2wgPT09IGIuZGF0YS5wb29sKSB7XG4gICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGEuZGF0YS5wb29sID4gYi5kYXRhLnBvb2wpID8gMSA6IC0xO1xuICAgIH0pO1xuXG4gICAgZGF0YS5za2lsbHNQb29sRmlsdGVyID0gdGhpcy5za2lsbHNQb29sRmlsdGVyO1xuICAgIGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSB0aGlzLnNraWxsc1RyYWluaW5nRmlsdGVyO1xuXG4gICAgaWYgKGRhdGEuc2tpbGxzUG9vbEZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ2RhdGEucG9vbCcsIHBhcnNlSW50KGRhdGEuc2tpbGxzUG9vbEZpbHRlciwgMTApKTtcbiAgICB9XG4gICAgaWYgKGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ3NraWxscycsICdkYXRhLnRyYWluaW5nJywgcGFyc2VJbnQoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciwgMTApKTtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkU2tpbGwgPSB0aGlzLnNlbGVjdGVkU2tpbGw7XG4gICAgZGF0YS5za2lsbEluZm8gPSAnJztcbiAgICBpZiAoZGF0YS5zZWxlY3RlZFNraWxsKSB7XG4gICAgICBkYXRhLnNraWxsSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRTa2lsbC5nZXRJbmZvKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2FiaWxpdHlEYXRhKGRhdGEpIHtcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdhYmlsaXR5JywgJ2FiaWxpdGllcycpO1xuICAgIC8vIEdyb3VwIGFiaWxpdGllcyBieSB0aGVpciBwb29sLCB0aGVuIGFscGhhbnVtZXJpY2FsbHlcbiAgICBkYXRhLmRhdGEuaXRlbXMuYWJpbGl0aWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmRhdGEuY29zdC5wb29sID09PSBiLmRhdGEuY29zdC5wb29sKSB7XG4gICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKGEuZGF0YS5jb3N0LnBvb2wgPiBiLmRhdGEuY29zdC5wb29sKSA/IDEgOiAtMTtcbiAgICB9KTtcblxuICAgIGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPSB0aGlzLmFiaWxpdHlQb29sRmlsdGVyO1xuXG4gICAgaWYgKGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ2FiaWxpdGllcycsICdkYXRhLmNvc3QucG9vbCcsIHBhcnNlSW50KGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIsIDEwKSk7XG4gICAgfVxuXG4gICAgZGF0YS5zZWxlY3RlZEFiaWxpdHkgPSB0aGlzLnNlbGVjdGVkQWJpbGl0eTtcbiAgICBkYXRhLmFiaWxpdHlJbmZvID0gJyc7XG4gICAgaWYgKGRhdGEuc2VsZWN0ZWRBYmlsaXR5KSB7XG4gICAgICBkYXRhLmFiaWxpdHlJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZEFiaWxpdHkuZ2V0SW5mbygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9pbnZlbnRvcnlEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmludmVudG9yeVR5cGVzID0gQ1NSLmludmVudG9yeVR5cGVzO1xuXG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XG4gICAgaWYgKCFpdGVtcy5pbnZlbnRvcnkpIHtcbiAgICAgIGl0ZW1zLmludmVudG9yeSA9IGl0ZW1zLmZpbHRlcihpID0+IENTUi5pbnZlbnRvcnlUeXBlcy5pbmNsdWRlcyhpLnR5cGUpKTtcblxuICAgICAgaWYgKHRoaXMuZmlsdGVyRXF1aXBwZWQpIHtcbiAgICAgICAgaXRlbXMuaW52ZW50b3J5ID0gaXRlbXMuaW52ZW50b3J5LmZpbHRlcihpID0+ICEhaS5kYXRhLmVxdWlwcGVkKTtcbiAgICAgIH1cblxuICAgICAgLy8gR3JvdXAgaXRlbXMgYnkgdGhlaXIgdHlwZSwgdGhlbiBhbHBoYW51bWVyaWNhbGx5XG4gICAgICBpdGVtcy5pbnZlbnRvcnkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICBpZiAoYS50eXBlID09PSBiLnR5cGUpIHtcbiAgICAgICAgICByZXR1cm4gKGEubmFtZSA+IGIubmFtZSkgPyAxIDogLTFcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoYS50eXBlID4gYi50eXBlKSA/IDEgOiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRhdGEuY3lwaGVyQ291bnQgPSBpdGVtcy5yZWR1Y2UoKGNvdW50LCBpKSA9PiBpLnR5cGUgPT09ICdjeXBoZXInID8gKytjb3VudCA6IGNvdW50LCAwKTtcbiAgICBkYXRhLm92ZXJDeXBoZXJMaW1pdCA9IHRoaXMuYWN0b3IuaXNPdmVyQ3lwaGVyTGltaXQ7XG5cbiAgICBkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIgPSB0aGlzLmludmVudG9yeVR5cGVGaWx0ZXI7XG4gICAgZGF0YS5maWx0ZXJFcXVpcHBlZCA9IHRoaXMuZmlsdGVyRXF1aXBwZWQ7XG5cbiAgICBpZiAoZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyID4gLTEpIHtcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdpbnZlbnRvcnknLCAndHlwZScsIENTUi5pbnZlbnRvcnlUeXBlc1twYXJzZUludChkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIsIDEwKV0pO1xuICAgIH1cblxuICAgIGRhdGEuc2VsZWN0ZWRJbnZJdGVtID0gdGhpcy5zZWxlY3RlZEludkl0ZW07XG4gICAgZGF0YS5pbnZJdGVtSW5mbyA9ICcnO1xuICAgIGlmIChkYXRhLnNlbGVjdGVkSW52SXRlbSkge1xuICAgICAgZGF0YS5pbnZJdGVtSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRJbnZJdGVtLmdldEluZm8oKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBfcGNEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcblxuICAgIGRhdGEuY3VycmVuY3lOYW1lID0gZ2FtZS5zZXR0aW5ncy5nZXQoJ2N5cGhlcnN5c3RlbScsICdjdXJyZW5jeU5hbWUnKTtcblxuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEud2VhcG9uVHlwZXMgPSBDU1Iud2VhcG9uVHlwZXM7XG4gICAgZGF0YS53ZWlnaHRzID0gQ1NSLndlaWdodENsYXNzZXM7XG5cbiAgICBkYXRhLmFkdmFuY2VzID0gT2JqZWN0LmVudHJpZXMoZGF0YS5hY3Rvci5kYXRhLmFkdmFuY2VzKS5tYXAoXG4gICAgICAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi5hZHZhbmNlLiR7a2V5fWApLFxuICAgICAgICAgIGlzQ2hlY2tlZDogdmFsdWUsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKTtcblxuICAgIGRhdGEuZGFtYWdlVHJhY2tEYXRhID0gQ1NSLmRhbWFnZVRyYWNrO1xuICAgIGRhdGEuZGFtYWdlVHJhY2sgPSBDU1IuZGFtYWdlVHJhY2tbZGF0YS5kYXRhLmRhbWFnZVRyYWNrXTtcblxuICAgIGRhdGEucmVjb3Zlcmllc0RhdGEgPSBPYmplY3QuZW50cmllcyhcbiAgICAgIGRhdGEuYWN0b3IuZGF0YS5yZWNvdmVyaWVzXG4gICAgKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5LFxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IucmVjb3ZlcnkuJHtrZXl9YCksXG4gICAgICAgIGNoZWNrZWQ6IHZhbHVlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGRhdGEudHJhaW5pbmdMZXZlbHMgPSBDU1IudHJhaW5pbmdMZXZlbHM7XG5cbiAgICBkYXRhLmRhdGEuaXRlbXMgPSBkYXRhLmFjdG9yLml0ZW1zIHx8IHt9O1xuXG4gICAgYXdhaXQgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX2FiaWxpdHlEYXRhKGRhdGEpO1xuICAgIGF3YWl0IHRoaXMuX2ludmVudG9yeURhdGEoZGF0YSk7XG4gIH1cblxuICBhc3luYyBfbnBjRGF0YShkYXRhKSB7XG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhc3luYyBnZXREYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3BjJzpcbiAgICAgICAgYXdhaXQgdGhpcy5fcGNEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIGF3YWl0IHRoaXMuX25wY0RhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX2NyZWF0ZUl0ZW0oaXRlbU5hbWUpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHtcbiAgICAgIG5hbWU6IGBOZXcgJHtpdGVtTmFtZS5jYXBpdGFsaXplKCl9YCxcbiAgICAgIHR5cGU6IGl0ZW1OYW1lLFxuICAgICAgZGF0YTogbmV3IEN5cGhlclN5c3RlbUl0ZW0oe30pLFxuICAgIH07XG5cbiAgICB0aGlzLmFjdG9yLmNyZWF0ZU93bmVkSXRlbShpdGVtRGF0YSwgeyByZW5kZXJTaGVldDogdHJ1ZSB9KTtcbiAgfVxuXG4gIF9yb2xsUG9vbERpYWxvZyhwb29sKSB7XG4gICAgY29uc3QgeyBhY3RvciB9ID0gdGhpcztcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG5cbiAgICBjeXBoZXJSb2xsKHtcbiAgICAgIHBhcnRzOiBbJzFkMjAnXSxcblxuICAgICAgZGF0YToge1xuICAgICAgICBwb29sLFxuICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnQsXG4gICAgICB9LFxuICAgICAgZXZlbnQsXG5cbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnBvb2wudGl0bGUnKSxcbiAgICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5wb29sLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLnJlcGxhY2UoJyMjUE9PTCMjJywgcG9vbE5hbWUpLFxuXG4gICAgICBhY3RvcixcbiAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIF9yb2xsUmVjb3ZlcnkoKSB7XG4gICAgY29uc3QgeyBhY3RvciB9ID0gdGhpcztcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XG5cbiAgICBjb25zdCByb2xsID0gbmV3IFJvbGwoYDFkNiske2FjdG9yRGF0YS5yZWNvdmVyeU1vZH1gKS5yb2xsKCk7XG5cbiAgICAvLyBGbGFnIHRoZSByb2xsIGFzIGEgcmVjb3Zlcnkgcm9sbFxuICAgIHJvbGwuZGljZVswXS5vcHRpb25zLnJlY292ZXJ5ID0gdHJ1ZTtcblxuICAgIHJvbGwudG9NZXNzYWdlKHtcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnJlY292ZXJ5LnRpdGxlJyksXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucmVjb3ZlcnkuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IubmFtZSksXG4gICAgfSk7XG4gIH1cblxuICBfZGVsZXRlSXRlbURpYWxvZyhpdGVtSWQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgY29uZmlybWF0aW9uRGlhbG9nID0gbmV3IERpYWxvZyh7XG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5kZWxldGUudGl0bGVcIiksXG4gICAgICBjb250ZW50OiBgPHA+JHtnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmRlbGV0ZS5jb250ZW50XCIpfTwvcD48aHIgLz5gLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBjb25maXJtOiB7XG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuYnV0dG9uLmRlbGV0ZVwiKSxcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hY3Rvci5kZWxldGVPd25lZEl0ZW0oaXRlbUlkKTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2FuY2VsOiB7XG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPicsXG4gICAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuYnV0dG9uLmNhbmNlbFwiKSxcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiBcImNhbmNlbFwiXG4gICAgfSk7XG4gICAgY29uZmlybWF0aW9uRGlhbG9nLnJlbmRlcih0cnVlKTtcbiAgfVxuXG4gIF9zdGF0c1RhYkxpc3RlbmVycyhodG1sKSB7XG4gICAgLy8gU3RhdHMgU2V0dXBcbiAgICBodG1sLmZpbmQoJy5yb2xsLXBvb2wnKS5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQucG9vbCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHBvb2wgfSA9IGVsLmRhdGFzZXQ7XG5cbiAgICAgIHRoaXMuX3JvbGxQb29sRGlhbG9nKHBhcnNlSW50KHBvb2wsIDEwKSk7XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5kYW1hZ2VUcmFja1wiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCcucmVjb3Zlcnktcm9sbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fcm9sbFJlY292ZXJ5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpIHtcbiAgICAvLyBTa2lsbHMgU2V0dXBcbiAgICBodG1sLmZpbmQoJy5hZGQtc2tpbGwnKS5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuX2NyZWF0ZUl0ZW0oJ3NraWxsJyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBza2lsbHNQb29sRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInNraWxsc1Bvb2xGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBza2lsbHNQb29sRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5za2lsbHNQb29sRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBza2lsbHNUcmFpbmluZ0ZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJza2lsbHNUcmFpbmluZ0ZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIHNraWxsc1RyYWluaW5nRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgfSk7XG5cbiAgICBjb25zdCBza2lsbHMgPSBodG1sLmZpbmQoJ2Euc2tpbGwnKTtcblxuICAgIHNraWxscy5vbignY2xpY2snLCBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuX29uU3VibWl0KGV2dCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pdGVtSWQpIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgY29uc3Qgc2tpbGxJZCA9IGVsLmRhdGFzZXQuaXRlbUlkO1xuXG4gICAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XG4gICAgICBjb25zdCBza2lsbCA9IGFjdG9yLmdldE93bmVkSXRlbShza2lsbElkKTtcblxuICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gc2tpbGw7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5hY3Rvci5vd25lcikge1xuICAgICAgY29uc3QgaGFuZGxlciA9IGV2ID0+IHRoaXMuX29uRHJhZ0l0ZW1TdGFydChldik7XG4gICAgICBza2lsbHMuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZWxlY3RlZFNraWxsIH0gPSB0aGlzO1xuICAgIGlmIChzZWxlY3RlZFNraWxsKSB7XG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0ZWRTa2lsbC5yb2xsKCk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbC5zaGVldC5yZW5kZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAuZGVsZXRlJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fZGVsZXRlSXRlbURpYWxvZyh0aGlzLnNlbGVjdGVkU2tpbGwuX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF9hYmlsaXR5VGFiTGlzdGVuZXJzKGh0bWwpIHtcbiAgICAvLyBBYmlsaXRpZXMgU2V0dXBcbiAgICBodG1sLmZpbmQoJy5hZGQtYWJpbGl0eScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnYWJpbGl0eScpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWJpbGl0eVBvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiYWJpbGl0eVBvb2xGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBhYmlsaXR5UG9vbEZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcbiAgICAgIHRoaXMuYWJpbGl0eVBvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWJpbGl0aWVzID0gaHRtbC5maW5kKCdhLmFiaWxpdHknKTtcblxuICAgIGFiaWxpdGllcy5vbignY2xpY2snLCBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuX29uU3VibWl0KGV2dCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pdGVtSWQpIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgY29uc3QgYWJpbGl0eUlkID0gZWwuZGF0YXNldC5pdGVtSWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IGFiaWxpdHkgPSBhY3Rvci5nZXRPd25lZEl0ZW0oYWJpbGl0eUlkKTtcblxuICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBhYmlsaXR5O1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuYWN0b3Iub3duZXIpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBldiA9PiB0aGlzLl9vbkRyYWdJdGVtU3RhcnQoZXYpO1xuICAgICAgYWJpbGl0aWVzLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgdHJ1ZSk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc2VsZWN0ZWRBYmlsaXR5IH0gPSB0aGlzO1xuICAgIGlmIChzZWxlY3RlZEFiaWxpdHkpIHtcbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAucm9sbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHNlbGVjdGVkQWJpbGl0eS5yb2xsKCk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuYWJpbGl0eS1pbmZvIC5hY3Rpb25zIC5lZGl0JykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkuc2hlZXQucmVuZGVyKHRydWUpO1xuICAgICAgfSk7XG5cbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAuZGVsZXRlJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5fZGVsZXRlSXRlbURpYWxvZyh0aGlzLnNlbGVjdGVkQWJpbGl0eS5faWQsIGRpZERlbGV0ZSA9PiB7XG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfaW52ZW50b3J5VGFiTGlzdGVuZXJzKGh0bWwpIHtcbiAgICAvLyBJbnZlbnRvcnkgU2V0dXBcblxuICAgIGNvbnN0IGN0eHRNZW51RWwgPSBodG1sLmZpbmQoJy5jb250ZXh0bWVudScpO1xuICAgIGNvbnN0IGFkZEludkJ0biA9IGh0bWwuZmluZCgnLmFkZC1pbnZlbnRvcnknKTtcblxuICAgIGNvbnN0IG1lbnVJdGVtcyA9IFtdO1xuICAgIENTUi5pbnZlbnRvcnlUeXBlcy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgbWVudUl0ZW1zLnB1c2goe1xuICAgICAgICBuYW1lOiBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi5pbnZlbnRvcnkuJHt0eXBlfWApLFxuICAgICAgICBpY29uOiAnJyxcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLl9jcmVhdGVJdGVtKHR5cGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBjdHh0TWVudU9iaiA9IG5ldyBDb250ZXh0TWVudShodG1sLCAnLmFjdGl2ZScsIG1lbnVJdGVtcyk7XG5cbiAgICBhZGRJbnZCdG4uY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAvLyBBIGJpdCBvZiBhIGhhY2sgdG8gZW5zdXJlIHRoZSBjb250ZXh0IG1lbnUgaXNuJ3RcbiAgICAgIC8vIGN1dCBvZmYgZHVlIHRvIHRoZSBzaGVldCdzIGNvbnRlbnQgcmVseWluZyBvblxuICAgICAgLy8gb3ZlcmZsb3cgaGlkZGVuLiBJbnN0ZWFkLCB3ZSBuZXN0IHRoZSBtZW51IGluc2lkZVxuICAgICAgLy8gYSBmbG9hdGluZyBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZGl2LCBzZXQgdG8gb3ZlcmxhcFxuICAgICAgLy8gdGhlIGFkZCBpbnZlbnRvcnkgaXRlbSBpY29uLlxuICAgICAgY3R4dE1lbnVFbC5vZmZzZXQoYWRkSW52QnRuLm9mZnNldCgpKTtcblxuICAgICAgY3R4dE1lbnVPYmoucmVuZGVyKGN0eHRNZW51RWwuZmluZCgnLmNvbnRhaW5lcicpKTtcbiAgICB9KTtcblxuICAgIGh0bWwub24oJ21vdXNlZG93bicsIGV2dCA9PiB7XG4gICAgICBpZiAoZXZ0LnRhcmdldCA9PT0gYWRkSW52QnRuWzBdKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQ2xvc2UgdGhlIGNvbnRleHQgbWVudSBpZiB1c2VyIGNsaWNrcyBhbnl3aGVyZSBlbHNlXG4gICAgICBjdHh0TWVudU9iai5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW52ZW50b3J5VHlwZUZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJpbnZlbnRvcnlUeXBlRmlsdGVyXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gICAgaW52ZW50b3J5VHlwZUZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcbiAgICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJy5maWx0ZXItZXF1aXBwZWQnKS5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuZmlsdGVyRXF1aXBwZWQgPSAhdGhpcy5maWx0ZXJFcXVpcHBlZDtcblxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGludkl0ZW1zID0gaHRtbC5maW5kKCdhLmludi1pdGVtJyk7XG5cbiAgICBpbnZJdGVtcy5vbignY2xpY2snLCBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuX29uU3VibWl0KGV2dCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pdGVtSWQpIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgY29uc3QgaW52SXRlbUlkID0gZWwuZGF0YXNldC5pdGVtSWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IGludkl0ZW0gPSBhY3Rvci5nZXRPd25lZEl0ZW0oaW52SXRlbUlkKTtcblxuICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBpbnZJdGVtO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuYWN0b3Iub3duZXIpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSBldiA9PiB0aGlzLl9vbkRyYWdJdGVtU3RhcnQoZXYpO1xuICAgICAgaW52SXRlbXMuZWFjaCgoXywgZWwpID0+IHtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkcmFnZ2FibGUnLCB0cnVlKTtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgeyBzZWxlY3RlZEludkl0ZW0gfSA9IHRoaXM7XG4gICAgaWYgKHNlbGVjdGVkSW52SXRlbSkge1xuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbS5zaGVldC5yZW5kZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEludkl0ZW0uX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3BjTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0LmFjdG9yJykuYWRkQ2xhc3MoJ3BjLXdpbmRvdycpO1xuXG4gICAgLy8gSGFjaywgZm9yIHNvbWUgcmVhc29uIHRoZSBpbm5lciB0YWIncyBjb250ZW50IGRvZXNuJ3Qgc2hvdyBcbiAgICAvLyB3aGVuIGNoYW5naW5nIHByaW1hcnkgdGFicyB3aXRoaW4gdGhlIHNoZWV0XG4gICAgaHRtbC5maW5kKCcuaXRlbVtkYXRhLXRhYj1cInN0YXRzXCJdJykuY2xpY2soKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJUYWIgPSBodG1sLmZpbmQoJy5zdGF0cy10YWJzIC5pdGVtLmFjdGl2ZScpLmZpcnN0KCk7XG4gICAgICBjb25zdCBzZWxlY3RlZFN1YlBhZ2UgPSBodG1sLmZpbmQoYC5zdGF0cy1ib2R5IC50YWJbZGF0YS10YWI9XCIke3NlbGVjdGVkU3ViVGFiLmRhdGEoJ3RhYicpfVwiXWApO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2VsZWN0ZWRTdWJQYWdlLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5fc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpO1xuICAgIHRoaXMuX2FiaWxpdHlUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5faW52ZW50b3J5VGFiTGlzdGVuZXJzKGh0bWwpO1xuICB9XG5cbiAgX25wY0xpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5hY3RvcicpLmFkZENsYXNzKCducGMtd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5tb3ZlbWVudFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICB0aGlzLl9wY0xpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9ucGNMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgX29uRHJhZ0l0ZW1TdGFydChldmVudCkge1xuICAgIGNvbnN0IGl0ZW1JZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pdGVtSWQ7XG4gICAgY29uc3QgY2xpY2tlZEl0ZW0gPSB0aGlzLmFjdG9yLmdldEVtYmVkZGVkRW50aXR5KCdPd25lZEl0ZW0nLCBpdGVtSWQpXG5cbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICd0ZXh0L3BsYWluJyxcblxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBhY3RvcklkOiB0aGlzLmFjdG9yLmlkLFxuICAgICAgICBkYXRhOiBjbGlja2VkSXRlbSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBzdXBlci5fb25EcmFnSXRlbVN0YXJ0KGV2ZW50KTtcbiAgfVxufVxuIiwiLyogZ2xvYmFsIEFjdG9yOmZhbHNlICovXG5cbmltcG9ydCB7IENTUiB9IGZyb20gJy4uL2NvbmZpZy5qcyc7XG5pbXBvcnQgeyB2YWxPckRlZmF1bHQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCB7IFBsYXllckNob2ljZURpYWxvZyB9IGZyb20gJy4uL2RpYWxvZy9wbGF5ZXItY2hvaWNlLWRpYWxvZy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2UgQWN0b3IgZW50aXR5IGJ5IGRlZmluaW5nIGEgY3VzdG9tIHJvbGwgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggaXMgaWRlYWwgZm9yIHRoZSBTaW1wbGUgc3lzdGVtLlxuICogQGV4dGVuZHMge0FjdG9yfVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3IgZXh0ZW5kcyBBY3RvciB7XG4gIC8qKlxuICAgKiBQcmVwYXJlIENoYXJhY3RlciB0eXBlIHNwZWNpZmljIGRhdGFcbiAgICovXG4gIF9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYWN0b3JEYXRhO1xuXG4gICAgZGF0YS5zZW50ZW5jZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNlbnRlbmNlLCB7XG4gICAgICBkZXNjcmlwdG9yOiAnJyxcbiAgICAgIHR5cGU6ICcnLFxuICAgICAgZm9jdXM6ICcnXG4gICAgfSk7XG5cbiAgICBkYXRhLnRpZXIgPSB2YWxPckRlZmF1bHQoZGF0YS50aWVyLCAxKTtcbiAgICBkYXRhLmVmZm9ydCA9IHZhbE9yRGVmYXVsdChkYXRhLmVmZm9ydCwgMSk7XG4gICAgZGF0YS54cCA9IHZhbE9yRGVmYXVsdChkYXRhLnhwLCAwKTtcbiAgICBkYXRhLmN5cGhlckxpbWl0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY3lwaGVyTGltaXQsIDEpO1xuXG4gICAgZGF0YS5hZHZhbmNlcyA9IHZhbE9yRGVmYXVsdChkYXRhLmFkdmFuY2VzLCB7XG4gICAgICBzdGF0czogZmFsc2UsXG4gICAgICBlZGdlOiBmYWxzZSxcbiAgICAgIGVmZm9ydDogZmFsc2UsXG4gICAgICBza2lsbHM6IGZhbHNlLFxuICAgICAgb3RoZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBkYXRhLnJlY292ZXJ5TW9kID0gdmFsT3JEZWZhdWx0KGRhdGEucmVjb3ZlcnlNb2QsIDEpO1xuICAgIGRhdGEucmVjb3ZlcmllcyA9IHZhbE9yRGVmYXVsdChkYXRhLnJlY292ZXJpZXMsIHtcbiAgICAgIGFjdGlvbjogZmFsc2UsXG4gICAgICB0ZW5NaW5zOiBmYWxzZSxcbiAgICAgIG9uZUhvdXI6IGZhbHNlLFxuICAgICAgdGVuSG91cnM6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBkYXRhLmRhbWFnZVRyYWNrID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlVHJhY2ssIDApO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMCk7XG5cbiAgICBkYXRhLnN0YXRzID0gdmFsT3JEZWZhdWx0KGRhdGEuc3RhdHMsIHtcbiAgICAgIG1pZ2h0OiB7XG4gICAgICAgIHZhbHVlOiAwLFxuICAgICAgICBwb29sOiAwLFxuICAgICAgICBlZGdlOiAwXG4gICAgICB9LFxuICAgICAgc3BlZWQ6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH0sXG4gICAgICBpbnRlbGxlY3Q6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRhdGEubW9uZXkgPSB2YWxPckRlZmF1bHQoZGF0YS5tb25leSwgMCk7XG4gIH1cblxuICBfcHJlcGFyZU5QQ0RhdGEoYWN0b3JEYXRhKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhY3RvckRhdGE7XG5cbiAgICBkYXRhLmxldmVsID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWwsIDEpO1xuXG4gICAgZGF0YS5oZWFsdGggPSB2YWxPckRlZmF1bHQoZGF0YS5oZWFsdGgsIDMpO1xuICAgIGRhdGEuZGFtYWdlID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlLCAxKTtcbiAgICBkYXRhLmFybW9yID0gdmFsT3JEZWZhdWx0KGRhdGEuYXJtb3IsIDApO1xuICAgIGRhdGEubW92ZW1lbnQgPSB2YWxPckRlZmF1bHQoZGF0YS5tb3ZlbWVudCwgMSk7XG5cbiAgICBkYXRhLmRlc2NyaXB0aW9uID0gdmFsT3JEZWZhdWx0KGRhdGEuZGVzY3JpcHRpb24sICcnKTtcbiAgICBkYXRhLm1vdGl2ZSA9IHZhbE9yRGVmYXVsdChkYXRhLm1vdGl2ZSwgJycpO1xuICAgIGRhdGEuZW52aXJvbm1lbnQgPSB2YWxPckRlZmF1bHQoZGF0YS5lbnZpcm9ubWVudCwgJycpO1xuICAgIGRhdGEubW9kaWZpY2F0aW9ucyA9IHZhbE9yRGVmYXVsdChkYXRhLm1vZGlmaWNhdGlvbnMsICcnKTtcbiAgICBkYXRhLmNvbWJhdCA9IHZhbE9yRGVmYXVsdChkYXRhLmNvbWJhdCwgJycpO1xuICAgIGRhdGEuaW50ZXJhY3Rpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5pbnRlcmFjdGlvbiwgJycpO1xuICAgIGRhdGEudXNlID0gdmFsT3JEZWZhdWx0KGRhdGEudXNlLCAnJyk7XG4gICAgZGF0YS5sb290ID0gdmFsT3JEZWZhdWx0KGRhdGEubG9vdCwgJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIGFjdG9yIGRhdGEgd2l0aCBhZGRpdGlvbmFsIGR5bmFtaWMgZGF0YS5cbiAgICovXG4gIHByZXBhcmVEYXRhKCkge1xuICAgIHN1cGVyLnByZXBhcmVEYXRhKCk7XG5cbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgZGF0YSA9IGFjdG9yRGF0YS5kYXRhO1xuICAgIGNvbnN0IGZsYWdzID0gYWN0b3JEYXRhLmZsYWdzO1xuXG4gICAgY29uc3QgeyB0eXBlIH0gPSBhY3RvckRhdGE7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdwYyc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVQQ0RhdGEoYWN0b3JEYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9wcmVwYXJlTlBDRGF0YShhY3RvckRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBnZXQgaW5pdGlhdGl2ZUxldmVsKCkge1xuICAgIGNvbnN0IGluaXRTa2lsbCA9IHRoaXMuZGF0YS5pdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09ICdza2lsbCcgJiYgaS5kYXRhLmZsYWdzLmluaXRpYXRpdmUpWzBdO1xuICAgIHJldHVybiBpbml0U2tpbGwuZGF0YS50cmFpbmluZyAtIDE7XG4gIH1cblxuICBnZXQgY2FuUmVmdXNlSW50cnVzaW9uKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcy5kYXRhO1xuXG4gICAgcmV0dXJuIGRhdGEueHAgPiAwO1xuICB9XG5cbiAgZ2V0IGlzT3ZlckN5cGhlckxpbWl0KCkge1xuICAgIGNvbnN0IGN5cGhlcnMgPSB0aGlzLmdldEVtYmVkZGVkQ29sbGVjdGlvbihcIk93bmVkSXRlbVwiKS5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IFwiY3lwaGVyXCIpO1xuICAgIHJldHVybiB0aGlzLmRhdGEuZGF0YS5jeXBoZXJMaW1pdCA8IGN5cGhlcnMubGVuZ3RoO1xuICB9XG5cbiAgZ2V0U2tpbGxMZXZlbChza2lsbCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gc2tpbGwuZGF0YTtcblxuICAgIHJldHVybiBkYXRhLnRyYWluaW5nIC0gMTtcbiAgfVxuXG4gIGdldEVmZm9ydENvc3RGcm9tU3RhdChwb29sLCBlZmZvcnRMZXZlbCkge1xuICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgY29zdDogMCxcbiAgICAgIGVmZm9ydExldmVsOiAwLFxuICAgICAgd2FybmluZzogbnVsbCxcbiAgICB9O1xuXG4gICAgaWYgKGVmZm9ydExldmVsID09PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIC8vIFRoZSBmaXJzdCBlZmZvcnQgbGV2ZWwgY29zdHMgMyBwdHMgZnJvbSB0aGUgcG9vbCwgZXh0cmEgbGV2ZWxzIGNvc3QgMlxuICAgIC8vIFN1YnN0cmFjdCB0aGUgcmVsYXRlZCBFZGdlLCB0b29cbiAgICBjb25zdCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCA9IChzdGF0LnZhbHVlICsgc3RhdC5lZGdlIC0gMSkgLyAyO1xuXG4gICAgLy8gQSBQQyBjYW4gdXNlIGFzIG11Y2ggYXMgdGhlaXIgRWZmb3J0IHNjb3JlLCBidXQgbm90IG1vcmVcbiAgICAvLyBUaGV5J3JlIGFsc28gbGltaXRlZCBieSB0aGVpciBjdXJyZW50IHBvb2wgdmFsdWVcbiAgICBjb25zdCBmaW5hbEVmZm9ydCA9IE1hdGgubWluKGVmZm9ydExldmVsLCBhY3RvckRhdGEuZWZmb3J0LCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCk7XG4gICAgY29uc3QgY29zdCA9IDEgKyAyICogZmluYWxFZmZvcnQgLSBzdGF0LmVkZ2U7XG5cbiAgICAvLyBUT0RPIHRha2UgZnJlZSBsZXZlbHMgb2YgRWZmb3J0IGludG8gYWNjb3VudCBoZXJlXG5cbiAgICBsZXQgd2FybmluZyA9IG51bGw7XG4gICAgaWYgKGVmZm9ydExldmVsID4gYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wpIHtcbiAgICAgIHdhcm5pbmcgPSBgTm90IGVub3VnaCBwb2ludHMgaW4geW91ciAke3Bvb2xOYW1lfSBwb29sIGZvciB0aGF0IGxldmVsIG9mIEVmZm9ydGA7XG4gICAgfVxuXG4gICAgdmFsdWUuY29zdCA9IGNvc3Q7XG4gICAgdmFsdWUuZWZmb3J0TGV2ZWwgPSBmaW5hbEVmZm9ydDtcbiAgICB2YWx1ZS53YXJuaW5nID0gd2FybmluZztcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGdldEVkZ2VGcm9tU3RhdChwb29sKSB7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIHJldHVybiBzdGF0LmVkZ2U7XG4gIH1cblxuICBnZXRGcmVlRWZmb3J0RnJvbVN0YXQocG9vbCkge1xuICAgIGNvbnN0IGVkZ2UgPSB0aGlzLmdldEVkZ2VGcm9tU3RhdChwb29sKTtcblxuICAgIHJldHVybiBNYXRoLmZsb29yKChlZGdlIC0gMSkgLyAyKTtcbiAgfVxuXG4gIGNhblNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50LCBhcHBseUVkZ2UgPSB0cnVlKSB7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF0udG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lXTtcbiAgICBjb25zdCBwb29sQW1vdW50ID0gc3RhdC52YWx1ZTtcblxuICAgIHJldHVybiAoYXBwbHlFZGdlID8gYW1vdW50IC0gc3RhdC5lZGdlIDogYW1vdW50KSA8PSBwb29sQW1vdW50O1xuICB9XG5cbiAgc3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpIHtcbiAgICBpZiAoIXRoaXMuY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICBkYXRhW2BkYXRhLnN0YXRzLiR7cG9vbE5hbWUudG9Mb3dlckNhc2UoKX0udmFsdWVgXSA9IE1hdGgubWF4KDAsIHN0YXQudmFsdWUgLSBhbW91bnQpO1xuICAgIHRoaXMudXBkYXRlKGRhdGEpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBvbkdNSW50cnVzaW9uKGFjY2VwdGVkKSB7XG4gICAgbGV0IHhwID0gdGhpcy5kYXRhLmRhdGEueHA7XG4gICAgXG4gICAgbGV0IGNoYXRDb250ZW50ID0gYDxoMj4ke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5jaGF0LmhlYWRpbmcnKX08L2gyPjxicj5gO1xuICAgIGlmIChhY2NlcHRlZCkge1xuICAgICAgeHArKztcblxuICAgICAgY2hhdENvbnRlbnQgKz0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW50cnVzaW9uLmNoYXQuYWNjZXB0JykucmVwbGFjZSgnIyNBQ1RPUiMjJywgdGhpcy5kYXRhLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB4cC0tO1xuXG4gICAgICBjaGF0Q29udGVudCArPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnRydXNpb24uY2hhdC5yZWZ1c2UnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCB0aGlzLmRhdGEubmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLl9pZCxcbiAgICAgICdkYXRhLnhwJzogeHAsXG4gICAgfSk7XG5cbiAgICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgICAgY29udGVudDogY2hhdENvbnRlbnRcbiAgICB9KTtcblxuICAgIGlmIChhY2NlcHRlZCkge1xuICAgICAgY29uc3Qgb3RoZXJBY3RvcnMgPSBnYW1lLmFjdG9ycy5maWx0ZXIoYWN0b3IgPT4gYWN0b3IuX2lkICE9PSB0aGlzLl9pZCAmJiBhY3Rvci5kYXRhLnR5cGUgPT09ICdwYycpO1xuXG4gICAgICBjb25zdCBkaWFsb2cgPSBuZXcgUGxheWVyQ2hvaWNlRGlhbG9nKG90aGVyQWN0b3JzLCAoY2hvc2VuQWN0b3JJZCkgPT4ge1xuICAgICAgICBnYW1lLnNvY2tldC5lbWl0KCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywge1xuICAgICAgICAgIHR5cGU6ICdhd2FyZFhQJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhY3RvcklkOiBjaG9zZW5BY3RvcklkLFxuICAgICAgICAgICAgeHBBbW91bnQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIGRpYWxvZy5yZW5kZXIodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlRW1iZWRkZWRFbnRpdHkoLi4uYXJncykge1xuICAgIGNvbnN0IFtfLCBkYXRhXSA9IGFyZ3M7XG5cbiAgICAvLyBSb2xsIHRoZSBcImxldmVsIGRpZVwiIHRvIGRldGVybWluZSB0aGUgaXRlbSdzIGxldmVsLCBpZiBwb3NzaWJsZVxuICAgIGlmIChkYXRhLmRhdGEgJiYgQ1NSLmhhc0xldmVsRGllLmluY2x1ZGVzKGRhdGEudHlwZSkpIHtcbiAgICAgIGNvbnN0IGl0ZW1EYXRhID0gZGF0YS5kYXRhO1xuXG4gICAgICBpZiAoIWl0ZW1EYXRhLmxldmVsICYmIGl0ZW1EYXRhLmxldmVsRGllKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2VlIGlmIHRoZSBmb3JtdWxhIGlzIHZhbGlkXG4gICAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBuZXcgUm9sbChpdGVtRGF0YS5sZXZlbERpZSkucm9sbCgpLnRvdGFsO1xuICAgICAgICAgIGF3YWl0IHRoaXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogdGhpcy5faWQsXG4gICAgICAgICAgICBcImRhdGEubGV2ZWxcIjogaXRlbURhdGEubGV2ZWwsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBJZiBub3QsIGZhbGxiYWNrIHRvIHNhbmUgZGVmYXVsdFxuICAgICAgICAgIGl0ZW1EYXRhLmxldmVsID0gaXRlbURhdGEubGV2ZWwgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBpdGVtRGF0YS5sZXZlbCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5jcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcm9sbFRleHQgfSBmcm9tICcuL3JvbGxzLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoYXRNZXNzYWdlKGNoYXRNZXNzYWdlLCBodG1sLCBkYXRhKSB7XG4gIC8vIERvbid0IGFwcGx5IENoYXRNZXNzYWdlIGVuaGFuY2VtZW50IHRvIHJlY292ZXJ5IHJvbGxzXG4gIGlmIChjaGF0TWVzc2FnZS5yb2xsICYmICFjaGF0TWVzc2FnZS5yb2xsLmRpY2VbMF0ub3B0aW9ucy5yZWNvdmVyeSkge1xuICAgIGNvbnN0IGRpZVJvbGwgPSBjaGF0TWVzc2FnZS5yb2xsLmRpY2VbMF0ucm9sbHNbMF0ucm9sbDtcbiAgICBjb25zdCByb2xsVG90YWwgPSBjaGF0TWVzc2FnZS5yb2xsLnRvdGFsO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gcm9sbFRleHQoZGllUm9sbCwgcm9sbFRvdGFsKTtcbiAgICBjb25zdCBudW1NZXNzYWdlcyA9IG1lc3NhZ2VzLmxlbmd0aDtcblxuICAgIGNvbnN0IG1lc3NhZ2VDb250YWluZXIgPSAkKCc8ZGl2Lz4nKTtcbiAgICBtZXNzYWdlQ29udGFpbmVyLmFkZENsYXNzKCdzcGVjaWFsLW1lc3NhZ2VzJyk7XG5cbiAgICBtZXNzYWdlcy5mb3JFYWNoKChzcGVjaWFsLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHsgdGV4dCwgY29sb3IsIGNscyB9ID0gc3BlY2lhbDtcblxuICAgICAgY29uc3QgbmV3Q29udGVudCA9IGA8c3BhbiBjbGFzcz1cIiR7Y2xzfVwiIHN0eWxlPVwiY29sb3I6ICR7Y29sb3J9XCI+JHt0ZXh0fTwvc3Bhbj4ke2lkeCA8IG51bU1lc3NhZ2VzIC0gMSA/ICc8YnIgLz4nIDogJyd9YDtcblxuICAgICAgbWVzc2FnZUNvbnRhaW5lci5hcHBlbmQobmV3Q29udGVudCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkdCA9IGh0bWwuZmluZChcIi5kaWNlLXRvdGFsXCIpO1xuICAgIG1lc3NhZ2VDb250YWluZXIuaW5zZXJ0QmVmb3JlKGR0KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBSb2xsIGluaXRpYXRpdmUgZm9yIG9uZSBvciBtdWx0aXBsZSBDb21iYXRhbnRzIHdpdGhpbiB0aGUgQ29tYmF0IGVudGl0eVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGlkcyAgICAgICAgQSBDb21iYXRhbnQgaWQgb3IgQXJyYXkgb2YgaWRzIGZvciB3aGljaCB0byByb2xsXG4gKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBmb3JtdWxhICAgICBBIG5vbi1kZWZhdWx0IGluaXRpYXRpdmUgZm9ybXVsYSB0byByb2xsLiBPdGhlcndpc2UgdGhlIHN5c3RlbSBkZWZhdWx0IGlzIHVzZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gbWVzc2FnZU9wdGlvbnMgICBBZGRpdGlvbmFsIG9wdGlvbnMgd2l0aCB3aGljaCB0byBjdXN0b21pemUgY3JlYXRlZCBDaGF0IE1lc3NhZ2VzXG4gKiBAcmV0dXJuIHtQcm9taXNlLjxDb21iYXQ+fSAgICAgICBBIHByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgdG8gdGhlIHVwZGF0ZWQgQ29tYmF0IGVudGl0eSBvbmNlIHVwZGF0ZXMgYXJlIGNvbXBsZXRlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcm9sbEluaXRpYXRpdmUoaWRzLCBmb3JtdWxhID0gbnVsbCwgbWVzc2FnZU9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBjb21iYXRhbnRVcGRhdGVzID0gW107XG4gIGNvbnN0IG1lc3NhZ2VzID0gW11cblxuICAvLyBGb3JjZSBpZHMgdG8gYmUgYW4gYXJyYXkgc28gb3VyIGZvciBsb29wIGRvZXNuJ3QgYnJlYWtcbiAgaWRzID0gdHlwZW9mIGlkcyA9PT0gJ3N0cmluZycgPyBbaWRzXSA6IGlkcztcbiAgZm9yIChsZXQgaWQgb2YgaWRzKSB7XG4gICAgY29uc3QgY29tYmF0YW50ID0gYXdhaXQgdGhpcy5nZXRDb21iYXRhbnQoaWQpO1xuICAgIGlmIChjb21iYXRhbnQuZGVmZWF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGFjdG9yIH0gPSBjb21iYXRhbnQ7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YTtcbiAgICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yRGF0YTtcblxuICAgIGxldCBpbml0aWF0aXZlO1xuICAgIGxldCByb2xsUmVzdWx0O1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgLy8gUENzIHVzZSBhIHNpbXBsZSBkMjAgcm9sbCBtb2RpZmllZCBieSBhbnkgdHJhaW5pbmcgaW4gYW4gSW5pdGlhdGl2ZSBza2lsbFxuICAgICAgY2FzZSAncGMnOlxuICAgICAgICBjb25zdCBpbml0Qm9udXMgPSBhY3Rvci5pbml0aWF0aXZlTGV2ZWw7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gaW5pdEJvbnVzIDwgMCA/ICctJyA6ICcrJztcbiAgICAgICAgY29uc3Qgcm9sbEZvcm11bGEgPSAnMWQyMCcgKyAoaW5pdEJvbnVzID09PSAwID8gJycgOiBgJHtvcGVyYXRvcn0kezMqTWF0aC5hYnMoaW5pdEJvbnVzKX1gKTtcblxuICAgICAgICBjb25zdCByb2xsID0gbmV3IFJvbGwocm9sbEZvcm11bGEpLnJvbGwoKTtcbiAgICAgICAgaW5pdGlhdGl2ZSA9IE1hdGgubWF4KHJvbGwudG90YWwsIDApOyAvLyBEb24ndCBsZXQgaW5pdGlhdGl2ZSBnbyBiZWxvdyAwXG4gICAgICAgIHJvbGxSZXN1bHQgPSByb2xsLnJlc3VsdDtcbiAgICAgICAgXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBOUENzIGhhdmUgYSBmaXhlZCBpbml0aWF0aXZlIGJhc2VkIG9uIHRoZWlyIGxldmVsXG4gICAgICBjYXNlICducGMnOlxuICAgICAgICBjb25zdCB7IGxldmVsIH0gPSBhY3RvckRhdGEuZGF0YTtcbiAgICAgICAgaW5pdGlhdGl2ZSA9IDMgKiBsZXZlbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29tYmF0YW50VXBkYXRlcy5wdXNoKHtcbiAgICAgIF9pZDogY29tYmF0YW50Ll9pZCxcbiAgICAgIGluaXRpYXRpdmVcbiAgICB9KTtcblxuICAgIC8vIFNpbmNlIE5QQyBpbml0aWF0aXZlIGlzIGZpeGVkLCBkb24ndCBib3RoZXIgc2hvd2luZyBpdCBpbiBjaGF0XG4gICAgaWYgKHR5cGUgPT09ICdwYycpIHtcbiAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IGNvbWJhdGFudDtcbiAgICAgIGNvbnN0IGlzSGlkZGVuID0gdG9rZW4uaGlkZGVuIHx8IGNvbWJhdGFudC5oaWRkZW47XG4gICAgICBjb25zdCB3aGlzcGVyID0gaXNIaWRkZW4gPyBnYW1lLnVzZXJzLmVudGl0aWVzLmZpbHRlcih1ID0+IHUuaXNHTSkgOiAnJztcblxuICAgICAgLy8gVE9ETzogSW1wcm92ZSB0aGUgY2hhdCBtZXNzYWdlLCB0aGlzIGN1cnJlbnRseVxuICAgICAgLy8ganVzdCByZXBsaWNhdGVzIHRoZSBub3JtYWwgcm9sbCBtZXNzYWdlLlxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXJvbGxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS1yZXN1bHRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLWZvcm11bGFcIj4ke3JvbGxSZXN1bHR9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS10b29sdGlwXCI+XG4gICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidG9vbHRpcC1wYXJ0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpY2VcIj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicGFydC1mb3JtdWxhXCI+XG4gICAgICAgICAgICAgICAgICAgIDFkMjBcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwYXJ0LXRvdGFsXCI+JHtpbml0aWF0aXZlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICAgICAgPG9sIGNsYXNzPVwiZGljZS1yb2xsc1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJyb2xsIGRpZSBkMjBcIj4ke2luaXRpYXRpdmV9PC9saT5cbiAgICAgICAgICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpY2UtdG90YWxcIj4ke2luaXRpYXRpdmV9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICBjb25zdCBtZXNzYWdlRGF0YSA9IG1lcmdlT2JqZWN0KHtcbiAgICAgICAgc3BlYWtlcjoge1xuICAgICAgICAgIHNjZW5lOiBjYW52YXMuc2NlbmUuX2lkLFxuICAgICAgICAgIGFjdG9yOiBhY3RvciA/IGFjdG9yLl9pZCA6IG51bGwsXG4gICAgICAgICAgdG9rZW46IHRva2VuLl9pZCxcbiAgICAgICAgICBhbGlhczogdG9rZW4ubmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgd2hpc3BlcixcbiAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbml0aWF0aXZlLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIHRva2VuLm5hbWUpLFxuICAgICAgICBjb250ZW50OiB0ZW1wbGF0ZSxcbiAgICAgIH0sIG1lc3NhZ2VPcHRpb25zKTtcblxuICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb21iYXRhbnRVcGRhdGVzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IHRoaXMudXBkYXRlRW1iZWRkZWRFbnRpdHkoJ0NvbWJhdGFudCcsIGNvbWJhdGFudFVwZGF0ZXMpO1xuXG4gIENoYXRNZXNzYWdlLmNyZWF0ZShtZXNzYWdlcyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJleHBvcnQgY29uc3QgQ1NSID0ge307XG5cbkNTUi5pdGVtVHlwZXMgPSBbXG4gICdza2lsbHMnLFxuICAnYWJpbGl0aWVzJyxcbiAgJ2N5cGhlcnMnLFxuICAnYXJ0aWZhY3RzJyxcbiAgJ29kZGl0aWVzJyxcbiAgJ3dlYXBvbnMnLFxuICAnYXJtb3InLFxuICAnZ2Vhcidcbl07XG5cbkNTUi5pbnZlbnRvcnlUeXBlcyA9IFtcbiAgJ3dlYXBvbicsXG4gICdhcm1vcicsXG4gICdnZWFyJyxcblxuICAnY3lwaGVyJyxcbiAgJ2FydGlmYWN0JyxcbiAgJ29kZGl0eSdcbl07XG5cbkNTUi53ZWlnaHRDbGFzc2VzID0gW1xuICAnbGlnaHQnLFxuICAnbWVkaXVtJyxcbiAgJ2hlYXZ5J1xuXTtcblxuQ1NSLndlYXBvblR5cGVzID0gW1xuICAnYmFzaGluZycsXG4gICdibGFkZWQnLFxuICAncmFuZ2VkJyxcbl1cblxuQ1NSLnN0YXRzID0gW1xuICAnbWlnaHQnLFxuICAnc3BlZWQnLFxuICAnaW50ZWxsZWN0Jyxcbl07XG5cbkNTUi50cmFpbmluZ0xldmVscyA9IFtcbiAgJ2luYWJpbGl0eScsXG4gICd1bnRyYWluZWQnLFxuICAndHJhaW5lZCcsXG4gICdzcGVjaWFsaXplZCdcbl07XG5cbkNTUi5kYW1hZ2VUcmFjayA9IFtcbiAgJ2hhbGUnLFxuICAnaW1wYWlyZWQnLFxuICAnZGViaWxpdGF0ZWQnLFxuICAnZGVhZCdcbl07XG5cbkNTUi5yZWNvdmVyaWVzID0gW1xuICAnYWN0aW9uJyxcbiAgJ3Rlbk1pbnMnLFxuICAnb25lSG91cicsXG4gICd0ZW5Ib3Vycydcbl07XG5cbkNTUi5hZHZhbmNlcyA9IFtcbiAgJ3N0YXRzJyxcbiAgJ2VkZ2UnLFxuICAnZWZmb3J0JyxcbiAgJ3NraWxscycsXG4gICdvdGhlcidcbl07XG5cbkNTUi5yYW5nZXMgPSBbXG4gICdpbW1lZGlhdGUnLFxuICAnc2hvcnQnLFxuICAnbG9uZycsXG4gICd2ZXJ5TG9uZydcbl07XG5cbkNTUi5vcHRpb25hbFJhbmdlcyA9IFtcIm5hXCJdLmNvbmNhdChDU1IucmFuZ2VzKTtcblxuQ1NSLmFiaWxpdHlUeXBlcyA9IFtcbiAgJ2FjdGlvbicsXG4gICdlbmFibGVyJyxcbl07XG5cbkNTUi5zdXBwb3J0c01hY3JvcyA9IFtcbiAgJ3NraWxsJyxcbiAgJ2FiaWxpdHknXG5dO1xuXG5DU1IuaGFzTGV2ZWxEaWUgPSBbXG4gICdjeXBoZXInLFxuICAnYXJ0aWZhY3QnXG5dO1xuIiwiLyogZ2xvYmFscyBFTlRJVFlfUEVSTUlTU0lPTlMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdG9yRGlyZWN0b3J5Q29udGV4dChodG1sLCBlbnRyeU9wdGlvbnMpIHtcbiAgZW50cnlPcHRpb25zLnB1c2goe1xuICAgIG5hbWU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmN0eHQuaW50cnVzaW9uLmhlYWRpbmcnKSxcbiAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtZXhjbGFtYXRpb24tY2lyY2xlXCI+PC9pPicsXG5cbiAgICBjYWxsYmFjazogbGkgPT4ge1xuICAgICAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQobGkuZGF0YSgnZW50aXR5SWQnKSk7XG4gICAgICBjb25zdCBvd25lcklkcyA9IE9iamVjdC5lbnRyaWVzKGFjdG9yLmRhdGEucGVybWlzc2lvbilcbiAgICAgICAgLmZpbHRlcihlbnRyeSA9PiB7XG4gICAgICAgICAgY29uc3QgW2lkLCBwZXJtaXNzaW9uTGV2ZWxdID0gZW50cnk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25MZXZlbCA+PSBFTlRJVFlfUEVSTUlTU0lPTlMuT1dORVIgJiYgaWQgIT09IGdhbWUudXNlci5pZDtcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcCh1c2Vyc1Blcm1pc3Npb25zID0+IHVzZXJzUGVybWlzc2lvbnNbMF0pO1xuXG4gICAgICBnYW1lLnNvY2tldC5lbWl0KCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywge1xuICAgICAgICB0eXBlOiAnZ21JbnRydXNpb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdXNlcklkczogb3duZXJJZHMsXG4gICAgICAgICAgYWN0b3JJZDogYWN0b3IuZGF0YS5faWQsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBoZWFkaW5nID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpO1xuICAgICAgY29uc3QgYm9keSA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmN0eHQuaW50cnVzaW9uLmhlYWRpbmcnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5kYXRhLm5hbWUpO1xuXG4gICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgICAgICBjb250ZW50OiBgPGgyPiR7aGVhZGluZ308L2gyPjxici8+JHtib2R5fWAsXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgY29uZGl0aW9uOiBsaSA9PiB7XG4gICAgICBpZiAoIWdhbWUudXNlci5pc0dNKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQobGkuZGF0YSgnZW50aXR5SWQnKSk7XG4gICAgICByZXR1cm4gYWN0b3IgJiYgYWN0b3IuZGF0YS50eXBlID09PSAncGMnO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiBnbG9iYWwgQ29tYmF0ICovXG5cbi8vIEltcG9ydCBNb2R1bGVzXG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1BY3RvciB9IGZyb20gXCIuL2FjdG9yL2FjdG9yLmpzXCI7XG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0IH0gZnJvbSBcIi4vYWN0b3IvYWN0b3Itc2hlZXQuanNcIjtcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tIFwiLi9pdGVtL2l0ZW0uanNcIjtcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW1TaGVldCB9IGZyb20gXCIuL2l0ZW0vaXRlbS1zaGVldC5qc1wiO1xuXG5pbXBvcnQgeyByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgfSBmcm9tICcuL2hhbmRsZWJhcnMtaGVscGVycy5qcyc7XG5pbXBvcnQgeyBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcyB9IGZyb20gJy4vdGVtcGxhdGUuanMnO1xuXG5pbXBvcnQgeyByZWdpc3RlclN5c3RlbVNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgeyByZW5kZXJDaGF0TWVzc2FnZSB9IGZyb20gJy4vY2hhdC5qcyc7XG5pbXBvcnQgeyBhY3RvckRpcmVjdG9yeUNvbnRleHQgfSBmcm9tICcuL2NvbnRleHQtbWVudS5qcyc7XG5pbXBvcnQgeyBtaWdyYXRlIH0gZnJvbSAnLi9taWdyYXRpb25zL21pZ3JhdGUnO1xuaW1wb3J0IHsgY3NyU29ja2V0TGlzdGVuZXJzIH0gZnJvbSAnLi9zb2NrZXQuanMnO1xuaW1wb3J0IHsgcm9sbEluaXRpYXRpdmUgfSBmcm9tICcuL2NvbWJhdC5qcyc7XG5pbXBvcnQgeyB1c2VTa2lsbE1hY3JvLCB1c2VBYmlsaXR5TWFjcm8sIHVzZUN5cGhlck1hY3JvLCBjcmVhdGVDeXBoZXJNYWNybyB9IGZyb20gJy4vbWFjcm9zLmpzJztcblxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgZ2FtZS5jeXBoZXJzeXN0ZW0gPSB7XG4gICAgQ3lwaGVyU3lzdGVtQWN0b3IsXG4gICAgQ3lwaGVyU3lzdGVtSXRlbSxcblxuICAgIG1hY3JvOiB7XG4gICAgICB1c2VTa2lsbDogdXNlU2tpbGxNYWNybyxcbiAgICAgIHVzZUFiaWxpdHk6IHVzZUFiaWxpdHlNYWNybyxcbiAgICAgIHVzZUN5cGhlcjogdXNlQ3lwaGVyTWFjcm9cbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCBhbiBpbml0aWF0aXZlIGZvcm11bGEgZm9yIHRoZSBzeXN0ZW1cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIENvbWJhdC5wcm90b3R5cGUucm9sbEluaXRpYXRpdmUgPSByb2xsSW5pdGlhdGl2ZTtcblxuICAvLyBEZWZpbmUgY3VzdG9tIEVudGl0eSBjbGFzc2VzXG4gIENPTkZJRy5BY3Rvci5lbnRpdHlDbGFzcyA9IEN5cGhlclN5c3RlbUFjdG9yO1xuICBDT05GSUcuSXRlbS5lbnRpdHlDbGFzcyA9IEN5cGhlclN5c3RlbUl0ZW07XG5cbiAgLy8gUmVnaXN0ZXIgc2hlZXQgYXBwbGljYXRpb24gY2xhc3Nlc1xuICBBY3RvcnMudW5yZWdpc3RlclNoZWV0KCdjb3JlJywgQWN0b3JTaGVldCk7XG4gIC8vIFRPRE86IFNlcGFyYXRlIGNsYXNzZXMgcGVyIHR5cGVcbiAgQWN0b3JzLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbScsIEN5cGhlclN5c3RlbUFjdG9yU2hlZXQsIHtcbiAgICB0eXBlczogWydwYyddLFxuICAgIG1ha2VEZWZhdWx0OiB0cnVlLFxuICB9KTtcbiAgQWN0b3JzLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbScsIEN5cGhlclN5c3RlbUFjdG9yU2hlZXQsIHtcbiAgICB0eXBlczogWyducGMnXSxcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcbiAgfSk7XG5cbiAgSXRlbXMudW5yZWdpc3RlclNoZWV0KCdjb3JlJywgSXRlbVNoZWV0KTtcbiAgSXRlbXMucmVnaXN0ZXJTaGVldCgnY3lwaGVyc3lzdGVtJywgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0LCB7IG1ha2VEZWZhdWx0OiB0cnVlIH0pO1xuXG4gIHJlZ2lzdGVyU3lzdGVtU2V0dGluZ3MoKTtcbiAgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzKCk7XG4gIHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzKCk7XG59KTtcblxuSG9va3Mub24oJ3JlbmRlckNoYXRNZXNzYWdlJywgcmVuZGVyQ2hhdE1lc3NhZ2UpO1xuXG5Ib29rcy5vbignZ2V0QWN0b3JEaXJlY3RvcnlFbnRyeUNvbnRleHQnLCBhY3RvckRpcmVjdG9yeUNvbnRleHQpO1xuXG4vLyBIb29rcy5vbignY3JlYXRlQWN0b3InLCBhc3luYyBmdW5jdGlvbihhY3Rvciwgb3B0aW9ucywgdXNlcklkKSB7XG5Ib29rcy5vbignY3JlYXRlQWN0b3InLCBhc3luYyBmdW5jdGlvbihhY3Rvcikge1xuICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yLmRhdGE7XG4gIGlmICh0eXBlID09PSAncGMnKSB7XG4gICAgLy8gR2l2ZSBQQ3MgdGhlIFwiSW5pdGlhdGl2ZVwiIHNraWxsIGJ5IGRlZmF1bHQsIGFzIGl0IHdpbGwgYmUgdXNlZFxuICAgIC8vIGJ5IHRoZSBpbnRpYXRpdmUgZm9ybXVsYSBpbiBjb21iYXQuXG4gICAgYWN0b3IuY3JlYXRlT3duZWRJdGVtKHtcbiAgICAgIG5hbWU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnNraWxsLmluaXRpYXRpdmUnKSxcbiAgICAgIHR5cGU6ICdza2lsbCcsXG4gICAgICBkYXRhOiBuZXcgQ3lwaGVyU3lzdGVtSXRlbSh7XG4gICAgICAgICdwb29sJzogMSwgLy8gU3BlZWRcbiAgICAgICAgJ3RyYWluaW5nJzogMSwgLy8gVW50cmFpbmVkXG5cbiAgICAgICAgJ2ZsYWdzLmluaXRpYXRpdmUnOiB0cnVlXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufSk7XG5cbkhvb2tzLm9uY2UoJ3JlYWR5JywgbWlncmF0ZSk7XG5Ib29rcy5vbmNlKCdyZWFkeScsIGNzclNvY2tldExpc3RlbmVycyk7XG4vLyBSZWdpc3RlciBob29rc1xuSG9va3Mub25jZSgncmVhZHknLCAoKSA9PiB7XG4gIEhvb2tzLm9uKCdob3RiYXJEcm9wJywgKF8sIGRhdGEsIHNsb3QpID0+IGNyZWF0ZUN5cGhlck1hY3JvKGRhdGEsIHNsb3QpKTtcbn0pO1xuIiwiLyogZ2xvYmFscyBtZXJnZU9iamVjdCBEaWFsb2cgKi9cblxuLyoqXG4gKiBQcm9tcHRzIHRoZSB1c2VyIHdpdGggYSBjaG9pY2Ugb2YgYSBHTSBJbnRydXNpb24uXG4gKiBcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBHTUludHJ1c2lvbkRpYWxvZ1xuICogQGV4dGVuZHMge0RpYWxvZ31cbiAqL1xuZXhwb3J0IGNsYXNzIEdNSW50cnVzaW9uRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcbiAgLyoqIEBvdmVycmlkZSAqL1xuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xuICAgICAgdGVtcGxhdGU6IFwidGVtcGxhdGVzL2h1ZC9kaWFsb2cuaHRtbFwiLFxuICAgICAgY2xhc3NlczogW1wiY3NyXCIsIFwiZGlhbG9nXCJdLFxuICAgICAgd2lkdGg6IDUwMFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoYWN0b3IsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGFjY2VwdFF1ZXN0aW9uID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi5kb1lvdUFjY2VwdCcpO1xuICAgIGNvbnN0IGFjY2VwdEluc3RydWN0aW9ucyA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24uYWNjZXB0SW5zdHJ1Y3Rpb25zJylcbiAgICAgIC5yZXBsYWNlKCcjI0FDQ0VQVCMjJywgYDxzcGFuIHN0eWxlPVwiY29sb3I6IGdyZWVuXCI+JHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5hY2NlcHQnKX08L3NwYW4+YCk7XG4gICAgY29uc3QgcmVmdXNlSW5zdHJ1Y3Rpb25zID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi5yZWZ1c2VJbnN0cnVjdGlvbnMnKVxuICAgICAgLnJlcGxhY2UoJyMjUkVGVVNFIyMnLCBgPHNwYW4gc3R5bGU9XCJjb2xvcjogcmVkXCI+JHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yZWZ1c2UnKX08L3NwYW4+YCk7XG5cbiAgICBsZXQgZGlhbG9nQ29udGVudCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgIDxwPiR7YWNjZXB0UXVlc3Rpb259PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGhyIC8+XG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy02XCI+XG4gICAgICAgIDxwPiR7YWNjZXB0SW5zdHJ1Y3Rpb25zfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy02XCI+XG4gICAgICAgIDxwPiR7cmVmdXNlSW5zdHJ1Y3Rpb25zfTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPmA7XG5cbiAgICBsZXQgZGlhbG9nQnV0dG9ucyA9IHtcbiAgICAgIG9rOiB7XG4gICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1jaGVja1wiIHN0eWxlPVwiY29sb3I6IGdyZWVuXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLmFjY2VwdCcpLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IGFjdG9yLm9uR01JbnRydXNpb24odHJ1ZSk7XG4gICAgICAgICAgc3VwZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbDoge1xuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIiBzdHlsZT1cImNvbG9yOiByZWRcIj48L2k+JyxcbiAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5idXR0b24ucmVmdXNlJyksXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgYWN0b3Iub25HTUludHJ1c2lvbihmYWxzZSk7XG4gICAgICAgICAgc3VwZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWFjdG9yLmNhblJlZnVzZUludHJ1c2lvbikge1xuICAgICAgY29uc3Qgbm90RW5vdWdoWFAgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLm5vdEVub3VnaFhQJyk7XG5cbiAgICAgIGRpYWxvZ0NvbnRlbnQgKz0gYFxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XG4gICAgICAgICAgPHA+PHN0cm9uZz4ke25vdEVub3VnaFhQfTwvc3Ryb25nPjwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxociAvPmBcblxuICAgICAgZGVsZXRlIGRpYWxvZ0J1dHRvbnMuY2FuY2VsO1xuICAgIH1cblxuICAgIGNvbnN0IGRpYWxvZ0RhdGEgPSB7XG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi50aXRsZScpLFxuICAgICAgY29udGVudDogZGlhbG9nQ29udGVudCxcbiAgICAgIGJ1dHRvbnM6IGRpYWxvZ0J1dHRvbnMsXG4gICAgICBkZWZhdWx0WWVzOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFjdG9yID0gYWN0b3I7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIF9nZXRIZWFkZXJCdXR0b25zKCkge1xuICAgIC8vIERvbid0IGluY2x1ZGUgYW55IGhlYWRlciBidXR0b25zLCBmb3JjZSBhbiBvcHRpb24gdG8gYmUgY2hvc2VuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBjbG9zZSgpIHtcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgY2xvc2luZyBiZWhhdmlvclxuICB9XG59IFxuIiwiLyogZ2xvYmFscyBtZXJnZU9iamVjdCBEaWFsb2cgKi9cblxuLyoqXG4gKiBBbGxvd3MgdGhlIHVzZXIgdG8gY2hvb3NlIG9uZSBvZiB0aGUgb3RoZXIgcGxheWVyIGNoYXJhY3RlcnMuXG4gKiBcbiAqIEBleHBvcnRcbiAqIEBjbGFzcyBQbGF5ZXJDaG9pY2VEaWFsb2dcbiAqIEBleHRlbmRzIHtEaWFsb2d9XG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5ZXJDaG9pY2VEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIHRlbXBsYXRlOiBcInRlbXBsYXRlcy9odWQvZGlhbG9nLmh0bWxcIixcbiAgICAgIGNsYXNzZXM6IFtcImNzclwiLCBcImRpYWxvZ1wiLCBcInBsYXllci1jaG9pY2VcIl0sXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAxNzVcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFjdG9ycywgb25BY2NlcHRGbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZGlhbG9nU2VsZWN0T3B0aW9ucyA9IFtdO1xuICAgIGFjdG9ycy5mb3JFYWNoKGFjdG9yID0+IHtcbiAgICAgIGRpYWxvZ1NlbGVjdE9wdGlvbnMucHVzaChgPG9wdGlvbiB2YWx1ZT1cIiR7YWN0b3IuX2lkfVwiPiR7YWN0b3IubmFtZX08L29wdGlvbj5gKVxuICAgIH0pO1xuXG4gICAgY29uc3QgZGlhbG9nVGV4dCA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5wbGF5ZXIuY29udGVudCcpO1xuICAgIGNvbnN0IGRpYWxvZ0NvbnRlbnQgPSBgXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICA8cD4ke2RpYWxvZ1RleHR9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGhyIC8+XG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICA8c2VsZWN0IG5hbWU9XCJwbGF5ZXJcIj5cbiAgICAgICAgICAke2RpYWxvZ1NlbGVjdE9wdGlvbnMuam9pbignXFxuJyl9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGhyIC8+YDtcblxuICAgIGNvbnN0IGRpYWxvZ0J1dHRvbnMgPSB7XG4gICAgICBvazoge1xuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5idXR0b24uYWNjZXB0JyksXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0b3JJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY2hvaWNlIHNlbGVjdFtuYW1lPVwicGxheWVyXCJdJykudmFsdWU7XG5cbiAgICAgICAgICBvbkFjY2VwdEZuKGFjdG9ySWQpO1xuXG4gICAgICAgICAgc3VwZXIuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBkaWFsb2dEYXRhID0ge1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5wbGF5ZXIudGl0bGUnKSxcbiAgICAgIGNvbnRlbnQ6IGRpYWxvZ0NvbnRlbnQsXG4gICAgICBidXR0b25zOiBkaWFsb2dCdXR0b25zLFxuICAgICAgZGVmYXVsdFllczogZmFsc2UsXG4gICAgfTtcblxuICAgIHN1cGVyKGRpYWxvZ0RhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hY3RvcnMgPSBhY3RvcnM7XG4gIH1cblxuICBnZXREYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XG5cbiAgICBkYXRhLmFjdG9ycyA9IHRoaXMuYWN0b3JzO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwicGxheWVyXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAvLyBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgX2dldEhlYWRlckJ1dHRvbnMoKSB7XG4gICAgLy8gRG9uJ3QgaW5jbHVkZSBhbnkgaGVhZGVyIGJ1dHRvbnMsIGZvcmNlIGFuIG9wdGlvbiB0byBiZSBjaG9zZW5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGNsb3NlKCkge1xuICAgIC8vIFByZXZlbnQgZGVmYXVsdCBjbG9zaW5nIGJlaGF2aW9yXG4gIH1cbn0gXG4iLCIvKiBnbG9iYWxzIERpYWxvZyAqL1xuXG5leHBvcnQgY2xhc3MgUm9sbERpYWxvZyBleHRlbmRzIERpYWxvZyB7XG4gIGNvbnN0cnVjdG9yKGRpYWxvZ0RhdGEsIG9wdGlvbnMpIHtcbiAgICBzdXBlcihkaWFsb2dEYXRhLCBvcHRpb25zKTtcbiAgfVxuXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBzdXBlci5hY3RpdmF0ZUxpc3RlbmVycyhodG1sKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJyb2xsTW9kZVwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzNXB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG59IiwiY29uc3QgRW51bVBvb2wgPSBbXG4gIFwiTWlnaHRcIixcbiAgXCJTcGVlZFwiLFxuICBcIkludGVsbGVjdFwiXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBFbnVtUG9vbDtcbiIsImNvbnN0IEVudW1SYW5nZSA9IFtcbiAgXCJJbW1lZGlhdGVcIixcbiAgXCJTaG9ydFwiLFxuICBcIkxvbmdcIixcbiAgXCJWZXJ5IExvbmdcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVJhbmdlO1xuIiwiY29uc3QgRW51bVRyYWluaW5nID0gW1xuICBcIkluYWJpbGl0eVwiLFxuICBcIlVudHJhaW5lZFwiLFxuICBcIlRyYWluZWRcIixcbiAgXCJTcGVjaWFsaXplZFwiXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBFbnVtVHJhaW5pbmc7XG4iLCJjb25zdCBFbnVtV2VhcG9uQ2F0ZWdvcnkgPSBbXG4gIFwiQmFzaGluZ1wiLFxuICBcIkJsYWRlZFwiLFxuICBcIlJhbmdlZFwiXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBFbnVtV2VhcG9uQ2F0ZWdvcnk7XG4iLCJjb25zdCBFbnVtV2VpZ2h0ID0gW1xuICBcIkxpZ2h0XCIsXG4gIFwiTWVkaXVtXCIsXG4gIFwiSGVhdnlcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVdlaWdodDtcbiIsImV4cG9ydCBjb25zdCByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgPSAoKSA9PiB7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvTG93ZXJDYXNlJywgc3RyID0+IHN0ci50b0xvd2VyQ2FzZSgpKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndG9VcHBlckNhc2UnLCB0ZXh0ID0+IHRleHQudG9VcHBlckNhc2UoKSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZXEnLCAodjEsIHYyKSA9PiB2MSA9PT0gdjIpO1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCduZXEnLCAodjEsIHYyKSA9PiB2MSAhPT0gdjIpO1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdvcicsICh2MSwgdjIpID0+IHYxIHx8IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndGVybmFyeScsIChjb25kLCB2MSwgdjIpID0+IGNvbmQgPyB2MSA6IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignY29uY2F0JywgKHYxLCB2MikgPT4gYCR7djF9JHt2Mn1gKTtcblxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdzdHJPclNwYWNlJywgdmFsID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiAodmFsICYmICEhdmFsLmxlbmd0aCkgPyB2YWwgOiAnJm5ic3A7JztcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9KTtcblxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0cmFpbmluZ0ljb24nLCB2YWwgPT4ge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLmluYWJpbGl0eScpfVwiPltJXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy51bnRyYWluZWQnKX1cIj5bVV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudHJhaW5lZCcpfVwiPltUXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAzOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5zcGVjaWFsaXplZCcpfVwiPltTXTwvc3Bhbj5gO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigncG9vbEljb24nLCB2YWwgPT4ge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wubWlnaHQnKX1cIj5bTV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5zcGVlZCcpfVwiPltTXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLmludGVsbGVjdCcpfVwiPltJXTwvc3Bhbj5gO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndHlwZUljb24nLCB2YWwgPT4ge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICAvLyBUT0RPOiBBZGQgc2tpbGwgYW5kIGFiaWxpdHk/XG4gICAgICBcbiAgICAgIGNhc2UgJ2FybW9yJzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W2FdPC9zcGFuPmA7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkud2VhcG9uJyl9XCI+W3ddPC9zcGFuPmA7XG4gICAgICBjYXNlICdnZWFyJzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmdlYXInKX1cIj5bZ108L3NwYW4+YDtcbiAgICAgIFxuICAgICAgY2FzZSAnY3lwaGVyJzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmN5cGhlcicpfVwiPltDXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bQV08L3NwYW4+YDtcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPltPXTwvc3Bhbj5gO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG59O1xuIiwiLyogZ2xvYmFscyBtZXJnZU9iamVjdCAqL1xuXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xuXG4vKipcbiAqIEV4dGVuZCB0aGUgYmFzaWMgSXRlbVNoZWV0IHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zXG4gKiBAZXh0ZW5kcyB7SXRlbVNoZWV0fVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IGV4dGVuZHMgSXRlbVNoZWV0IHtcblxuICAvKiogQG92ZXJyaWRlICovXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XG4gICAgICBjbGFzc2VzOiBbXCJjeXBoZXJzeXN0ZW1cIiwgXCJzaGVldFwiLCBcIml0ZW1cIl0sXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgaGVpZ2h0OiAyMDBcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHBhdGggPSBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtXCI7XG4gICAgcmV0dXJuIGAke3BhdGh9LyR7dGhpcy5pdGVtLmRhdGEudHlwZX0tc2hlZXQuaHRtbGA7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIF9za2lsbERhdGEoZGF0YSkge1xuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XG4gICAgZGF0YS50cmFpbmluZ0xldmVscyA9IENTUi50cmFpbmluZ0xldmVscztcbiAgfVxuXG4gIF9hYmlsaXR5RGF0YShkYXRhKSB7XG4gICAgZGF0YS5yYW5nZXMgPSBDU1Iub3B0aW9uYWxSYW5nZXM7XG4gICAgZGF0YS5zdGF0cyA9IENTUi5zdGF0cztcbiAgfVxuXG4gIF9hcm1vckRhdGEoZGF0YSkge1xuICAgIGRhdGEud2VpZ2h0Q2xhc3NlcyA9IENTUi53ZWlnaHRDbGFzc2VzO1xuICB9XG5cbiAgX3dlYXBvbkRhdGEoZGF0YSkge1xuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcbiAgICBkYXRhLndlYXBvblR5cGVzID0gQ1NSLndlYXBvblR5cGVzO1xuICAgIGRhdGEud2VpZ2h0Q2xhc3NlcyA9IENTUi53ZWlnaHRDbGFzc2VzO1xuICB9XG5cbiAgX2dlYXJEYXRhKGRhdGEpIHtcbiAgfVxuXG4gIF9jeXBoZXJEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIF9hcnRpZmFjdERhdGEoZGF0YSkge1xuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xuICB9XG5cbiAgX29kZGl0eURhdGEoZGF0YSkge1xuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBnZXREYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuaXRlbS5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc2tpbGwnOlxuICAgICAgICB0aGlzLl9za2lsbERhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWJpbGl0eSc6XG4gICAgICAgIHRoaXMuX2FiaWxpdHlEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FybW9yJzpcbiAgICAgICAgdGhpcy5fYXJtb3JEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlYXBvbic6XG4gICAgICAgIHRoaXMuX3dlYXBvbkRhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZ2Vhcic6XG4gICAgICAgIHRoaXMuX2dlYXJEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2N5cGhlcic6XG4gICAgICAgIHRoaXMuX2N5cGhlckRhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxuICAgICAgICB0aGlzLl9hcnRpZmFjdERhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2RkaXR5JzpcbiAgICAgICAgdGhpcy5fb2RkaXR5RGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc2V0UG9zaXRpb24ob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBzdXBlci5zZXRQb3NpdGlvbihvcHRpb25zKTtcbiAgICBjb25zdCBzaGVldEJvZHkgPSB0aGlzLmVsZW1lbnQuZmluZChcIi5zaGVldC1ib2R5XCIpO1xuICAgIGNvbnN0IGJvZHlIZWlnaHQgPSBwb3NpdGlvbi5oZWlnaHQgLSAxOTI7XG4gICAgc2hlZXRCb2R5LmNzcyhcImhlaWdodFwiLCBib2R5SGVpZ2h0KTtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIF9za2lsbExpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ3NraWxsLXdpbmRvdycpO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEucG9vbFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzExMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEudHJhaW5pbmdcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxuXG4gIF9hYmlsaXR5TGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnYWJpbGl0eS13aW5kb3cnKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmlzRW5hYmxlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzIyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuY29zdC5wb29sXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnODVweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnJhbmdlXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBjb25zdCBjYklkZW50aWZpZWQgPSBodG1sLmZpbmQoJyNjYi1pZGVudGlmaWVkJyk7XG4gICAgY2JJZGVudGlmaWVkLm9uKCdjaGFuZ2UnLCAoZXYpID0+IHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgdGhpcy5pdGVtLnVwZGF0ZSh7XG4gICAgICAgICdkYXRhLmlkZW50aWZpZWQnOiBldi50YXJnZXQuY2hlY2tlZFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfYXJtb3JMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdhcm1vci13aW5kb3cnKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLndlaWdodFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgX3dlYXBvbkxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ3dlYXBvbi13aW5kb3cnKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLndlaWdodFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzExMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuY2F0ZWdvcnlcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnJhbmdlXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICBfZ2Vhckxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2dlYXItd2luZG93Jyk7XG4gIH1cblxuICBfY3lwaGVyTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnY3lwaGVyLXdpbmRvdycpO1xuICB9XG5cbiAgX2FydGlmYWN0TGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnYXJ0aWZhY3Qtd2luZG93Jyk7XG4gIH1cblxuICBfb2RkaXR5TGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnb2RkaXR5LXdpbmRvdycpO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5pdGVtLmRhdGE7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdza2lsbCc6XG4gICAgICAgIHRoaXMuX3NraWxsTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9hYmlsaXR5TGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FybW9yJzpcbiAgICAgICAgdGhpcy5fYXJtb3JMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgdGhpcy5fd2VhcG9uTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9nZWFyTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2N5cGhlcic6XG4gICAgICAgIHRoaXMuX2N5cGhlckxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnRpZmFjdCc6XG4gICAgICAgIHRoaXMuX2FydGlmYWN0TGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX29kZGl0eUxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG4iLCIvKiBnbG9iYWxzIEl0ZW0gcmVuZGVyVGVtcGxhdGUgKi9cblxuaW1wb3J0IHsgY3lwaGVyUm9sbCB9IGZyb20gJy4uL3JvbGxzLmpzJztcbmltcG9ydCB7IHZhbE9yRGVmYXVsdCB9IGZyb20gJy4uL3V0aWxzLmpzJztcblxuaW1wb3J0IEVudW1Qb29scyBmcm9tICcuLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuaW1wb3J0IEVudW1UcmFpbmluZyBmcm9tICcuLi9lbnVtcy9lbnVtLXRyYWluaW5nLmpzJztcbmltcG9ydCBFbnVtV2VpZ2h0IGZyb20gJy4uL2VudW1zL2VudW0td2VpZ2h0LmpzJztcbmltcG9ydCBFbnVtUmFuZ2UgZnJvbSAnLi4vZW51bXMvZW51bS1yYW5nZS5qcyc7XG5pbXBvcnQgRW51bVdlYXBvbkNhdGVnb3J5IGZyb20gJy4uL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW0gd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnMuXG4gKiBAZXh0ZW5kcyB7SXRlbX1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW0gZXh0ZW5kcyBJdGVtIHtcbiAgX3ByZXBhcmVTa2lsbERhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuc2tpbGwnKSk7XG4gICAgZGF0YS5wb29sID0gdmFsT3JEZWZhdWx0KGRhdGEucG9vbCwgMCk7XG4gICAgZGF0YS50cmFpbmluZyA9IHZhbE9yRGVmYXVsdChkYXRhLnRyYWluaW5nLCAxKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcblxuICAgIGRhdGEuZmxhZ3MgPSB2YWxPckRlZmF1bHQoZGF0YS5mbGFncywge30pO1xuICB9XG5cbiAgX3ByZXBhcmVBYmlsaXR5RGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hYmlsaXR5JykpO1xuICAgIGRhdGEuc291cmNlVHlwZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNvdXJjZVR5cGUsICcnKTtcbiAgICBkYXRhLnNvdXJjZVZhbHVlID0gdmFsT3JEZWZhdWx0KGRhdGEuc291cmNlVmFsdWUsICcnKTtcbiAgICBkYXRhLmlzRW5hYmxlciA9IHZhbE9yRGVmYXVsdChkYXRhLmlzRW5hYmxlciwgdHJ1ZSk7XG4gICAgZGF0YS5jb3N0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY29zdCwge1xuICAgICAgdmFsdWU6IDAsXG4gICAgICBwb29sOiAwXG4gICAgfSk7XG4gICAgZGF0YS5yYW5nZSA9IHZhbE9yRGVmYXVsdChkYXRhLnJhbmdlLCAwKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlQXJtb3JEYXRhKCkge1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XG5cbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LmFybW9yJykpO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMSk7XG4gICAgZGF0YS5hZGRpdGlvbmFsU3BlZWRFZmZvcnRDb3N0ID0gdmFsT3JEZWZhdWx0KGRhdGEuYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdCwgMSk7XG4gICAgZGF0YS5wcmljZSA9IHZhbE9yRGVmYXVsdChkYXRhLnByaWNlLCAwKTtcbiAgICBkYXRhLndlaWdodCA9IHZhbE9yRGVmYXVsdChkYXRhLndlaWdodCwgMCk7XG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcbiAgICBkYXRhLmVxdWlwcGVkID0gdmFsT3JEZWZhdWx0KGRhdGEuZXF1aXBwZWQsIGZhbHNlKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlV2VhcG9uRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy53ZWFwb24nKSk7XG4gICAgZGF0YS5kYW1hZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5kYW1hZ2UsIDEpO1xuICAgIGRhdGEuY2F0ZWdvcnkgPSB2YWxPckRlZmF1bHQoZGF0YS5jYXRlZ29yeSwgMCk7XG4gICAgZGF0YS5yYW5nZSA9IHZhbE9yRGVmYXVsdChkYXRhLnJhbmdlLCAwKTtcbiAgICBkYXRhLnByaWNlID0gdmFsT3JEZWZhdWx0KGRhdGEucHJpY2UsIDApO1xuICAgIGRhdGEud2VpZ2h0ID0gdmFsT3JEZWZhdWx0KGRhdGEud2VpZ2h0LCAwKTtcbiAgICBkYXRhLnF1YW50aXR5ID0gdmFsT3JEZWZhdWx0KGRhdGEucXVhbnRpdHksIDEpO1xuICAgIGRhdGEuZXF1aXBwZWQgPSB2YWxPckRlZmF1bHQoZGF0YS5lcXVpcHBlZCwgZmFsc2UpO1xuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xuICB9XG5cbiAgX3ByZXBhcmVHZWFyRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5nZWFyJykpO1xuICAgIGRhdGEucHJpY2UgPSB2YWxPckRlZmF1bHQoZGF0YS5wcmljZSwgMCk7XG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlQ3lwaGVyRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5jeXBoZXInKSk7XG4gICAgZGF0YS5pZGVudGlmaWVkID0gdmFsT3JEZWZhdWx0KGRhdGEuaWRlbnRpZmllZCwgZmFsc2UpO1xuICAgIGRhdGEubGV2ZWwgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbCwgbnVsbCk7XG4gICAgZGF0YS5sZXZlbERpZSA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsRGllLCAnJyk7XG4gICAgZGF0YS5mb3JtID0gdmFsT3JEZWZhdWx0KGRhdGEuZm9ybSwgJycpO1xuICAgIGRhdGEuZWZmZWN0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmZWN0LCAnJyk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZUFydGlmYWN0RGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hcnRpZmFjdCcpKTtcbiAgICBkYXRhLmlkZW50aWZpZWQgPSB2YWxPckRlZmF1bHQoZGF0YS5pZGVudGlmaWVkLCBmYWxzZSk7XG4gICAgZGF0YS5sZXZlbCA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsLCBudWxsKTtcbiAgICBkYXRhLmxldmVsRGllID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWxEaWUsICcnKTtcbiAgICBkYXRhLmZvcm0gPSB2YWxPckRlZmF1bHQoZGF0YS5mb3JtLCAnJyk7XG4gICAgZGF0YS5lZmZlY3QgPSB2YWxPckRlZmF1bHQoZGF0YS5lZmZlY3QsICcnKTtcbiAgICBkYXRhLmRlcGxldGlvbiA9IHZhbE9yRGVmYXVsdChkYXRhLmRlcGxldGlvbiwge1xuICAgICAgaXNEZXBsZXRpbmc6IHRydWUsXG4gICAgICBkaWU6ICdkNicsXG4gICAgICB0aHJlc2hvbGQ6IDFcbiAgICB9KTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlT2RkaXR5RGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5vZGRpdHknKSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICAvKipcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgSXRlbSBkYXRhIG1vZGVsIHdpdGggYWRkaXRpb25hbCBkeW5hbWljIGRhdGEuXG4gICAqL1xuICBwcmVwYXJlRGF0YSgpIHtcbiAgICBzdXBlci5wcmVwYXJlRGF0YSgpO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZVNraWxsRGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9wcmVwYXJlQWJpbGl0eURhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVBcm1vckRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICB0aGlzLl9wcmVwYXJlV2VhcG9uRGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9wcmVwYXJlR2VhckRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9wcmVwYXJlQ3lwaGVyRGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUFydGlmYWN0RGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVPZGRpdHlEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSb2xsXG4gICAqL1xuXG4gIF9za2lsbFJvbGwoKSB7XG4gICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcblxuICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcztcbiAgICBjb25zdCBpdGVtID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgcG9vbCB9ID0gaXRlbS5kYXRhO1xuICAgIGNvbnN0IGFzc2V0cyA9IGFjdG9yLmdldFNraWxsTGV2ZWwodGhpcyk7XG4gICAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICAgIGNvbnN0IHBhcnRzID0gWycxZDIwJ107XG4gICAgaWYgKGFzc2V0cyAhPT0gMCkge1xuICAgICAgY29uc3Qgc2lnbiA9IGFzc2V0cyA8IDAgPyAnLScgOiAnKyc7XG4gICAgICBwYXJ0cy5wdXNoKGAke3NpZ259ICR7TWF0aC5hYnMoYXNzZXRzKSAqIDN9YCk7XG4gICAgfVxuXG4gICAgY3lwaGVyUm9sbCh7XG4gICAgICBwYXJ0cyxcblxuICAgICAgZGF0YToge1xuICAgICAgICBwb29sLFxuICAgICAgICBwb29sQ29zdDogMCxcbiAgICAgICAgZWZmb3J0OiBmcmVlRWZmb3J0LFxuICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnQsXG4gICAgICAgIGFzc2V0c1xuICAgICAgfSxcbiAgICAgIGV2ZW50LFxuXG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5za2lsbC50aXRsZScpLFxuICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnNraWxsLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLnJlcGxhY2UoJyMjU0tJTEwjIycsIG5hbWUpLFxuXG4gICAgICBhY3RvcixcbiAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIF9hYmlsaXR5Um9sbCgpIHtcbiAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xuXG4gICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzO1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBpc0VuYWJsZXIsIGNvc3QgfSA9IGl0ZW0uZGF0YTtcblxuICAgIGlmICghaXNFbmFibGVyKSB7XG4gICAgICBjb25zdCB7IHBvb2wsIHZhbHVlOiBhbW91bnQgfSA9IGNvc3Q7XG4gICAgICBjb25zdCBlZGdlID0gYWN0b3IuZ2V0RWRnZUZyb21TdGF0KHBvb2wpO1xuICAgICAgY29uc3QgYWRqdXN0ZWRBbW91bnRlZCA9IE1hdGgubWF4KGFtb3VudCAtIGVkZ2UsIDApO1xuICAgICAgY29uc3QgZnJlZUVmZm9ydCA9IGFjdG9yLmdldEZyZWVFZmZvcnRGcm9tU3RhdChwb29sKTtcblxuICAgICAgLy8gRWRnZSBoYXMgbWFkZSB0aGlzIGFiaWxpdHkgZnJlZSwgc28ganVzdCB1c2UgaXRcbiAgICAgIGlmIChhZGp1c3RlZEFtb3VudGVkID09PSAwKSB7XG4gICAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKS5yZXBsYWNlKCcjI0FCSUxJVFkjIycsIG5hbWUpLFxuICAgICAgICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS5mcmVlJyksXG4gICAgICAgIH1dKTtcbiAgICAgIH0gZWxzZSBpZiAoYWN0b3IuY2FuU3BlbmRGcm9tUG9vbChwb29sLCBwYXJzZUludChhbW91bnQsIDEwKSkpIHtcbiAgICAgICAgY3lwaGVyUm9sbCh7XG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgcGFydHM6IFsnMWQyMCddLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHBvb2wsXG4gICAgICAgICAgICBwb29sQ29zdDogYWRqdXN0ZWRBbW91bnRlZCxcbiAgICAgICAgICAgIGVmZm9ydDogZnJlZUVmZm9ydCxcbiAgICAgICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICAgICAgICAgIGZsYXZvcjogYCR7YWN0b3IubmFtZX0gdXNlZCAke25hbWV9YCxcbiAgICAgICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5hYmlsaXR5LnRpdGxlJyksXG4gICAgICAgICAgYWN0b3JcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XG4gICAgICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICAgICAgICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5hYmlsaXR5LmZhaWxlZC5mbGF2b3InKSxcbiAgICAgICAgICBjb250ZW50OiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmFiaWxpdHkuZmFpbGVkLmNvbnRlbnQnKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKVxuICAgICAgICB9XSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xuICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5hYmlsaXR5LmludmFsaWQuZmxhdm9yJyksXG4gICAgICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuYWJpbGl0eS5pbnZhbGlkLmNvbnRlbnQnKVxuICAgICAgfV0pO1xuICAgIH1cbiAgfVxuXG4gIHJvbGwoKSB7XG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fc2tpbGxSb2xsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWJpbGl0eSc6XG4gICAgICAgIHRoaXMuX2FiaWxpdHlSb2xsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmZvXG4gICAqL1xuXG4gIGFzeW5jIF9za2lsbEluZm8oKSB7XG4gICAgY29uc3Qgc2tpbGxEYXRhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gc2tpbGxEYXRhO1xuXG4gICAgY29uc3QgdHJhaW5pbmcgPSBFbnVtVHJhaW5pbmdbc2tpbGxEYXRhLmRhdGEudHJhaW5pbmddO1xuICAgIGNvbnN0IHBvb2wgPSBFbnVtUG9vbHNbc2tpbGxEYXRhLmRhdGEucG9vbF07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBza2lsbERhdGEubmFtZSxcbiAgICAgIHRyYWluaW5nOiB0cmFpbmluZy50b0xvd2VyQ2FzZSgpLFxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxuICAgICAgbm90ZXM6IGRhdGEubm90ZXMsXG5cbiAgICAgIGluaXRpYXRpdmU6ICEhZGF0YS5mbGFncy5pbml0aWF0aXZlXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIF9hYmlsaXR5SW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwb29sID0gRW51bVBvb2xzW2RhdGEuZGF0YS5jb3N0LnBvb2xdO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxuICAgICAgaXNFbmFibGVyOiBkYXRhLmRhdGEuaXNFbmFibGVyLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYXJtb3JJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHdlaWdodCA9IEVudW1XZWlnaHRbZGF0YS5kYXRhLndlaWdodF07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBlcXVpcHBlZDogZGF0YS5kYXRhLmVxdWlwcGVkLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXG4gICAgICBhcm1vcjogZGF0YS5kYXRhLmFybW9yLFxuICAgICAgYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdDogZGF0YS5kYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJtb3ItaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX3dlYXBvbkluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qgd2VpZ2h0ID0gRW51bVdlaWdodFtkYXRhLmRhdGEud2VpZ2h0XTtcbiAgICBjb25zdCByYW5nZSA9IEVudW1SYW5nZVtkYXRhLmRhdGEucmFuZ2VdO1xuICAgIGNvbnN0IGNhdGVnb3J5ID0gRW51bVdlYXBvbkNhdGVnb3J5W2RhdGEuZGF0YS5jYXRlZ29yeV07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBlcXVpcHBlZDogZGF0YS5kYXRhLmVxdWlwcGVkLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXG4gICAgICByYW5nZTogcmFuZ2UudG9Mb3dlckNhc2UoKSxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeS50b0xvd2VyQ2FzZSgpLFxuICAgICAgZGFtYWdlOiBkYXRhLmRhdGEuZGFtYWdlLFxuICAgICAgcHJpY2U6IGRhdGEuZGF0YS5wcmljZSxcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3dlYXBvbi1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfZ2VhckluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIF9jeXBoZXJJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXG4gICAgICBsZXZlbDogZGF0YS5kYXRhLmxldmVsLFxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXG4gICAgICBlZmZlY3Q6IGRhdGEuZGF0YS5lZmZlY3QsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2N5cGhlci1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYXJ0aWZhY3RJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXG4gICAgICBsZXZlbDogZGF0YS5kYXRhLmxldmVsLFxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXG4gICAgICBpc0RlcGxldGluZzogZGF0YS5kYXRhLmRlcGxldGlvbi5pc0RlcGxldGluZyxcbiAgICAgIGRlcGxldGlvblRocmVzaG9sZDogZGF0YS5kYXRhLmRlcGxldGlvbi50aHJlc2hvbGQsXG4gICAgICBkZXBsZXRpb25EaWU6IGRhdGEuZGF0YS5kZXBsZXRpb24uZGllLFxuICAgICAgZWZmZWN0OiBkYXRhLmRhdGEuZWZmZWN0LFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcnRpZmFjdC1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfb2RkaXR5SW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgZ2V0SW5mbygpIHtcbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX3NraWxsSW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYWJpbGl0eUluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hcm1vckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fd2VhcG9uSW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fZ2VhckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fY3lwaGVySW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FydGlmYWN0SW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9vZGRpdHlJbmZvKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sO1xuICB9XG59XG4iLCIvKipcbiAqIEFjdGl2YXRlcyB0aGUgZ2l2ZW4gc2tpbGwuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfSBpdGVtSWRcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2VTa2lsbE1hY3JvKGFjdG9ySWQsIGl0ZW1JZCkge1xuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLl9pZCA9PT0gYWN0b3JJZCk7XG4gIGNvbnN0IHNraWxsID0gYWN0b3IuZ2V0T3duZWRJdGVtKGl0ZW1JZCk7XG5cbiAgc2tpbGwucm9sbCgpO1xufVxuXG4vKipcbiAqIEFjdGl2YXRlcyB0aGUgZ2l2ZW4gYWJpbGl0eS5cbiAqIFxuICogQHBhcmFtIHtzdHJpbmd9IGl0ZW1JZFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUFiaWxpdHlNYWNybyhhY3RvcklkLCBpdGVtSWQpIHtcbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5lbnRpdGllcy5maW5kKGEgPT4gYS5faWQgPT09IGFjdG9ySWQpO1xuICBjb25zdCBhYmlsaXR5ID0gYWN0b3IuZ2V0T3duZWRJdGVtKGl0ZW1JZCk7XG5cbiAgYWJpbGl0eS5yb2xsKCk7XG59XG5cbi8qKlxuICogVXNlcyB0aGUgZ2l2ZW4gY3lwaGVyLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ30gaXRlbUlkXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdXNlQ3lwaGVyTWFjcm8oYWN0b3JJZCwgaXRlbUlkKSB7XG4gIC8vIGNvbnN0IGFjdG9yID0gZ2FtZS5hY3RvcnMuZW50aXRpZXMuZmluZChhID0+IGEuX2lkID09PSBhY3RvcklkKTtcbiAgLy8gcmV0dXJuIGFjdG9yLnVzZUl0ZW1CeUlkKGl0ZW1JZCk7XG4gIGNvbnNvbGUud2FybignQ3lwaGVyIG1hY3JvcyBub3QgaW1wbGVtZW50ZWQnKTtcbn1cblxuY29uc3QgU1VQUE9SVEVEX1RZUEVTID0gW1xuICAnc2tpbGwnLFxuICAnYWJpbGl0eScsXG4gICdjeXBoZXInXG5dO1xuXG4vKipcbiAqIENyZWF0ZSBhIE1hY3JvIGZyb20gYW4gSXRlbSBkcm9wLlxuICogR2V0IGFuIGV4aXN0aW5nIGl0ZW0gbWFjcm8gaWYgb25lIGV4aXN0cywgb3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBvbmUuXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgVGhlIGRyb3BwZWQgZGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IHNsb3QgICAgIFRoZSBob3RiYXIgc2xvdCB0byB1c2VcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ3lwaGVyTWFjcm8oZGF0YSwgc2xvdCkge1xuICBjb25zdCBpc093bmVkID0gJ2RhdGEnIGluIGRhdGE7XG4gIGlmICghaXNPd25lZCkge1xuICAgIHJldHVybiB1aS5ub3RpZmljYXRpb25zLndhcm4oZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubWFjcm8uY3JlYXRlLm5vdE93bmVkJykpO1xuICB9XG5cbiAgY29uc3QgaXRlbSA9IGRhdGEuZGF0YTtcbiAgaWYgKCFTVVBQT1JURURfVFlQRVMuaW5jbHVkZXMoaXRlbS50eXBlKSkge1xuICAgIHJldHVybiB1aS5ub3RpZmljYXRpb25zLndhcm4oZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubWFjcm8uY3JlYXRlLnVuc3VwcG9ydGVkVHlwZScpKTtcbiAgfVxuXG4gIGNvbnN0IHR5cGVUaXRsZUNhc2UgPSBpdGVtLnR5cGUuc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyBpdGVtLnR5cGUuc3Vic3RyKDEpO1xuICBjb25zdCBjb21tYW5kID0gYGdhbWUuY3lwaGVyc3lzdGVtLm1hY3JvLnVzZSR7dHlwZVRpdGxlQ2FzZX0oJyR7ZGF0YS5hY3RvcklkfScsICcke2l0ZW0uX2lkfScpO2A7XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBtYWNybyBhbHJlYWR5IGV4aXN0cywgaWYgbm90LCBjcmVhdGUgYSBuZXcgb25lXG4gIGxldCBtYWNybyA9IGdhbWUubWFjcm9zLmVudGl0aWVzLmZpbmQobSA9PiAobS5uYW1lID09PSBpdGVtLm5hbWUpICYmIChtLmNvbW1hbmQgPT09IGNvbW1hbmQpKTtcbiAgaWYgKCFtYWNybykge1xuICAgIG1hY3JvID0gYXdhaXQgTWFjcm8uY3JlYXRlKHtcbiAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcbiAgICAgIHR5cGU6ICdzY3JpcHQnLFxuICAgICAgaW1nOiBpdGVtLmltZyxcbiAgICAgIGNvbW1hbmQ6IGNvbW1hbmQsXG4gICAgICBmbGFnczoge1xuICAgICAgICAnY3lwaGVyc3lzdGVtLml0ZW1NYWNybyc6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdhbWUudXNlci5hc3NpZ25Ib3RiYXJNYWNybyhtYWNybywgc2xvdCk7XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgTlBDTWlncmF0b3IgfSBmcm9tICcuL25wYy1taWdyYXRpb25zJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1pZ3JhdGUoKSB7XG4gIGlmICghZ2FtZS51c2VyLmlzR00pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zb2xlLmluZm8oJy0tLSBTdGFydGluZyBNaWdyYXRpb24gUHJvY2VzcyAtLS0nKTtcblxuICBjb25zdCBucGNBY3RvcnMgPSBnYW1lLmFjdG9ycy5lbnRpdGllcy5maWx0ZXIoYWN0b3IgPT4gYWN0b3IuZGF0YS50eXBlID09PSAnbnBjJyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBucGNBY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBucGMgPSBucGNBY3RvcnNbaV07XG4gICAgY29uc3QgbmV3RGF0YSA9IGF3YWl0IE5QQ01pZ3JhdG9yKG5wYyk7XG4gICAgYXdhaXQgbnBjLnVwZGF0ZShuZXdEYXRhKTtcbiAgfVxuXG4gIGNvbnNvbGUuaW5mbygnLS0tIE1pZ3JhdGlvbiBQcm9jZXNzIEZpbmlzaGVkIC0tLScpO1xufVxuIiwiY29uc3QgbWlncmF0aW9ucyA9IFtcbiAge1xuICAgIHZlcnNpb246IDIsXG4gICAgYWN0aW9uOiAobnBjLCBkYXRhKSA9PiB7XG4gICAgICBkYXRhWydkYXRhLmhlYWx0aCddID0gbnBjLmRhdGEuZGF0YS5oZWFsdGgubWF4O1xuICBcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxuXTtcblxuYXN5bmMgZnVuY3Rpb24gbWlncmF0b3IobnBjLCBvYmogPSB7fSkge1xuICBsZXQgbmV3RGF0YSA9IE9iamVjdC5hc3NpZ24oeyBfaWQ6IG5wYy5faWQsIGRhdGE6IHsgdmVyc2lvbjogbnBjLmRhdGEuZGF0YS52ZXJzaW9uIH0gfSwgb2JqKTtcblxuICBtaWdyYXRpb25zLmZvckVhY2goaGFuZGxlciA9PiB7XG4gICAgY29uc3QgeyB2ZXJzaW9uIH0gPSBuZXdEYXRhLmRhdGE7XG4gICAgaWYgKHZlcnNpb24gPCBoYW5kbGVyLnZlcnNpb24pIHtcbiAgICAgIG5ld0RhdGEgPSBoYW5kbGVyLmFjdGlvbihucGMsIG5ld0RhdGEpO1xuICAgICAgbmV3RGF0YS52ZXJzaW9uID0gaGFuZGxlci52ZXJzaW9uO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG5ld0RhdGE7XG59XG5cbmV4cG9ydCBjb25zdCBOUENNaWdyYXRvciA9IG1pZ3JhdG9yO1xuIiwiLyogZ2xvYmFscyByZW5kZXJUZW1wbGF0ZSAqL1xuXG5pbXBvcnQgeyBSb2xsRGlhbG9nIH0gZnJvbSAnLi9kaWFsb2cvcm9sbC1kaWFsb2cuanMnO1xuXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4vZW51bXMvZW51bS1wb29sLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxUZXh0KGRpZVJvbGwsIHJvbGxUb3RhbCkge1xuICBsZXQgcGFydHMgPSBbXTtcblxuICBjb25zdCB0YXNrTGV2ZWwgPSBNYXRoLmZsb29yKHJvbGxUb3RhbCAvIDMpO1xuICBjb25zdCBza2lsbExldmVsID0gTWF0aC5mbG9vcigocm9sbFRvdGFsIC0gZGllUm9sbCkgLyAzICsgMC41KTtcbiAgY29uc3QgdG90YWxBY2hpZXZlZCA9IHRhc2tMZXZlbCArIHNraWxsTGV2ZWw7XG5cbiAgbGV0IHRuQ29sb3IgPSAnIzAwMDAwMCc7XG4gIGlmICh0b3RhbEFjaGlldmVkIDwgMykge1xuICAgIHRuQ29sb3IgPSAnIzBhODYwYSc7XG4gIH0gZWxzZSBpZiAodG90YWxBY2hpZXZlZCA8IDcpIHtcbiAgICB0bkNvbG9yID0gJyM4NDg0MDknO1xuICB9IGVsc2Uge1xuICAgIHRuQ29sb3IgPSAnIzBhODYwYSc7XG4gIH1cblxuICBsZXQgc3VjY2Vzc1RleHQgPSBgPCR7dG90YWxBY2hpZXZlZH0+YDtcbiAgaWYgKHNraWxsTGV2ZWwgIT09IDApIHtcbiAgICBjb25zdCBzaWduID0gc2tpbGxMZXZlbCA+IDAgPyBcIitcIiA6IFwiXCI7XG4gICAgc3VjY2Vzc1RleHQgKz0gYCAoJHt0YXNrTGV2ZWx9JHtzaWdufSR7c2tpbGxMZXZlbH0pYDtcbiAgfVxuXG4gIHBhcnRzLnB1c2goe1xuICAgIHRleHQ6IHN1Y2Nlc3NUZXh0LFxuICAgIGNvbG9yOiB0bkNvbG9yLFxuICAgIGNsczogJ3RhcmdldC1udW1iZXInXG4gIH0pXG5cbiAgc3dpdGNoIChkaWVSb2xsKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuaW50cnVzaW9uJyksXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgIGNsczogJ2VmZmVjdCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDE5OlxuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuZWZmZWN0Lm1pbm9yJyksXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgIGNsczogJ2VmZmVjdCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIDIwOlxuICAgICAgcGFydHMucHVzaCh7XG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuZWZmZWN0Lm1ham9yJyksXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgIGNsczogJ2VmZmVjdCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjeXBoZXJSb2xsKHsgcGFydHMgPSBbXSwgZGF0YSA9IHt9LCBhY3RvciA9IG51bGwsIGV2ZW50ID0gbnVsbCwgc3BlYWtlciA9IG51bGwsIGZsYXZvciA9IG51bGwsIHRpdGxlID0gbnVsbCwgaXRlbSA9IGZhbHNlIH0gPSB7fSkge1xuICBsZXQgcm9sbE1vZGUgPSBnYW1lLnNldHRpbmdzLmdldCgnY29yZScsICdyb2xsTW9kZScpO1xuICBsZXQgcm9sbGVkID0gZmFsc2U7XG4gIGxldCBmaWx0ZXJlZCA9IHBhcnRzLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICByZXR1cm4gZWwgIT0gJycgJiYgZWw7XG4gIH0pO1xuXG4gIC8vIEluZGljYXRlcyBmcmVlIGxldmVscyBvZiBlZmZvcnRcbiAgbGV0IHN0YXJ0aW5nRWZmb3J0ID0gMDtcbiAgbGV0IG1pbkVmZm9ydCA9IDA7XG4gIGlmIChkYXRhWydlZmZvcnQnXSkge1xuICAgIHN0YXJ0aW5nRWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnZWZmb3J0J10sIDEwKSB8fCAwO1xuICAgIG1pbkVmZm9ydCA9IHN0YXJ0aW5nRWZmb3J0O1xuICB9XG5cbiAgbGV0IG1heEVmZm9ydCA9IDE7XG4gIGlmIChkYXRhWydtYXhFZmZvcnQnXSkge1xuICAgIG1heEVmZm9ydCA9IHBhcnNlSW50KGRhdGFbJ21heEVmZm9ydCddLCAxMCkgfHwgMTtcbiAgfVxuXG4gIGNvbnN0IF9yb2xsID0gKGZvcm0gPSBudWxsKSA9PiB7XG4gICAgLy8gT3B0aW9uYWxseSBpbmNsdWRlIGVmZm9ydFxuICAgIGlmIChmb3JtICE9PSBudWxsKSB7XG4gICAgICBkYXRhWydlZmZvcnQnXSA9IHBhcnNlSW50KGZvcm0uZWZmb3J0LnZhbHVlLCAxMCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGFbJ2VmZm9ydCddKSB7XG4gICAgICBmaWx0ZXJlZC5wdXNoKGArJHtkYXRhWydlZmZvcnQnXSAqIDN9YCk7XG5cbiAgICAgIC8vIFRPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIGxvY2FsaXplIHRoaXMsIGNvbmNhdGluZyBzdHJpbmdzIGRvZXNuJ3Qgd29yayBmb3IgYWxsIGxhbmd1YWdlc1xuICAgICAgZmxhdm9yICs9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZWZmb3J0LmZsYXZvcicpLnJlcGxhY2UoJyMjRUZGT1JUIyMnLCBkYXRhWydlZmZvcnQnXSk7XG4gICAgfVxuXG4gICAgY29uc3Qgcm9sbCA9IG5ldyBSb2xsKGZpbHRlcmVkLmpvaW4oJycpLCBkYXRhKS5yb2xsKCk7XG4gICAgLy8gQ29udmVydCB0aGUgcm9sbCB0byBhIGNoYXQgbWVzc2FnZSBhbmQgcmV0dXJuIHRoZSByb2xsXG4gICAgcm9sbE1vZGUgPSBmb3JtID8gZm9ybS5yb2xsTW9kZS52YWx1ZSA6IHJvbGxNb2RlO1xuICAgIHJvbGxlZCA9IHRydWU7XG5cbiAgICByZXR1cm4gcm9sbDtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlID0gJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9kaWFsb2cvcm9sbC1kaWFsb2cuaHRtbCc7XG4gIGxldCBkaWFsb2dEYXRhID0ge1xuICAgIGZvcm11bGE6IGZpbHRlcmVkLmpvaW4oJyAnKSxcbiAgICBlZmZvcnQ6IHN0YXJ0aW5nRWZmb3J0LFxuICAgIG1pbkVmZm9ydDogbWluRWZmb3J0LFxuICAgIG1heEVmZm9ydDogbWF4RWZmb3J0LFxuICAgIGRhdGE6IGRhdGEsXG4gICAgcm9sbE1vZGU6IHJvbGxNb2RlLFxuICAgIHJvbGxNb2RlczogQ09ORklHLkRpY2Uucm9sbE1vZGVzXG4gIH07XG5cbiAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCBkaWFsb2dEYXRhKTtcbiAgLy9DcmVhdGUgRGlhbG9nIHdpbmRvd1xuICBsZXQgcm9sbDtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIG5ldyBSb2xsRGlhbG9nKHtcbiAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgIGNvbnRlbnQ6IGh0bWwsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIG9rOiB7XG4gICAgICAgICAgbGFiZWw6ICdPSycsXG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICAgY2FsbGJhY2s6IChodG1sKSA9PiB7XG4gICAgICAgICAgICByb2xsID0gX3JvbGwoaHRtbFswXS5jaGlsZHJlblswXSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIHJvbGwucmVzdWx0IGFnYWluc3QgdGFyZ2V0IG51bWJlclxuXG4gICAgICAgICAgICBjb25zdCB7IHBvb2wgfSA9IGRhdGE7XG4gICAgICAgICAgICBjb25zdCBhbW91bnRPZkVmZm9ydCA9IHBhcnNlSW50KGRhdGFbJ2VmZm9ydCddIHx8IDAsIDEwKTtcbiAgICAgICAgICAgIGNvbnN0IGVmZm9ydENvc3QgPSBhY3Rvci5nZXRFZmZvcnRDb3N0RnJvbVN0YXQocG9vbCwgYW1vdW50T2ZFZmZvcnQpO1xuICAgICAgICAgICAgY29uc3QgdG90YWxDb3N0ID0gcGFyc2VJbnQoZGF0YVsncG9vbENvc3QnXSB8fCAwLCAxMCkgKyBwYXJzZUludChlZmZvcnRDb3N0LmNvc3QsIDEwKTtcblxuICAgICAgICAgICAgaWYgKGFjdG9yLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgdG90YWxDb3N0KSAmJiAhZWZmb3J0Q29zdC53YXJuaW5nKSB7XG4gICAgICAgICAgICAgIHJvbGwudG9NZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBzcGVha2VyOiBzcGVha2VyLFxuICAgICAgICAgICAgICAgIGZsYXZvcjogZmxhdm9yXG4gICAgICAgICAgICAgIH0sIHsgcm9sbE1vZGUgfSk7XG5cbiAgICAgICAgICAgICAgYWN0b3Iuc3BlbmRGcm9tUG9vbChwb29sLCB0b3RhbENvc3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgICAgICAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xuICAgICAgICAgICAgICAgIHNwZWFrZXIsXG4gICAgICAgICAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmZhaWxlZC5mbGF2b3InKSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmZhaWxlZC5jb250ZW50JykucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSlcbiAgICAgICAgICAgICAgfV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+JyxcbiAgICAgICAgICBsYWJlbDogJ0NhbmNlbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZGVmYXVsdDogJ29rJyxcbiAgICAgIGNsb3NlOiAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUocm9sbGVkID8gcm9sbCA6IGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KS5yZW5kZXIodHJ1ZSk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGNvbnN0IHJlZ2lzdGVyU3lzdGVtU2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgY3VycmVuY3kgbmFtZVxuICAgKi9cbiAgZ2FtZS5zZXR0aW5ncy5yZWdpc3RlcignY3lwaGVyc3lzdGVtJywgJ2N1cnJlbmN5TmFtZScsIHtcbiAgICBuYW1lOiAnU0VUVElOR1MubmFtZS5jdXJyZW5jeU5hbWUnLFxuICAgIGhpbnQ6ICdTRVRUSU5HUy5oaW50LmN1cnJlbmN5TmFtZScsXG4gICAgc2NvcGU6ICd3b3JsZCcsXG4gICAgY29uZmlnOiB0cnVlLFxuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnTW9uZXknXG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgR01JbnRydXNpb25EaWFsb2cgfSBmcm9tIFwiLi9kaWFsb2cvZ20taW50cnVzaW9uLWRpYWxvZy5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3NyU29ja2V0TGlzdGVuZXJzKCkge1xuICBnYW1lLnNvY2tldC5vbignc3lzdGVtLmN5cGhlcnN5c3RlbScsIGhhbmRsZU1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVNZXNzYWdlKGFyZ3MpIHtcbiAgY29uc3QgeyB0eXBlIH0gPSBhcmdzO1xuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ2dtSW50cnVzaW9uJzpcbiAgICAgIGhhbmRsZUdNSW50cnVzaW9uKGFyZ3MpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnYXdhcmRYUCc6XG4gICAgICBoYW5kbGVBd2FyZFhQKGFyZ3MpO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlR01JbnRydXNpb24oYXJncykge1xuICBjb25zdCB7IGRhdGEgfSA9IGFyZ3M7XG4gIGNvbnN0IHsgYWN0b3JJZCwgdXNlcklkcyB9ID0gZGF0YTtcblxuICBpZiAoIWdhbWUucmVhZHkgfHwgZ2FtZS51c2VyLmlzR00gfHwgIXVzZXJJZHMuZmluZChpZCA9PiBpZCA9PT0gZ2FtZS51c2VySWQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5lbnRpdGllcy5maW5kKGEgPT4gYS5kYXRhLl9pZCA9PT0gYWN0b3JJZCk7XG4gIGNvbnN0IGRpYWxvZyA9IG5ldyBHTUludHJ1c2lvbkRpYWxvZyhhY3Rvcik7XG4gIGRpYWxvZy5yZW5kZXIodHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUF3YXJkWFAoYXJncykge1xuICBjb25zdCB7IGRhdGEgfSA9IGFyZ3M7XG4gIGNvbnN0IHsgYWN0b3JJZCwgeHBBbW91bnQgfSA9IGRhdGE7XG5cbiAgaWYgKCFnYW1lLnJlYWR5IHx8ICFnYW1lLnVzZXIuaXNHTSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGFjdG9yID0gZ2FtZS5hY3RvcnMuZ2V0KGFjdG9ySWQpO1xuICBhY3Rvci51cGRhdGUoe1xuICAgICdkYXRhLnhwJzogYWN0b3IuZGF0YS5kYXRhLnhwICsgeHBBbW91bnRcbiAgfSk7XG5cbiAgQ2hhdE1lc3NhZ2UuY3JlYXRlKHtcbiAgICBjb250ZW50OiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnRydXNpb24uYXdhcmRYUCcpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLmRhdGEubmFtZSlcbiAgfSk7XG59XG4iLCIvKiBnbG9iYWxzIGxvYWRUZW1wbGF0ZXMgKi9cblxuLyoqXG4gKiBEZWZpbmUgYSBzZXQgb2YgdGVtcGxhdGUgcGF0aHMgdG8gcHJlLWxvYWRcbiAqIFByZS1sb2FkZWQgdGVtcGxhdGVzIGFyZSBjb21waWxlZCBhbmQgY2FjaGVkIGZvciBmYXN0IGFjY2VzcyB3aGVuIHJlbmRlcmluZ1xuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGNvbnN0IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzID0gYXN5bmMoKSA9PiB7XG4gIC8vIERlZmluZSB0ZW1wbGF0ZSBwYXRocyB0byBsb2FkXG4gIGNvbnN0IHRlbXBsYXRlUGF0aHMgPSBbXG5cbiAgICAgIC8vIEFjdG9yIFNoZWV0c1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGMtc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvbnBjLXNoZWV0Lmh0bWxcIixcblxuICAgICAgLy8gQWN0b3IgUGFydGlhbHNcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3Bvb2xzLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2FkdmFuY2VtZW50Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2RhbWFnZS10cmFjay5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9yZWNvdmVyeS5odG1sXCIsXG5cbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3NraWxscy5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9hYmlsaXRpZXMuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW52ZW50b3J5Lmh0bWxcIixcblxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9za2lsbC1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJtb3ItaW5mby5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3dlYXBvbi1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vZ2Vhci1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vY3lwaGVyLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcnRpZmFjdC1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vb2RkaXR5LWluZm8uaHRtbFwiLFxuXG4gICAgICAvLyBJdGVtIFNoZWV0c1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9pdGVtLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vc2tpbGwtc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9hcm1vci1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL3dlYXBvbi1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2dlYXItc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9jeXBoZXItc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9hcnRpZmFjdC1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL29kZGl0eS1zaGVldC5odG1sXCIsXG5cbiAgICAgIC8vIERpYWxvZ3NcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2RpYWxvZy9yb2xsLWRpYWxvZy5odG1sXCIsXG4gIF07XG5cbiAgLy8gTG9hZCB0aGUgdGVtcGxhdGUgcGFydHNcbiAgcmV0dXJuIGxvYWRUZW1wbGF0ZXModGVtcGxhdGVQYXRocyk7XG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGRlZXBQcm9wKG9iaiwgcGF0aCkge1xuICBjb25zdCBwcm9wcyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgbGV0IHZhbCA9IG9iajtcbiAgcHJvcHMuZm9yRWFjaChwID0+IHtcbiAgICBpZiAocCBpbiB2YWwpIHtcbiAgICAgIHZhbCA9IHZhbFtwXTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbCkge1xuICByZXR1cm4gISh2YWwgPT09IG51bGwgfHwgdHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsT3JEZWZhdWx0KHZhbCwgZGVmKSB7XG4gIHJldHVybiBpc0RlZmluZWQodmFsKSA/IHZhbCA6IGRlZjtcbn1cbiIsImZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykge1xuICAgIGFycjJbaV0gPSBhcnJbaV07XG4gIH1cblxuICByZXR1cm4gYXJyMjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlMaWtlVG9BcnJheTsiLCJmdW5jdGlvbiBfYXJyYXlXaXRoSG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5V2l0aEhvbGVzOyIsImZ1bmN0aW9uIF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZikge1xuICBpZiAoc2VsZiA9PT0gdm9pZCAwKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIHNlbGY7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2Fzc2VydFRoaXNJbml0aWFsaXplZDsiLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCJmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jbGFzc0NhbGxDaGVjazsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NyZWF0ZUNsYXNzOyIsInZhciBzdXBlclByb3BCYXNlID0gcmVxdWlyZShcIi4vc3VwZXJQcm9wQmFzZVwiKTtcblxuZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICBpZiAodHlwZW9mIFJlZmxlY3QgIT09IFwidW5kZWZpbmVkXCIgJiYgUmVmbGVjdC5nZXQpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF9nZXQgPSBSZWZsZWN0LmdldDtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF9nZXQgPSBmdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gICAgICB2YXIgYmFzZSA9IHN1cGVyUHJvcEJhc2UodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gICAgICBpZiAoIWJhc2UpIHJldHVybjtcbiAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiYXNlLCBwcm9wZXJ0eSk7XG5cbiAgICAgIGlmIChkZXNjLmdldCkge1xuICAgICAgICByZXR1cm4gZGVzYy5nZXQuY2FsbChyZWNlaXZlcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlciB8fCB0YXJnZXQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9nZXQ7IiwiZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfZ2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICAgIHJldHVybiBvLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG4gIH07XG4gIHJldHVybiBfZ2V0UHJvdG90eXBlT2Yobyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dldFByb3RvdHlwZU9mOyIsInZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuL3NldFByb3RvdHlwZU9mXCIpO1xuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBzZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2luaGVyaXRzOyIsImZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgXCJkZWZhdWx0XCI6IG9ialxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQ7IiwiZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkge1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkpIHJldHVybjtcbiAgdmFyIF9hcnIgPSBbXTtcbiAgdmFyIF9uID0gdHJ1ZTtcbiAgdmFyIF9kID0gZmFsc2U7XG4gIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHtcbiAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIF9kID0gdHJ1ZTtcbiAgICBfZSA9IGVycjtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFfbiAmJiBfaVtcInJldHVyblwiXSAhPSBudWxsKSBfaVtcInJldHVyblwiXSgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBfYXJyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pdGVyYWJsZVRvQXJyYXlMaW1pdDsiLCJmdW5jdGlvbiBfbm9uSXRlcmFibGVSZXN0KCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9ub25JdGVyYWJsZVJlc3Q7IiwidmFyIF90eXBlb2YgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBhc3NlcnRUaGlzSW5pdGlhbGl6ZWQgPSByZXF1aXJlKFwiLi9hc3NlcnRUaGlzSW5pdGlhbGl6ZWRcIik7XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHtcbiAgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHtcbiAgICByZXR1cm4gY2FsbDtcbiAgfVxuXG4gIHJldHVybiBhc3NlcnRUaGlzSW5pdGlhbGl6ZWQoc2VsZik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm47IiwiZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHtcbiAgICBvLl9fcHJvdG9fXyA9IHA7XG4gICAgcmV0dXJuIG87XG4gIH07XG5cbiAgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfc2V0UHJvdG90eXBlT2Y7IiwidmFyIGFycmF5V2l0aEhvbGVzID0gcmVxdWlyZShcIi4vYXJyYXlXaXRoSG9sZXNcIik7XG5cbnZhciBpdGVyYWJsZVRvQXJyYXlMaW1pdCA9IHJlcXVpcmUoXCIuL2l0ZXJhYmxlVG9BcnJheUxpbWl0XCIpO1xuXG52YXIgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkgPSByZXF1aXJlKFwiLi91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheVwiKTtcblxudmFyIG5vbkl0ZXJhYmxlUmVzdCA9IHJlcXVpcmUoXCIuL25vbkl0ZXJhYmxlUmVzdFwiKTtcblxuZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7XG4gIHJldHVybiBhcnJheVdpdGhIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBub25JdGVyYWJsZVJlc3QoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfc2xpY2VkVG9BcnJheTsiLCJ2YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi9nZXRQcm90b3R5cGVPZlwiKTtcblxuZnVuY3Rpb24gX3N1cGVyUHJvcEJhc2Uob2JqZWN0LCBwcm9wZXJ0eSkge1xuICB3aGlsZSAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KSkge1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zdXBlclByb3BCYXNlOyIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gIFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtcblxuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfdHlwZW9mKG9iaik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3R5cGVvZjsiLCJ2YXIgYXJyYXlMaWtlVG9BcnJheSA9IHJlcXVpcmUoXCIuL2FycmF5TGlrZVRvQXJyYXlcIik7XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpO1xuICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5OyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIl19
