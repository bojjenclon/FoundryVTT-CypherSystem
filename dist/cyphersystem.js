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

        while (!el.dataset.id) {
          el = el.parentElement;
        }

        var skillId = el.dataset.id;
        var actor = _this4.actor;
        var skill = actor.getOwnedItem(skillId);
        _this4.selectedSkill = skill;
      }));
      var selectedSkill = this.selectedSkill;

      if (selectedSkill) {
        html.find('.skill-info .actions .roll').click((function (evt) {
          evt.preventDefault();
          selectedSkill.roll(); // this._rollItemDialog(selectedSkill.data.data.pool);
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

        while (!el.dataset.id) {
          el = el.parentElement;
        }

        var abilityId = el.dataset.id;
        var actor = _this5.actor;
        var ability = actor.getOwnedItem(abilityId);
        _this5.selectedAbility = ability;
      }));
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

        while (!el.dataset.id) {
          el = el.parentElement;
        }

        var invItemId = el.dataset.id;
        var actor = _this6.actor;
        var invItem = actor.getOwnedItem(invItemId);
        _this6.selectedInvItem = invItem;
      }));
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
  }]);
  return CypherSystemActorSheet;
})(ActorSheet);

exports.CypherSystemActorSheet = CypherSystemActorSheet;

},{"../config.js":5,"../enums/enum-pool.js":11,"../item/item.js":18,"../rolls.js":19,"../utils.js":23,"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36,"@babel/runtime/helpers/slicedToArray":38,"@babel/runtime/regenerator":43}],2:[function(require,module,exports){
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
      data.health = (0, _utils.valOrDefault)(data.health, {
        value: 3,
        max: 3
      });
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
      var stat = actorData.stats[poolName.toLowerCase()]; //The first effort level costs 3 pts from the pool, extra levels cost 2
      //Substract the related Edge, too

      var availableEffortFromPool = (stat.value + stat.edge - 1) / 2; //A PC can use as much as their Effort score, but not more
      //They're also limited by their current pool value

      var finalEffort = Math.min(effortLevel, actorData.effort, availableEffortFromPool);
      var cost = 1 + 2 * finalEffort - stat.edge; //TODO take free levels of Effort into account here

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

},{"../config.js":5,"../dialog/player-choice-dialog.js":9,"../enums/enum-pool.js":11,"../utils.js":23,"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36,"@babel/runtime/regenerator":43}],3:[function(require,module,exports){
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

},{"./rolls.js":19}],4:[function(require,module,exports){
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

},{"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/regenerator":43}],5:[function(require,module,exports){
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

},{"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/slicedToArray":38}],7:[function(require,module,exports){
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

var _socket = require("./socket.js");

var _combat = require("./combat.js");

/* global Combat */
// Import Modules
Hooks.once('init', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
  return _regenerator.default.wrap((function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          game.cyphersystem = {
            CypherSystemActor: _actor.CypherSystemActor,
            CypherSystemItem: _item.CypherSystemItem
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
Hooks.on('getActorDirectoryEntryContext', _contextMenu.actorDirectoryContext);
Hooks.on('createActor', /*#__PURE__*/(function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee2(actor, options, userId) {
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

  return function (_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})());
Hooks.once('ready', _socket.csrSocketListeners);

},{"./actor/actor-sheet.js":1,"./actor/actor.js":2,"./chat.js":3,"./combat.js":4,"./context-menu.js":6,"./handlebars-helpers.js":16,"./item/item-sheet.js":17,"./item/item.js":18,"./settings.js":20,"./socket.js":21,"./template.js":22,"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/regenerator":43}],8:[function(require,module,exports){
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

},{"@babel/runtime/helpers/assertThisInitialized":26,"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36,"@babel/runtime/regenerator":43}],9:[function(require,module,exports){
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

},{"@babel/runtime/helpers/assertThisInitialized":26,"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36}],10:[function(require,module,exports){
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

},{"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36}],11:[function(require,module,exports){
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

},{"../config.js":5,"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36}],18:[function(require,module,exports){
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
      var parts = ['1d20'];

      if (assets !== 0) {
        var sign = assets < 0 ? '-' : '+';
        parts.push("".concat(sign, " ").concat(Math.abs(assets) * 3));
      }

      (0, _rolls.cypherRoll)({
        parts: parts,
        data: {
          pool: pool,
          abilityCost: 0,
          maxEffort: actorData.effort,
          assets: assets
        },
        event: event,
        title: game.i18n.localize('CSR.roll.skill.title'),
        flavor: game.i18n.localize('CSR.roll.skill.flavor').replace('##ACTOR##', actor.name).replace('##POOL##', name),
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
        var pool = cost.pool;

        if (actor.canSpendFromPool(pool, parseInt(cost.amount, 10))) {
          (0, _rolls.cypherRoll)({
            event: event,
            parts: ['1d20'],
            data: {
              pool: pool,
              abilityCost: cost.amount,
              maxEffort: actorData.effort
            },
            speaker: ChatMessage.getSpeaker({
              actor: actor
            }),
            flavor: "".concat(actor.name, " used ").concat(name),
            title: 'Use Ability',
            actor: actor
          });
        } else {
          var poolName = _enumPool.default[pool];
          ChatMessage.create([{
            speaker: ChatMessage.getSpeaker({
              actor: actor
            }),
            flavor: 'Ability Failed',
            content: "Not enough points in ".concat(poolName, " pool.")
          }]);
        }
      } else {
        ChatMessage.create([{
          speaker: ChatMessage.getSpeaker({
            actor: actor
          }),
          flavor: 'Invalid Ability',
          content: "This ability is an Enabler and cannot be rolled for."
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

},{"../enums/enum-pool.js":11,"../enums/enum-range.js":12,"../enums/enum-training.js":13,"../enums/enum-weapon-category.js":14,"../enums/enum-weight.js":15,"../rolls.js":19,"../utils.js":23,"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/classCallCheck":28,"@babel/runtime/helpers/createClass":29,"@babel/runtime/helpers/get":30,"@babel/runtime/helpers/getPrototypeOf":31,"@babel/runtime/helpers/inherits":32,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/helpers/possibleConstructorReturn":36,"@babel/runtime/regenerator":43}],19:[function(require,module,exports){
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
            }));
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
              maxEffort: maxEffort,
              data: data,
              rollMode: rollMode,
              rollModes: CONFIG.Dice.rollModes
            };
            _context.next = 11;
            return renderTemplate(template, dialogData);

          case 11:
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
                      var totalCost = parseInt(data['abilityCost'] || 0, 10) + parseInt(effortCost.cost, 10);

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

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }), _callee);
  })));
  return _cypherRoll.apply(this, arguments);
}

},{"./dialog/roll-dialog.js":10,"./enums/enum-pool.js":11,"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/regenerator":43}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./dialog/gm-intrusion-dialog.js":8}],22:[function(require,module,exports){
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

},{"@babel/runtime/helpers/asyncToGenerator":27,"@babel/runtime/helpers/interopRequireDefault":33,"@babel/runtime/regenerator":43}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],25:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],26:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{"./superPropBase":39}],31:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],32:[function(require,module,exports){
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
},{"./setPrototypeOf":37}],33:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],36:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":40,"./assertThisInitialized":26}],37:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],38:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":25,"./iterableToArrayLimit":34,"./nonIterableRest":35,"./unsupportedIterableToArray":41}],39:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":31}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
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
},{"./arrayLikeToArray":24}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":42}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY2hhdC5qcyIsIm1vZHVsZS9jb21iYXQuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2NvbnRleHQtbWVudS5qcyIsIm1vZHVsZS9jeXBoZXJzeXN0ZW0uanMiLCJtb2R1bGUvZGlhbG9nL2dtLWludHJ1c2lvbi1kaWFsb2cuanMiLCJtb2R1bGUvZGlhbG9nL3BsYXllci1jaG9pY2UtZGlhbG9nLmpzIiwibW9kdWxlL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXBvb2wuanMiLCJtb2R1bGUvZW51bXMvZW51bS1yYW5nZS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXRyYWluaW5nLmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VpZ2h0LmpzIiwibW9kdWxlL2hhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1vZHVsZS9pdGVtL2l0ZW0tc2hlZXQuanMiLCJtb2R1bGUvaXRlbS9pdGVtLmpzIiwibW9kdWxlL3JvbGxzLmpzIiwibW9kdWxlL3NldHRpbmdzLmpzIiwibW9kdWxlL3NvY2tldC5qcyIsIm1vZHVsZS90ZW1wbGF0ZS5qcyIsIm1vZHVsZS91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhIb2xlcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheUxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVSZXN0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3N1cGVyUHJvcEJhc2UuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL3Jl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S0FBZSxXQUFqQyxDQUFQO0FBQ0Q7O0FBRU0sU0FBUyxZQUFULENBQXNCLEdBQXRCLEVBQTJCLEdBQTNCLEVBQWdDO0FBQ3JDLFNBQU8sU0FBUyxDQUFDLEdBQUQsQ0FBVCxHQUFpQixHQUFqQixHQUF1QixHQUE5QjtBQUNEOzs7QUNqQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDenRCQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogZ2xvYmFscyBtZXJnZU9iamVjdCBEaWFsb2cgQ29udGV4dE1lbnUgKi9cblxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcbmltcG9ydCB7IGN5cGhlclJvbGwgfSBmcm9tICcuLi9yb2xscy5qcyc7XG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1JdGVtIH0gZnJvbSAnLi4vaXRlbS9pdGVtLmpzJztcbmltcG9ydCB7IGRlZXBQcm9wIH0gZnJvbSAnLi4vdXRpbHMuanMnO1xuXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4uL2VudW1zL2VudW0tcG9vbC5qcyc7XG5cbi8qKlxuICogRXh0ZW5kIHRoZSBiYXNpYyBBY3RvclNoZWV0IHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zXG4gKiBAZXh0ZW5kcyB7QWN0b3JTaGVldH1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUFjdG9yU2hlZXQgZXh0ZW5kcyBBY3RvclNoZWV0IHtcblxuICAvKiogQG92ZXJyaWRlICovXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XG4gICAgICBjbGFzc2VzOiBbXCJjeXBoZXJzeXN0ZW1cIiwgXCJzaGVldFwiLCBcImFjdG9yXCJdLFxuICAgICAgd2lkdGg6IDYwMCxcbiAgICAgIGhlaWdodDogNTAwLFxuICAgICAgdGFiczogW3sgXG4gICAgICAgIG5hdlNlbGVjdG9yOiBcIi5zaGVldC10YWJzXCIsIFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6IFwiLnNoZWV0LWJvZHlcIiwgXG4gICAgICAgIGluaXRpYWw6IFwiZGVzY3JpcHRpb25cIiBcbiAgICAgIH0sIHtcbiAgICAgICAgbmF2U2VsZWN0b3I6ICcuc3RhdHMtdGFicycsXG4gICAgICAgIGNvbnRlbnRTZWxlY3RvcjogJy5zdGF0cy1ib2R5JyxcbiAgICAgICAgaW5pdGlhbDogJ2FkdmFuY2VtZW50J1xuICAgICAgfV0sXG4gICAgICBzY3JvbGxZOiBbXG4gICAgICAgICcudGFiLmludmVudG9yeSAuaW52ZW50b3J5LWxpc3QnLFxuICAgICAgICAnLnRhYi5pbnZlbnRvcnkgLmludmVudG9yeS1pbmZvJyxcbiAgICAgIF1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvcnJlY3QgSFRNTCB0ZW1wbGF0ZSBwYXRoIHRvIHVzZSBmb3IgcmVuZGVyaW5nIHRoaXMgcGFydGljdWxhciBzaGVldFxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHJldHVybiBgc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yLyR7dHlwZX0tc2hlZXQuaHRtbGA7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIF9wY0luaXQoKSB7XG4gICAgdGhpcy5za2lsbHNQb29sRmlsdGVyID0gLTE7XG4gICAgdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XG5cbiAgICB0aGlzLmFiaWxpdHlQb29sRmlsdGVyID0gLTE7XG4gICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xuXG4gICAgdGhpcy5pbnZlbnRvcnlUeXBlRmlsdGVyID0gLTE7XG4gICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBudWxsO1xuICAgIHRoaXMuZmlsdGVyRXF1aXBwZWQgPSBmYWxzZTtcbiAgfVxuXG4gIF9ucGNJbml0KCkge1xuICB9XG5cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuXG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLmFjdG9yLmRhdGE7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdwYyc6XG4gICAgICAgIHRoaXMuX3BjSW5pdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIHRoaXMuX25wY0luaXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgdHlwZSwgZmllbGQpIHtcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcbiAgICBpZiAoIWl0ZW1zW2ZpZWxkXSkge1xuICAgICAgaXRlbXNbZmllbGRdID0gaXRlbXMuZmlsdGVyKGkgPT4gaS50eXBlID09PSB0eXBlKTsgLy8uc29ydChzb3J0RnVuY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIF9maWx0ZXJJdGVtRGF0YShkYXRhLCBpdGVtRmllbGQsIGZpbHRlckZpZWxkLCBmaWx0ZXJWYWx1ZSkge1xuICAgIGNvbnN0IGl0ZW1zID0gZGF0YS5kYXRhLml0ZW1zO1xuICAgIGl0ZW1zW2l0ZW1GaWVsZF0gPSBpdGVtc1tpdGVtRmllbGRdLmZpbHRlcihpdG0gPT4gZGVlcFByb3AoaXRtLCBmaWx0ZXJGaWVsZCkgPT09IGZpbHRlclZhbHVlKTtcbiAgfVxuXG4gIGFzeW5jIF9za2lsbERhdGEoZGF0YSkge1xuICAgIHRoaXMuX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgJ3NraWxsJywgJ3NraWxscycpO1xuICAgIC8vIEdyb3VwIHNraWxscyBieSB0aGVpciBwb29sLCB0aGVuIGFscGhhbnVtZXJpY2FsbHlcbiAgICBkYXRhLmRhdGEuaXRlbXMuc2tpbGxzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmIChhLmRhdGEucG9vbCA9PT0gYi5kYXRhLnBvb2wpIHtcbiAgICAgICAgcmV0dXJuIChhLm5hbWUgPiBiLm5hbWUpID8gMSA6IC0xXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoYS5kYXRhLnBvb2wgPiBiLmRhdGEucG9vbCkgPyAxIDogLTE7XG4gICAgfSk7XG5cbiAgICBkYXRhLnNraWxsc1Bvb2xGaWx0ZXIgPSB0aGlzLnNraWxsc1Bvb2xGaWx0ZXI7XG4gICAgZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXI7XG5cbiAgICBpZiAoZGF0YS5za2lsbHNQb29sRmlsdGVyID4gLTEpIHtcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdza2lsbHMnLCAnZGF0YS5wb29sJywgcGFyc2VJbnQoZGF0YS5za2lsbHNQb29sRmlsdGVyLCAxMCkpO1xuICAgIH1cbiAgICBpZiAoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ2RhdGEudHJhaW5pbmcnLCBwYXJzZUludChkYXRhLnNraWxsc1RyYWluaW5nRmlsdGVyLCAxMCkpO1xuICAgIH1cblxuICAgIGRhdGEuc2VsZWN0ZWRTa2lsbCA9IHRoaXMuc2VsZWN0ZWRTa2lsbDtcbiAgICBkYXRhLnNraWxsSW5mbyA9ICcnO1xuICAgIGlmIChkYXRhLnNlbGVjdGVkU2tpbGwpIHtcbiAgICAgIGRhdGEuc2tpbGxJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZFNraWxsLmdldEluZm8oKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBfYWJpbGl0eURhdGEoZGF0YSkge1xuICAgIHRoaXMuX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgJ2FiaWxpdHknLCAnYWJpbGl0aWVzJyk7XG4gICAgLy8gR3JvdXAgYWJpbGl0aWVzIGJ5IHRoZWlyIHBvb2wsIHRoZW4gYWxwaGFudW1lcmljYWxseVxuICAgIGRhdGEuZGF0YS5pdGVtcy5hYmlsaXRpZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKGEuZGF0YS5jb3N0LnBvb2wgPT09IGIuZGF0YS5jb3N0LnBvb2wpIHtcbiAgICAgICAgcmV0dXJuIChhLm5hbWUgPiBiLm5hbWUpID8gMSA6IC0xXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoYS5kYXRhLmNvc3QucG9vbCA+IGIuZGF0YS5jb3N0LnBvb2wpID8gMSA6IC0xO1xuICAgIH0pO1xuXG4gICAgZGF0YS5hYmlsaXR5UG9vbEZpbHRlciA9IHRoaXMuYWJpbGl0eVBvb2xGaWx0ZXI7XG5cbiAgICBpZiAoZGF0YS5hYmlsaXR5UG9vbEZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnYWJpbGl0aWVzJywgJ2RhdGEuY29zdC5wb29sJywgcGFyc2VJbnQoZGF0YS5hYmlsaXR5UG9vbEZpbHRlciwgMTApKTtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkQWJpbGl0eSA9IHRoaXMuc2VsZWN0ZWRBYmlsaXR5O1xuICAgIGRhdGEuYWJpbGl0eUluZm8gPSAnJztcbiAgICBpZiAoZGF0YS5zZWxlY3RlZEFiaWxpdHkpIHtcbiAgICAgIGRhdGEuYWJpbGl0eUluZm8gPSBhd2FpdCBkYXRhLnNlbGVjdGVkQWJpbGl0eS5nZXRJbmZvKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX2ludmVudG9yeURhdGEoZGF0YSkge1xuICAgIGRhdGEuaW52ZW50b3J5VHlwZXMgPSBDU1IuaW52ZW50b3J5VHlwZXM7XG5cbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcbiAgICBpZiAoIWl0ZW1zLmludmVudG9yeSkge1xuICAgICAgaXRlbXMuaW52ZW50b3J5ID0gaXRlbXMuZmlsdGVyKGkgPT4gQ1NSLmludmVudG9yeVR5cGVzLmluY2x1ZGVzKGkudHlwZSkpO1xuXG4gICAgICBpZiAodGhpcy5maWx0ZXJFcXVpcHBlZCkge1xuICAgICAgICBpdGVtcy5pbnZlbnRvcnkgPSBpdGVtcy5pbnZlbnRvcnkuZmlsdGVyKGkgPT4gISFpLmRhdGEuZXF1aXBwZWQpO1xuICAgICAgfVxuXG4gICAgICAvLyBHcm91cCBpdGVtcyBieSB0aGVpciB0eXBlLCB0aGVuIGFscGhhbnVtZXJpY2FsbHlcbiAgICAgIGl0ZW1zLmludmVudG9yeS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnR5cGUgPT09IGIudHlwZSkge1xuICAgICAgICAgIHJldHVybiAoYS5uYW1lID4gYi5uYW1lKSA/IDEgOiAtMVxuICAgICAgICB9XG4gIFxuICAgICAgICByZXR1cm4gKGEudHlwZSA+IGIudHlwZSkgPyAxIDogLTE7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkYXRhLmN5cGhlckNvdW50ID0gaXRlbXMucmVkdWNlKChjb3VudCwgaSkgPT4gaS50eXBlID09PSAnY3lwaGVyJyA/ICsrY291bnQgOiBjb3VudCwgMCk7XG4gICAgZGF0YS5vdmVyQ3lwaGVyTGltaXQgPSB0aGlzLmFjdG9yLmlzT3ZlckN5cGhlckxpbWl0O1xuXG4gICAgZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyID0gdGhpcy5pbnZlbnRvcnlUeXBlRmlsdGVyO1xuICAgIGRhdGEuZmlsdGVyRXF1aXBwZWQgPSB0aGlzLmZpbHRlckVxdWlwcGVkO1xuXG4gICAgaWYgKGRhdGEuaW52ZW50b3J5VHlwZUZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnaW52ZW50b3J5JywgJ3R5cGUnLCBDU1IuaW52ZW50b3J5VHlwZXNbcGFyc2VJbnQoZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyLCAxMCldKTtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkSW52SXRlbSA9IHRoaXMuc2VsZWN0ZWRJbnZJdGVtO1xuICAgIGRhdGEuaW52SXRlbUluZm8gPSAnJztcbiAgICBpZiAoZGF0YS5zZWxlY3RlZEludkl0ZW0pIHtcbiAgICAgIGRhdGEuaW52SXRlbUluZm8gPSBhd2FpdCBkYXRhLnNlbGVjdGVkSW52SXRlbS5nZXRJbmZvKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgX3BjRGF0YShkYXRhKSB7XG4gICAgZGF0YS5pc0dNID0gZ2FtZS51c2VyLmlzR007XG5cbiAgICBkYXRhLmN1cnJlbmN5TmFtZSA9IGdhbWUuc2V0dGluZ3MuZ2V0KCdjeXBoZXJzeXN0ZW0nLCAnY3VycmVuY3lOYW1lJyk7XG5cbiAgICBkYXRhLnJhbmdlcyA9IENTUi5yYW5nZXM7XG4gICAgZGF0YS5zdGF0cyA9IENTUi5zdGF0cztcbiAgICBkYXRhLndlYXBvblR5cGVzID0gQ1NSLndlYXBvblR5cGVzO1xuICAgIGRhdGEud2VpZ2h0cyA9IENTUi53ZWlnaHRDbGFzc2VzO1xuXG4gICAgZGF0YS5hZHZhbmNlcyA9IE9iamVjdC5lbnRyaWVzKGRhdGEuYWN0b3IuZGF0YS5hZHZhbmNlcykubWFwKFxuICAgICAgKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IuYWR2YW5jZS4ke2tleX1gKSxcbiAgICAgICAgICBpc0NoZWNrZWQ6IHZhbHVlLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG5cbiAgICBkYXRhLmRhbWFnZVRyYWNrRGF0YSA9IENTUi5kYW1hZ2VUcmFjaztcbiAgICBkYXRhLmRhbWFnZVRyYWNrID0gQ1NSLmRhbWFnZVRyYWNrW2RhdGEuZGF0YS5kYW1hZ2VUcmFja107XG5cbiAgICBkYXRhLnJlY292ZXJpZXNEYXRhID0gT2JqZWN0LmVudHJpZXMoXG4gICAgICBkYXRhLmFjdG9yLmRhdGEucmVjb3Zlcmllc1xuICAgICkubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleSxcbiAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZShgQ1NSLnJlY292ZXJ5LiR7a2V5fWApLFxuICAgICAgICBjaGVja2VkOiB2YWx1ZSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBkYXRhLnRyYWluaW5nTGV2ZWxzID0gQ1NSLnRyYWluaW5nTGV2ZWxzO1xuXG4gICAgZGF0YS5kYXRhLml0ZW1zID0gZGF0YS5hY3Rvci5pdGVtcyB8fCB7fTtcblxuICAgIGF3YWl0IHRoaXMuX3NraWxsRGF0YShkYXRhKTtcbiAgICBhd2FpdCB0aGlzLl9hYmlsaXR5RGF0YShkYXRhKTtcbiAgICBhd2FpdCB0aGlzLl9pbnZlbnRvcnlEYXRhKGRhdGEpO1xuICB9XG5cbiAgYXN5bmMgX25wY0RhdGEoZGF0YSkge1xuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgYXN5bmMgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuICAgIFxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICBhd2FpdCB0aGlzLl9wY0RhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnBjJzpcbiAgICAgICAgYXdhaXQgdGhpcy5fbnBjRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfY3JlYXRlSXRlbShpdGVtTmFtZSkge1xuICAgIGNvbnN0IGl0ZW1EYXRhID0ge1xuICAgICAgbmFtZTogYE5ldyAke2l0ZW1OYW1lLmNhcGl0YWxpemUoKX1gLFxuICAgICAgdHlwZTogaXRlbU5hbWUsXG4gICAgICBkYXRhOiBuZXcgQ3lwaGVyU3lzdGVtSXRlbSh7fSksXG4gICAgfTtcblxuICAgIHRoaXMuYWN0b3IuY3JlYXRlT3duZWRJdGVtKGl0ZW1EYXRhLCB7IHJlbmRlclNoZWV0OiB0cnVlIH0pO1xuICB9XG5cbiAgX3JvbGxQb29sRGlhbG9nKHBvb2wpIHtcbiAgICBjb25zdCB7IGFjdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcblxuICAgIGN5cGhlclJvbGwoe1xuICAgICAgcGFydHM6IFsnMWQyMCddLFxuXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBvb2wsXG4gICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydCxcbiAgICAgIH0sXG4gICAgICBldmVudCxcbiAgICAgIFxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucG9vbC50aXRsZScpLFxuICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnBvb2wuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IubmFtZSkucmVwbGFjZSgnIyNQT09MIyMnLCBwb29sTmFtZSksXG5cbiAgICAgIGFjdG9yLFxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxuICAgIH0pO1xuICB9XG5cbiAgX3JvbGxSZWNvdmVyeSgpIHtcbiAgICBjb25zdCB7IGFjdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcblxuICAgIGNvbnN0IHJvbGwgPSBuZXcgUm9sbChgMWQ2KyR7YWN0b3JEYXRhLnJlY292ZXJ5TW9kfWApLnJvbGwoKTtcblxuICAgIC8vIEZsYWcgdGhlIHJvbGwgYXMgYSByZWNvdmVyeSByb2xsXG4gICAgcm9sbC5kaWNlWzBdLm9wdGlvbnMucmVjb3ZlcnkgPSB0cnVlO1xuXG4gICAgcm9sbC50b01lc3NhZ2Uoe1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucmVjb3ZlcnkudGl0bGUnKSxcbiAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5yZWNvdmVyeS5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKSxcbiAgICB9KTtcbiAgfVxuXG4gIF9kZWxldGVJdGVtRGlhbG9nKGl0ZW1JZCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBjb25maXJtYXRpb25EaWFsb2cgPSBuZXcgRGlhbG9nKHtcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmRlbGV0ZS50aXRsZVwiKSxcbiAgICAgIGNvbnRlbnQ6IGA8cD4ke2dhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlLmNvbnRlbnRcIil9PC9wPjxociAvPmAsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIGNvbmZpcm06IHtcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5idXR0b24uZGVsZXRlXCIpLFxuICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFjdG9yLmRlbGV0ZU93bmVkSXRlbShpdGVtSWQpO1xuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+JyxcbiAgICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5idXR0b24uY2FuY2VsXCIpLFxuICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IFwiY2FuY2VsXCJcbiAgICB9KTtcbiAgICBjb25maXJtYXRpb25EaWFsb2cucmVuZGVyKHRydWUpO1xuICB9XG5cbiAgX3N0YXRzVGFiTGlzdGVuZXJzKGh0bWwpIHtcbiAgICAvLyBTdGF0cyBTZXR1cFxuICAgIGh0bWwuZmluZCgnLnJvbGwtcG9vbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5wb29sKSB7XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZWwuZGF0YXNldDtcblxuICAgICAgdGhpcy5fcm9sbFBvb2xEaWFsb2cocGFyc2VJbnQocG9vbCwgMTApKTtcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmRhbWFnZVRyYWNrXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJy5yZWNvdmVyeS1yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9yb2xsUmVjb3ZlcnkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9za2lsbHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIC8vIFNraWxscyBTZXR1cFxuICAgIGh0bWwuZmluZCgnLmFkZC1za2lsbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnc2tpbGwnKTtcbiAgICB9KTtcbiAgICBcbiAgICBjb25zdCBza2lsbHNQb29sRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInNraWxsc1Bvb2xGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBza2lsbHNQb29sRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5za2lsbHNQb29sRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XG4gICAgfSk7XG5cbiAgICBjb25zdCBza2lsbHNUcmFpbmluZ0ZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJza2lsbHNUcmFpbmluZ0ZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIHNraWxsc1RyYWluaW5nRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgfSk7XG5cbiAgICBjb25zdCBza2lsbHMgPSBodG1sLmZpbmQoJ2Euc2tpbGwnKTtcblxuICAgIHNraWxscy5vbignY2xpY2snLCBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuX29uU3VibWl0KGV2dCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pZCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBza2lsbElkID0gZWwuZGF0YXNldC5pZDtcblxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgICAgY29uc3Qgc2tpbGwgPSBhY3Rvci5nZXRPd25lZEl0ZW0oc2tpbGxJZCk7XG5cbiAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IHNraWxsO1xuICAgIH0pO1xuXG4gICAgY29uc3QgeyBzZWxlY3RlZFNraWxsIH0gPSB0aGlzO1xuICAgIGlmIChzZWxlY3RlZFNraWxsKSB7XG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5yb2xsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0ZWRTa2lsbC5yb2xsKCk7XG4gICAgICAgIC8vIHRoaXMuX3JvbGxJdGVtRGlhbG9nKHNlbGVjdGVkU2tpbGwuZGF0YS5kYXRhLnBvb2wpO1xuICAgICAgfSk7XG5cbiAgICAgIGh0bWwuZmluZCgnLnNraWxsLWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkU2tpbGwuc2hlZXQucmVuZGVyKHRydWUpO1xuICAgICAgfSk7XG5cbiAgICAgIGh0bWwuZmluZCgnLnNraWxsLWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZFNraWxsLl9pZCwgZGlkRGVsZXRlID0+IHtcbiAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfYWJpbGl0eVRhYkxpc3RlbmVycyhodG1sKSB7XG4gICAgLy8gQWJpbGl0aWVzIFNldHVwXG4gICAgaHRtbC5maW5kKCcuYWRkLWFiaWxpdHknKS5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHRoaXMuX2NyZWF0ZUl0ZW0oJ2FiaWxpdHknKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFiaWxpdHlQb29sRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImFiaWxpdHlQb29sRmlsdGVyXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gICAgYWJpbGl0eVBvb2xGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLmFiaWxpdHlQb29sRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFiaWxpdGllcyA9IGh0bWwuZmluZCgnYS5hYmlsaXR5Jyk7XG5cbiAgICBhYmlsaXRpZXMub24oJ2NsaWNrJywgZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xuXG4gICAgICBsZXQgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgLy8gQWNjb3VudCBmb3IgY2xpY2tpbmcgYSBjaGlsZCBlbGVtZW50XG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQuaWQpIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgY29uc3QgYWJpbGl0eUlkID0gZWwuZGF0YXNldC5pZDtcblxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgICAgY29uc3QgYWJpbGl0eSA9IGFjdG9yLmdldE93bmVkSXRlbShhYmlsaXR5SWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IGFiaWxpdHk7XG4gICAgfSk7XG5cbiAgICBjb25zdCB7IHNlbGVjdGVkQWJpbGl0eSB9ID0gdGhpcztcbiAgICBpZiAoc2VsZWN0ZWRBYmlsaXR5KSB7XG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLnJvbGwnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzZWxlY3RlZEFiaWxpdHkucm9sbCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5LnNoZWV0LnJlbmRlcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEFiaWxpdHkuX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX2ludmVudG9yeVRhYkxpc3RlbmVycyhodG1sKSB7XG4gICAgLy8gSW52ZW50b3J5IFNldHVwXG5cbiAgICBjb25zdCBjdHh0TWVudUVsID0gaHRtbC5maW5kKCcuY29udGV4dG1lbnUnKTtcbiAgICBjb25zdCBhZGRJbnZCdG4gPSBodG1sLmZpbmQoJy5hZGQtaW52ZW50b3J5Jyk7XG5cbiAgICBjb25zdCBtZW51SXRlbXMgPSBbXTtcbiAgICBDU1IuaW52ZW50b3J5VHlwZXMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgIG1lbnVJdGVtcy5wdXNoKHtcbiAgICAgICAgbmFtZTogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IuaW52ZW50b3J5LiR7dHlwZX1gKSxcbiAgICAgICAgaWNvbjogJycsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fY3JlYXRlSXRlbSh0eXBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29uc3QgY3R4dE1lbnVPYmogPSBuZXcgQ29udGV4dE1lbnUoaHRtbCwgJy5hY3RpdmUnLCBtZW51SXRlbXMpO1xuICAgIFxuICAgIGFkZEludkJ0bi5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vIEEgYml0IG9mIGEgaGFjayB0byBlbnN1cmUgdGhlIGNvbnRleHQgbWVudSBpc24ndFxuICAgICAgLy8gY3V0IG9mZiBkdWUgdG8gdGhlIHNoZWV0J3MgY29udGVudCByZWx5aW5nIG9uXG4gICAgICAvLyBvdmVyZmxvdyBoaWRkZW4uIEluc3RlYWQsIHdlIG5lc3QgdGhlIG1lbnUgaW5zaWRlXG4gICAgICAvLyBhIGZsb2F0aW5nIGFic29sdXRlbHkgcG9zaXRpb25lZCBkaXYsIHNldCB0byBvdmVybGFwXG4gICAgICAvLyB0aGUgYWRkIGludmVudG9yeSBpdGVtIGljb24uXG4gICAgICBjdHh0TWVudUVsLm9mZnNldChhZGRJbnZCdG4ub2Zmc2V0KCkpO1xuXG4gICAgICBjdHh0TWVudU9iai5yZW5kZXIoY3R4dE1lbnVFbC5maW5kKCcuY29udGFpbmVyJykpO1xuICAgIH0pO1xuXG4gICAgaHRtbC5vbignbW91c2Vkb3duJywgZXZ0ID0+IHtcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBhZGRJbnZCdG5bMF0pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBDbG9zZSB0aGUgY29udGV4dCBtZW51IGlmIHVzZXIgY2xpY2tzIGFueXdoZXJlIGVsc2VcbiAgICAgIGN0eHRNZW51T2JqLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBpbnZlbnRvcnlUeXBlRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImludmVudG9yeVR5cGVGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBpbnZlbnRvcnlUeXBlRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xuICAgICAgdGhpcy5pbnZlbnRvcnlUeXBlRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnLmZpbHRlci1lcXVpcHBlZCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5maWx0ZXJFcXVpcHBlZCA9ICF0aGlzLmZpbHRlckVxdWlwcGVkO1xuXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaW52SXRlbXMgPSBodG1sLmZpbmQoJ2EuaW52LWl0ZW0nKTtcblxuICAgIGludkl0ZW1zLm9uKCdjbGljaycsIGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcblxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0LmlkKSB7XG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGludkl0ZW1JZCA9IGVsLmRhdGFzZXQuaWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IGludkl0ZW0gPSBhY3Rvci5nZXRPd25lZEl0ZW0oaW52SXRlbUlkKTtcblxuICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBpbnZJdGVtO1xuICAgIH0pO1xuXG4gICAgY29uc3QgeyBzZWxlY3RlZEludkl0ZW0gfSA9IHRoaXM7XG4gICAgaWYgKHNlbGVjdGVkSW52SXRlbSkge1xuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbS5zaGVldC5yZW5kZXIodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEludkl0ZW0uX2lkLCBkaWREZWxldGUgPT4ge1xuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3BjTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0LmFjdG9yJykuYWRkQ2xhc3MoJ3BjLXdpbmRvdycpO1xuXG4gICAgLy8gSGFjaywgZm9yIHNvbWUgcmVhc29uIHRoZSBpbm5lciB0YWIncyBjb250ZW50IGRvZXNuJ3Qgc2hvdyBcbiAgICAvLyB3aGVuIGNoYW5naW5nIHByaW1hcnkgdGFicyB3aXRoaW4gdGhlIHNoZWV0XG4gICAgaHRtbC5maW5kKCcuaXRlbVtkYXRhLXRhYj1cInN0YXRzXCJdJykuY2xpY2soKCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJUYWIgPSBodG1sLmZpbmQoJy5zdGF0cy10YWJzIC5pdGVtLmFjdGl2ZScpLmZpcnN0KCk7XG4gICAgICBjb25zdCBzZWxlY3RlZFN1YlBhZ2UgPSBodG1sLmZpbmQoYC5zdGF0cy1ib2R5IC50YWJbZGF0YS10YWI9XCIke3NlbGVjdGVkU3ViVGFiLmRhdGEoJ3RhYicpfVwiXWApO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2VsZWN0ZWRTdWJQYWdlLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5fc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpO1xuICAgIHRoaXMuX2FiaWxpdHlUYWJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgdGhpcy5faW52ZW50b3J5VGFiTGlzdGVuZXJzKGh0bWwpO1xuICB9XG5cbiAgX25wY0xpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5hY3RvcicpLmFkZENsYXNzKCducGMtd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5tb3ZlbWVudFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5hY3Rvci5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAncGMnOlxuICAgICAgICB0aGlzLl9wY0xpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICducGMnOlxuICAgICAgICB0aGlzLl9ucGNMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIEFjdG9yOmZhbHNlICovXG5cbmltcG9ydCB7IENTUiB9IGZyb20gJy4uL2NvbmZpZy5qcyc7XG5pbXBvcnQgeyB2YWxPckRlZmF1bHQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCB7IFBsYXllckNob2ljZURpYWxvZyB9IGZyb20gJy4uL2RpYWxvZy9wbGF5ZXItY2hvaWNlLWRpYWxvZy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2UgQWN0b3IgZW50aXR5IGJ5IGRlZmluaW5nIGEgY3VzdG9tIHJvbGwgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggaXMgaWRlYWwgZm9yIHRoZSBTaW1wbGUgc3lzdGVtLlxuICogQGV4dGVuZHMge0FjdG9yfVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3IgZXh0ZW5kcyBBY3RvciB7XG4gIC8qKlxuICAgKiBQcmVwYXJlIENoYXJhY3RlciB0eXBlIHNwZWNpZmljIGRhdGFcbiAgICovXG4gIF9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gYWN0b3JEYXRhO1xuXG4gICAgZGF0YS5zZW50ZW5jZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNlbnRlbmNlLCB7XG4gICAgICBkZXNjcmlwdG9yOiAnJyxcbiAgICAgIHR5cGU6ICcnLFxuICAgICAgZm9jdXM6ICcnXG4gICAgfSk7XG5cbiAgICBkYXRhLnRpZXIgPSB2YWxPckRlZmF1bHQoZGF0YS50aWVyLCAxKTtcbiAgICBkYXRhLmVmZm9ydCA9IHZhbE9yRGVmYXVsdChkYXRhLmVmZm9ydCwgMSk7XG4gICAgZGF0YS54cCA9IHZhbE9yRGVmYXVsdChkYXRhLnhwLCAwKTtcbiAgICBkYXRhLmN5cGhlckxpbWl0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY3lwaGVyTGltaXQsIDEpO1xuXG4gICAgZGF0YS5hZHZhbmNlcyA9IHZhbE9yRGVmYXVsdChkYXRhLmFkdmFuY2VzLCB7XG4gICAgICBzdGF0czogZmFsc2UsXG4gICAgICBlZGdlOiBmYWxzZSxcbiAgICAgIGVmZm9ydDogZmFsc2UsXG4gICAgICBza2lsbHM6IGZhbHNlLFxuICAgICAgb3RoZXI6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBkYXRhLnJlY292ZXJ5TW9kID0gdmFsT3JEZWZhdWx0KGRhdGEucmVjb3ZlcnlNb2QsIDEpO1xuICAgIGRhdGEucmVjb3ZlcmllcyA9IHZhbE9yRGVmYXVsdChkYXRhLnJlY292ZXJpZXMsIHtcbiAgICAgIGFjdGlvbjogZmFsc2UsXG4gICAgICB0ZW5NaW5zOiBmYWxzZSxcbiAgICAgIG9uZUhvdXI6IGZhbHNlLFxuICAgICAgdGVuSG91cnM6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBkYXRhLmRhbWFnZVRyYWNrID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlVHJhY2ssIDApO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMCk7XG5cbiAgICBkYXRhLnN0YXRzID0gdmFsT3JEZWZhdWx0KGRhdGEuc3RhdHMsIHtcbiAgICAgIG1pZ2h0OiB7XG4gICAgICAgIHZhbHVlOiAwLFxuICAgICAgICBwb29sOiAwLFxuICAgICAgICBlZGdlOiAwXG4gICAgICB9LFxuICAgICAgc3BlZWQ6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH0sXG4gICAgICBpbnRlbGxlY3Q6IHtcbiAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgIHBvb2w6IDAsXG4gICAgICAgIGVkZ2U6IDBcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRhdGEubW9uZXkgPSB2YWxPckRlZmF1bHQoZGF0YS5tb25leSwgMCk7XG4gIH1cblxuICBfcHJlcGFyZU5QQ0RhdGEoYWN0b3JEYXRhKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBhY3RvckRhdGE7XG5cbiAgICBkYXRhLmxldmVsID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWwsIDEpO1xuXG4gICAgZGF0YS5oZWFsdGggPSB2YWxPckRlZmF1bHQoZGF0YS5oZWFsdGgsIHtcbiAgICAgIHZhbHVlOiAzLFxuICAgICAgbWF4OiAzXG4gICAgfSk7XG4gICAgZGF0YS5kYW1hZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5kYW1hZ2UsIDEpO1xuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMCk7XG4gICAgZGF0YS5tb3ZlbWVudCA9IHZhbE9yRGVmYXVsdChkYXRhLm1vdmVtZW50LCAxKTtcblxuICAgIGRhdGEuZGVzY3JpcHRpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5kZXNjcmlwdGlvbiwgJycpO1xuICAgIGRhdGEubW90aXZlID0gdmFsT3JEZWZhdWx0KGRhdGEubW90aXZlLCAnJyk7XG4gICAgZGF0YS5lbnZpcm9ubWVudCA9IHZhbE9yRGVmYXVsdChkYXRhLmVudmlyb25tZW50LCAnJyk7XG4gICAgZGF0YS5tb2RpZmljYXRpb25zID0gdmFsT3JEZWZhdWx0KGRhdGEubW9kaWZpY2F0aW9ucywgJycpO1xuICAgIGRhdGEuY29tYmF0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY29tYmF0LCAnJyk7XG4gICAgZGF0YS5pbnRlcmFjdGlvbiA9IHZhbE9yRGVmYXVsdChkYXRhLmludGVyYWN0aW9uLCAnJyk7XG4gICAgZGF0YS51c2UgPSB2YWxPckRlZmF1bHQoZGF0YS51c2UsICcnKTtcbiAgICBkYXRhLmxvb3QgPSB2YWxPckRlZmF1bHQoZGF0YS5sb290LCAnJyk7XG4gIH1cblxuICAvKipcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgYWN0b3IgZGF0YSB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxuICAgKi9cbiAgcHJlcGFyZURhdGEoKSB7XG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcblxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCBkYXRhID0gYWN0b3JEYXRhLmRhdGE7XG4gICAgY29uc3QgZmxhZ3MgPSBhY3RvckRhdGEuZmxhZ3M7XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yRGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3BjJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZVBDRGF0YShhY3RvckRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ25wYyc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVOUENEYXRhKGFjdG9yRGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpbml0aWF0aXZlTGV2ZWwoKSB7XG4gICAgY29uc3QgaW5pdFNraWxsID0gdGhpcy5kYXRhLml0ZW1zLmZpbHRlcihpID0+IGkudHlwZSA9PT0gJ3NraWxsJyAmJiBpLmRhdGEuZmxhZ3MuaW5pdGlhdGl2ZSlbMF07XG4gICAgcmV0dXJuIGluaXRTa2lsbC5kYXRhLnRyYWluaW5nIC0gMTtcbiAgfVxuXG4gIGdldCBjYW5SZWZ1c2VJbnRydXNpb24oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLmRhdGE7XG5cbiAgICByZXR1cm4gZGF0YS54cCA+IDA7XG4gIH1cblxuICBnZXQgaXNPdmVyQ3lwaGVyTGltaXQoKSB7XG4gICAgY29uc3QgY3lwaGVycyA9IHRoaXMuZ2V0RW1iZWRkZWRDb2xsZWN0aW9uKFwiT3duZWRJdGVtXCIpLmZpbHRlcihpID0+IGkudHlwZSA9PT0gXCJjeXBoZXJcIik7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5kYXRhLmN5cGhlckxpbWl0IDwgY3lwaGVycy5sZW5ndGg7XG4gIH1cblxuICBnZXRTa2lsbExldmVsKHNraWxsKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBza2lsbC5kYXRhO1xuXG4gICAgcmV0dXJuIGRhdGEudHJhaW5pbmcgLSAxO1xuICB9XG5cbiAgZ2V0RWZmb3J0Q29zdEZyb21TdGF0KHBvb2wsIGVmZm9ydExldmVsKSB7XG4gICAgY29uc3QgdmFsdWUgPSB7XG4gICAgICBjb3N0OiAwLFxuICAgICAgZWZmb3J0TGV2ZWw6IDAsXG4gICAgICB3YXJuaW5nOiBudWxsLFxuICAgIH07XG5cbiAgICBpZiAoZWZmb3J0TGV2ZWwgPT09IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgLy9UaGUgZmlyc3QgZWZmb3J0IGxldmVsIGNvc3RzIDMgcHRzIGZyb20gdGhlIHBvb2wsIGV4dHJhIGxldmVscyBjb3N0IDJcbiAgICAvL1N1YnN0cmFjdCB0aGUgcmVsYXRlZCBFZGdlLCB0b29cbiAgICBjb25zdCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCA9IChzdGF0LnZhbHVlICsgc3RhdC5lZGdlIC0gMSkgLyAyO1xuXG4gICAgLy9BIFBDIGNhbiB1c2UgYXMgbXVjaCBhcyB0aGVpciBFZmZvcnQgc2NvcmUsIGJ1dCBub3QgbW9yZVxuICAgIC8vVGhleSdyZSBhbHNvIGxpbWl0ZWQgYnkgdGhlaXIgY3VycmVudCBwb29sIHZhbHVlXG4gICAgY29uc3QgZmluYWxFZmZvcnQgPSBNYXRoLm1pbihlZmZvcnRMZXZlbCwgYWN0b3JEYXRhLmVmZm9ydCwgYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wpO1xuICAgIGNvbnN0IGNvc3QgPSAxICsgMiAqIGZpbmFsRWZmb3J0IC0gc3RhdC5lZGdlO1xuXG4gICAgLy9UT0RPIHRha2UgZnJlZSBsZXZlbHMgb2YgRWZmb3J0IGludG8gYWNjb3VudCBoZXJlXG5cbiAgICBsZXQgd2FybmluZyA9IG51bGw7XG4gICAgaWYgKGVmZm9ydExldmVsID4gYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wpIHtcbiAgICAgIHdhcm5pbmcgPSBgTm90IGVub3VnaCBwb2ludHMgaW4geW91ciAke3Bvb2xOYW1lfSBwb29sIGZvciB0aGF0IGxldmVsIG9mIEVmZm9ydGA7XG4gICAgfVxuXG4gICAgdmFsdWUuY29zdCA9IGNvc3Q7XG4gICAgdmFsdWUuZWZmb3J0TGV2ZWwgPSBmaW5hbEVmZm9ydDtcbiAgICB2YWx1ZS53YXJuaW5nID0gd2FybmluZztcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGNhblNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50LCBhcHBseUVkZ2UgPSB0cnVlKSB7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF0udG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lXTtcbiAgICBjb25zdCBwb29sQW1vdW50ID0gc3RhdC52YWx1ZTtcblxuICAgIHJldHVybiAoYXBwbHlFZGdlID8gYW1vdW50IC0gc3RhdC5lZGdlIDogYW1vdW50KSA8PSBwb29sQW1vdW50O1xuICB9XG5cbiAgc3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpIHtcbiAgICBpZiAoIXRoaXMuY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICBkYXRhW2BkYXRhLnN0YXRzLiR7cG9vbE5hbWUudG9Mb3dlckNhc2UoKX0udmFsdWVgXSA9IE1hdGgubWF4KDAsIHN0YXQudmFsdWUgLSBhbW91bnQpO1xuICAgIHRoaXMudXBkYXRlKGRhdGEpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBvbkdNSW50cnVzaW9uKGFjY2VwdGVkKSB7XG4gICAgbGV0IHhwID0gdGhpcy5kYXRhLmRhdGEueHA7XG4gICAgXG4gICAgbGV0IGNoYXRDb250ZW50ID0gYDxoMj4ke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5jaGF0LmhlYWRpbmcnKX08L2gyPjxicj5gO1xuICAgIGlmIChhY2NlcHRlZCkge1xuICAgICAgeHArKztcblxuICAgICAgY2hhdENvbnRlbnQgKz0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW50cnVzaW9uLmNoYXQuYWNjZXB0JykucmVwbGFjZSgnIyNBQ1RPUiMjJywgdGhpcy5kYXRhLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB4cC0tO1xuXG4gICAgICBjaGF0Q29udGVudCArPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnRydXNpb24uY2hhdC5yZWZ1c2UnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCB0aGlzLmRhdGEubmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLl9pZCxcbiAgICAgICdkYXRhLnhwJzogeHAsXG4gICAgfSk7XG5cbiAgICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgICAgY29udGVudDogY2hhdENvbnRlbnRcbiAgICB9KTtcblxuICAgIGlmIChhY2NlcHRlZCkge1xuICAgICAgY29uc3Qgb3RoZXJBY3RvcnMgPSBnYW1lLmFjdG9ycy5maWx0ZXIoYWN0b3IgPT4gYWN0b3IuX2lkICE9PSB0aGlzLl9pZCAmJiBhY3Rvci5kYXRhLnR5cGUgPT09ICdwYycpO1xuXG4gICAgICBjb25zdCBkaWFsb2cgPSBuZXcgUGxheWVyQ2hvaWNlRGlhbG9nKG90aGVyQWN0b3JzLCAoY2hvc2VuQWN0b3JJZCkgPT4ge1xuICAgICAgICBnYW1lLnNvY2tldC5lbWl0KCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywge1xuICAgICAgICAgIHR5cGU6ICdhd2FyZFhQJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhY3RvcklkOiBjaG9zZW5BY3RvcklkLFxuICAgICAgICAgICAgeHBBbW91bnQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICAgIGRpYWxvZy5yZW5kZXIodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgYXN5bmMgY3JlYXRlRW1iZWRkZWRFbnRpdHkoLi4uYXJncykge1xuICAgIGNvbnN0IFtfLCBkYXRhXSA9IGFyZ3M7XG5cbiAgICAvLyBSb2xsIHRoZSBcImxldmVsIGRpZVwiIHRvIGRldGVybWluZSB0aGUgaXRlbSdzIGxldmVsLCBpZiBwb3NzaWJsZVxuICAgIGlmIChkYXRhLmRhdGEgJiYgQ1NSLmhhc0xldmVsRGllLmluY2x1ZGVzKGRhdGEudHlwZSkpIHtcbiAgICAgIGNvbnN0IGl0ZW1EYXRhID0gZGF0YS5kYXRhO1xuXG4gICAgICBpZiAoIWl0ZW1EYXRhLmxldmVsICYmIGl0ZW1EYXRhLmxldmVsRGllKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2VlIGlmIHRoZSBmb3JtdWxhIGlzIHZhbGlkXG4gICAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBuZXcgUm9sbChpdGVtRGF0YS5sZXZlbERpZSkucm9sbCgpLnRvdGFsO1xuICAgICAgICAgIGF3YWl0IHRoaXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogdGhpcy5faWQsXG4gICAgICAgICAgICBcImRhdGEubGV2ZWxcIjogaXRlbURhdGEubGV2ZWwsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBJZiBub3QsIGZhbGxiYWNrIHRvIHNhbmUgZGVmYXVsdFxuICAgICAgICAgIGl0ZW1EYXRhLmxldmVsID0gaXRlbURhdGEubGV2ZWwgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBpdGVtRGF0YS5sZXZlbCB8fCBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5jcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgcm9sbFRleHQgfSBmcm9tICcuL3JvbGxzLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoYXRNZXNzYWdlKGNoYXRNZXNzYWdlLCBodG1sLCBkYXRhKSB7XG4gIC8vIERvbid0IGFwcGx5IENoYXRNZXNzYWdlIGVuaGFuY2VtZW50IHRvIHJlY292ZXJ5IHJvbGxzXG4gIGlmIChjaGF0TWVzc2FnZS5yb2xsICYmICFjaGF0TWVzc2FnZS5yb2xsLmRpY2VbMF0ub3B0aW9ucy5yZWNvdmVyeSkge1xuICAgIGNvbnN0IGRpZVJvbGwgPSBjaGF0TWVzc2FnZS5yb2xsLmRpY2VbMF0ucm9sbHNbMF0ucm9sbDtcbiAgICBjb25zdCByb2xsVG90YWwgPSBjaGF0TWVzc2FnZS5yb2xsLnRvdGFsO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gcm9sbFRleHQoZGllUm9sbCwgcm9sbFRvdGFsKTtcbiAgICBjb25zdCBudW1NZXNzYWdlcyA9IG1lc3NhZ2VzLmxlbmd0aDtcblxuICAgIGNvbnN0IG1lc3NhZ2VDb250YWluZXIgPSAkKCc8ZGl2Lz4nKTtcbiAgICBtZXNzYWdlQ29udGFpbmVyLmFkZENsYXNzKCdzcGVjaWFsLW1lc3NhZ2VzJyk7XG5cbiAgICBtZXNzYWdlcy5mb3JFYWNoKChzcGVjaWFsLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHsgdGV4dCwgY29sb3IsIGNscyB9ID0gc3BlY2lhbDtcblxuICAgICAgY29uc3QgbmV3Q29udGVudCA9IGA8c3BhbiBjbGFzcz1cIiR7Y2xzfVwiIHN0eWxlPVwiY29sb3I6ICR7Y29sb3J9XCI+JHt0ZXh0fTwvc3Bhbj4ke2lkeCA8IG51bU1lc3NhZ2VzIC0gMSA/ICc8YnIgLz4nIDogJyd9YDtcblxuICAgICAgbWVzc2FnZUNvbnRhaW5lci5hcHBlbmQobmV3Q29udGVudCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBkdCA9IGh0bWwuZmluZChcIi5kaWNlLXRvdGFsXCIpO1xuICAgIG1lc3NhZ2VDb250YWluZXIuaW5zZXJ0QmVmb3JlKGR0KTtcbiAgfVxufVxuIiwiLyoqXG4gKiBSb2xsIGluaXRpYXRpdmUgZm9yIG9uZSBvciBtdWx0aXBsZSBDb21iYXRhbnRzIHdpdGhpbiB0aGUgQ29tYmF0IGVudGl0eVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGlkcyAgICAgICAgQSBDb21iYXRhbnQgaWQgb3IgQXJyYXkgb2YgaWRzIGZvciB3aGljaCB0byByb2xsXG4gKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBmb3JtdWxhICAgICBBIG5vbi1kZWZhdWx0IGluaXRpYXRpdmUgZm9ybXVsYSB0byByb2xsLiBPdGhlcndpc2UgdGhlIHN5c3RlbSBkZWZhdWx0IGlzIHVzZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gbWVzc2FnZU9wdGlvbnMgICBBZGRpdGlvbmFsIG9wdGlvbnMgd2l0aCB3aGljaCB0byBjdXN0b21pemUgY3JlYXRlZCBDaGF0IE1lc3NhZ2VzXG4gKiBAcmV0dXJuIHtQcm9taXNlLjxDb21iYXQ+fSAgICAgICBBIHByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgdG8gdGhlIHVwZGF0ZWQgQ29tYmF0IGVudGl0eSBvbmNlIHVwZGF0ZXMgYXJlIGNvbXBsZXRlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcm9sbEluaXRpYXRpdmUoaWRzLCBmb3JtdWxhID0gbnVsbCwgbWVzc2FnZU9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBjb21iYXRhbnRVcGRhdGVzID0gW107XG4gIGNvbnN0IG1lc3NhZ2VzID0gW11cblxuICAvLyBGb3JjZSBpZHMgdG8gYmUgYW4gYXJyYXkgc28gb3VyIGZvciBsb29wIGRvZXNuJ3QgYnJlYWtcbiAgaWRzID0gdHlwZW9mIGlkcyA9PT0gJ3N0cmluZycgPyBbaWRzXSA6IGlkcztcbiAgZm9yIChsZXQgaWQgb2YgaWRzKSB7XG4gICAgY29uc3QgY29tYmF0YW50ID0gYXdhaXQgdGhpcy5nZXRDb21iYXRhbnQoaWQpO1xuICAgIGlmIChjb21iYXRhbnQuZGVmZWF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGFjdG9yIH0gPSBjb21iYXRhbnQ7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YTtcbiAgICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yRGF0YTtcblxuICAgIGxldCBpbml0aWF0aXZlO1xuICAgIGxldCByb2xsUmVzdWx0O1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgLy8gUENzIHVzZSBhIHNpbXBsZSBkMjAgcm9sbCBtb2RpZmllZCBieSBhbnkgdHJhaW5pbmcgaW4gYW4gSW5pdGlhdGl2ZSBza2lsbFxuICAgICAgY2FzZSAncGMnOlxuICAgICAgICBjb25zdCBpbml0Qm9udXMgPSBhY3Rvci5pbml0aWF0aXZlTGV2ZWw7XG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gaW5pdEJvbnVzIDwgMCA/ICctJyA6ICcrJztcbiAgICAgICAgY29uc3Qgcm9sbEZvcm11bGEgPSAnMWQyMCcgKyAoaW5pdEJvbnVzID09PSAwID8gJycgOiBgJHtvcGVyYXRvcn0kezMqTWF0aC5hYnMoaW5pdEJvbnVzKX1gKTtcblxuICAgICAgICBjb25zdCByb2xsID0gbmV3IFJvbGwocm9sbEZvcm11bGEpLnJvbGwoKTtcbiAgICAgICAgaW5pdGlhdGl2ZSA9IE1hdGgubWF4KHJvbGwudG90YWwsIDApOyAvLyBEb24ndCBsZXQgaW5pdGlhdGl2ZSBnbyBiZWxvdyAwXG4gICAgICAgIHJvbGxSZXN1bHQgPSByb2xsLnJlc3VsdDtcbiAgICAgICAgXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBOUENzIGhhdmUgYSBmaXhlZCBpbml0aWF0aXZlIGJhc2VkIG9uIHRoZWlyIGxldmVsXG4gICAgICBjYXNlICducGMnOlxuICAgICAgICBjb25zdCB7IGxldmVsIH0gPSBhY3RvckRhdGEuZGF0YTtcbiAgICAgICAgaW5pdGlhdGl2ZSA9IDMgKiBsZXZlbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29tYmF0YW50VXBkYXRlcy5wdXNoKHtcbiAgICAgIF9pZDogY29tYmF0YW50Ll9pZCxcbiAgICAgIGluaXRpYXRpdmVcbiAgICB9KTtcblxuICAgIC8vIFNpbmNlIE5QQyBpbml0aWF0aXZlIGlzIGZpeGVkLCBkb24ndCBib3RoZXIgc2hvd2luZyBpdCBpbiBjaGF0XG4gICAgaWYgKHR5cGUgPT09ICdwYycpIHtcbiAgICAgIGNvbnN0IHsgdG9rZW4gfSA9IGNvbWJhdGFudDtcbiAgICAgIGNvbnN0IGlzSGlkZGVuID0gdG9rZW4uaGlkZGVuIHx8IGNvbWJhdGFudC5oaWRkZW47XG4gICAgICBjb25zdCB3aGlzcGVyID0gaXNIaWRkZW4gPyBnYW1lLnVzZXJzLmVudGl0aWVzLmZpbHRlcih1ID0+IHUuaXNHTSkgOiAnJztcblxuICAgICAgLy8gVE9ETzogSW1wcm92ZSB0aGUgY2hhdCBtZXNzYWdlLCB0aGlzIGN1cnJlbnRseVxuICAgICAgLy8ganVzdCByZXBsaWNhdGVzIHRoZSBub3JtYWwgcm9sbCBtZXNzYWdlLlxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXJvbGxcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS1yZXN1bHRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLWZvcm11bGFcIj4ke3JvbGxSZXN1bHR9PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS10b29sdGlwXCI+XG4gICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidG9vbHRpcC1wYXJ0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpY2VcIj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicGFydC1mb3JtdWxhXCI+XG4gICAgICAgICAgICAgICAgICAgIDFkMjBcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwYXJ0LXRvdGFsXCI+JHtpbml0aWF0aXZlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICAgICAgPG9sIGNsYXNzPVwiZGljZS1yb2xsc1wiPlxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJyb2xsIGRpZSBkMjBcIj4ke2luaXRpYXRpdmV9PC9saT5cbiAgICAgICAgICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRpY2UtdG90YWxcIj4ke2luaXRpYXRpdmV9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuXG4gICAgICBjb25zdCBtZXNzYWdlRGF0YSA9IG1lcmdlT2JqZWN0KHtcbiAgICAgICAgc3BlYWtlcjoge1xuICAgICAgICAgIHNjZW5lOiBjYW52YXMuc2NlbmUuX2lkLFxuICAgICAgICAgIGFjdG9yOiBhY3RvciA/IGFjdG9yLl9pZCA6IG51bGwsXG4gICAgICAgICAgdG9rZW46IHRva2VuLl9pZCxcbiAgICAgICAgICBhbGlhczogdG9rZW4ubmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgd2hpc3BlcixcbiAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbml0aWF0aXZlLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIHRva2VuLm5hbWUpLFxuICAgICAgICBjb250ZW50OiB0ZW1wbGF0ZSxcbiAgICAgIH0sIG1lc3NhZ2VPcHRpb25zKTtcblxuICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb21iYXRhbnRVcGRhdGVzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGF3YWl0IHRoaXMudXBkYXRlRW1iZWRkZWRFbnRpdHkoJ0NvbWJhdGFudCcsIGNvbWJhdGFudFVwZGF0ZXMpO1xuXG4gIENoYXRNZXNzYWdlLmNyZWF0ZShtZXNzYWdlcyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCJleHBvcnQgY29uc3QgQ1NSID0ge307XG5cbkNTUi5pdGVtVHlwZXMgPSBbXG4gICdza2lsbHMnLFxuICAnYWJpbGl0aWVzJyxcbiAgJ2N5cGhlcnMnLFxuICAnYXJ0aWZhY3RzJyxcbiAgJ29kZGl0aWVzJyxcbiAgJ3dlYXBvbnMnLFxuICAnYXJtb3InLFxuICAnZ2Vhcidcbl07XG5cbkNTUi5pbnZlbnRvcnlUeXBlcyA9IFtcbiAgJ3dlYXBvbicsXG4gICdhcm1vcicsXG4gICdnZWFyJyxcblxuICAnY3lwaGVyJyxcbiAgJ2FydGlmYWN0JyxcbiAgJ29kZGl0eSdcbl07XG5cbkNTUi53ZWlnaHRDbGFzc2VzID0gW1xuICAnbGlnaHQnLFxuICAnbWVkaXVtJyxcbiAgJ2hlYXZ5J1xuXTtcblxuQ1NSLndlYXBvblR5cGVzID0gW1xuICAnYmFzaGluZycsXG4gICdibGFkZWQnLFxuICAncmFuZ2VkJyxcbl1cblxuQ1NSLnN0YXRzID0gW1xuICAnbWlnaHQnLFxuICAnc3BlZWQnLFxuICAnaW50ZWxsZWN0Jyxcbl07XG5cbkNTUi50cmFpbmluZ0xldmVscyA9IFtcbiAgJ2luYWJpbGl0eScsXG4gICd1bnRyYWluZWQnLFxuICAndHJhaW5lZCcsXG4gICdzcGVjaWFsaXplZCdcbl07XG5cbkNTUi5kYW1hZ2VUcmFjayA9IFtcbiAgJ2hhbGUnLFxuICAnaW1wYWlyZWQnLFxuICAnZGViaWxpdGF0ZWQnLFxuICAnZGVhZCdcbl07XG5cbkNTUi5yZWNvdmVyaWVzID0gW1xuICAnYWN0aW9uJyxcbiAgJ3Rlbk1pbnMnLFxuICAnb25lSG91cicsXG4gICd0ZW5Ib3Vycydcbl07XG5cbkNTUi5hZHZhbmNlcyA9IFtcbiAgJ3N0YXRzJyxcbiAgJ2VkZ2UnLFxuICAnZWZmb3J0JyxcbiAgJ3NraWxscycsXG4gICdvdGhlcidcbl07XG5cbkNTUi5yYW5nZXMgPSBbXG4gICdpbW1lZGlhdGUnLFxuICAnc2hvcnQnLFxuICAnbG9uZycsXG4gICd2ZXJ5TG9uZydcbl07XG5cbkNTUi5vcHRpb25hbFJhbmdlcyA9IFtcIm5hXCJdLmNvbmNhdChDU1IucmFuZ2VzKTtcblxuQ1NSLmFiaWxpdHlUeXBlcyA9IFtcbiAgJ2FjdGlvbicsXG4gICdlbmFibGVyJyxcbl07XG5cbkNTUi5zdXBwb3J0c01hY3JvcyA9IFtcbiAgJ3NraWxsJyxcbiAgJ2FiaWxpdHknXG5dO1xuXG5DU1IuaGFzTGV2ZWxEaWUgPSBbXG4gICdjeXBoZXInLFxuICAnYXJ0aWZhY3QnXG5dO1xuIiwiLyogZ2xvYmFscyBFTlRJVFlfUEVSTUlTU0lPTlMgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGFjdG9yRGlyZWN0b3J5Q29udGV4dChodG1sLCBlbnRyeU9wdGlvbnMpIHtcbiAgZW50cnlPcHRpb25zLnB1c2goe1xuICAgIG5hbWU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmN0eHQuaW50cnVzaW9uLmhlYWRpbmcnKSxcbiAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtZXhjbGFtYXRpb24tY2lyY2xlXCI+PC9pPicsXG5cbiAgICBjYWxsYmFjazogbGkgPT4ge1xuICAgICAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQobGkuZGF0YSgnZW50aXR5SWQnKSk7XG4gICAgICBjb25zdCBvd25lcklkcyA9IE9iamVjdC5lbnRyaWVzKGFjdG9yLmRhdGEucGVybWlzc2lvbilcbiAgICAgICAgLmZpbHRlcihlbnRyeSA9PiB7XG4gICAgICAgICAgY29uc3QgW2lkLCBwZXJtaXNzaW9uTGV2ZWxdID0gZW50cnk7XG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25MZXZlbCA+PSBFTlRJVFlfUEVSTUlTU0lPTlMuT1dORVIgJiYgaWQgIT09IGdhbWUudXNlci5pZDtcbiAgICAgICAgfSlcbiAgICAgICAgLm1hcCh1c2Vyc1Blcm1pc3Npb25zID0+IHVzZXJzUGVybWlzc2lvbnNbMF0pO1xuXG4gICAgICBnYW1lLnNvY2tldC5lbWl0KCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywge1xuICAgICAgICB0eXBlOiAnZ21JbnRydXNpb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdXNlcklkczogb3duZXJJZHMsXG4gICAgICAgICAgYWN0b3JJZDogYWN0b3IuZGF0YS5faWQsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBoZWFkaW5nID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpO1xuICAgICAgY29uc3QgYm9keSA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmN0eHQuaW50cnVzaW9uLmhlYWRpbmcnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5kYXRhLm5hbWUpO1xuXG4gICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgICAgICBjb250ZW50OiBgPGgyPiR7aGVhZGluZ308L2gyPjxici8+JHtib2R5fWAsXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgY29uZGl0aW9uOiBsaSA9PiB7XG4gICAgICBpZiAoIWdhbWUudXNlci5pc0dNKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQobGkuZGF0YSgnZW50aXR5SWQnKSk7XG4gICAgICByZXR1cm4gYWN0b3IgJiYgYWN0b3IuZGF0YS50eXBlID09PSAncGMnO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiBnbG9iYWwgQ29tYmF0ICovXG5cbi8vIEltcG9ydCBNb2R1bGVzXG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1BY3RvciB9IGZyb20gXCIuL2FjdG9yL2FjdG9yLmpzXCI7XG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0IH0gZnJvbSBcIi4vYWN0b3IvYWN0b3Itc2hlZXQuanNcIjtcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tIFwiLi9pdGVtL2l0ZW0uanNcIjtcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW1TaGVldCB9IGZyb20gXCIuL2l0ZW0vaXRlbS1zaGVldC5qc1wiO1xuXG5pbXBvcnQgeyByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgfSBmcm9tICcuL2hhbmRsZWJhcnMtaGVscGVycy5qcyc7XG5pbXBvcnQgeyBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcyB9IGZyb20gJy4vdGVtcGxhdGUuanMnO1xuXG5pbXBvcnQgeyByZWdpc3RlclN5c3RlbVNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncy5qcyc7XG5pbXBvcnQgeyByZW5kZXJDaGF0TWVzc2FnZSB9IGZyb20gJy4vY2hhdC5qcyc7XG5pbXBvcnQgeyBhY3RvckRpcmVjdG9yeUNvbnRleHQgfSBmcm9tICcuL2NvbnRleHQtbWVudS5qcyc7XG5pbXBvcnQgeyBjc3JTb2NrZXRMaXN0ZW5lcnMgfSBmcm9tICcuL3NvY2tldC5qcyc7XG5pbXBvcnQgeyByb2xsSW5pdGlhdGl2ZSB9IGZyb20gJy4vY29tYmF0LmpzJztcblxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgZ2FtZS5jeXBoZXJzeXN0ZW0gPSB7XG4gICAgQ3lwaGVyU3lzdGVtQWN0b3IsXG4gICAgQ3lwaGVyU3lzdGVtSXRlbVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgYW4gaW5pdGlhdGl2ZSBmb3JtdWxhIGZvciB0aGUgc3lzdGVtXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBDb21iYXQucHJvdG90eXBlLnJvbGxJbml0aWF0aXZlID0gcm9sbEluaXRpYXRpdmU7XG5cbiAgLy8gRGVmaW5lIGN1c3RvbSBFbnRpdHkgY2xhc3Nlc1xuICBDT05GSUcuQWN0b3IuZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1BY3RvcjtcbiAgQ09ORklHLkl0ZW0uZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1JdGVtO1xuXG4gIC8vIFJlZ2lzdGVyIHNoZWV0IGFwcGxpY2F0aW9uIGNsYXNzZXNcbiAgQWN0b3JzLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEFjdG9yU2hlZXQpO1xuICAvLyBUT0RPOiBTZXBhcmF0ZSBjbGFzc2VzIHBlciB0eXBlXG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW0nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsncGMnXSxcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcbiAgfSk7XG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW0nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsnbnBjJ10sXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXG4gIH0pO1xuXG4gIEl0ZW1zLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEl0ZW1TaGVldCk7XG4gIEl0ZW1zLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbScsIEN5cGhlclN5c3RlbUl0ZW1TaGVldCwgeyBtYWtlRGVmYXVsdDogdHJ1ZSB9KTtcblxuICByZWdpc3RlclN5c3RlbVNldHRpbmdzKCk7XG4gIHJlZ2lzdGVySGFuZGxlYmFySGVscGVycygpO1xuICBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcygpO1xufSk7XG5cbkhvb2tzLm9uKCdyZW5kZXJDaGF0TWVzc2FnZScsIHJlbmRlckNoYXRNZXNzYWdlKTtcblxuSG9va3Mub24oJ2dldEFjdG9yRGlyZWN0b3J5RW50cnlDb250ZXh0JywgYWN0b3JEaXJlY3RvcnlDb250ZXh0KTtcblxuSG9va3Mub24oJ2NyZWF0ZUFjdG9yJywgYXN5bmMgZnVuY3Rpb24oYWN0b3IsIG9wdGlvbnMsIHVzZXJJZCkge1xuICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yLmRhdGE7XG4gIGlmICh0eXBlID09PSAncGMnKSB7XG4gICAgLy8gR2l2ZSBQQ3MgdGhlIFwiSW5pdGlhdGl2ZVwiIHNraWxsIGJ5IGRlZmF1bHQsIGFzIGl0IHdpbGwgYmUgdXNlZFxuICAgIC8vIGJ5IHRoZSBpbnRpYXRpdmUgZm9ybXVsYSBpbiBjb21iYXQuXG4gICAgYWN0b3IuY3JlYXRlT3duZWRJdGVtKHtcbiAgICAgIG5hbWU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnNraWxsLmluaXRpYXRpdmUnKSxcbiAgICAgIHR5cGU6ICdza2lsbCcsXG4gICAgICBkYXRhOiBuZXcgQ3lwaGVyU3lzdGVtSXRlbSh7XG4gICAgICAgICdwb29sJzogMSwgLy8gU3BlZWRcbiAgICAgICAgJ3RyYWluaW5nJzogMSwgLy8gVW50cmFpbmVkXG5cbiAgICAgICAgJ2ZsYWdzLmluaXRpYXRpdmUnOiB0cnVlXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfVxufSk7XG5cbkhvb2tzLm9uY2UoJ3JlYWR5JywgY3NyU29ja2V0TGlzdGVuZXJzKTtcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXG5cbi8qKlxuICogUHJvbXB0cyB0aGUgdXNlciB3aXRoIGEgY2hvaWNlIG9mIGEgR00gSW50cnVzaW9uLlxuICogXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgR01JbnRydXNpb25EaWFsb2dcbiAqIEBleHRlbmRzIHtEaWFsb2d9XG4gKi9cbmV4cG9ydCBjbGFzcyBHTUludHJ1c2lvbkRpYWxvZyBleHRlbmRzIERpYWxvZyB7XG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcbiAgICAgIHRlbXBsYXRlOiBcInRlbXBsYXRlcy9odWQvZGlhbG9nLmh0bWxcIixcbiAgICAgIGNsYXNzZXM6IFtcImNzclwiLCBcImRpYWxvZ1wiXSxcbiAgICAgIHdpZHRoOiA1MDBcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGFjdG9yLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBhY2NlcHRRdWVzdGlvbiA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24uZG9Zb3VBY2NlcHQnKTtcbiAgICBjb25zdCBhY2NlcHRJbnN0cnVjdGlvbnMgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLmFjY2VwdEluc3RydWN0aW9ucycpXG4gICAgICAucmVwbGFjZSgnIyNBQ0NFUFQjIycsIGA8c3BhbiBzdHlsZT1cImNvbG9yOiBncmVlblwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuYWNjZXB0Jyl9PC9zcGFuPmApO1xuICAgIGNvbnN0IHJlZnVzZUluc3RydWN0aW9ucyA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24ucmVmdXNlSW5zdHJ1Y3Rpb25zJylcbiAgICAgIC5yZXBsYWNlKCcjI1JFRlVTRSMjJywgYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucmVmdXNlJyl9PC9zcGFuPmApO1xuXG4gICAgbGV0IGRpYWxvZ0NvbnRlbnQgPSBgXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICA8cD4ke2FjY2VwdFF1ZXN0aW9ufTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNlwiPlxuICAgICAgICA8cD4ke2FjY2VwdEluc3RydWN0aW9uc308L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNlwiPlxuICAgICAgICA8cD4ke3JlZnVzZUluc3RydWN0aW9uc308L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8aHIgLz5gO1xuXG4gICAgbGV0IGRpYWxvZ0J1dHRvbnMgPSB7XG4gICAgICBvazoge1xuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIiBzdHlsZT1cImNvbG9yOiBncmVlblwiPjwvaT4nLFxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmJ1dHRvbi5hY2NlcHQnKSxcbiAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCBhY3Rvci5vbkdNSW50cnVzaW9uKHRydWUpO1xuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjYW5jZWw6IHtcbiAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCIgc3R5bGU9XCJjb2xvcjogcmVkXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLnJlZnVzZScpLFxuICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGF3YWl0IGFjdG9yLm9uR01JbnRydXNpb24oZmFsc2UpO1xuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKCFhY3Rvci5jYW5SZWZ1c2VJbnRydXNpb24pIHtcbiAgICAgIGNvbnN0IG5vdEVub3VnaFhQID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi5ub3RFbm91Z2hYUCcpO1xuXG4gICAgICBkaWFsb2dDb250ZW50ICs9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxuICAgICAgICAgIDxwPjxzdHJvbmc+JHtub3RFbm91Z2hYUH08L3N0cm9uZz48L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8aHIgLz5gXG5cbiAgICAgIGRlbGV0ZSBkaWFsb2dCdXR0b25zLmNhbmNlbDtcbiAgICB9XG5cbiAgICBjb25zdCBkaWFsb2dEYXRhID0ge1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmRpYWxvZy5pbnRydXNpb24udGl0bGUnKSxcbiAgICAgIGNvbnRlbnQ6IGRpYWxvZ0NvbnRlbnQsXG4gICAgICBidXR0b25zOiBkaWFsb2dCdXR0b25zLFxuICAgICAgZGVmYXVsdFllczogZmFsc2UsXG4gICAgfTtcblxuICAgIHN1cGVyKGRpYWxvZ0RhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hY3RvciA9IGFjdG9yO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBfZ2V0SGVhZGVyQnV0dG9ucygpIHtcbiAgICAvLyBEb24ndCBpbmNsdWRlIGFueSBoZWFkZXIgYnV0dG9ucywgZm9yY2UgYW4gb3B0aW9uIHRvIGJlIGNob3NlblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgY2xvc2UoKSB7XG4gICAgLy8gUHJldmVudCBkZWZhdWx0IGNsb3NpbmcgYmVoYXZpb3JcbiAgfVxufSBcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXG5cbi8qKlxuICogQWxsb3dzIHRoZSB1c2VyIHRvIGNob29zZSBvbmUgb2YgdGhlIG90aGVyIHBsYXllciBjaGFyYWN0ZXJzLlxuICogXG4gKiBAZXhwb3J0XG4gKiBAY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nXG4gKiBAZXh0ZW5kcyB7RGlhbG9nfVxuICovXG5leHBvcnQgY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcblxuICAvKiogQG92ZXJyaWRlICovXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XG4gICAgICB0ZW1wbGF0ZTogXCJ0ZW1wbGF0ZXMvaHVkL2RpYWxvZy5odG1sXCIsXG4gICAgICBjbGFzc2VzOiBbXCJjc3JcIiwgXCJkaWFsb2dcIiwgXCJwbGF5ZXItY2hvaWNlXCJdLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMTc1XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihhY3RvcnMsIG9uQWNjZXB0Rm4sIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRpYWxvZ1NlbGVjdE9wdGlvbnMgPSBbXTtcbiAgICBhY3RvcnMuZm9yRWFjaChhY3RvciA9PiB7XG4gICAgICBkaWFsb2dTZWxlY3RPcHRpb25zLnB1c2goYDxvcHRpb24gdmFsdWU9XCIke2FjdG9yLl9pZH1cIj4ke2FjdG9yLm5hbWV9PC9vcHRpb24+YClcbiAgICB9KTtcblxuICAgIGNvbnN0IGRpYWxvZ1RleHQgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLmNvbnRlbnQnKTtcbiAgICBjb25zdCBkaWFsb2dDb250ZW50ID0gYFxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgPHA+JHtkaWFsb2dUZXh0fTwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPlxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cbiAgICAgICAgPHNlbGVjdCBuYW1lPVwicGxheWVyXCI+XG4gICAgICAgICAgJHtkaWFsb2dTZWxlY3RPcHRpb25zLmpvaW4oJ1xcbicpfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxociAvPmA7XG5cbiAgICBjb25zdCBkaWFsb2dCdXR0b25zID0ge1xuICAgICAgb2s6IHtcbiAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLmFjY2VwdCcpLFxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdG9ySWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNob2ljZSBzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnZhbHVlO1xuXG4gICAgICAgICAgb25BY2NlcHRGbihhY3RvcklkKTtcblxuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgZGlhbG9nRGF0YSA9IHtcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLnRpdGxlJyksXG4gICAgICBjb250ZW50OiBkaWFsb2dDb250ZW50LFxuICAgICAgYnV0dG9uczogZGlhbG9nQnV0dG9ucyxcbiAgICAgIGRlZmF1bHRZZXM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBzdXBlcihkaWFsb2dEYXRhLCBvcHRpb25zKTtcblxuICAgIHRoaXMuYWN0b3JzID0gYWN0b3JzO1xuICB9XG5cbiAgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuXG4gICAgZGF0YS5hY3RvcnMgPSB0aGlzLmFjdG9ycztcblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xuXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgLy8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIF9nZXRIZWFkZXJCdXR0b25zKCkge1xuICAgIC8vIERvbid0IGluY2x1ZGUgYW55IGhlYWRlciBidXR0b25zLCBmb3JjZSBhbiBvcHRpb24gdG8gYmUgY2hvc2VuXG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBjbG9zZSgpIHtcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgY2xvc2luZyBiZWhhdmlvclxuICB9XG59IFxuIiwiLyogZ2xvYmFscyBEaWFsb2cgKi9cblxuZXhwb3J0IGNsYXNzIFJvbGxEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuICBjb25zdHJ1Y3RvcihkaWFsb2dEYXRhLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwicm9sbE1vZGVcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzVweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IEVudW1Qb29sID0gW1xuICBcIk1pZ2h0XCIsXG4gIFwiU3BlZWRcIixcbiAgXCJJbnRlbGxlY3RcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVBvb2w7XG4iLCJjb25zdCBFbnVtUmFuZ2UgPSBbXG4gIFwiSW1tZWRpYXRlXCIsXG4gIFwiU2hvcnRcIixcbiAgXCJMb25nXCIsXG4gIFwiVmVyeSBMb25nXCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1SYW5nZTtcbiIsImNvbnN0IEVudW1UcmFpbmluZyA9IFtcbiAgXCJJbmFiaWxpdHlcIixcbiAgXCJVbnRyYWluZWRcIixcbiAgXCJUcmFpbmVkXCIsXG4gIFwiU3BlY2lhbGl6ZWRcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVRyYWluaW5nO1xuIiwiY29uc3QgRW51bVdlYXBvbkNhdGVnb3J5ID0gW1xuICBcIkJhc2hpbmdcIixcbiAgXCJCbGFkZWRcIixcbiAgXCJSYW5nZWRcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVdlYXBvbkNhdGVnb3J5O1xuIiwiY29uc3QgRW51bVdlaWdodCA9IFtcbiAgXCJMaWdodFwiLFxuICBcIk1lZGl1bVwiLFxuICBcIkhlYXZ5XCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1XZWlnaHQ7XG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzID0gKCkgPT4ge1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0b0xvd2VyQ2FzZScsIHN0ciA9PiBzdHIudG9Mb3dlckNhc2UoKSk7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvVXBwZXJDYXNlJywgdGV4dCA9PiB0ZXh0LnRvVXBwZXJDYXNlKCkpO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2VxJywgKHYxLCB2MikgPT4gdjEgPT09IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbmVxJywgKHYxLCB2MikgPT4gdjEgIT09IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignb3InLCAodjEsIHYyKSA9PiB2MSB8fCB2Mik7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Rlcm5hcnknLCAoY29uZCwgdjEsIHYyKSA9PiBjb25kID8gdjEgOiB2Mik7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2NvbmNhdCcsICh2MSwgdjIpID0+IGAke3YxfSR7djJ9YCk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc3RyT3JTcGFjZScsIHZhbCA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gKHZhbCAmJiAhIXZhbC5sZW5ndGgpID8gdmFsIDogJyZuYnNwOyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndHJhaW5pbmdJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5pbmFiaWxpdHknKX1cIj5bSV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudW50cmFpbmVkJyl9XCI+W1VdPC9zcGFuPmA7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLnRyYWluZWQnKX1cIj5bVF08L3NwYW4+YDtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcuc3BlY2lhbGl6ZWQnKX1cIj5bU108L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Bvb2xJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLm1pZ2h0Jyl9XCI+W01dPC9zcGFuPmA7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wuc3BlZWQnKX1cIj5bU108L3NwYW4+YDtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5pbnRlbGxlY3QnKX1cIj5bSV08L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xuXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3R5cGVJY29uJywgdmFsID0+IHtcbiAgICBzd2l0Y2ggKHZhbCkge1xuICAgICAgLy8gVE9ETzogQWRkIHNraWxsIGFuZCBhYmlsaXR5P1xuICAgICAgXG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPlthXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LndlYXBvbicpfVwiPlt3XTwvc3Bhbj5gO1xuICAgICAgY2FzZSAnZ2Vhcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5nZWFyJyl9XCI+W2ddPC9zcGFuPmA7XG4gICAgICBcbiAgICAgIGNhc2UgJ2N5cGhlcic6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5jeXBoZXInKX1cIj5bQ108L3NwYW4+YDtcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W0FdPC9zcGFuPmA7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bT108L3NwYW4+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH0pO1xufTtcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgKi9cblxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW1TaGVldCB3aXRoIHNvbWUgdmVyeSBzaW1wbGUgbW9kaWZpY2F0aW9uc1xuICogQGV4dGVuZHMge0l0ZW1TaGVldH1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW1TaGVldCBleHRlbmRzIEl0ZW1TaGVldCB7XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xuICAgICAgY2xhc3NlczogW1wiY3lwaGVyc3lzdGVtXCIsIFwic2hlZXRcIiwgXCJpdGVtXCJdLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIGhlaWdodDogMjAwXG4gICAgfSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICBjb25zdCBwYXRoID0gXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbVwiO1xuICAgIHJldHVybiBgJHtwYXRofS8ke3RoaXMuaXRlbS5kYXRhLnR5cGV9LXNoZWV0Lmh0bWxgO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfc2tpbGxEYXRhKGRhdGEpIHtcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEudHJhaW5pbmdMZXZlbHMgPSBDU1IudHJhaW5pbmdMZXZlbHM7XG4gIH1cblxuICBfYWJpbGl0eURhdGEoZGF0YSkge1xuICAgIGRhdGEucmFuZ2VzID0gQ1NSLm9wdGlvbmFsUmFuZ2VzO1xuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XG4gIH1cblxuICBfYXJtb3JEYXRhKGRhdGEpIHtcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcbiAgfVxuXG4gIF93ZWFwb25EYXRhKGRhdGEpIHtcbiAgICBkYXRhLnJhbmdlcyA9IENTUi5yYW5nZXM7XG4gICAgZGF0YS53ZWFwb25UeXBlcyA9IENTUi53ZWFwb25UeXBlcztcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcbiAgfVxuXG4gIF9nZWFyRGF0YShkYXRhKSB7XG4gIH1cblxuICBfY3lwaGVyRGF0YShkYXRhKSB7XG4gICAgZGF0YS5pc0dNID0gZ2FtZS51c2VyLmlzR007XG4gIH1cblxuICBfYXJ0aWZhY3REYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIF9vZGRpdHlEYXRhKGRhdGEpIHtcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgZ2V0RGF0YSgpIHtcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xuXG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLml0ZW0uZGF0YTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICB0aGlzLl9hYmlsaXR5RGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX2FybW9yRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICB0aGlzLl93ZWFwb25EYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICB0aGlzLl9nZWFyRGF0YShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9jeXBoZXJEYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgdGhpcy5fYXJ0aWZhY3REYXRhKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIHRoaXMuX29kZGl0eURhdGEoZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAvKiogQG92ZXJyaWRlICovXG4gIHNldFBvc2l0aW9uKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gc3VwZXIuc2V0UG9zaXRpb24ob3B0aW9ucyk7XG4gICAgY29uc3Qgc2hlZXRCb2R5ID0gdGhpcy5lbGVtZW50LmZpbmQoXCIuc2hlZXQtYm9keVwiKTtcbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gcG9zaXRpb24uaGVpZ2h0IC0gMTkyO1xuICAgIHNoZWV0Qm9keS5jc3MoXCJoZWlnaHRcIiwgYm9keUhlaWdodCk7XG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICBfc2tpbGxMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdza2lsbC13aW5kb3cnKTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnBvb2xcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnRyYWluaW5nXCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG4gIH1cblxuICBfYWJpbGl0eUxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FiaWxpdHktd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5pc0VuYWJsZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcyMjBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmNvc3QucG9vbFwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzg1cHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5yYW5nZVwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuXG4gICAgY29uc3QgY2JJZGVudGlmaWVkID0gaHRtbC5maW5kKCcjY2ItaWRlbnRpZmllZCcpO1xuICAgIGNiSWRlbnRpZmllZC5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIHRoaXMuaXRlbS51cGRhdGUoe1xuICAgICAgICAnZGF0YS5pZGVudGlmaWVkJzogZXYudGFyZ2V0LmNoZWNrZWRcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgX2FybW9yTGlzdGVuZXJzKGh0bWwpIHtcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnYXJtb3Itd2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWlnaHRcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxuXG4gIF93ZWFwb25MaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCd3ZWFwb24td2luZG93Jyk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWlnaHRcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMTBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcblxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmNhdGVnb3J5XCJdJykuc2VsZWN0Mih7XG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5yYW5nZVwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEyMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgX2dlYXJMaXN0ZW5lcnMoaHRtbCkge1xuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdnZWFyLXdpbmRvdycpO1xuICB9XG5cbiAgX2N5cGhlckxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2N5cGhlci13aW5kb3cnKTtcbiAgfVxuXG4gIF9hcnRpZmFjdExpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FydGlmYWN0LXdpbmRvdycpO1xuICB9XG5cbiAgX29kZGl0eUxpc3RlbmVycyhodG1sKSB7XG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ29kZGl0eS13aW5kb3cnKTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZWRpdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuaXRlbS5kYXRhO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnc2tpbGwnOlxuICAgICAgICB0aGlzLl9za2lsbExpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhYmlsaXR5JzpcbiAgICAgICAgdGhpcy5fYWJpbGl0eUxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIHRoaXMuX2FybW9yTGlzdGVuZXJzKGh0bWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3dlYXBvbic6XG4gICAgICAgIHRoaXMuX3dlYXBvbkxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnZWFyJzpcbiAgICAgICAgdGhpcy5fZ2Vhckxpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICB0aGlzLl9jeXBoZXJMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxuICAgICAgICB0aGlzLl9hcnRpZmFjdExpc3RlbmVycyhodG1sKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICB0aGlzLl9vZGRpdHlMaXN0ZW5lcnMoaHRtbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZ2xvYmFscyBJdGVtIHJlbmRlclRlbXBsYXRlICovXG5cbmltcG9ydCB7IGN5cGhlclJvbGwgfSBmcm9tICcuLi9yb2xscy5qcyc7XG5pbXBvcnQgeyB2YWxPckRlZmF1bHQgfSBmcm9tICcuLi91dGlscy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcbmltcG9ydCBFbnVtVHJhaW5pbmcgZnJvbSAnLi4vZW51bXMvZW51bS10cmFpbmluZy5qcyc7XG5pbXBvcnQgRW51bVdlaWdodCBmcm9tICcuLi9lbnVtcy9lbnVtLXdlaWdodC5qcyc7XG5pbXBvcnQgRW51bVJhbmdlIGZyb20gJy4uL2VudW1zL2VudW0tcmFuZ2UuanMnO1xuaW1wb3J0IEVudW1XZWFwb25DYXRlZ29yeSBmcm9tICcuLi9lbnVtcy9lbnVtLXdlYXBvbi1jYXRlZ29yeS5qcyc7XG5cbi8qKlxuICogRXh0ZW5kIHRoZSBiYXNpYyBJdGVtIHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zLlxuICogQGV4dGVuZHMge0l0ZW19XG4gKi9cbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1JdGVtIGV4dGVuZHMgSXRlbSB7XG4gIF9wcmVwYXJlU2tpbGxEYXRhKCkge1xuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XG5cbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LnNraWxsJykpO1xuICAgIGRhdGEucG9vbCA9IHZhbE9yRGVmYXVsdChkYXRhLnBvb2wsIDApO1xuICAgIGRhdGEudHJhaW5pbmcgPSB2YWxPckRlZmF1bHQoZGF0YS50cmFpbmluZywgMSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG5cbiAgICBkYXRhLmZsYWdzID0gdmFsT3JEZWZhdWx0KGRhdGEuZmxhZ3MsIHt9KTtcbiAgfVxuXG4gIF9wcmVwYXJlQWJpbGl0eURhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuYWJpbGl0eScpKTtcbiAgICBkYXRhLnNvdXJjZVR5cGUgPSB2YWxPckRlZmF1bHQoZGF0YS5zb3VyY2VUeXBlLCAnJyk7XG4gICAgZGF0YS5zb3VyY2VWYWx1ZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNvdXJjZVZhbHVlLCAnJyk7XG4gICAgZGF0YS5pc0VuYWJsZXIgPSB2YWxPckRlZmF1bHQoZGF0YS5pc0VuYWJsZXIsIHRydWUpO1xuICAgIGRhdGEuY29zdCA9IHZhbE9yRGVmYXVsdChkYXRhLmNvc3QsIHtcbiAgICAgIHZhbHVlOiAwLFxuICAgICAgcG9vbDogMFxuICAgIH0pO1xuICAgIGRhdGEucmFuZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5yYW5nZSwgMCk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZUFybW9yRGF0YSgpIHtcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xuXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hcm1vcicpKTtcbiAgICBkYXRhLmFybW9yID0gdmFsT3JEZWZhdWx0KGRhdGEuYXJtb3IsIDEpO1xuICAgIGRhdGEuYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdCA9IHZhbE9yRGVmYXVsdChkYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsIDEpO1xuICAgIGRhdGEucHJpY2UgPSB2YWxPckRlZmF1bHQoZGF0YS5wcmljZSwgMCk7XG4gICAgZGF0YS53ZWlnaHQgPSB2YWxPckRlZmF1bHQoZGF0YS53ZWlnaHQsIDApO1xuICAgIGRhdGEucXVhbnRpdHkgPSB2YWxPckRlZmF1bHQoZGF0YS5xdWFudGl0eSwgMSk7XG4gICAgZGF0YS5lcXVpcHBlZCA9IHZhbE9yRGVmYXVsdChkYXRhLmVxdWlwcGVkLCBmYWxzZSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZVdlYXBvbkRhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcud2VhcG9uJykpO1xuICAgIGRhdGEuZGFtYWdlID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlLCAxKTtcbiAgICBkYXRhLmNhdGVnb3J5ID0gdmFsT3JEZWZhdWx0KGRhdGEuY2F0ZWdvcnksIDApO1xuICAgIGRhdGEucmFuZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5yYW5nZSwgMCk7XG4gICAgZGF0YS5wcmljZSA9IHZhbE9yRGVmYXVsdChkYXRhLnByaWNlLCAwKTtcbiAgICBkYXRhLndlaWdodCA9IHZhbE9yRGVmYXVsdChkYXRhLndlaWdodCwgMCk7XG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcbiAgICBkYXRhLmVxdWlwcGVkID0gdmFsT3JEZWZhdWx0KGRhdGEuZXF1aXBwZWQsIGZhbHNlKTtcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcbiAgfVxuXG4gIF9wcmVwYXJlR2VhckRhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuZ2VhcicpKTtcbiAgICBkYXRhLnByaWNlID0gdmFsT3JEZWZhdWx0KGRhdGEucHJpY2UsIDApO1xuICAgIGRhdGEucXVhbnRpdHkgPSB2YWxPckRlZmF1bHQoZGF0YS5xdWFudGl0eSwgMSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZUN5cGhlckRhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuY3lwaGVyJykpO1xuICAgIGRhdGEuaWRlbnRpZmllZCA9IHZhbE9yRGVmYXVsdChkYXRhLmlkZW50aWZpZWQsIGZhbHNlKTtcbiAgICBkYXRhLmxldmVsID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWwsIG51bGwpO1xuICAgIGRhdGEubGV2ZWxEaWUgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbERpZSwgJycpO1xuICAgIGRhdGEuZm9ybSA9IHZhbE9yRGVmYXVsdChkYXRhLmZvcm0sICcnKTtcbiAgICBkYXRhLmVmZmVjdCA9IHZhbE9yRGVmYXVsdChkYXRhLmVmZmVjdCwgJycpO1xuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xuICB9XG5cbiAgX3ByZXBhcmVBcnRpZmFjdERhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuYXJ0aWZhY3QnKSk7XG4gICAgZGF0YS5pZGVudGlmaWVkID0gdmFsT3JEZWZhdWx0KGRhdGEuaWRlbnRpZmllZCwgZmFsc2UpO1xuICAgIGRhdGEubGV2ZWwgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbCwgbnVsbCk7XG4gICAgZGF0YS5sZXZlbERpZSA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsRGllLCAnJyk7XG4gICAgZGF0YS5mb3JtID0gdmFsT3JEZWZhdWx0KGRhdGEuZm9ybSwgJycpO1xuICAgIGRhdGEuZWZmZWN0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmZWN0LCAnJyk7XG4gICAgZGF0YS5kZXBsZXRpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5kZXBsZXRpb24sIHtcbiAgICAgIGlzRGVwbGV0aW5nOiB0cnVlLFxuICAgICAgZGllOiAnZDYnLFxuICAgICAgdGhyZXNob2xkOiAxXG4gICAgfSk7XG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XG4gIH1cblxuICBfcHJlcGFyZU9kZGl0eURhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcub2RkaXR5JykpO1xuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIEl0ZW0gZGF0YSBtb2RlbCB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxuICAgKi9cbiAgcHJlcGFyZURhdGEoKSB7XG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcblxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICBjYXNlICdza2lsbCc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVTa2lsbERhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhYmlsaXR5JzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUFiaWxpdHlEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJtb3InOlxuICAgICAgICB0aGlzLl9wcmVwYXJlQXJtb3JEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnd2VhcG9uJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZVdlYXBvbkRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdnZWFyJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUdlYXJEYXRhKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3lwaGVyJzpcbiAgICAgICAgdGhpcy5fcHJlcGFyZUN5cGhlckRhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcnRpZmFjdCc6XG4gICAgICAgIHRoaXMuX3ByZXBhcmVBcnRpZmFjdERhdGEoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvZGRpdHknOlxuICAgICAgICB0aGlzLl9wcmVwYXJlT2RkaXR5RGF0YSgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUm9sbFxuICAgKi9cblxuICBfc2tpbGxSb2xsKCkge1xuICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XG5cbiAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXM7XG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCB7IHBvb2wgfSA9IGl0ZW0uZGF0YTtcbiAgICBjb25zdCBhc3NldHMgPSBhY3Rvci5nZXRTa2lsbExldmVsKHRoaXMpO1xuICAgIFxuICAgIGNvbnN0IHBhcnRzID0gWycxZDIwJ107XG4gICAgaWYgKGFzc2V0cyAhPT0gMCkge1xuICAgICAgY29uc3Qgc2lnbiA9IGFzc2V0cyA8IDAgPyAnLScgOiAnKyc7XG4gICAgICBwYXJ0cy5wdXNoKGAke3NpZ259ICR7TWF0aC5hYnMoYXNzZXRzKSAqIDN9YCk7XG4gICAgfVxuXG4gICAgY3lwaGVyUm9sbCh7XG4gICAgICBwYXJ0cyxcblxuICAgICAgZGF0YToge1xuICAgICAgICBwb29sLFxuICAgICAgICBhYmlsaXR5Q29zdDogMCxcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxuICAgICAgICBhc3NldHNcbiAgICAgIH0sXG4gICAgICBldmVudCxcblxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuc2tpbGwudGl0bGUnKSxcbiAgICAgIGZsYXZvcjogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5za2lsbC5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKS5yZXBsYWNlKCcjI1BPT0wjIycsIG5hbWUpLFxuXG4gICAgICBhY3RvcixcbiAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICB9KTtcbiAgfVxuXG4gIF9hYmlsaXR5Um9sbCgpIHtcbiAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xuXG4gICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzO1xuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBpc0VuYWJsZXIsIGNvc3QgfSA9IGl0ZW0uZGF0YTtcblxuICAgIGlmICghaXNFbmFibGVyKSB7XG4gICAgICBjb25zdCB7IHBvb2wgfSA9IGNvc3Q7XG5cbiAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHBhcnNlSW50KGNvc3QuYW1vdW50LCAxMCkpKSB7XG4gICAgICAgIGN5cGhlclJvbGwoe1xuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIHBhcnRzOiBbJzFkMjAnXSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwb29sLFxuICAgICAgICAgICAgYWJpbGl0eUNvc3Q6IGNvc3QuYW1vdW50LFxuICAgICAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICAgICAgZmxhdm9yOiBgJHthY3Rvci5uYW1lfSB1c2VkICR7bmFtZX1gLFxuICAgICAgICAgIHRpdGxlOiAnVXNlIEFiaWxpdHknLFxuICAgICAgICAgIGFjdG9yXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcbiAgICAgICAgICBmbGF2b3I6ICdBYmlsaXR5IEZhaWxlZCcsXG4gICAgICAgICAgY29udGVudDogYE5vdCBlbm91Z2ggcG9pbnRzIGluICR7cG9vbE5hbWV9IHBvb2wuYFxuICAgICAgICB9XSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xuICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICAgIGZsYXZvcjogJ0ludmFsaWQgQWJpbGl0eScsXG4gICAgICAgIGNvbnRlbnQ6IGBUaGlzIGFiaWxpdHkgaXMgYW4gRW5hYmxlciBhbmQgY2Fubm90IGJlIHJvbGxlZCBmb3IuYFxuICAgICAgfV0pO1xuICAgIH1cbiAgfVxuXG4gIHJvbGwoKSB7XG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgdGhpcy5fc2tpbGxSb2xsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYWJpbGl0eSc6XG4gICAgICAgIHRoaXMuX2FiaWxpdHlSb2xsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmZvXG4gICAqL1xuXG4gIGFzeW5jIF9za2lsbEluZm8oKSB7XG4gICAgY29uc3Qgc2tpbGxEYXRhID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gc2tpbGxEYXRhO1xuXG4gICAgY29uc3QgdHJhaW5pbmcgPSBFbnVtVHJhaW5pbmdbc2tpbGxEYXRhLmRhdGEudHJhaW5pbmddO1xuICAgIGNvbnN0IHBvb2wgPSBFbnVtUG9vbHNbc2tpbGxEYXRhLmRhdGEucG9vbF07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBza2lsbERhdGEubmFtZSxcbiAgICAgIHRyYWluaW5nOiB0cmFpbmluZy50b0xvd2VyQ2FzZSgpLFxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxuICAgICAgbm90ZXM6IGRhdGEubm90ZXMsXG5cbiAgICAgIGluaXRpYXRpdmU6ICEhZGF0YS5mbGFncy5pbml0aWF0aXZlXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIF9hYmlsaXR5SW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwb29sID0gRW51bVBvb2xzW2RhdGEuZGF0YS5jb3N0LnBvb2xdO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxuICAgICAgaXNFbmFibGVyOiBkYXRhLmRhdGEuaXNFbmFibGVyLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYXJtb3JJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHdlaWdodCA9IEVudW1XZWlnaHRbZGF0YS5kYXRhLndlaWdodF07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBlcXVpcHBlZDogZGF0YS5kYXRhLmVxdWlwcGVkLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXG4gICAgICBhcm1vcjogZGF0YS5kYXRhLmFybW9yLFxuICAgICAgYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdDogZGF0YS5kYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcbiAgICB9O1xuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJtb3ItaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgX3dlYXBvbkluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qgd2VpZ2h0ID0gRW51bVdlaWdodFtkYXRhLmRhdGEud2VpZ2h0XTtcbiAgICBjb25zdCByYW5nZSA9IEVudW1SYW5nZVtkYXRhLmRhdGEucmFuZ2VdO1xuICAgIGNvbnN0IGNhdGVnb3J5ID0gRW51bVdlYXBvbkNhdGVnb3J5W2RhdGEuZGF0YS5jYXRlZ29yeV07XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBlcXVpcHBlZDogZGF0YS5kYXRhLmVxdWlwcGVkLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXG4gICAgICByYW5nZTogcmFuZ2UudG9Mb3dlckNhc2UoKSxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeS50b0xvd2VyQ2FzZSgpLFxuICAgICAgZGFtYWdlOiBkYXRhLmRhdGEuZGFtYWdlLFxuICAgICAgcHJpY2U6IGRhdGEuZGF0YS5wcmljZSxcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3dlYXBvbi1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfZ2VhckluZm8oKSB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgbmFtZTogZGF0YS5uYW1lLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbCcsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIGFzeW5jIF9jeXBoZXJJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXG4gICAgICBsZXZlbDogZGF0YS5kYXRhLmxldmVsLFxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXG4gICAgICBlZmZlY3Q6IGRhdGEuZGF0YS5lZmZlY3QsXG4gICAgfTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2N5cGhlci1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfYXJ0aWZhY3RJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXG4gICAgICBsZXZlbDogZGF0YS5kYXRhLmxldmVsLFxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXG4gICAgICBpc0RlcGxldGluZzogZGF0YS5kYXRhLmRlcGxldGlvbi5pc0RlcGxldGluZyxcbiAgICAgIGRlcGxldGlvblRocmVzaG9sZDogZGF0YS5kYXRhLmRlcGxldGlvbi50aHJlc2hvbGQsXG4gICAgICBkZXBsZXRpb25EaWU6IGRhdGEuZGF0YS5kZXBsZXRpb24uZGllLFxuICAgICAgZWZmZWN0OiBkYXRhLmRhdGEuZWZmZWN0LFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcnRpZmFjdC1pbmZvLmh0bWwnLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cblxuICBhc3luYyBfb2RkaXR5SW5mbygpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XG5cbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxuICAgIH07XG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sJywgcGFyYW1zKTtcblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgYXN5bmMgZ2V0SW5mbygpIHtcbiAgICBsZXQgaHRtbCA9ICcnO1xuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NraWxsJzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX3NraWxsSW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYWJpbGl0eUluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhcm1vcic6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hcm1vckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd3ZWFwb24nOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fd2VhcG9uSW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2dlYXInOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fZ2VhckluZm8oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjeXBoZXInOlxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fY3lwaGVySW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FydGlmYWN0SW5mbygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29kZGl0eSc6XG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9vZGRpdHlJbmZvKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sO1xuICB9XG59XG4iLCIvKiBnbG9iYWxzIHJlbmRlclRlbXBsYXRlICovXG5cbmltcG9ydCB7IFJvbGxEaWFsb2cgfSBmcm9tICcuL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcm9sbFRleHQoZGllUm9sbCwgcm9sbFRvdGFsKSB7XG4gIGxldCBwYXJ0cyA9IFtdO1xuXG4gIGNvbnN0IHRhc2tMZXZlbCA9IE1hdGguZmxvb3Iocm9sbFRvdGFsIC8gMyk7XG4gIGNvbnN0IHNraWxsTGV2ZWwgPSBNYXRoLmZsb29yKChyb2xsVG90YWwgLSBkaWVSb2xsKSAvIDMgKyAwLjUpO1xuICBjb25zdCB0b3RhbEFjaGlldmVkID0gdGFza0xldmVsICsgc2tpbGxMZXZlbDtcblxuICBsZXQgdG5Db2xvciA9ICcjMDAwMDAwJztcbiAgaWYgKHRvdGFsQWNoaWV2ZWQgPCAzKSB7XG4gICAgdG5Db2xvciA9ICcjMGE4NjBhJztcbiAgfSBlbHNlIGlmICh0b3RhbEFjaGlldmVkIDwgNykge1xuICAgIHRuQ29sb3IgPSAnIzg0ODQwOSc7XG4gIH0gZWxzZSB7XG4gICAgdG5Db2xvciA9ICcjMGE4NjBhJztcbiAgfVxuXG4gIGxldCBzdWNjZXNzVGV4dCA9IGA8JHt0b3RhbEFjaGlldmVkfT5gO1xuICBpZiAoc2tpbGxMZXZlbCAhPT0gMCkge1xuICAgIGNvbnN0IHNpZ24gPSBza2lsbExldmVsID4gMCA/IFwiK1wiIDogXCJcIjtcbiAgICBzdWNjZXNzVGV4dCArPSBgICgke3Rhc2tMZXZlbH0ke3NpZ259JHtza2lsbExldmVsfSlgO1xuICB9XG5cbiAgcGFydHMucHVzaCh7XG4gICAgdGV4dDogc3VjY2Vzc1RleHQsXG4gICAgY29sb3I6IHRuQ29sb3IsXG4gICAgY2xzOiAndGFyZ2V0LW51bWJlcidcbiAgfSlcblxuICBzd2l0Y2ggKGRpZVJvbGwpIHtcbiAgICBjYXNlIDE6XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5pbnRydXNpb24nKSxcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMTk6XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5lZmZlY3QubWlub3InKSxcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgMjA6XG4gICAgICBwYXJ0cy5wdXNoKHtcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5lZmZlY3QubWFqb3InKSxcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBwYXJ0cztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGN5cGhlclJvbGwoeyBwYXJ0cyA9IFtdLCBkYXRhID0ge30sIGFjdG9yID0gbnVsbCwgZXZlbnQgPSBudWxsLCBzcGVha2VyID0gbnVsbCwgZmxhdm9yID0gbnVsbCwgdGl0bGUgPSBudWxsLCBpdGVtID0gZmFsc2UgfSA9IHt9KSB7XG4gIGxldCByb2xsTW9kZSA9IGdhbWUuc2V0dGluZ3MuZ2V0KCdjb3JlJywgJ3JvbGxNb2RlJyk7XG4gIGxldCByb2xsZWQgPSBmYWxzZTtcbiAgbGV0IGZpbHRlcmVkID0gcGFydHMuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgIHJldHVybiBlbCAhPSAnJyAmJiBlbDtcbiAgfSk7XG5cbiAgbGV0IG1heEVmZm9ydCA9IDE7XG4gIGlmIChkYXRhWydtYXhFZmZvcnQnXSkge1xuICAgIG1heEVmZm9ydCA9IHBhcnNlSW50KGRhdGFbJ21heEVmZm9ydCddLCAxMCkgfHwgMTtcbiAgfVxuXG4gIGNvbnN0IF9yb2xsID0gKGZvcm0gPSBudWxsKSA9PiB7XG4gICAgLy8gT3B0aW9uYWxseSBpbmNsdWRlIGVmZm9ydFxuICAgIGlmIChmb3JtICE9PSBudWxsKSB7XG4gICAgICBkYXRhWydlZmZvcnQnXSA9IHBhcnNlSW50KGZvcm0uZWZmb3J0LnZhbHVlLCAxMCk7XG4gICAgfVxuICAgIGlmIChkYXRhWydlZmZvcnQnXSkge1xuICAgICAgZmlsdGVyZWQucHVzaChgKyR7ZGF0YVsnZWZmb3J0J10gKiAzfWApO1xuXG4gICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byBsb2NhbGl6ZSB0aGlzLCBjb25jYXRpbmcgc3RyaW5ncyBkb2Vzbid0IHdvcmsgZm9yIGFsbCBsYW5ndWFnZXNcbiAgICAgIGZsYXZvciArPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLmVmZm9ydC5mbGF2b3InKS5yZXBsYWNlKCcjI0VGRk9SVCMjJywgZGF0YVsnZWZmb3J0J10pO1xuICAgIH1cblxuICAgIGNvbnN0IHJvbGwgPSBuZXcgUm9sbChmaWx0ZXJlZC5qb2luKCcnKSwgZGF0YSkucm9sbCgpO1xuICAgIC8vIENvbnZlcnQgdGhlIHJvbGwgdG8gYSBjaGF0IG1lc3NhZ2UgYW5kIHJldHVybiB0aGUgcm9sbFxuICAgIHJvbGxNb2RlID0gZm9ybSA/IGZvcm0ucm9sbE1vZGUudmFsdWUgOiByb2xsTW9kZTtcbiAgICByb2xsZWQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHJvbGw7XG4gIH1cblxuICBjb25zdCB0ZW1wbGF0ZSA9ICdzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvZGlhbG9nL3JvbGwtZGlhbG9nLmh0bWwnO1xuICBsZXQgZGlhbG9nRGF0YSA9IHtcbiAgICBmb3JtdWxhOiBmaWx0ZXJlZC5qb2luKCcgJyksXG4gICAgbWF4RWZmb3J0OiBtYXhFZmZvcnQsXG4gICAgZGF0YTogZGF0YSxcbiAgICByb2xsTW9kZTogcm9sbE1vZGUsXG4gICAgcm9sbE1vZGVzOiBDT05GSUcuRGljZS5yb2xsTW9kZXNcbiAgfTtcblxuICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUodGVtcGxhdGUsIGRpYWxvZ0RhdGEpO1xuICAvL0NyZWF0ZSBEaWFsb2cgd2luZG93XG4gIGxldCByb2xsO1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgbmV3IFJvbGxEaWFsb2coe1xuICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgY29udGVudDogaHRtbCxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgb2s6IHtcbiAgICAgICAgICBsYWJlbDogJ09LJyxcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgICBjYWxsYmFjazogKGh0bWwpID0+IHtcbiAgICAgICAgICAgIHJvbGwgPSBfcm9sbChodG1sWzBdLmNoaWxkcmVuWzBdKTtcblxuICAgICAgICAgICAgLy8gVE9ETzogY2hlY2sgcm9sbC5yZXN1bHQgYWdhaW5zdCB0YXJnZXQgbnVtYmVyXG5cbiAgICAgICAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGFtb3VudE9mRWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnZWZmb3J0J10gfHwgMCwgMTApO1xuICAgICAgICAgICAgY29uc3QgZWZmb3J0Q29zdCA9IGFjdG9yLmdldEVmZm9ydENvc3RGcm9tU3RhdChwb29sLCBhbW91bnRPZkVmZm9ydCk7XG4gICAgICAgICAgICBjb25zdCB0b3RhbENvc3QgPSBwYXJzZUludChkYXRhWydhYmlsaXR5Q29zdCddIHx8IDAsIDEwKSArIHBhcnNlSW50KGVmZm9ydENvc3QuY29zdCwgMTApO1xuXG4gICAgICAgICAgICBpZiAoYWN0b3IuY2FuU3BlbmRGcm9tUG9vbChwb29sLCB0b3RhbENvc3QpICYmICFlZmZvcnRDb3N0Lndhcm5pbmcpIHtcbiAgICAgICAgICAgICAgcm9sbC50b01lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHNwZWFrZXI6IHNwZWFrZXIsXG4gICAgICAgICAgICAgICAgZmxhdm9yOiBmbGF2b3JcbiAgICAgICAgICAgICAgfSwgeyByb2xsTW9kZSB9KTtcblxuICAgICAgICAgICAgICBhY3Rvci5zcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcbiAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XG4gICAgICAgICAgICAgICAgc3BlYWtlcixcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmZsYXZvcicpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmNvbnRlbnQnKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKVxuICAgICAgICAgICAgICB9XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiAnQ2FuY2VsJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiAnb2snLFxuICAgICAgY2xvc2U6ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZShyb2xsZWQgPyByb2xsIDogZmFsc2UpO1xuICAgICAgfVxuICAgIH0pLnJlbmRlcih0cnVlKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJTeXN0ZW1TZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBjdXJyZW5jeSBuYW1lXG4gICAqL1xuICBnYW1lLnNldHRpbmdzLnJlZ2lzdGVyKCdjeXBoZXJzeXN0ZW0nLCAnY3VycmVuY3lOYW1lJywge1xuICAgIG5hbWU6ICdTRVRUSU5HUy5uYW1lLmN1cnJlbmN5TmFtZScsXG4gICAgaGludDogJ1NFVFRJTkdTLmhpbnQuY3VycmVuY3lOYW1lJyxcbiAgICBzY29wZTogJ3dvcmxkJyxcbiAgICBjb25maWc6IHRydWUsXG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdNb25leSdcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBHTUludHJ1c2lvbkRpYWxvZyB9IGZyb20gXCIuL2RpYWxvZy9nbS1pbnRydXNpb24tZGlhbG9nLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjc3JTb2NrZXRMaXN0ZW5lcnMoKSB7XG4gIGdhbWUuc29ja2V0Lm9uKCdzeXN0ZW0uY3lwaGVyc3lzdGVtJywgaGFuZGxlTWVzc2FnZSk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoYXJncykge1xuICBjb25zdCB7IHR5cGUgfSA9IGFyZ3M7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnZ21JbnRydXNpb24nOlxuICAgICAgaGFuZGxlR01JbnRydXNpb24oYXJncyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdhd2FyZFhQJzpcbiAgICAgIGhhbmRsZUF3YXJkWFAoYXJncyk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHTUludHJ1c2lvbihhcmdzKSB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcbiAgY29uc3QgeyBhY3RvcklkLCB1c2VySWRzIH0gPSBkYXRhO1xuXG4gIGlmICghZ2FtZS5yZWFkeSB8fCBnYW1lLnVzZXIuaXNHTSB8fCAhdXNlcklkcy5maW5kKGlkID0+IGlkID09PSBnYW1lLnVzZXJJZCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLmRhdGEuX2lkID09PSBhY3RvcklkKTtcbiAgY29uc3QgZGlhbG9nID0gbmV3IEdNSW50cnVzaW9uRGlhbG9nKGFjdG9yKTtcbiAgZGlhbG9nLnJlbmRlcih0cnVlKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlQXdhcmRYUChhcmdzKSB7XG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcbiAgY29uc3QgeyBhY3RvcklkLCB4cEFtb3VudCB9ID0gZGF0YTtcblxuICBpZiAoIWdhbWUucmVhZHkgfHwgIWdhbWUudXNlci5pc0dNKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWN0b3IgPSBnYW1lLmFjdG9ycy5nZXQoYWN0b3JJZCk7XG4gIGFjdG9yLnVwZGF0ZSh7XG4gICAgJ2RhdGEueHAnOiBhY3Rvci5kYXRhLmRhdGEueHAgKyB4cEFtb3VudFxuICB9KTtcblxuICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xuICAgIGNvbnRlbnQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5hd2FyZFhQJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IuZGF0YS5uYW1lKVxuICB9KTtcbn1cbiIsIi8qIGdsb2JhbHMgbG9hZFRlbXBsYXRlcyAqL1xuXG4vKipcbiAqIERlZmluZSBhIHNldCBvZiB0ZW1wbGF0ZSBwYXRocyB0byBwcmUtbG9hZFxuICogUHJlLWxvYWRlZCB0ZW1wbGF0ZXMgYXJlIGNvbXBpbGVkIGFuZCBjYWNoZWQgZm9yIGZhc3QgYWNjZXNzIHdoZW4gcmVuZGVyaW5nXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgY29uc3QgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMgPSBhc3luYygpID0+IHtcbiAgLy8gRGVmaW5lIHRlbXBsYXRlIHBhdGhzIHRvIGxvYWRcbiAgY29uc3QgdGVtcGxhdGVQYXRocyA9IFtcblxuICAgICAgLy8gQWN0b3IgU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYy1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9ucGMtc2hlZXQuaHRtbFwiLFxuXG4gICAgICAvLyBBY3RvciBQYXJ0aWFsc1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvcG9vbHMuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvYWR2YW5jZW1lbnQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvZGFtYWdlLXRyYWNrLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3JlY292ZXJ5Lmh0bWxcIixcblxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvc2tpbGxzLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2FiaWxpdGllcy5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbnZlbnRvcnkuaHRtbFwiLFxuXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hYmlsaXR5LWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcm1vci1pbmZvLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vd2VhcG9uLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9jeXBoZXItaW5mby5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FydGlmYWN0LWluZm8uaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sXCIsXG5cbiAgICAgIC8vIEl0ZW0gU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2l0ZW0tc2hlZXQuaHRtbFwiLFxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvaXRlbS9za2lsbC1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2FybW9yLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vd2VhcG9uLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vZ2Vhci1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2N5cGhlci1zaGVldC5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtL3RlbXBsYXRlcy9pdGVtL2FydGlmYWN0LXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW0vdGVtcGxhdGVzL2l0ZW0vb2RkaXR5LXNoZWV0Lmh0bWxcIixcblxuICAgICAgLy8gRGlhbG9nc1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbS90ZW1wbGF0ZXMvZGlhbG9nL3JvbGwtZGlhbG9nLmh0bWxcIixcbiAgXTtcblxuICAvLyBMb2FkIHRoZSB0ZW1wbGF0ZSBwYXJ0c1xuICByZXR1cm4gbG9hZFRlbXBsYXRlcyh0ZW1wbGF0ZVBhdGhzKTtcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVlcFByb3Aob2JqLCBwYXRoKSB7XG4gIGNvbnN0IHByb3BzID0gcGF0aC5zcGxpdCgnLicpO1xuICBsZXQgdmFsID0gb2JqO1xuICBwcm9wcy5mb3JFYWNoKHAgPT4ge1xuICAgIGlmIChwIGluIHZhbCkge1xuICAgICAgdmFsID0gdmFsW3BdO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB2YWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZmluZWQodmFsKSB7XG4gIHJldHVybiAhKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxPckRlZmF1bHQodmFsLCBkZWYpIHtcbiAgcmV0dXJuIGlzRGVmaW5lZCh2YWwpID8gdmFsIDogZGVmO1xufVxuIiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheUxpa2VUb0FycmF5OyIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkOyIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwidmFyIHN1cGVyUHJvcEJhc2UgPSByZXF1aXJlKFwiLi9zdXBlclByb3BCYXNlXCIpO1xuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IFJlZmxlY3QuZ2V0O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICAgIHZhciBiYXNlID0gc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmICghYmFzZSkgcmV0dXJuO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTtcblxuICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dldDsiLCJmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0UHJvdG90eXBlT2Y7IiwidmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vc2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW5oZXJpdHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgX3R5cGVvZiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIGFzc2VydFRoaXNJbml0aWFsaXplZCA9IHJlcXVpcmUoXCIuL2Fzc2VydFRoaXNJbml0aWFsaXplZFwiKTtcblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIGFzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjsiLCJmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZjsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuL2dldFByb3RvdHlwZU9mXCIpO1xuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhaztcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3N1cGVyUHJvcEJhc2U7IiwiZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iXX0=
