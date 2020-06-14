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

  Handlebars.registerHelper('typeIcon', val => {
    switch (val) {
      // TODO: Add skill and ability?
      
      case 'armor':
        return `<span title="${game.i18n.localize('CSR.inventory.armor')}">[a]</span>`;
      case 'weapon':
        return `<span title="${game.i18n.localize('CSR.inventory.weapon')}">[w]</span>`;
      case 'gear':
        return `<span title="${game.i18n.localize('CSR.inventory.gear')}">[g]</span>`;
      
      case 'cypher':
        return `<span title="${game.i18n.localize('CSR.inventory.cypher')}">[C]</span>`;
      case 'artifact':
        return `<span title="${game.i18n.localize('CSR.inventory.armor')}">[A]</span>`;
      case 'oddity':
        return `<span title="${game.i18n.localize('CSR.inventory.armor')}">[O]</span>`;
    }

    return '';
  });
};
