export const registerSystemSettings = function() {
  /**
   * Configure the currency name
   */
  game.settings.register('cyphersystemClean', 'currencyName', {
    name: 'SETTINGS.name.currencyName',
    hint: 'SETTINGS.hint.currencyName',
    scope: 'world',
    config: true,
    type: String,
    default: 'Money'
  });
}
