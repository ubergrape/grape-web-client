import each from 'lodash-es/collection/each'
import clone from 'lodash-es/lang/clone'
import emoji from 'js-emoji'

import * as icon from './icon'

let map = {}
let index = []
let sheetUrl

emoji.init_colons()

let colonsRegExp = emoji.rx_colons

export let options = {
  jsx: false
}

/**
 * Define custom emojis.
 * @param {Object} emojis map of name:url pairs.
 */
export function defineCustom(emojis) {
  each(emojis, (url, name) => {
    map[name] = getCustomStyle(url)
  })
  index = createIndex()
}

/**
 * Get emoji data.
 */
export function get(name) {
  return map[name.replace(/:/g, '')]
}

/**
 * Filter emojis by key.
 */
export function filter(key) {
  return index.filter(item => item.name.indexOf(key.toLowerCase()) >= 0)
}

/**
 * Set icons image slice url.
 */
export function setSheet(url) {
  sheetUrl = url
  createMap()
}

/**
 * Replace :smile: by html icon.
 */
export function replace(text) {
  return text.replace(colonsRegExp, function (emoji) {
    let matches = filter(emoji)
    return matches.length ? matches[0].icon : emoji
  })
}

/**
 * Create map from emoji colons.
 */
function createMap() {
  each(emoji.map.colons, (id, name) => {
    let style = getSliceStyle(id)
    map[name] = {
      id: name,
      name: `:${name}:`,
      icon: icon.tpl(name, style, {'data-object': name}, options),
      style: style,
      type: 'emoji'
    }
  })
  index = createIndex()
}

/**
 * Creates an index out of the map.
 */
function createIndex() {
  let index = []
  each(map, item => {
    index.push(item)
  })
  return index
}

function getSliceStyle(id) {
  let px = emoji.data[id][4]
  let py = emoji.data[id][5]
  let mul = 100 / (emoji.sheet_size - 1)

  return {
    'background-position': `${mul * px}% ${mul * py}%`,
    'background-size': emoji.sheet_size + '00%',
    'background-image': `url(${sheetUrl})`
  }
}

function getCustomStyle(url) {
  return {'background-image': `url(${url})`}
}
