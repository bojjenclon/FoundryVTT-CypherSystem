/* globals mergeObject Dialog */

/**
 * Allows the user to choose one of the other player characters.
 * 
 * @export
 * @class PlayerChoiceDialog
 * @extends {Dialog}
 */
export class PlayerChoiceDialog extends Dialog {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "templates/hud/dialog.html",
      classes: ["csr", "dialog", "player-choice"],
      width: 300,
      height: 175
    });
  }

  constructor(actors, onAcceptFn, options = {}) {
    const dialogSelectOptions = [];
    actors.forEach(actor => {
      dialogSelectOptions.push(`<option value="${actor._id}">${actor.name}</option>`)
    });

    const dialogText = game.i18n.localize('CSR.dialog.player.content');
    const dialogContent = `
    <div class="row">
      <div class="col-xs-12">
        <p>${dialogText}</p>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-xs-12">
        <select name="player">
          ${dialogSelectOptions.join('\n')}
        </select>
      </div>
    </div>
    <hr />`;

    const dialogButtons = {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('CSR.dialog.button.accept'),
        callback: () => {
          const actorId = document.querySelector('.player-choice select[name="player"]').value;

          onAcceptFn(actorId);

          super.close();
        }
      }
    };

    const dialogData = {
      title: game.i18n.localize('CSR.dialog.player.title'),
      content: dialogContent,
      buttons: dialogButtons,
      defaultYes: false,
    };

    super(dialogData, options);

    this.actors = actors;
  }

  getData() {
    const data = super.getData();

    data.actors = this.actors;

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('select[name="player"]').select2({
      theme: 'numenera',
      width: '100%',
      // minimumResultsForSearch: Infinity
    });
  }

  /** @override */
  _getHeaderButtons() {
    // Don't include any header buttons, force an option to be chosen
    return [];
  }

  /** @override */
  close() {
    // Prevent default closing behavior
  }
} 
