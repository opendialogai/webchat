
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function merge(src, tar) {
  Object.keys(src).forEach(key => {
    if (tar[key] && isObject(src[key])) {
      src[key] = Object.assign(src[key], tar[key])
    } else if (!tar[key]) {
      tar[key] = src[key]
    }
  });
}

export function addCssToPage(href) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', `${href}?${window.openDialogSettings.css_version}`);
  document.getElementsByTagName('head')[0].appendChild(link);
}

export default {isObject, merge, addCssToPage}
