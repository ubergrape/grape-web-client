import each from 'lodash-es/collection/each'
import find from 'lodash-es/collection/find'
import assign from 'lodash-es/object/assign'
import get from 'lodash-es/object/get'
import values from 'lodash-es/object/values'

import * as dataUtils from '../components/browser/dataUtils'
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
export let {extractItems} = dataUtils
export let {setSelectedTab} = dataUtils
let {unsetFocusedItem} = dataUtils

let sections = {}

sections.emoji = (function() {
  let sections = []

  meta.forEach(data => {
    let section = find(sections, section => section.id == data.cat)

    if (!section) {
      section = {
        id: data.cat,
        label: data.cat,
        itemNames: [],
        items: [],
        selected: false
      }
      sections.push(section)
    }

    section.itemNames.push(data.name)
  })

  sections = sections.sort((section1, section2) =>  {
    return CATEGORY_ORDER[section1.id] - CATEGORY_ORDER[section2.id]
  })

  return sections
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

export function getSections(tabId, search) {
  let found = sections[tabId]

  if (search) {
    search = search.toLowerCase()
    found = []
    sections[tabId].forEach(section => {
      let items = section.items.filter(item => {
         return item.name.indexOf(search) >= 0
      })

      if (items.length) {
        section = assign({}, section, {items: items})
        found.push(section)
      }
    })
  }

  // Select first item of the first section.
  let firstItemId = get(found, '[0].items[0].id')
  if (firstItemId) setFocusedItem(found, firstItemId)
  return found
}

export function getCurrentSection(sections, id) {
  return find(sections, section => {
    return section.items.some(item => item.id == id)
  })
}

export function getTabs(options) {
  if (!emoji.get()) return []

  let tabs = []
  let stats = emoji.getStats()

  if (stats.emoji) {
    let smiley = emoji.get('smiley')
    let style = emoji.getSliceStyle(smiley.id)
    assign(style, itemStyle.TAB_ICON)
    tabs.push({
      id: 'emoji',
      label: 'Emoji',
      amount: stats.emoji,
      selected: true,
      icon: <Icon style={style} />
    })
  }

  if (stats.customEmoji) {
    let style = {backgroundImage: `url(${options.orgLogo})`}
    assign(style, itemStyle.TAB_ICON)
    tabs.push({
      id: 'customEmoji',
      label: 'Custom',
      amount: stats.customEmoji,
      selected: false,
      icon: <Icon style={style} />
    })
  }

  return tabs
}
