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

  Handlebars.registerHelper('sortIcon', (sortInfo, field) => {
    if (sortInfo.field !== field) {
      return '';
    }

    return `&nbsp;<i class="fas fa-long-arrow-alt-${sortInfo.asc ? 'up' : 'down'}"></i>`;
  });
};
