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
    key: "template",

    /**
     * Get the correct HTML template path to use for rendering this particular sheet
     * @type {String}
     */
    get: function get() {
      return "systems/cyphersystemClean/templates/actor/pc-sheet.html";
    }
    /* -------------------------------------------- */

  }], [{
    key: "defaultOptions",

    /** @override */
    get: function get() {
      return mergeObject((0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet), "defaultOptions", this), {
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
  }]);

  function CypherSystemActorSheet() {
    var _this;

    (0, _classCallCheck2.default)(this, CypherSystemActorSheet);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    _this.skillsPoolFilter = -1;
    _this.skillsTrainingFilter = -1;
    _this.selectedSkill = null;
    _this.abilityPoolFilter = -1;
    _this.selectedAbility = null;
    _this.inventoryTypeFilter = -1;
    _this.selectedInvItem = null;
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

                data.inventoryTypeFilter = this.inventoryTypeFilter;

                if (data.inventoryTypeFilter > -1) {
                  this._filterItemData(data, 'inventory', 'type', _config.CSR.inventoryTypes[parseInt(data.inventoryTypeFilter, 10)]);
                }

                data.selectedInvItem = this.selectedInvItem;
                data.invItemInfo = '';

                if (!data.selectedInvItem) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 10;
                return data.selectedInvItem.getInfo();

              case 10:
                data.invItemInfo = _context3.sent;

              case 11:
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
    /** @override */

  }, {
    key: "getData",
    value: (function () {
      var _getData = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee4() {
        var data;
        return _regenerator.default.wrap((function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet.prototype), "getData", this).call(this);
                data.isGM = game.user.isGM;
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
                    label: _config.CSR.advances[key],
                    isChecked: value
                  };
                }));
                data.damageTrackData = _config.CSR.damageTrack;
                data.damageTrackDescription = _config.CSR.damageTrack[data.data.damageTrack].description;
                data.recoveriesData = Object.entries(data.actor.data.recoveries).map((function (_ref3) {
                  var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
                      key = _ref4[0],
                      value = _ref4[1];

                  return {
                    key: key,
                    label: _config.CSR.recoveries[key],
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
                return _context4.abrupt("return", data);

              case 19:
              case "end":
                return _context4.stop();
            }
          }
        }), _callee4, this);
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

      _rolls.CypherRolls.Roll({
        event: event,
        parts: ['1d20'],
        data: {
          pool: pool,
          maxEffort: actorData.effort
        },
        speaker: ChatMessage.getSpeaker({
          actor: actor
        }),
        flavor: "".concat(actor.name, " used ").concat(poolName),
        title: 'Use Pool',
        actor: actor
      });
    }
  }, {
    key: "_deleteItemDialog",
    value: function _deleteItemDialog(itemId, _callback) {
      var _this2 = this;

      var confirmationDialog = new Dialog({
        title: game.i18n.localize("CSR.dialog.deleteTitle"),
        content: "<p>".concat(game.i18n.localize("CSR.dialog.deleteContent"), "</p><hr />"),
        buttons: {
          confirm: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("CSR.dialog.deleteButton"),
            callback: function callback() {
              _this2.actor.deleteOwnedItem(itemId);

              if (_callback) {
                _callback(true);
              }
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("CSR.dialog.cancelButton"),
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

      // Abilities Setup
      html.find('.add-inventory').click((function (evt) {
        evt.preventDefault(); // TODO: Context menu to choose item type
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
    /** @override */

  }, {
    key: "activateListeners",
    value: function activateListeners(html) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet.prototype), "activateListeners", this).call(this, html);

      if (!this.options.editable) {
        return;
      } // Hack, for some reason the inner tab's content doesn't show 
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
  }]);
  return CypherSystemActorSheet;
})(ActorSheet);

exports.CypherSystemActorSheet = CypherSystemActorSheet;

},{"../config.js":3,"../enums/enum-pool.js":6,"../item/item.js":13,"../rolls.js":14,"../utils.js":16,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/get":23,"@babel/runtime/helpers/getPrototypeOf":24,"@babel/runtime/helpers/inherits":25,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/helpers/possibleConstructorReturn":29,"@babel/runtime/helpers/slicedToArray":31,"@babel/runtime/regenerator":36}],2:[function(require,module,exports){
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

var _enumPool = _interopRequireDefault(require("../enums/enum-pool.js"));

var _config = require("../config.js");

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
      var data = actorData.data; // Make modifications to data here. For example:
      // Loop through ability scores, and add their modifiers to our sheet output.
      // for (let [key, ability] of Object.entries(data.abilities)) {
      //   // Calculate the modifier using d20 rules.
      //   ability.mod = Math.floor((ability.value - 10) / 2);
      // }
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
      var flags = actorData.flags; // Make separate methods for each Actor type (character, npc, etc.) to keep
      // things organized.

      if (actorData.type === 'pc') {
        this._preparePCData(actorData);
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
    /**
     * @override
     */

  }, {
    key: "createEmbeddedEntity",
    value: (function () {
      var _createEmbeddedEntity = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
        var _get2;

        var _len,
            args,
            _key,
            _,
            data,
            itemData,
            _args = arguments;

        return _regenerator.default.wrap((function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }

                _ = args[0], data = args[1]; // Roll the "level die" to determine the item's level, if possible

                if (!(data.data && _config.CSR.hasLevelDie.includes(data.type))) {
                  _context.next = 17;
                  break;
                }

                itemData = data.data;

                if (!(!itemData.level && itemData.levelDie)) {
                  _context.next = 16;
                  break;
                }

                _context.prev = 5;
                // See if the formula is valid
                itemData.level = new Roll(itemData.levelDie).roll().total;
                _context.next = 9;
                return this.update({
                  _id: this._id,
                  "data.level": itemData.level
                });

              case 9:
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](5);
                // If not, fallback to sane default
                itemData.level = itemData.level || null;

              case 14:
                _context.next = 17;
                break;

              case 16:
                itemData.level = itemData.level || null;

              case 17:
                return _context.abrupt("return", (_get2 = (0, _get3.default)((0, _getPrototypeOf2.default)(CypherSystemActor.prototype), "createEmbeddedEntity", this)).call.apply(_get2, [this].concat(args)));

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }), _callee, this, [[5, 11]]);
      })));

      function createEmbeddedEntity() {
        return _createEmbeddedEntity.apply(this, arguments);
      }

      return createEmbeddedEntity;
    })()
  }]);
  return CypherSystemActor;
})(Actor);

exports.CypherSystemActor = CypherSystemActor;

},{"../config.js":3,"../enums/enum-pool.js":6,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/get":23,"@babel/runtime/helpers/getPrototypeOf":24,"@babel/runtime/helpers/inherits":25,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/helpers/possibleConstructorReturn":29,"@babel/runtime/regenerator":36}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSR = void 0;
var CSR = {};
exports.CSR = CSR;
CSR.itemTypes = ['skills', 'abilities', 'cyphers', 'artifacts', 'oddities', 'weapons', 'armor', 'gear'];
CSR.inventoryTypes = ['weapon', 'armor', 'gear', 'cypher', 'artifact', 'oddity'];
CSR.weightClasses = ['Light', 'Medium', 'Heavy'];
CSR.weaponTypes = ['Bashing', 'Bladed', 'Ranged'];
CSR.stats = ['Might', 'Speed', 'Intellect'];
CSR.trainingLevels = ['Inability', 'Untrained', 'Trained', 'Specialized'];
CSR.damageTrack = [{
  label: 'Hale',
  description: 'Normal state for a character.'
}, {
  label: 'Impaired',
  description: 'In a wounded or injured state. Applying Effort costs 1 extra point per effort level applied.'
}, {
  label: 'Debilitated',
  description: 'In a critically injured state. The character can do no other action than to crawl an immediate distance; if their Speed pool is 0, they cannot move at all.'
}, {
  label: 'Dead',
  description: 'The character is dead.'
}];
CSR.recoveries = {
  'action': '1 Action',
  'tenMins': '10 mins',
  'oneHour': '1 hour',
  'tenHours': '10 hours'
};
CSR.advances = {
  'stats': '+4 to stat pools',
  'edge': '+1 to Edge',
  'effort': '+1 to Effort',
  'skills': 'Train/specialize skill',
  'other': 'Other'
};
CSR.ranges = ['Immediate', 'Short', 'Long', 'Very Long'];
CSR.optionalRanges = ["N/A"].concat(CSR.ranges);
CSR.abilityTypes = ['Action', 'Enabler'];
CSR.supportsMacros = ['skill', 'ability'];
CSR.hasLevelDie = ['cypher', 'artifact'];

},{}],4:[function(require,module,exports){
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

          CONFIG.Combat.initiative = {
            formula: "1d20",
            decimals: 2
          }; // Define custom Entity classes

          CONFIG.Actor.entityClass = _actor.CypherSystemActor;
          CONFIG.Item.entityClass = _item.CypherSystemItem; // Register sheet application classes

          Actors.unregisterSheet("core", ActorSheet);
          Actors.registerSheet('cyphersystemClean', _actorSheet.CypherSystemActorSheet, {
            types: ['pc'],
            makeDefault: true
          });
          Actors.registerSheet('cyphersystemClean', _actorSheet.CypherSystemActorSheet, {
            types: ['npc'],
            makeDefault: true
          });
          Items.unregisterSheet("core", ItemSheet);
          Items.registerSheet("cyphersystemClean", _itemSheet.CypherSystemItemSheet, {
            makeDefault: true
          });
          (0, _handlebarsHelpers.registerHandlebarHelpers)();
          (0, _template.preloadHandlebarsTemplates)();

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }), _callee);
}))));

},{"./actor/actor-sheet.js":1,"./actor/actor.js":2,"./handlebars-helpers.js":11,"./item/item-sheet.js":12,"./item/item.js":13,"./template.js":15,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/regenerator":36}],5:[function(require,module,exports){
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

},{"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/get":23,"@babel/runtime/helpers/getPrototypeOf":24,"@babel/runtime/helpers/inherits":25,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/helpers/possibleConstructorReturn":29}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumPool = ["Might", "Speed", "Intellect"];
var _default = EnumPool;
exports.default = _default;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumRange = ["Immediate", "Short", "Long", "Very Long"];
var _default = EnumRange;
exports.default = _default;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumTraining = ["Inability", "Untrained", "Trained", "Specialized"];
var _default = EnumTraining;
exports.default = _default;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumWeaponCategory = ["Bladed", "Bashing", "Ranged"];
var _default = EnumWeaponCategory;
exports.default = _default;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EnumWeight = ["Light", "Medium", "Heavy"];
var _default = EnumWeight;
exports.default = _default;

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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
      data.data.ranges = _config.CSR.optionalRanges;
      data.data.stats = _config.CSR.stats;
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
        height: 200,
        tabs: [{
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description"
        }],
        scrollY: ['.tab.inventory .inventory-list', '.tab.inventory .inventory-info']
      });
    }
  }]);
  return CypherSystemItemSheet;
})(ItemSheet);

exports.CypherSystemItemSheet = CypherSystemItemSheet;

},{"../config.js":3,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/get":23,"@babel/runtime/helpers/getPrototypeOf":24,"@babel/runtime/helpers/inherits":25,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/helpers/possibleConstructorReturn":29}],13:[function(require,module,exports){
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
    }
    /**
     * Augment the basic Item data model with additional dynamic data.
     */

  }, {
    key: "prepareData",
    value: function prepareData() {
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItem.prototype), "prepareData", this).call(this);

      if (this.type === 'skill') {
        this._prepareSkillData();
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

      _rolls.CypherRolls.Roll({
        event: event,
        parts: parts,
        data: {
          pool: pool,
          abilityCost: 0,
          maxEffort: actorData.effort,
          assets: assets
        },
        speaker: ChatMessage.getSpeaker({
          actor: actor
        }),
        flavor: "".concat(actor.name, " used ").concat(name),
        title: 'Use Skill',
        actor: actor
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
          _rolls.CypherRolls.Roll({
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
        var data, training, pool, params, html;
        return _regenerator.default.wrap((function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = this.data;
                training = _enumTraining.default[data.data.training];
                pool = _enumPool.default[data.data.pool];
                params = {
                  name: data.name,
                  training: training.toLowerCase(),
                  pool: pool.toLowerCase(),
                  notes: data.data.notes
                };
                _context.next = 6;
                return renderTemplate('systems/cyphersystemClean/templates/actor/partials/info/skill-info.html', params);

              case 6:
                html = _context.sent;
                return _context.abrupt("return", html);

              case 8:
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

},{"../enums/enum-pool.js":6,"../enums/enum-range.js":7,"../enums/enum-training.js":8,"../enums/enum-weapon-category.js":9,"../enums/enum-weight.js":10,"../rolls.js":14,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/get":23,"@babel/runtime/helpers/getPrototypeOf":24,"@babel/runtime/helpers/inherits":25,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/helpers/possibleConstructorReturn":29,"@babel/runtime/regenerator":36}],14:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherRolls = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _rollDialog = require("./dialog/roll-dialog.js");

var _enumPool = _interopRequireDefault(require("./enums/enum-pool.js"));

/* globals renderTemplate */
var CypherRolls = /*#__PURE__*/(function () {
  function CypherRolls() {
    (0, _classCallCheck2.default)(this, CypherRolls);
  }

  (0, _createClass2.default)(CypherRolls, null, [{
    key: "Roll",
    value: (function (_Roll) {
      function Roll() {
        return _Roll.apply(this, arguments);
      }

      Roll.toString = function () {
        return _Roll.toString();
      };

      return Roll;
    })( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark((function _callee() {
      var _ref2,
          _ref2$parts,
          parts,
          _ref2$data,
          data,
          _ref2$actor,
          actor,
          _ref2$event,
          event,
          _ref2$speaker,
          speaker,
          _ref2$flavor,
          flavor,
          _ref2$title,
          title,
          _ref2$item,
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
              _ref2 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, _ref2$parts = _ref2.parts, parts = _ref2$parts === void 0 ? [] : _ref2$parts, _ref2$data = _ref2.data, data = _ref2$data === void 0 ? {} : _ref2$data, _ref2$actor = _ref2.actor, actor = _ref2$actor === void 0 ? null : _ref2$actor, _ref2$event = _ref2.event, event = _ref2$event === void 0 ? null : _ref2$event, _ref2$speaker = _ref2.speaker, speaker = _ref2$speaker === void 0 ? null : _ref2$speaker, _ref2$flavor = _ref2.flavor, flavor = _ref2$flavor === void 0 ? null : _ref2$flavor, _ref2$title = _ref2.title, title = _ref2$title === void 0 ? null : _ref2$title, _ref2$item = _ref2.item, item = _ref2$item === void 0 ? false : _ref2$item;
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
                  filtered.push("+".concat(data['effort'] * 3));
                  flavor += " with ".concat(data['effort'], " Effort");
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
                            flavor: 'Roll Failed',
                            content: "Not enough points in ".concat(poolName, " pool.")
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
    }))))
  }]);
  return CypherRolls;
})();

exports.CypherRolls = CypherRolls;

},{"./dialog/roll-dialog.js":5,"./enums/enum-pool.js":6,"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/classCallCheck":21,"@babel/runtime/helpers/createClass":22,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/regenerator":36}],15:[function(require,module,exports){
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
            "systems/cyphersystemClean/templates/actor/actor-sheet.html", "systems/cyphersystemClean/templates/actor/pc-sheet.html", // Actor Partials
            "systems/cyphersystemClean/templates/actor/partials/pools.html", "systems/cyphersystemClean/templates/actor/partials/advancement.html", "systems/cyphersystemClean/templates/actor/partials/damage-track.html", "systems/cyphersystemClean/templates/actor/partials/recovery.html", "systems/cyphersystemClean/templates/actor/partials/skills.html", "systems/cyphersystemClean/templates/actor/partials/abilities.html", "systems/cyphersystemClean/templates/actor/partials/inventory.html", "systems/cyphersystemClean/templates/actor/partials/info/skill-info.html", "systems/cyphersystemClean/templates/actor/partials/info/ability-info.html", "systems/cyphersystemClean/templates/actor/partials/info/armor-info.html", "systems/cyphersystemClean/templates/actor/partials/info/weapon-info.html", "systems/cyphersystemClean/templates/actor/partials/info/gear-info.html", //Item Sheets
            "systems/cyphersystemClean/templates/item/item-sheet.html", "systems/cyphersystemClean/templates/item/skill-sheet.html", "systems/cyphersystemClean/templates/item/armor-sheet.html", "systems/cyphersystemClean/templates/item/weapon-sheet.html", "systems/cyphersystemClean/templates/item/gear-sheet.html"]; // Load the template parts

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

},{"@babel/runtime/helpers/asyncToGenerator":20,"@babel/runtime/helpers/interopRequireDefault":26,"@babel/runtime/regenerator":36}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepProp = deepProp;

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

},{}],17:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],18:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],19:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{"./superPropBase":32}],24:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],25:[function(require,module,exports){
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
},{"./setPrototypeOf":30}],26:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],29:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":33,"./assertThisInitialized":19}],30:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],31:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":18,"./iterableToArrayLimit":27,"./nonIterableRest":28,"./unsupportedIterableToArray":34}],32:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":24}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
},{"./arrayLikeToArray":17}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":35}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2N5cGhlcnN5c3RlbS5qcyIsIm1vZHVsZS9kaWFsb2cvcm9sbC1kaWFsb2cuanMiLCJtb2R1bGUvZW51bXMvZW51bS1wb29sLmpzIiwibW9kdWxlL2VudW1zL2VudW0tcmFuZ2UuanMiLCJtb2R1bGUvZW51bXMvZW51bS10cmFpbmluZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXdlYXBvbi1jYXRlZ29yeS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXdlaWdodC5qcyIsIm1vZHVsZS9oYW5kbGViYXJzLWhlbHBlcnMuanMiLCJtb2R1bGUvaXRlbS9pdGVtLXNoZWV0LmpzIiwibW9kdWxlL2l0ZW0vaXRlbS5qcyIsIm1vZHVsZS9yb2xscy5qcyIsIm1vZHVsZS90ZW1wbGF0ZS5qcyIsIm1vZHVsZS91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhIb2xlcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheUxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVSZXN0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3N1cGVyUHJvcEJhc2UuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBOzs7O0lBSWEsc0I7Ozs7Ozs7O0FBb0JYOzs7O3dCQUllO0FBQ2IsYUFBTyx5REFBUDtBQUNEO0FBRUQ7Ozs7O0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dEJBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0IERpYWxvZyAqL1xyXG5cclxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHsgQ3lwaGVyUm9sbHMgfSBmcm9tICcuLi9yb2xscy5qcyc7XHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tICcuLi9pdGVtL2l0ZW0uanMnO1xyXG5pbXBvcnQgeyBkZWVwUHJvcCB9IGZyb20gJy4uL3V0aWxzLmpzJztcclxuXHJcbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEFjdG9yU2hlZXQgd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnNcclxuICogQGV4dGVuZHMge0FjdG9yU2hlZXR9XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCBleHRlbmRzIEFjdG9yU2hlZXQge1xyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xyXG4gICAgICBjbGFzc2VzOiBbXCJjeXBoZXJzeXN0ZW1cIiwgXCJzaGVldFwiLCBcImFjdG9yXCJdLFxyXG4gICAgICB3aWR0aDogNjcyLFxyXG4gICAgICBoZWlnaHQ6IDYwMCxcclxuICAgICAgdGFiczogW3sgXHJcbiAgICAgICAgbmF2U2VsZWN0b3I6IFwiLnNoZWV0LXRhYnNcIiwgXHJcbiAgICAgICAgY29udGVudFNlbGVjdG9yOiBcIi5zaGVldC1ib2R5XCIsIFxyXG4gICAgICAgIGluaXRpYWw6IFwiZGVzY3JpcHRpb25cIiBcclxuICAgICAgfSwge1xyXG4gICAgICAgIG5hdlNlbGVjdG9yOiAnLnN0YXRzLXRhYnMnLFxyXG4gICAgICAgIGNvbnRlbnRTZWxlY3RvcjogJy5zdGF0cy1ib2R5JyxcclxuICAgICAgICBpbml0aWFsOiAnYWR2YW5jZW1lbnQnXHJcbiAgICAgIH1dXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCB0aGUgY29ycmVjdCBIVE1MIHRlbXBsYXRlIHBhdGggdG8gdXNlIGZvciByZW5kZXJpbmcgdGhpcyBwYXJ0aWN1bGFyIHNoZWV0XHJcbiAgICogQHR5cGUge1N0cmluZ31cclxuICAgKi9cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYy1zaGVldC5odG1sXCI7XHJcbiAgfVxyXG5cclxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XHJcbiAgICBzdXBlciguLi5hcmdzKTtcclxuXHJcbiAgICB0aGlzLnNraWxsc1Bvb2xGaWx0ZXIgPSAtMTtcclxuICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSAtMTtcclxuICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5hYmlsaXR5UG9vbEZpbHRlciA9IC0xO1xyXG4gICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IC0xO1xyXG4gICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgdHlwZSwgZmllbGQpIHtcclxuICAgIGNvbnN0IGl0ZW1zID0gZGF0YS5kYXRhLml0ZW1zO1xyXG4gICAgaWYgKCFpdGVtc1tmaWVsZF0pIHtcclxuICAgICAgaXRlbXNbZmllbGRdID0gaXRlbXMuZmlsdGVyKGkgPT4gaS50eXBlID09PSB0eXBlKTsgLy8uc29ydChzb3J0RnVuY3Rpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2ZpbHRlckl0ZW1EYXRhKGRhdGEsIGl0ZW1GaWVsZCwgZmlsdGVyRmllbGQsIGZpbHRlclZhbHVlKSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcclxuICAgIGl0ZW1zW2l0ZW1GaWVsZF0gPSBpdGVtc1tpdGVtRmllbGRdLmZpbHRlcihpdG0gPT4gZGVlcFByb3AoaXRtLCBmaWx0ZXJGaWVsZCkgPT09IGZpbHRlclZhbHVlKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9za2lsbERhdGEoZGF0YSkge1xyXG4gICAgdGhpcy5fZ2VuZXJhdGVJdGVtRGF0YShkYXRhLCAnc2tpbGwnLCAnc2tpbGxzJyk7XHJcblxyXG4gICAgZGF0YS5za2lsbHNQb29sRmlsdGVyID0gdGhpcy5za2lsbHNQb29sRmlsdGVyO1xyXG4gICAgZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXI7XHJcblxyXG4gICAgaWYgKGRhdGEuc2tpbGxzUG9vbEZpbHRlciA+IC0xKSB7XHJcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdza2lsbHMnLCAnZGF0YS5wb29sJywgcGFyc2VJbnQoZGF0YS5za2lsbHNQb29sRmlsdGVyLCAxMCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPiAtMSkge1xyXG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ2RhdGEudHJhaW5pbmcnLCBwYXJzZUludChkYXRhLnNraWxsc1RyYWluaW5nRmlsdGVyLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuc2VsZWN0ZWRTa2lsbCA9IHRoaXMuc2VsZWN0ZWRTa2lsbDtcclxuICAgIGRhdGEuc2tpbGxJbmZvID0gJyc7XHJcbiAgICBpZiAoZGF0YS5zZWxlY3RlZFNraWxsKSB7XHJcbiAgICAgIGRhdGEuc2tpbGxJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZFNraWxsLmdldEluZm8oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIF9hYmlsaXR5RGF0YShkYXRhKSB7XHJcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdhYmlsaXR5JywgJ2FiaWxpdGllcycpO1xyXG5cclxuICAgIGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPSB0aGlzLmFiaWxpdHlQb29sRmlsdGVyO1xyXG5cclxuICAgIGlmIChkYXRhLmFiaWxpdHlQb29sRmlsdGVyID4gLTEpIHtcclxuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ2FiaWxpdGllcycsICdkYXRhLmNvc3QucG9vbCcsIHBhcnNlSW50KGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIsIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZEFiaWxpdHkgPSB0aGlzLnNlbGVjdGVkQWJpbGl0eTtcclxuICAgIGRhdGEuYWJpbGl0eUluZm8gPSAnJztcclxuICAgIGlmIChkYXRhLnNlbGVjdGVkQWJpbGl0eSkge1xyXG4gICAgICBkYXRhLmFiaWxpdHlJbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZEFiaWxpdHkuZ2V0SW5mbygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2ludmVudG9yeURhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5pbnZlbnRvcnlUeXBlcyA9IENTUi5pbnZlbnRvcnlUeXBlcztcclxuXHJcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcclxuICAgIGlmICghaXRlbXMuaW52ZW50b3J5KSB7XHJcbiAgICAgIGl0ZW1zLmludmVudG9yeSA9IGl0ZW1zLmZpbHRlcihpID0+IENTUi5pbnZlbnRvcnlUeXBlcy5pbmNsdWRlcyhpLnR5cGUpKTtcclxuICAgICAgLy8gR3JvdXAgaXRlbXMgYnkgdGhlaXIgdHlwZVxyXG4gICAgICBpdGVtcy5pbnZlbnRvcnkuc29ydCgoYSwgYikgPT4gKGEudHlwZSA+IGIudHlwZSkgPyAxIDogLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuaW52ZW50b3J5VHlwZUZpbHRlciA9IHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlcjtcclxuXHJcbiAgICBpZiAoZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyID4gLTEpIHtcclxuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ2ludmVudG9yeScsICd0eXBlJywgQ1NSLmludmVudG9yeVR5cGVzW3BhcnNlSW50KGRhdGEuaW52ZW50b3J5VHlwZUZpbHRlciwgMTApXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZEludkl0ZW0gPSB0aGlzLnNlbGVjdGVkSW52SXRlbTtcclxuICAgIGRhdGEuaW52SXRlbUluZm8gPSAnJztcclxuICAgIGlmIChkYXRhLnNlbGVjdGVkSW52SXRlbSkge1xyXG4gICAgICBkYXRhLmludkl0ZW1JbmZvID0gYXdhaXQgZGF0YS5zZWxlY3RlZEludkl0ZW0uZ2V0SW5mbygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGFzeW5jIGdldERhdGEoKSB7XHJcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xyXG4gICAgXHJcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcclxuXHJcbiAgICBkYXRhLnJhbmdlcyA9IENTUi5yYW5nZXM7XHJcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xyXG4gICAgZGF0YS53ZWFwb25UeXBlcyA9IENTUi53ZWFwb25UeXBlcztcclxuICAgIGRhdGEud2VpZ2h0cyA9IENTUi53ZWlnaHRDbGFzc2VzO1xyXG5cclxuICAgIGRhdGEuYWR2YW5jZXMgPSBPYmplY3QuZW50cmllcyhkYXRhLmFjdG9yLmRhdGEuYWR2YW5jZXMpLm1hcChcclxuICAgICAgKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiBrZXksXHJcbiAgICAgICAgICBsYWJlbDogQ1NSLmFkdmFuY2VzW2tleV0sXHJcbiAgICAgICAgICBpc0NoZWNrZWQ6IHZhbHVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgZGF0YS5kYW1hZ2VUcmFja0RhdGEgPSBDU1IuZGFtYWdlVHJhY2s7XHJcbiAgICBkYXRhLmRhbWFnZVRyYWNrRGVzY3JpcHRpb24gPSBDU1IuZGFtYWdlVHJhY2tbZGF0YS5kYXRhLmRhbWFnZVRyYWNrXS5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICBkYXRhLnJlY292ZXJpZXNEYXRhID0gT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgIGRhdGEuYWN0b3IuZGF0YS5yZWNvdmVyaWVzXHJcbiAgICApLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAga2V5LFxyXG4gICAgICAgIGxhYmVsOiBDU1IucmVjb3Zlcmllc1trZXldLFxyXG4gICAgICAgIGNoZWNrZWQ6IHZhbHVlLFxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGF0YS50cmFpbmluZ0xldmVscyA9IENTUi50cmFpbmluZ0xldmVscztcclxuXHJcbiAgICBkYXRhLmRhdGEuaXRlbXMgPSBkYXRhLmFjdG9yLml0ZW1zIHx8IHt9O1xyXG5cclxuICAgIGF3YWl0IHRoaXMuX3NraWxsRGF0YShkYXRhKTtcclxuICAgIGF3YWl0IHRoaXMuX2FiaWxpdHlEYXRhKGRhdGEpO1xyXG4gICAgYXdhaXQgdGhpcy5faW52ZW50b3J5RGF0YShkYXRhKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIF9jcmVhdGVJdGVtKGl0ZW1OYW1lKSB7XHJcbiAgICBjb25zdCBpdGVtRGF0YSA9IHtcclxuICAgICAgbmFtZTogYE5ldyAke2l0ZW1OYW1lLmNhcGl0YWxpemUoKX1gLFxyXG4gICAgICB0eXBlOiBpdGVtTmFtZSxcclxuICAgICAgZGF0YTogbmV3IEN5cGhlclN5c3RlbUl0ZW0oe30pLFxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmFjdG9yLmNyZWF0ZU93bmVkSXRlbShpdGVtRGF0YSwgeyByZW5kZXJTaGVldDogdHJ1ZSB9KTtcclxuICB9XHJcblxyXG4gIF9yb2xsUG9vbERpYWxvZyhwb29sKSB7XHJcbiAgICBjb25zdCB7IGFjdG9yIH0gPSB0aGlzO1xyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xyXG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XHJcblxyXG4gICAgQ3lwaGVyUm9sbHMuUm9sbCh7XHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBwYXJ0czogWycxZDIwJ10sXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBwb29sLFxyXG4gICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydCxcclxuICAgICAgfSxcclxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxyXG4gICAgICBmbGF2b3I6IGAke2FjdG9yLm5hbWV9IHVzZWQgJHtwb29sTmFtZX1gLFxyXG4gICAgICB0aXRsZTogJ1VzZSBQb29sJyxcclxuICAgICAgYWN0b3JcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2RlbGV0ZUl0ZW1EaWFsb2coaXRlbUlkLCBjYWxsYmFjaykge1xyXG4gICAgY29uc3QgY29uZmlybWF0aW9uRGlhbG9nID0gbmV3IERpYWxvZyh7XHJcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmRlbGV0ZVRpdGxlXCIpLFxyXG4gICAgICBjb250ZW50OiBgPHA+JHtnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmRlbGV0ZUNvbnRlbnRcIil9PC9wPjxociAvPmAsXHJcbiAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICBjb25maXJtOiB7XHJcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcclxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmRlbGV0ZUJ1dHRvblwiKSxcclxuICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0b3IuZGVsZXRlT3duZWRJdGVtKGl0ZW1JZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+JyxcclxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmNhbmNlbEJ1dHRvblwiKSxcclxuICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZGVmYXVsdDogXCJjYW5jZWxcIlxyXG4gICAgfSk7XHJcbiAgICBjb25maXJtYXRpb25EaWFsb2cucmVuZGVyKHRydWUpO1xyXG4gIH1cclxuXHJcbiAgX3N0YXRzVGFiTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIC8vIFN0YXRzIFNldHVwXHJcbiAgICBodG1sLmZpbmQoJy5yb2xsLXBvb2wnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XHJcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5wb29sKSB7XHJcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZWwuZGF0YXNldDtcclxuXHJcbiAgICAgIHRoaXMuX3JvbGxQb29sRGlhbG9nKHBhcnNlSW50KHBvb2wsIDEwKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5kYW1hZ2VUcmFja1wiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMzBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIC8vIFNraWxscyBTZXR1cFxyXG4gICAgaHRtbC5maW5kKCcuYWRkLXNraWxsJykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9jcmVhdGVJdGVtKCdza2lsbCcpO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGNvbnN0IHNraWxsc1Bvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2tpbGxzUG9vbEZpbHRlclwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMzBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgICBza2lsbHNQb29sRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLnNraWxsc1Bvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2tpbGxzVHJhaW5pbmdGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gICAgc2tpbGxzVHJhaW5pbmdGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2tpbGxzID0gaHRtbC5maW5kKCdhLnNraWxsJyk7XHJcblxyXG4gICAgc2tpbGxzLm9uKCdjbGljaycsIGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcclxuXHJcbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XHJcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxyXG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQuaWQpIHtcclxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgc2tpbGxJZCA9IGVsLmRhdGFzZXQuaWQ7XHJcblxyXG4gICAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XHJcbiAgICAgIGNvbnN0IHNraWxsID0gYWN0b3IuZ2V0T3duZWRJdGVtKHNraWxsSWQpO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gc2tpbGw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB7IHNlbGVjdGVkU2tpbGwgfSA9IHRoaXM7XHJcbiAgICBpZiAoc2VsZWN0ZWRTa2lsbCkge1xyXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5yb2xsJykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgc2VsZWN0ZWRTa2lsbC5yb2xsKCk7XHJcbiAgICAgICAgLy8gdGhpcy5fcm9sbEl0ZW1EaWFsb2coc2VsZWN0ZWRTa2lsbC5kYXRhLmRhdGEucG9vbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbC5zaGVldC5yZW5kZXIodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAuZGVsZXRlJykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGVsZXRlSXRlbURpYWxvZyh0aGlzLnNlbGVjdGVkU2tpbGwuX2lkLCBkaWREZWxldGUgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9hYmlsaXR5VGFiTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIC8vIEFiaWxpdGllcyBTZXR1cFxyXG4gICAgaHRtbC5maW5kKCcuYWRkLWFiaWxpdHknKS5jbGljayhldnQgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHRoaXMuX2NyZWF0ZUl0ZW0oJ2FiaWxpdHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFiaWxpdHlQb29sRmlsdGVyID0gaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImFiaWxpdHlQb29sRmlsdGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICAgIGFiaWxpdHlQb29sRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLmFiaWxpdHlQb29sRmlsdGVyID0gZXZ0LnRhcmdldC52YWx1ZTtcclxuICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgYWJpbGl0aWVzID0gaHRtbC5maW5kKCdhLmFiaWxpdHknKTtcclxuXHJcbiAgICBhYmlsaXRpZXMub24oJ2NsaWNrJywgZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xyXG5cclxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcclxuICAgICAgLy8gQWNjb3VudCBmb3IgY2xpY2tpbmcgYSBjaGlsZCBlbGVtZW50XHJcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pZCkge1xyXG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBhYmlsaXR5SWQgPSBlbC5kYXRhc2V0LmlkO1xyXG5cclxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xyXG4gICAgICBjb25zdCBhYmlsaXR5ID0gYWN0b3IuZ2V0T3duZWRJdGVtKGFiaWxpdHlJZCk7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IGFiaWxpdHk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB7IHNlbGVjdGVkQWJpbGl0eSB9ID0gdGhpcztcclxuICAgIGlmIChzZWxlY3RlZEFiaWxpdHkpIHtcclxuICAgICAgaHRtbC5maW5kKCcuYWJpbGl0eS1pbmZvIC5hY3Rpb25zIC5yb2xsJykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgc2VsZWN0ZWRBYmlsaXR5LnJvbGwoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eS5zaGVldC5yZW5kZXIodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaHRtbC5maW5kKCcuYWJpbGl0eS1pbmZvIC5hY3Rpb25zIC5kZWxldGUnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZWxldGVJdGVtRGlhbG9nKHRoaXMuc2VsZWN0ZWRBYmlsaXR5Ll9pZCwgZGlkRGVsZXRlID0+IHtcclxuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEFiaWxpdHkgPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9pbnZlbnRvcnlUYWJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgLy8gQWJpbGl0aWVzIFNldHVwXHJcbiAgICBodG1sLmZpbmQoJy5hZGQtaW52ZW50b3J5JykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAvLyBUT0RPOiBDb250ZXh0IG1lbnUgdG8gY2hvb3NlIGl0ZW0gdHlwZVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgaW52ZW50b3J5VHlwZUZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJpbnZlbnRvcnlUeXBlRmlsdGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICAgIGludmVudG9yeVR5cGVGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuaW52ZW50b3J5VHlwZUZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbnZJdGVtID0gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGludkl0ZW1zID0gaHRtbC5maW5kKCdhLmludi1pdGVtJyk7XHJcblxyXG4gICAgaW52SXRlbXMub24oJ2NsaWNrJywgZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xyXG5cclxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcclxuICAgICAgLy8gQWNjb3VudCBmb3IgY2xpY2tpbmcgYSBjaGlsZCBlbGVtZW50XHJcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pZCkge1xyXG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbnZJdGVtSWQgPSBlbC5kYXRhc2V0LmlkO1xyXG5cclxuICAgICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xyXG4gICAgICBjb25zdCBpbnZJdGVtID0gYWN0b3IuZ2V0T3duZWRJdGVtKGludkl0ZW1JZCk7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IGludkl0ZW07XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB7IHNlbGVjdGVkSW52SXRlbSB9ID0gdGhpcztcclxuICAgIGlmIChzZWxlY3RlZEludkl0ZW0pIHtcclxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmVkaXQnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbS5zaGVldC5yZW5kZXIodHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaHRtbC5maW5kKCcuaW52ZW50b3J5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEludkl0ZW0uX2lkLCBkaWREZWxldGUgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmVkaXRhYmxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYWNrLCBmb3Igc29tZSByZWFzb24gdGhlIGlubmVyIHRhYidzIGNvbnRlbnQgZG9lc24ndCBzaG93IFxyXG4gICAgLy8gd2hlbiBjaGFuZ2luZyBwcmltYXJ5IHRhYnMgd2l0aGluIHRoZSBzaGVldFxyXG4gICAgaHRtbC5maW5kKCcuaXRlbVtkYXRhLXRhYj1cInN0YXRzXCJdJykuY2xpY2soKCkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZFN1YlRhYiA9IGh0bWwuZmluZCgnLnN0YXRzLXRhYnMgLml0ZW0uYWN0aXZlJykuZmlyc3QoKTtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJQYWdlID0gaHRtbC5maW5kKGAuc3RhdHMtYm9keSAudGFiW2RhdGEtdGFiPVwiJHtzZWxlY3RlZFN1YlRhYi5kYXRhKCd0YWInKX1cIl1gKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHNlbGVjdGVkU3ViUGFnZS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICB0aGlzLl9za2lsbHNUYWJMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICB0aGlzLl9hYmlsaXR5VGFiTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgdGhpcy5faW52ZW50b3J5VGFiTGlzdGVuZXJzKGh0bWwpO1xyXG4gIH1cclxufVxyXG4iLCIvKiBnbG9iYWwgQWN0b3I6ZmFsc2UgKi9cclxuXHJcbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcclxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQgdGhlIGJhc2UgQWN0b3IgZW50aXR5IGJ5IGRlZmluaW5nIGEgY3VzdG9tIHJvbGwgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggaXMgaWRlYWwgZm9yIHRoZSBTaW1wbGUgc3lzdGVtLlxyXG4gKiBAZXh0ZW5kcyB7QWN0b3J9XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3IgZXh0ZW5kcyBBY3RvciB7XHJcbiAgLyoqXHJcbiAgICogUHJlcGFyZSBDaGFyYWN0ZXIgdHlwZSBzcGVjaWZpYyBkYXRhXHJcbiAgICovXHJcbiAgX3ByZXBhcmVQQ0RhdGEoYWN0b3JEYXRhKSB7XHJcbiAgICBjb25zdCBkYXRhID0gYWN0b3JEYXRhLmRhdGE7XHJcblxyXG4gICAgLy8gTWFrZSBtb2RpZmljYXRpb25zIHRvIGRhdGEgaGVyZS4gRm9yIGV4YW1wbGU6XHJcblxyXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFiaWxpdHkgc2NvcmVzLCBhbmQgYWRkIHRoZWlyIG1vZGlmaWVycyB0byBvdXIgc2hlZXQgb3V0cHV0LlxyXG4gICAgLy8gZm9yIChsZXQgW2tleSwgYWJpbGl0eV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YS5hYmlsaXRpZXMpKSB7XHJcbiAgICAvLyAgIC8vIENhbGN1bGF0ZSB0aGUgbW9kaWZpZXIgdXNpbmcgZDIwIHJ1bGVzLlxyXG4gICAgLy8gICBhYmlsaXR5Lm1vZCA9IE1hdGguZmxvb3IoKGFiaWxpdHkudmFsdWUgLSAxMCkgLyAyKTtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIGFjdG9yIGRhdGEgd2l0aCBhZGRpdGlvbmFsIGR5bmFtaWMgZGF0YS5cclxuICAgKi9cclxuICBwcmVwYXJlRGF0YSgpIHtcclxuICAgIHN1cGVyLnByZXBhcmVEYXRhKCk7XHJcblxyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgZGF0YSA9IGFjdG9yRGF0YS5kYXRhO1xyXG4gICAgY29uc3QgZmxhZ3MgPSBhY3RvckRhdGEuZmxhZ3M7XHJcblxyXG4gICAgLy8gTWFrZSBzZXBhcmF0ZSBtZXRob2RzIGZvciBlYWNoIEFjdG9yIHR5cGUgKGNoYXJhY3RlciwgbnBjLCBldGMuKSB0byBrZWVwXHJcbiAgICAvLyB0aGluZ3Mgb3JnYW5pemVkLlxyXG4gICAgaWYgKGFjdG9yRGF0YS50eXBlID09PSAncGMnKSB7XHJcbiAgICAgIHRoaXMuX3ByZXBhcmVQQ0RhdGEoYWN0b3JEYXRhKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFNraWxsTGV2ZWwoc2tpbGwpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gc2tpbGwuZGF0YTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS50cmFpbmluZyAtIDE7XHJcbiAgfVxyXG5cclxuICBnZXRFZmZvcnRDb3N0RnJvbVN0YXQocG9vbCwgZWZmb3J0TGV2ZWwpIHtcclxuICAgIGNvbnN0IHZhbHVlID0ge1xyXG4gICAgICBjb3N0OiAwLFxyXG4gICAgICBlZmZvcnRMZXZlbDogMCxcclxuICAgICAgd2FybmluZzogbnVsbCxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGVmZm9ydExldmVsID09PSAwKSB7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcclxuICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xyXG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuXHJcbiAgICAvL1RoZSBmaXJzdCBlZmZvcnQgbGV2ZWwgY29zdHMgMyBwdHMgZnJvbSB0aGUgcG9vbCwgZXh0cmEgbGV2ZWxzIGNvc3QgMlxyXG4gICAgLy9TdWJzdHJhY3QgdGhlIHJlbGF0ZWQgRWRnZSwgdG9vXHJcbiAgICBjb25zdCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCA9IChzdGF0LnZhbHVlICsgc3RhdC5lZGdlIC0gMSkgLyAyO1xyXG5cclxuICAgIC8vQSBQQyBjYW4gdXNlIGFzIG11Y2ggYXMgdGhlaXIgRWZmb3J0IHNjb3JlLCBidXQgbm90IG1vcmVcclxuICAgIC8vVGhleSdyZSBhbHNvIGxpbWl0ZWQgYnkgdGhlaXIgY3VycmVudCBwb29sIHZhbHVlXHJcbiAgICBjb25zdCBmaW5hbEVmZm9ydCA9IE1hdGgubWluKGVmZm9ydExldmVsLCBhY3RvckRhdGEuZWZmb3J0LCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCk7XHJcbiAgICBjb25zdCBjb3N0ID0gMSArIDIgKiBmaW5hbEVmZm9ydCAtIHN0YXQuZWRnZTtcclxuXHJcbiAgICAvL1RPRE8gdGFrZSBmcmVlIGxldmVscyBvZiBFZmZvcnQgaW50byBhY2NvdW50IGhlcmVcclxuXHJcbiAgICBsZXQgd2FybmluZyA9IG51bGw7XHJcbiAgICBpZiAoZWZmb3J0TGV2ZWwgPiBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCkge1xyXG4gICAgICB3YXJuaW5nID0gYE5vdCBlbm91Z2ggcG9pbnRzIGluIHlvdXIgJHtwb29sTmFtZX0gcG9vbCBmb3IgdGhhdCBsZXZlbCBvZiBFZmZvcnRgO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbHVlLmNvc3QgPSBjb3N0O1xyXG4gICAgdmFsdWUuZWZmb3J0TGV2ZWwgPSBmaW5hbEVmZm9ydDtcclxuICAgIHZhbHVlLndhcm5pbmcgPSB3YXJuaW5nO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGNhblNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50LCBhcHBseUVkZ2U9dHJ1ZSkge1xyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XHJcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZV07XHJcbiAgICBjb25zdCBwb29sQW1vdW50ID0gc3RhdC52YWx1ZTtcclxuXHJcbiAgICByZXR1cm4gKGFwcGx5RWRnZSA/IGFtb3VudCAtIHN0YXQuZWRnZSA6IGFtb3VudCkgPD0gcG9vbEFtb3VudDtcclxuICB9XHJcblxyXG4gIHNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50KSB7XHJcbiAgICBpZiAoIXRoaXMuY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3RvckRhdGEgPSB0aGlzLmRhdGEuZGF0YTtcclxuICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xyXG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuXHJcbiAgICBjb25zdCBkYXRhID0ge307XHJcbiAgICBkYXRhW2BkYXRhLnN0YXRzLiR7cG9vbE5hbWUudG9Mb3dlckNhc2UoKX0udmFsdWVgXSA9IE1hdGgubWF4KDAsIHN0YXQudmFsdWUgLSBhbW91bnQpO1xyXG4gICAgdGhpcy51cGRhdGUoZGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAb3ZlcnJpZGVcclxuICAgKi9cclxuICBhc3luYyBjcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKSB7XHJcbiAgICBjb25zdCBbXywgZGF0YV0gPSBhcmdzO1xyXG5cclxuICAgIC8vIFJvbGwgdGhlIFwibGV2ZWwgZGllXCIgdG8gZGV0ZXJtaW5lIHRoZSBpdGVtJ3MgbGV2ZWwsIGlmIHBvc3NpYmxlXHJcbiAgICBpZiAoZGF0YS5kYXRhICYmIENTUi5oYXNMZXZlbERpZS5pbmNsdWRlcyhkYXRhLnR5cGUpKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW1EYXRhID0gZGF0YS5kYXRhO1xyXG5cclxuICAgICAgaWYgKCFpdGVtRGF0YS5sZXZlbCAmJiBpdGVtRGF0YS5sZXZlbERpZSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBTZWUgaWYgdGhlIGZvcm11bGEgaXMgdmFsaWRcclxuICAgICAgICAgIGl0ZW1EYXRhLmxldmVsID0gbmV3IFJvbGwoaXRlbURhdGEubGV2ZWxEaWUpLnJvbGwoKS50b3RhbDtcclxuICAgICAgICAgIGF3YWl0IHRoaXMudXBkYXRlKHtcclxuICAgICAgICAgICAgX2lkOiB0aGlzLl9pZCxcclxuICAgICAgICAgICAgXCJkYXRhLmxldmVsXCI6IGl0ZW1EYXRhLmxldmVsLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgLy8gSWYgbm90LCBmYWxsYmFjayB0byBzYW5lIGRlZmF1bHRcclxuICAgICAgICAgIGl0ZW1EYXRhLmxldmVsID0gaXRlbURhdGEubGV2ZWwgfHwgbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbURhdGEubGV2ZWwgPSBpdGVtRGF0YS5sZXZlbCB8fCBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN1cGVyLmNyZWF0ZUVtYmVkZGVkRW50aXR5KC4uLmFyZ3MpO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3QgQ1NSID0ge307XHJcblxyXG5DU1IuaXRlbVR5cGVzID0gW1xyXG4gICdza2lsbHMnLFxyXG4gICdhYmlsaXRpZXMnLFxyXG4gICdjeXBoZXJzJyxcclxuICAnYXJ0aWZhY3RzJyxcclxuICAnb2RkaXRpZXMnLFxyXG4gICd3ZWFwb25zJyxcclxuICAnYXJtb3InLFxyXG4gICdnZWFyJ1xyXG5dO1xyXG5cclxuQ1NSLmludmVudG9yeVR5cGVzID0gW1xyXG4gICd3ZWFwb24nLFxyXG4gICdhcm1vcicsXHJcbiAgJ2dlYXInLFxyXG5cclxuICAnY3lwaGVyJyxcclxuICAnYXJ0aWZhY3QnLFxyXG4gICdvZGRpdHknXHJcbl07XHJcblxyXG5DU1Iud2VpZ2h0Q2xhc3NlcyA9IFtcclxuICAnTGlnaHQnLFxyXG4gICdNZWRpdW0nLFxyXG4gICdIZWF2eSdcclxuXTtcclxuXHJcbkNTUi53ZWFwb25UeXBlcyA9IFtcclxuICAnQmFzaGluZycsXHJcbiAgJ0JsYWRlZCcsXHJcbiAgJ1JhbmdlZCcsXHJcbl1cclxuXHJcbkNTUi5zdGF0cyA9IFtcclxuICAnTWlnaHQnLFxyXG4gICdTcGVlZCcsXHJcbiAgJ0ludGVsbGVjdCcsXHJcbl07XHJcblxyXG5DU1IudHJhaW5pbmdMZXZlbHMgPSBbXHJcbiAgJ0luYWJpbGl0eScsXHJcbiAgJ1VudHJhaW5lZCcsXHJcbiAgJ1RyYWluZWQnLFxyXG4gICdTcGVjaWFsaXplZCdcclxuXTtcclxuXHJcbkNTUi5kYW1hZ2VUcmFjayA9IFtcclxuICB7XHJcbiAgICBsYWJlbDogJ0hhbGUnLFxyXG4gICAgZGVzY3JpcHRpb246ICdOb3JtYWwgc3RhdGUgZm9yIGEgY2hhcmFjdGVyLidcclxuICB9LFxyXG4gIHtcclxuICAgIGxhYmVsOiAnSW1wYWlyZWQnLFxyXG4gICAgZGVzY3JpcHRpb246ICdJbiBhIHdvdW5kZWQgb3IgaW5qdXJlZCBzdGF0ZS4gQXBwbHlpbmcgRWZmb3J0IGNvc3RzIDEgZXh0cmEgcG9pbnQgcGVyIGVmZm9ydCBsZXZlbCBhcHBsaWVkLidcclxuICB9LFxyXG4gIHtcclxuICAgIGxhYmVsOiAnRGViaWxpdGF0ZWQnLFxyXG4gICAgZGVzY3JpcHRpb246ICdJbiBhIGNyaXRpY2FsbHkgaW5qdXJlZCBzdGF0ZS4gVGhlIGNoYXJhY3RlciBjYW4gZG8gbm8gb3RoZXIgYWN0aW9uIHRoYW4gdG8gY3Jhd2wgYW4gaW1tZWRpYXRlIGRpc3RhbmNlOyBpZiB0aGVpciBTcGVlZCBwb29sIGlzIDAsIHRoZXkgY2Fubm90IG1vdmUgYXQgYWxsLidcclxuICB9LFxyXG4gIHtcclxuICAgIGxhYmVsOiAnRGVhZCcsXHJcbiAgICBkZXNjcmlwdGlvbjogJ1RoZSBjaGFyYWN0ZXIgaXMgZGVhZC4nXHJcbiAgfVxyXG5dO1xyXG5cclxuQ1NSLnJlY292ZXJpZXMgPSB7XHJcbiAgJ2FjdGlvbic6ICcxIEFjdGlvbicsXHJcbiAgJ3Rlbk1pbnMnOiAnMTAgbWlucycsXHJcbiAgJ29uZUhvdXInOiAnMSBob3VyJyxcclxuICAndGVuSG91cnMnOiAnMTAgaG91cnMnXHJcbn07XHJcblxyXG5DU1IuYWR2YW5jZXMgPSB7XHJcbiAgJ3N0YXRzJzogJys0IHRvIHN0YXQgcG9vbHMnLFxyXG4gICdlZGdlJzogJysxIHRvIEVkZ2UnLFxyXG4gICdlZmZvcnQnOiAnKzEgdG8gRWZmb3J0JyxcclxuICAnc2tpbGxzJzogJ1RyYWluL3NwZWNpYWxpemUgc2tpbGwnLFxyXG4gICdvdGhlcic6ICdPdGhlcicsXHJcbn07XHJcblxyXG5DU1IucmFuZ2VzID0gW1xyXG4gICdJbW1lZGlhdGUnLFxyXG4gICdTaG9ydCcsXHJcbiAgJ0xvbmcnLFxyXG4gICdWZXJ5IExvbmcnXHJcbl07XHJcblxyXG5DU1Iub3B0aW9uYWxSYW5nZXMgPSBbXCJOL0FcIl0uY29uY2F0KENTUi5yYW5nZXMpO1xyXG5cclxuQ1NSLmFiaWxpdHlUeXBlcyA9IFtcclxuICAnQWN0aW9uJyxcclxuICAnRW5hYmxlcicsXHJcbl07XHJcblxyXG5DU1Iuc3VwcG9ydHNNYWNyb3MgPSBbXHJcbiAgJ3NraWxsJyxcclxuICAnYWJpbGl0eSdcclxuXTtcclxuXHJcbkNTUi5oYXNMZXZlbERpZSA9IFtcclxuICAnY3lwaGVyJyxcclxuICAnYXJ0aWZhY3QnXHJcbl07XHJcbiIsIi8vIEltcG9ydCBNb2R1bGVzXHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yIH0gZnJvbSBcIi4vYWN0b3IvYWN0b3IuanNcIjtcclxuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCB9IGZyb20gXCIuL2FjdG9yL2FjdG9yLXNoZWV0LmpzXCI7XHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tIFwiLi9pdGVtL2l0ZW0uanNcIjtcclxuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IH0gZnJvbSBcIi4vaXRlbS9pdGVtLXNoZWV0LmpzXCI7XHJcblxyXG5pbXBvcnQgeyByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgfSBmcm9tICcuL2hhbmRsZWJhcnMtaGVscGVycy5qcyc7XHJcbmltcG9ydCB7IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzIH0gZnJvbSAnLi90ZW1wbGF0ZS5qcyc7XHJcblxyXG5Ib29rcy5vbmNlKCdpbml0JywgYXN5bmMgZnVuY3Rpb24oKSB7XHJcblxyXG4gIGdhbWUuY3lwaGVyc3lzdGVtQ2xlYW4gPSB7XHJcbiAgICBDeXBoZXJTeXN0ZW1BY3RvcixcclxuICAgIEN5cGhlclN5c3RlbUl0ZW1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBTZXQgYW4gaW5pdGlhdGl2ZSBmb3JtdWxhIGZvciB0aGUgc3lzdGVtXHJcbiAgICogQHR5cGUge1N0cmluZ31cclxuICAgKi9cclxuICBDT05GSUcuQ29tYmF0LmluaXRpYXRpdmUgPSB7XHJcbiAgICBmb3JtdWxhOiBcIjFkMjBcIixcclxuICAgIGRlY2ltYWxzOiAyXHJcbiAgfTtcclxuXHJcbiAgLy8gRGVmaW5lIGN1c3RvbSBFbnRpdHkgY2xhc3Nlc1xyXG4gIENPTkZJRy5BY3Rvci5lbnRpdHlDbGFzcyA9IEN5cGhlclN5c3RlbUFjdG9yO1xyXG4gIENPTkZJRy5JdGVtLmVudGl0eUNsYXNzID0gQ3lwaGVyU3lzdGVtSXRlbTtcclxuXHJcbiAgLy8gUmVnaXN0ZXIgc2hlZXQgYXBwbGljYXRpb24gY2xhc3Nlc1xyXG4gIEFjdG9ycy51bnJlZ2lzdGVyU2hlZXQoXCJjb3JlXCIsIEFjdG9yU2hlZXQpO1xyXG4gIEFjdG9ycy5yZWdpc3RlclNoZWV0KCdjeXBoZXJzeXN0ZW1DbGVhbicsIEN5cGhlclN5c3RlbUFjdG9yU2hlZXQsIHtcclxuICAgIHR5cGVzOiBbJ3BjJ10sXHJcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcclxuICB9KTtcclxuICBBY3RvcnMucmVnaXN0ZXJTaGVldCgnY3lwaGVyc3lzdGVtQ2xlYW4nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XHJcbiAgICB0eXBlczogWyducGMnXSxcclxuICAgIG1ha2VEZWZhdWx0OiB0cnVlLFxyXG4gIH0pO1xyXG5cclxuICBJdGVtcy51bnJlZ2lzdGVyU2hlZXQoXCJjb3JlXCIsIEl0ZW1TaGVldCk7XHJcbiAgSXRlbXMucmVnaXN0ZXJTaGVldChcImN5cGhlcnN5c3RlbUNsZWFuXCIsIEN5cGhlclN5c3RlbUl0ZW1TaGVldCwgeyBtYWtlRGVmYXVsdDogdHJ1ZSB9KTtcclxuXHJcbiAgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzKCk7XHJcbiAgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMoKTtcclxufSk7XHJcbiIsIi8qIGdsb2JhbHMgRGlhbG9nICovXHJcblxyXG5leHBvcnQgY2xhc3MgUm9sbERpYWxvZyBleHRlbmRzIERpYWxvZyB7XHJcbiAgY29uc3RydWN0b3IoZGlhbG9nRGF0YSwgb3B0aW9ucykge1xyXG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBzdXBlci5hY3RpdmF0ZUxpc3RlbmVycyhodG1sKTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwicm9sbE1vZGVcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTM1cHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gIH1cclxufSIsImNvbnN0IEVudW1Qb29sID0gW1xyXG4gIFwiTWlnaHRcIixcclxuICBcIlNwZWVkXCIsXHJcbiAgXCJJbnRlbGxlY3RcIlxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW51bVBvb2w7XHJcbiIsImNvbnN0IEVudW1SYW5nZSA9IFtcclxuICBcIkltbWVkaWF0ZVwiLFxyXG4gIFwiU2hvcnRcIixcclxuICBcIkxvbmdcIixcclxuICBcIlZlcnkgTG9uZ1wiXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbnVtUmFuZ2U7XHJcbiIsImNvbnN0IEVudW1UcmFpbmluZyA9IFtcclxuICBcIkluYWJpbGl0eVwiLFxyXG4gIFwiVW50cmFpbmVkXCIsXHJcbiAgXCJUcmFpbmVkXCIsXHJcbiAgXCJTcGVjaWFsaXplZFwiXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbnVtVHJhaW5pbmc7XHJcbiIsImNvbnN0IEVudW1XZWFwb25DYXRlZ29yeSA9IFtcclxuICBcIkJsYWRlZFwiLFxyXG4gIFwiQmFzaGluZ1wiLFxyXG4gIFwiUmFuZ2VkXCJcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudW1XZWFwb25DYXRlZ29yeTtcclxuIiwiY29uc3QgRW51bVdlaWdodCA9IFtcclxuICBcIkxpZ2h0XCIsXHJcbiAgXCJNZWRpdW1cIixcclxuICBcIkhlYXZ5XCJcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudW1XZWlnaHQ7XHJcbiIsImV4cG9ydCBjb25zdCByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgPSAoKSA9PiB7XHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndG9Mb3dlckNhc2UnLCBzdHIgPT4gc3RyLnRvTG93ZXJDYXNlKCkpO1xyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvVXBwZXJDYXNlJywgdGV4dCA9PiB0ZXh0LnRvVXBwZXJDYXNlKCkpO1xyXG5cclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdlcScsICh2MSwgdjIpID0+IHYxID09PSB2Mik7XHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbmVxJywgKHYxLCB2MikgPT4gdjEgIT09IHYyKTtcclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdvcicsICh2MSwgdjIpID0+IHYxIHx8IHYyKTtcclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0ZXJuYXJ5JywgKGNvbmQsIHYxLCB2MikgPT4gY29uZCA/IHYxIDogdjIpO1xyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2NvbmNhdCcsICh2MSwgdjIpID0+IGAke3YxfSR7djJ9YCk7XHJcblxyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3N0ck9yU3BhY2UnLCB2YWwgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybiAodmFsICYmICEhdmFsLmxlbmd0aCkgPyB2YWwgOiAnJm5ic3A7JztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsO1xyXG4gIH0pO1xyXG5cclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0cmFpbmluZ0ljb24nLCB2YWwgPT4ge1xyXG4gICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLmluYWJpbGl0eScpfVwiPltJXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudW50cmFpbmVkJyl9XCI+W1VdPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy50cmFpbmVkJyl9XCI+W1RdPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgMzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5zcGVjaWFsaXplZCcpfVwiPltTXTwvc3Bhbj5gO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnJztcclxuICB9KTtcclxuXHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigncG9vbEljb24nLCB2YWwgPT4ge1xyXG4gICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wubWlnaHQnKX1cIj5bTV08L3NwYW4+YDtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wuc3BlZWQnKX1cIj5bU108L3NwYW4+YDtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wuaW50ZWxsZWN0Jyl9XCI+W0ldPC9zcGFuPmA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH0pO1xyXG5cclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0eXBlSWNvbicsIHZhbCA9PiB7XHJcbiAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICAvLyBUT0RPOiBBZGQgc2tpbGwgYW5kIGFiaWxpdHk/XHJcbiAgICAgIFxyXG4gICAgICBjYXNlICdhcm1vcic6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W2FdPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgJ3dlYXBvbic6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LndlYXBvbicpfVwiPlt3XTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlICdnZWFyJzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuZ2VhcicpfVwiPltnXTwvc3Bhbj5gO1xyXG4gICAgICBcclxuICAgICAgY2FzZSAnY3lwaGVyJzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuY3lwaGVyJyl9XCI+W0NdPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bQV08L3NwYW4+YDtcclxuICAgICAgY2FzZSAnb2RkaXR5JzpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5pbnZlbnRvcnkuYXJtb3InKX1cIj5bT108L3NwYW4+YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfSk7XHJcbn07XHJcbiIsIi8qIGdsb2JhbHMgbWVyZ2VPYmplY3QgKi9cclxuXHJcbmltcG9ydCB7IENTUiB9IGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcblxyXG4vKipcclxuICogRXh0ZW5kIHRoZSBiYXNpYyBJdGVtU2hlZXQgd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnNcclxuICogQGV4dGVuZHMge0l0ZW1TaGVldH1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1JdGVtU2hlZXQgZXh0ZW5kcyBJdGVtU2hlZXQge1xyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xyXG4gICAgICBjbGFzc2VzOiBbXCJjeXBoZXJzeXN0ZW1cIiwgXCJzaGVldFwiLCBcIml0ZW1cIl0sXHJcbiAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgIGhlaWdodDogMjAwLFxyXG4gICAgICB0YWJzOiBbe1xyXG4gICAgICAgIG5hdlNlbGVjdG9yOiBcIi5zaGVldC10YWJzXCIsXHJcbiAgICAgICAgY29udGVudFNlbGVjdG9yOiBcIi5zaGVldC1ib2R5XCIsXHJcbiAgICAgICAgaW5pdGlhbDogXCJkZXNjcmlwdGlvblwiXHJcbiAgICAgIH1dLFxyXG4gICAgICBzY3JvbGxZOiBbXHJcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktbGlzdCcsXHJcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktaW5mbycsXHJcbiAgICAgIF1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgIGNvbnN0IHBhdGggPSBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW1cIjtcclxuICAgIHJldHVybiBgJHtwYXRofS8ke3RoaXMuaXRlbS5kYXRhLnR5cGV9LXNoZWV0Lmh0bWxgO1xyXG4gIH1cclxuXHJcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiAgX3NraWxsRGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xyXG4gICAgZGF0YS50cmFpbmluZ0xldmVscyA9IENTUi50cmFpbmluZ0xldmVscztcclxuICB9XHJcblxyXG4gIF9hYmlsaXR5RGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLmRhdGEucmFuZ2VzID0gQ1NSLm9wdGlvbmFsUmFuZ2VzO1xyXG4gICAgZGF0YS5kYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xyXG4gIH1cclxuXHJcbiAgX2FybW9yRGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcclxuICB9XHJcblxyXG4gIF93ZWFwb25EYXRhKGRhdGEpIHtcclxuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcclxuICAgIGRhdGEud2VhcG9uVHlwZXMgPSBDU1Iud2VhcG9uVHlwZXM7XHJcbiAgICBkYXRhLndlaWdodENsYXNzZXMgPSBDU1Iud2VpZ2h0Q2xhc3NlcztcclxuICB9XHJcblxyXG4gIF9nZWFyRGF0YShkYXRhKSB7XHJcbiAgfVxyXG5cclxuICBfY3lwaGVyRGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcclxuICB9XHJcblxyXG4gIF9hcnRpZmFjdERhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5pc0dNID0gZ2FtZS51c2VyLmlzR007XHJcbiAgfVxyXG5cclxuICBfb2RkaXR5RGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcclxuICB9XHJcblxyXG4gIC8qKiBAb3ZlcnJpZGUgKi9cclxuICBnZXREYXRhKCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHN1cGVyLmdldERhdGEoKTtcclxuXHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuaXRlbS5kYXRhO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3NraWxsJzpcclxuICAgICAgICB0aGlzLl9za2lsbERhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxyXG4gICAgICAgIHRoaXMuX2FiaWxpdHlEYXRhKGRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcm1vcic6XHJcbiAgICAgICAgdGhpcy5fYXJtb3JEYXRhKGRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd3ZWFwb24nOlxyXG4gICAgICAgIHRoaXMuX3dlYXBvbkRhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2dlYXInOlxyXG4gICAgICAgIHRoaXMuX2dlYXJEYXRhKGRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdjeXBoZXInOlxyXG4gICAgICAgIHRoaXMuX2N5cGhlckRhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcclxuICAgICAgICB0aGlzLl9hcnRpZmFjdERhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ29kZGl0eSc6XHJcbiAgICAgICAgdGhpcy5fb2RkaXR5RGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9XHJcblxyXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4gIC8qKiBAb3ZlcnJpZGUgKi9cclxuICBzZXRQb3NpdGlvbihvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gc3VwZXIuc2V0UG9zaXRpb24ob3B0aW9ucyk7XHJcbiAgICBjb25zdCBzaGVldEJvZHkgPSB0aGlzLmVsZW1lbnQuZmluZChcIi5zaGVldC1ib2R5XCIpO1xyXG4gICAgY29uc3QgYm9keUhlaWdodCA9IHBvc2l0aW9uLmhlaWdodCAtIDE5MjtcclxuICAgIHNoZWV0Qm9keS5jc3MoXCJoZWlnaHRcIiwgYm9keUhlaWdodCk7XHJcbiAgICByZXR1cm4gcG9zaXRpb247XHJcbiAgfVxyXG5cclxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuICBfc2tpbGxMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ3NraWxsLXdpbmRvdycpO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnN0YXRcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnRyYWluaW5nXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzExMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIF9hYmlsaXR5TGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdhYmlsaXR5LXdpbmRvdycpO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmlzRW5hYmxlclwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcyMjBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuY29zdC5wb29sXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzg1cHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLnJhbmdlXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEyMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBjYklkZW50aWZpZWQgPSBodG1sLmZpbmQoJyNjYi1pZGVudGlmaWVkJyk7XHJcbiAgICBjYklkZW50aWZpZWQub24oJ2NoYW5nZScsIChldikgPT4ge1xyXG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuaXRlbS51cGRhdGUoe1xyXG4gICAgICAgICdkYXRhLmlkZW50aWZpZWQnOiBldi50YXJnZXQuY2hlY2tlZFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2FybW9yTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdhcm1vci13aW5kb3cnKTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWlnaHRcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTAwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX3dlYXBvbkxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnd2VhcG9uLXdpbmRvdycpO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLndlaWdodFwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMTBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEud2VhcG9uVHlwZVwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMTBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEucmFuZ2VcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2dlYXJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2dlYXItd2luZG93Jyk7XHJcbiAgfVxyXG5cclxuICBfY3lwaGVyTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdjeXBoZXItd2luZG93Jyk7XHJcbiAgfVxyXG5cclxuICBfYXJ0aWZhY3RMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FydGlmYWN0LXdpbmRvdycpO1xyXG4gIH1cclxuXHJcbiAgX29kZGl0eUxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnb2RkaXR5LXdpbmRvdycpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmVkaXRhYmxlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IHR5cGUgfSA9IHRoaXMuaXRlbS5kYXRhO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3NraWxsJzpcclxuICAgICAgICB0aGlzLl9za2lsbExpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYWJpbGl0eSc6XHJcbiAgICAgICAgdGhpcy5fYWJpbGl0eUxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJtb3InOlxyXG4gICAgICAgIHRoaXMuX2FybW9yTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd3ZWFwb24nOlxyXG4gICAgICAgIHRoaXMuX3dlYXBvbkxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnZ2Vhcic6XHJcbiAgICAgICAgdGhpcy5fZ2Vhckxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnY3lwaGVyJzpcclxuICAgICAgICB0aGlzLl9jeXBoZXJMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcclxuICAgICAgICB0aGlzLl9hcnRpZmFjdExpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnb2RkaXR5JzpcclxuICAgICAgICB0aGlzLl9vZGRpdHlMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8qIGdsb2JhbHMgSXRlbSByZW5kZXJUZW1wbGF0ZSAqL1xyXG5cclxuaW1wb3J0IHsgQ3lwaGVyUm9sbHMgfSBmcm9tICcuLi9yb2xscy5qcyc7XHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4uL2VudW1zL2VudW0tcG9vbC5qcyc7XHJcbmltcG9ydCBFbnVtVHJhaW5pbmcgZnJvbSAnLi4vZW51bXMvZW51bS10cmFpbmluZy5qcyc7XHJcbmltcG9ydCBFbnVtV2VpZ2h0IGZyb20gJy4uL2VudW1zL2VudW0td2VpZ2h0LmpzJztcclxuaW1wb3J0IEVudW1SYW5nZSBmcm9tICcuLi9lbnVtcy9lbnVtLXJhbmdlLmpzJztcclxuaW1wb3J0IEVudW1XZWFwb25DYXRlZ29yeSBmcm9tICcuLi9lbnVtcy9lbnVtLXdlYXBvbi1jYXRlZ29yeS5qcyc7XHJcblxyXG4vKipcclxuICogRXh0ZW5kIHRoZSBiYXNpYyBJdGVtIHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zLlxyXG4gKiBAZXh0ZW5kcyB7SXRlbX1cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1JdGVtIGV4dGVuZHMgSXRlbSB7XHJcbiAgX3ByZXBhcmVTa2lsbERhdGEoKSB7XHJcbiAgICBjb25zdCBpdGVtRGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gaXRlbURhdGE7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEF1Z21lbnQgdGhlIGJhc2ljIEl0ZW0gZGF0YSBtb2RlbCB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxyXG4gICAqL1xyXG4gIHByZXBhcmVEYXRhKCkge1xyXG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcclxuXHJcbiAgICBpZiAodGhpcy50eXBlID09PSAnc2tpbGwnKSB7XHJcbiAgICAgIHRoaXMuX3ByZXBhcmVTa2lsbERhdGEoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJvbGxcclxuICAgKi9cclxuXHJcbiAgX3NraWxsUm9sbCgpIHtcclxuICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcclxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcclxuXHJcbiAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXM7XHJcbiAgICBjb25zdCBpdGVtID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgeyBwb29sIH0gPSBpdGVtLmRhdGE7XHJcbiAgICBjb25zdCBhc3NldHMgPSBhY3Rvci5nZXRTa2lsbExldmVsKHRoaXMpO1xyXG4gICAgXHJcbiAgICBjb25zdCBwYXJ0cyA9IFsnMWQyMCddO1xyXG4gICAgaWYgKGFzc2V0cyAhPT0gMCkge1xyXG4gICAgICBjb25zdCBzaWduID0gYXNzZXRzIDwgMCA/ICctJyA6ICcrJztcclxuICAgICAgcGFydHMucHVzaChgJHtzaWdufSAke01hdGguYWJzKGFzc2V0cykgKiAzfWApO1xyXG4gICAgfVxyXG5cclxuICAgIEN5cGhlclJvbGxzLlJvbGwoe1xyXG4gICAgICBldmVudCxcclxuICAgICAgcGFydHMsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBwb29sLFxyXG4gICAgICAgIGFiaWxpdHlDb3N0OiAwLFxyXG4gICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydCxcclxuICAgICAgICBhc3NldHNcclxuICAgICAgfSxcclxuICAgICAgc3BlYWtlcjogQ2hhdE1lc3NhZ2UuZ2V0U3BlYWtlcih7IGFjdG9yIH0pLFxyXG4gICAgICBmbGF2b3I6IGAke2FjdG9yLm5hbWV9IHVzZWQgJHtuYW1lfWAsXHJcbiAgICAgIHRpdGxlOiAnVXNlIFNraWxsJyxcclxuICAgICAgYWN0b3JcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2FiaWxpdHlSb2xsKCkge1xyXG4gICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xyXG5cclxuICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcztcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRhdGE7XHJcbiAgICBjb25zdCB7IGlzRW5hYmxlciwgY29zdCB9ID0gaXRlbS5kYXRhO1xyXG5cclxuICAgIGlmICghaXNFbmFibGVyKSB7XHJcbiAgICAgIGNvbnN0IHsgcG9vbCB9ID0gY29zdDtcclxuXHJcbiAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHBhcnNlSW50KGNvc3QuYW1vdW50LCAxMCkpKSB7XHJcbiAgICAgICAgQ3lwaGVyUm9sbHMuUm9sbCh7XHJcbiAgICAgICAgICBldmVudCxcclxuICAgICAgICAgIHBhcnRzOiBbJzFkMjAnXSxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgcG9vbCxcclxuICAgICAgICAgICAgYWJpbGl0eUNvc3Q6IGNvc3QuYW1vdW50LFxyXG4gICAgICAgICAgICBtYXhFZmZvcnQ6IGFjdG9yRGF0YS5lZmZvcnRcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXHJcbiAgICAgICAgICBmbGF2b3I6IGAke2FjdG9yLm5hbWV9IHVzZWQgJHtuYW1lfWAsXHJcbiAgICAgICAgICB0aXRsZTogJ1VzZSBBYmlsaXR5JyxcclxuICAgICAgICAgIGFjdG9yXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XHJcbiAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XHJcbiAgICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXHJcbiAgICAgICAgICBmbGF2b3I6ICdBYmlsaXR5IEZhaWxlZCcsXHJcbiAgICAgICAgICBjb250ZW50OiBgTm90IGVub3VnaCBwb2ludHMgaW4gJHtwb29sTmFtZX0gcG9vbC5gXHJcbiAgICAgICAgfV0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcclxuICAgICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXHJcbiAgICAgICAgZmxhdm9yOiAnSW52YWxpZCBBYmlsaXR5JyxcclxuICAgICAgICBjb250ZW50OiBgVGhpcyBhYmlsaXR5IGlzIGFuIEVuYWJsZXIgYW5kIGNhbm5vdCBiZSByb2xsZWQgZm9yLmBcclxuICAgICAgfV0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcm9sbCgpIHtcclxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3NraWxsJzpcclxuICAgICAgICB0aGlzLl9za2lsbFJvbGwoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYWJpbGl0eSc6XHJcbiAgICAgICAgdGhpcy5fYWJpbGl0eVJvbGwoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEluZm9cclxuICAgKi9cclxuXHJcbiAgYXN5bmMgX3NraWxsSW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCB0cmFpbmluZyA9IEVudW1UcmFpbmluZ1tkYXRhLmRhdGEudHJhaW5pbmddO1xyXG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1tkYXRhLmRhdGEucG9vbF07XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXHJcbiAgICAgIHRyYWluaW5nOiB0cmFpbmluZy50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBwb29sOiBwb29sLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfYWJpbGl0eUluZm8oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1tkYXRhLmRhdGEuY29zdC5wb29sXTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgcG9vbDogcG9vbC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBpc0VuYWJsZXI6IGRhdGEuZGF0YS5pc0VuYWJsZXIsXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FiaWxpdHktaW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9hcm1vckluZm8oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3Qgd2VpZ2h0ID0gRW51bVdlaWdodFtkYXRhLmRhdGEud2VpZ2h0XTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBlcXVpcHBlZDogZGF0YS5lcXVpcHBlZCxcclxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcclxuICAgICAgd2VpZ2h0OiB3ZWlnaHQudG9Mb3dlckNhc2UoKSxcclxuICAgICAgYXJtb3I6IGRhdGEuZGF0YS5hcm1vcixcclxuICAgICAgYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdDogZGF0YS5kYXRhLmFkZGl0aW9uYWxTcGVlZEVmZm9ydENvc3QsXHJcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FybW9yLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfd2VhcG9uSW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCB3ZWlnaHQgPSBFbnVtV2VpZ2h0W2RhdGEuZGF0YS53ZWlnaHRdO1xyXG4gICAgY29uc3QgcmFuZ2UgPSBFbnVtUmFuZ2VbZGF0YS5kYXRhLnJhbmdlXTtcclxuICAgIGNvbnN0IGNhdGVnb3J5ID0gRW51bVdlYXBvbkNhdGVnb3J5W2RhdGEuZGF0YS5jYXRlZ29yeV07XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgZXF1aXBwZWQ6IGRhdGEuZXF1aXBwZWQsXHJcbiAgICAgIHF1YW50aXR5OiBkYXRhLmRhdGEucXVhbnRpdHksXHJcbiAgICAgIHdlaWdodDogd2VpZ2h0LnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIHJhbmdlOiByYW5nZS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBjYXRlZ29yeTogY2F0ZWdvcnkudG9Mb3dlckNhc2UoKSxcclxuICAgICAgZGFtYWdlOiBkYXRhLmRhdGEuZGFtYWdlLFxyXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxyXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby93ZWFwb24taW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9nZWFySW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBxdWFudGl0eTogZGF0YS5kYXRhLnF1YW50aXR5LFxyXG4gICAgICBwcmljZTogZGF0YS5kYXRhLnByaWNlLFxyXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfY3lwaGVySW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBpc0dNOiBnYW1lLnVzZXIuaXNHTSxcclxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXHJcbiAgICAgIGxldmVsOiBkYXRhLmRhdGEubGV2ZWwsXHJcbiAgICAgIGZvcm06IGRhdGEuZGF0YS5mb3JtLFxyXG4gICAgICBlZmZlY3Q6IGRhdGEuZGF0YS5lZmZlY3QsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2N5cGhlci1pbmZvLmh0bWwnLCBwYXJhbXMpO1xyXG5cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2FydGlmYWN0SW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBpc0dNOiBnYW1lLnVzZXIuaXNHTSxcclxuICAgICAgaWRlbnRpZmllZDogZGF0YS5kYXRhLmlkZW50aWZpZWQsXHJcbiAgICAgIGxldmVsOiBkYXRhLmRhdGEubGV2ZWwsXHJcbiAgICAgIGZvcm06IGRhdGEuZGF0YS5mb3JtLFxyXG4gICAgICBpc0RlcGxldGluZzogZGF0YS5kYXRhLmRlcGxldGlvbi5pc0RlcGxldGluZyxcclxuICAgICAgZGVwbGV0aW9uVGhyZXNob2xkOiBkYXRhLmRhdGEuZGVwbGV0aW9uLnRocmVzaG9sZCxcclxuICAgICAgZGVwbGV0aW9uRGllOiBkYXRhLmRhdGEuZGVwbGV0aW9uLmRpZSxcclxuICAgICAgZWZmZWN0OiBkYXRhLmRhdGEuZWZmZWN0LFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hcnRpZmFjdC1pbmZvLmh0bWwnLCBwYXJhbXMpO1xyXG5cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX29kZGl0eUluZm8oKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgICBuYW1lOiBkYXRhLm5hbWUsXHJcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcclxuICAgIH07XHJcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vb2RkaXR5LWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRJbmZvKCkge1xyXG4gICAgbGV0IGh0bWwgPSAnJztcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICBjYXNlICdza2lsbCc6XHJcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX3NraWxsSW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYWJpbGl0eUluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJtb3InOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hcm1vckluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnd2VhcG9uJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fd2VhcG9uSW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdnZWFyJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fZ2VhckluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnY3lwaGVyJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fY3lwaGVySW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcnRpZmFjdCc6XHJcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FydGlmYWN0SW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdvZGRpdHknOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9vZGRpdHlJbmZvKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG59XHJcbiIsIi8qIGdsb2JhbHMgcmVuZGVyVGVtcGxhdGUgKi9cclxuXHJcbmltcG9ydCB7IFJvbGxEaWFsb2cgfSBmcm9tICcuL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyc7XHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4vZW51bXMvZW51bS1wb29sLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDeXBoZXJSb2xscyB7XHJcbiAgc3RhdGljIGFzeW5jIFJvbGwoeyBwYXJ0cyA9IFtdLCBkYXRhID0ge30sIGFjdG9yID0gbnVsbCwgZXZlbnQgPSBudWxsLCBzcGVha2VyID0gbnVsbCwgZmxhdm9yID0gbnVsbCwgdGl0bGUgPSBudWxsLCBpdGVtID0gZmFsc2UgfSA9IHt9KSB7XHJcbiAgICBsZXQgcm9sbE1vZGUgPSBnYW1lLnNldHRpbmdzLmdldCgnY29yZScsICdyb2xsTW9kZScpO1xyXG4gICAgbGV0IHJvbGxlZCA9IGZhbHNlO1xyXG4gICAgbGV0IGZpbHRlcmVkID0gcGFydHMuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICByZXR1cm4gZWwgIT0gJycgJiYgZWw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgbWF4RWZmb3J0ID0gMTtcclxuICAgIGlmIChkYXRhWydtYXhFZmZvcnQnXSkge1xyXG4gICAgICBtYXhFZmZvcnQgPSBwYXJzZUludChkYXRhWydtYXhFZmZvcnQnXSwgMTApIHx8IDE7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgX3JvbGwgPSAoZm9ybSA9IG51bGwpID0+IHtcclxuICAgICAgLy8gT3B0aW9uYWxseSBpbmNsdWRlIGVmZm9ydFxyXG4gICAgICBpZiAoZm9ybSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGRhdGFbJ2VmZm9ydCddID0gcGFyc2VJbnQoZm9ybS5lZmZvcnQudmFsdWUsIDEwKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGF0YVsnZWZmb3J0J10pIHtcclxuICAgICAgICBmaWx0ZXJlZC5wdXNoKGArJHtkYXRhWydlZmZvcnQnXSAqIDN9YCk7XHJcblxyXG4gICAgICAgIGZsYXZvciArPSBgIHdpdGggJHtkYXRhWydlZmZvcnQnXX0gRWZmb3J0YFxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByb2xsID0gbmV3IFJvbGwoZmlsdGVyZWQuam9pbignJyksIGRhdGEpLnJvbGwoKTtcclxuICAgICAgLy8gQ29udmVydCB0aGUgcm9sbCB0byBhIGNoYXQgbWVzc2FnZSBhbmQgcmV0dXJuIHRoZSByb2xsXHJcbiAgICAgIHJvbGxNb2RlID0gZm9ybSA/IGZvcm0ucm9sbE1vZGUudmFsdWUgOiByb2xsTW9kZTtcclxuICAgICAgcm9sbGVkID0gdHJ1ZTtcclxuICAgICAgXHJcbiAgICAgIHJldHVybiByb2xsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRlbXBsYXRlID0gJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2RpYWxvZy9yb2xsLWRpYWxvZy5odG1sJztcclxuICAgIGxldCBkaWFsb2dEYXRhID0ge1xyXG4gICAgICBmb3JtdWxhOiBmaWx0ZXJlZC5qb2luKCcgJyksXHJcbiAgICAgIG1heEVmZm9ydDogbWF4RWZmb3J0LFxyXG4gICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICByb2xsTW9kZTogcm9sbE1vZGUsXHJcbiAgICAgIHJvbGxNb2RlczogQ09ORklHLkRpY2Uucm9sbE1vZGVzXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGlhbG9nRGF0YSk7XHJcbiAgICAvL0NyZWF0ZSBEaWFsb2cgd2luZG93XHJcbiAgICBsZXQgcm9sbDtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgbmV3IFJvbGxEaWFsb2coe1xyXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICBjb250ZW50OiBodG1sLFxyXG4gICAgICAgIGJ1dHRvbnM6IHtcclxuICAgICAgICAgIG9rOiB7XHJcbiAgICAgICAgICAgIGxhYmVsOiAnT0snLFxyXG4gICAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IChodG1sKSA9PiB7XHJcbiAgICAgICAgICAgICAgcm9sbCA9IF9yb2xsKGh0bWxbMF0uY2hpbGRyZW5bMF0pO1xyXG5cclxuICAgICAgICAgICAgICAvLyBUT0RPOiBjaGVjayByb2xsLnJlc3VsdCBhZ2FpbnN0IHRhcmdldCBudW1iZXJcclxuXHJcbiAgICAgICAgICAgICAgY29uc3QgeyBwb29sIH0gPSBkYXRhO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGFtb3VudE9mRWZmb3J0ID0gcGFyc2VJbnQoZGF0YVsnZWZmb3J0J10gfHwgMCwgMTApO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGVmZm9ydENvc3QgPSBhY3Rvci5nZXRFZmZvcnRDb3N0RnJvbVN0YXQocG9vbCwgYW1vdW50T2ZFZmZvcnQpO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHRvdGFsQ29zdCA9IHBhcnNlSW50KGRhdGFbJ2FiaWxpdHlDb3N0J10gfHwgMCwgMTApICsgcGFyc2VJbnQoZWZmb3J0Q29zdC5jb3N0LCAxMCk7XHJcblxyXG4gICAgICAgICAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCkgJiYgIWVmZm9ydENvc3Qud2FybmluZykge1xyXG4gICAgICAgICAgICAgICAgcm9sbC50b01lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICBzcGVha2VyOiBzcGVha2VyLFxyXG4gICAgICAgICAgICAgICAgICBmbGF2b3I6IGZsYXZvclxyXG4gICAgICAgICAgICAgICAgfSwgeyByb2xsTW9kZSB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBhY3Rvci5zcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xyXG4gICAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWFrZXIsXHJcbiAgICAgICAgICAgICAgICAgIGZsYXZvcjogJ1JvbGwgRmFpbGVkJyxcclxuICAgICAgICAgICAgICAgICAgY29udGVudDogYE5vdCBlbm91Z2ggcG9pbnRzIGluICR7cG9vbE5hbWV9IHBvb2wuYFxyXG4gICAgICAgICAgICAgICAgfV0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2FuY2VsOiB7XHJcbiAgICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0NhbmNlbCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVmYXVsdDogJ29rJyxcclxuICAgICAgICBjbG9zZTogKCkgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShyb2xsZWQgPyByb2xsIDogZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSkucmVuZGVyKHRydWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsIi8qIGdsb2JhbHMgbG9hZFRlbXBsYXRlcyAqL1xyXG5cclxuLyoqXHJcbiAqIERlZmluZSBhIHNldCBvZiB0ZW1wbGF0ZSBwYXRocyB0byBwcmUtbG9hZFxyXG4gKiBQcmUtbG9hZGVkIHRlbXBsYXRlcyBhcmUgY29tcGlsZWQgYW5kIGNhY2hlZCBmb3IgZmFzdCBhY2Nlc3Mgd2hlbiByZW5kZXJpbmdcclxuICogQHJldHVybiB7UHJvbWlzZX1cclxuICovXHJcbmV4cG9ydCBjb25zdCBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcyA9IGFzeW5jKCkgPT4ge1xyXG4gIC8vIERlZmluZSB0ZW1wbGF0ZSBwYXRocyB0byBsb2FkXHJcbiAgY29uc3QgdGVtcGxhdGVQYXRocyA9IFtcclxuXHJcbiAgICAgIC8vIEFjdG9yIFNoZWV0c1xyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL2FjdG9yLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYy1zaGVldC5odG1sXCIsXHJcblxyXG4gICAgICAvLyBBY3RvciBQYXJ0aWFsc1xyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3Bvb2xzLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9hZHZhbmNlbWVudC5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvZGFtYWdlLXRyYWNrLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9yZWNvdmVyeS5odG1sXCIsXHJcblxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3NraWxscy5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvYWJpbGl0aWVzLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbnZlbnRvcnkuaHRtbFwiLFxyXG5cclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3NraWxsLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FybW9yLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vd2VhcG9uLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vZ2Vhci1pbmZvLmh0bWxcIixcclxuXHJcbiAgICAgIC8vSXRlbSBTaGVldHNcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2l0ZW0tc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vc2tpbGwtc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vYXJtb3Itc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW0vd2VhcG9uLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2dlYXItc2hlZXQuaHRtbFwiLFxyXG4gIF07XHJcblxyXG4gIC8vIExvYWQgdGhlIHRlbXBsYXRlIHBhcnRzXHJcbiAgcmV0dXJuIGxvYWRUZW1wbGF0ZXModGVtcGxhdGVQYXRocyk7XHJcbn07XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBkZWVwUHJvcChvYmosIHBhdGgpIHtcclxuICBjb25zdCBwcm9wcyA9IHBhdGguc3BsaXQoJy4nKTtcclxuICBsZXQgdmFsID0gb2JqO1xyXG4gIHByb3BzLmZvckVhY2gocCA9PiB7XHJcbiAgICBpZiAocCBpbiB2YWwpIHtcclxuICAgICAgdmFsID0gdmFsW3BdO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiB2YWw7XHJcbn1cclxuIiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheUxpa2VUb0FycmF5OyIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkOyIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwidmFyIHN1cGVyUHJvcEJhc2UgPSByZXF1aXJlKFwiLi9zdXBlclByb3BCYXNlXCIpO1xuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IFJlZmxlY3QuZ2V0O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICAgIHZhciBiYXNlID0gc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmICghYmFzZSkgcmV0dXJuO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTtcblxuICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dldDsiLCJmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0UHJvdG90eXBlT2Y7IiwidmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vc2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW5oZXJpdHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgX3R5cGVvZiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIGFzc2VydFRoaXNJbml0aWFsaXplZCA9IHJlcXVpcmUoXCIuL2Fzc2VydFRoaXNJbml0aWFsaXplZFwiKTtcblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIGFzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjsiLCJmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZjsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuL2dldFByb3RvdHlwZU9mXCIpO1xuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhaztcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3N1cGVyUHJvcEJhc2U7IiwiZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iXX0=
