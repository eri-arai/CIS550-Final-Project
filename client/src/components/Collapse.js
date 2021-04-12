
function getStyles(element, props) {
  const computed = window.getComputedStyle(element);
  return props.reduce((obj, prop) => {
    obj[prop] = computed[prop];
    return obj;
  }, {});
}

function slide(element, {  direction, onComplete }) {
  const collapsedStyles = {
    marginTop: '0px',
    marginBottom: '0px',
    height: '0px',
  }
  const props = Object.keys(collapsedStyles);

  const [ targetStyles ] = direction === 'DOWN'
    ? [ collapsedStyles, getStyles(element, props) ]
    : [ getStyles(element, props), collapsedStyles ]
  new Map(props.map(prop => [prop, targetStyles[prop]]));

  if (onComplete) {
    onComplete();
  }
}

function slideDown(element, {  onComplete } = {}) {
  return slide(element, { direction: 'DOWN',  onComplete });
}

function slideUp(element, { onComplete } = {}) {
  return slide(element, { direction: 'UP',  onComplete });
}


export { slide, slideDown, slideUp }