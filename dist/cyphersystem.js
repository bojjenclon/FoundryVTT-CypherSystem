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
        }]
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
            "systems/cyphersystemClean/templates/actor/partials/pools.html", "systems/cyphersystemClean/templates/actor/partials/advancement.html", "systems/cyphersystemClean/templates/actor/partials/damage-track.html", "systems/cyphersystemClean/templates/actor/partials/recovery.html", "systems/cyphersystemClean/templates/actor/partials/skills.html", "systems/cyphersystemClean/templates/actor/partials/abilities.html", "systems/cyphersystemClean/templates/actor/partials/inventory.html", "systems/cyphersystemClean/templates/actor/partials/info/skill-info.html", "systems/cyphersystemClean/templates/actor/partials/info/ability-info.html", "systems/cyphersystemClean/templates/actor/partials/info/armor-info.html", "systems/cyphersystemClean/templates/actor/partials/info/weapon-info.html", "systems/cyphersystemClean/templates/actor/partials/info/gear-info.html", "systems/cyphersystemClean/templates/actor/partials/info/cypher-info.html", "systems/cyphersystemClean/templates/actor/partials/info/artifact-info.html", "systems/cyphersystemClean/templates/actor/partials/info/oddity-info.html", //Item Sheets
            "systems/cyphersystemClean/templates/item/item-sheet.html", "systems/cyphersystemClean/templates/item/skill-sheet.html", "systems/cyphersystemClean/templates/item/armor-sheet.html", "systems/cyphersystemClean/templates/item/weapon-sheet.html", "systems/cyphersystemClean/templates/item/gear-sheet.html", "systems/cyphersystemClean/templates/item/cypher-sheet.html", "systems/cyphersystemClean/templates/item/artifact-sheet.html", "systems/cyphersystemClean/templates/item/oddity-sheet.html"]; // Load the template parts

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2N5cGhlcnN5c3RlbS5qcyIsIm1vZHVsZS9kaWFsb2cvcm9sbC1kaWFsb2cuanMiLCJtb2R1bGUvZW51bXMvZW51bS1wb29sLmpzIiwibW9kdWxlL2VudW1zL2VudW0tcmFuZ2UuanMiLCJtb2R1bGUvZW51bXMvZW51bS10cmFpbmluZy5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXdlYXBvbi1jYXRlZ29yeS5qcyIsIm1vZHVsZS9lbnVtcy9lbnVtLXdlaWdodC5qcyIsIm1vZHVsZS9oYW5kbGViYXJzLWhlbHBlcnMuanMiLCJtb2R1bGUvaXRlbS9pdGVtLXNoZWV0LmpzIiwibW9kdWxlL2l0ZW0vaXRlbS5qcyIsIm1vZHVsZS9yb2xscy5qcyIsIm1vZHVsZS90ZW1wbGF0ZS5qcyIsIm1vZHVsZS91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FycmF5TGlrZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheVdpdGhIb2xlcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2Fzc2VydFRoaXNJbml0aWFsaXplZC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZ2V0UHJvdG90eXBlT2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbmhlcml0cy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2ludGVyb3BSZXF1aXJlRGVmYXVsdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2l0ZXJhYmxlVG9BcnJheUxpbWl0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvbm9uSXRlcmFibGVSZXN0LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvc2xpY2VkVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3N1cGVyUHJvcEJhc2UuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBOzs7O0lBSWEsc0I7Ozs7Ozs7O0FBd0JYOzs7O3dCQUllO0FBQ2IsYUFBTyx5REFBUDtBQUNEO0FBRUQ7Ozs7O0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dEJBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0IERpYWxvZyBDb250ZXh0TWVudSAqL1xyXG5cclxuaW1wb3J0IHsgQ1NSIH0gZnJvbSAnLi4vY29uZmlnLmpzJztcclxuaW1wb3J0IHsgQ3lwaGVyUm9sbHMgfSBmcm9tICcuLi9yb2xscy5qcyc7XHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW0gfSBmcm9tICcuLi9pdGVtL2l0ZW0uanMnO1xyXG5pbXBvcnQgeyBkZWVwUHJvcCB9IGZyb20gJy4uL3V0aWxzLmpzJztcclxuXHJcbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEFjdG9yU2hlZXQgd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnNcclxuICogQGV4dGVuZHMge0FjdG9yU2hlZXR9XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCBleHRlbmRzIEFjdG9yU2hlZXQge1xyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgc3RhdGljIGdldCBkZWZhdWx0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xyXG4gICAgICBjbGFzc2VzOiBbXCJjeXBoZXJzeXN0ZW1cIiwgXCJzaGVldFwiLCBcImFjdG9yXCJdLFxyXG4gICAgICB3aWR0aDogNjcyLFxyXG4gICAgICBoZWlnaHQ6IDYwMCxcclxuICAgICAgdGFiczogW3sgXHJcbiAgICAgICAgbmF2U2VsZWN0b3I6IFwiLnNoZWV0LXRhYnNcIiwgXHJcbiAgICAgICAgY29udGVudFNlbGVjdG9yOiBcIi5zaGVldC1ib2R5XCIsIFxyXG4gICAgICAgIGluaXRpYWw6IFwiZGVzY3JpcHRpb25cIiBcclxuICAgICAgfSwge1xyXG4gICAgICAgIG5hdlNlbGVjdG9yOiAnLnN0YXRzLXRhYnMnLFxyXG4gICAgICAgIGNvbnRlbnRTZWxlY3RvcjogJy5zdGF0cy1ib2R5JyxcclxuICAgICAgICBpbml0aWFsOiAnYWR2YW5jZW1lbnQnXHJcbiAgICAgIH1dLFxyXG4gICAgICBzY3JvbGxZOiBbXHJcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktbGlzdCcsXHJcbiAgICAgICAgJy50YWIuaW52ZW50b3J5IC5pbnZlbnRvcnktaW5mbycsXHJcbiAgICAgIF1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHRoZSBjb3JyZWN0IEhUTUwgdGVtcGxhdGUgcGF0aCB0byB1c2UgZm9yIHJlbmRlcmluZyB0aGlzIHBhcnRpY3VsYXIgc2hlZXRcclxuICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgIHJldHVybiBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BjLXNoZWV0Lmh0bWxcIjtcclxuICB9XHJcblxyXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3MpO1xyXG5cclxuICAgIHRoaXMuc2tpbGxzUG9vbEZpbHRlciA9IC0xO1xyXG4gICAgdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IC0xO1xyXG4gICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLmFiaWxpdHlQb29sRmlsdGVyID0gLTE7XHJcbiAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5pbnZlbnRvcnlUeXBlRmlsdGVyID0gLTE7XHJcbiAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBfZ2VuZXJhdGVJdGVtRGF0YShkYXRhLCB0eXBlLCBmaWVsZCkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBkYXRhLmRhdGEuaXRlbXM7XHJcbiAgICBpZiAoIWl0ZW1zW2ZpZWxkXSkge1xyXG4gICAgICBpdGVtc1tmaWVsZF0gPSBpdGVtcy5maWx0ZXIoaSA9PiBpLnR5cGUgPT09IHR5cGUpOyAvLy5zb3J0KHNvcnRGdW5jdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfZmlsdGVySXRlbURhdGEoZGF0YSwgaXRlbUZpZWxkLCBmaWx0ZXJGaWVsZCwgZmlsdGVyVmFsdWUpIHtcclxuICAgIGNvbnN0IGl0ZW1zID0gZGF0YS5kYXRhLml0ZW1zO1xyXG4gICAgaXRlbXNbaXRlbUZpZWxkXSA9IGl0ZW1zW2l0ZW1GaWVsZF0uZmlsdGVyKGl0bSA9PiBkZWVwUHJvcChpdG0sIGZpbHRlckZpZWxkKSA9PT0gZmlsdGVyVmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX3NraWxsRGF0YShkYXRhKSB7XHJcbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdza2lsbCcsICdza2lsbHMnKTtcclxuXHJcbiAgICBkYXRhLnNraWxsc1Bvb2xGaWx0ZXIgPSB0aGlzLnNraWxsc1Bvb2xGaWx0ZXI7XHJcbiAgICBkYXRhLnNraWxsc1RyYWluaW5nRmlsdGVyID0gdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlcjtcclxuXHJcbiAgICBpZiAoZGF0YS5za2lsbHNQb29sRmlsdGVyID4gLTEpIHtcclxuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ3NraWxscycsICdkYXRhLnBvb2wnLCBwYXJzZUludChkYXRhLnNraWxsc1Bvb2xGaWx0ZXIsIDEwKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciA+IC0xKSB7XHJcbiAgICAgIHRoaXMuX2ZpbHRlckl0ZW1EYXRhKGRhdGEsICdza2lsbHMnLCAnZGF0YS50cmFpbmluZycsIHBhcnNlSW50KGRhdGEuc2tpbGxzVHJhaW5pbmdGaWx0ZXIsIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZFNraWxsID0gdGhpcy5zZWxlY3RlZFNraWxsO1xyXG4gICAgZGF0YS5za2lsbEluZm8gPSAnJztcclxuICAgIGlmIChkYXRhLnNlbGVjdGVkU2tpbGwpIHtcclxuICAgICAgZGF0YS5za2lsbEluZm8gPSBhd2FpdCBkYXRhLnNlbGVjdGVkU2tpbGwuZ2V0SW5mbygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2FiaWxpdHlEYXRhKGRhdGEpIHtcclxuICAgIHRoaXMuX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgJ2FiaWxpdHknLCAnYWJpbGl0aWVzJyk7XHJcblxyXG4gICAgZGF0YS5hYmlsaXR5UG9vbEZpbHRlciA9IHRoaXMuYWJpbGl0eVBvb2xGaWx0ZXI7XHJcblxyXG4gICAgaWYgKGRhdGEuYWJpbGl0eVBvb2xGaWx0ZXIgPiAtMSkge1xyXG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnYWJpbGl0aWVzJywgJ2RhdGEuY29zdC5wb29sJywgcGFyc2VJbnQoZGF0YS5hYmlsaXR5UG9vbEZpbHRlciwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLnNlbGVjdGVkQWJpbGl0eSA9IHRoaXMuc2VsZWN0ZWRBYmlsaXR5O1xyXG4gICAgZGF0YS5hYmlsaXR5SW5mbyA9ICcnO1xyXG4gICAgaWYgKGRhdGEuc2VsZWN0ZWRBYmlsaXR5KSB7XHJcbiAgICAgIGRhdGEuYWJpbGl0eUluZm8gPSBhd2FpdCBkYXRhLnNlbGVjdGVkQWJpbGl0eS5nZXRJbmZvKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBfaW52ZW50b3J5RGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLmludmVudG9yeVR5cGVzID0gQ1NSLmludmVudG9yeVR5cGVzO1xyXG5cclxuICAgIGNvbnN0IGl0ZW1zID0gZGF0YS5kYXRhLml0ZW1zO1xyXG4gICAgaWYgKCFpdGVtcy5pbnZlbnRvcnkpIHtcclxuICAgICAgaXRlbXMuaW52ZW50b3J5ID0gaXRlbXMuZmlsdGVyKGkgPT4gQ1NSLmludmVudG9yeVR5cGVzLmluY2x1ZGVzKGkudHlwZSkpO1xyXG4gICAgICAvLyBHcm91cCBpdGVtcyBieSB0aGVpciB0eXBlXHJcbiAgICAgIGl0ZW1zLmludmVudG9yeS5zb3J0KChhLCBiKSA9PiAoYS50eXBlID4gYi50eXBlKSA/IDEgOiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyID0gdGhpcy5pbnZlbnRvcnlUeXBlRmlsdGVyO1xyXG5cclxuICAgIGlmIChkYXRhLmludmVudG9yeVR5cGVGaWx0ZXIgPiAtMSkge1xyXG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnaW52ZW50b3J5JywgJ3R5cGUnLCBDU1IuaW52ZW50b3J5VHlwZXNbcGFyc2VJbnQoZGF0YS5pbnZlbnRvcnlUeXBlRmlsdGVyLCAxMCldKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLnNlbGVjdGVkSW52SXRlbSA9IHRoaXMuc2VsZWN0ZWRJbnZJdGVtO1xyXG4gICAgZGF0YS5pbnZJdGVtSW5mbyA9ICcnO1xyXG4gICAgaWYgKGRhdGEuc2VsZWN0ZWRJbnZJdGVtKSB7XHJcbiAgICAgIGRhdGEuaW52SXRlbUluZm8gPSBhd2FpdCBkYXRhLnNlbGVjdGVkSW52SXRlbS5nZXRJbmZvKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgYXN5bmMgZ2V0RGF0YSgpIHtcclxuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XHJcbiAgICBcclxuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xyXG5cclxuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcclxuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XHJcbiAgICBkYXRhLndlYXBvblR5cGVzID0gQ1NSLndlYXBvblR5cGVzO1xyXG4gICAgZGF0YS53ZWlnaHRzID0gQ1NSLndlaWdodENsYXNzZXM7XHJcblxyXG4gICAgZGF0YS5hZHZhbmNlcyA9IE9iamVjdC5lbnRyaWVzKGRhdGEuYWN0b3IuZGF0YS5hZHZhbmNlcykubWFwKFxyXG4gICAgICAoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIG5hbWU6IGtleSxcclxuICAgICAgICAgIGxhYmVsOiBDU1IuYWR2YW5jZXNba2V5XSxcclxuICAgICAgICAgIGlzQ2hlY2tlZDogdmFsdWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBkYXRhLmRhbWFnZVRyYWNrRGF0YSA9IENTUi5kYW1hZ2VUcmFjaztcclxuICAgIGRhdGEuZGFtYWdlVHJhY2tEZXNjcmlwdGlvbiA9IENTUi5kYW1hZ2VUcmFja1tkYXRhLmRhdGEuZGFtYWdlVHJhY2tdLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgIGRhdGEucmVjb3Zlcmllc0RhdGEgPSBPYmplY3QuZW50cmllcyhcclxuICAgICAgZGF0YS5hY3Rvci5kYXRhLnJlY292ZXJpZXNcclxuICAgICkubWFwKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBrZXksXHJcbiAgICAgICAgbGFiZWw6IENTUi5yZWNvdmVyaWVzW2tleV0sXHJcbiAgICAgICAgY2hlY2tlZDogdmFsdWUsXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICBkYXRhLnRyYWluaW5nTGV2ZWxzID0gQ1NSLnRyYWluaW5nTGV2ZWxzO1xyXG5cclxuICAgIGRhdGEuZGF0YS5pdGVtcyA9IGRhdGEuYWN0b3IuaXRlbXMgfHwge307XHJcblxyXG4gICAgYXdhaXQgdGhpcy5fc2tpbGxEYXRhKGRhdGEpO1xyXG4gICAgYXdhaXQgdGhpcy5fYWJpbGl0eURhdGEoZGF0YSk7XHJcbiAgICBhd2FpdCB0aGlzLl9pbnZlbnRvcnlEYXRhKGRhdGEpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgX2NyZWF0ZUl0ZW0oaXRlbU5hbWUpIHtcclxuICAgIGNvbnN0IGl0ZW1EYXRhID0ge1xyXG4gICAgICBuYW1lOiBgTmV3ICR7aXRlbU5hbWUuY2FwaXRhbGl6ZSgpfWAsXHJcbiAgICAgIHR5cGU6IGl0ZW1OYW1lLFxyXG4gICAgICBkYXRhOiBuZXcgQ3lwaGVyU3lzdGVtSXRlbSh7fSksXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYWN0b3IuY3JlYXRlT3duZWRJdGVtKGl0ZW1EYXRhLCB7IHJlbmRlclNoZWV0OiB0cnVlIH0pO1xyXG4gIH1cclxuXHJcbiAgX3JvbGxQb29sRGlhbG9nKHBvb2wpIHtcclxuICAgIGNvbnN0IHsgYWN0b3IgfSA9IHRoaXM7XHJcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XHJcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuXHJcbiAgICBDeXBoZXJSb2xscy5Sb2xsKHtcclxuICAgICAgZXZlbnQsXHJcbiAgICAgIHBhcnRzOiBbJzFkMjAnXSxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHBvb2wsXHJcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxyXG4gICAgICB9LFxyXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXHJcbiAgICAgIGZsYXZvcjogYCR7YWN0b3IubmFtZX0gdXNlZCAke3Bvb2xOYW1lfWAsXHJcbiAgICAgIHRpdGxlOiAnVXNlIFBvb2wnLFxyXG4gICAgICBhY3RvclxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfZGVsZXRlSXRlbURpYWxvZyhpdGVtSWQsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBjb25maXJtYXRpb25EaWFsb2cgPSBuZXcgRGlhbG9nKHtcclxuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlVGl0bGVcIiksXHJcbiAgICAgIGNvbnRlbnQ6IGA8cD4ke2dhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlQ29udGVudFwiKX08L3A+PGhyIC8+YCxcclxuICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgIGNvbmZpcm06IHtcclxuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1jaGVja1wiPjwvaT4nLFxyXG4gICAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlQnV0dG9uXCIpLFxyXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rvci5kZWxldGVPd25lZEl0ZW0oaXRlbUlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxyXG4gICAgICAgICAgbGFiZWw6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuY2FuY2VsQnV0dG9uXCIpLFxyXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkZWZhdWx0OiBcImNhbmNlbFwiXHJcbiAgICB9KTtcclxuICAgIGNvbmZpcm1hdGlvbkRpYWxvZy5yZW5kZXIodHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBfc3RhdHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgLy8gU3RhdHMgU2V0dXBcclxuICAgIGh0bWwuZmluZCgnLnJvbGwtcG9vbCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcclxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0LnBvb2wpIHtcclxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgeyBwb29sIH0gPSBlbC5kYXRhc2V0O1xyXG5cclxuICAgICAgdGhpcy5fcm9sbFBvb2xEaWFsb2cocGFyc2VJbnQocG9vbCwgMTApKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLmRhbWFnZVRyYWNrXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIF9za2lsbHNUYWJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgLy8gU2tpbGxzIFNldHVwXHJcbiAgICBodG1sLmZpbmQoJy5hZGQtc2tpbGwnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHRoaXMuX2NyZWF0ZUl0ZW0oJ3NraWxsJyk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgY29uc3Qgc2tpbGxzUG9vbEZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJza2lsbHNQb29sRmlsdGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICAgIHNraWxsc1Bvb2xGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuc2tpbGxzUG9vbEZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBza2lsbHNUcmFpbmluZ0ZpbHRlciA9IGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJza2lsbHNUcmFpbmluZ0ZpbHRlclwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMzBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgICBza2lsbHNUcmFpbmluZ0ZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcclxuICAgICAgdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlciA9IGV2dC50YXJnZXQudmFsdWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBza2lsbHMgPSBodG1sLmZpbmQoJ2Euc2tpbGwnKTtcclxuXHJcbiAgICBza2lsbHMub24oJ2NsaWNrJywgZXZ0ID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xyXG5cclxuICAgICAgbGV0IGVsID0gZXZ0LnRhcmdldDtcclxuICAgICAgLy8gQWNjb3VudCBmb3IgY2xpY2tpbmcgYSBjaGlsZCBlbGVtZW50XHJcbiAgICAgIHdoaWxlICghZWwuZGF0YXNldC5pZCkge1xyXG4gICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBza2lsbElkID0gZWwuZGF0YXNldC5pZDtcclxuXHJcbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcclxuICAgICAgY29uc3Qgc2tpbGwgPSBhY3Rvci5nZXRPd25lZEl0ZW0oc2tpbGxJZCk7XHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBza2lsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHsgc2VsZWN0ZWRTa2lsbCB9ID0gdGhpcztcclxuICAgIGlmIChzZWxlY3RlZFNraWxsKSB7XHJcbiAgICAgIGh0bWwuZmluZCgnLnNraWxsLWluZm8gLmFjdGlvbnMgLnJvbGwnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBzZWxlY3RlZFNraWxsLnJvbGwoKTtcclxuICAgICAgICAvLyB0aGlzLl9yb2xsSXRlbURpYWxvZyhzZWxlY3RlZFNraWxsLmRhdGEuZGF0YS5wb29sKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5lZGl0JykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNraWxsLnNoZWV0LnJlbmRlcih0cnVlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5kZWxldGUnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZWxldGVJdGVtRGlhbG9nKHRoaXMuc2VsZWN0ZWRTa2lsbC5faWQsIGRpZERlbGV0ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoZGlkRGVsZXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTa2lsbCA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2FiaWxpdHlUYWJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgLy8gQWJpbGl0aWVzIFNldHVwXHJcbiAgICBodG1sLmZpbmQoJy5hZGQtYWJpbGl0eScpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdGhpcy5fY3JlYXRlSXRlbSgnYWJpbGl0eScpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgYWJpbGl0eVBvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiYWJpbGl0eVBvb2xGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTMwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gICAgYWJpbGl0eVBvb2xGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuYWJpbGl0eVBvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IG51bGw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBhYmlsaXRpZXMgPSBodG1sLmZpbmQoJ2EuYWJpbGl0eScpO1xyXG5cclxuICAgIGFiaWxpdGllcy5vbignY2xpY2snLCBldnQgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHRoaXMuX29uU3VibWl0KGV2dCk7XHJcblxyXG4gICAgICBsZXQgZWwgPSBldnQudGFyZ2V0O1xyXG4gICAgICAvLyBBY2NvdW50IGZvciBjbGlja2luZyBhIGNoaWxkIGVsZW1lbnRcclxuICAgICAgd2hpbGUgKCFlbC5kYXRhc2V0LmlkKSB7XHJcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGFiaWxpdHlJZCA9IGVsLmRhdGFzZXQuaWQ7XHJcblxyXG4gICAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XHJcbiAgICAgIGNvbnN0IGFiaWxpdHkgPSBhY3Rvci5nZXRPd25lZEl0ZW0oYWJpbGl0eUlkKTtcclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5ID0gYWJpbGl0eTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHsgc2VsZWN0ZWRBYmlsaXR5IH0gPSB0aGlzO1xyXG4gICAgaWYgKHNlbGVjdGVkQWJpbGl0eSkge1xyXG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLnJvbGwnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBzZWxlY3RlZEFiaWxpdHkucm9sbCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGh0bWwuZmluZCgnLmFiaWxpdHktaW5mbyAuYWN0aW9ucyAuZWRpdCcpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRBYmlsaXR5LnNoZWV0LnJlbmRlcih0cnVlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBodG1sLmZpbmQoJy5hYmlsaXR5LWluZm8gLmFjdGlvbnMgLmRlbGV0ZScpLmNsaWNrKGV2dCA9PiB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlbGV0ZUl0ZW1EaWFsb2codGhpcy5zZWxlY3RlZEFiaWxpdHkuX2lkLCBkaWREZWxldGUgPT4ge1xyXG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkQWJpbGl0eSA9IG51bGw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2ludmVudG9yeVRhYkxpc3RlbmVycyhodG1sKSB7XHJcbiAgICAvLyBJbnZlbnRvcnkgU2V0dXBcclxuXHJcbiAgICBjb25zdCBjdHh0TWVudUVsID0gaHRtbC5maW5kKCcuY29udGV4dG1lbnUnKTtcclxuICAgIGNvbnN0IGFkZEludkJ0biA9IGh0bWwuZmluZCgnLmFkZC1pbnZlbnRvcnknKTtcclxuXHJcbiAgICBjb25zdCBtZW51SXRlbXMgPSBbXTtcclxuICAgIENTUi5pbnZlbnRvcnlUeXBlcy5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICBtZW51SXRlbXMucHVzaCh7XHJcbiAgICAgICAgbmFtZTogZ2FtZS5pMThuLmxvY2FsaXplKGBDU1IuaW52ZW50b3J5LiR7dHlwZX1gKSxcclxuICAgICAgICBpY29uOiAnJyxcclxuICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5fY3JlYXRlSXRlbSh0eXBlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBjb25zdCBjdHh0TWVudU9iaiA9IG5ldyBDb250ZXh0TWVudShodG1sLCAnLmFjdGl2ZScsIG1lbnVJdGVtcyk7XHJcbiAgICBcclxuICAgIGFkZEludkJ0bi5jbGljayhldnQgPT4ge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIC8vIEEgYml0IG9mIGEgaGFjayB0byBlbnN1cmUgdGhlIGNvbnRleHQgbWVudSBpc24ndFxyXG4gICAgICAvLyBjdXQgb2ZmIGR1ZSB0byB0aGUgc2hlZXQncyBjb250ZW50IHJlbHlpbmcgb25cclxuICAgICAgLy8gb3ZlcmZsb3cgaGlkZGVuLiBJbnN0ZWFkLCB3ZSBuZXN0IHRoZSBtZW51IGluc2lkZVxyXG4gICAgICAvLyBhIGZsb2F0aW5nIGFic29sdXRlbHkgcG9zaXRpb25lZCBkaXYsIHNldCB0byBvdmVybGFwXHJcbiAgICAgIC8vIHRoZSBhZGQgaW52ZW50b3J5IGl0ZW0gaWNvbi5cclxuICAgICAgY3R4dE1lbnVFbC5vZmZzZXQoYWRkSW52QnRuLm9mZnNldCgpKTtcclxuXHJcbiAgICAgIGN0eHRNZW51T2JqLnJlbmRlcihjdHh0TWVudUVsLmZpbmQoJy5jb250YWluZXInKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLm9uKCdtb3VzZWRvd24nLCBldnQgPT4ge1xyXG4gICAgICBpZiAoZXZ0LnRhcmdldCA9PT0gYWRkSW52QnRuWzBdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBDbG9zZSB0aGUgY29udGV4dCBtZW51IGlmIHVzZXIgY2xpY2tzIGFueXdoZXJlIGVsc2VcclxuICAgICAgY3R4dE1lbnVPYmouY2xvc2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGludmVudG9yeVR5cGVGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiaW52ZW50b3J5VHlwZUZpbHRlclwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMzBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgICBpbnZlbnRvcnlUeXBlRmlsdGVyLm9uKCdjaGFuZ2UnLCBldnQgPT4ge1xyXG4gICAgICB0aGlzLmludmVudG9yeVR5cGVGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSW52SXRlbSA9IG51bGw7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbnZJdGVtcyA9IGh0bWwuZmluZCgnYS5pbnYtaXRlbScpO1xyXG5cclxuICAgIGludkl0ZW1zLm9uKCdjbGljaycsIGV2dCA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdGhpcy5fb25TdWJtaXQoZXZ0KTtcclxuXHJcbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XHJcbiAgICAgIC8vIEFjY291bnQgZm9yIGNsaWNraW5nIGEgY2hpbGQgZWxlbWVudFxyXG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQuaWQpIHtcclxuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW52SXRlbUlkID0gZWwuZGF0YXNldC5pZDtcclxuXHJcbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcclxuICAgICAgY29uc3QgaW52SXRlbSA9IGFjdG9yLmdldE93bmVkSXRlbShpbnZJdGVtSWQpO1xyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBpbnZJdGVtO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgeyBzZWxlY3RlZEludkl0ZW0gfSA9IHRoaXM7XHJcbiAgICBpZiAoc2VsZWN0ZWRJbnZJdGVtKSB7XHJcbiAgICAgIGh0bWwuZmluZCgnLmludmVudG9yeS1pbmZvIC5hY3Rpb25zIC5lZGl0JykuY2xpY2soZXZ0ID0+IHtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0uc2hlZXQucmVuZGVyKHRydWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGh0bWwuZmluZCgnLmludmVudG9yeS1pbmZvIC5hY3Rpb25zIC5kZWxldGUnKS5jbGljayhldnQgPT4ge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZWxldGVJdGVtRGlhbG9nKHRoaXMuc2VsZWN0ZWRJbnZJdGVtLl9pZCwgZGlkRGVsZXRlID0+IHtcclxuICAgICAgICAgIGlmIChkaWREZWxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEludkl0ZW0gPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKiBAb3ZlcnJpZGUgKi9cclxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBzdXBlci5hY3RpdmF0ZUxpc3RlbmVycyhodG1sKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSGFjaywgZm9yIHNvbWUgcmVhc29uIHRoZSBpbm5lciB0YWIncyBjb250ZW50IGRvZXNuJ3Qgc2hvdyBcclxuICAgIC8vIHdoZW4gY2hhbmdpbmcgcHJpbWFyeSB0YWJzIHdpdGhpbiB0aGUgc2hlZXRcclxuICAgIGh0bWwuZmluZCgnLml0ZW1bZGF0YS10YWI9XCJzdGF0c1wiXScpLmNsaWNrKCgpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJUYWIgPSBodG1sLmZpbmQoJy5zdGF0cy10YWJzIC5pdGVtLmFjdGl2ZScpLmZpcnN0KCk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkU3ViUGFnZSA9IGh0bWwuZmluZChgLnN0YXRzLWJvZHkgLnRhYltkYXRhLXRhYj1cIiR7c2VsZWN0ZWRTdWJUYWIuZGF0YSgndGFiJyl9XCJdYCk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzZWxlY3RlZFN1YlBhZ2UuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3N0YXRzVGFiTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgdGhpcy5fc2tpbGxzVGFiTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgdGhpcy5fYWJpbGl0eVRhYkxpc3RlbmVycyhodG1sKTtcclxuICAgIHRoaXMuX2ludmVudG9yeVRhYkxpc3RlbmVycyhodG1sKTtcclxuICB9XHJcbn1cclxuIiwiLyogZ2xvYmFsIEFjdG9yOmZhbHNlICovXHJcblxyXG5pbXBvcnQgRW51bVBvb2xzIGZyb20gJy4uL2VudW1zL2VudW0tcG9vbC5qcyc7XHJcbmltcG9ydCB7IENTUiB9IGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcblxyXG4vKipcclxuICogRXh0ZW5kIHRoZSBiYXNlIEFjdG9yIGVudGl0eSBieSBkZWZpbmluZyBhIGN1c3RvbSByb2xsIGRhdGEgc3RydWN0dXJlIHdoaWNoIGlzIGlkZWFsIGZvciB0aGUgU2ltcGxlIHN5c3RlbS5cclxuICogQGV4dGVuZHMge0FjdG9yfVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUFjdG9yIGV4dGVuZHMgQWN0b3Ige1xyXG4gIC8qKlxyXG4gICAqIFByZXBhcmUgQ2hhcmFjdGVyIHR5cGUgc3BlY2lmaWMgZGF0YVxyXG4gICAqL1xyXG4gIF9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSkge1xyXG4gICAgY29uc3QgZGF0YSA9IGFjdG9yRGF0YS5kYXRhO1xyXG5cclxuICAgIC8vIE1ha2UgbW9kaWZpY2F0aW9ucyB0byBkYXRhIGhlcmUuIEZvciBleGFtcGxlOlxyXG5cclxuICAgIC8vIExvb3AgdGhyb3VnaCBhYmlsaXR5IHNjb3JlcywgYW5kIGFkZCB0aGVpciBtb2RpZmllcnMgdG8gb3VyIHNoZWV0IG91dHB1dC5cclxuICAgIC8vIGZvciAobGV0IFtrZXksIGFiaWxpdHldIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEuYWJpbGl0aWVzKSkge1xyXG4gICAgLy8gICAvLyBDYWxjdWxhdGUgdGhlIG1vZGlmaWVyIHVzaW5nIGQyMCBydWxlcy5cclxuICAgIC8vICAgYWJpbGl0eS5tb2QgPSBNYXRoLmZsb29yKChhYmlsaXR5LnZhbHVlIC0gMTApIC8gMik7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBBdWdtZW50IHRoZSBiYXNpYyBhY3RvciBkYXRhIHdpdGggYWRkaXRpb25hbCBkeW5hbWljIGRhdGEuXHJcbiAgICovXHJcbiAgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBzdXBlci5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IGRhdGEgPSBhY3RvckRhdGEuZGF0YTtcclxuICAgIGNvbnN0IGZsYWdzID0gYWN0b3JEYXRhLmZsYWdzO1xyXG5cclxuICAgIC8vIE1ha2Ugc2VwYXJhdGUgbWV0aG9kcyBmb3IgZWFjaCBBY3RvciB0eXBlIChjaGFyYWN0ZXIsIG5wYywgZXRjLikgdG8ga2VlcFxyXG4gICAgLy8gdGhpbmdzIG9yZ2FuaXplZC5cclxuICAgIGlmIChhY3RvckRhdGEudHlwZSA9PT0gJ3BjJykge1xyXG4gICAgICB0aGlzLl9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTa2lsbExldmVsKHNraWxsKSB7XHJcbiAgICBjb25zdCB7IGRhdGEgfSA9IHNraWxsLmRhdGE7XHJcblxyXG4gICAgcmV0dXJuIGRhdGEudHJhaW5pbmcgLSAxO1xyXG4gIH1cclxuXHJcbiAgZ2V0RWZmb3J0Q29zdEZyb21TdGF0KHBvb2wsIGVmZm9ydExldmVsKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHtcclxuICAgICAgY29zdDogMCxcclxuICAgICAgZWZmb3J0TGV2ZWw6IDAsXHJcbiAgICAgIHdhcm5pbmc6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChlZmZvcnRMZXZlbCA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XHJcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWUudG9Mb3dlckNhc2UoKV07XHJcblxyXG4gICAgLy9UaGUgZmlyc3QgZWZmb3J0IGxldmVsIGNvc3RzIDMgcHRzIGZyb20gdGhlIHBvb2wsIGV4dHJhIGxldmVscyBjb3N0IDJcclxuICAgIC8vU3Vic3RyYWN0IHRoZSByZWxhdGVkIEVkZ2UsIHRvb1xyXG4gICAgY29uc3QgYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wgPSAoc3RhdC52YWx1ZSArIHN0YXQuZWRnZSAtIDEpIC8gMjtcclxuXHJcbiAgICAvL0EgUEMgY2FuIHVzZSBhcyBtdWNoIGFzIHRoZWlyIEVmZm9ydCBzY29yZSwgYnV0IG5vdCBtb3JlXHJcbiAgICAvL1RoZXkncmUgYWxzbyBsaW1pdGVkIGJ5IHRoZWlyIGN1cnJlbnQgcG9vbCB2YWx1ZVxyXG4gICAgY29uc3QgZmluYWxFZmZvcnQgPSBNYXRoLm1pbihlZmZvcnRMZXZlbCwgYWN0b3JEYXRhLmVmZm9ydCwgYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wpO1xyXG4gICAgY29uc3QgY29zdCA9IDEgKyAyICogZmluYWxFZmZvcnQgLSBzdGF0LmVkZ2U7XHJcblxyXG4gICAgLy9UT0RPIHRha2UgZnJlZSBsZXZlbHMgb2YgRWZmb3J0IGludG8gYWNjb3VudCBoZXJlXHJcblxyXG4gICAgbGV0IHdhcm5pbmcgPSBudWxsO1xyXG4gICAgaWYgKGVmZm9ydExldmVsID4gYXZhaWxhYmxlRWZmb3J0RnJvbVBvb2wpIHtcclxuICAgICAgd2FybmluZyA9IGBOb3QgZW5vdWdoIHBvaW50cyBpbiB5b3VyICR7cG9vbE5hbWV9IHBvb2wgZm9yIHRoYXQgbGV2ZWwgb2YgRWZmb3J0YDtcclxuICAgIH1cclxuXHJcbiAgICB2YWx1ZS5jb3N0ID0gY29zdDtcclxuICAgIHZhbHVlLmVmZm9ydExldmVsID0gZmluYWxFZmZvcnQ7XHJcbiAgICB2YWx1ZS53YXJuaW5nID0gd2FybmluZztcclxuXHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBjYW5TcGVuZEZyb21Qb29sKHBvb2wsIGFtb3VudCwgYXBwbHlFZGdlPXRydWUpIHtcclxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xyXG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF0udG9Mb3dlckNhc2UoKTtcclxuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWVdO1xyXG4gICAgY29uc3QgcG9vbEFtb3VudCA9IHN0YXQudmFsdWU7XHJcblxyXG4gICAgcmV0dXJuIChhcHBseUVkZ2UgPyBhbW91bnQgLSBzdGF0LmVkZ2UgOiBhbW91bnQpIDw9IHBvb2xBbW91bnQ7XHJcbiAgfVxyXG5cclxuICBzcGVuZEZyb21Qb29sKHBvb2wsIGFtb3VudCkge1xyXG4gICAgaWYgKCF0aGlzLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgYW1vdW50KSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XHJcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWUudG9Mb3dlckNhc2UoKV07XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IHt9O1xyXG4gICAgZGF0YVtgZGF0YS5zdGF0cy4ke3Bvb2xOYW1lLnRvTG93ZXJDYXNlKCl9LnZhbHVlYF0gPSBNYXRoLm1heCgwLCBzdGF0LnZhbHVlIC0gYW1vdW50KTtcclxuICAgIHRoaXMudXBkYXRlKGRhdGEpO1xyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQG92ZXJyaWRlXHJcbiAgICovXHJcbiAgYXN5bmMgY3JlYXRlRW1iZWRkZWRFbnRpdHkoLi4uYXJncykge1xyXG4gICAgY29uc3QgW18sIGRhdGFdID0gYXJncztcclxuXHJcbiAgICAvLyBSb2xsIHRoZSBcImxldmVsIGRpZVwiIHRvIGRldGVybWluZSB0aGUgaXRlbSdzIGxldmVsLCBpZiBwb3NzaWJsZVxyXG4gICAgaWYgKGRhdGEuZGF0YSAmJiBDU1IuaGFzTGV2ZWxEaWUuaW5jbHVkZXMoZGF0YS50eXBlKSkge1xyXG4gICAgICBjb25zdCBpdGVtRGF0YSA9IGRhdGEuZGF0YTtcclxuXHJcbiAgICAgIGlmICghaXRlbURhdGEubGV2ZWwgJiYgaXRlbURhdGEubGV2ZWxEaWUpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgLy8gU2VlIGlmIHRoZSBmb3JtdWxhIGlzIHZhbGlkXHJcbiAgICAgICAgICBpdGVtRGF0YS5sZXZlbCA9IG5ldyBSb2xsKGl0ZW1EYXRhLmxldmVsRGllKS5yb2xsKCkudG90YWw7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIF9pZDogdGhpcy5faWQsXHJcbiAgICAgICAgICAgIFwiZGF0YS5sZXZlbFwiOiBpdGVtRGF0YS5sZXZlbCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIC8vIElmIG5vdCwgZmFsbGJhY2sgdG8gc2FuZSBkZWZhdWx0XHJcbiAgICAgICAgICBpdGVtRGF0YS5sZXZlbCA9IGl0ZW1EYXRhLmxldmVsIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW1EYXRhLmxldmVsID0gaXRlbURhdGEubGV2ZWwgfHwgbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdXBlci5jcmVhdGVFbWJlZGRlZEVudGl0eSguLi5hcmdzKTtcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IENTUiA9IHt9O1xyXG5cclxuQ1NSLml0ZW1UeXBlcyA9IFtcclxuICAnc2tpbGxzJyxcclxuICAnYWJpbGl0aWVzJyxcclxuICAnY3lwaGVycycsXHJcbiAgJ2FydGlmYWN0cycsXHJcbiAgJ29kZGl0aWVzJyxcclxuICAnd2VhcG9ucycsXHJcbiAgJ2FybW9yJyxcclxuICAnZ2VhcidcclxuXTtcclxuXHJcbkNTUi5pbnZlbnRvcnlUeXBlcyA9IFtcclxuICAnd2VhcG9uJyxcclxuICAnYXJtb3InLFxyXG4gICdnZWFyJyxcclxuXHJcbiAgJ2N5cGhlcicsXHJcbiAgJ2FydGlmYWN0JyxcclxuICAnb2RkaXR5J1xyXG5dO1xyXG5cclxuQ1NSLndlaWdodENsYXNzZXMgPSBbXHJcbiAgJ0xpZ2h0JyxcclxuICAnTWVkaXVtJyxcclxuICAnSGVhdnknXHJcbl07XHJcblxyXG5DU1Iud2VhcG9uVHlwZXMgPSBbXHJcbiAgJ0Jhc2hpbmcnLFxyXG4gICdCbGFkZWQnLFxyXG4gICdSYW5nZWQnLFxyXG5dXHJcblxyXG5DU1Iuc3RhdHMgPSBbXHJcbiAgJ01pZ2h0JyxcclxuICAnU3BlZWQnLFxyXG4gICdJbnRlbGxlY3QnLFxyXG5dO1xyXG5cclxuQ1NSLnRyYWluaW5nTGV2ZWxzID0gW1xyXG4gICdJbmFiaWxpdHknLFxyXG4gICdVbnRyYWluZWQnLFxyXG4gICdUcmFpbmVkJyxcclxuICAnU3BlY2lhbGl6ZWQnXHJcbl07XHJcblxyXG5DU1IuZGFtYWdlVHJhY2sgPSBbXHJcbiAge1xyXG4gICAgbGFiZWw6ICdIYWxlJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnTm9ybWFsIHN0YXRlIGZvciBhIGNoYXJhY3Rlci4nXHJcbiAgfSxcclxuICB7XHJcbiAgICBsYWJlbDogJ0ltcGFpcmVkJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnSW4gYSB3b3VuZGVkIG9yIGluanVyZWQgc3RhdGUuIEFwcGx5aW5nIEVmZm9ydCBjb3N0cyAxIGV4dHJhIHBvaW50IHBlciBlZmZvcnQgbGV2ZWwgYXBwbGllZC4nXHJcbiAgfSxcclxuICB7XHJcbiAgICBsYWJlbDogJ0RlYmlsaXRhdGVkJyxcclxuICAgIGRlc2NyaXB0aW9uOiAnSW4gYSBjcml0aWNhbGx5IGluanVyZWQgc3RhdGUuIFRoZSBjaGFyYWN0ZXIgY2FuIGRvIG5vIG90aGVyIGFjdGlvbiB0aGFuIHRvIGNyYXdsIGFuIGltbWVkaWF0ZSBkaXN0YW5jZTsgaWYgdGhlaXIgU3BlZWQgcG9vbCBpcyAwLCB0aGV5IGNhbm5vdCBtb3ZlIGF0IGFsbC4nXHJcbiAgfSxcclxuICB7XHJcbiAgICBsYWJlbDogJ0RlYWQnLFxyXG4gICAgZGVzY3JpcHRpb246ICdUaGUgY2hhcmFjdGVyIGlzIGRlYWQuJ1xyXG4gIH1cclxuXTtcclxuXHJcbkNTUi5yZWNvdmVyaWVzID0ge1xyXG4gICdhY3Rpb24nOiAnMSBBY3Rpb24nLFxyXG4gICd0ZW5NaW5zJzogJzEwIG1pbnMnLFxyXG4gICdvbmVIb3VyJzogJzEgaG91cicsXHJcbiAgJ3RlbkhvdXJzJzogJzEwIGhvdXJzJ1xyXG59O1xyXG5cclxuQ1NSLmFkdmFuY2VzID0ge1xyXG4gICdzdGF0cyc6ICcrNCB0byBzdGF0IHBvb2xzJyxcclxuICAnZWRnZSc6ICcrMSB0byBFZGdlJyxcclxuICAnZWZmb3J0JzogJysxIHRvIEVmZm9ydCcsXHJcbiAgJ3NraWxscyc6ICdUcmFpbi9zcGVjaWFsaXplIHNraWxsJyxcclxuICAnb3RoZXInOiAnT3RoZXInLFxyXG59O1xyXG5cclxuQ1NSLnJhbmdlcyA9IFtcclxuICAnSW1tZWRpYXRlJyxcclxuICAnU2hvcnQnLFxyXG4gICdMb25nJyxcclxuICAnVmVyeSBMb25nJ1xyXG5dO1xyXG5cclxuQ1NSLm9wdGlvbmFsUmFuZ2VzID0gW1wiTi9BXCJdLmNvbmNhdChDU1IucmFuZ2VzKTtcclxuXHJcbkNTUi5hYmlsaXR5VHlwZXMgPSBbXHJcbiAgJ0FjdGlvbicsXHJcbiAgJ0VuYWJsZXInLFxyXG5dO1xyXG5cclxuQ1NSLnN1cHBvcnRzTWFjcm9zID0gW1xyXG4gICdza2lsbCcsXHJcbiAgJ2FiaWxpdHknXHJcbl07XHJcblxyXG5DU1IuaGFzTGV2ZWxEaWUgPSBbXHJcbiAgJ2N5cGhlcicsXHJcbiAgJ2FydGlmYWN0J1xyXG5dO1xyXG4iLCIvLyBJbXBvcnQgTW9kdWxlc1xyXG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1BY3RvciB9IGZyb20gXCIuL2FjdG9yL2FjdG9yLmpzXCI7XHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUFjdG9yU2hlZXQgfSBmcm9tIFwiLi9hY3Rvci9hY3Rvci1zaGVldC5qc1wiO1xyXG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1JdGVtIH0gZnJvbSBcIi4vaXRlbS9pdGVtLmpzXCI7XHJcbmltcG9ydCB7IEN5cGhlclN5c3RlbUl0ZW1TaGVldCB9IGZyb20gXCIuL2l0ZW0vaXRlbS1zaGVldC5qc1wiO1xyXG5cclxuaW1wb3J0IHsgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzIH0gZnJvbSAnLi9oYW5kbGViYXJzLWhlbHBlcnMuanMnO1xyXG5pbXBvcnQgeyBwcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcyB9IGZyb20gJy4vdGVtcGxhdGUuanMnO1xyXG5cclxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xyXG5cclxuICBnYW1lLmN5cGhlcnN5c3RlbUNsZWFuID0ge1xyXG4gICAgQ3lwaGVyU3lzdGVtQWN0b3IsXHJcbiAgICBDeXBoZXJTeXN0ZW1JdGVtXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IGFuIGluaXRpYXRpdmUgZm9ybXVsYSBmb3IgdGhlIHN5c3RlbVxyXG4gICAqIEB0eXBlIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgQ09ORklHLkNvbWJhdC5pbml0aWF0aXZlID0ge1xyXG4gICAgZm9ybXVsYTogXCIxZDIwXCIsXHJcbiAgICBkZWNpbWFsczogMlxyXG4gIH07XHJcblxyXG4gIC8vIERlZmluZSBjdXN0b20gRW50aXR5IGNsYXNzZXNcclxuICBDT05GSUcuQWN0b3IuZW50aXR5Q2xhc3MgPSBDeXBoZXJTeXN0ZW1BY3RvcjtcclxuICBDT05GSUcuSXRlbS5lbnRpdHlDbGFzcyA9IEN5cGhlclN5c3RlbUl0ZW07XHJcblxyXG4gIC8vIFJlZ2lzdGVyIHNoZWV0IGFwcGxpY2F0aW9uIGNsYXNzZXNcclxuICBBY3RvcnMudW5yZWdpc3RlclNoZWV0KFwiY29yZVwiLCBBY3RvclNoZWV0KTtcclxuICBBY3RvcnMucmVnaXN0ZXJTaGVldCgnY3lwaGVyc3lzdGVtQ2xlYW4nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XHJcbiAgICB0eXBlczogWydwYyddLFxyXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXHJcbiAgfSk7XHJcbiAgQWN0b3JzLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbUNsZWFuJywgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCwge1xyXG4gICAgdHlwZXM6IFsnbnBjJ10sXHJcbiAgICBtYWtlRGVmYXVsdDogdHJ1ZSxcclxuICB9KTtcclxuXHJcbiAgSXRlbXMudW5yZWdpc3RlclNoZWV0KFwiY29yZVwiLCBJdGVtU2hlZXQpO1xyXG4gIEl0ZW1zLnJlZ2lzdGVyU2hlZXQoXCJjeXBoZXJzeXN0ZW1DbGVhblwiLCBDeXBoZXJTeXN0ZW1JdGVtU2hlZXQsIHsgbWFrZURlZmF1bHQ6IHRydWUgfSk7XHJcblxyXG4gIHJlZ2lzdGVySGFuZGxlYmFySGVscGVycygpO1xyXG4gIHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzKCk7XHJcbn0pO1xyXG4iLCIvKiBnbG9iYWxzIERpYWxvZyAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvbGxEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xyXG4gIGNvbnN0cnVjdG9yKGRpYWxvZ0RhdGEsIG9wdGlvbnMpIHtcclxuICAgIHN1cGVyKGRpYWxvZ0RhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cInJvbGxNb2RlXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzEzNXB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuICB9XHJcbn0iLCJjb25zdCBFbnVtUG9vbCA9IFtcclxuICBcIk1pZ2h0XCIsXHJcbiAgXCJTcGVlZFwiLFxyXG4gIFwiSW50ZWxsZWN0XCJcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEVudW1Qb29sO1xyXG4iLCJjb25zdCBFbnVtUmFuZ2UgPSBbXHJcbiAgXCJJbW1lZGlhdGVcIixcclxuICBcIlNob3J0XCIsXHJcbiAgXCJMb25nXCIsXHJcbiAgXCJWZXJ5IExvbmdcIlxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW51bVJhbmdlO1xyXG4iLCJjb25zdCBFbnVtVHJhaW5pbmcgPSBbXHJcbiAgXCJJbmFiaWxpdHlcIixcclxuICBcIlVudHJhaW5lZFwiLFxyXG4gIFwiVHJhaW5lZFwiLFxyXG4gIFwiU3BlY2lhbGl6ZWRcIlxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRW51bVRyYWluaW5nO1xyXG4iLCJjb25zdCBFbnVtV2VhcG9uQ2F0ZWdvcnkgPSBbXHJcbiAgXCJCbGFkZWRcIixcclxuICBcIkJhc2hpbmdcIixcclxuICBcIlJhbmdlZFwiXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbnVtV2VhcG9uQ2F0ZWdvcnk7XHJcbiIsImNvbnN0IEVudW1XZWlnaHQgPSBbXHJcbiAgXCJMaWdodFwiLFxyXG4gIFwiTWVkaXVtXCIsXHJcbiAgXCJIZWF2eVwiXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFbnVtV2VpZ2h0O1xyXG4iLCJleHBvcnQgY29uc3QgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzID0gKCkgPT4ge1xyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvTG93ZXJDYXNlJywgc3RyID0+IHN0ci50b0xvd2VyQ2FzZSgpKTtcclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0b1VwcGVyQ2FzZScsIHRleHQgPT4gdGV4dC50b1VwcGVyQ2FzZSgpKTtcclxuXHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZXEnLCAodjEsIHYyKSA9PiB2MSA9PT0gdjIpO1xyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ25lcScsICh2MSwgdjIpID0+IHYxICE9PSB2Mik7XHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignb3InLCAodjEsIHYyKSA9PiB2MSB8fCB2Mik7XHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndGVybmFyeScsIChjb25kLCB2MSwgdjIpID0+IGNvbmQgPyB2MSA6IHYyKTtcclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdjb25jYXQnLCAodjEsIHYyKSA9PiBgJHt2MX0ke3YyfWApO1xyXG5cclxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdzdHJPclNwYWNlJywgdmFsID0+IHtcclxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gKHZhbCAmJiAhIXZhbC5sZW5ndGgpID8gdmFsIDogJyZuYnNwOyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbDtcclxuICB9KTtcclxuXHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndHJhaW5pbmdJY29uJywgdmFsID0+IHtcclxuICAgIHN3aXRjaCAodmFsKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5pbmFiaWxpdHknKX1cIj5bSV08L3NwYW4+YDtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLnVudHJhaW5lZCcpfVwiPltVXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudHJhaW5lZCcpfVwiPltUXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlIDM6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcuc3BlY2lhbGl6ZWQnKX1cIj5bU108L3NwYW4+YDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfSk7XHJcblxyXG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3Bvb2xJY29uJywgdmFsID0+IHtcclxuICAgIHN3aXRjaCAodmFsKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLm1pZ2h0Jyl9XCI+W01dPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLnNwZWVkJyl9XCI+W1NdPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLmludGVsbGVjdCcpfVwiPltJXTwvc3Bhbj5gO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnJztcclxuICB9KTtcclxuXHJcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndHlwZUljb24nLCB2YWwgPT4ge1xyXG4gICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgLy8gVE9ETzogQWRkIHNraWxsIGFuZCBhYmlsaXR5P1xyXG4gICAgICBcclxuICAgICAgY2FzZSAnYXJtb3InOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS5hcm1vcicpfVwiPlthXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlICd3ZWFwb24nOlxyXG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLmludmVudG9yeS53ZWFwb24nKX1cIj5bd108L3NwYW4+YDtcclxuICAgICAgY2FzZSAnZ2Vhcic6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmdlYXInKX1cIj5bZ108L3NwYW4+YDtcclxuICAgICAgXHJcbiAgICAgIGNhc2UgJ2N5cGhlcic6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmN5cGhlcicpfVwiPltDXTwvc3Bhbj5gO1xyXG4gICAgICBjYXNlICdhcnRpZmFjdCc6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W0FdPC9zcGFuPmA7XHJcbiAgICAgIGNhc2UgJ29kZGl0eSc6XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IuaW52ZW50b3J5LmFybW9yJyl9XCI+W09dPC9zcGFuPmA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH0pO1xyXG59O1xyXG4iLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0ICovXHJcblxyXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xyXG5cclxuLyoqXHJcbiAqIEV4dGVuZCB0aGUgYmFzaWMgSXRlbVNoZWV0IHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zXHJcbiAqIEBleHRlbmRzIHtJdGVtU2hlZXR9XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IGV4dGVuZHMgSXRlbVNoZWV0IHtcclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gbWVyZ2VPYmplY3Qoc3VwZXIuZGVmYXVsdE9wdGlvbnMsIHtcclxuICAgICAgY2xhc3NlczogW1wiY3lwaGVyc3lzdGVtXCIsIFwic2hlZXRcIiwgXCJpdGVtXCJdLFxyXG4gICAgICB3aWR0aDogMzAwLFxyXG4gICAgICBoZWlnaHQ6IDIwMCxcclxuICAgICAgdGFiczogW3tcclxuICAgICAgICBuYXZTZWxlY3RvcjogXCIuc2hlZXQtdGFic1wiLFxyXG4gICAgICAgIGNvbnRlbnRTZWxlY3RvcjogXCIuc2hlZXQtYm9keVwiLFxyXG4gICAgICAgIGluaXRpYWw6IFwiZGVzY3JpcHRpb25cIlxyXG4gICAgICB9XVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgY29uc3QgcGF0aCA9IFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvaXRlbVwiO1xyXG4gICAgcmV0dXJuIGAke3BhdGh9LyR7dGhpcy5pdGVtLmRhdGEudHlwZX0tc2hlZXQuaHRtbGA7XHJcbiAgfVxyXG5cclxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuICBfc2tpbGxEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XHJcbiAgICBkYXRhLnRyYWluaW5nTGV2ZWxzID0gQ1NSLnRyYWluaW5nTGV2ZWxzO1xyXG4gIH1cclxuXHJcbiAgX2FiaWxpdHlEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEuZGF0YS5yYW5nZXMgPSBDU1Iub3B0aW9uYWxSYW5nZXM7XHJcbiAgICBkYXRhLmRhdGEuc3RhdHMgPSBDU1Iuc3RhdHM7XHJcbiAgfVxyXG5cclxuICBfYXJtb3JEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEud2VpZ2h0Q2xhc3NlcyA9IENTUi53ZWlnaHRDbGFzc2VzO1xyXG4gIH1cclxuXHJcbiAgX3dlYXBvbkRhdGEoZGF0YSkge1xyXG4gICAgZGF0YS5yYW5nZXMgPSBDU1IucmFuZ2VzO1xyXG4gICAgZGF0YS53ZWFwb25UeXBlcyA9IENTUi53ZWFwb25UeXBlcztcclxuICAgIGRhdGEud2VpZ2h0Q2xhc3NlcyA9IENTUi53ZWlnaHRDbGFzc2VzO1xyXG4gIH1cclxuXHJcbiAgX2dlYXJEYXRhKGRhdGEpIHtcclxuICB9XHJcblxyXG4gIF9jeXBoZXJEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xyXG4gIH1cclxuXHJcbiAgX2FydGlmYWN0RGF0YShkYXRhKSB7XHJcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcclxuICB9XHJcblxyXG4gIF9vZGRpdHlEYXRhKGRhdGEpIHtcclxuICAgIGRhdGEuaXNHTSA9IGdhbWUudXNlci5pc0dNO1xyXG4gIH1cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIGdldERhdGEoKSB7XHJcbiAgICBjb25zdCBkYXRhID0gc3VwZXIuZ2V0RGF0YSgpO1xyXG5cclxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5pdGVtLmRhdGE7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnc2tpbGwnOlxyXG4gICAgICAgIHRoaXMuX3NraWxsRGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYWJpbGl0eSc6XHJcbiAgICAgICAgdGhpcy5fYWJpbGl0eURhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FybW9yJzpcclxuICAgICAgICB0aGlzLl9hcm1vckRhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3dlYXBvbic6XHJcbiAgICAgICAgdGhpcy5fd2VhcG9uRGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnZ2Vhcic6XHJcbiAgICAgICAgdGhpcy5fZ2VhckRhdGEoZGF0YSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2N5cGhlcic6XHJcbiAgICAgICAgdGhpcy5fY3lwaGVyRGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxyXG4gICAgICAgIHRoaXMuX2FydGlmYWN0RGF0YShkYXRhKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnb2RkaXR5JzpcclxuICAgICAgICB0aGlzLl9vZGRpdHlEYXRhKGRhdGEpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbiAgLyoqIEBvdmVycmlkZSAqL1xyXG4gIHNldFBvc2l0aW9uKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgcG9zaXRpb24gPSBzdXBlci5zZXRQb3NpdGlvbihvcHRpb25zKTtcclxuICAgIGNvbnN0IHNoZWV0Qm9keSA9IHRoaXMuZWxlbWVudC5maW5kKFwiLnNoZWV0LWJvZHlcIik7XHJcbiAgICBjb25zdCBib2R5SGVpZ2h0ID0gcG9zaXRpb24uaGVpZ2h0IC0gMTkyO1xyXG4gICAgc2hlZXRCb2R5LmNzcyhcImhlaWdodFwiLCBib2R5SGVpZ2h0KTtcclxuICAgIHJldHVybiBwb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4gIF9za2lsbExpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnc2tpbGwtd2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuc3RhdFwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMTBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEudHJhaW5pbmdcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTEwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgX2FiaWxpdHlMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FiaWxpdHktd2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEuaXNFbmFibGVyXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzIyMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5jb3N0LnBvb2xcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnODVweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEucmFuZ2VcIl0nKS5zZWxlY3QyKHtcclxuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXHJcbiAgICAgIHdpZHRoOiAnMTIwcHgnLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGNiSWRlbnRpZmllZCA9IGh0bWwuZmluZCgnI2NiLWlkZW50aWZpZWQnKTtcclxuICAgIGNiSWRlbnRpZmllZC5vbignY2hhbmdlJywgKGV2KSA9PiB7XHJcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5pdGVtLnVwZGF0ZSh7XHJcbiAgICAgICAgJ2RhdGEuaWRlbnRpZmllZCc6IGV2LnRhcmdldC5jaGVja2VkXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfYXJtb3JMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2FybW9yLXdpbmRvdycpO1xyXG5cclxuICAgIGh0bWwuZmluZCgnc2VsZWN0W25hbWU9XCJkYXRhLndlaWdodFwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMDBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfd2VhcG9uTGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCd3ZWFwb24td2luZG93Jyk7XHJcblxyXG4gICAgaHRtbC5maW5kKCdzZWxlY3RbbmFtZT1cImRhdGEud2VpZ2h0XCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzExMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS53ZWFwb25UeXBlXCJdJykuc2VsZWN0Mih7XHJcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxyXG4gICAgICB3aWR0aDogJzExMHB4JyxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICB9KTtcclxuXHJcbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5yYW5nZVwiXScpLnNlbGVjdDIoe1xyXG4gICAgICB0aGVtZTogJ251bWVuZXJhJyxcclxuICAgICAgd2lkdGg6ICcxMjBweCcsXHJcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfZ2Vhckxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnZ2Vhci13aW5kb3cnKTtcclxuICB9XHJcblxyXG4gIF9jeXBoZXJMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgaHRtbC5jbG9zZXN0KCcud2luZG93LWFwcC5zaGVldC5pdGVtJykuYWRkQ2xhc3MoJ2N5cGhlci13aW5kb3cnKTtcclxuICB9XHJcblxyXG4gIF9hcnRpZmFjdExpc3RlbmVycyhodG1sKSB7XHJcbiAgICBodG1sLmNsb3Nlc3QoJy53aW5kb3ctYXBwLnNoZWV0Lml0ZW0nKS5hZGRDbGFzcygnYXJ0aWZhY3Qtd2luZG93Jyk7XHJcbiAgfVxyXG5cclxuICBfb2RkaXR5TGlzdGVuZXJzKGh0bWwpIHtcclxuICAgIGh0bWwuY2xvc2VzdCgnLndpbmRvdy1hcHAuc2hlZXQuaXRlbScpLmFkZENsYXNzKCdvZGRpdHktd2luZG93Jyk7XHJcbiAgfVxyXG5cclxuICAvKiogQG92ZXJyaWRlICovXHJcbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xyXG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuZWRpdGFibGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgdHlwZSB9ID0gdGhpcy5pdGVtLmRhdGE7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgY2FzZSAnc2tpbGwnOlxyXG4gICAgICAgIHRoaXMuX3NraWxsTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICB0aGlzLl9hYmlsaXR5TGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcm1vcic6XHJcbiAgICAgICAgdGhpcy5fYXJtb3JMaXN0ZW5lcnMoaHRtbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3dlYXBvbic6XHJcbiAgICAgICAgdGhpcy5fd2VhcG9uTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdnZWFyJzpcclxuICAgICAgICB0aGlzLl9nZWFyTGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdjeXBoZXInOlxyXG4gICAgICAgIHRoaXMuX2N5cGhlckxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYXJ0aWZhY3QnOlxyXG4gICAgICAgIHRoaXMuX2FydGlmYWN0TGlzdGVuZXJzKGh0bWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdvZGRpdHknOlxyXG4gICAgICAgIHRoaXMuX29kZGl0eUxpc3RlbmVycyhodG1sKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLyogZ2xvYmFscyBJdGVtIHJlbmRlclRlbXBsYXRlICovXHJcblxyXG5pbXBvcnQgeyBDeXBoZXJSb2xscyB9IGZyb20gJy4uL3JvbGxzLmpzJztcclxuXHJcbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcclxuaW1wb3J0IEVudW1UcmFpbmluZyBmcm9tICcuLi9lbnVtcy9lbnVtLXRyYWluaW5nLmpzJztcclxuaW1wb3J0IEVudW1XZWlnaHQgZnJvbSAnLi4vZW51bXMvZW51bS13ZWlnaHQuanMnO1xyXG5pbXBvcnQgRW51bVJhbmdlIGZyb20gJy4uL2VudW1zL2VudW0tcmFuZ2UuanMnO1xyXG5pbXBvcnQgRW51bVdlYXBvbkNhdGVnb3J5IGZyb20gJy4uL2VudW1zL2VudW0td2VhcG9uLWNhdGVnb3J5LmpzJztcclxuXHJcbi8qKlxyXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW0gd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnMuXHJcbiAqIEBleHRlbmRzIHtJdGVtfVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW0gZXh0ZW5kcyBJdGVtIHtcclxuICBfcHJlcGFyZVNraWxsRGF0YSgpIHtcclxuICAgIGNvbnN0IGl0ZW1EYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgSXRlbSBkYXRhIG1vZGVsIHdpdGggYWRkaXRpb25hbCBkeW5hbWljIGRhdGEuXHJcbiAgICovXHJcbiAgcHJlcGFyZURhdGEoKSB7XHJcbiAgICBzdXBlci5wcmVwYXJlRGF0YSgpO1xyXG5cclxuICAgIGlmICh0aGlzLnR5cGUgPT09ICdza2lsbCcpIHtcclxuICAgICAgdGhpcy5fcHJlcGFyZVNraWxsRGF0YSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUm9sbFxyXG4gICAqL1xyXG5cclxuICBfc2tpbGxSb2xsKCkge1xyXG4gICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xyXG4gICAgY29uc3QgYWN0b3JEYXRhID0gYWN0b3IuZGF0YS5kYXRhO1xyXG5cclxuICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcztcclxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmRhdGE7XHJcbiAgICBjb25zdCB7IHBvb2wgfSA9IGl0ZW0uZGF0YTtcclxuICAgIGNvbnN0IGFzc2V0cyA9IGFjdG9yLmdldFNraWxsTGV2ZWwodGhpcyk7XHJcbiAgICBcclxuICAgIGNvbnN0IHBhcnRzID0gWycxZDIwJ107XHJcbiAgICBpZiAoYXNzZXRzICE9PSAwKSB7XHJcbiAgICAgIGNvbnN0IHNpZ24gPSBhc3NldHMgPCAwID8gJy0nIDogJysnO1xyXG4gICAgICBwYXJ0cy5wdXNoKGAke3NpZ259ICR7TWF0aC5hYnMoYXNzZXRzKSAqIDN9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgQ3lwaGVyUm9sbHMuUm9sbCh7XHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBwYXJ0cyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHBvb2wsXHJcbiAgICAgICAgYWJpbGl0eUNvc3Q6IDAsXHJcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxyXG4gICAgICAgIGFzc2V0c1xyXG4gICAgICB9LFxyXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXHJcbiAgICAgIGZsYXZvcjogYCR7YWN0b3IubmFtZX0gdXNlZCAke25hbWV9YCxcclxuICAgICAgdGl0bGU6ICdVc2UgU2tpbGwnLFxyXG4gICAgICBhY3RvclxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBfYWJpbGl0eVJvbGwoKSB7XHJcbiAgICBjb25zdCBhY3RvciA9IHRoaXMuYWN0b3I7XHJcbiAgICBjb25zdCBhY3RvckRhdGEgPSBhY3Rvci5kYXRhLmRhdGE7XHJcblxyXG4gICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzO1xyXG4gICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YTtcclxuICAgIGNvbnN0IHsgaXNFbmFibGVyLCBjb3N0IH0gPSBpdGVtLmRhdGE7XHJcblxyXG4gICAgaWYgKCFpc0VuYWJsZXIpIHtcclxuICAgICAgY29uc3QgeyBwb29sIH0gPSBjb3N0O1xyXG5cclxuICAgICAgaWYgKGFjdG9yLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgcGFyc2VJbnQoY29zdC5hbW91bnQsIDEwKSkpIHtcclxuICAgICAgICBDeXBoZXJSb2xscy5Sb2xsKHtcclxuICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgcGFydHM6IFsnMWQyMCddLFxyXG4gICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBwb29sLFxyXG4gICAgICAgICAgICBhYmlsaXR5Q29zdDogY29zdC5hbW91bnQsXHJcbiAgICAgICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcclxuICAgICAgICAgIGZsYXZvcjogYCR7YWN0b3IubmFtZX0gdXNlZCAke25hbWV9YCxcclxuICAgICAgICAgIHRpdGxlOiAnVXNlIEFiaWxpdHknLFxyXG4gICAgICAgICAgYWN0b3JcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcclxuICAgICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcclxuICAgICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcclxuICAgICAgICAgIGZsYXZvcjogJ0FiaWxpdHkgRmFpbGVkJyxcclxuICAgICAgICAgIGNvbnRlbnQ6IGBOb3QgZW5vdWdoIHBvaW50cyBpbiAke3Bvb2xOYW1lfSBwb29sLmBcclxuICAgICAgICB9XSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIENoYXRNZXNzYWdlLmNyZWF0ZShbe1xyXG4gICAgICAgIHNwZWFrZXI6IENoYXRNZXNzYWdlLmdldFNwZWFrZXIoeyBhY3RvciB9KSxcclxuICAgICAgICBmbGF2b3I6ICdJbnZhbGlkIEFiaWxpdHknLFxyXG4gICAgICAgIGNvbnRlbnQ6IGBUaGlzIGFiaWxpdHkgaXMgYW4gRW5hYmxlciBhbmQgY2Fubm90IGJlIHJvbGxlZCBmb3IuYFxyXG4gICAgICB9XSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByb2xsKCkge1xyXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgY2FzZSAnc2tpbGwnOlxyXG4gICAgICAgIHRoaXMuX3NraWxsUm9sbCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhYmlsaXR5JzpcclxuICAgICAgICB0aGlzLl9hYmlsaXR5Um9sbCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5mb1xyXG4gICAqL1xyXG5cclxuICBhc3luYyBfc2tpbGxJbmZvKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IHRyYWluaW5nID0gRW51bVRyYWluaW5nW2RhdGEuZGF0YS50cmFpbmluZ107XHJcbiAgICBjb25zdCBwb29sID0gRW51bVBvb2xzW2RhdGEuZGF0YS5wb29sXTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHJhaW5pbmc6IHRyYWluaW5nLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIHBvb2w6IHBvb2wudG9Mb3dlckNhc2UoKSxcclxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcclxuICAgIH07XHJcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vc2tpbGwtaW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9hYmlsaXR5SW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwb29sID0gRW51bVBvb2xzW2RhdGEuZGF0YS5jb3N0LnBvb2xdO1xyXG5cclxuICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgbmFtZTogZGF0YS5uYW1lLFxyXG4gICAgICBwb29sOiBwb29sLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIGlzRW5hYmxlcjogZGF0YS5kYXRhLmlzRW5hYmxlcixcclxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcclxuICAgIH07XHJcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYWJpbGl0eS1pbmZvLmh0bWwnLCBwYXJhbXMpO1xyXG5cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2FybW9ySW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCB3ZWlnaHQgPSBFbnVtV2VpZ2h0W2RhdGEuZGF0YS53ZWlnaHRdO1xyXG5cclxuICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgIGVxdWlwcGVkOiBkYXRhLmVxdWlwcGVkLFxyXG4gICAgICBxdWFudGl0eTogZGF0YS5kYXRhLnF1YW50aXR5LFxyXG4gICAgICB3ZWlnaHQ6IHdlaWdodC50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBhcm1vcjogZGF0YS5kYXRhLmFybW9yLFxyXG4gICAgICBhZGRpdGlvbmFsU3BlZWRFZmZvcnRDb3N0OiBkYXRhLmRhdGEuYWRkaXRpb25hbFNwZWVkRWZmb3J0Q29zdCxcclxuICAgICAgcHJpY2U6IGRhdGEuZGF0YS5wcmljZSxcclxuICAgICAgbm90ZXM6IGRhdGEuZGF0YS5ub3RlcyxcclxuICAgIH07XHJcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJtb3ItaW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF93ZWFwb25JbmZvKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IHdlaWdodCA9IEVudW1XZWlnaHRbZGF0YS5kYXRhLndlaWdodF07XHJcbiAgICBjb25zdCByYW5nZSA9IEVudW1SYW5nZVtkYXRhLmRhdGEucmFuZ2VdO1xyXG4gICAgY29uc3QgY2F0ZWdvcnkgPSBFbnVtV2VhcG9uQ2F0ZWdvcnlbZGF0YS5kYXRhLmNhdGVnb3J5XTtcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBlcXVpcHBlZDogZGF0YS5lcXVpcHBlZCxcclxuICAgICAgcXVhbnRpdHk6IGRhdGEuZGF0YS5xdWFudGl0eSxcclxuICAgICAgd2VpZ2h0OiB3ZWlnaHQudG9Mb3dlckNhc2UoKSxcclxuICAgICAgcmFuZ2U6IHJhbmdlLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICBkYW1hZ2U6IGRhdGEuZGF0YS5kYW1hZ2UsXHJcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL3dlYXBvbi1pbmZvLmh0bWwnLCBwYXJhbXMpO1xyXG5cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgX2dlYXJJbmZvKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgbmFtZTogZGF0YS5uYW1lLFxyXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgIHF1YW50aXR5OiBkYXRhLmRhdGEucXVhbnRpdHksXHJcbiAgICAgIHByaWNlOiBkYXRhLmRhdGEucHJpY2UsXHJcbiAgICAgIG5vdGVzOiBkYXRhLmRhdGEubm90ZXMsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2dlYXItaW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIF9jeXBoZXJJbmZvKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgbmFtZTogZGF0YS5uYW1lLFxyXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxyXG4gICAgICBpZGVudGlmaWVkOiBkYXRhLmRhdGEuaWRlbnRpZmllZCxcclxuICAgICAgbGV2ZWw6IGRhdGEuZGF0YS5sZXZlbCxcclxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXHJcbiAgICAgIGVmZmVjdDogZGF0YS5kYXRhLmVmZmVjdCxcclxuICAgIH07XHJcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVuZGVyVGVtcGxhdGUoJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vY3lwaGVyLWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfYXJ0aWZhY3RJbmZvKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgICAgbmFtZTogZGF0YS5uYW1lLFxyXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXHJcbiAgICAgIGlzR006IGdhbWUudXNlci5pc0dNLFxyXG4gICAgICBpZGVudGlmaWVkOiBkYXRhLmRhdGEuaWRlbnRpZmllZCxcclxuICAgICAgbGV2ZWw6IGRhdGEuZGF0YS5sZXZlbCxcclxuICAgICAgZm9ybTogZGF0YS5kYXRhLmZvcm0sXHJcbiAgICAgIGlzRGVwbGV0aW5nOiBkYXRhLmRhdGEuZGVwbGV0aW9uLmlzRGVwbGV0aW5nLFxyXG4gICAgICBkZXBsZXRpb25UaHJlc2hvbGQ6IGRhdGEuZGF0YS5kZXBsZXRpb24udGhyZXNob2xkLFxyXG4gICAgICBkZXBsZXRpb25EaWU6IGRhdGEuZGF0YS5kZXBsZXRpb24uZGllLFxyXG4gICAgICBlZmZlY3Q6IGRhdGEuZGF0YS5lZmZlY3QsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKCdzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9pbmZvL2FydGlmYWN0LWluZm8uaHRtbCcsIHBhcmFtcyk7XHJcblxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfVxyXG5cclxuICBhc3luYyBfb2RkaXR5SW5mbygpIHtcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB7XHJcbiAgICAgIG5hbWU6IGRhdGEubmFtZSxcclxuICAgICAgdHlwZTogdGhpcy50eXBlLFxyXG4gICAgICBub3RlczogZGF0YS5kYXRhLm5vdGVzLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSgnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sJywgcGFyYW1zKTtcclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcblxyXG4gIGFzeW5jIGdldEluZm8oKSB7XHJcbiAgICBsZXQgaHRtbCA9ICcnO1xyXG5cclxuICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ3NraWxsJzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fc2tpbGxJbmZvKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FiaWxpdHknOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9hYmlsaXR5SW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhcm1vcic6XHJcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX2FybW9ySW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd3ZWFwb24nOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl93ZWFwb25JbmZvKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2dlYXInOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9nZWFySW5mbygpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdjeXBoZXInOlxyXG4gICAgICAgIGh0bWwgPSBhd2FpdCB0aGlzLl9jeXBoZXJJbmZvKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2FydGlmYWN0JzpcclxuICAgICAgICBodG1sID0gYXdhaXQgdGhpcy5fYXJ0aWZhY3RJbmZvKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ29kZGl0eSc6XHJcbiAgICAgICAgaHRtbCA9IGF3YWl0IHRoaXMuX29kZGl0eUluZm8oKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaHRtbDtcclxuICB9XHJcbn1cclxuIiwiLyogZ2xvYmFscyByZW5kZXJUZW1wbGF0ZSAqL1xyXG5cclxuaW1wb3J0IHsgUm9sbERpYWxvZyB9IGZyb20gJy4vZGlhbG9nL3JvbGwtZGlhbG9nLmpzJztcclxuXHJcbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEN5cGhlclJvbGxzIHtcclxuICBzdGF0aWMgYXN5bmMgUm9sbCh7IHBhcnRzID0gW10sIGRhdGEgPSB7fSwgYWN0b3IgPSBudWxsLCBldmVudCA9IG51bGwsIHNwZWFrZXIgPSBudWxsLCBmbGF2b3IgPSBudWxsLCB0aXRsZSA9IG51bGwsIGl0ZW0gPSBmYWxzZSB9ID0ge30pIHtcclxuICAgIGxldCByb2xsTW9kZSA9IGdhbWUuc2V0dGluZ3MuZ2V0KCdjb3JlJywgJ3JvbGxNb2RlJyk7XHJcbiAgICBsZXQgcm9sbGVkID0gZmFsc2U7XHJcbiAgICBsZXQgZmlsdGVyZWQgPSBwYXJ0cy5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgIHJldHVybiBlbCAhPSAnJyAmJiBlbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBtYXhFZmZvcnQgPSAxO1xyXG4gICAgaWYgKGRhdGFbJ21heEVmZm9ydCddKSB7XHJcbiAgICAgIG1heEVmZm9ydCA9IHBhcnNlSW50KGRhdGFbJ21heEVmZm9ydCddLCAxMCkgfHwgMTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBfcm9sbCA9IChmb3JtID0gbnVsbCkgPT4ge1xyXG4gICAgICAvLyBPcHRpb25hbGx5IGluY2x1ZGUgZWZmb3J0XHJcbiAgICAgIGlmIChmb3JtICE9PSBudWxsKSB7XHJcbiAgICAgICAgZGF0YVsnZWZmb3J0J10gPSBwYXJzZUludChmb3JtLmVmZm9ydC52YWx1ZSwgMTApO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhWydlZmZvcnQnXSkge1xyXG4gICAgICAgIGZpbHRlcmVkLnB1c2goYCske2RhdGFbJ2VmZm9ydCddICogM31gKTtcclxuXHJcbiAgICAgICAgZmxhdm9yICs9IGAgd2l0aCAke2RhdGFbJ2VmZm9ydCddfSBFZmZvcnRgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJvbGwgPSBuZXcgUm9sbChmaWx0ZXJlZC5qb2luKCcnKSwgZGF0YSkucm9sbCgpO1xyXG4gICAgICAvLyBDb252ZXJ0IHRoZSByb2xsIHRvIGEgY2hhdCBtZXNzYWdlIGFuZCByZXR1cm4gdGhlIHJvbGxcclxuICAgICAgcm9sbE1vZGUgPSBmb3JtID8gZm9ybS5yb2xsTW9kZS52YWx1ZSA6IHJvbGxNb2RlO1xyXG4gICAgICByb2xsZWQgPSB0cnVlO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuIHJvbGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGVtcGxhdGUgPSAnc3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvZGlhbG9nL3JvbGwtZGlhbG9nLmh0bWwnO1xyXG4gICAgbGV0IGRpYWxvZ0RhdGEgPSB7XHJcbiAgICAgIGZvcm11bGE6IGZpbHRlcmVkLmpvaW4oJyAnKSxcclxuICAgICAgbWF4RWZmb3J0OiBtYXhFZmZvcnQsXHJcbiAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgIHJvbGxNb2RlOiByb2xsTW9kZSxcclxuICAgICAgcm9sbE1vZGVzOiBDT05GSUcuRGljZS5yb2xsTW9kZXNcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaHRtbCA9IGF3YWl0IHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlLCBkaWFsb2dEYXRhKTtcclxuICAgIC8vQ3JlYXRlIERpYWxvZyB3aW5kb3dcclxuICAgIGxldCByb2xsO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICBuZXcgUm9sbERpYWxvZyh7XHJcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgIGNvbnRlbnQ6IGh0bWwsXHJcbiAgICAgICAgYnV0dG9uczoge1xyXG4gICAgICAgICAgb2s6IHtcclxuICAgICAgICAgICAgbGFiZWw6ICdPSycsXHJcbiAgICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS1jaGVja1wiPjwvaT4nLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKGh0bWwpID0+IHtcclxuICAgICAgICAgICAgICByb2xsID0gX3JvbGwoaHRtbFswXS5jaGlsZHJlblswXSk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIHJvbGwucmVzdWx0IGFnYWluc3QgdGFyZ2V0IG51bWJlclxyXG5cclxuICAgICAgICAgICAgICBjb25zdCB7IHBvb2wgfSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgY29uc3QgYW1vdW50T2ZFZmZvcnQgPSBwYXJzZUludChkYXRhWydlZmZvcnQnXSB8fCAwLCAxMCk7XHJcbiAgICAgICAgICAgICAgY29uc3QgZWZmb3J0Q29zdCA9IGFjdG9yLmdldEVmZm9ydENvc3RGcm9tU3RhdChwb29sLCBhbW91bnRPZkVmZm9ydCk7XHJcbiAgICAgICAgICAgICAgY29uc3QgdG90YWxDb3N0ID0gcGFyc2VJbnQoZGF0YVsnYWJpbGl0eUNvc3QnXSB8fCAwLCAxMCkgKyBwYXJzZUludChlZmZvcnRDb3N0LmNvc3QsIDEwKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGFjdG9yLmNhblNwZW5kRnJvbVBvb2wocG9vbCwgdG90YWxDb3N0KSAmJiAhZWZmb3J0Q29zdC53YXJuaW5nKSB7XHJcbiAgICAgICAgICAgICAgICByb2xsLnRvTWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWFrZXI6IHNwZWFrZXIsXHJcbiAgICAgICAgICAgICAgICAgIGZsYXZvcjogZmxhdm9yXHJcbiAgICAgICAgICAgICAgICB9LCB7IHJvbGxNb2RlIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGFjdG9yLnNwZW5kRnJvbVBvb2wocG9vbCwgdG90YWxDb3N0KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XHJcbiAgICAgICAgICAgICAgICBDaGF0TWVzc2FnZS5jcmVhdGUoW3tcclxuICAgICAgICAgICAgICAgICAgc3BlYWtlcixcclxuICAgICAgICAgICAgICAgICAgZmxhdm9yOiAnUm9sbCBGYWlsZWQnLFxyXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBgTm90IGVub3VnaCBwb2ludHMgaW4gJHtwb29sTmFtZX0gcG9vbC5gXHJcbiAgICAgICAgICAgICAgICB9XSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjYW5jZWw6IHtcclxuICAgICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPicsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnQ2FuY2VsJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWZhdWx0OiAnb2snLFxyXG4gICAgICAgIGNsb3NlOiAoKSA9PiB7XHJcbiAgICAgICAgICByZXNvbHZlKHJvbGxlZCA/IHJvbGwgOiBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS5yZW5kZXIodHJ1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiLyogZ2xvYmFscyBsb2FkVGVtcGxhdGVzICovXHJcblxyXG4vKipcclxuICogRGVmaW5lIGEgc2V0IG9mIHRlbXBsYXRlIHBhdGhzIHRvIHByZS1sb2FkXHJcbiAqIFByZS1sb2FkZWQgdGVtcGxhdGVzIGFyZSBjb21waWxlZCBhbmQgY2FjaGVkIGZvciBmYXN0IGFjY2VzcyB3aGVuIHJlbmRlcmluZ1xyXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzID0gYXN5bmMoKSA9PiB7XHJcbiAgLy8gRGVmaW5lIHRlbXBsYXRlIHBhdGhzIHRvIGxvYWRcclxuICBjb25zdCB0ZW1wbGF0ZVBhdGhzID0gW1xyXG5cclxuICAgICAgLy8gQWN0b3IgU2hlZXRzXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvYWN0b3Itc2hlZXQuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BjLXNoZWV0Lmh0bWxcIixcclxuXHJcbiAgICAgIC8vIEFjdG9yIFBhcnRpYWxzXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvcG9vbHMuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2FkdmFuY2VtZW50Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9kYW1hZ2UtdHJhY2suaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3JlY292ZXJ5Lmh0bWxcIixcclxuXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvc2tpbGxzLmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9hYmlsaXRpZXMuaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2ludmVudG9yeS5odG1sXCIsXHJcblxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vc2tpbGwtaW5mby5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9hYmlsaXR5LWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJtb3ItaW5mby5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby93ZWFwb24taW5mby5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9nZWFyLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vY3lwaGVyLWluZm8uaHRtbFwiLFxyXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2luZm8vYXJ0aWZhY3QtaW5mby5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvaW5mby9vZGRpdHktaW5mby5odG1sXCIsXHJcblxyXG4gICAgICAvL0l0ZW0gU2hlZXRzXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvaXRlbS9pdGVtLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL3NraWxsLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2FybW9yLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL3dlYXBvbi1zaGVldC5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvaXRlbS9nZWFyLXNoZWV0Lmh0bWxcIixcclxuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9pdGVtL2N5cGhlci1zaGVldC5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvaXRlbS9hcnRpZmFjdC1zaGVldC5odG1sXCIsXHJcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvaXRlbS9vZGRpdHktc2hlZXQuaHRtbFwiLFxyXG4gIF07XHJcblxyXG4gIC8vIExvYWQgdGhlIHRlbXBsYXRlIHBhcnRzXHJcbiAgcmV0dXJuIGxvYWRUZW1wbGF0ZXModGVtcGxhdGVQYXRocyk7XHJcbn07XHJcbiIsImV4cG9ydCBmdW5jdGlvbiBkZWVwUHJvcChvYmosIHBhdGgpIHtcclxuICBjb25zdCBwcm9wcyA9IHBhdGguc3BsaXQoJy4nKTtcclxuICBsZXQgdmFsID0gb2JqO1xyXG4gIHByb3BzLmZvckVhY2gocCA9PiB7XHJcbiAgICBpZiAocCBpbiB2YWwpIHtcclxuICAgICAgdmFsID0gdmFsW3BdO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiB2YWw7XHJcbn1cclxuIiwiZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgYXJyMltpXSA9IGFycltpXTtcbiAgfVxuXG4gIHJldHVybiBhcnIyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheUxpa2VUb0FycmF5OyIsImZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgcmV0dXJuIGFycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXJyYXlXaXRoSG9sZXM7IiwiZnVuY3Rpb24gX2Fzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKSB7XG4gIGlmIChzZWxmID09PSB2b2lkIDApIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gc2VsZjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXNzZXJ0VGhpc0luaXRpYWxpemVkOyIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2NsYXNzQ2FsbENoZWNrOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY3JlYXRlQ2xhc3M7IiwidmFyIHN1cGVyUHJvcEJhc2UgPSByZXF1aXJlKFwiLi9zdXBlclByb3BCYXNlXCIpO1xuXG5mdW5jdGlvbiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmICh0eXBlb2YgUmVmbGVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBSZWZsZWN0LmdldCkge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IFJlZmxlY3QuZ2V0O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2dldCA9IGZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgICAgIHZhciBiYXNlID0gc3VwZXJQcm9wQmFzZSh0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgIGlmICghYmFzZSkgcmV0dXJuO1xuICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGJhc2UsIHByb3BlcnR5KTtcblxuICAgICAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgICAgIHJldHVybiBkZXNjLmdldC5jYWxsKHJlY2VpdmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyIHx8IHRhcmdldCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dldDsiLCJmdW5jdGlvbiBfZ2V0UHJvdG90eXBlT2Yobykge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5nZXRQcm90b3R5cGVPZiA6IGZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gICAgcmV0dXJuIG8uX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihvKTtcbiAgfTtcbiAgcmV0dXJuIF9nZXRQcm90b3R5cGVPZihvKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0UHJvdG90eXBlT2Y7IiwidmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vc2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIHNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW5oZXJpdHM7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJmdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB7XG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcInVuZGVmaW5lZFwiIHx8ICEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcbiAgdmFyIF9lID0gdW5kZWZpbmVkO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2l0ZXJhYmxlVG9BcnJheUxpbWl0OyIsImZ1bmN0aW9uIF9ub25JdGVyYWJsZVJlc3QoKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX25vbkl0ZXJhYmxlUmVzdDsiLCJ2YXIgX3R5cGVvZiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIGFzc2VydFRoaXNJbml0aWFsaXplZCA9IHJlcXVpcmUoXCIuL2Fzc2VydFRoaXNJbml0aWFsaXplZFwiKTtcblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkge1xuICBpZiAoY2FsbCAmJiAoX3R5cGVvZihjYWxsKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgIHJldHVybiBjYWxsO1xuICB9XG5cbiAgcmV0dXJuIGFzc2VydFRoaXNJbml0aWFsaXplZChzZWxmKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjsiLCJmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICBtb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkge1xuICAgIG8uX19wcm90b19fID0gcDtcbiAgICByZXR1cm4gbztcbiAgfTtcblxuICByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zZXRQcm90b3R5cGVPZjsiLCJ2YXIgYXJyYXlXaXRoSG9sZXMgPSByZXF1aXJlKFwiLi9hcnJheVdpdGhIb2xlc1wiKTtcblxudmFyIGl0ZXJhYmxlVG9BcnJheUxpbWl0ID0gcmVxdWlyZShcIi4vaXRlcmFibGVUb0FycmF5TGltaXRcIik7XG5cbnZhciB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheSA9IHJlcXVpcmUoXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5XCIpO1xuXG52YXIgbm9uSXRlcmFibGVSZXN0ID0gcmVxdWlyZShcIi4vbm9uSXRlcmFibGVSZXN0XCIpO1xuXG5mdW5jdGlvbiBfc2xpY2VkVG9BcnJheShhcnIsIGkpIHtcbiAgcmV0dXJuIGFycmF5V2l0aEhvbGVzKGFycikgfHwgaXRlcmFibGVUb0FycmF5TGltaXQoYXJyLCBpKSB8fCB1bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIsIGkpIHx8IG5vbkl0ZXJhYmxlUmVzdCgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9zbGljZWRUb0FycmF5OyIsInZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuL2dldFByb3RvdHlwZU9mXCIpO1xuXG5mdW5jdGlvbiBfc3VwZXJQcm9wQmFzZShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHdoaWxlICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpKSB7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICBpZiAob2JqZWN0ID09PSBudWxsKSBicmVhaztcbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3N1cGVyUHJvcEJhc2U7IiwiZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF90eXBlb2Yob2JqKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mOyIsInZhciBhcnJheUxpa2VUb0FycmF5ID0gcmVxdWlyZShcIi4vYXJyYXlMaWtlVG9BcnJheVwiKTtcblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIGFycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXk7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iXX0=
