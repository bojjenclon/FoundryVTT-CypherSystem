/* globals renderTemplate */

import { RollDialog } from './dialog/roll-dialog.js';

import EnumPools from './enums/enum-pool.js';

export function rollText(dieRoll, rollTotal) {
  let parts = [];

  const taskLevel = Math.floor(rollTotal / 3);
  const skillLevel = Math.floor((rollTotal - dieRoll) / 3 + 0.5);
  const totalAchieved = taskLevel + skillLevel;

  let tnColor = '#000000';
  if (totalAchieved < 3) {
    tnColor = '#0a860a';
  } else if (totalAchieved < 7) {
    tnColor = '#848409';
  } else {
    tnColor = '#0a860a';
  }

  let successText = `<${totalAchieved}>`;
  if (skillLevel !== 0) {
    const sign = skillLevel > 0 ? "+" : "";
    successText += ` (${taskLevel}${sign}${skillLevel})`;
  }

  parts.push({
    text: successText,
    color: tnColor,
    cls: 'target-number'
  })

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

export async function cypherRoll({ parts = [], data = {}, actor = null, event = null, speaker = null, flavor = null, title = null, item = false } = {}) {
  let rollMode = game.settings.get('core', 'rollMode');
  let rolled = false;
  let filtered = parts.filter(function (el) {
    return el != '' && el;
  });

  // Indicates free levels of effort
  let startingEffort = 0;
  let minEffort = 0;
  if (data['effort']) {
    startingEffort = parseInt(data['effort'], 10) || 0;
    minEffort = startingEffort;
  }

  let maxEffort = 1;
  if (data['maxEffort']) {
    maxEffort = parseInt(data['maxEffort'], 10) || 1;
  }

  const _roll = (form = null) => {
    // Optionally include effort
    if (form) {
      data['effort'] = parseInt(form.effort.value, 10);
    }

    if (data['effort']) {
      filtered.push(`+${data['effort'] * 3}`);

      // TODO: Find a better way to localize this, concating strings doesn't work for all languages
      flavor += game.i18n.localize('CSR.roll.effort.flavor').replace('##EFFORT##', data['effort']);
    }

    const roll = new Roll(filtered.join(''), data).roll();
    // Convert the roll to a chat message and return the roll
    rollMode = form ? form.rollMode.value : rollMode;
    rolled = true;

    return roll;
  }

  const template = 'systems/cyphersystem/templates/dialog/roll-dialog.html';
  let dialogData = {
    formula: filtered.join(' '),
    effort: startingEffort,
    minEffort: minEffort,
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
            roll = _roll(html.find('form')[0]);

            // TODO: check roll.result against target number

            const { pool } = data;
            const amountOfEffort = parseInt(data['effort'] || 0, 10);
            const effortCost = actor.getEffortCostFromStat(pool, amountOfEffort);
            const totalCost = parseInt(data['poolCost'] || 0, 10) + parseInt(effortCost.cost, 10);

            if (actor.canSpendFromPool(pool, totalCost) && !effortCost.warning) {
              roll.toMessage({
                speaker: speaker,
                flavor: flavor
              }, { rollMode });

              actor.spendFromPool(pool, Math.max(totalCost, 0));
            } else {
              const poolName = EnumPools[pool];
              ChatMessage.create([{
                speaker,
                flavor: game.i18n.localize('CSR.roll.failed.flavor'),
                content: game.i18n.localize('CSR.roll.failed.content').replace('##POOL##', poolName)
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
