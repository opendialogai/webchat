import deepMerge from 'lodash/merge';
import Timer from './timer';

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function initTimer(el, duration, callback) {
  const t = new Timer(duration, callback)

  el.addEventListener('click', () => {
    t.reset()
  })

  el.addEventListener('keydown', () => {
    t.reset()
  })

  t.start()
}

export function merge(src, tar) {
  return deepMerge({}, tar, src);
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

export function locationOrSpoof() {
  if (window.location.href.startsWith(window.openDialogSettings.url + '/admin/demo')
    && document.getElementById('spoof-url') !== null) {
    return document.getElementById('spoof-url').value;
  } else if (typeof spoofUrl !== 'undefined') {
    return spoofUrl;
  } else {
    return window.location.href;
  }
}

export function getTags() {
  let tags = {};
  let variables = ['userInfo'];

  variables.forEach((variable) => {
    if (typeof window[variable] !== 'undefined') {
      try {
        tags[variable] = JSON.parse(window[variable]);
      } catch (e) {
        tags[variable] = {};
      }
    }
  });

  return tags;
}

export function setVh() {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  return vh
}

export function getSettings(url, userId = '', customSettings = null, callbackId = null, width = null) {
  let configUrlObj = new URLSearchParams();
  configUrlObj.append('url', locationOrSpoof());

  if (userId) {
    configUrlObj.append('user_id', userId);
  } else if (sessionStorage.uuid) {
    configUrlObj.append('user_id', sessionStorage.uuid);
  }

  if (callbackId) {
    configUrlObj.append('callback_id', callbackId);
  }

  if (width) {
    configUrlObj.append('width', width);
  }

  const configUrl = `${url}/webchat-config?${configUrlObj.toString()}`;

  return fetch(configUrl, {
    url: configUrl,
    method: 'POST',
    body: JSON.stringify({
      custom_settings: customSettings,
      tags: getTags(),
    }),
  }).then(response => {
    if (response.status !== 200) {
      return Promise.reject(response.statusText);
    } else {
      return response.json();
    }
  })
}

export default {isObject, merge, addCssToPage, getSettings, locationOrSpoof}
