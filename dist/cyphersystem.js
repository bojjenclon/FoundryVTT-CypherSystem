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
      return "systems/cyphersystemClean/templates/actor/".concat(type, "-sheet.html");
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
                this._generateItemData(data, 'skill', 'skills');

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
                  _context.next = 11;
                  break;
                }

                _context.next = 10;
                return data.selectedSkill.getInfo();

              case 10:
                data.skillInfo = _context.sent;

              case 11:
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
                this._generateItemData(data, 'ability', 'abilities');

                data.abilityPoolFilter = this.abilityPoolFilter;

                if (data.abilityPoolFilter > -1) {
                  this._filterItemData(data, 'abilities', 'data.cost.pool', parseInt(data.abilityPoolFilter, 10));
                }

                data.selectedAbility = this.selectedAbility;
                data.abilityInfo = '';

                if (!data.selectedAbility) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 8;
                return data.selectedAbility.getInfo();

              case 8:
                data.abilityInfo = _context2.sent;

              case 9:
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
                  })); // Group items by their type

                  items.inventory.sort((function (a, b) {
                    return a.type > b.type ? 1 : -1;
                  }));
                }

                data.cypherCount = items.reduce((function (count, i) {
                  return i.type === 'cypher' ? ++count : count;
                }), 0);
                data.overCypherLimit = this.actor.isOverCypherLimit;
                data.inventoryTypeFilter = this.inventoryTypeFilter;

                if (data.inventoryTypeFilter > -1) {
                  this._filterItemData(data, 'inventory', 'type', _config.CSR.inventoryTypes[parseInt(data.inventoryTypeFilter, 10)]);
                }

                data.selectedInvItem = this.selectedInvItem;
                data.invItemInfo = '';

                if (!data.selectedInvItem) {
                  _context3.next = 13;
                  break;
                }

                _context3.next = 12;
                return data.selectedInvItem.getInfo();

              case 12:
                data.invItemInfo = _context3.sent;

              case 13:
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
                data.currencyName = game.settings.get('cyphersystemClean', 'currencyName');
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
                    game.socket.emit('system.cyphersystemClean', {
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
      game.socket.emit('system.cyphersystemClean', {
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
          game.cyphersystemClean = {
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

          Actors.registerSheet('cyphersystemClean', _actorSheet.CypherSystemActorSheet, {
            types: ['pc'],
            makeDefault: true
          });
          Actors.registerSheet('cyphersystemClean', _actorSheet.CypherSystemActorSheet, {
            types: ['npc'],
            makeDefault: true
          });
          Items.unregisterSheet('core', ItemSheet);
          Items.registerSheet('cyphersystemClean', _itemSheet.CypherSystemItemSheet, {
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
var EnumWeaponCategory = ["Bladed", "Bashing", "Ranged"];
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
      var path = "systems/cyphersystemClean/templates/item";
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
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/skill-info.html', params);

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
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/ability-info.html', params);

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
                  equipped: data.equipped,
                  quantity: data.data.quantity,
                  weight: weight.toLowerCase(),
                  armor: data.data.armor,
                  additionalSpeedEffortCost: data.data.additionalSpeedEffortCost,
                  price: data.data.price,
                  notes: data.data.notes
                };
                _context3.next = 5;
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/armor-info.html', params);

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
                  equipped: data.equipped,
                  quantity: data.data.quantity,
                  weight: weight.toLowerCase(),
                  range: range.toLowerCase(),
                  category: category.toLowerCase(),
                  damage: data.data.damage,
                  price: data.data.price,
                  notes: data.data.notes
                };
                _context4.next = 7;
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/weapon-info.html', params);

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
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/gear-info.html', params);

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
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/cypher-info.html', params);

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
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/artifact-info.html', params);

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
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/oddity-info.html', params);

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

            template = 'systems/cyphersystemClean/templates/dialog/roll-dialog.html';
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
  game.settings.register('cyphersystemClean', 'currencyName', {
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
  game.socket.on('system.cyphersystemClean', handleMessage);
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
            "systems/cyphersystemClean/templates/actor/pc-sheet.html", "systems/cyphersystemClean/templates/actor/npc-sheet.html", // Actor Partials
            "systems/cyphersystemClean/templates/actor/partials/pools.html", "systems/cyphersystemClean/templates/actor/partials/advancement.html", "systems/cyphersystemClean/templates/actor/partials/damage-track.html", "systems/cyphersystemClean/templates/actor/partials/recovery.html", "systems/cyphersystemClean/templates/actor/partials/skills.html", "systems/cyphersystemClean/templates/actor/partials/abilities.html", "systems/cyphersystemClean/templates/actor/partials/inventory.html", "systems/cyphersystemClean/templates/actor/partials/info/skill-info.html", "systems/cyphersystemClean/templates/actor/partials/info/ability-info.html", "systems/cyphersystemClean/templates/actor/partials/info/armor-info.html", "systems/cyphersystemClean/templates/actor/partials/info/weapon-info.html", "systems/cyphersystemClean/templates/actor/partials/info/gear-info.html", "systems/cyphersystemClean/templates/actor/partials/info/cypher-info.html", "systems/cyphersystemClean/templates/actor/partials/info/artifact-info.html", "systems/cyphersystemClean/templates/actor/partials/info/oddity-info.html", // Item Sheets
            "systems/cyphersystemClean/templates/item/item-sheet.html", "systems/cyphersystemClean/templates/item/skill-sheet.html", "systems/cyphersystemClean/templates/item/armor-sheet.html", "systems/cyphersystemClean/templates/item/weapon-sheet.html", "systems/cyphersystemClean/templates/item/gear-sheet.html", "systems/cyphersystemClean/templates/item/cypher-sheet.html", "systems/cyphersystemClean/templates/item/artifact-sheet.html", "systems/cyphersystemClean/templates/item/oddity-sheet.html", // Dialogs
            "systems/cyphersystemClean/templates/dialog/roll-dialog.html"]; // Load the template parts

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY2hhdC5qcyIsIm1vZHVsZS9jb21iYXQuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2NvbnRleHQtbWVudS5qcyIsIm1vZHVsZS9jeXBoZXJzeXN0ZW0uanMiLCJtb2R1bGUvZGlhbG9nL2dtLWludHJ1c2lvbi1kaWFsb2cuanMiLCJtb2R1bGUvZGlhbG9nL3BsYXllci1jaG9pY2UtZGlhbG9nLmpzIiwibW9kdWxlL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXBvb2wuanMiLCJtb2R1bGUvZW51bXMvZW51bS1yYW5nZS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXRyYWluaW5nLmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzIiwibW9kdWxlL2VudW1zL2VudW0td2VpZ2h0LmpzIiwibW9kdWxlL2hhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1vZHVsZS9pdGVtL2l0ZW0tc2hlZXQuanMiLCJtb2R1bGUvaXRlbS9pdGVtLmpzIiwibW9kdWxlL3JvbGxzLmpzIiwibW9kdWxlL3NldHRpbmdzLmpzIiwibW9kdWxlL3NvY2tldC5qcyIsIm1vZHVsZS90ZW1wbGF0ZS5qcyIsIm1vZHVsZS91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhIb2xlcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheUxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVSZXN0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3N1cGVyUHJvcEJhc2UuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL3Jl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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3p0QkE7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nIENvbnRleHRNZW51ICovXHJcblxyXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xyXG5pbXBvcnQgeyBjeXBoZXJSb2xsIH0gZnJvbSAnLi4vcm9sbHMuanMnO1xyXG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1JdGVtIH0gZnJvbSAnLi4vaXRlbS9pdGVtLmpzJztcclxuaW1wb3J0IHsgZGVlcFByb3AgfSBmcm9tICcuLi91dGlscy5qcyc7XHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4uL2VudW1zL2VudW0tcG9vbC5qcyc7XHJcblxyXG4vKipcclxuICogRXh0ZW5kIHRoZSBiYXNpYyBBY3RvclNoZWV0IHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zXHJcbiAqIEBleHRlbmRzIHtBY3RvclNoZWV0fVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUFjdG9yU2hlZXQgZXh0ZW5kcyBBY3RvclNoZWV0IHtcclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcclxuICAgICAgY2xhc3NlczogW1wiY3lwaGVyc3lzdGVtXCIsIFwic2hlZXRcIiwgXCJhY3RvclwiXSxcclxuICAgICAgd2lkdGg6IDYwMCxcclxuICAgICAgaGVpZ2h0OiA1MDAsXHJcbiAgICAgIHRhYnM6IFt7IFxyXG4gICAgICAgIG5hdlNlbGVjdG9yOiBcIi5zaGVldC10YWJzXCIsIFxyXG4gICAgICAgIGNvbnRlbnRTZWxlY3RvcjogXCIuc2hlZXQtYm9keVwiLCBcclxuICAgICAgICBpbml0aWFsOiBcImRlc2NyaXB0aW9uXCIgXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBuYXZTZWxlY3RvcjogJy5zdGF0cy10YWJzJyxcclxuICAgICAgICBjb250ZW50U2VsZWN0b3I6ICcuc3RhdHMtYm9keScsXHJcbiAgICAgICAgaW5pdGlhbDogJ2FkdmFuY2VtZW50J1xyXG4gICAgICB9XSxcclxuICAgICAgc2Nyb2xsWTogW1xyXG4gICAgICAgICcudGFiLmludmVudG9yeSAuaW52ZW50b3J5LWxpc3QnLFxyXG4gICAgICAgICcudGFiLmludmVudG9yeSAuaW52ZW50b3J5LWluZm8nLFxyXG4gICAgICBdXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY29ycmVjdCBIVE1MIHRlbXBsYXRlIHBhdGggdG8gdXNlIGZvciByZW5kZXJpbmcgdGhpcyBwYXJ0aWN1bGFyIHNoZWV0XHJcbiAgICogQHR5cGUge1N0cmluZ31cclxuICAgKi9cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcclxuICAgIHJldHVybiBgc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvJHt0eXBlfS1zaGVldC5odG1sYDtcclxuICB9XHJcblxyXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4gIF9wY0luaXQoKSB7XHJcbiAgICB0aGlzLnNraWxsc1Bvb2xGaWx0ZXIgPSAtMTtcclxuICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSAtMTtcclxuICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IC0xO1xyXG4gICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IC0xO1xyXG4gICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgX25wY0luaXQoKSB7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuXHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlICdwYyc6XHJcbiAgICAgICAgdGhpcy5fcGNJbml0KCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ25wYyc6XHJcbiAgICAgICAgdGhpcy5fbnBjSW5pdCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgdHlwZSwgZmllbGQpIHtcclxuICAgIGNvbnN0IGl0ZW1zID0gZGF0YS5kYXRhLml0ZW1zO1xyXG4gICAgaWYgKCFpdGVtc1tmaWVsZF0pIHtcclxuICAgICAgaXRlbXNbZmllbGRdID0gaXRlbXMuZmlsdGVyKGkgPT4gaS50eXBlID09PSB0eXBlKTsgLy8uc29ydChzb3J0RnVuY3Rpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2ZpbHRlckl0ZW1EYXRhKGRhdGEsIGl0ZW1GaWVsZCwgZmlsdGVyRmllbGQsIGZpbHRlclZhbHVlKSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcclxuICAgIGl0ZW1zW2l0ZW1GaWVsZF0gPSBpdGVtc1tpdGVtRmllbGRdLmZpbHRlcihpdG0gPT4gZGVlcFByb3AoaXRtLCBmaWx0ZXJGaWVsZCkgPT09IGZpbHRlclZhbHVlKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9za2lsbERhdGEoZGF0YSkge1xyXG4gICAgdGhpcy5fZ2VuZXJhdGVJdGVtRGF0YShkYXRhLCAnc2tpbGwnLCAnc2tpbGxzJyk7XHJcblxyXG4gICAgZGF0YS5za2lsbHNQb29sRmlsdGVyID0gdGhpcy5za2lsbHNQb29sRmlsdGVyO1xyXG4gICAgZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXI7XHJcblxyXG4gICAgaWYgKGRhdGEuc2tpbGxzUG9vbEZpbHRlciA+IC0xKSB7XHJcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdza2lsbHMnLCAnZGF0YS5wb29sJywgcGFyc2VJbnQoZGF0YS5za2lsbHNQb29sRmlsdGVyLCAxMCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPiAtMSkge1xyXG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ2RhdGEudHJhaW5pbmcnLCBwYXJzZUludChkYXRhLnNraWxsc1RyYWluaW5nRmlsdGVyLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuc2VsZWN0ZWRTa2lsbCA9IHRoaXMuc2VsZWN0ZWRTa2lsbDtcclxuICAgIGRhdGEuc2tpbGxJbmZvID0gJyc7XHJcbiAgICBpZiAoZGF0YS5zZWxlY3RlZFNraWxsKSB7XHJcbiAgICAgIGRhdGEuc2tpbGxJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZFNraWxsLmdldEluZm8oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIF9hYmlsaXR5RGF0YShkYXRhKSB7XHJcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdhYmlsaXR5JywgJ2FiaWxpdGllcycpO1xyXG5cclxuICAgIGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPSB0aGlzLmFiaWxpdHlQb29sRmlsdGVyO1xyXG5cclxuICAgIGlmIChkYXRhLmFiaWxpdHlQb29sRmlsdGVyID4gLTEpIHtcclxuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ2FiaWxpdGllcycsICdkYXRhLmNvc3QucG9vbCcsIHBhcnNlSW50KGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIsIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZEFiaWxpdHkgPSB0aGlzLnNlbGVjdGVkQWJpbGl0eTtcclxuICAgIGRhdGEuYWJpbGl0eUluZm8gPSAnJztcclxuICAgIGlmIChkYXRhLnNlbGVjdGVkQWJpbGl0eSkge1xyXG4gICAgICBkYXRhLmFiaWxpdHlJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZEFiaWxpdHkuZ2V0SW5mbygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2ludmVudG9yeURhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5pbnZlbnRvcnlUeXBlcyA9IENTUi5pbnZlbnRvcnlUeXBlcztcclxuXHJcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcclxuICAgIGlmICghaXRlbXMuaW52ZW50b3J5KSB7XHJcbiAgICAgIGl0ZW1zLmludmVudG9yeSA9IGl0ZW1zLmZpbHRlcihpID0+IENTUi5pbnZlbnRvcnlUeXBlcy5pbmNsdWRlcyhpLnR5cGUpKTtcclxuICAgICAgLy8gR3JvdXAgaXRlbXMgYnkgdGhlaXIgdHlwZVxyXG4gICAgICBpdGVtcy5pbnZlbnRvcnkuc29ydCgoYSwgYikgPT4gKGEudHlwZSA+IGIudHlwZSkgPyAxIDogLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuY3lwaGVyQ291bnQgPSBpdGVtcy5yZWR1Y2UoKGNvdW50LCBpKSA9PiBpLnR5cGUgPT09ICdjeXBoZXInID8gKytjb3VudCA6IGNvdW50LCAwKTtcclxuICAgIGRhdGEub3ZlckN5cGhlckxpbWl0ID0gdGhpcy5hY3Rvci5pc092ZXJDeXBoZXJMaW1pdDtcclxuXHJcbiAgICBkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIgPSB0aGlzLmludmVudG9yeVR5cGVGaWx0ZXI7XHJcblxyXG4gICAgaWYgKGRhdGEuaW52ZW50b3J5VHlwZUZpbHRlciA+IC0xKSB7XHJcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdpbnZlbnRvcnknLCAndHlwZScsIENTUi5pbnZlbnRvcnlUeXBlc1twYXJzZUludChkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIsIDEwKV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuc2VsZWN0ZWRJbnZJdGVtID0gdGhpcy5zZWxlY3RlZEludkl0ZW07XHJcbiAgICBkYXRhLmludkl0ZW1JbmZvID0gJyc7XHJcbiAgICBpZiAoZGF0YS5zZWxlY3RlZEludkl0ZW0pIHtcclxuICAgICAgZGF0YS5pbnZJdGVtSW5mbyA9IGF3YWl0IGRhdGEuc2VsZWN0ZWRJbnZJdGVtLmdldEluZm8oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIF9wY0RhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5pc0dNID0gZ2FtZS51c2VyLmlzR007XHJcblxyXG4gICAgZGF0YS5jdXJyZW5jeU5hbWUgPSBnYW1lLnNldHRpbmdzLmdldCgnY3lwaGVyc3lzdGVtQ2xlYW4nLCAnY3VycmVuY3lOYW1lJyk7XHJcblxyXG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xyXG4gICAgZGF0YS5zdGF0cyA9IENTUi5zdGF0cztcclxuICAgIGRhdGEud2VhcG9uVHlwZXMgPSBDU1Iud2VhcG9uVHlwZXM7XHJcbiAgICBkYXRhLndlaWdodHMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcclxuXHJcbiAgICBkYXRhLmFkdmFuY2VzID0gT2JqZWN0LmVudHJpZXMoZGF0YS5hY3Rvci5kYXRhLmFkdmFuY2VzKS5tYXAoXHJcbiAgICAgIChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgbmFtZToga2V5LFxyXG4gICAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZShgQ1NSLmFkdmFuY2UuJHtrZXl9YCksXHJcbiAgICAgICAgICBpc0NoZWNrZWQ6IHZhbHVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgZGF0YS5kYW1hZ2VUcmFja0RhdGEgPSBDU1IuZGFtYWdlVHJhY2s7XHJcbiAgICBkYXRhLmRhbWFnZVRyYWNrID0gQ1NSLmRhbWFnZVRyYWNrW2RhdGEuZGF0YS5kYW1hZ2VUcmFja107XHJcblxyXG4gICAgZGF0YS5yZWNvdmVyaWVzRGF0YSA9IE9iamVjdC5lbnRyaWVzKFxyXG4gICAgICBkYXRhLmFjdG9yLmRhdGEucmVjb3Zlcmllc1xyXG4gICAgKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGtleSxcclxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IucmVjb3ZlcnkuJHtrZXl9YCksXHJcbiAgICAgICAgY2hlY2tlZDogdmFsdWUsXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICBkYXRhLnRyYWluaW5nTGV2ZWxzID0gQ1NSLnRyYWluaW5nTGV2ZWxzO1xyXG5cclxuICAgIGRhdGEuZGF0YS5pdGVtcyA9IGRhdGEuYWN0b3IuaXRlbXMgfHwge307XHJcblxyXG4gICAgYXdhaXQgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xyXG4gICAgYXdhaXQgdGhpcy5fYWJpbGl0eURhdGEoZGF0YSk7XHJcbiAgICBhd2FpdCB0aGlzLl9pbnZlbnRvcnlEYXRhKGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX25wY0RhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGFzeW5jIGdldERhdGEoKSB7XHJcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xyXG4gICAgXHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlICdwYyc6XHJcbiAgICAgICAgYXdhaXQgdGhpcy5fcGNEYXRhKGRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICducGMnOlxyXG4gICAgICAgIGF3YWl0IHRoaXMuX25wY0RhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICBfY3JlYXRlSXRlbShpdGVtTmFtZSkge1xyXG4gICAgY29uc3QgaXRlbURhdGEgPSB7XHJcbiAgICAgIG5hbWU6IGBOZXcgJHtpdGVtTmFtZS5jYXBpdGFsaXplKCl9YCxcclxuICAgICAgdHlwZTogaXRlbU5hbWUsXHJcbiAgICAgIGRhdGE6IG5ldyBDeXBoZXJTeXN0ZW1JdGVtKHt9KSxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hY3Rvci5jcmVhdGVPd25lZEl0ZW0oaXRlbURhdGEsIHsgcmVuZGVyU2hlZXQ6IHRydWUgfSk7XHJcbiAgfVxyXG5cclxuICBfcm9sbFBvb2xEaWFsb2cocG9vbCkge1xyXG4gICAgY29uc3QgeyBhY3RvciB9ID0gdGhpcztcclxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcclxuICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xyXG5cclxuICAgIGN5cGhlclJvbGwoe1xyXG4gICAgICBwYXJ0czogWycxZDIwJ10sXHJcblxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcG9vbCxcclxuICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnQsXHJcbiAgICAgIH0sXHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBcclxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucG9vbC50aXRsZScpLFxyXG4gICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucG9vbC5mbGF2b3InKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5uYW1lKS5yZXBsYWNlKCcjI1BPT0wjIycsIHBvb2xOYW1lKSxcclxuXHJcbiAgICAgIGFjdG9yLFxyXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIF9yb2xsUmVjb3ZlcnkoKSB7XHJcbiAgICBjb25zdCB7IGFjdG9yIH0gPSB0aGlzO1xyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xyXG5cclxuICAgIGNvbnN0IHJvbGwgPSBuZXcgUm9sbChgMWQ2KyR7YWN0b3JEYXRhLnJlY292ZXJ5TW9kfWApLnJvbGwoKTtcclxuXHJcbiAgICAvLyBGbGFnIHRoZSByb2xsIGFzIGEgcmVjb3Zlcnkgcm9sbFxyXG4gICAgcm9sbC5kaWNlWzBdLm9wdGlvbnMucmVjb3ZlcnkgPSB0cnVlO1xyXG5cclxuICAgIHJvbGwudG9NZXNzYWdlKHtcclxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucmVjb3ZlcnkudGl0bGUnKSxcclxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxyXG4gICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwucmVjb3ZlcnkuZmxhdm9yJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IubmFtZSksXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIF9kZWxldGVJdGVtRGlhbG9nKGl0ZW1JZCwgY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IGNvbmZpcm1hdGlvbkRpYWxvZyA9IG5ldyBEaWFsb2coe1xyXG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5kZWxldGUudGl0bGVcIiksXHJcbiAgICAgIGNvbnRlbnQ6IGA8cD4ke2dhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlLmNvbnRlbnRcIil9PC9wPjxociAvPmAsXHJcbiAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICBjb25maXJtOiB7XHJcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcclxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmJ1dHRvbi5kZWxldGVcIiksXHJcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFjdG9yLmRlbGV0ZU93bmVkSXRlbShpdGVtSWQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPicsXHJcbiAgICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5idXR0b24uY2FuY2VsXCIpLFxyXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkZWZhdWx0OiBcImNhbmNlbFwiXHJcbiAgICB9KTtcclxuICAgIGNvbmZpcm1hdGlvbkRpYWxvZy5yZW5kZXIodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBfc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgLy8gU3RhdHMgU2V0dXBcclxuICAgIGh0bWwuZmluZCgnLnJvbGwtcG9vbCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcclxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0LnBvb2wpIHtcclxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgeyBwb29sIH0gPSBlbC5kYXRhc2V0O1xyXG5cclxuICAgICAgdGhpcy5fcm9sbFBvb2xEaWFsb2cocGFyc2VJbnQocG9vbCwgMTApKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmRhbWFnZVRyYWNrXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJy5yZWNvdmVyeS1yb2xsJykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9yb2xsUmVjb3ZlcnkoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX3NraWxsc1RhYkxpc3RlbmVycyhodG1sKSB7XHJcbiAgICAvLyBTa2lsbHMgU2V0dXBcclxuICAgIGh0bWwuZmluZCgnLmFkZC1za2lsbCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnc2tpbGwnKTtcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBjb25zdCBza2lsbHNQb29sRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInNraWxsc1Bvb2xGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gICAgc2tpbGxzUG9vbEZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5za2lsbHNQb29sRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNraWxsc1RyYWluaW5nRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInNraWxsc1RyYWluaW5nRmlsdGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICAgIHNraWxsc1RyYWluaW5nRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLnNraWxsc1RyYWluaW5nRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNraWxscyA9IGh0bWwuZmluZCgnYS5za2lsbCcpO1xyXG5cclxuICAgIHNraWxscy5vbignY2xpY2snLCBldnQgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHRoaXMuX29uU3VibWl0KGV2dCk7XHJcblxyXG4gICAgICBsZXQgZWwgPSBldnQudGFyZ2V0O1xyXG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcclxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0LmlkKSB7XHJcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHNraWxsSWQgPSBlbC5kYXRhc2V0LmlkO1xyXG5cclxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xyXG4gICAgICBjb25zdCBza2lsbCA9IGFjdG9yLmdldE93bmVkSXRlbShza2lsbElkKTtcclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IHNraWxsO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgeyBzZWxlY3RlZFNraWxsIH0gPSB0aGlzO1xyXG4gICAgaWYgKHNlbGVjdGVkU2tpbGwpIHtcclxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAucm9sbCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHNlbGVjdGVkU2tpbGwucm9sbCgpO1xyXG4gICAgICAgIC8vIHRoaXMuX3JvbGxJdGVtRGlhbG9nKHNlbGVjdGVkU2tpbGwuZGF0YS5kYXRhLnBvb2wpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGh0bWwuZmluZCgnLnNraWxsLWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkU2tpbGwuc2hlZXQucmVuZGVyKHRydWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGh0bWwuZmluZCgnLnNraWxsLWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZFNraWxsLl9pZCwgZGlkRGVsZXRlID0+IHtcclxuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfYWJpbGl0eVRhYkxpc3RlbmVycyhodG1sKSB7XHJcbiAgICAvLyBBYmlsaXRpZXMgU2V0dXBcclxuICAgIGh0bWwuZmluZCgnLmFkZC1hYmlsaXR5JykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9jcmVhdGVJdGVtKCdhYmlsaXR5Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBhYmlsaXR5UG9vbEZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJhYmlsaXR5UG9vbEZpbHRlclwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMzBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgICBhYmlsaXR5UG9vbEZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFiaWxpdGllcyA9IGh0bWwuZmluZCgnYS5hYmlsaXR5Jyk7XHJcblxyXG4gICAgYWJpbGl0aWVzLm9uKCdjbGljaycsIGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcclxuXHJcbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XHJcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxyXG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQuaWQpIHtcclxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgYWJpbGl0eUlkID0gZWwuZGF0YXNldC5pZDtcclxuXHJcbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcclxuICAgICAgY29uc3QgYWJpbGl0eSA9IGFjdG9yLmdldE93bmVkSXRlbShhYmlsaXR5SWQpO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBhYmlsaXR5O1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgeyBzZWxlY3RlZEFiaWxpdHkgfSA9IHRoaXM7XHJcbiAgICBpZiAoc2VsZWN0ZWRBYmlsaXR5KSB7XHJcbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAucm9sbCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHNlbGVjdGVkQWJpbGl0eS5yb2xsKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaHRtbC5maW5kKCcuYWJpbGl0eS1pbmZvIC5hY3Rpb25zIC5lZGl0JykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkuc2hlZXQucmVuZGVyKHRydWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAuZGVsZXRlJykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGVsZXRlSXRlbURpYWxvZyh0aGlzLnNlbGVjdGVkQWJpbGl0eS5faWQsIGRpZERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gbnVsbDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfaW52ZW50b3J5VGFiTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIC8vIEludmVudG9yeSBTZXR1cFxyXG5cclxuICAgIGNvbnN0IGN0eHRNZW51RWwgPSBodG1sLmZpbmQoJy5jb250ZXh0bWVudScpO1xyXG4gICAgY29uc3QgYWRkSW52QnRuID0gaHRtbC5maW5kKCcuYWRkLWludmVudG9yeScpO1xyXG5cclxuICAgIGNvbnN0IG1lbnVJdGVtcyA9IFtdO1xyXG4gICAgQ1NSLmludmVudG9yeVR5cGVzLmZvckVhY2godHlwZSA9PiB7XHJcbiAgICAgIG1lbnVJdGVtcy5wdXNoKHtcclxuICAgICAgICBuYW1lOiBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi5pbnZlbnRvcnkuJHt0eXBlfWApLFxyXG4gICAgICAgIGljb246ICcnLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLl9jcmVhdGVJdGVtKHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGN0eHRNZW51T2JqID0gbmV3IENvbnRleHRNZW51KGh0bWwsICcuYWN0aXZlJywgbWVudUl0ZW1zKTtcclxuICAgIFxyXG4gICAgYWRkSW52QnRuLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgLy8gQSBiaXQgb2YgYSBoYWNrIHRvIGVuc3VyZSB0aGUgY29udGV4dCBtZW51IGlzbid0XHJcbiAgICAgIC8vIGN1dCBvZmYgZHVlIHRvIHRoZSBzaGVldCdzIGNvbnRlbnQgcmVseWluZyBvblxyXG4gICAgICAvLyBvdmVyZmxvdyBoaWRkZW4uIEluc3RlYWQsIHdlIG5lc3QgdGhlIG1lbnUgaW5zaWRlXHJcbiAgICAgIC8vIGEgZmxvYXRpbmcgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGRpdiwgc2V0IHRvIG92ZXJsYXBcclxuICAgICAgLy8gdGhlIGFkZCBpbnZlbnRvcnkgaXRlbSBpY29uLlxyXG4gICAgICBjdHh0TWVudUVsLm9mZnNldChhZGRJbnZCdG4ub2Zmc2V0KCkpO1xyXG5cclxuICAgICAgY3R4dE1lbnVPYmoucmVuZGVyKGN0eHRNZW51RWwuZmluZCgnLmNvbnRhaW5lcicpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGh0bWwub24oJ21vdXNlZG93bicsIGV2dCA9PiB7XHJcbiAgICAgIGlmIChldnQudGFyZ2V0ID09PSBhZGRJbnZCdG5bMF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENsb3NlIHRoZSBjb250ZXh0IG1lbnUgaWYgdXNlciBjbGlja3MgYW55d2hlcmUgZWxzZVxyXG4gICAgICBjdHh0TWVudU9iai5jbG9zZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaW52ZW50b3J5VHlwZUZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJpbnZlbnRvcnlUeXBlRmlsdGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICAgIGludmVudG9yeVR5cGVGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGludkl0ZW1zID0gaHRtbC5maW5kKCdhLmludi1pdGVtJyk7XHJcblxyXG4gICAgaW52SXRlbXMub24oJ2NsaWNrJywgZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xyXG5cclxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcclxuICAgICAgLy8gQWNjb3VudCBmb3IgY2xpY2tpbmcgYSBjaGlsZCBlbGVtZW50XHJcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pZCkge1xyXG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbnZJdGVtSWQgPSBlbC5kYXRhc2V0LmlkO1xyXG5cclxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xyXG4gICAgICBjb25zdCBpbnZJdGVtID0gYWN0b3IuZ2V0T3duZWRJdGVtKGludkl0ZW1JZCk7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IGludkl0ZW07XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB7IHNlbGVjdGVkSW52SXRlbSB9ID0gdGhpcztcclxuICAgIGlmIChzZWxlY3RlZEludkl0ZW0pIHtcclxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbS5zaGVldC5yZW5kZXIodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEludkl0ZW0uX2lkLCBkaWREZWxldGUgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX3BjTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuYWN0b3InKS5hZGRDbGFzcygncGMtd2luZG93Jyk7XHJcblxyXG4gICAgLy8gSGFjaywgZm9yIHNvbWUgcmVhc29uIHRoZSBpbm5lciB0YWIncyBjb250ZW50IGRvZXNuJ3Qgc2hvdyBcclxuICAgIC8vIHdoZW4gY2hhbmdpbmcgcHJpbWFyeSB0YWJzIHdpdGhpbiB0aGUgc2hlZXRcclxuICAgIGh0bWwuZmluZCgnLml0ZW1bZGF0YS10YWI9XCJzdGF0c1wiXScpLmNsaWNrKCgpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJUYWIgPSBodG1sLmZpbmQoJy5zdGF0cy10YWJzIC5pdGVtLmFjdGl2ZScpLmZpcnN0KCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkU3ViUGFnZSA9IGh0bWwuZmluZChgLnN0YXRzLWJvZHkgLnRhYltkYXRhLXRhYj1cIiR7c2VsZWN0ZWRTdWJUYWIuZGF0YSgndGFiJyl9XCJdYCk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzZWxlY3RlZFN1YlBhZ2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3N0YXRzVGFiTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgdGhpcy5fc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgdGhpcy5fYWJpbGl0eVRhYkxpc3RlbmVycyhodG1sKTtcclxuICAgIHRoaXMuX2ludmVudG9yeVRhYkxpc3RlbmVycyhodG1sKTtcclxuICB9XHJcblxyXG4gIF9ucGNMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5hY3RvcicpLmFkZENsYXNzKCducGMtd2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEubW92ZW1lbnRcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmVkaXRhYmxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuYWN0b3IuZGF0YTtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlICdwYyc6XHJcbiAgICAgICAgdGhpcy5fcGNMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ25wYyc6XHJcbiAgICAgICAgdGhpcy5fbnBjTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvKiBnbG9iYWwgQWN0b3I6ZmFsc2UgKi9cclxuXHJcbmltcG9ydCB7IENTUiB9IGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmltcG9ydCB7IHZhbE9yRGVmYXVsdCB9IGZyb20gJy4uL3V0aWxzLmpzJztcclxuXHJcbmltcG9ydCB7IFBsYXllckNob2ljZURpYWxvZyB9IGZyb20gJy4uL2RpYWxvZy9wbGF5ZXItY2hvaWNlLWRpYWxvZy5qcyc7XHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4uL2VudW1zL2VudW0tcG9vbC5qcyc7XHJcblxyXG4vKipcclxuICogRXh0ZW5kIHRoZSBiYXNlIEFjdG9yIGVudGl0eSBieSBkZWZpbmluZyBhIGN1c3RvbSByb2xsIGRhdGEgc3RydWN0dXJlIHdoaWNoIGlzIGlkZWFsIGZvciB0aGUgU2ltcGxlIHN5c3RlbS5cclxuICogQGV4dGVuZHMge0FjdG9yfVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUFjdG9yIGV4dGVuZHMgQWN0b3Ige1xyXG4gIC8qKlxyXG4gICAqIFByZXBhcmUgQ2hhcmFjdGVyIHR5cGUgc3BlY2lmaWMgZGF0YVxyXG4gICAqL1xyXG4gIF9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBhY3RvckRhdGE7XHJcblxyXG4gICAgZGF0YS5zZW50ZW5jZSA9IHZhbE9yRGVmYXVsdChkYXRhLnNlbnRlbmNlLCB7XHJcbiAgICAgIGRlc2NyaXB0b3I6ICcnLFxyXG4gICAgICB0eXBlOiAnJyxcclxuICAgICAgZm9jdXM6ICcnXHJcbiAgICB9KTtcclxuXHJcbiAgICBkYXRhLnRpZXIgPSB2YWxPckRlZmF1bHQoZGF0YS50aWVyLCAxKTtcclxuICAgIGRhdGEuZWZmb3J0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmb3J0LCAxKTtcclxuICAgIGRhdGEueHAgPSB2YWxPckRlZmF1bHQoZGF0YS54cCwgMCk7XHJcbiAgICBkYXRhLmN5cGhlckxpbWl0ID0gdmFsT3JEZWZhdWx0KGRhdGEuY3lwaGVyTGltaXQsIDEpO1xyXG5cclxuICAgIGRhdGEuYWR2YW5jZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5hZHZhbmNlcywge1xyXG4gICAgICBzdGF0czogZmFsc2UsXHJcbiAgICAgIGVkZ2U6IGZhbHNlLFxyXG4gICAgICBlZmZvcnQ6IGZhbHNlLFxyXG4gICAgICBza2lsbHM6IGZhbHNlLFxyXG4gICAgICBvdGhlcjogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIGRhdGEucmVjb3ZlcnlNb2QgPSB2YWxPckRlZmF1bHQoZGF0YS5yZWNvdmVyeU1vZCwgMSk7XHJcbiAgICBkYXRhLnJlY292ZXJpZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5yZWNvdmVyaWVzLCB7XHJcbiAgICAgIGFjdGlvbjogZmFsc2UsXHJcbiAgICAgIHRlbk1pbnM6IGZhbHNlLFxyXG4gICAgICBvbmVIb3VyOiBmYWxzZSxcclxuICAgICAgdGVuSG91cnM6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICBkYXRhLmRhbWFnZVRyYWNrID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlVHJhY2ssIDApO1xyXG4gICAgZGF0YS5hcm1vciA9IHZhbE9yRGVmYXVsdChkYXRhLmFybW9yLCAwKTtcclxuXHJcbiAgICBkYXRhLnN0YXRzID0gdmFsT3JEZWZhdWx0KGRhdGEuc3RhdHMsIHtcclxuICAgICAgbWlnaHQ6IHtcclxuICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICBwb29sOiAwLFxyXG4gICAgICAgIGVkZ2U6IDBcclxuICAgICAgfSxcclxuICAgICAgc3BlZWQ6IHtcclxuICAgICAgICB2YWx1ZTogMCxcclxuICAgICAgICBwb29sOiAwLFxyXG4gICAgICAgIGVkZ2U6IDBcclxuICAgICAgfSxcclxuICAgICAgaW50ZWxsZWN0OiB7XHJcbiAgICAgICAgdmFsdWU6IDAsXHJcbiAgICAgICAgcG9vbDogMCxcclxuICAgICAgICBlZGdlOiAwXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGRhdGEubW9uZXkgPSB2YWxPckRlZmF1bHQoZGF0YS5tb25leSwgMCk7XHJcbiAgfVxyXG5cclxuICBfcHJlcGFyZU5QQ0RhdGEoYWN0b3JEYXRhKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGFjdG9yRGF0YTtcclxuXHJcbiAgICBkYXRhLmxldmVsID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWwsIDEpO1xyXG5cclxuICAgIGRhdGEuaGVhbHRoID0gdmFsT3JEZWZhdWx0KGRhdGEuaGVhbHRoLCB7XHJcbiAgICAgIHZhbHVlOiAzLFxyXG4gICAgICBtYXg6IDNcclxuICAgIH0pO1xyXG4gICAgZGF0YS5kYW1hZ2UgPSB2YWxPckRlZmF1bHQoZGF0YS5kYW1hZ2UsIDEpO1xyXG4gICAgZGF0YS5hcm1vciA9IHZhbE9yRGVmYXVsdChkYXRhLmFybW9yLCAwKTtcclxuICAgIGRhdGEubW92ZW1lbnQgPSB2YWxPckRlZmF1bHQoZGF0YS5tb3ZlbWVudCwgMSk7XHJcblxyXG4gICAgZGF0YS5kZXNjcmlwdGlvbiA9IHZhbE9yRGVmYXVsdChkYXRhLmRlc2NyaXB0aW9uLCAnJyk7XHJcbiAgICBkYXRhLm1vdGl2ZSA9IHZhbE9yRGVmYXVsdChkYXRhLm1vdGl2ZSwgJycpO1xyXG4gICAgZGF0YS5tb2RpZmljYXRpb25zID0gdmFsT3JEZWZhdWx0KGRhdGEubW9kaWZpY2F0aW9ucywgJycpO1xyXG4gICAgZGF0YS5jb21iYXQgPSB2YWxPckRlZmF1bHQoZGF0YS5jb21iYXQsICcnKTtcclxuICAgIGRhdGEuaW50ZXJhY3Rpb24gPSB2YWxPckRlZmF1bHQoZGF0YS5pbnRlcmFjdGlvbiwgJycpO1xyXG4gICAgZGF0YS51c2UgPSB2YWxPckRlZmF1bHQoZGF0YS51c2UsICcnKTtcclxuICAgIGRhdGEubG9vdCA9IHZhbE9yRGVmYXVsdChkYXRhLmxvb3QsICcnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIGFjdG9yIGRhdGEgd2l0aCBhZGRpdGlvbmFsIGR5bmFtaWMgZGF0YS5cclxuICAgKi9cclxuICBwcmVwYXJlRGF0YSgpIHtcclxuICAgIHN1cGVyLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgZGF0YSA9IGFjdG9yRGF0YS5kYXRhO1xyXG4gICAgY29uc3QgZmxhZ3MgPSBhY3RvckRhdGEuZmxhZ3M7XHJcblxyXG4gICAgY29uc3QgeyB0eXBlIH0gPSBhY3RvckRhdGE7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAncGMnOlxyXG4gICAgICAgIHRoaXMuX3ByZXBhcmVQQ0RhdGEoYWN0b3JEYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnbnBjJzpcclxuICAgICAgICB0aGlzLl9wcmVwYXJlTlBDRGF0YShhY3RvckRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IGluaXRpYXRpdmVMZXZlbCgpIHtcclxuICAgIGNvbnN0IGluaXRTa2lsbCA9IHRoaXMuZGF0YS5pdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09ICdza2lsbCcgJiYgaS5kYXRhLmZsYWdzLmluaXRpYXRpdmUpWzBdO1xyXG4gICAgcmV0dXJuIGluaXRTa2lsbC5kYXRhLnRyYWluaW5nIC0gMTtcclxuICB9XHJcblxyXG4gIGdldCBjYW5SZWZ1c2VJbnRydXNpb24oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS54cCA+IDA7XHJcbiAgfVxyXG5cclxuICBnZXQgaXNPdmVyQ3lwaGVyTGltaXQoKSB7XHJcbiAgICBjb25zdCBjeXBoZXJzID0gdGhpcy5nZXRFbWJlZGRlZENvbGxlY3Rpb24oXCJPd25lZEl0ZW1cIikuZmlsdGVyKGkgPT4gaS50eXBlID09PSBcImN5cGhlclwiKTtcclxuICAgIHJldHVybiB0aGlzLmRhdGEuZGF0YS5jeXBoZXJMaW1pdCA8IGN5cGhlcnMubGVuZ3RoO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2tpbGxMZXZlbChza2lsbCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBza2lsbC5kYXRhO1xyXG5cclxuICAgIHJldHVybiBkYXRhLnRyYWluaW5nIC0gMTtcclxuICB9XHJcblxyXG4gIGdldEVmZm9ydENvc3RGcm9tU3RhdChwb29sLCBlZmZvcnRMZXZlbCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSB7XHJcbiAgICAgIGNvc3Q6IDAsXHJcbiAgICAgIGVmZm9ydExldmVsOiAwLFxyXG4gICAgICB3YXJuaW5nOiBudWxsLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZWZmb3J0TGV2ZWwgPT09IDApIHtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xyXG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XHJcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCldO1xyXG5cclxuICAgIC8vVGhlIGZpcnN0IGVmZm9ydCBsZXZlbCBjb3N0cyAzIHB0cyBmcm9tIHRoZSBwb29sLCBleHRyYSBsZXZlbHMgY29zdCAyXHJcbiAgICAvL1N1YnN0cmFjdCB0aGUgcmVsYXRlZCBFZGdlLCB0b29cclxuICAgIGNvbnN0IGF2YWlsYWJsZUVmZm9ydEZyb21Qb29sID0gKHN0YXQudmFsdWUgKyBzdGF0LmVkZ2UgLSAxKSAvIDI7XHJcblxyXG4gICAgLy9BIFBDIGNhbiB1c2UgYXMgbXVjaCBhcyB0aGVpciBFZmZvcnQgc2NvcmUsIGJ1dCBub3QgbW9yZVxyXG4gICAgLy9UaGV5J3JlIGFsc28gbGltaXRlZCBieSB0aGVpciBjdXJyZW50IHBvb2wgdmFsdWVcclxuICAgIGNvbnN0IGZpbmFsRWZmb3J0ID0gTWF0aC5taW4oZWZmb3J0TGV2ZWwsIGFjdG9yRGF0YS5lZmZvcnQsIGF2YWlsYWJsZUVmZm9ydEZyb21Qb29sKTtcclxuICAgIGNvbnN0IGNvc3QgPSAxICsgMiAqIGZpbmFsRWZmb3J0IC0gc3RhdC5lZGdlO1xyXG5cclxuICAgIC8vVE9ETyB0YWtlIGZyZWUgbGV2ZWxzIG9mIEVmZm9ydCBpbnRvIGFjY291bnQgaGVyZVxyXG5cclxuICAgIGxldCB3YXJuaW5nID0gbnVsbDtcclxuICAgIGlmIChlZmZvcnRMZXZlbCA+IGF2YWlsYWJsZUVmZm9ydEZyb21Qb29sKSB7XHJcbiAgICAgIHdhcm5pbmcgPSBgTm90IGVub3VnaCBwb2ludHMgaW4geW91ciAke3Bvb2xOYW1lfSBwb29sIGZvciB0aGF0IGxldmVsIG9mIEVmZm9ydGA7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWUuY29zdCA9IGNvc3Q7XHJcbiAgICB2YWx1ZS5lZmZvcnRMZXZlbCA9IGZpbmFsRWZmb3J0O1xyXG4gICAgdmFsdWUud2FybmluZyA9IHdhcm5pbmc7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQsIGFwcGx5RWRnZSA9IHRydWUpIHtcclxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xyXG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF0udG9Mb3dlckNhc2UoKTtcclxuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWVdO1xyXG4gICAgY29uc3QgcG9vbEFtb3VudCA9IHN0YXQudmFsdWU7XHJcblxyXG4gICAgcmV0dXJuIChhcHBseUVkZ2UgPyBhbW91bnQgLSBzdGF0LmVkZ2UgOiBhbW91bnQpIDw9IHBvb2xBbW91bnQ7XHJcbiAgfVxyXG5cclxuICBzcGVuZEZyb21Qb29sKHBvb2wsIGFtb3VudCkge1xyXG4gICAgaWYgKCF0aGlzLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50KSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XHJcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWUudG9Mb3dlckNhc2UoKV07XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IHt9O1xyXG4gICAgZGF0YVtgZGF0YS5zdGF0cy4ke3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCl9LnZhbHVlYF0gPSBNYXRoLm1heCgwLCBzdGF0LnZhbHVlIC0gYW1vdW50KTtcclxuICAgIHRoaXMudXBkYXRlKGRhdGEpO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgb25HTUludHJ1c2lvbihhY2NlcHRlZCkge1xyXG4gICAgbGV0IHhwID0gdGhpcy5kYXRhLmRhdGEueHA7XHJcbiAgICBcclxuICAgIGxldCBjaGF0Q29udGVudCA9IGA8aDI+JHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnRydXNpb24uY2hhdC5oZWFkaW5nJyl9PC9oMj48YnI+YDtcclxuICAgIGlmIChhY2NlcHRlZCkge1xyXG4gICAgICB4cCsrO1xyXG5cclxuICAgICAgY2hhdENvbnRlbnQgKz0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW50cnVzaW9uLmNoYXQuYWNjZXB0JykucmVwbGFjZSgnIyNBQ1RPUiMjJywgdGhpcy5kYXRhLm5hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgeHAtLTtcclxuXHJcbiAgICAgIGNoYXRDb250ZW50ICs9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludHJ1c2lvbi5jaGF0LnJlZnVzZScpLnJlcGxhY2UoJyMjQUNUT1IjIycsIHRoaXMuZGF0YS5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZSh7XHJcbiAgICAgIF9pZDogdGhpcy5faWQsXHJcbiAgICAgICdkYXRhLnhwJzogeHAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xyXG4gICAgICBjb250ZW50OiBjaGF0Q29udGVudFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGFjY2VwdGVkKSB7XHJcbiAgICAgIGNvbnN0IG90aGVyQWN0b3JzID0gZ2FtZS5hY3RvcnMuZmlsdGVyKGFjdG9yID0+IGFjdG9yLl9pZCAhPT0gdGhpcy5faWQgJiYgYWN0b3IuZGF0YS50eXBlID09PSAncGMnKTtcclxuXHJcbiAgICAgIGNvbnN0IGRpYWxvZyA9IG5ldyBQbGF5ZXJDaG9pY2VEaWFsb2cob3RoZXJBY3RvcnMsIChjaG9zZW5BY3RvcklkKSA9PiB7XHJcbiAgICAgICAgZ2FtZS5zb2NrZXQuZW1pdCgnc3lzdGVtLmN5cGhlcnN5c3RlbUNsZWFuJywge1xyXG4gICAgICAgICAgdHlwZTogJ2F3YXJkWFAnLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBhY3RvcklkOiBjaG9zZW5BY3RvcklkLFxyXG4gICAgICAgICAgICB4cEFtb3VudDogMVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgICBkaWFsb2cucmVuZGVyKHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQG92ZXJyaWRlXHJcbiAgICovXHJcbiAgYXN5bmMgY3JlYXRlRW1iZWRkZWRFbnRpdHkoLi4uYXJncykge1xyXG4gICAgY29uc3QgW18sIGRhdGFdID0gYXJncztcclxuXHJcbiAgICAvLyBSb2xsIHRoZSBcImxldmVsIGRpZVwiIHRvIGRldGVybWluZSB0aGUgaXRlbSdzIGxldmVsLCBpZiBwb3NzaWJsZVxyXG4gICAgaWYgKGRhdGEuZGF0YSAmJiBDU1IuaGFzTGV2ZWxEaWUuaW5jbHVkZXMoZGF0YS50eXBlKSkge1xyXG4gICAgICBjb25zdCBpdGVtRGF0YSA9IGRhdGEuZGF0YTtcclxuXHJcbiAgICAgIGlmICghaXRlbURhdGEubGV2ZWwgJiYgaXRlbURhdGEubGV2ZWxEaWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgLy8gU2VlIGlmIHRoZSBmb3JtdWxhIGlzIHZhbGlkXHJcbiAgICAgICAgICBpdGVtRGF0YS5sZXZlbCA9IG5ldyBSb2xsKGl0ZW1EYXRhLmxldmVsRGllKS5yb2xsKCkudG90YWw7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIF9pZDogdGhpcy5faWQsXHJcbiAgICAgICAgICAgIFwiZGF0YS5sZXZlbFwiOiBpdGVtRGF0YS5sZXZlbCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIC8vIElmIG5vdCwgZmFsbGJhY2sgdG8gc2FuZSBkZWZhdWx0XHJcbiAgICAgICAgICBpdGVtRGF0YS5sZXZlbCA9IGl0ZW1EYXRhLmxldmVsIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW1EYXRhLmxldmVsID0gaXRlbURhdGEubGV2ZWwgfHwgbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdXBlci5jcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcm9sbFRleHQgfSBmcm9tICcuL3JvbGxzLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJDaGF0TWVzc2FnZShjaGF0TWVzc2FnZSwgaHRtbCwgZGF0YSkge1xyXG4gIC8vIERvbid0IGFwcGx5IENoYXRNZXNzYWdlIGVuaGFuY2VtZW50IHRvIHJlY292ZXJ5IHJvbGxzXHJcbiAgaWYgKGNoYXRNZXNzYWdlLnJvbGwgJiYgIWNoYXRNZXNzYWdlLnJvbGwuZGljZVswXS5vcHRpb25zLnJlY292ZXJ5KSB7XHJcbiAgICBjb25zdCBkaWVSb2xsID0gY2hhdE1lc3NhZ2Uucm9sbC5kaWNlWzBdLnJvbGxzWzBdLnJvbGw7XHJcbiAgICBjb25zdCByb2xsVG90YWwgPSBjaGF0TWVzc2FnZS5yb2xsLnRvdGFsO1xyXG4gICAgY29uc3QgbWVzc2FnZXMgPSByb2xsVGV4dChkaWVSb2xsLCByb2xsVG90YWwpO1xyXG4gICAgY29uc3QgbnVtTWVzc2FnZXMgPSBtZXNzYWdlcy5sZW5ndGg7XHJcblxyXG4gICAgY29uc3QgbWVzc2FnZUNvbnRhaW5lciA9ICQoJzxkaXYvPicpO1xyXG4gICAgbWVzc2FnZUNvbnRhaW5lci5hZGRDbGFzcygnc3BlY2lhbC1tZXNzYWdlcycpO1xyXG5cclxuICAgIG1lc3NhZ2VzLmZvckVhY2goKHNwZWNpYWwsIGlkeCkgPT4ge1xyXG4gICAgICBjb25zdCB7IHRleHQsIGNvbG9yLCBjbHMgfSA9IHNwZWNpYWw7XHJcblxyXG4gICAgICBjb25zdCBuZXdDb250ZW50ID0gYDxzcGFuIGNsYXNzPVwiJHtjbHN9XCIgc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj4ke3RleHR9PC9zcGFuPiR7aWR4IDwgbnVtTWVzc2FnZXMgLSAxID8gJzxiciAvPicgOiAnJ31gO1xyXG5cclxuICAgICAgbWVzc2FnZUNvbnRhaW5lci5hcHBlbmQobmV3Q29udGVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBkdCA9IGh0bWwuZmluZChcIi5kaWNlLXRvdGFsXCIpO1xyXG4gICAgbWVzc2FnZUNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZHQpO1xyXG4gIH1cclxufVxyXG4iLCIvKipcclxuICogUm9sbCBpbml0aWF0aXZlIGZvciBvbmUgb3IgbXVsdGlwbGUgQ29tYmF0YW50cyB3aXRoaW4gdGhlIENvbWJhdCBlbnRpdHlcclxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGlkcyAgICAgICAgQSBDb21iYXRhbnQgaWQgb3IgQXJyYXkgb2YgaWRzIGZvciB3aGljaCB0byByb2xsXHJcbiAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGZvcm11bGEgICAgIEEgbm9uLWRlZmF1bHQgaW5pdGlhdGl2ZSBmb3JtdWxhIHRvIHJvbGwuIE90aGVyd2lzZSB0aGUgc3lzdGVtIGRlZmF1bHQgaXMgdXNlZC5cclxuICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2VPcHRpb25zICAgQWRkaXRpb25hbCBvcHRpb25zIHdpdGggd2hpY2ggdG8gY3VzdG9taXplIGNyZWF0ZWQgQ2hhdCBNZXNzYWdlc1xyXG4gKiBAcmV0dXJuIHtQcm9taXNlLjxDb21iYXQ+fSAgICAgICBBIHByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgdG8gdGhlIHVwZGF0ZWQgQ29tYmF0IGVudGl0eSBvbmNlIHVwZGF0ZXMgYXJlIGNvbXBsZXRlLlxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJvbGxJbml0aWF0aXZlKGlkcywgZm9ybXVsYSA9IG51bGwsIG1lc3NhZ2VPcHRpb25zID0ge30pIHtcclxuICBjb25zdCBjb21iYXRhbnRVcGRhdGVzID0gW107XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBbXVxyXG5cclxuICAvLyBGb3JjZSBpZHMgdG8gYmUgYW4gYXJyYXkgc28gb3VyIGZvciBsb29wIGRvZXNuJ3QgYnJlYWtcclxuICBpZHMgPSB0eXBlb2YgaWRzID09PSAnc3RyaW5nJyA/IFtpZHNdIDogaWRzO1xyXG4gIGZvciAobGV0IGlkIG9mIGlkcykge1xyXG4gICAgY29uc3QgY29tYmF0YW50ID0gYXdhaXQgdGhpcy5nZXRDb21iYXRhbnQoaWQpO1xyXG4gICAgaWYgKGNvbWJhdGFudC5kZWZlYXRlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyBhY3RvciB9ID0gY29tYmF0YW50O1xyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YTtcclxuICAgIGNvbnN0IHsgdHlwZSB9ID0gYWN0b3JEYXRhO1xyXG5cclxuICAgIGxldCBpbml0aWF0aXZlO1xyXG4gICAgbGV0IHJvbGxSZXN1bHQ7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgLy8gUENzIHVzZSBhIHNpbXBsZSBkMjAgcm9sbCBtb2RpZmllZCBieSBhbnkgdHJhaW5pbmcgaW4gYW4gSW5pdGlhdGl2ZSBza2lsbFxyXG4gICAgICBjYXNlICdwYyc6XHJcbiAgICAgICAgY29uc3QgaW5pdEJvbnVzID0gYWN0b3IuaW5pdGlhdGl2ZUxldmVsO1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdG9yID0gaW5pdEJvbnVzIDwgMCA/ICctJyA6ICcrJztcclxuICAgICAgICBjb25zdCByb2xsRm9ybXVsYSA9ICcxZDIwJyArIChpbml0Qm9udXMgPT09IDAgPyAnJyA6IGAke29wZXJhdG9yfSR7MypNYXRoLmFicyhpbml0Qm9udXMpfWApO1xyXG5cclxuICAgICAgICBjb25zdCByb2xsID0gbmV3IFJvbGwocm9sbEZvcm11bGEpLnJvbGwoKTtcclxuICAgICAgICBpbml0aWF0aXZlID0gTWF0aC5tYXgocm9sbC50b3RhbCwgMCk7IC8vIERvbid0IGxldCBpbml0aWF0aXZlIGdvIGJlbG93IDBcclxuICAgICAgICByb2xsUmVzdWx0ID0gcm9sbC5yZXN1bHQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAvLyBOUENzIGhhdmUgYSBmaXhlZCBpbml0aWF0aXZlIGJhc2VkIG9uIHRoZWlyIGxldmVsXHJcbiAgICAgIGNhc2UgJ25wYyc6XHJcbiAgICAgICAgY29uc3QgeyBsZXZlbCB9ID0gYWN0b3JEYXRhLmRhdGE7XHJcbiAgICAgICAgaW5pdGlhdGl2ZSA9IDMgKiBsZXZlbDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBjb21iYXRhbnRVcGRhdGVzLnB1c2goe1xyXG4gICAgICBfaWQ6IGNvbWJhdGFudC5faWQsXHJcbiAgICAgIGluaXRpYXRpdmVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFNpbmNlIE5QQyBpbml0aWF0aXZlIGlzIGZpeGVkLCBkb24ndCBib3RoZXIgc2hvd2luZyBpdCBpbiBjaGF0XHJcbiAgICBpZiAodHlwZSA9PT0gJ3BjJykge1xyXG4gICAgICBjb25zdCB7IHRva2VuIH0gPSBjb21iYXRhbnQ7XHJcbiAgICAgIGNvbnN0IGlzSGlkZGVuID0gdG9rZW4uaGlkZGVuIHx8IGNvbWJhdGFudC5oaWRkZW47XHJcbiAgICAgIGNvbnN0IHdoaXNwZXIgPSBpc0hpZGRlbiA/IGdhbWUudXNlcnMuZW50aXRpZXMuZmlsdGVyKHUgPT4gdS5pc0dNKSA6ICcnO1xyXG5cclxuICAgICAgLy8gVE9ETzogSW1wcm92ZSB0aGUgY2hhdCBtZXNzYWdlLCB0aGlzIGN1cnJlbnRseVxyXG4gICAgICAvLyBqdXN0IHJlcGxpY2F0ZXMgdGhlIG5vcm1hbCByb2xsIG1lc3NhZ2UuXHJcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXJvbGxcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXJlc3VsdFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS1mb3JtdWxhXCI+JHtyb2xsUmVzdWx0fTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZGljZS10b29sdGlwXCI+XHJcbiAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ0b29sdGlwLXBhcnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicGFydC1mb3JtdWxhXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgMWQyMFxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGFydC10b3RhbFwiPiR7aW5pdGlhdGl2ZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvcD5cclxuXHJcbiAgICAgICAgICAgICAgICAgIDxvbCBjbGFzcz1cImRpY2Utcm9sbHNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJyb2xsIGRpZSBkMjBcIj4ke2luaXRpYXRpdmV9PC9saT5cclxuICAgICAgICAgICAgICAgICAgPC9vbD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkaWNlLXRvdGFsXCI+JHtpbml0aWF0aXZlfTwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgIGNvbnN0IG1lc3NhZ2VEYXRhID0gbWVyZ2VPYmplY3Qoe1xyXG4gICAgICAgIHNwZWFrZXI6IHtcclxuICAgICAgICAgIHNjZW5lOiBjYW52YXMuc2NlbmUuX2lkLFxyXG4gICAgICAgICAgYWN0b3I6IGFjdG9yID8gYWN0b3IuX2lkIDogbnVsbCxcclxuICAgICAgICAgIHRva2VuOiB0b2tlbi5faWQsXHJcbiAgICAgICAgICBhbGlhczogdG9rZW4ubmFtZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHdoaXNwZXIsXHJcbiAgICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbml0aWF0aXZlLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIHRva2VuLm5hbWUpLFxyXG4gICAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlLFxyXG4gICAgICB9LCBtZXNzYWdlT3B0aW9ucyk7XHJcblxyXG4gICAgICBtZXNzYWdlcy5wdXNoKG1lc3NhZ2VEYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmICghY29tYmF0YW50VXBkYXRlcy5sZW5ndGgpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIGF3YWl0IHRoaXMudXBkYXRlRW1iZWRkZWRFbnRpdHkoJ0NvbWJhdGFudCcsIGNvbWJhdGFudFVwZGF0ZXMpO1xyXG5cclxuICBDaGF0TWVzc2FnZS5jcmVhdGUobWVzc2FnZXMpO1xyXG5cclxuICByZXR1cm4gdGhpcztcclxufVxyXG4iLCJleHBvcnQgY29uc3QgQ1NSID0ge307XHJcblxyXG5DU1IuaXRlbVR5cGVzID0gW1xyXG4gICdza2lsbHMnLFxyXG4gICdhYmlsaXRpZXMnLFxyXG4gICdjeXBoZXJzJyxcclxuICAnYXJ0aWZhY3RzJyxcclxuICAnb2RkaXRpZXMnLFxyXG4gICd3ZWFwb25zJyxcclxuICAnYXJtb3InLFxyXG4gICdnZWFyJ1xyXG5dO1xyXG5cclxuQ1NSLmludmVudG9yeVR5cGVzID0gW1xyXG4gICd3ZWFwb24nLFxyXG4gICdhcm1vcicsXHJcbiAgJ2dlYXInLFxyXG5cclxuICAnY3lwaGVyJyxcclxuICAnYXJ0aWZhY3QnLFxyXG4gICdvZGRpdHknXHJcbl07XHJcblxyXG5DU1Iud2VpZ2h0Q2xhc3NlcyA9IFtcclxuICAnbGlnaHQnLFxyXG4gICdtZWRpdW0nLFxyXG4gICdoZWF2eSdcclxuXTtcclxuXHJcbkNTUi53ZWFwb25UeXBlcyA9IFtcclxuICAnYmFzaGluZycsXHJcbiAgJ2JsYWRlZCcsXHJcbiAgJ3JhbmdlZCcsXHJcbl1cclxuXHJcbkNTUi5zdGF0cyA9IFtcclxuICAnbWlnaHQnLFxyXG4gICdzcGVlZCcsXHJcbiAgJ2ludGVsbGVjdCcsXHJcbl07XHJcblxyXG5DU1IudHJhaW5pbmdMZXZlbHMgPSBbXHJcbiAgJ2luYWJpbGl0eScsXHJcbiAgJ3VudHJhaW5lZCcsXHJcbiAgJ3RyYWluZWQnLFxyXG4gICdzcGVjaWFsaXplZCdcclxuXTtcclxuXHJcbkNTUi5kYW1hZ2VUcmFjayA9IFtcclxuICAnaGFsZScsXHJcbiAgJ2ltcGFpcmVkJyxcclxuICAnZGViaWxpdGF0ZWQnLFxyXG4gICdkZWFkJ1xyXG5dO1xyXG5cclxuQ1NSLnJlY292ZXJpZXMgPSBbXHJcbiAgJ2FjdGlvbicsXHJcbiAgJ3Rlbk1pbnMnLFxyXG4gICdvbmVIb3VyJyxcclxuICAndGVuSG91cnMnXHJcbl07XHJcblxyXG5DU1IuYWR2YW5jZXMgPSBbXHJcbiAgJ3N0YXRzJyxcclxuICAnZWRnZScsXHJcbiAgJ2VmZm9ydCcsXHJcbiAgJ3NraWxscycsXHJcbiAgJ290aGVyJ1xyXG5dO1xyXG5cclxuQ1NSLnJhbmdlcyA9IFtcclxuICAnaW1tZWRpYXRlJyxcclxuICAnc2hvcnQnLFxyXG4gICdsb25nJyxcclxuICAndmVyeUxvbmcnXHJcbl07XHJcblxyXG5DU1Iub3B0aW9uYWxSYW5nZXMgPSBbXCJuYVwiXS5jb25jYXQoQ1NSLnJhbmdlcyk7XHJcblxyXG5DU1IuYWJpbGl0eVR5cGVzID0gW1xyXG4gICdhY3Rpb24nLFxyXG4gICdlbmFibGVyJyxcclxuXTtcclxuXHJcbkNTUi5zdXBwb3J0c01hY3JvcyA9IFtcclxuICAnc2tpbGwnLFxyXG4gICdhYmlsaXR5J1xyXG5dO1xyXG5cclxuQ1NSLmhhc0xldmVsRGllID0gW1xyXG4gICdjeXBoZXInLFxyXG4gICdhcnRpZmFjdCdcclxuXTtcclxuIiwiLyogZ2xvYmFscyBFTlRJVFlfUEVSTUlTU0lPTlMgKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhY3RvckRpcmVjdG9yeUNvbnRleHQoaHRtbCwgZW50cnlPcHRpb25zKSB7XHJcbiAgZW50cnlPcHRpb25zLnB1c2goe1xyXG4gICAgbmFtZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY3R4dC5pbnRydXNpb24uaGVhZGluZycpLFxyXG4gICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwiPjwvaT4nLFxyXG5cclxuICAgIGNhbGxiYWNrOiBsaSA9PiB7XHJcbiAgICAgIGNvbnN0IGFjdG9yID0gZ2FtZS5hY3RvcnMuZ2V0KGxpLmRhdGEoJ2VudGl0eUlkJykpO1xyXG4gICAgICBjb25zdCBvd25lcklkcyA9IE9iamVjdC5lbnRyaWVzKGFjdG9yLmRhdGEucGVybWlzc2lvbilcclxuICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IHtcclxuICAgICAgICAgIGNvbnN0IFtpZCwgcGVybWlzc2lvbkxldmVsXSA9IGVudHJ5O1xyXG4gICAgICAgICAgcmV0dXJuIHBlcm1pc3Npb25MZXZlbCA+PSBFTlRJVFlfUEVSTUlTU0lPTlMuT1dORVIgJiYgaWQgIT09IGdhbWUudXNlci5pZDtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5tYXAodXNlcnNQZXJtaXNzaW9ucyA9PiB1c2Vyc1Blcm1pc3Npb25zWzBdKTtcclxuXHJcbiAgICAgIGdhbWUuc29ja2V0LmVtaXQoJ3N5c3RlbS5jeXBoZXJzeXN0ZW1DbGVhbicsIHtcclxuICAgICAgICB0eXBlOiAnZ21JbnRydXNpb24nLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHVzZXJJZHM6IG93bmVySWRzLFxyXG4gICAgICAgICAgYWN0b3JJZDogYWN0b3IuZGF0YS5faWQsXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5jdHh0LmludHJ1c2lvbi5oZWFkaW5nJyk7XHJcbiAgICAgIGNvbnN0IGJvZHkgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5jdHh0LmludHJ1c2lvbi5oZWFkaW5nJykucmVwbGFjZSgnIyNBQ1RPUiMjJywgYWN0b3IuZGF0YS5uYW1lKTtcclxuXHJcbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZSh7XHJcbiAgICAgICAgY29udGVudDogYDxoMj4ke2hlYWRpbmd9PC9oMj48YnIvPiR7Ym9keX1gLFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgY29uZGl0aW9uOiBsaSA9PiB7XHJcbiAgICAgIGlmICghZ2FtZS51c2VyLmlzR00pIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFjdG9yID0gZ2FtZS5hY3RvcnMuZ2V0KGxpLmRhdGEoJ2VudGl0eUlkJykpO1xyXG4gICAgICByZXR1cm4gYWN0b3IgJiYgYWN0b3IuZGF0YS50eXBlID09PSAncGMnO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiIsIi8qIGdsb2JhbCBDb21iYXQgKi9cclxuXHJcbi8vIEltcG9ydCBNb2R1bGVzXHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yIH0gZnJvbSBcIi4vYWN0b3IvYWN0b3IuanNcIjtcclxuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCB9IGZyb20gXCIuL2FjdG9yL2FjdG9yLXNoZWV0LmpzXCI7XHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tIFwiLi9pdGVtL2l0ZW0uanNcIjtcclxuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IH0gZnJvbSBcIi4vaXRlbS9pdGVtLXNoZWV0LmpzXCI7XHJcblxyXG5pbXBvcnQgeyByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgfSBmcm9tICcuL2hhbmRsZWJhcnMtaGVscGVycy5qcyc7XHJcbmltcG9ydCB7IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzIH0gZnJvbSAnLi90ZW1wbGF0ZS5qcyc7XHJcblxyXG5pbXBvcnQgeyByZWdpc3RlclN5c3RlbVNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncy5qcyc7XHJcbmltcG9ydCB7IHJlbmRlckNoYXRNZXNzYWdlIH0gZnJvbSAnLi9jaGF0LmpzJztcclxuaW1wb3J0IHsgYWN0b3JEaXJlY3RvcnlDb250ZXh0IH0gZnJvbSAnLi9jb250ZXh0LW1lbnUuanMnO1xyXG5pbXBvcnQgeyBjc3JTb2NrZXRMaXN0ZW5lcnMgfSBmcm9tICcuL3NvY2tldC5qcyc7XHJcbmltcG9ydCB7IHJvbGxJbml0aWF0aXZlIH0gZnJvbSAnLi9jb21iYXQuanMnO1xyXG5cclxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBnYW1lLmN5cGhlcnN5c3RlbUNsZWFuID0ge1xyXG4gICAgQ3lwaGVyU3lzdGVtQWN0b3IsXHJcbiAgICBDeXBoZXJTeXN0ZW1JdGVtXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGFuIGluaXRpYXRpdmUgZm9ybXVsYSBmb3IgdGhlIHN5c3RlbVxyXG4gICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgQ29tYmF0LnByb3RvdHlwZS5yb2xsSW5pdGlhdGl2ZSA9IHJvbGxJbml0aWF0aXZlO1xyXG5cclxuICAvLyBEZWZpbmUgY3VzdG9tIEVudGl0eSBjbGFzc2VzXHJcbiAgQ09ORklHLkFjdG9yLmVudGl0eUNsYXNzID0gQ3lwaGVyU3lzdGVtQWN0b3I7XHJcbiAgQ09ORklHLkl0ZW0uZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1JdGVtO1xyXG5cclxuICAvLyBSZWdpc3RlciBzaGVldCBhcHBsaWNhdGlvbiBjbGFzc2VzXHJcbiAgQWN0b3JzLnVucmVnaXN0ZXJTaGVldCgnY29yZScsIEFjdG9yU2hlZXQpO1xyXG4gIC8vIFRPRE86IFNlcGFyYXRlIGNsYXNzZXMgcGVyIHR5cGVcclxuICBBY3RvcnMucmVnaXN0ZXJTaGVldCgnY3lwaGVyc3lzdGVtQ2xlYW4nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XHJcbiAgICB0eXBlczogWydwYyddLFxyXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXHJcbiAgfSk7XHJcbiAgQWN0b3JzLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbUNsZWFuJywgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCwge1xyXG4gICAgdHlwZXM6IFsnbnBjJ10sXHJcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcclxuICB9KTtcclxuXHJcbiAgSXRlbXMudW5yZWdpc3RlclNoZWV0KCdjb3JlJywgSXRlbVNoZWV0KTtcclxuICBJdGVtcy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW1DbGVhbicsIEN5cGhlclN5c3RlbUl0ZW1TaGVldCwgeyBtYWtlRGVmYXVsdDogdHJ1ZSB9KTtcclxuXHJcbiAgcmVnaXN0ZXJTeXN0ZW1TZXR0aW5ncygpO1xyXG4gIHJlZ2lzdGVySGFuZGxlYmFySGVscGVycygpO1xyXG4gIHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzKCk7XHJcbn0pO1xyXG5cclxuSG9va3Mub24oJ3JlbmRlckNoYXRNZXNzYWdlJywgcmVuZGVyQ2hhdE1lc3NhZ2UpO1xyXG5cclxuSG9va3Mub24oJ2dldEFjdG9yRGlyZWN0b3J5RW50cnlDb250ZXh0JywgYWN0b3JEaXJlY3RvcnlDb250ZXh0KTtcclxuXHJcbkhvb2tzLm9uKCdjcmVhdGVBY3RvcicsIGFzeW5jIGZ1bmN0aW9uKGFjdG9yLCBvcHRpb25zLCB1c2VySWQpIHtcclxuICBjb25zdCB7IHR5cGUgfSA9IGFjdG9yLmRhdGE7XHJcbiAgaWYgKHR5cGUgPT09ICdwYycpIHtcclxuICAgIC8vIEdpdmUgUENzIHRoZSBcIkluaXRpYXRpdmVcIiBza2lsbCBieSBkZWZhdWx0LCBhcyBpdCB3aWxsIGJlIHVzZWRcclxuICAgIC8vIGJ5IHRoZSBpbnRpYXRpdmUgZm9ybXVsYSBpbiBjb21iYXQuXHJcbiAgICBhY3Rvci5jcmVhdGVPd25lZEl0ZW0oe1xyXG4gICAgICBuYW1lOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5za2lsbC5pbml0aWF0aXZlJyksXHJcbiAgICAgIHR5cGU6ICdza2lsbCcsXHJcbiAgICAgIGRhdGE6IG5ldyBDeXBoZXJTeXN0ZW1JdGVtKHtcclxuICAgICAgICAncG9vbCc6IDEsIC8vIFNwZWVkXHJcbiAgICAgICAgJ3RyYWluaW5nJzogMSwgLy8gVW50cmFpbmVkXHJcblxyXG4gICAgICAgICdmbGFncy5pbml0aWF0aXZlJzogdHJ1ZVxyXG4gICAgICB9KSxcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG5Ib29rcy5vbmNlKCdyZWFkeScsIGNzclNvY2tldExpc3RlbmVycyk7XHJcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXHJcblxyXG4vKipcclxuICogUHJvbXB0cyB0aGUgdXNlciB3aXRoIGEgY2hvaWNlIG9mIGEgR00gSW50cnVzaW9uLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgR01JbnRydXNpb25EaWFsb2dcclxuICogQGV4dGVuZHMge0RpYWxvZ31cclxuICovXHJcbmV4cG9ydCBjbGFzcyBHTUludHJ1c2lvbkRpYWxvZyBleHRlbmRzIERpYWxvZyB7XHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcclxuICAgICAgdGVtcGxhdGU6IFwidGVtcGxhdGVzL2h1ZC9kaWFsb2cuaHRtbFwiLFxyXG4gICAgICBjbGFzc2VzOiBbXCJjc3JcIiwgXCJkaWFsb2dcIl0sXHJcbiAgICAgIHdpZHRoOiA1MDBcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoYWN0b3IsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgYWNjZXB0UXVlc3Rpb24gPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLmRvWW91QWNjZXB0Jyk7XHJcbiAgICBjb25zdCBhY2NlcHRJbnN0cnVjdGlvbnMgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLmFjY2VwdEluc3RydWN0aW9ucycpXHJcbiAgICAgIC5yZXBsYWNlKCcjI0FDQ0VQVCMjJywgYDxzcGFuIHN0eWxlPVwiY29sb3I6IGdyZWVuXCI+JHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5hY2NlcHQnKX08L3NwYW4+YCk7XHJcbiAgICBjb25zdCByZWZ1c2VJbnN0cnVjdGlvbnMgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLnJlZnVzZUluc3RydWN0aW9ucycpXHJcbiAgICAgIC5yZXBsYWNlKCcjI1JFRlVTRSMjJywgYDxzcGFuIHN0eWxlPVwiY29sb3I6IHJlZFwiPiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucmVmdXNlJyl9PC9zcGFuPmApO1xyXG5cclxuICAgIGxldCBkaWFsb2dDb250ZW50ID0gYFxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XHJcbiAgICAgICAgPHA+JHthY2NlcHRRdWVzdGlvbn08L3A+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8aHIgLz5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy02XCI+XHJcbiAgICAgICAgPHA+JHthY2NlcHRJbnN0cnVjdGlvbnN9PC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy02XCI+XHJcbiAgICAgICAgPHA+JHtyZWZ1c2VJbnN0cnVjdGlvbnN9PC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGhyIC8+YDtcclxuXHJcbiAgICBsZXQgZGlhbG9nQnV0dG9ucyA9IHtcclxuICAgICAgb2s6IHtcclxuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIiBzdHlsZT1cImNvbG9yOiBncmVlblwiPjwvaT4nLFxyXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLmFjY2VwdCcpLFxyXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICBhd2FpdCBhY3Rvci5vbkdNSW50cnVzaW9uKHRydWUpO1xyXG4gICAgICAgICAgc3VwZXIuY2xvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiIHN0eWxlPVwiY29sb3I6IHJlZFwiPjwvaT4nLFxyXG4gICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuYnV0dG9uLnJlZnVzZScpLFxyXG4gICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICBhd2FpdCBhY3Rvci5vbkdNSW50cnVzaW9uKGZhbHNlKTtcclxuICAgICAgICAgIHN1cGVyLmNsb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICghYWN0b3IuY2FuUmVmdXNlSW50cnVzaW9uKSB7XHJcbiAgICAgIGNvbnN0IG5vdEVub3VnaFhQID0gZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmludHJ1c2lvbi5ub3RFbm91Z2hYUCcpO1xyXG5cclxuICAgICAgZGlhbG9nQ29udGVudCArPSBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XHJcbiAgICAgICAgICA8cD48c3Ryb25nPiR7bm90RW5vdWdoWFB9PC9zdHJvbmc+PC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGhyIC8+YFxyXG5cclxuICAgICAgZGVsZXRlIGRpYWxvZ0J1dHRvbnMuY2FuY2VsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRpYWxvZ0RhdGEgPSB7XHJcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cuaW50cnVzaW9uLnRpdGxlJyksXHJcbiAgICAgIGNvbnRlbnQ6IGRpYWxvZ0NvbnRlbnQsXHJcbiAgICAgIGJ1dHRvbnM6IGRpYWxvZ0J1dHRvbnMsXHJcbiAgICAgIGRlZmF1bHRZZXM6IGZhbHNlLFxyXG4gICAgfTtcclxuXHJcbiAgICBzdXBlcihkaWFsb2dEYXRhLCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLmFjdG9yID0gYWN0b3I7XHJcbiAgfVxyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgX2dldEhlYWRlckJ1dHRvbnMoKSB7XHJcbiAgICAvLyBEb24ndCBpbmNsdWRlIGFueSBoZWFkZXIgYnV0dG9ucywgZm9yY2UgYW4gb3B0aW9uIHRvIGJlIGNob3NlblxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGNsb3NlKCkge1xyXG4gICAgLy8gUHJldmVudCBkZWZhdWx0IGNsb3NpbmcgYmVoYXZpb3JcclxuICB9XHJcbn0gXHJcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgRGlhbG9nICovXHJcblxyXG4vKipcclxuICogQWxsb3dzIHRoZSB1c2VyIHRvIGNob29zZSBvbmUgb2YgdGhlIG90aGVyIHBsYXllciBjaGFyYWN0ZXJzLlxyXG4gKiBcclxuICogQGV4cG9ydFxyXG4gKiBAY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nXHJcbiAqIEBleHRlbmRzIHtEaWFsb2d9XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGxheWVyQ2hvaWNlRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcclxuICAgICAgdGVtcGxhdGU6IFwidGVtcGxhdGVzL2h1ZC9kaWFsb2cuaHRtbFwiLFxyXG4gICAgICBjbGFzc2VzOiBbXCJjc3JcIiwgXCJkaWFsb2dcIiwgXCJwbGF5ZXItY2hvaWNlXCJdLFxyXG4gICAgICB3aWR0aDogMzAwLFxyXG4gICAgICBoZWlnaHQ6IDE3NVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihhY3RvcnMsIG9uQWNjZXB0Rm4sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgZGlhbG9nU2VsZWN0T3B0aW9ucyA9IFtdO1xyXG4gICAgYWN0b3JzLmZvckVhY2goYWN0b3IgPT4ge1xyXG4gICAgICBkaWFsb2dTZWxlY3RPcHRpb25zLnB1c2goYDxvcHRpb24gdmFsdWU9XCIke2FjdG9yLl9pZH1cIj4ke2FjdG9yLm5hbWV9PC9vcHRpb24+YClcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGRpYWxvZ1RleHQgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5kaWFsb2cucGxheWVyLmNvbnRlbnQnKTtcclxuICAgIGNvbnN0IGRpYWxvZ0NvbnRlbnQgPSBgXHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cclxuICAgICAgICA8cD4ke2RpYWxvZ1RleHR9PC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGhyIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cclxuICAgICAgICA8c2VsZWN0IG5hbWU9XCJwbGF5ZXJcIj5cclxuICAgICAgICAgICR7ZGlhbG9nU2VsZWN0T3B0aW9ucy5qb2luKCdcXG4nKX1cclxuICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxociAvPmA7XHJcblxyXG4gICAgY29uc3QgZGlhbG9nQnV0dG9ucyA9IHtcclxuICAgICAgb2s6IHtcclxuICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcclxuICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLmJ1dHRvbi5hY2NlcHQnKSxcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgYWN0b3JJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY2hvaWNlIHNlbGVjdFtuYW1lPVwicGxheWVyXCJdJykudmFsdWU7XHJcblxyXG4gICAgICAgICAgb25BY2NlcHRGbihhY3RvcklkKTtcclxuXHJcbiAgICAgICAgICBzdXBlci5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBkaWFsb2dEYXRhID0ge1xyXG4gICAgICB0aXRsZTogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuZGlhbG9nLnBsYXllci50aXRsZScpLFxyXG4gICAgICBjb250ZW50OiBkaWFsb2dDb250ZW50LFxyXG4gICAgICBidXR0b25zOiBkaWFsb2dCdXR0b25zLFxyXG4gICAgICBkZWZhdWx0WWVzOiBmYWxzZSxcclxuICAgIH07XHJcblxyXG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5hY3RvcnMgPSBhY3RvcnM7XHJcbiAgfVxyXG5cclxuICBnZXREYXRhKCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHN1cGVyLmdldERhdGEoKTtcclxuXHJcbiAgICBkYXRhLmFjdG9ycyA9IHRoaXMuYWN0b3JzO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInBsYXllclwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgLy8gbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKiBAb3ZlcnJpZGUgKi9cclxuICBfZ2V0SGVhZGVyQnV0dG9ucygpIHtcclxuICAgIC8vIERvbid0IGluY2x1ZGUgYW55IGhlYWRlciBidXR0b25zLCBmb3JjZSBhbiBvcHRpb24gdG8gYmUgY2hvc2VuXHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgY2xvc2UoKSB7XHJcbiAgICAvLyBQcmV2ZW50IGRlZmF1bHQgY2xvc2luZyBiZWhhdmlvclxyXG4gIH1cclxufSBcclxuIiwiLyogZ2xvYmFscyBEaWFsb2cgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBSb2xsRGlhbG9nIGV4dGVuZHMgRGlhbG9nIHtcclxuICBjb25zdHJ1Y3RvcihkaWFsb2dEYXRhLCBvcHRpb25zKSB7XHJcbiAgICBzdXBlcihkaWFsb2dEYXRhLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJyb2xsTW9kZVwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMzVweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgfVxyXG59IiwiY29uc3QgRW51bVBvb2wgPSBbXHJcbiAgXCJNaWdodFwiLFxyXG4gIFwiU3BlZWRcIixcclxuICBcIkludGVsbGVjdFwiXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbnVtUG9vbDtcclxuIiwiY29uc3QgRW51bVJhbmdlID0gW1xyXG4gIFwiSW1tZWRpYXRlXCIsXHJcbiAgXCJTaG9ydFwiLFxyXG4gIFwiTG9uZ1wiLFxyXG4gIFwiVmVyeSBMb25nXCJcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudW1SYW5nZTtcclxuIiwiY29uc3QgRW51bVRyYWluaW5nID0gW1xyXG4gIFwiSW5hYmlsaXR5XCIsXHJcbiAgXCJVbnRyYWluZWRcIixcclxuICBcIlRyYWluZWRcIixcclxuICBcIlNwZWNpYWxpemVkXCJcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudW1UcmFpbmluZztcclxuIiwiY29uc3QgRW51bVdlYXBvbkNhdGVnb3J5ID0gW1xyXG4gIFwiQmxhZGVkXCIsXHJcbiAgXCJCYXNoaW5nXCIsXHJcbiAgXCJSYW5nZWRcIlxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW51bVdlYXBvbkNhdGVnb3J5O1xyXG4iLCJjb25zdCBFbnVtV2VpZ2h0ID0gW1xyXG4gIFwiTGlnaHRcIixcclxuICBcIk1lZGl1bVwiLFxyXG4gIFwiSGVhdnlcIlxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW51bVdlaWdodDtcclxuIiwiZXhwb3J0IGNvbnN0IHJlZ2lzdGVySGFuZGxlYmFySGVscGVycyA9ICgpID0+IHtcclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0b0xvd2VyQ2FzZScsIHN0ciA9PiBzdHIudG9Mb3dlckNhc2UoKSk7XHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndG9VcHBlckNhc2UnLCB0ZXh0ID0+IHRleHQudG9VcHBlckNhc2UoKSk7XHJcblxyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2VxJywgKHYxLCB2MikgPT4gdjEgPT09IHYyKTtcclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCduZXEnLCAodjEsIHYyKSA9PiB2MSAhPT0gdjIpO1xyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ29yJywgKHYxLCB2MikgPT4gdjEgfHwgdjIpO1xyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Rlcm5hcnknLCAoY29uZCwgdjEsIHYyKSA9PiBjb25kID8gdjEgOiB2Mik7XHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignY29uY2F0JywgKHYxLCB2MikgPT4gYCR7djF9JHt2Mn1gKTtcclxuXHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc3RyT3JTcGFjZScsIHZhbCA9PiB7XHJcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuICh2YWwgJiYgISF2YWwubGVuZ3RoKSA/IHZhbCA6ICcmbmJzcDsnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2YWw7XHJcbiAgfSk7XHJcblxyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RyYWluaW5nSWNvbicsIHZhbCA9PiB7XHJcbiAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcuaW5hYmlsaXR5Jyl9XCI+W0ldPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy51bnRyYWluZWQnKX1cIj5bVV08L3NwYW4+YDtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLnRyYWluZWQnKX1cIj5bVF08L3NwYW4+YDtcclxuICAgICAgY2FzZSAzOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLnNwZWNpYWxpemVkJyl9XCI+W1NdPC9zcGFuPmA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH0pO1xyXG5cclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdwb29sSWNvbicsIHZhbCA9PiB7XHJcbiAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5taWdodCcpfVwiPltNXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5zcGVlZCcpfVwiPltTXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5pbnRlbGxlY3QnKX1cIj5bSV08L3NwYW4+YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfSk7XHJcblxyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3R5cGVJY29uJywgdmFsID0+IHtcclxuICAgIHN3aXRjaCAodmFsKSB7XHJcbiAgICAgIC8vIFRPRE86IEFkZCBza2lsbCBhbmQgYWJpbGl0eT9cclxuICAgICAgXHJcbiAgICAgIGNhc2UgJ2FybW9yJzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bYV08L3NwYW4+YDtcclxuICAgICAgY2FzZSAnd2VhcG9uJzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkud2VhcG9uJyl9XCI+W3ddPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgJ2dlYXInOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5nZWFyJyl9XCI+W2ddPC9zcGFuPmA7XHJcbiAgICAgIFxyXG4gICAgICBjYXNlICdjeXBoZXInOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5jeXBoZXInKX1cIj5bQ108L3NwYW4+YDtcclxuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPltBXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlICdvZGRpdHknOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPltPXTwvc3Bhbj5gO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnJztcclxuICB9KTtcclxufTtcclxuIiwiLyogZ2xvYmFscyBtZXJnZU9iamVjdCAqL1xyXG5cclxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW1TaGVldCB3aXRoIHNvbWUgdmVyeSBzaW1wbGUgbW9kaWZpY2F0aW9uc1xyXG4gKiBAZXh0ZW5kcyB7SXRlbVNoZWV0fVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW1TaGVldCBleHRlbmRzIEl0ZW1TaGVldCB7XHJcblxyXG4gIC8qKiBAb3ZlcnJpZGUgKi9cclxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XHJcbiAgICAgIGNsYXNzZXM6IFtcImN5cGhlcnN5c3RlbVwiLCBcInNoZWV0XCIsIFwiaXRlbVwiXSxcclxuICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgaGVpZ2h0OiAyMDBcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgIGNvbnN0IHBhdGggPSBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW1cIjtcclxuICAgIHJldHVybiBgJHtwYXRofS8ke3RoaXMuaXRlbS5kYXRhLnR5cGV9LXNoZWV0Lmh0bWxgO1xyXG4gIH1cclxuXHJcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiAgX3NraWxsRGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xyXG4gICAgZGF0YS50cmFpbmluZ0xldmVscyA9IENTUi50cmFpbmluZ0xldmVscztcclxuICB9XHJcblxyXG4gIF9hYmlsaXR5RGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLnJhbmdlcyA9IENTUi5vcHRpb25hbFJhbmdlcztcclxuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XHJcbiAgfVxyXG5cclxuICBfYXJtb3JEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEud2VpZ2h0Q2xhc3NlcyA9IENTUi53ZWlnaHRDbGFzc2VzO1xyXG4gIH1cclxuXHJcbiAgX3dlYXBvbkRhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xyXG4gICAgZGF0YS53ZWFwb25UeXBlcyA9IENTUi53ZWFwb25UeXBlcztcclxuICAgIGRhdGEud2VpZ2h0Q2xhc3NlcyA9IENTUi53ZWlnaHRDbGFzc2VzO1xyXG4gIH1cclxuXHJcbiAgX2dlYXJEYXRhKGRhdGEpIHtcclxuICB9XHJcblxyXG4gIF9jeXBoZXJEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xyXG4gIH1cclxuXHJcbiAgX2FydGlmYWN0RGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcclxuICB9XHJcblxyXG4gIF9vZGRpdHlEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGdldERhdGEoKSB7XHJcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xyXG5cclxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5pdGVtLmRhdGE7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnc2tpbGwnOlxyXG4gICAgICAgIHRoaXMuX3NraWxsRGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYWJpbGl0eSc6XHJcbiAgICAgICAgdGhpcy5fYWJpbGl0eURhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FybW9yJzpcclxuICAgICAgICB0aGlzLl9hcm1vckRhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3dlYXBvbic6XHJcbiAgICAgICAgdGhpcy5fd2VhcG9uRGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnZ2Vhcic6XHJcbiAgICAgICAgdGhpcy5fZ2VhckRhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2N5cGhlcic6XHJcbiAgICAgICAgdGhpcy5fY3lwaGVyRGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxyXG4gICAgICAgIHRoaXMuX2FydGlmYWN0RGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnb2RkaXR5JzpcclxuICAgICAgICB0aGlzLl9vZGRpdHlEYXRhKGRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIHNldFBvc2l0aW9uKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgcG9zaXRpb24gPSBzdXBlci5zZXRQb3NpdGlvbihvcHRpb25zKTtcclxuICAgIGNvbnN0IHNoZWV0Qm9keSA9IHRoaXMuZWxlbWVudC5maW5kKFwiLnNoZWV0LWJvZHlcIik7XHJcbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gcG9zaXRpb24uaGVpZ2h0IC0gMTkyO1xyXG4gICAgc2hlZXRCb2R5LmNzcyhcImhlaWdodFwiLCBib2R5SGVpZ2h0KTtcclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4gIF9za2lsbExpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnc2tpbGwtd2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuc3RhdFwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMTBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEudHJhaW5pbmdcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2FiaWxpdHlMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FiaWxpdHktd2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuaXNFbmFibGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzIyMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5jb3N0LnBvb2xcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnODVweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEucmFuZ2VcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNiSWRlbnRpZmllZCA9IGh0bWwuZmluZCgnI2NiLWlkZW50aWZpZWQnKTtcclxuICAgIGNiSWRlbnRpZmllZC5vbignY2hhbmdlJywgKGV2KSA9PiB7XHJcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5pdGVtLnVwZGF0ZSh7XHJcbiAgICAgICAgJ2RhdGEuaWRlbnRpZmllZCc6IGV2LnRhcmdldC5jaGVja2VkXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfYXJtb3JMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FybW9yLXdpbmRvdycpO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLndlaWdodFwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMDBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfd2VhcG9uTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCd3ZWFwb24td2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEud2VpZ2h0XCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzExMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWFwb25UeXBlXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzExMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5yYW5nZVwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMjBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfZ2Vhckxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnZ2Vhci13aW5kb3cnKTtcclxuICB9XHJcblxyXG4gIF9jeXBoZXJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2N5cGhlci13aW5kb3cnKTtcclxuICB9XHJcblxyXG4gIF9hcnRpZmFjdExpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnYXJ0aWZhY3Qtd2luZG93Jyk7XHJcbiAgfVxyXG5cclxuICBfb2RkaXR5TGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdvZGRpdHktd2luZG93Jyk7XHJcbiAgfVxyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZWRpdGFibGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5pdGVtLmRhdGE7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnc2tpbGwnOlxyXG4gICAgICAgIHRoaXMuX3NraWxsTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICB0aGlzLl9hYmlsaXR5TGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcm1vcic6XHJcbiAgICAgICAgdGhpcy5fYXJtb3JMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3dlYXBvbic6XHJcbiAgICAgICAgdGhpcy5fd2VhcG9uTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdnZWFyJzpcclxuICAgICAgICB0aGlzLl9nZWFyTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdjeXBoZXInOlxyXG4gICAgICAgIHRoaXMuX2N5cGhlckxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxyXG4gICAgICAgIHRoaXMuX2FydGlmYWN0TGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdvZGRpdHknOlxyXG4gICAgICAgIHRoaXMuX29kZGl0eUxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLyogZ2xvYmFscyBJdGVtIHJlbmRlclRlbXBsYXRlICovXHJcblxyXG5pbXBvcnQgeyBjeXBoZXJSb2xsIH0gZnJvbSAnLi4vcm9sbHMuanMnO1xyXG5pbXBvcnQgeyB2YWxPckRlZmF1bHQgfSBmcm9tICcuLi91dGlscy5qcyc7XHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4uL2VudW1zL2VudW0tcG9vbC5qcyc7XHJcbmltcG9ydCBFbnVtVHJhaW5pbmcgZnJvbSAnLi4vZW51bXMvZW51bS10cmFpbmluZy5qcyc7XHJcbmltcG9ydCBFbnVtV2VpZ2h0IGZyb20gJy4uL2VudW1zL2VudW0td2VpZ2h0LmpzJztcclxuaW1wb3J0IEVudW1SYW5nZSBmcm9tICcuLi9lbnVtcy9lbnVtLXJhbmdlLmpzJztcclxuaW1wb3J0IEVudW1XZWFwb25DYXRlZ29yeSBmcm9tICcuLi9lbnVtcy9lbnVtLXdlYXBvbi1jYXRlZ29yeS5qcyc7XHJcblxyXG4vKipcclxuICogRXh0ZW5kIHRoZSBiYXNpYyBJdGVtIHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zLlxyXG4gKiBAZXh0ZW5kcyB7SXRlbX1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1JdGVtIGV4dGVuZHMgSXRlbSB7XHJcbiAgX3ByZXBhcmVTa2lsbERhdGEoKSB7XHJcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XHJcblxyXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5za2lsbCcpKTtcclxuICAgIGRhdGEucG9vbCA9IHZhbE9yRGVmYXVsdChkYXRhLnBvb2wsIDApO1xyXG4gICAgZGF0YS50cmFpbmluZyA9IHZhbE9yRGVmYXVsdChkYXRhLnRyYWluaW5nLCAxKTtcclxuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xyXG5cclxuICAgIGRhdGEuZmxhZ3MgPSB2YWxPckRlZmF1bHQoZGF0YS5mbGFncywge30pO1xyXG4gIH1cclxuXHJcbiAgX3ByZXBhcmVBYmlsaXR5RGF0YSgpIHtcclxuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcclxuXHJcbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LmFiaWxpdHknKSk7XHJcbiAgICBkYXRhLnNvdXJjZVR5cGUgPSB2YWxPckRlZmF1bHQoZGF0YS5zb3VyY2VUeXBlLCAnJyk7XHJcbiAgICBkYXRhLnNvdXJjZVZhbHVlID0gdmFsT3JEZWZhdWx0KGRhdGEuc291cmNlVmFsdWUsICcnKTtcclxuICAgIGRhdGEuaXNFbmFibGVyID0gdmFsT3JEZWZhdWx0KGRhdGEuaXNFbmFibGVyLCB0cnVlKTtcclxuICAgIGRhdGEuY29zdCA9IHZhbE9yRGVmYXVsdChkYXRhLmNvc3QsIHtcclxuICAgICAgdmFsdWU6IDAsXHJcbiAgICAgIHBvb2w6IDBcclxuICAgIH0pO1xyXG4gICAgZGF0YS5yYW5nZSA9IHZhbE9yRGVmYXVsdChkYXRhLnJhbmdlLCAwKTtcclxuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xyXG4gIH1cclxuXHJcbiAgX3ByZXBhcmVBcm1vckRhdGEoKSB7XHJcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XHJcblxyXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hcm1vcicpKTtcclxuICAgIGRhdGEuYXJtb3IgPSB2YWxPckRlZmF1bHQoZGF0YS5hcm1vciwgMSk7XHJcbiAgICBkYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QgPSB2YWxPckRlZmF1bHQoZGF0YS5hZGRpdGlvbmFsU3BlZWRFZmZvcnRDb3N0LCAxKTtcclxuICAgIGRhdGEucHJpY2UgPSB2YWxPckRlZmF1bHQoZGF0YS5wcmljZSwgMCk7XHJcbiAgICBkYXRhLndlaWdodCA9IHZhbE9yRGVmYXVsdChkYXRhLndlaWdodCwgMCk7XHJcbiAgICBkYXRhLnF1YW50aXR5ID0gdmFsT3JEZWZhdWx0KGRhdGEucXVhbnRpdHksIDEpO1xyXG4gICAgZGF0YS5lcXVpcHBlZCA9IHZhbE9yRGVmYXVsdChkYXRhLmVxdWlwcGVkLCBmYWxzZSk7XHJcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcclxuICB9XHJcblxyXG4gIF9wcmVwYXJlV2VhcG9uRGF0YSgpIHtcclxuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcclxuXHJcbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LndlYXBvbicpKTtcclxuICAgIGRhdGEuZGFtYWdlID0gdmFsT3JEZWZhdWx0KGRhdGEuZGFtYWdlLCAxKTtcclxuICAgIGRhdGEuY2F0ZWdvcnkgPSB2YWxPckRlZmF1bHQoZGF0YS5jYXRlZ29yeSwgMCk7XHJcbiAgICBkYXRhLnJhbmdlID0gdmFsT3JEZWZhdWx0KGRhdGEucmFuZ2UsIDApO1xyXG4gICAgZGF0YS5wcmljZSA9IHZhbE9yRGVmYXVsdChkYXRhLnByaWNlLCAwKTtcclxuICAgIGRhdGEud2VpZ2h0ID0gdmFsT3JEZWZhdWx0KGRhdGEud2VpZ2h0LCAwKTtcclxuICAgIGRhdGEucXVhbnRpdHkgPSB2YWxPckRlZmF1bHQoZGF0YS5xdWFudGl0eSwgMSk7XHJcbiAgICBkYXRhLmVxdWlwcGVkID0gdmFsT3JEZWZhdWx0KGRhdGEuZXF1aXBwZWQsIGZhbHNlKTtcclxuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xyXG4gIH1cclxuXHJcbiAgX3ByZXBhcmVHZWFyRGF0YSgpIHtcclxuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcclxuXHJcbiAgICBkYXRhLm5hbWUgPSB2YWxPckRlZmF1bHQoaXRlbURhdGEubmFtZSwgZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IubmV3LmdlYXInKSk7XHJcbiAgICBkYXRhLnByaWNlID0gdmFsT3JEZWZhdWx0KGRhdGEucHJpY2UsIDApO1xyXG4gICAgZGF0YS5xdWFudGl0eSA9IHZhbE9yRGVmYXVsdChkYXRhLnF1YW50aXR5LCAxKTtcclxuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xyXG4gIH1cclxuXHJcbiAgX3ByZXBhcmVDeXBoZXJEYXRhKCkge1xyXG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IGl0ZW1EYXRhO1xyXG5cclxuICAgIGRhdGEubmFtZSA9IHZhbE9yRGVmYXVsdChpdGVtRGF0YS5uYW1lLCBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5uZXcuY3lwaGVyJykpO1xyXG4gICAgZGF0YS5pZGVudGlmaWVkID0gdmFsT3JEZWZhdWx0KGRhdGEuaWRlbnRpZmllZCwgZmFsc2UpO1xyXG4gICAgZGF0YS5sZXZlbCA9IHZhbE9yRGVmYXVsdChkYXRhLmxldmVsLCBudWxsKTtcclxuICAgIGRhdGEubGV2ZWxEaWUgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbERpZSwgJycpO1xyXG4gICAgZGF0YS5mb3JtID0gdmFsT3JEZWZhdWx0KGRhdGEuZm9ybSwgJycpO1xyXG4gICAgZGF0YS5lZmZlY3QgPSB2YWxPckRlZmF1bHQoZGF0YS5lZmZlY3QsICcnKTtcclxuICAgIGRhdGEubm90ZXMgPSB2YWxPckRlZmF1bHQoZGF0YS5ub3RlcywgJycpO1xyXG4gIH1cclxuXHJcbiAgX3ByZXBhcmVBcnRpZmFjdERhdGEoKSB7XHJcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XHJcblxyXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5hcnRpZmFjdCcpKTtcclxuICAgIGRhdGEuaWRlbnRpZmllZCA9IHZhbE9yRGVmYXVsdChkYXRhLmlkZW50aWZpZWQsIGZhbHNlKTtcclxuICAgIGRhdGEubGV2ZWwgPSB2YWxPckRlZmF1bHQoZGF0YS5sZXZlbCwgbnVsbCk7XHJcbiAgICBkYXRhLmxldmVsRGllID0gdmFsT3JEZWZhdWx0KGRhdGEubGV2ZWxEaWUsICcnKTtcclxuICAgIGRhdGEuZm9ybSA9IHZhbE9yRGVmYXVsdChkYXRhLmZvcm0sICcnKTtcclxuICAgIGRhdGEuZWZmZWN0ID0gdmFsT3JEZWZhdWx0KGRhdGEuZWZmZWN0LCAnJyk7XHJcbiAgICBkYXRhLmRlcGxldGlvbiA9IHZhbE9yRGVmYXVsdChkYXRhLmRlcGxldGlvbiwge1xyXG4gICAgICBpc0RlcGxldGluZzogdHJ1ZSxcclxuICAgICAgZGllOiAnZDYnLFxyXG4gICAgICB0aHJlc2hvbGQ6IDFcclxuICAgIH0pO1xyXG4gICAgZGF0YS5ub3RlcyA9IHZhbE9yRGVmYXVsdChkYXRhLm5vdGVzLCAnJyk7XHJcbiAgfVxyXG5cclxuICBfcHJlcGFyZU9kZGl0eURhdGEoKSB7XHJcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XHJcblxyXG4gICAgZGF0YS5uYW1lID0gdmFsT3JEZWZhdWx0KGl0ZW1EYXRhLm5hbWUsIGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLm5ldy5vZGRpdHknKSk7XHJcbiAgICBkYXRhLm5vdGVzID0gdmFsT3JEZWZhdWx0KGRhdGEubm90ZXMsICcnKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIEl0ZW0gZGF0YSBtb2RlbCB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxyXG4gICAqL1xyXG4gIHByZXBhcmVEYXRhKCkge1xyXG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICBjYXNlICdza2lsbCc6XHJcbiAgICAgICAgdGhpcy5fcHJlcGFyZVNraWxsRGF0YSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICB0aGlzLl9wcmVwYXJlQWJpbGl0eURhdGEoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJtb3InOlxyXG4gICAgICAgIHRoaXMuX3ByZXBhcmVBcm1vckRhdGEoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnd2VhcG9uJzpcclxuICAgICAgICB0aGlzLl9wcmVwYXJlV2VhcG9uRGF0YSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdnZWFyJzpcclxuICAgICAgICB0aGlzLl9wcmVwYXJlR2VhckRhdGEoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnY3lwaGVyJzpcclxuICAgICAgICB0aGlzLl9wcmVwYXJlQ3lwaGVyRGF0YSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcnRpZmFjdCc6XHJcbiAgICAgICAgdGhpcy5fcHJlcGFyZUFydGlmYWN0RGF0YSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdvZGRpdHknOlxyXG4gICAgICAgIHRoaXMuX3ByZXBhcmVPZGRpdHlEYXRhKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSb2xsXHJcbiAgICovXHJcblxyXG4gIF9za2lsbFJvbGwoKSB7XHJcbiAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XHJcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XHJcblxyXG4gICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzO1xyXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgcG9vbCB9ID0gaXRlbS5kYXRhO1xyXG4gICAgY29uc3QgYXNzZXRzID0gYWN0b3IuZ2V0U2tpbGxMZXZlbCh0aGlzKTtcclxuICAgIFxyXG4gICAgY29uc3QgcGFydHMgPSBbJzFkMjAnXTtcclxuICAgIGlmIChhc3NldHMgIT09IDApIHtcclxuICAgICAgY29uc3Qgc2lnbiA9IGFzc2V0cyA8IDAgPyAnLScgOiAnKyc7XHJcbiAgICAgIHBhcnRzLnB1c2goYCR7c2lnbn0gJHtNYXRoLmFicyhhc3NldHMpICogM31gKTtcclxuICAgIH1cclxuXHJcbiAgICBjeXBoZXJSb2xsKHtcclxuICAgICAgcGFydHMsXHJcblxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcG9vbCxcclxuICAgICAgICBhYmlsaXR5Q29zdDogMCxcclxuICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnQsXHJcbiAgICAgICAgYXNzZXRzXHJcbiAgICAgIH0sXHJcbiAgICAgIGV2ZW50LFxyXG5cclxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuc2tpbGwudGl0bGUnKSxcclxuICAgICAgZmxhdm9yOiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5yb2xsLnNraWxsLmZsYXZvcicpLnJlcGxhY2UoJyMjQUNUT1IjIycsIGFjdG9yLm5hbWUpLnJlcGxhY2UoJyMjUE9PTCMjJywgbmFtZSksXHJcblxyXG4gICAgICBhY3RvcixcclxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfYWJpbGl0eVJvbGwoKSB7XHJcbiAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XHJcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XHJcblxyXG4gICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzO1xyXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgaXNFbmFibGVyLCBjb3N0IH0gPSBpdGVtLmRhdGE7XHJcblxyXG4gICAgaWYgKCFpc0VuYWJsZXIpIHtcclxuICAgICAgY29uc3QgeyBwb29sIH0gPSBjb3N0O1xyXG5cclxuICAgICAgaWYgKGFjdG9yLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgcGFyc2VJbnQoY29zdC5hbW91bnQsIDEwKSkpIHtcclxuICAgICAgICBjeXBoZXJSb2xsKHtcclxuICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgcGFydHM6IFsnMWQyMCddLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBwb29sLFxyXG4gICAgICAgICAgICBhYmlsaXR5Q29zdDogY29zdC5hbW91bnQsXHJcbiAgICAgICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcclxuICAgICAgICAgIGZsYXZvcjogYCR7YWN0b3IubmFtZX0gdXNlZCAke25hbWV9YCxcclxuICAgICAgICAgIHRpdGxlOiAnVXNlIEFiaWxpdHknLFxyXG4gICAgICAgICAgYWN0b3JcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuICAgICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcclxuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcclxuICAgICAgICAgIGZsYXZvcjogJ0FiaWxpdHkgRmFpbGVkJyxcclxuICAgICAgICAgIGNvbnRlbnQ6IGBOb3QgZW5vdWdoIHBvaW50cyBpbiAke3Bvb2xOYW1lfSBwb29sLmBcclxuICAgICAgICB9XSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xyXG4gICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcclxuICAgICAgICBmbGF2b3I6ICdJbnZhbGlkIEFiaWxpdHknLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBUaGlzIGFiaWxpdHkgaXMgYW4gRW5hYmxlciBhbmQgY2Fubm90IGJlIHJvbGxlZCBmb3IuYFxyXG4gICAgICB9XSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByb2xsKCkge1xyXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgY2FzZSAnc2tpbGwnOlxyXG4gICAgICAgIHRoaXMuX3NraWxsUm9sbCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICB0aGlzLl9hYmlsaXR5Um9sbCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5mb1xyXG4gICAqL1xyXG5cclxuICBhc3luYyBfc2tpbGxJbmZvKCkge1xyXG4gICAgY29uc3Qgc2tpbGxEYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBza2lsbERhdGE7XHJcblxyXG4gICAgY29uc3QgdHJhaW5pbmcgPSBFbnVtVHJhaW5pbmdbc2tpbGxEYXRhLmRhdGEudHJhaW5pbmddO1xyXG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1tza2lsbERhdGEuZGF0YS5wb29sXTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IHNraWxsRGF0YS5uYW1lLFxyXG4gICAgICB0cmFpbmluZzogdHJhaW5pbmcudG9Mb3dlckNhc2UoKSxcclxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBub3RlczogZGF0YS5ub3RlcyxcclxuXHJcbiAgICAgIGluaXRpYXRpdmU6ICEhZGF0YS5mbGFncy5pbml0aWF0aXZlXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfYWJpbGl0eUluZm8oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1tkYXRhLmRhdGEuY29zdC5wb29sXTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBpc0VuYWJsZXI6IGRhdGEuZGF0YS5pc0VuYWJsZXIsXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FiaWxpdHktaW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9hcm1vckluZm8oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3Qgd2VpZ2h0ID0gRW51bVdlaWdodFtkYXRhLmRhdGEud2VpZ2h0XTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBlcXVpcHBlZDogZGF0YS5lcXVpcHBlZCxcclxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcclxuICAgICAgd2VpZ2h0OiB3ZWlnaHQudG9Mb3dlckNhc2UoKSxcclxuICAgICAgYXJtb3I6IGRhdGEuZGF0YS5hcm1vcixcclxuICAgICAgYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdDogZGF0YS5kYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsXHJcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FybW9yLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfd2VhcG9uSW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCB3ZWlnaHQgPSBFbnVtV2VpZ2h0W2RhdGEuZGF0YS53ZWlnaHRdO1xyXG4gICAgY29uc3QgcmFuZ2UgPSBFbnVtUmFuZ2VbZGF0YS5kYXRhLnJhbmdlXTtcclxuICAgIGNvbnN0IGNhdGVnb3J5ID0gRW51bVdlYXBvbkNhdGVnb3J5W2RhdGEuZGF0YS5jYXRlZ29yeV07XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgZXF1aXBwZWQ6IGRhdGEuZXF1aXBwZWQsXHJcbiAgICAgIHF1YW50aXR5OiBkYXRhLmRhdGEucXVhbnRpdHksXHJcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIHJhbmdlOiByYW5nZS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgZGFtYWdlOiBkYXRhLmRhdGEuZGFtYWdlLFxyXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxyXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby93ZWFwb24taW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9nZWFySW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBxdWFudGl0eTogZGF0YS5kYXRhLnF1YW50aXR5LFxyXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxyXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfY3lwaGVySW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBpc0dNOiBnYW1lLnVzZXIuaXNHTSxcclxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXHJcbiAgICAgIGxldmVsOiBkYXRhLmRhdGEubGV2ZWwsXHJcbiAgICAgIGZvcm06IGRhdGEuZGF0YS5mb3JtLFxyXG4gICAgICBlZmZlY3Q6IGRhdGEuZGF0YS5lZmZlY3QsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2N5cGhlci1pbmZvLmh0bWwnLCBwYXJhbXMpO1xyXG5cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2FydGlmYWN0SW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBpc0dNOiBnYW1lLnVzZXIuaXNHTSxcclxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXHJcbiAgICAgIGxldmVsOiBkYXRhLmRhdGEubGV2ZWwsXHJcbiAgICAgIGZvcm06IGRhdGEuZGF0YS5mb3JtLFxyXG4gICAgICBpc0RlcGxldGluZzogZGF0YS5kYXRhLmRlcGxldGlvbi5pc0RlcGxldGluZyxcclxuICAgICAgZGVwbGV0aW9uVGhyZXNob2xkOiBkYXRhLmRhdGEuZGVwbGV0aW9uLnRocmVzaG9sZCxcclxuICAgICAgZGVwbGV0aW9uRGllOiBkYXRhLmRhdGEuZGVwbGV0aW9uLmRpZSxcclxuICAgICAgZWZmZWN0OiBkYXRhLmRhdGEuZWZmZWN0LFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcnRpZmFjdC1pbmZvLmh0bWwnLCBwYXJhbXMpO1xyXG5cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX29kZGl0eUluZm8oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXHJcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcclxuICAgIH07XHJcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vb2RkaXR5LWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJbmZvKCkge1xyXG4gICAgbGV0IGh0bWwgPSAnJztcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICBjYXNlICdza2lsbCc6XHJcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX3NraWxsSW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYWJpbGl0eUluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJtb3InOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hcm1vckluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnd2VhcG9uJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fd2VhcG9uSW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdnZWFyJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fZ2VhckluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnY3lwaGVyJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fY3lwaGVySW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcnRpZmFjdCc6XHJcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FydGlmYWN0SW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdvZGRpdHknOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9vZGRpdHlJbmZvKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG59XHJcbiIsIi8qIGdsb2JhbHMgcmVuZGVyVGVtcGxhdGUgKi9cclxuXHJcbmltcG9ydCB7IFJvbGxEaWFsb2cgfSBmcm9tICcuL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyc7XHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4vZW51bXMvZW51bS1wb29sLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsVGV4dChkaWVSb2xsLCByb2xsVG90YWwpIHtcclxuICBsZXQgcGFydHMgPSBbXTtcclxuXHJcbiAgY29uc3QgdGFza0xldmVsID0gTWF0aC5mbG9vcihyb2xsVG90YWwgLyAzKTtcclxuICBjb25zdCBza2lsbExldmVsID0gTWF0aC5mbG9vcigocm9sbFRvdGFsIC0gZGllUm9sbCkgLyAzICsgMC41KTtcclxuICBjb25zdCB0b3RhbEFjaGlldmVkID0gdGFza0xldmVsICsgc2tpbGxMZXZlbDtcclxuXHJcbiAgbGV0IHRuQ29sb3IgPSAnIzAwMDAwMCc7XHJcbiAgaWYgKHRvdGFsQWNoaWV2ZWQgPCAzKSB7XHJcbiAgICB0bkNvbG9yID0gJyMwYTg2MGEnO1xyXG4gIH0gZWxzZSBpZiAodG90YWxBY2hpZXZlZCA8IDcpIHtcclxuICAgIHRuQ29sb3IgPSAnIzg0ODQwOSc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRuQ29sb3IgPSAnIzBhODYwYSc7XHJcbiAgfVxyXG5cclxuICBsZXQgc3VjY2Vzc1RleHQgPSBgPCR7dG90YWxBY2hpZXZlZH0+YDtcclxuICBpZiAoc2tpbGxMZXZlbCAhPT0gMCkge1xyXG4gICAgY29uc3Qgc2lnbiA9IHNraWxsTGV2ZWwgPiAwID8gXCIrXCIgOiBcIlwiO1xyXG4gICAgc3VjY2Vzc1RleHQgKz0gYCAoJHt0YXNrTGV2ZWx9JHtzaWdufSR7c2tpbGxMZXZlbH0pYDtcclxuICB9XHJcblxyXG4gIHBhcnRzLnB1c2goe1xyXG4gICAgdGV4dDogc3VjY2Vzc1RleHQsXHJcbiAgICBjb2xvcjogdG5Db2xvcixcclxuICAgIGNsczogJ3RhcmdldC1udW1iZXInXHJcbiAgfSlcclxuXHJcbiAgc3dpdGNoIChkaWVSb2xsKSB7XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIHBhcnRzLnB1c2goe1xyXG4gICAgICAgIHRleHQ6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmNoYXQuaW50cnVzaW9uJyksXHJcbiAgICAgICAgY29sb3I6ICcjMDAwMDAwJyxcclxuICAgICAgICBjbHM6ICdlZmZlY3QnXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuXHJcbiAgICBjYXNlIDE5OlxyXG4gICAgICBwYXJ0cy5wdXNoKHtcclxuICAgICAgICB0ZXh0OiBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5jaGF0LmVmZmVjdC5taW5vcicpLFxyXG4gICAgICAgIGNvbG9yOiAnIzAwMDAwMCcsXHJcbiAgICAgICAgY2xzOiAnZWZmZWN0J1xyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcblxyXG4gICAgY2FzZSAyMDpcclxuICAgICAgcGFydHMucHVzaCh7XHJcbiAgICAgICAgdGV4dDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuY2hhdC5lZmZlY3QubWFqb3InKSxcclxuICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxyXG4gICAgICAgIGNsczogJ2VmZmVjdCdcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHBhcnRzO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3lwaGVyUm9sbCh7IHBhcnRzID0gW10sIGRhdGEgPSB7fSwgYWN0b3IgPSBudWxsLCBldmVudCA9IG51bGwsIHNwZWFrZXIgPSBudWxsLCBmbGF2b3IgPSBudWxsLCB0aXRsZSA9IG51bGwsIGl0ZW0gPSBmYWxzZSB9ID0ge30pIHtcclxuICBsZXQgcm9sbE1vZGUgPSBnYW1lLnNldHRpbmdzLmdldCgnY29yZScsICdyb2xsTW9kZScpO1xyXG4gIGxldCByb2xsZWQgPSBmYWxzZTtcclxuICBsZXQgZmlsdGVyZWQgPSBwYXJ0cy5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XHJcbiAgICByZXR1cm4gZWwgIT0gJycgJiYgZWw7XHJcbiAgfSk7XHJcblxyXG4gIGxldCBtYXhFZmZvcnQgPSAxO1xyXG4gIGlmIChkYXRhWydtYXhFZmZvcnQnXSkge1xyXG4gICAgbWF4RWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnbWF4RWZmb3J0J10sIDEwKSB8fCAxO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgX3JvbGwgPSAoZm9ybSA9IG51bGwpID0+IHtcclxuICAgIC8vIE9wdGlvbmFsbHkgaW5jbHVkZSBlZmZvcnRcclxuICAgIGlmIChmb3JtICE9PSBudWxsKSB7XHJcbiAgICAgIGRhdGFbJ2VmZm9ydCddID0gcGFyc2VJbnQoZm9ybS5lZmZvcnQudmFsdWUsIDEwKTtcclxuICAgIH1cclxuICAgIGlmIChkYXRhWydlZmZvcnQnXSkge1xyXG4gICAgICBmaWx0ZXJlZC5wdXNoKGArJHtkYXRhWydlZmZvcnQnXSAqIDN9YCk7XHJcblxyXG4gICAgICAvLyBUT0RPOiBGaW5kIGEgYmV0dGVyIHdheSB0byBsb2NhbGl6ZSB0aGlzLCBjb25jYXRpbmcgc3RyaW5ncyBkb2Vzbid0IHdvcmsgZm9yIGFsbCBsYW5ndWFnZXNcclxuICAgICAgZmxhdm9yICs9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZWZmb3J0LmZsYXZvcicpLnJlcGxhY2UoJyMjRUZGT1JUIyMnLCBkYXRhWydlZmZvcnQnXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgcm9sbCA9IG5ldyBSb2xsKGZpbHRlcmVkLmpvaW4oJycpLCBkYXRhKS5yb2xsKCk7XHJcbiAgICAvLyBDb252ZXJ0IHRoZSByb2xsIHRvIGEgY2hhdCBtZXNzYWdlIGFuZCByZXR1cm4gdGhlIHJvbGxcclxuICAgIHJvbGxNb2RlID0gZm9ybSA/IGZvcm0ucm9sbE1vZGUudmFsdWUgOiByb2xsTW9kZTtcclxuICAgIHJvbGxlZCA9IHRydWU7XHJcblxyXG4gICAgcmV0dXJuIHJvbGw7XHJcbiAgfVxyXG5cclxuICBjb25zdCB0ZW1wbGF0ZSA9ICdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9kaWFsb2cvcm9sbC1kaWFsb2cuaHRtbCc7XHJcbiAgbGV0IGRpYWxvZ0RhdGEgPSB7XHJcbiAgICBmb3JtdWxhOiBmaWx0ZXJlZC5qb2luKCcgJyksXHJcbiAgICBtYXhFZmZvcnQ6IG1heEVmZm9ydCxcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICByb2xsTW9kZTogcm9sbE1vZGUsXHJcbiAgICByb2xsTW9kZXM6IENPTkZJRy5EaWNlLnJvbGxNb2Rlc1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGlhbG9nRGF0YSk7XHJcbiAgLy9DcmVhdGUgRGlhbG9nIHdpbmRvd1xyXG4gIGxldCByb2xsO1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgIG5ldyBSb2xsRGlhbG9nKHtcclxuICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICBjb250ZW50OiBodG1sLFxyXG4gICAgICBidXR0b25zOiB7XHJcbiAgICAgICAgb2s6IHtcclxuICAgICAgICAgIGxhYmVsOiAnT0snLFxyXG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXHJcbiAgICAgICAgICBjYWxsYmFjazogKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgcm9sbCA9IF9yb2xsKGh0bWxbMF0uY2hpbGRyZW5bMF0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVE9ETzogY2hlY2sgcm9sbC5yZXN1bHQgYWdhaW5zdCB0YXJnZXQgbnVtYmVyXHJcblxyXG4gICAgICAgICAgICBjb25zdCB7IHBvb2wgfSA9IGRhdGE7XHJcbiAgICAgICAgICAgIGNvbnN0IGFtb3VudE9mRWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnZWZmb3J0J10gfHwgMCwgMTApO1xyXG4gICAgICAgICAgICBjb25zdCBlZmZvcnRDb3N0ID0gYWN0b3IuZ2V0RWZmb3J0Q29zdEZyb21TdGF0KHBvb2wsIGFtb3VudE9mRWZmb3J0KTtcclxuICAgICAgICAgICAgY29uc3QgdG90YWxDb3N0ID0gcGFyc2VJbnQoZGF0YVsnYWJpbGl0eUNvc3QnXSB8fCAwLCAxMCkgKyBwYXJzZUludChlZmZvcnRDb3N0LmNvc3QsIDEwKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCkgJiYgIWVmZm9ydENvc3Qud2FybmluZykge1xyXG4gICAgICAgICAgICAgIHJvbGwudG9NZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHNwZWFrZXI6IHNwZWFrZXIsXHJcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGZsYXZvclxyXG4gICAgICAgICAgICAgIH0sIHsgcm9sbE1vZGUgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGFjdG9yLnNwZW5kRnJvbVBvb2wocG9vbCwgdG90YWxDb3N0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuICAgICAgICAgICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcclxuICAgICAgICAgICAgICAgIHNwZWFrZXIsXHJcbiAgICAgICAgICAgICAgICBmbGF2b3I6IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnJvbGwuZmFpbGVkLmZsYXZvcicpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1Iucm9sbC5mYWlsZWQuY29udGVudCcpLnJlcGxhY2UoJyMjUE9PTCMjJywgcG9vbE5hbWUpXHJcbiAgICAgICAgICAgICAgfV0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGNhbmNlbDoge1xyXG4gICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPicsXHJcbiAgICAgICAgICBsYWJlbDogJ0NhbmNlbCcsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgZGVmYXVsdDogJ29rJyxcclxuICAgICAgY2xvc2U6ICgpID0+IHtcclxuICAgICAgICByZXNvbHZlKHJvbGxlZCA/IHJvbGwgOiBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH0pLnJlbmRlcih0cnVlKTtcclxuICB9KTtcclxufVxyXG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJTeXN0ZW1TZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8qKlxyXG4gICAqIENvbmZpZ3VyZSB0aGUgY3VycmVuY3kgbmFtZVxyXG4gICAqL1xyXG4gIGdhbWUuc2V0dGluZ3MucmVnaXN0ZXIoJ2N5cGhlcnN5c3RlbUNsZWFuJywgJ2N1cnJlbmN5TmFtZScsIHtcclxuICAgIG5hbWU6ICdTRVRUSU5HUy5uYW1lLmN1cnJlbmN5TmFtZScsXHJcbiAgICBoaW50OiAnU0VUVElOR1MuaGludC5jdXJyZW5jeU5hbWUnLFxyXG4gICAgc2NvcGU6ICd3b3JsZCcsXHJcbiAgICBjb25maWc6IHRydWUsXHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnTW9uZXknXHJcbiAgfSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgR01JbnRydXNpb25EaWFsb2cgfSBmcm9tIFwiLi9kaWFsb2cvZ20taW50cnVzaW9uLWRpYWxvZy5qc1wiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNzclNvY2tldExpc3RlbmVycygpIHtcclxuICBnYW1lLnNvY2tldC5vbignc3lzdGVtLmN5cGhlcnN5c3RlbUNsZWFuJywgaGFuZGxlTWVzc2FnZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoYXJncykge1xyXG4gIGNvbnN0IHsgdHlwZSB9ID0gYXJncztcclxuXHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlICdnbUludHJ1c2lvbic6XHJcbiAgICAgIGhhbmRsZUdNSW50cnVzaW9uKGFyZ3MpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ2F3YXJkWFAnOlxyXG4gICAgICBoYW5kbGVBd2FyZFhQKGFyZ3MpO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUdNSW50cnVzaW9uKGFyZ3MpIHtcclxuICBjb25zdCB7IGRhdGEgfSA9IGFyZ3M7XHJcbiAgY29uc3QgeyBhY3RvcklkLCB1c2VySWRzIH0gPSBkYXRhO1xyXG5cclxuICBpZiAoIWdhbWUucmVhZHkgfHwgZ2FtZS51c2VyLmlzR00gfHwgIXVzZXJJZHMuZmluZChpZCA9PiBpZCA9PT0gZ2FtZS51c2VySWQpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmVudGl0aWVzLmZpbmQoYSA9PiBhLmRhdGEuX2lkID09PSBhY3RvcklkKTtcclxuICBjb25zdCBkaWFsb2cgPSBuZXcgR01JbnRydXNpb25EaWFsb2coYWN0b3IpO1xyXG4gIGRpYWxvZy5yZW5kZXIodHJ1ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUF3YXJkWFAoYXJncykge1xyXG4gIGNvbnN0IHsgZGF0YSB9ID0gYXJncztcclxuICBjb25zdCB7IGFjdG9ySWQsIHhwQW1vdW50IH0gPSBkYXRhO1xyXG5cclxuICBpZiAoIWdhbWUucmVhZHkgfHwgIWdhbWUudXNlci5pc0dNKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBjb25zdCBhY3RvciA9IGdhbWUuYWN0b3JzLmdldChhY3RvcklkKTtcclxuICBhY3Rvci51cGRhdGUoe1xyXG4gICAgJ2RhdGEueHAnOiBhY3Rvci5kYXRhLmRhdGEueHAgKyB4cEFtb3VudFxyXG4gIH0pO1xyXG5cclxuICBDaGF0TWVzc2FnZS5jcmVhdGUoe1xyXG4gICAgY29udGVudDogZ2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW50cnVzaW9uLmF3YXJkWFAnKS5yZXBsYWNlKCcjI0FDVE9SIyMnLCBhY3Rvci5kYXRhLm5hbWUpXHJcbiAgfSk7XHJcbn1cclxuIiwiLyogZ2xvYmFscyBsb2FkVGVtcGxhdGVzICovXHJcblxyXG4vKipcclxuICogRGVmaW5lIGEgc2V0IG9mIHRlbXBsYXRlIHBhdGhzIHRvIHByZS1sb2FkXHJcbiAqIFByZS1sb2FkZWQgdGVtcGxhdGVzIGFyZSBjb21waWxlZCBhbmQgY2FjaGVkIGZvciBmYXN0IGFjY2VzcyB3aGVuIHJlbmRlcmluZ1xyXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzID0gYXN5bmMoKSA9PiB7XHJcbiAgLy8gRGVmaW5lIHRlbXBsYXRlIHBhdGhzIHRvIGxvYWRcclxuICBjb25zdCB0ZW1wbGF0ZVBhdGhzID0gW1xyXG5cclxuICAgICAgLy8gQWN0b3IgU2hlZXRzXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGMtc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL25wYy1zaGVldC5odG1sXCIsXHJcblxyXG4gICAgICAvLyBBY3RvciBQYXJ0aWFsc1xyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3Bvb2xzLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9hZHZhbmNlbWVudC5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvZGFtYWdlLXRyYWNrLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9yZWNvdmVyeS5odG1sXCIsXHJcblxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3NraWxscy5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvYWJpbGl0aWVzLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbnZlbnRvcnkuaHRtbFwiLFxyXG5cclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FybW9yLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vd2VhcG9uLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vZ2Vhci1pbmZvLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2N5cGhlci1pbmZvLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FydGlmYWN0LWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vb2RkaXR5LWluZm8uaHRtbFwiLFxyXG5cclxuICAgICAgLy8gSXRlbSBTaGVldHNcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2l0ZW0tc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vc2tpbGwtc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vYXJtb3Itc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vd2VhcG9uLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2dlYXItc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vY3lwaGVyLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2FydGlmYWN0LXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL29kZGl0eS1zaGVldC5odG1sXCIsXHJcblxyXG4gICAgICAvLyBEaWFsb2dzXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvZGlhbG9nL3JvbGwtZGlhbG9nLmh0bWxcIixcclxuICBdO1xyXG5cclxuICAvLyBMb2FkIHRoZSB0ZW1wbGF0ZSBwYXJ0c1xyXG4gIHJldHVybiBsb2FkVGVtcGxhdGVzKHRlbXBsYXRlUGF0aHMpO1xyXG59O1xyXG4iLCJleHBvcnQgZnVuY3Rpb24gZGVlcFByb3Aob2JqLCBwYXRoKSB7XHJcbiAgY29uc3QgcHJvcHMgPSBwYXRoLnNwbGl0KCcuJyk7XHJcbiAgbGV0IHZhbCA9IG9iajtcclxuICBwcm9wcy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgaWYgKHAgaW4gdmFsKSB7XHJcbiAgICAgIHZhbCA9IHZhbFtwXTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gdmFsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbCkge1xyXG4gIHJldHVybiAhKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2YWxPckRlZmF1bHQodmFsLCBkZWYpIHtcclxuICByZXR1cm4gaXNEZWZpbmVkKHZhbCkgPyB2YWwgOiBkZWY7XHJcbn1cclxuIiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheUxpa2VUb0FycmF5OyIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkOyIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwidmFyIHN1cGVyUHJvcEJhc2UgPSByZXF1aXJlKFwiLi9zdXBlclByb3BCYXNlXCIpO1xuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IFJlZmxlY3QuZ2V0O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICAgIHZhciBiYXNlID0gc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmICghYmFzZSkgcmV0dXJuO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTtcblxuICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dldDsiLCJmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0UHJvdG90eXBlT2Y7IiwidmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vc2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW5oZXJpdHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgX3R5cGVvZiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIGFzc2VydFRoaXNJbml0aWFsaXplZCA9IHJlcXVpcmUoXCIuL2Fzc2VydFRoaXNJbml0aWFsaXplZFwiKTtcblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIGFzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjsiLCJmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZjsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuL2dldFByb3RvdHlwZU9mXCIpO1xuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhaztcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3N1cGVyUHJvcEJhc2U7IiwiZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iXX0=
