import { NPCMigrator } from './npc-migrations';

export async function migrate() {
  if (!game.user.isGM) {
    return;
  }

  console.info('--- Starting Migration Process ---');

  const npcActors = game.actors.entities.filter(actor => actor.data.type === 'npc');

  for (let i = 0; i < npcActors.length; i++) {
    const npc = npcActors[i];
    const newData = await NPCMigrator(npc);
    await npc.update(newData);
  }

  console.info('--- Migration Process Finished ---');
}
