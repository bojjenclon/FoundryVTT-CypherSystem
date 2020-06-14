/* globals renderTemplate */

import { RollDialog } from './dialog/roll-dialog.js';

import EnumPools from './enums/enum-pool.js';

export class CypherRolls {
  static async Roll({ parts = [], data = {}, actor = null, event = null, speaker = null, flavor = null, title = null, item = false } = {}) {
    let rollMode = game.settings.get('core', 'rollMode');
    let rolled = false;
    let filtered = parts.filter(function (el) {
      return el != '' && el;
    });

    let maxEffort = 1;
    if (data['maxEffort']) {
      maxEffort = parseInt(data['maxEffort'], 10) || 1;
    }

    const _roll = (form = null) => {
      // Optionally include effort
      if (form !== null) {
        data['effort'] = parseInt(form.effort.value, 10);
      }
      if (data['effort']) {
        filtered.push(`+${data['effort'] * 3}`);

        flavor += ` with ${data['effort']} Effort`
      }

      const roll = new Roll(filtered.join(''), data).roll();
      // Convert the roll to a chat message and return the roll
      rollMode = form ? form.rollMode.value : rollMode;
      rolled = true;
      
      return roll;
    }

    const template = 'systems/cyphersystemClean/templates/dialog/roll-dialog.html';
    let dialogData = {
      formula: filtered.join(' '),
      maxEffort: maxEffort,
      data: data,
      rollMode: rollMode,
      rollModes: CONFIG.Dice.rollModes
    };

    const html = await renderTemplate(template, dialogData);
    //Create Dialog window
    let roll;
    return new Promise(resolve => {
      new RollDialog({
        title: title,
        content: html,
        buttons: {
          ok: {
            label: 'OK',
            icon: '<i class="fas fa-check"></i>',
            callback: (html) => {
              roll = _roll(html[0].children[0]);

              // TODO: check roll.result against target number

              const { pool } = data;
              const amountOfEffort = parseInt(data['effort'] || 0, 10);
              const effortCost = actor.getEffortCostFromStat(pool, amountOfEffort);
              const totalCost = parseInt(data['abilityCost'] || 0, 10) + parseInt(effortCost.cost, 10);

              if (actor.canSpendFromPool(pool, totalCost) && !effortCost.warning) {
                roll.toMessage({
                  speaker: speaker,
                  flavor: flavor
                }, { rollMode });

                actor.spendFromPool(pool, totalCost);
              } else {
                const poolName = EnumPools[pool];
                ChatMessage.create([{
                  speaker,
                  flavor: 'Roll Failed',
                  content: `Not enough points in ${poolName} pool.`
                }])
              }
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel',
          },
        },
        default: 'ok',
        close: () => {
          resolve(rolled ? roll : false);
        }
      }).render(true);
    });
  }
}
