/* global $ */

import { rollText } from './rolls.js';

export function renderChatMessage(chatMessage, html, _data) {
  // Don't apply ChatMessage enhancement to recovery rolls
  if (chatMessage.roll && !chatMessage.roll.dice[0].options.recovery) {
    const dieRoll = chatMessage.roll.dice[0].results[0].result;
    const rollTotal = chatMessage.roll.total;
    const messages = rollText(dieRoll, rollTotal);
    const numMessages = messages.length;

    const messageContainer = $('<div/>');
    messageContainer.addClass('special-messages');

    messages.forEach((special, idx) => {
      const { text, color, cls } = special;

      const newContent = `<span class="${cls}" style="color: ${color}">${text}</span>${idx < numMessages - 1 ? '<br />' : ''}`;

      messageContainer.append(newContent);
    });

    const dt = html.find(".dice-total");
    messageContainer.insertBefore(dt);
  }
}
