const migrations = [
  {
    version: 2,
    action: (npc, data) => {
      data['data.health'] = npc.data.data.health.max;
  
      return data;
    }
  }
];

async function migrator(npc, obj = {}) {
  let newData = Object.assign({ _id: npc._id, data: { version: npc.data.data.version } }, obj);

  migrations.forEach(handler => {
    const { version } = newData.data;
    if (version < handler.version) {
      newData = handler.action(npc, newData);
      newData.version = handler.version;
    }
  });

  return newData;
}

export const NPCMigrator = migrator;
