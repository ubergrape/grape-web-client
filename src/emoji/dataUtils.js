import each from 'lodash-es/collection/each'
import find from 'lodash-es/collection/find'
import assign from 'lodash-es/object/assign'
import get from 'lodash-es/object/get'

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

let sections = (function() {
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
  sections.forEach(section => {
    section.items = []
    section.itemNames.forEach(name => {
      let item = emoji.get(name)
      if (item) section.items.push(item)
    })
  })
}

export function getSections(search) {
  let found = sections

  if (search) {
    search = search.toLowerCase()
    found = []
    sections.forEach(section => {
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

export function getTabs() {
  if (!emoji.get()) return []

  let smiley = emoji.get('smiley')
  let smileyStyle = emoji.getSliceStyle(smiley.id)
  assign(smileyStyle, itemStyle.TAB_ICON)
  return [{
    label: 'Emoji',
    amount: emoji.getIndex().length - 1,
    id: 0,
    selected: true,
    icon: <Icon name={smiley.shortname} style={smileyStyle} />
  }]
}

