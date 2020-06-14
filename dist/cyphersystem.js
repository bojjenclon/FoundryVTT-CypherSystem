/*! cyphersystem v1.0.0 | (c) 2020 Cornell Daly | MIT License | https://github.com/bojjenclon/ */

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,(function(r){var n=e[i][1][r];return o(n||r)}),p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemActorSheet = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _config = require("../config.js");

var _rolls = require("../rolls.js");

var _item = require("../item/item.js");

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
        return itm.data[filterField] === filterValue;
      }));
    }
    /** @override */

  }, {
    key: "getData",
    value: function getData() {
      var data = (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActorSheet.prototype), "getData", this).call(this);
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
    }
  }]);
  return CypherSystemActorSheet;
})(ActorSheet);

exports.CypherSystemActorSheet = CypherSystemActorSheet;

},{"../config.js":3,"../enums/enum-pool.js":6,"../item/item.js":10,"../rolls.js":11,"@babel/runtime/helpers/classCallCheck":17,"@babel/runtime/helpers/createClass":18,"@babel/runtime/helpers/get":19,"@babel/runtime/helpers/getPrototypeOf":20,"@babel/runtime/helpers/inherits":21,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/possibleConstructorReturn":25,"@babel/runtime/helpers/slicedToArray":27}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemActor = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

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
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemActor.prototype), "prepareData", this).call(this);
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
  }]);
  return CypherSystemActor;
})(Actor);

exports.CypherSystemActor = CypherSystemActor;

},{"../enums/enum-pool.js":6,"@babel/runtime/helpers/classCallCheck":17,"@babel/runtime/helpers/createClass":18,"@babel/runtime/helpers/get":19,"@babel/runtime/helpers/getPrototypeOf":20,"@babel/runtime/helpers/inherits":21,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/possibleConstructorReturn":25}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CSR = void 0;
var CSR = {};
exports.CSR = CSR;
CSR.itemTypes = ['skills', 'abilities', 'cyphers', 'artifacts', 'oddities', 'weapons', 'armor', 'gear'];
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

},{"./actor/actor-sheet.js":1,"./actor/actor.js":2,"./handlebars-helpers.js":8,"./item/item-sheet.js":9,"./item/item.js":10,"./template.js":12,"@babel/runtime/helpers/asyncToGenerator":16,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/regenerator":32}],5:[function(require,module,exports){
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

},{"@babel/runtime/helpers/classCallCheck":17,"@babel/runtime/helpers/createClass":18,"@babel/runtime/helpers/get":19,"@babel/runtime/helpers/getPrototypeOf":20,"@babel/runtime/helpers/inherits":21,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/possibleConstructorReturn":25}],6:[function(require,module,exports){
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
var EnumTraining = ["Inability", "Untrained", "Trained", "Specialized"];
var _default = EnumTraining;
exports.default = _default;

},{}],8:[function(require,module,exports){
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
};

exports.registerHandlebarHelpers = registerHandlebarHelpers;

},{}],9:[function(require,module,exports){
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

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))); return true; } catch (e) { return false; } }

/* globals mergeObject */

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
    key: "getData",

    /* -------------------------------------------- */

    /** @override */
    value: function getData() {
      var data = (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet.prototype), "getData", this).call(this);
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

    /** @override */

  }, {
    key: "activateListeners",
    value: function activateListeners(html) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet.prototype), "activateListeners", this).call(this, html); // Everything below here is only needed if the sheet is editable

      if (!this.options.editable) return; // Roll handlers, click handlers, etc. would go here.
    }
  }, {
    key: "template",

    /** @override */
    get: function get() {
      var path = "systems/cyphersystemClean/templates/item"; // Return a single sheet for all item types.

      return "".concat(path, "/item-sheet.html"); // Alternatively, you could use the following return statement to do a
      // unique item sheet by type, like `weapon-sheet.html`.
      // return `${path}/${this.item.data.type}-sheet.html`;
    }
  }], [{
    key: "defaultOptions",

    /** @override */
    get: function get() {
      return mergeObject((0, _get2.default)((0, _getPrototypeOf2.default)(CypherSystemItemSheet), "defaultOptions", this), {
        classes: ["cyphersystem", "sheet", "item"],
        width: 520,
        height: 480,
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

},{"@babel/runtime/helpers/classCallCheck":17,"@babel/runtime/helpers/createClass":18,"@babel/runtime/helpers/get":19,"@babel/runtime/helpers/getPrototypeOf":20,"@babel/runtime/helpers/inherits":21,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/possibleConstructorReturn":25}],10:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CypherSystemItem = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _rolls = require("../rolls.js");

var _enumPool = _interopRequireDefault(require("../enums/enum-pool.js"));

var _enumTraining = _interopRequireDefault(require("../enums/enum-training.js"));

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
    key: "roll",
    value: function roll() {
      switch (this.type) {
        case 'skill':
          this._skillRoll();

      }
    }
    /**
     * Info
     */

  }, {
    key: "_skillInfo",
    value: function _skillInfo() {
      var data = this.data;
      var training = _enumTraining.default[data.data.training];
      var pool = _enumPool.default[data.data.pool];
      var i18nTraining = game.i18n.localize("CSR.training.".concat(training.toLowerCase()));
      var i18nPool = game.i18n.localize("CSR.pool.".concat(pool.toLowerCase()));
      var i18nRoll = game.i18n.localize('CSR.tooltip.roll');
      var i18nEdit = game.i18n.localize('CSR.tooltip.edit');
      var i18nDelete = game.i18n.localize('CSR.tooltip.delete');
      return "\n      <h2>".concat(data.name, "</h2>\n      <div class=\"grid grid-3col\">\n        <strong class=\"text-left\">").concat(i18nTraining, "</strong>\n        <strong class=\"text-center\">").concat(i18nPool, "</strong>\n        <div class=\"text-center\">\n          <div class=\"grid grid-3col actions\">\n            <a class=\"roll\" title=\"").concat(i18nRoll, "\"><i class=\"fas fa-dice-d20\"></i></a>\n            <a class=\"edit\" title=\"").concat(i18nEdit, "\"><i class=\"fas fa-edit\"></i></a>\n            <a class=\"delete\" title=\"").concat(i18nDelete, "\"><i class=\"fas fa-trash\"></i></a>\n          </div>\n        </div>\n      </div>\n      \n      <hr>\n      <p>").concat(data.data.notes, "</p>\n    ");
    }
  }, {
    key: "info",
    get: function get() {
      switch (this.type) {
        case 'skill':
          return this._skillInfo();
      }

      return '';
    }
  }]);
  return CypherSystemItem;
})(Item);

exports.CypherSystemItem = CypherSystemItem;

},{"../enums/enum-pool.js":6,"../enums/enum-training.js":7,"../rolls.js":11,"@babel/runtime/helpers/classCallCheck":17,"@babel/runtime/helpers/createClass":18,"@babel/runtime/helpers/get":19,"@babel/runtime/helpers/getPrototypeOf":20,"@babel/runtime/helpers/inherits":21,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/possibleConstructorReturn":25}],11:[function(require,module,exports){
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

},{"./dialog/roll-dialog.js":5,"./enums/enum-pool.js":6,"@babel/runtime/helpers/asyncToGenerator":16,"@babel/runtime/helpers/classCallCheck":17,"@babel/runtime/helpers/createClass":18,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/regenerator":32}],12:[function(require,module,exports){
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
            "systems/cyphersystemClean/templates/actor/partials/pools.html", "systems/cyphersystemClean/templates/actor/partials/advancement.html", "systems/cyphersystemClean/templates/actor/partials/damage-track.html", "systems/cyphersystemClean/templates/actor/partials/recovery.html", "systems/cyphersystemClean/templates/actor/partials/skills.html", //Item Sheets
            "systems/cyphersystemClean/templates/item/item-sheet.html"]; // Load the template parts

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

},{"@babel/runtime/helpers/asyncToGenerator":16,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/regenerator":32}],13:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],14:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],15:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{"./superPropBase":28}],20:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],21:[function(require,module,exports){
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
},{"./setPrototypeOf":26}],22:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],25:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":29,"./assertThisInitialized":15}],26:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],27:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":14,"./iterableToArrayLimit":23,"./nonIterableRest":24,"./unsupportedIterableToArray":30}],28:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":20}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{"./arrayLikeToArray":13}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":31}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3Itc2hlZXQuanMiLCJtb2R1bGUvYWN0b3IvYWN0b3IuanMiLCJtb2R1bGUvY29uZmlnLmpzIiwibW9kdWxlL2N5cGhlcnN5c3RlbS5qcyIsIm1vZHVsZS9kaWFsb2cvcm9sbC1kaWFsb2cuanMiLCJtb2R1bGUvZW51bXMvZW51bS1wb29sLmpzIiwibW9kdWxlL2VudW1zL2VudW0tdHJhaW5pbmcuanMiLCJtb2R1bGUvaGFuZGxlYmFycy1oZWxwZXJzLmpzIiwibW9kdWxlL2l0ZW0vaXRlbS1zaGVldC5qcyIsIm1vZHVsZS9pdGVtL2l0ZW0uanMiLCJtb2R1bGUvcm9sbHMuanMiLCJtb2R1bGUvdGVtcGxhdGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hcnJheUxpa2VUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXJyYXlXaXRoSG9sZXMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL2dldFByb3RvdHlwZU9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL25vbkl0ZXJhYmxlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zZXRQcm90b3R5cGVPZi5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9zdXBlclByb3BCYXNlLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdHlwZW9mLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIm5vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVBOzs7O0lBSWEsc0I7Ozs7Ozs7O0FBb0JYOzs7O3dCQUllO0FBQ2IsYUFBTyx5REFBUDtBQUNEO0FBRUQ7Ozs7O0FBMUJBO3dCQUM0QjtBQUMxQixhQUFPLFdBQVcsb0dBQXVCO0FBQ3ZDLFFBQUEsT0FBTyxFQUFFLENBQUMsY0FBRCxFQUFpQixPQUFqQixFQUEwQixPQUExQixDQUQ4QjtBQUV2QyxRQUFBLEtBQUssRUFBRSxHQUZnQztBQUd2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QUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dEJBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBnbG9iYWxzIG1lcmdlT2JqZWN0IERpYWxvZyAqL1xuXG5pbXBvcnQgeyBDU1IgfSBmcm9tICcuLi9jb25maWcuanMnO1xuaW1wb3J0IHsgQ3lwaGVyUm9sbHMgfSBmcm9tICcuLi9yb2xscy5qcyc7XG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1JdGVtIH0gZnJvbSAnLi4vaXRlbS9pdGVtLmpzJztcblxuaW1wb3J0IEVudW1Qb29scyBmcm9tICcuLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuXG4vKipcbiAqIEV4dGVuZCB0aGUgYmFzaWMgQWN0b3JTaGVldCB3aXRoIHNvbWUgdmVyeSBzaW1wbGUgbW9kaWZpY2F0aW9uc1xuICogQGV4dGVuZHMge0FjdG9yU2hlZXR9XG4gKi9cbmV4cG9ydCBjbGFzcyBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0IGV4dGVuZHMgQWN0b3JTaGVldCB7XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgIHJldHVybiBtZXJnZU9iamVjdChzdXBlci5kZWZhdWx0T3B0aW9ucywge1xuICAgICAgY2xhc3NlczogW1wiY3lwaGVyc3lzdGVtXCIsIFwic2hlZXRcIiwgXCJhY3RvclwiXSxcbiAgICAgIHdpZHRoOiA2NzIsXG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIHRhYnM6IFt7IFxuICAgICAgICBuYXZTZWxlY3RvcjogXCIuc2hlZXQtdGFic1wiLCBcbiAgICAgICAgY29udGVudFNlbGVjdG9yOiBcIi5zaGVldC1ib2R5XCIsIFxuICAgICAgICBpbml0aWFsOiBcImRlc2NyaXB0aW9uXCIgXG4gICAgICB9LCB7XG4gICAgICAgIG5hdlNlbGVjdG9yOiAnLnN0YXRzLXRhYnMnLFxuICAgICAgICBjb250ZW50U2VsZWN0b3I6ICcuc3RhdHMtYm9keScsXG4gICAgICAgIGluaXRpYWw6ICdhZHZhbmNlbWVudCdcbiAgICAgIH1dXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3JyZWN0IEhUTUwgdGVtcGxhdGUgcGF0aCB0byB1c2UgZm9yIHJlbmRlcmluZyB0aGlzIHBhcnRpY3VsYXIgc2hlZXRcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYy1zaGVldC5odG1sXCI7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcblxuICAgIHRoaXMuc2tpbGxzUG9vbEZpbHRlciA9IC0xO1xuICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSAtMTtcbiAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBudWxsO1xuICB9XG5cbiAgX2dlbmVyYXRlSXRlbURhdGEoZGF0YSwgdHlwZSwgZmllbGQpIHtcbiAgICBjb25zdCBpdGVtcyA9IGRhdGEuZGF0YS5pdGVtcztcbiAgICBpZiAoIWl0ZW1zW2ZpZWxkXSkge1xuICAgICAgaXRlbXNbZmllbGRdID0gaXRlbXMuZmlsdGVyKGkgPT4gaS50eXBlID09PSB0eXBlKTsgLy8uc29ydChzb3J0RnVuY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIF9maWx0ZXJJdGVtRGF0YShkYXRhLCBpdGVtRmllbGQsIGZpbHRlckZpZWxkLCBmaWx0ZXJWYWx1ZSkge1xuICAgIGNvbnN0IGl0ZW1zID0gZGF0YS5kYXRhLml0ZW1zO1xuICAgIGl0ZW1zW2l0ZW1GaWVsZF0gPSBpdGVtc1tpdGVtRmllbGRdLmZpbHRlcihpdG0gPT4gaXRtLmRhdGFbZmlsdGVyRmllbGRdID09PSBmaWx0ZXJWYWx1ZSk7XG4gIH1cblxuICAvKiogQG92ZXJyaWRlICovXG4gIGdldERhdGEoKSB7XG4gICAgY29uc3QgZGF0YSA9IHN1cGVyLmdldERhdGEoKTtcbiAgICBcbiAgICBkYXRhLmlzR00gPSBnYW1lLnVzZXIuaXNHTTtcblxuICAgIGRhdGEucmFuZ2VzID0gQ1NSLnJhbmdlcztcbiAgICBkYXRhLnN0YXRzID0gQ1NSLnN0YXRzO1xuICAgIGRhdGEud2VhcG9uVHlwZXMgPSBDU1Iud2VhcG9uVHlwZXM7XG4gICAgZGF0YS53ZWlnaHRzID0gQ1NSLndlaWdodENsYXNzZXM7XG5cbiAgICBkYXRhLmFkdmFuY2VzID0gT2JqZWN0LmVudHJpZXMoZGF0YS5hY3Rvci5kYXRhLmFkdmFuY2VzKS5tYXAoXG4gICAgICAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgIGxhYmVsOiBDU1IuYWR2YW5jZXNba2V5XSxcbiAgICAgICAgICBpc0NoZWNrZWQ6IHZhbHVlLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG5cbiAgICBkYXRhLmRhbWFnZVRyYWNrRGF0YSA9IENTUi5kYW1hZ2VUcmFjaztcbiAgICBkYXRhLmRhbWFnZVRyYWNrRGVzY3JpcHRpb24gPSBDU1IuZGFtYWdlVHJhY2tbZGF0YS5kYXRhLmRhbWFnZVRyYWNrXS5kZXNjcmlwdGlvbjtcblxuICAgIGRhdGEucmVjb3Zlcmllc0RhdGEgPSBPYmplY3QuZW50cmllcyhcbiAgICAgIGRhdGEuYWN0b3IuZGF0YS5yZWNvdmVyaWVzXG4gICAgKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5LFxuICAgICAgICBsYWJlbDogQ1NSLnJlY292ZXJpZXNba2V5XSxcbiAgICAgICAgY2hlY2tlZDogdmFsdWUsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgZGF0YS50cmFpbmluZ0xldmVscyA9IENTUi50cmFpbmluZ0xldmVscztcblxuICAgIGRhdGEuZGF0YS5pdGVtcyA9IGRhdGEuYWN0b3IuaXRlbXMgfHwge307XG5cbiAgICB0aGlzLl9nZW5lcmF0ZUl0ZW1EYXRhKGRhdGEsICdza2lsbCcsICdza2lsbHMnKTtcblxuICAgIGRhdGEuc2tpbGxzUG9vbEZpbHRlciA9IHRoaXMuc2tpbGxzUG9vbEZpbHRlcjtcbiAgICBkYXRhLnNraWxsc1RyYWluaW5nRmlsdGVyID0gdGhpcy5za2lsbHNUcmFpbmluZ0ZpbHRlcjtcblxuICAgIGlmIChkYXRhLnNraWxsc1Bvb2xGaWx0ZXIgPiAtMSkge1xuICAgICAgdGhpcy5fZmlsdGVySXRlbURhdGEoZGF0YSwgJ3NraWxscycsICdwb29sJywgcGFyc2VJbnQoZGF0YS5za2lsbHNQb29sRmlsdGVyLCAxMCkpO1xuICAgIH1cbiAgICBpZiAoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciA+IC0xKSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtRGF0YShkYXRhLCAnc2tpbGxzJywgJ3RyYWluaW5nJywgcGFyc2VJbnQoZGF0YS5za2lsbHNUcmFpbmluZ0ZpbHRlciwgMTApKTtcbiAgICB9XG5cbiAgICBkYXRhLnNlbGVjdGVkU2tpbGwgPSB0aGlzLnNlbGVjdGVkU2tpbGw7XG4gICAgZGF0YS5za2lsbEluZm8gPSBkYXRhLnNlbGVjdGVkU2tpbGwgPyB0aGlzLnNlbGVjdGVkU2tpbGwuaW5mbyA6ICcnO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfY3JlYXRlSXRlbShpdGVtTmFtZSkge1xuICAgIGNvbnN0IGl0ZW1EYXRhID0ge1xuICAgICAgbmFtZTogYE5ldyAke2l0ZW1OYW1lLmNhcGl0YWxpemUoKX1gLFxuICAgICAgdHlwZTogaXRlbU5hbWUsXG4gICAgICBkYXRhOiBuZXcgQ3lwaGVyU3lzdGVtSXRlbSh7fSksXG4gICAgfTtcblxuICAgIHRoaXMuYWN0b3IuY3JlYXRlT3duZWRJdGVtKGl0ZW1EYXRhLCB7IHJlbmRlclNoZWV0OiB0cnVlIH0pO1xuICB9XG5cbiAgX3JvbGxQb29sRGlhbG9nKHBvb2wpIHtcbiAgICBjb25zdCB7IGFjdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcbiAgICBjb25zdCBwb29sTmFtZSA9IEVudW1Qb29sc1twb29sXTtcblxuICAgIEN5cGhlclJvbGxzLlJvbGwoe1xuICAgICAgZXZlbnQsXG4gICAgICBwYXJ0czogWycxZDIwJ10sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHBvb2wsXG4gICAgICAgIG1heEVmZm9ydDogYWN0b3JEYXRhLmVmZm9ydCxcbiAgICAgIH0sXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICBmbGF2b3I6IGAke2FjdG9yLm5hbWV9IHVzZWQgJHtwb29sTmFtZX1gLFxuICAgICAgdGl0bGU6ICdVc2UgUG9vbCcsXG4gICAgICBhY3RvclxuICAgIH0pO1xuICB9XG5cbiAgX2RlbGV0ZUl0ZW1EaWFsb2coaXRlbUlkLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvbkRpYWxvZyA9IG5ldyBEaWFsb2coe1xuICAgICAgdGl0bGU6IGdhbWUuaTE4bi5sb2NhbGl6ZShcIkNTUi5kaWFsb2cuZGVsZXRlVGl0bGVcIiksXG4gICAgICBjb250ZW50OiBgPHA+JHtnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmRlbGV0ZUNvbnRlbnRcIil9PC9wPjxociAvPmAsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIGNvbmZpcm06IHtcbiAgICAgICAgICBpY29uOiAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+JyxcbiAgICAgICAgICBsYWJlbDogZ2FtZS5pMThuLmxvY2FsaXplKFwiQ1NSLmRpYWxvZy5kZWxldGVCdXR0b25cIiksXG4gICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWN0b3IuZGVsZXRlT3duZWRJdGVtKGl0ZW1JZCk7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICBjYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNhbmNlbDoge1xuICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgIGxhYmVsOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJDU1IuZGlhbG9nLmNhbmNlbEJ1dHRvblwiKSxcbiAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiBcImNhbmNlbFwiXG4gICAgfSk7XG4gICAgY29uZmlybWF0aW9uRGlhbG9nLnJlbmRlcih0cnVlKTtcbiAgfVxuXG4gIF9zdGF0c1RhYkxpc3RlbmVycyhodG1sKSB7XG4gICAgLy8gU3RhdHMgU2V0dXBcbiAgICBodG1sLmZpbmQoJy5yb2xsLXBvb2wnKS5jbGljayhldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGxldCBlbCA9IGV2dC50YXJnZXQ7XG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQucG9vbCkge1xuICAgICAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCB7IHBvb2wgfSA9IGVsLmRhdGFzZXQ7XG5cbiAgICAgIHRoaXMuX3JvbGxQb29sRGlhbG9nKHBhcnNlSW50KHBvb2wsIDEwKSk7XG4gICAgfSk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwiZGF0YS5kYW1hZ2VUcmFja1wiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICB9XG5cbiAgX3NraWxsc1RhYkxpc3RlbmVycyhodG1sKSB7XG4gICAgLy8gU2tpbGxzIFNldHVwXG4gICAgaHRtbC5maW5kKCcuYWRkLXNraWxsJykuY2xpY2soZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9jcmVhdGVJdGVtKCdza2lsbCcpO1xuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IHNraWxsc1Bvb2xGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2tpbGxzUG9vbEZpbHRlclwiXScpLnNlbGVjdDIoe1xuICAgICAgdGhlbWU6ICdudW1lbmVyYScsXG4gICAgICB3aWR0aDogJzEzMHB4JyxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgIH0pO1xuICAgIHNraWxsc1Bvb2xGaWx0ZXIub24oJ2NoYW5nZScsIGV2dCA9PiB7XG4gICAgICB0aGlzLnNraWxsc1Bvb2xGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2tpbGxzVHJhaW5pbmdGaWx0ZXJcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzBweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgICBza2lsbHNUcmFpbmluZ0ZpbHRlci5vbignY2hhbmdlJywgZXZ0ID0+IHtcbiAgICAgIHRoaXMuc2tpbGxzVHJhaW5pbmdGaWx0ZXIgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc2tpbGxzID0gaHRtbC5maW5kKCdhLnNraWxsJyk7XG5cbiAgICBza2lsbHMub24oJ2NsaWNrJywgZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB0aGlzLl9vblN1Ym1pdChldnQpO1xuXG4gICAgICBsZXQgZWwgPSBldnQudGFyZ2V0O1xuICAgICAgLy8gQWNjb3VudCBmb3IgY2xpY2tpbmcgYSBjaGlsZCBlbGVtZW50XG4gICAgICB3aGlsZSAoIWVsLmRhdGFzZXQuaWQpIHtcbiAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgICAgY29uc3Qgc2tpbGxJZCA9IGVsLmRhdGFzZXQuaWQ7XG5cbiAgICAgIGNvbnN0IGFjdG9yID0gdGhpcy5hY3RvcjtcbiAgICAgIGNvbnN0IHNraWxsID0gYWN0b3IuZ2V0T3duZWRJdGVtKHNraWxsSWQpO1xuXG4gICAgICB0aGlzLnNlbGVjdGVkU2tpbGwgPSBza2lsbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHsgc2VsZWN0ZWRTa2lsbCB9ID0gdGhpcztcbiAgICBpZiAoc2VsZWN0ZWRTa2lsbCkge1xuICAgICAgaHRtbC5maW5kKCcuc2tpbGwtaW5mbyAuYWN0aW9ucyAucm9sbCcpLmNsaWNrKGV2dCA9PiB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHNlbGVjdGVkU2tpbGwucm9sbCgpO1xuICAgICAgICAvLyB0aGlzLl9yb2xsSXRlbURpYWxvZyhzZWxlY3RlZFNraWxsLmRhdGEuZGF0YS5wb29sKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5lZGl0JykuY2xpY2soZXZ0ID0+IHtcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNraWxsLnNoZWV0LnJlbmRlcih0cnVlKTtcbiAgICAgIH0pO1xuXG4gICAgICBodG1sLmZpbmQoJy5za2lsbC1pbmZvIC5hY3Rpb25zIC5kZWxldGUnKS5jbGljayhldnQgPT4ge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9kZWxldGVJdGVtRGlhbG9nKHRoaXMuc2VsZWN0ZWRTa2lsbC5faWQsIGRpZERlbGV0ZSA9PiB7XG4gICAgICAgICAgaWYgKGRpZERlbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNraWxsID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEhhY2ssIGZvciBzb21lIHJlYXNvbiB0aGUgaW5uZXIgdGFiJ3MgY29udGVudCBkb2Vzbid0IHNob3cgXG4gICAgLy8gd2hlbiBjaGFuZ2luZyBwcmltYXJ5IHRhYnMgd2l0aGluIHRoZSBzaGVldFxuICAgIGh0bWwuZmluZCgnLml0ZW1bZGF0YS10YWI9XCJzdGF0c1wiXScpLmNsaWNrKCgpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkU3ViVGFiID0gaHRtbC5maW5kKCcuc3RhdHMtdGFicyAuaXRlbS5hY3RpdmUnKS5maXJzdCgpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRTdWJQYWdlID0gaHRtbC5maW5kKGAuc3RhdHMtYm9keSAudGFiW2RhdGEtdGFiPVwiJHtzZWxlY3RlZFN1YlRhYi5kYXRhKCd0YWInKX1cIl1gKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNlbGVjdGVkU3ViUGFnZS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3N0YXRzVGFiTGlzdGVuZXJzKGh0bWwpO1xuICAgIHRoaXMuX3NraWxsc1RhYkxpc3RlbmVycyhodG1sKTtcbiAgfVxufVxuIiwiLyogZ2xvYmFsIEFjdG9yOmZhbHNlICovXG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi4vZW51bXMvZW51bS1wb29sLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2UgQWN0b3IgZW50aXR5IGJ5IGRlZmluaW5nIGEgY3VzdG9tIHJvbGwgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggaXMgaWRlYWwgZm9yIHRoZSBTaW1wbGUgc3lzdGVtLlxuICogQGV4dGVuZHMge0FjdG9yfVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtQWN0b3IgZXh0ZW5kcyBBY3RvciB7XG4gIC8qKlxuICAgKiBQcmVwYXJlIENoYXJhY3RlciB0eXBlIHNwZWNpZmljIGRhdGFcbiAgICovXG4gIF9wcmVwYXJlUENEYXRhKGFjdG9yRGF0YSkge1xuICAgIGNvbnN0IGRhdGEgPSBhY3RvckRhdGEuZGF0YTtcblxuICAgIC8vIE1ha2UgbW9kaWZpY2F0aW9ucyB0byBkYXRhIGhlcmUuIEZvciBleGFtcGxlOlxuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFiaWxpdHkgc2NvcmVzLCBhbmQgYWRkIHRoZWlyIG1vZGlmaWVycyB0byBvdXIgc2hlZXQgb3V0cHV0LlxuICAgIC8vIGZvciAobGV0IFtrZXksIGFiaWxpdHldIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEuYWJpbGl0aWVzKSkge1xuICAgIC8vICAgLy8gQ2FsY3VsYXRlIHRoZSBtb2RpZmllciB1c2luZyBkMjAgcnVsZXMuXG4gICAgLy8gICBhYmlsaXR5Lm1vZCA9IE1hdGguZmxvb3IoKGFiaWxpdHkudmFsdWUgLSAxMCkgLyAyKTtcbiAgICAvLyB9XG4gIH1cblxuICAvKipcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgYWN0b3IgZGF0YSB3aXRoIGFkZGl0aW9uYWwgZHluYW1pYyBkYXRhLlxuICAgKi9cbiAgcHJlcGFyZURhdGEoKSB7XG4gICAgc3VwZXIucHJlcGFyZURhdGEoKTtcblxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YTtcbiAgICBjb25zdCBkYXRhID0gYWN0b3JEYXRhLmRhdGE7XG4gICAgY29uc3QgZmxhZ3MgPSBhY3RvckRhdGEuZmxhZ3M7XG5cbiAgICAvLyBNYWtlIHNlcGFyYXRlIG1ldGhvZHMgZm9yIGVhY2ggQWN0b3IgdHlwZSAoY2hhcmFjdGVyLCBucGMsIGV0Yy4pIHRvIGtlZXBcbiAgICAvLyB0aGluZ3Mgb3JnYW5pemVkLlxuICAgIGlmIChhY3RvckRhdGEudHlwZSA9PT0gJ3BjJykge1xuICAgICAgdGhpcy5fcHJlcGFyZVBDRGF0YShhY3RvckRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGdldFNraWxsTGV2ZWwoc2tpbGwpIHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHNraWxsLmRhdGE7XG5cbiAgICByZXR1cm4gZGF0YS50cmFpbmluZyAtIDE7XG4gIH1cblxuICBnZXRFZmZvcnRDb3N0RnJvbVN0YXQocG9vbCwgZWZmb3J0TGV2ZWwpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHtcbiAgICAgIGNvc3Q6IDAsXG4gICAgICBlZmZvcnRMZXZlbDogMCxcbiAgICAgIHdhcm5pbmc6IG51bGwsXG4gICAgfTtcblxuICAgIGlmIChlZmZvcnRMZXZlbCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdG9yRGF0YSA9IHRoaXMuZGF0YS5kYXRhO1xuICAgIGNvbnN0IHBvb2xOYW1lID0gRW51bVBvb2xzW3Bvb2xdO1xuICAgIGNvbnN0IHN0YXQgPSBhY3RvckRhdGEuc3RhdHNbcG9vbE5hbWUudG9Mb3dlckNhc2UoKV07XG5cbiAgICAvL1RoZSBmaXJzdCBlZmZvcnQgbGV2ZWwgY29zdHMgMyBwdHMgZnJvbSB0aGUgcG9vbCwgZXh0cmEgbGV2ZWxzIGNvc3QgMlxuICAgIC8vU3Vic3RyYWN0IHRoZSByZWxhdGVkIEVkZ2UsIHRvb1xuICAgIGNvbnN0IGF2YWlsYWJsZUVmZm9ydEZyb21Qb29sID0gKHN0YXQudmFsdWUgKyBzdGF0LmVkZ2UgLSAxKSAvIDI7XG5cbiAgICAvL0EgUEMgY2FuIHVzZSBhcyBtdWNoIGFzIHRoZWlyIEVmZm9ydCBzY29yZSwgYnV0IG5vdCBtb3JlXG4gICAgLy9UaGV5J3JlIGFsc28gbGltaXRlZCBieSB0aGVpciBjdXJyZW50IHBvb2wgdmFsdWVcbiAgICBjb25zdCBmaW5hbEVmZm9ydCA9IE1hdGgubWluKGVmZm9ydExldmVsLCBhY3RvckRhdGEuZWZmb3J0LCBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCk7XG4gICAgY29uc3QgY29zdCA9IDEgKyAyICogZmluYWxFZmZvcnQgLSBzdGF0LmVkZ2U7XG5cbiAgICAvL1RPRE8gdGFrZSBmcmVlIGxldmVscyBvZiBFZmZvcnQgaW50byBhY2NvdW50IGhlcmVcblxuICAgIGxldCB3YXJuaW5nID0gbnVsbDtcbiAgICBpZiAoZWZmb3J0TGV2ZWwgPiBhdmFpbGFibGVFZmZvcnRGcm9tUG9vbCkge1xuICAgICAgd2FybmluZyA9IGBOb3QgZW5vdWdoIHBvaW50cyBpbiB5b3VyICR7cG9vbE5hbWV9IHBvb2wgZm9yIHRoYXQgbGV2ZWwgb2YgRWZmb3J0YDtcbiAgICB9XG5cbiAgICB2YWx1ZS5jb3N0ID0gY29zdDtcbiAgICB2YWx1ZS5lZmZvcnRMZXZlbCA9IGZpbmFsRWZmb3J0O1xuICAgIHZhbHVlLndhcm5pbmcgPSB3YXJuaW5nO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQsIGFwcGx5RWRnZT10cnVlKSB7XG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF0udG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBzdGF0ID0gYWN0b3JEYXRhLnN0YXRzW3Bvb2xOYW1lXTtcbiAgICBjb25zdCBwb29sQW1vdW50ID0gc3RhdC52YWx1ZTtcblxuICAgIHJldHVybiAoYXBwbHlFZGdlID8gYW1vdW50IC0gc3RhdC5lZGdlIDogYW1vdW50KSA8PSBwb29sQW1vdW50O1xuICB9XG5cbiAgc3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpIHtcbiAgICBpZiAoIXRoaXMuY2FuU3BlbmRGcm9tUG9vbChwb29sLCBhbW91bnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgYWN0b3JEYXRhID0gdGhpcy5kYXRhLmRhdGE7XG4gICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgY29uc3Qgc3RhdCA9IGFjdG9yRGF0YS5zdGF0c1twb29sTmFtZS50b0xvd2VyQ2FzZSgpXTtcblxuICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICBkYXRhW2BkYXRhLnN0YXRzLiR7cG9vbE5hbWUudG9Mb3dlckNhc2UoKX0udmFsdWVgXSA9IE1hdGgubWF4KDAsIHN0YXQudmFsdWUgLSBhbW91bnQpO1xuICAgIHRoaXMudXBkYXRlKGRhdGEpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxufVxuIiwiZXhwb3J0IGNvbnN0IENTUiA9IHt9O1xuXG5DU1IuaXRlbVR5cGVzID0gW1xuICAnc2tpbGxzJyxcbiAgJ2FiaWxpdGllcycsXG4gICdjeXBoZXJzJyxcbiAgJ2FydGlmYWN0cycsXG4gICdvZGRpdGllcycsXG4gICd3ZWFwb25zJyxcbiAgJ2FybW9yJyxcbiAgJ2dlYXInXG5dO1xuXG5DU1Iud2VpZ2h0Q2xhc3NlcyA9IFtcbiAgJ0xpZ2h0JyxcbiAgJ01lZGl1bScsXG4gICdIZWF2eSdcbl07XG5cbkNTUi53ZWFwb25UeXBlcyA9IFtcbiAgJ0Jhc2hpbmcnLFxuICAnQmxhZGVkJyxcbiAgJ1JhbmdlZCcsXG5dXG5cbkNTUi5zdGF0cyA9IFtcbiAgJ01pZ2h0JyxcbiAgJ1NwZWVkJyxcbiAgJ0ludGVsbGVjdCcsXG5dO1xuXG5DU1IudHJhaW5pbmdMZXZlbHMgPSBbXG4gICdJbmFiaWxpdHknLFxuICAnVW50cmFpbmVkJyxcbiAgJ1RyYWluZWQnLFxuICAnU3BlY2lhbGl6ZWQnXG5dO1xuXG5DU1IuZGFtYWdlVHJhY2sgPSBbXG4gIHtcbiAgICBsYWJlbDogJ0hhbGUnLFxuICAgIGRlc2NyaXB0aW9uOiAnTm9ybWFsIHN0YXRlIGZvciBhIGNoYXJhY3Rlci4nXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogJ0ltcGFpcmVkJyxcbiAgICBkZXNjcmlwdGlvbjogJ0luIGEgd291bmRlZCBvciBpbmp1cmVkIHN0YXRlLiBBcHBseWluZyBFZmZvcnQgY29zdHMgMSBleHRyYSBwb2ludCBwZXIgZWZmb3J0IGxldmVsIGFwcGxpZWQuJ1xuICB9LFxuICB7XG4gICAgbGFiZWw6ICdEZWJpbGl0YXRlZCcsXG4gICAgZGVzY3JpcHRpb246ICdJbiBhIGNyaXRpY2FsbHkgaW5qdXJlZCBzdGF0ZS4gVGhlIGNoYXJhY3RlciBjYW4gZG8gbm8gb3RoZXIgYWN0aW9uIHRoYW4gdG8gY3Jhd2wgYW4gaW1tZWRpYXRlIGRpc3RhbmNlOyBpZiB0aGVpciBTcGVlZCBwb29sIGlzIDAsIHRoZXkgY2Fubm90IG1vdmUgYXQgYWxsLidcbiAgfSxcbiAge1xuICAgIGxhYmVsOiAnRGVhZCcsXG4gICAgZGVzY3JpcHRpb246ICdUaGUgY2hhcmFjdGVyIGlzIGRlYWQuJ1xuICB9XG5dO1xuXG5DU1IucmVjb3ZlcmllcyA9IHtcbiAgJ2FjdGlvbic6ICcxIEFjdGlvbicsXG4gICd0ZW5NaW5zJzogJzEwIG1pbnMnLFxuICAnb25lSG91cic6ICcxIGhvdXInLFxuICAndGVuSG91cnMnOiAnMTAgaG91cnMnXG59O1xuXG5DU1IuYWR2YW5jZXMgPSB7XG4gICdzdGF0cyc6ICcrNCB0byBzdGF0IHBvb2xzJyxcbiAgJ2VkZ2UnOiAnKzEgdG8gRWRnZScsXG4gICdlZmZvcnQnOiAnKzEgdG8gRWZmb3J0JyxcbiAgJ3NraWxscyc6ICdUcmFpbi9zcGVjaWFsaXplIHNraWxsJyxcbiAgJ290aGVyJzogJ090aGVyJyxcbn07XG5cbkNTUi5yYW5nZXMgPSBbXG4gICdJbW1lZGlhdGUnLFxuICAnU2hvcnQnLFxuICAnTG9uZycsXG4gICdWZXJ5IExvbmcnXG5dO1xuXG5DU1Iub3B0aW9uYWxSYW5nZXMgPSBbXCJOL0FcIl0uY29uY2F0KENTUi5yYW5nZXMpO1xuXG5DU1IuYWJpbGl0eVR5cGVzID0gW1xuICAnQWN0aW9uJyxcbiAgJ0VuYWJsZXInLFxuXTtcblxuQ1NSLnN1cHBvcnRzTWFjcm9zID0gW1xuICAnc2tpbGwnLFxuICAnYWJpbGl0eSdcbl07XG4iLCIvLyBJbXBvcnQgTW9kdWxlc1xuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtQWN0b3IgfSBmcm9tIFwiLi9hY3Rvci9hY3Rvci5qc1wiO1xuaW1wb3J0IHsgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCB9IGZyb20gXCIuL2FjdG9yL2FjdG9yLXNoZWV0LmpzXCI7XG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1JdGVtIH0gZnJvbSBcIi4vaXRlbS9pdGVtLmpzXCI7XG5pbXBvcnQgeyBDeXBoZXJTeXN0ZW1JdGVtU2hlZXQgfSBmcm9tIFwiLi9pdGVtL2l0ZW0tc2hlZXQuanNcIjtcblxuaW1wb3J0IHsgcmVnaXN0ZXJIYW5kbGViYXJIZWxwZXJzIH0gZnJvbSAnLi9oYW5kbGViYXJzLWhlbHBlcnMuanMnO1xuaW1wb3J0IHsgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMgfSBmcm9tICcuL3RlbXBsYXRlLmpzJztcblxuSG9va3Mub25jZSgnaW5pdCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuXG4gIGdhbWUuY3lwaGVyc3lzdGVtQ2xlYW4gPSB7XG4gICAgQ3lwaGVyU3lzdGVtQWN0b3IsXG4gICAgQ3lwaGVyU3lzdGVtSXRlbVxuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgYW4gaW5pdGlhdGl2ZSBmb3JtdWxhIGZvciB0aGUgc3lzdGVtXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBDT05GSUcuQ29tYmF0LmluaXRpYXRpdmUgPSB7XG4gICAgZm9ybXVsYTogXCIxZDIwXCIsXG4gICAgZGVjaW1hbHM6IDJcbiAgfTtcblxuICAvLyBEZWZpbmUgY3VzdG9tIEVudGl0eSBjbGFzc2VzXG4gIENPTkZJRy5BY3Rvci5lbnRpdHlDbGFzcyA9IEN5cGhlclN5c3RlbUFjdG9yO1xuICBDT05GSUcuSXRlbS5lbnRpdHlDbGFzcyA9IEN5cGhlclN5c3RlbUl0ZW07XG5cbiAgLy8gUmVnaXN0ZXIgc2hlZXQgYXBwbGljYXRpb24gY2xhc3Nlc1xuICBBY3RvcnMudW5yZWdpc3RlclNoZWV0KFwiY29yZVwiLCBBY3RvclNoZWV0KTtcbiAgQWN0b3JzLnJlZ2lzdGVyU2hlZXQoJ2N5cGhlcnN5c3RlbUNsZWFuJywgQ3lwaGVyU3lzdGVtQWN0b3JTaGVldCwge1xuICAgIHR5cGVzOiBbJ3BjJ10sXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXG4gIH0pO1xuICBBY3RvcnMucmVnaXN0ZXJTaGVldCgnY3lwaGVyc3lzdGVtQ2xlYW4nLCBDeXBoZXJTeXN0ZW1BY3RvclNoZWV0LCB7XG4gICAgdHlwZXM6IFsnbnBjJ10sXG4gICAgbWFrZURlZmF1bHQ6IHRydWUsXG4gIH0pO1xuXG4gIEl0ZW1zLnVucmVnaXN0ZXJTaGVldChcImNvcmVcIiwgSXRlbVNoZWV0KTtcbiAgSXRlbXMucmVnaXN0ZXJTaGVldChcImN5cGhlcnN5c3RlbUNsZWFuXCIsIEN5cGhlclN5c3RlbUl0ZW1TaGVldCwgeyBtYWtlRGVmYXVsdDogdHJ1ZSB9KTtcblxuICByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMoKTtcbiAgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMoKTtcbn0pO1xuIiwiLyogZ2xvYmFscyBEaWFsb2cgKi9cblxuZXhwb3J0IGNsYXNzIFJvbGxEaWFsb2cgZXh0ZW5kcyBEaWFsb2cge1xuICBjb25zdHJ1Y3RvcihkaWFsb2dEYXRhLCBvcHRpb25zKSB7XG4gICAgc3VwZXIoZGlhbG9nRGF0YSwgb3B0aW9ucyk7XG4gIH1cblxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XG4gICAgc3VwZXIuYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCk7XG5cbiAgICBodG1sLmZpbmQoJ3NlbGVjdFtuYW1lPVwicm9sbE1vZGVcIl0nKS5zZWxlY3QyKHtcbiAgICAgIHRoZW1lOiAnbnVtZW5lcmEnLFxuICAgICAgd2lkdGg6ICcxMzVweCcsXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogSW5maW5pdHlcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IEVudW1Qb29sID0gW1xuICBcIk1pZ2h0XCIsXG4gIFwiU3BlZWRcIixcbiAgXCJJbnRlbGxlY3RcIlxuXTtcblxuZXhwb3J0IGRlZmF1bHQgRW51bVBvb2w7XG4iLCJjb25zdCBFbnVtVHJhaW5pbmcgPSBbXG4gIFwiSW5hYmlsaXR5XCIsXG4gIFwiVW50cmFpbmVkXCIsXG4gIFwiVHJhaW5lZFwiLFxuICBcIlNwZWNpYWxpemVkXCJcbl07XG5cbmV4cG9ydCBkZWZhdWx0IEVudW1UcmFpbmluZztcbiIsImV4cG9ydCBjb25zdCByZWdpc3RlckhhbmRsZWJhckhlbHBlcnMgPSAoKSA9PiB7XG4gIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RvTG93ZXJDYXNlJywgc3RyID0+IHN0ci50b0xvd2VyQ2FzZSgpKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndG9VcHBlckNhc2UnLCB0ZXh0ID0+IHRleHQudG9VcHBlckNhc2UoKSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZXEnLCAodjEsIHYyKSA9PiB2MSA9PT0gdjIpO1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCduZXEnLCAodjEsIHYyKSA9PiB2MSAhPT0gdjIpO1xuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdvcicsICh2MSwgdjIpID0+IHYxIHx8IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndGVybmFyeScsIChjb25kLCB2MSwgdjIpID0+IGNvbmQgPyB2MSA6IHYyKTtcbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignY29uY2F0JywgKHYxLCB2MikgPT4gYCR7djF9JHt2Mn1gKTtcblxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdzdHJPclNwYWNlJywgdmFsID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiAodmFsICYmICEhdmFsLmxlbmd0aCkgPyB2YWwgOiAnJm5ic3A7JztcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9KTtcblxuICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCd0cmFpbmluZ0ljb24nLCB2YWwgPT4ge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRyYWluaW5nLmluYWJpbGl0eScpfVwiPltJXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy51bnRyYWluZWQnKX1cIj5bVV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IudHJhaW5pbmcudHJhaW5lZCcpfVwiPltUXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAzOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50cmFpbmluZy5zcGVjaWFsaXplZCcpfVwiPltTXTwvc3Bhbj5gO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG5cbiAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigncG9vbEljb24nLCB2YWwgPT4ge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBgPHNwYW4gdGl0bGU9XCIke2dhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnBvb2wubWlnaHQnKX1cIj5bTV08L3NwYW4+YDtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGA8c3BhbiB0aXRsZT1cIiR7Z2FtZS5pMThuLmxvY2FsaXplKCdDU1IucG9vbC5zcGVlZCcpfVwiPltTXTwvc3Bhbj5gO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gYDxzcGFuIHRpdGxlPVwiJHtnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi5wb29sLmludGVsbGVjdCcpfVwiPltJXTwvc3Bhbj5gO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbiAgfSk7XG59O1xuIiwiLyogZ2xvYmFscyBtZXJnZU9iamVjdCAqL1xuXG4vKipcbiAqIEV4dGVuZCB0aGUgYmFzaWMgSXRlbVNoZWV0IHdpdGggc29tZSB2ZXJ5IHNpbXBsZSBtb2RpZmljYXRpb25zXG4gKiBAZXh0ZW5kcyB7SXRlbVNoZWV0fVxuICovXG5leHBvcnQgY2xhc3MgQ3lwaGVyU3lzdGVtSXRlbVNoZWV0IGV4dGVuZHMgSXRlbVNoZWV0IHtcblxuICAvKiogQG92ZXJyaWRlICovXG4gIHN0YXRpYyBnZXQgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XG4gICAgICBjbGFzc2VzOiBbXCJjeXBoZXJzeXN0ZW1cIiwgXCJzaGVldFwiLCBcIml0ZW1cIl0sXG4gICAgICB3aWR0aDogNTIwLFxuICAgICAgaGVpZ2h0OiA0ODAsXG4gICAgICB0YWJzOiBbeyBcbiAgICAgICAgbmF2U2VsZWN0b3I6IFwiLnNoZWV0LXRhYnNcIiwgXG4gICAgICAgIGNvbnRlbnRTZWxlY3RvcjogXCIuc2hlZXQtYm9keVwiLCBcbiAgICAgICAgaW5pdGlhbDogXCJkZXNjcmlwdGlvblwiIFxuICAgICAgfV1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IHBhdGggPSBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2l0ZW1cIjtcbiAgICAvLyBSZXR1cm4gYSBzaW5nbGUgc2hlZXQgZm9yIGFsbCBpdGVtIHR5cGVzLlxuICAgIHJldHVybiBgJHtwYXRofS9pdGVtLXNoZWV0Lmh0bWxgO1xuICAgIC8vIEFsdGVybmF0aXZlbHksIHlvdSBjb3VsZCB1c2UgdGhlIGZvbGxvd2luZyByZXR1cm4gc3RhdGVtZW50IHRvIGRvIGFcbiAgICAvLyB1bmlxdWUgaXRlbSBzaGVldCBieSB0eXBlLCBsaWtlIGB3ZWFwb24tc2hlZXQuaHRtbGAuXG5cbiAgICAvLyByZXR1cm4gYCR7cGF0aH0vJHt0aGlzLml0ZW0uZGF0YS50eXBlfS1zaGVldC5odG1sYDtcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgLyoqIEBvdmVycmlkZSAqL1xuICBnZXREYXRhKCkge1xuICAgIGNvbnN0IGRhdGEgPSBzdXBlci5nZXREYXRhKCk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgc2V0UG9zaXRpb24ob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgcG9zaXRpb24gPSBzdXBlci5zZXRQb3NpdGlvbihvcHRpb25zKTtcbiAgICBjb25zdCBzaGVldEJvZHkgPSB0aGlzLmVsZW1lbnQuZmluZChcIi5zaGVldC1ib2R5XCIpO1xuICAgIGNvbnN0IGJvZHlIZWlnaHQgPSBwb3NpdGlvbi5oZWlnaHQgLSAxOTI7XG4gICAgc2hlZXRCb2R5LmNzcyhcImhlaWdodFwiLCBib2R5SGVpZ2h0KTtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gIC8qKiBAb3ZlcnJpZGUgKi9cbiAgYWN0aXZhdGVMaXN0ZW5lcnMoaHRtbCkge1xuICAgIHN1cGVyLmFjdGl2YXRlTGlzdGVuZXJzKGh0bWwpO1xuXG4gICAgLy8gRXZlcnl0aGluZyBiZWxvdyBoZXJlIGlzIG9ubHkgbmVlZGVkIGlmIHRoZSBzaGVldCBpcyBlZGl0YWJsZVxuICAgIGlmICghdGhpcy5vcHRpb25zLmVkaXRhYmxlKSByZXR1cm47XG5cbiAgICAvLyBSb2xsIGhhbmRsZXJzLCBjbGljayBoYW5kbGVycywgZXRjLiB3b3VsZCBnbyBoZXJlLlxuICB9XG59XG4iLCIvKiBnbG9iYWxzIEl0ZW0gZ2FtZSAqL1xuXG5pbXBvcnQgeyBDeXBoZXJSb2xscyB9IGZyb20gJy4uL3JvbGxzLmpzJztcblxuaW1wb3J0IEVudW1Qb29scyBmcm9tICcuLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuaW1wb3J0IEVudW1UcmFpbmluZyBmcm9tICcuLi9lbnVtcy9lbnVtLXRyYWluaW5nLmpzJztcblxuLyoqXG4gKiBFeHRlbmQgdGhlIGJhc2ljIEl0ZW0gd2l0aCBzb21lIHZlcnkgc2ltcGxlIG1vZGlmaWNhdGlvbnMuXG4gKiBAZXh0ZW5kcyB7SXRlbX1cbiAqL1xuZXhwb3J0IGNsYXNzIEN5cGhlclN5c3RlbUl0ZW0gZXh0ZW5kcyBJdGVtIHtcbiAgX3ByZXBhcmVTa2lsbERhdGEoKSB7XG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmRhdGE7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBpdGVtRGF0YTtcblxuXG4gIH1cblxuICAvKipcbiAgICogQXVnbWVudCB0aGUgYmFzaWMgSXRlbSBkYXRhIG1vZGVsIHdpdGggYWRkaXRpb25hbCBkeW5hbWljIGRhdGEuXG4gICAqL1xuICBwcmVwYXJlRGF0YSgpIHtcbiAgICBzdXBlci5wcmVwYXJlRGF0YSgpO1xuXG4gICAgaWYgKHRoaXMudHlwZSA9PT0gJ3NraWxsJykge1xuICAgICAgdGhpcy5fcHJlcGFyZVNraWxsRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSb2xsXG4gICAqL1xuXG4gIF9za2lsbFJvbGwoKSB7XG4gICAgY29uc3QgYWN0b3IgPSB0aGlzLmFjdG9yO1xuICAgIGNvbnN0IGFjdG9yRGF0YSA9IGFjdG9yLmRhdGEuZGF0YTtcblxuICAgIGNvbnN0IHsgbmFtZSB9ID0gdGhpcztcbiAgICBjb25zdCBpdGVtID0gdGhpcy5kYXRhO1xuICAgIGNvbnN0IHsgcG9vbCwgfSA9IGl0ZW0uZGF0YTtcbiAgICBjb25zdCBhc3NldHMgPSBhY3Rvci5nZXRTa2lsbExldmVsKHRoaXMpO1xuICAgIFxuICAgIGNvbnN0IHBhcnRzID0gWycxZDIwJ107XG4gICAgaWYgKGFzc2V0cyAhPT0gMCkge1xuICAgICAgY29uc3Qgc2lnbiA9IGFzc2V0cyA8IDAgPyAnLScgOiAnKyc7XG4gICAgICBwYXJ0cy5wdXNoKGAke3NpZ259ICR7TWF0aC5hYnMoYXNzZXRzKSAqIDN9YCk7XG4gICAgfVxuXG4gICAgQ3lwaGVyUm9sbHMuUm9sbCh7XG4gICAgICBldmVudCxcbiAgICAgIHBhcnRzLFxuICAgICAgZGF0YToge1xuICAgICAgICBwb29sLFxuICAgICAgICBhYmlsaXR5Q29zdDogMCxcbiAgICAgICAgbWF4RWZmb3J0OiBhY3RvckRhdGEuZWZmb3J0LFxuICAgICAgICBhc3NldHNcbiAgICAgIH0sXG4gICAgICBzcGVha2VyOiBDaGF0TWVzc2FnZS5nZXRTcGVha2VyKHsgYWN0b3IgfSksXG4gICAgICBmbGF2b3I6IGAke2FjdG9yLm5hbWV9IHVzZWQgJHtuYW1lfWAsXG4gICAgICB0aXRsZTogJ1VzZSBTa2lsbCcsXG4gICAgICBhY3RvclxuICAgIH0pO1xuICB9XG5cbiAgcm9sbCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAnc2tpbGwnOlxuICAgICAgICB0aGlzLl9za2lsbFJvbGwoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5mb1xuICAgKi9cblxuICBfc2tpbGxJbmZvKCkge1xuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHRyYWluaW5nID0gRW51bVRyYWluaW5nW2RhdGEuZGF0YS50cmFpbmluZ107XG4gICAgY29uc3QgcG9vbCA9IEVudW1Qb29sc1tkYXRhLmRhdGEucG9vbF07XG5cbiAgICBjb25zdCBpMThuVHJhaW5pbmcgPSBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi50cmFpbmluZy4ke3RyYWluaW5nLnRvTG93ZXJDYXNlKCl9YCk7XG4gICAgY29uc3QgaTE4blBvb2wgPSBnYW1lLmkxOG4ubG9jYWxpemUoYENTUi5wb29sLiR7cG9vbC50b0xvd2VyQ2FzZSgpfWApO1xuXG4gICAgY29uc3QgaTE4blJvbGwgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50b29sdGlwLnJvbGwnKTtcbiAgICBjb25zdCBpMThuRWRpdCA9IGdhbWUuaTE4bi5sb2NhbGl6ZSgnQ1NSLnRvb2x0aXAuZWRpdCcpO1xuICAgIGNvbnN0IGkxOG5EZWxldGUgPSBnYW1lLmkxOG4ubG9jYWxpemUoJ0NTUi50b29sdGlwLmRlbGV0ZScpO1xuXG4gICAgcmV0dXJuIGBcbiAgICAgIDxoMj4ke2RhdGEubmFtZX08L2gyPlxuICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC0zY29sXCI+XG4gICAgICAgIDxzdHJvbmcgY2xhc3M9XCJ0ZXh0LWxlZnRcIj4ke2kxOG5UcmFpbmluZ308L3N0cm9uZz5cbiAgICAgICAgPHN0cm9uZyBjbGFzcz1cInRleHQtY2VudGVyXCI+JHtpMThuUG9vbH08L3N0cm9uZz5cbiAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQgZ3JpZC0zY29sIGFjdGlvbnNcIj5cbiAgICAgICAgICAgIDxhIGNsYXNzPVwicm9sbFwiIHRpdGxlPVwiJHtpMThuUm9sbH1cIj48aSBjbGFzcz1cImZhcyBmYS1kaWNlLWQyMFwiPjwvaT48L2E+XG4gICAgICAgICAgICA8YSBjbGFzcz1cImVkaXRcIiB0aXRsZT1cIiR7aTE4bkVkaXR9XCI+PGkgY2xhc3M9XCJmYXMgZmEtZWRpdFwiPjwvaT48L2E+XG4gICAgICAgICAgICA8YSBjbGFzcz1cImRlbGV0ZVwiIHRpdGxlPVwiJHtpMThuRGVsZXRlfVwiPjxpIGNsYXNzPVwiZmFzIGZhLXRyYXNoXCI+PC9pPjwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgPGhyPlxuICAgICAgPHA+JHtkYXRhLmRhdGEubm90ZXN9PC9wPlxuICAgIGA7XG4gIH1cblxuICBnZXQgaW5mbygpIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAnc2tpbGwnOlxuICAgICAgICByZXR1cm4gdGhpcy5fc2tpbGxJbmZvKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG4iLCIvKiBnbG9iYWxzIHJlbmRlclRlbXBsYXRlICovXG5cbmltcG9ydCB7IFJvbGxEaWFsb2cgfSBmcm9tICcuL2RpYWxvZy9yb2xsLWRpYWxvZy5qcyc7XG5cbmltcG9ydCBFbnVtUG9vbHMgZnJvbSAnLi9lbnVtcy9lbnVtLXBvb2wuanMnO1xuXG5leHBvcnQgY2xhc3MgQ3lwaGVyUm9sbHMge1xuICBzdGF0aWMgYXN5bmMgUm9sbCh7IHBhcnRzID0gW10sIGRhdGEgPSB7fSwgYWN0b3IgPSBudWxsLCBldmVudCA9IG51bGwsIHNwZWFrZXIgPSBudWxsLCBmbGF2b3IgPSBudWxsLCB0aXRsZSA9IG51bGwsIGl0ZW0gPSBmYWxzZSB9ID0ge30pIHtcbiAgICBsZXQgcm9sbE1vZGUgPSBnYW1lLnNldHRpbmdzLmdldCgnY29yZScsICdyb2xsTW9kZScpO1xuICAgIGxldCByb2xsZWQgPSBmYWxzZTtcbiAgICBsZXQgZmlsdGVyZWQgPSBwYXJ0cy5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG4gICAgICByZXR1cm4gZWwgIT0gJycgJiYgZWw7XG4gICAgfSk7XG5cbiAgICBsZXQgbWF4RWZmb3J0ID0gMTtcbiAgICBpZiAoZGF0YVsnbWF4RWZmb3J0J10pIHtcbiAgICAgIG1heEVmZm9ydCA9IHBhcnNlSW50KGRhdGFbJ21heEVmZm9ydCddLCAxMCkgfHwgMTtcbiAgICB9XG5cbiAgICBjb25zdCBfcm9sbCA9IChmb3JtID0gbnVsbCkgPT4ge1xuICAgICAgLy8gT3B0aW9uYWxseSBpbmNsdWRlIGVmZm9ydFxuICAgICAgaWYgKGZvcm0gIT09IG51bGwpIHtcbiAgICAgICAgZGF0YVsnZWZmb3J0J10gPSBwYXJzZUludChmb3JtLmVmZm9ydC52YWx1ZSwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGFbJ2VmZm9ydCddKSB7XG4gICAgICAgIGZpbHRlcmVkLnB1c2goYCske2RhdGFbJ2VmZm9ydCddICogM31gKTtcblxuICAgICAgICBmbGF2b3IgKz0gYCB3aXRoICR7ZGF0YVsnZWZmb3J0J119IEVmZm9ydGBcbiAgICAgIH1cblxuICAgICAgY29uc3Qgcm9sbCA9IG5ldyBSb2xsKGZpbHRlcmVkLmpvaW4oJycpLCBkYXRhKS5yb2xsKCk7XG4gICAgICAvLyBDb252ZXJ0IHRoZSByb2xsIHRvIGEgY2hhdCBtZXNzYWdlIGFuZCByZXR1cm4gdGhlIHJvbGxcbiAgICAgIHJvbGxNb2RlID0gZm9ybSA/IGZvcm0ucm9sbE1vZGUudmFsdWUgOiByb2xsTW9kZTtcbiAgICAgIHJvbGxlZCA9IHRydWU7XG4gICAgICBcbiAgICAgIHJldHVybiByb2xsO1xuICAgIH1cblxuICAgIGNvbnN0IHRlbXBsYXRlID0gJ3N5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2RpYWxvZy9yb2xsLWRpYWxvZy5odG1sJztcbiAgICBsZXQgZGlhbG9nRGF0YSA9IHtcbiAgICAgIGZvcm11bGE6IGZpbHRlcmVkLmpvaW4oJyAnKSxcbiAgICAgIG1heEVmZm9ydDogbWF4RWZmb3J0LFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHJvbGxNb2RlOiByb2xsTW9kZSxcbiAgICAgIHJvbGxNb2RlczogQ09ORklHLkRpY2Uucm9sbE1vZGVzXG4gICAgfTtcblxuICAgIGNvbnN0IGh0bWwgPSBhd2FpdCByZW5kZXJUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGlhbG9nRGF0YSk7XG4gICAgLy9DcmVhdGUgRGlhbG9nIHdpbmRvd1xuICAgIGxldCByb2xsO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIG5ldyBSb2xsRGlhbG9nKHtcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICBjb250ZW50OiBodG1sLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgb2s6IHtcbiAgICAgICAgICAgIGxhYmVsOiAnT0snLFxuICAgICAgICAgICAgaWNvbjogJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPicsXG4gICAgICAgICAgICBjYWxsYmFjazogKGh0bWwpID0+IHtcbiAgICAgICAgICAgICAgcm9sbCA9IF9yb2xsKGh0bWxbMF0uY2hpbGRyZW5bMF0pO1xuXG4gICAgICAgICAgICAgIC8vIFRPRE86IGNoZWNrIHJvbGwucmVzdWx0IGFnYWluc3QgdGFyZ2V0IG51bWJlclxuXG4gICAgICAgICAgICAgIGNvbnN0IHsgcG9vbCB9ID0gZGF0YTtcbiAgICAgICAgICAgICAgY29uc3QgYW1vdW50T2ZFZmZvcnQgPSBwYXJzZUludChkYXRhWydlZmZvcnQnXSB8fCAwLCAxMCk7XG4gICAgICAgICAgICAgIGNvbnN0IGVmZm9ydENvc3QgPSBhY3Rvci5nZXRFZmZvcnRDb3N0RnJvbVN0YXQocG9vbCwgYW1vdW50T2ZFZmZvcnQpO1xuICAgICAgICAgICAgICBjb25zdCB0b3RhbENvc3QgPSBwYXJzZUludChkYXRhWydhYmlsaXR5Q29zdCddIHx8IDAsIDEwKSArIHBhcnNlSW50KGVmZm9ydENvc3QuY29zdCwgMTApO1xuXG4gICAgICAgICAgICAgIGlmIChhY3Rvci5jYW5TcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCkgJiYgIWVmZm9ydENvc3Qud2FybmluZykge1xuICAgICAgICAgICAgICAgIHJvbGwudG9NZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgIHNwZWFrZXI6IHNwZWFrZXIsXG4gICAgICAgICAgICAgICAgICBmbGF2b3I6IGZsYXZvclxuICAgICAgICAgICAgICAgIH0sIHsgcm9sbE1vZGUgfSk7XG5cbiAgICAgICAgICAgICAgICBhY3Rvci5zcGVuZEZyb21Qb29sKHBvb2wsIHRvdGFsQ29zdCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9vbE5hbWUgPSBFbnVtUG9vbHNbcG9vbF07XG4gICAgICAgICAgICAgICAgQ2hhdE1lc3NhZ2UuY3JlYXRlKFt7XG4gICAgICAgICAgICAgICAgICBzcGVha2VyLFxuICAgICAgICAgICAgICAgICAgZmxhdm9yOiAnUm9sbCBGYWlsZWQnLFxuICAgICAgICAgICAgICAgICAgY29udGVudDogYE5vdCBlbm91Z2ggcG9pbnRzIGluICR7cG9vbE5hbWV9IHBvb2wuYFxuICAgICAgICAgICAgICAgIH1dKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYW5jZWw6IHtcbiAgICAgICAgICAgIGljb246ICc8aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuICAgICAgICAgICAgbGFiZWw6ICdDYW5jZWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGRlZmF1bHQ6ICdvaycsXG4gICAgICAgIGNsb3NlOiAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShyb2xsZWQgPyByb2xsIDogZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KS5yZW5kZXIodHJ1ZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8qIGdsb2JhbHMgbG9hZFRlbXBsYXRlcyAqL1xuXG4vKipcbiAqIERlZmluZSBhIHNldCBvZiB0ZW1wbGF0ZSBwYXRocyB0byBwcmUtbG9hZFxuICogUHJlLWxvYWRlZCB0ZW1wbGF0ZXMgYXJlIGNvbXBpbGVkIGFuZCBjYWNoZWQgZm9yIGZhc3QgYWNjZXNzIHdoZW4gcmVuZGVyaW5nXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnQgY29uc3QgcHJlbG9hZEhhbmRsZWJhcnNUZW1wbGF0ZXMgPSBhc3luYygpID0+IHtcbiAgLy8gRGVmaW5lIHRlbXBsYXRlIHBhdGhzIHRvIGxvYWRcbiAgY29uc3QgdGVtcGxhdGVQYXRocyA9IFtcblxuICAgICAgLy8gQWN0b3IgU2hlZXRzXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL2FjdG9yLXNoZWV0Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGMtc2hlZXQuaHRtbFwiLFxuXG4gICAgICAvLyBBY3RvciBQYXJ0aWFsc1xuICAgICAgXCJzeXN0ZW1zL2N5cGhlcnN5c3RlbUNsZWFuL3RlbXBsYXRlcy9hY3Rvci9wYXJ0aWFscy9wb29scy5odG1sXCIsXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL2FkdmFuY2VtZW50Lmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvZGFtYWdlLXRyYWNrLmh0bWxcIixcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvYWN0b3IvcGFydGlhbHMvcmVjb3ZlcnkuaHRtbFwiLFxuXG4gICAgICBcInN5c3RlbXMvY3lwaGVyc3lzdGVtQ2xlYW4vdGVtcGxhdGVzL2FjdG9yL3BhcnRpYWxzL3NraWxscy5odG1sXCIsXG5cbiAgICAgIC8vSXRlbSBTaGVldHNcbiAgICAgIFwic3lzdGVtcy9jeXBoZXJzeXN0ZW1DbGVhbi90ZW1wbGF0ZXMvaXRlbS9pdGVtLXNoZWV0Lmh0bWxcIixcbiAgXTtcblxuICAvLyBMb2FkIHRoZSB0ZW1wbGF0ZSBwYXJ0c1xuICByZXR1cm4gbG9hZFRlbXBsYXRlcyh0ZW1wbGF0ZVBhdGhzKTtcbn07XG4iLCJmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FycmF5TGlrZVRvQXJyYXk7IiwiZnVuY3Rpb24gX2FycmF5V2l0aEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gYXJyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hcnJheVdpdGhIb2xlczsiLCJmdW5jdGlvbiBfYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpIHtcbiAgaWYgKHNlbGYgPT09IHZvaWQgMCkge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBzZWxmO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3NlcnRUaGlzSW5pdGlhbGl6ZWQ7IiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FzeW5jVG9HZW5lcmF0b3I7IiwiZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfY2xhc3NDYWxsQ2hlY2s7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgcmV0dXJuIENvbnN0cnVjdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9jcmVhdGVDbGFzczsiLCJ2YXIgc3VwZXJQcm9wQmFzZSA9IHJlcXVpcmUoXCIuL3N1cGVyUHJvcEJhc2VcIik7XG5cbmZ1bmN0aW9uIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKHR5cGVvZiBSZWZsZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmIFJlZmxlY3QuZ2V0KSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfZ2V0ID0gUmVmbGVjdC5nZXQ7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfZ2V0ID0gZnVuY3Rpb24gX2dldCh0YXJnZXQsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICAgICAgdmFyIGJhc2UgPSBzdXBlclByb3BCYXNlKHRhcmdldCwgcHJvcGVydHkpO1xuICAgICAgaWYgKCFiYXNlKSByZXR1cm47XG4gICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYmFzZSwgcHJvcGVydHkpO1xuXG4gICAgICBpZiAoZGVzYy5nZXQpIHtcbiAgICAgICAgcmV0dXJuIGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIF9nZXQodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIgfHwgdGFyZ2V0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZ2V0OyIsImZ1bmN0aW9uIF9nZXRQcm90b3R5cGVPZihvKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gX2dldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LmdldFByb3RvdHlwZU9mIDogZnVuY3Rpb24gX2dldFByb3RvdHlwZU9mKG8pIHtcbiAgICByZXR1cm4gby5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKG8pO1xuICB9O1xuICByZXR1cm4gX2dldFByb3RvdHlwZU9mKG8pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9nZXRQcm90b3R5cGVPZjsiLCJ2YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi9zZXRQcm90b3R5cGVPZlwiKTtcblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pbmhlcml0czsiLCJmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0OyIsImZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHtcbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwidW5kZWZpbmVkXCIgfHwgIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpKSByZXR1cm47XG4gIHZhciBfYXJyID0gW107XG4gIHZhciBfbiA9IHRydWU7XG4gIHZhciBfZCA9IGZhbHNlO1xuICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBfZCA9IHRydWU7XG4gICAgX2UgPSBlcnI7XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0gIT0gbnVsbCkgX2lbXCJyZXR1cm5cIl0oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2Fycjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaXRlcmFibGVUb0FycmF5TGltaXQ7IiwiZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfbm9uSXRlcmFibGVSZXN0OyIsInZhciBfdHlwZW9mID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgYXNzZXJ0VGhpc0luaXRpYWxpemVkID0gcmVxdWlyZShcIi4vYXNzZXJ0VGhpc0luaXRpYWxpemVkXCIpO1xuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7XG4gIGlmIChjYWxsICYmIChfdHlwZW9mKGNhbGwpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgcmV0dXJuIGNhbGw7XG4gIH1cblxuICByZXR1cm4gYXNzZXJ0VGhpc0luaXRpYWxpemVkKHNlbGYpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuOyIsImZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gX3NldFByb3RvdHlwZU9mID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7XG4gICAgby5fX3Byb3RvX18gPSBwO1xuICAgIHJldHVybiBvO1xuICB9O1xuXG4gIHJldHVybiBfc2V0UHJvdG90eXBlT2YobywgcCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3NldFByb3RvdHlwZU9mOyIsInZhciBhcnJheVdpdGhIb2xlcyA9IHJlcXVpcmUoXCIuL2FycmF5V2l0aEhvbGVzXCIpO1xuXG52YXIgaXRlcmFibGVUb0FycmF5TGltaXQgPSByZXF1aXJlKFwiLi9pdGVyYWJsZVRvQXJyYXlMaW1pdFwiKTtcblxudmFyIHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5ID0gcmVxdWlyZShcIi4vdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXlcIik7XG5cbnZhciBub25JdGVyYWJsZVJlc3QgPSByZXF1aXJlKFwiLi9ub25JdGVyYWJsZVJlc3RcIik7XG5cbmZ1bmN0aW9uIF9zbGljZWRUb0FycmF5KGFyciwgaSkge1xuICByZXR1cm4gYXJyYXlXaXRoSG9sZXMoYXJyKSB8fCBpdGVyYWJsZVRvQXJyYXlMaW1pdChhcnIsIGkpIHx8IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KGFyciwgaSkgfHwgbm9uSXRlcmFibGVSZXN0KCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX3NsaWNlZFRvQXJyYXk7IiwidmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4vZ2V0UHJvdG90eXBlT2ZcIik7XG5cbmZ1bmN0aW9uIF9zdXBlclByb3BCYXNlKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgd2hpbGUgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSkpIHtcbiAgICBvYmplY3QgPSBnZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIGlmIChvYmplY3QgPT09IG51bGwpIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfc3VwZXJQcm9wQmFzZTsiLCJmdW5jdGlvbiBfdHlwZW9mKG9iaikge1xuICBcIkBiYWJlbC9oZWxwZXJzIC0gdHlwZW9mXCI7XG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gX3R5cGVvZihvYmopO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF90eXBlb2Y7IiwidmFyIGFycmF5TGlrZVRvQXJyYXkgPSByZXF1aXJlKFwiLi9hcnJheUxpa2VUb0FycmF5XCIpO1xuXG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheTsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiJdfQ==
