import each from 'lodash-es/collection/each'
import clone from 'lodash-es/lang/clone'
import emoji from 'js-emoji'
import React from 'react'

import Icon from './Icon'

let map
let index = []
let sheetUrl

emoji.init_colons()

let colonsRegExp = emoji.rx_colons

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
  return name ? map[name.replace(/:/g, '')] : map
}

/**
 * Get index array.
 */
export function getIndex() {
  return index
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
  map = createMap()
  index = createIndex()
}

/**
 * Replace :smile: by html icon.
 */
export function replace(text) {
  return text.replace(colonsRegExp, function (name) {
    let emoji = get(name)
    if (emoji) return React.renderToStaticMarkup(emoji.icon)
    return name
  })
}

/**
 * Create map from emoji colons.
 */
function createMap() {
  let map = {}

  each(emoji.map.colons, (id, name) => {
    let style = getSliceStyle(id)
    let shortname = `:${name}:`
    map[name] = {
      id: id,
      name: name,
      shortname: shortname,
      icon:  <Icon name={shortname} style={style} />,
      style: style,
      type: 'emoji'
    }
  })

  return map
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

export function getSliceStyle(id) {
  let px = emoji.data[id][4]
  let py = emoji.data[id][5]
  let mul = 100 / (emoji.sheet_size - 1)

  return {
    backgroundPosition: `${mul * px}% ${mul * py}%`,
    backgroundSize: emoji.sheet_size + '00%',
    backgroundImage: `url(${sheetUrl})`
  }
}

function getCustomStyle(url) {
  return {backgroundImage: `url(${url})`}
}
