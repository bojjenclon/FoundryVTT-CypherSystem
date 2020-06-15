import { GMIntrusionDialog } from "./dialog/gm-intrusion-dialog.js";

export function csrSocketListeners() {
  game.socket.on('system.cyphersystemClean', handleMessage);
}

function handleMessage(args) {
  const { type } = args;

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
  const { data } = args;
  const { actorId, userIds } = data;

  if (!game.ready || game.user.isGM || !userIds.find(id => id === game.userId)) {
    return;
  }

  const actor = game.actors.entities.find(a => a.data._id === actorId);
  const dialog = new GMIntrusionDialog(actor);
  dialog.render(true);
}

function handleAwardXP(args) {
  const { data } = args;
  const { actorId, xpAmount } = data;

  if (!game.ready || !game.user.isGM) {
    return;
  }

  const actor = game.actors.get(actorId);
  actor.update({
    'data.xp': actor.data.data.xp + xpAmount
  });
}
