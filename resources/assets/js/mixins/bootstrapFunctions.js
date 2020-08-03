import _ from 'lodash';

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function merge(src, tar) {
  return _.merge({}, tar, src)
}

export function addCssToPage(href, el) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', `${href}`);
  if (el) {
    el.getElementsByTagName('head')[0].appendChild(link);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

export default {isObject, merge, addCssToPage}
