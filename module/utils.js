export function deepProp(obj, path) {
  const props = path.split('.');
  let val = obj;
  props.forEach(p => {
    if (p in val) {
      val = val[p];
    }
  });
  return val;
}

export function isDefined(val) {
  return !(val === null || typeof val === 'undefined');
}

export function valOrDefault(val, def) {
  return isDefined(val) ? val : def;
}
