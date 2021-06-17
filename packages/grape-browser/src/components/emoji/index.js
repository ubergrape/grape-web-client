import React from 'react'
import each from 'lodash/each'
import EmojiConvertor from 'grape-js-emoji'
import ReactDOMServer from 'react-dom/server'

import Icon from '../icon/Icon'

export const REGEX = /(^|\s):\w+:(?=($|\s))/g

let map
const customMap = {}
let index = []
let sheetUrl
const stats = {}

const emoji = new EmojiConvertor()
emoji.use_sheet = true
emoji.init_colons()

const colonsRegExp = emoji.rx_colons

/**
 * Creates an index out of the map.
 */
function createIndex() {
  const newIndex = []
  each(map, item => {
    newIndex.push(item)
  })
  each(customMap, item => {
    newIndex.push(item)
  })
  return newIndex
}

export function getSliceStyle(id) {
  const img = emoji.find_image(id)
  const sheetSize = emoji.sheet_size * (img.sheet_size + 2) // size of sprite sheet image in pixels
  const sheetX =
    100 * ((img.px * (img.sheet_size + 2) + 1) / (sheetSize - img.sheet_size))
  const sheetY =
    100 * ((img.py * (img.sheet_size + 2) + 1) / (sheetSize - img.sheet_size))
  const sheetZoom = 100 * (sheetSize / img.sheet_size)

  return {
    backgroundPosition: `${sheetX}% ${sheetY}%`,
    backgroundSize: `${sheetZoom}%`,
    backgroundImage: `url(${sheetUrl})`,
  }
}

/**
 * Create map from emoji colons.
 */
function createMap() {
  const newMap = {}
  stats.emoji = 0
  each(emoji.map.colons, (id, name) => {
    const style = getSliceStyle(id)
    const shortname = `:${name}:`
    newMap[name] = {
      id,
      name,
      shortname,
      icon: <Icon name={shortname} style={style} />,
      style,
      type: 'emoji',
    }
    stats.emoji++
  })

  return newMap
}

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
    const style = { backgroundImage: `url(${url})` }
    const shortname = `:${name}:`
    customMap[name] = {
      id: url,
      name,
      shortname,
      icon: <Icon name={shortname} style={style} />,
      style,
      type: 'customEmoji',
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
  const name = shortName.replace(/:/g, '')
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
  return index.filter(item => item.name.indexOf(key) >= 0)
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
    const def = get(name)
    return def ? ReactDOMServer.renderToStaticMarkup(def.icon) : name
  })
}
