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
