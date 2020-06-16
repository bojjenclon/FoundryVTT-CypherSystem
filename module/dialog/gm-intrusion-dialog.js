/* globals mergeObject Dialog */

/**
 * Prompts the user with a choice of a GM Intrusion.
 * 
 * @export
 * @class GMIntrusionDialog
 * @extends {Dialog}
 */
export class GMIntrusionDialog extends Dialog {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "templates/hud/dialog.html",
      classes: ["csr", "dialog"],
      width: 500
    });
  }

  constructor(actor, options = {}) {
    const acceptQuestion = game.i18n.localize('CSR.dialog.intrusion.doYouAccept');
    const acceptInstructions = game.i18n.localize('CSR.dialog.intrusion.acceptInstructions')
      .replace('##ACCEPT##', `<span style="color: green">${game.i18n.localize('CSR.accept')}</span>`);
    const refuseInstructions = game.i18n.localize('CSR.dialog.intrusion.refuseInstructions')
      .replace('##REFUSE##', `<span style="color: red">${game.i18n.localize('CSR.refuse')}</span>`);

    let dialogContent = `
    <div class="row">
      <div class="col-xs-12">
        <p>${acceptQuestion}</p>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-xs-6">
        <p>${acceptInstructions}</p>
      </div>
      <div class="col-xs-6">
        <p>${refuseInstructions}</p>
      </div>
    </div>
    <hr />`;

    let dialogButtons = {
      ok: {
        icon: '<i class="fas fa-check" style="color: green"></i>',
        label: game.i18n.localize('CSR.dialog.button.accept'),
        callback: async () => {
          await actor.onGMIntrusion(true);
          super.close();
        }
      },
      cancel: {
        icon: '<i class="fas fa-times" style="color: red"></i>',
        label: game.i18n.localize('CSR.dialog.button.refuse'),
        callback: async () => {
          await actor.onGMIntrusion(false);
          super.close();
        }
      }
    };

    if (!actor.canRefuseIntrusion) {
      const notEnoughXP = game.i18n.localize('CSR.dialog.intrusion.notEnoughXP');

      dialogContent += `
      <div class="row">
        <div class="col-xs-12">
          <p><strong>${notEnoughXP}</strong></p>
        </div>
      </div>
      <hr />`

      delete dialogButtons.cancel;
    }

    const dialogData = {
      title: game.i18n.localize('CSR.dialog.intrusion.title'),
      content: dialogContent,
      buttons: dialogButtons,
      defaultYes: false,
    };

    super(dialogData, options);

    this.actor = actor;
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
