export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('toLowerCase', str => str.toLowerCase());
  Handlebars.registerHelper('toUpperCase', text => text.toUpperCase());

  Handlebars.registerHelper('eq', (v1, v2) => v1 === v2);
  Handlebars.registerHelper('neq', (v1, v2) => v1 !== v2);
  Handlebars.registerHelper('or', (v1, v2) => v1 || v2);
  Handlebars.registerHelper('ternary', (cond, v1, v2) => cond ? v1 : v2);
  Handlebars.registerHelper('concat', (v1, v2) => `${v1}${v2}`);

  Handlebars.registerHelper('strOrSpace', val => {
    if (typeof val === 'string') {
      return (val && !!val.length) ? val : '&nbsp;';
    }

    return val;
  });

  Handlebars.registerHelper('trainingIcon', val => {
    switch (val) {
      case 0:
        return `<span title="${game.i18n.localize('CSR.training.inability')}">[I]</span>`;
      case 1:
        return `<span title="${game.i18n.localize('CSR.training.untrained')}">[U]</span>`;
      case 2:
        return `<span title="${game.i18n.localize('CSR.training.trained')}">[T]</span>`;
      case 3:
        return `<span title="${game.i18n.localize('CSR.training.specialized')}">[S]</span>`;
    }

    return '';
  });

  Handlebars.registerHelper('poolIcon', val => {
    switch (val) {
      case 0:
        return `<span title="${game.i18n.localize('CSR.pool.might')}">[M]</span>`;
      case 1:
        return `<span title="${game.i18n.localize('CSR.pool.speed')}">[S]</span>`;
      case 2:
        return `<span title="${game.i18n.localize('CSR.pool.intellect')}">[I]</span>`;
    }

    return '';
  });
};
