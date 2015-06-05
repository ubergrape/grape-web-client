import each from 'lodash-es/collection/each'
import clone from 'lodash-es/lang/clone'
import emoji from 'js-emoji'
import React from 'react'

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
      icon:  <Icon name={shortname} style={style} />,
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
export function getCustom() {
  return customMap
}

/**
 * Get emoji data.
 */
export function get(name) {
  if (!name) return map
  name = name.replace(/:/g, '')
  return map[name] || customMap[name]
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
  stats.emoji = 0
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
    stats.emoji++
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
  each(customMap, item => {
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
