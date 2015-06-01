import each from 'lodash-es/collection/each'
import find from 'lodash-es/collection/find'
import assign from 'lodash-es/object/assign'
import {default as meta} from 'emojione/emoji.json'

import * as emoji from './emoji'
import * as icon from './icon'
import * as itemStyle from './item/style'

emoji.options.jsx = true

const CATEGORY_ORDER = {
  emoticons: 0,
  nature: 1,
  objects: 2,
  places: 3,
  other: 4
}

let sections = (function() {
  let sections = []

  each(meta, (data, name) => {
    let section = find(sections, section => section.id == data.category)

    if (!section) {
      section = {
        id: data.category,
        label: data.category,
        itemNames: [],
        selected: false
      }
      sections.push(section)
    }

    section.itemNames.push(name)
  })

  sections = sections.sort((section1, section2) =>  {
    return CATEGORY_ORDER[section1.id] - CATEGORY_ORDER[section2.id]
  })

  return sections
}())

export function init() {
  sections.forEach(section => {
    section.items = []
    section.itemNames.forEach(name => {
      let item = emoji.get(name)
      if (item) section.items.push(item)
    })
  })

  // Select first item of the first section.
  sections[0].items[0].focused = true
}

export function getSections() {
  return sections
}

export function getCurrentSection(sections, id) {
  return find(sections, section => {
    return section.items.some(item => item.id == id)
  })
}

export function getTabs() {
  let smiley = emoji.get('smiley')
  let smileyStyle = emoji.getSliceStyle(smiley.id)
  assign(smileyStyle, itemStyle.TAB_ICON)
  let smileyIcon = icon.tpl(smiley.name, smileyStyle, undefined, emoji.options)
  return [{
    label: 'Emoji',
    amount: emoji.getIndex().length - 1,
    id: 0,
    selected: true,
    icon: smileyIcon
  }]
}

export function setSelectedTab() {

}

/**
 * Get all items from all sections.
 */
export function extractItems(sections) {
  let items = []
  sections.forEach(section => items = items.concat(section.items))
  return items
}

export function setFocusedItemAt() {

}

/**
 * Get item by id.
 */
function getItemById(sections, id) {
  let ret

  sections.some(section => {
    let obj = find(section.items, item => item.id == id)
    if (obj) {
      ret = obj
      return true
    }
    return false
  })

  return ret
}

/**
 * Get currently focused item.
 */
export function getFocusedItem(sections) {
  let ret

  sections.some(section => {
    let focused = find(section.items, item => item.focused)
    if (focused) {
      ret = focused
      return true
    }
    return false
  })

  return ret
}

/**
 * Mark a item as focused. Unmark previously focused one.
 */
export function setFocusedItem(sections, id) {
  unsetFocusedItem(sections)
  getItemById(sections, id).focused = true
}


/**
 * Mark currently focused item as not focused.
 */
function unsetFocusedItem(sections) {
  let prev = getFocusedItem(sections)
  if (prev) prev.focused = false
}
