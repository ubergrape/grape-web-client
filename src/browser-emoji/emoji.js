import React from 'react'
import each from 'lodash/collection/each'
import emoji from 'js-emoji'

import Icon from './Icon'

let map
let customMap = {}
let index = []
let sheetUrl
let stats = {}

emoji.init_colons()

let colonsRegExp = emoji.rx_colons

export function getStats() {
  return stats
}

/**
 * Define custom emojis.
 * @param {Object} emojis map of name:url pairs.
 */
export function defineCustom(emojis) {
  stats.customEmoji = 0
  each(emojis, (url, name) => {
    let style = {backgroundImage: `url(${url})`}
    let shortname = `:${name}:`
    customMap[name] = {
      id: url,
      name: name,
      shortname: shortname,
      icon: <Icon name={shortname} style={style} />,
      style: style,
      type: 'customEmoji'
    }
    stats.customEmoji++
  })
  index = createIndex()
}

/**
 * Get custom emoji map.
 */
export function getCustom() {
  return customMap
}

/**
 * Get emoji data.
 */
export function get(shortName) {
  if (!shortName) return map
  let name = shortName.replace(/:/g, '')
  return map[name] || customMap[name]
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
  return text.replace(colonsRegExp, name => {
    let def = get(name)
    if (def) return React.renderToStaticMarkup(def.icon)
    return name
  })
}

/**
 * Create map from emoji colons.
 */
function createMap() {
  let newMap = {}
  stats.emoji = 0
  each(emoji.map.colons, (id, name) => {
    let style = getSliceStyle(id)
    let shortname = `:${name}:`
    newMap[name] = {
      id: id,
      name: name,
      shortname: shortname,
      icon: <Icon name={shortname} style={style} />,
      style: style,
      type: 'emoji'
    }
    stats.emoji++
  })

  return newMap
}

/**
 * Creates an index out of the map.
 */
function createIndex() {
  let newIndex = []
  each(map, item => {
    newIndex.push(item)
  })
  each(customMap, item => {
    newIndex.push(item)
  })
  return newIndex
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
