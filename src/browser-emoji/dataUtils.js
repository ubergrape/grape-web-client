import React from 'react'
import find from 'lodash/collection/find'
import indexBy from 'lodash/collection/indexBy'
import get from 'lodash/object/get'
import values from 'lodash/object/values'

import * as dataUtils from '../browser/dataUtils'
import * as grid from './grid'
import meta from './meta.json'
import * as emoji from './emoji'
import Icon from './Icon'
import * as itemStyle from './item/style'

const CATEGORY_ORDER = {
  emoticons: 0,
  nature: 1,
  objects: 2,
  places: 3,
  other: 4
}

export let {getFocusedItem} = dataUtils
export let {setFocusedItem} = dataUtils
export let {setSelectedTab} = dataUtils
export let {getItem} = grid

let sections = {}

const META_MAP = indexBy(meta, 'name')

sections.emoji = (() => {
  let staticSections = []

  meta.forEach(data => {
    let section = find(staticSections, item => item.id === data.cat)

    if (!section) {
      section = {
        id: data.cat,
        label: data.cat,
        itemNames: [],
        items: [],
        selected: false
      }
      staticSections.push(section)
    }

    section.itemNames.push(data.name)
  })

  staticSections = staticSections.sort((section1, section2) => {
    return CATEGORY_ORDER[section1.id] - CATEGORY_ORDER[section2.id]
  })

  return staticSections
}())

export function init() {
  if (!emoji.get()) return

  // Populate emoji sections with items if we have them in js-emoji.
  sections.emoji.forEach(section => {
    section.items = []
    section.itemNames.forEach(name => {
      let item = emoji.get(name)
      if (item) section.items.push(item)
    })
  })

  sections.customEmoji = [{
    id: 'customEmoji',
    label: 'Custom',
    selected: false,
    items: values(emoji.getCustom())
  }]
}

export function getSections(facet, search) {
  let found = sections[facet]

  if (search) {
    found = []
    sections[facet].forEach(section => {
      let items = section.items.filter(item => {
        if (item.name.indexOf(search) >= 0) return true
        let metaItem = META_MAP[item.name]
        if (!metaItem) return false
        return metaItem.aliases.some(alias => alias.indexOf(search) >= 0)
      })
      if (items.length) found.push({...section, items})
    })
  }

  // Select first item of the first section.
  let firstItemId = get(found, '[0].items[0].id')
  if (firstItemId) setFocusedItem(found, firstItemId)
  return found
}

export function getTabs(options) {
  let tabs = []

  if (!emoji.get()) return tabs

  let stats = emoji.getStats()

  if (stats.emoji) {
    let smiley = emoji.get('smiley')
    let style = {...emoji.getSliceStyle(smiley.id), ...itemStyle.TAB_ICON}
    tabs.push({
      id: 'emoji',
      label: 'Emoji',
      amount: stats.emoji,
      selected: !options.selected || options.selected === 'emoji',
      icon: <Icon style={style} />
    })
  }

  if (stats.customEmoji) {
    let style = {backgroundImage: `url(${options.orgLogo})`, ...itemStyle.TAB_ICON}
    tabs.push({
      id: 'customEmoji',
      label: 'Grapemoji',
      amount: stats.customEmoji,
      selected: options.selected === 'customEmoji',
      icon: <Icon style={style} />
    })
  }

  return tabs
}
