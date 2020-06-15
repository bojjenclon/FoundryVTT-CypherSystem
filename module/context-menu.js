export function actorDirectoryContext(html, entryOptions) {
  entryOptions.push({
    name: game.i18n.localize('CSR.ctxt.intrusion.heading'),
    icon: '<i class="fas fa-exclamation-circle"></i>',

    callback: li => {
      const actor = game.actors.get(li.data('entityId'));
      const ownerIds = Object.entries(actor.data.permission)
        .filter(entry => {
          const [id, permissionLevel] = entry;
          return permissionLevel >= ENTITY_PERMISSIONS.OWNER && id !== game.user.id;
        })
        .map(usersPermissions => usersPermissions[0]);

      game.socket.emit('system.cyphersystemClean', {
        type: 'gmIntrusion',
        data: {
          userIds: ownerIds,
          actorId: actor.data._id,
        }
      });

      const heading = game.i18n.localize('CSR.ctxt.intrusion.heading');
      const body = game.i18n.localize('CSR.ctxt.intrusion.heading').replace('##ACTOR##', actor.data.name);

      ChatMessage.create({
        content: `<h2>${heading}</h2><br/>${body}`,
      });
    },

    condition: li => {
      if (!game.user.isGM) {
        return false;
      }

      const actor = game.actors.get(li.data('entityId'));
      return actor && actor.data.type === 'pc';
    }
  });
}
