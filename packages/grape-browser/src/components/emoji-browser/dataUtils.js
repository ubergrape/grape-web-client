import React from 'react'
import find from 'lodash/find'
import keyBy from 'lodash/keyBy'
import values from 'lodash/values'
import compact from 'lodash/compact'

import * as grid from './grid'
import EMOJI_META from '../emoji/meta'
import * as emoji from '../emoji'
import Icon from '../icon/Icon'
import * as itemStyle from './item/style'

const EMOJI_CATEGORY_ORDER = {
  emoticons: 0,
  nature: 1,
  objects: 2,
  places: 3,
  other: 4,
}

const EMOJI_CATEGORY_ICON = {
  search: 'mag',
  emoticons: 'smiley',
  nature: 'four_leaf_clover',
  objects: 'soccer',
  places: 'airplane',
  other: '1234',
  grapemoji: 'grapemoji',
}

const EMOJI_META_MAP = keyBy(EMOJI_META, 'name')

let allSections = []

function getItemFromSections(sections, fn) {
  let item

  sections.some(section => {
    item = find(section.items, fn)
    return Boolean(item)
  })

  return item
}

/**
 * Get item by id.
 */
function getItemFromSectionsById(sections, id) {
  return getItemFromSections(sections, item => item.id === id)
}

/**
 * Mark currently focused item as not focused.
 */
function unsetFocusedItem(sections) {
  sections.forEach(section => {
    section.items.forEach(item => {
      // TODO refactor without mutations
      // eslint-disable-next-line no-param-reassign
      item.focused = false
    })
  })
}

export const { getItem } = grid

/**
 * Get currently focused item.
 */
export function getFocusedItem(sections) {
  return getItemFromSections(sections, item => item.focused)
}

/**
 * Mark a item as focused. Unmark previously focused one.
 */
export function setFocusedItem(sections, id) {
  unsetFocusedItem(sections)
  const item = getItemFromSectionsById(sections, id)
  item.focused = true
}

export function init() {
  if (!emoji.get()) return

  allSections = []

  EMOJI_META.forEach(data => {
    let section = find(allSections, item => item.id === data.cat)

    if (!section) {
      section = {
        id: data.cat,
        label: data.cat,
        itemNames: [],
        items: [],
        selected: false,
      }
      allSections.push(section)
    }

    section.itemNames.push(data.name)
  })

  allSections = allSections.sort(
    (section1, section2) =>
      EMOJI_CATEGORY_ORDER[section1.id] - EMOJI_CATEGORY_ORDER[section2.id],
  )

  // Populate emoji sections with items if we have them in js-emoji.
  allSections = allSections.map(section => {
    const nextSection = { ...section, items: [] }
    nextSection.itemNames.forEach(name => {
      const item = emoji.get(name)
      if (item) nextSection.items.push(item)
    })
    return nextSection
  })

  allSections.push({
    id: 'grapemoji',
    label: 'grapemoji',
    selected: false,
    items: values(emoji.getCustom()),
    itemNames: [],
  })
}

export function getSections(search, facet = 'emoticons') {
  let ret = allSections

  if (search && facet === 'search') {
    ret = ret.map(section => {
      const items = section.items.filter(item => {
        if (item.name.indexOf(search) >= 0) return true
        const metaItem = EMOJI_META_MAP[item.name]
        if (!metaItem) return false
        return metaItem.aliases.some(alias => alias.indexOf(search) >= 0)
      })
      if (items.length) return { ...section, items }
      return null
    })
    ret = compact(ret)
  }

  if (ret.length) {
    if (facet) {
      const section = find(ret, ({ id }) => id === facet)
      if (section) ret = [section]
    }
    if (ret[0].items.length) setFocusedItem(ret, ret[0].items[0].id)
  }

  return ret
}

export function getSection(sections, facet) {
  const section = find(sections, ({ id }) => id === facet)
  if (section) setFocusedItem([section], section.items[0].id)
  return section
}

export function getTabs({ hasSearch, selected, orgLogo }) {
  if (!allSections.length) return []

  const sections = [...allSections]

  if (hasSearch) sections.unshift({ id: 'search' })

  const tabs = sections.map(({ id }) => {
    const iconId = EMOJI_CATEGORY_ICON[id]
    let style

    if (iconId === 'grapemoji') {
      style = {
        backgroundImage: `url(${orgLogo})`,
        ...itemStyle.TAB_ICON,
      }
    } else {
      const smiley = emoji.get(iconId)
      style = { ...emoji.getSliceStyle(smiley.id), ...itemStyle.TAB_ICON }
    }

    const icon = <Icon style={style} />
    return { id, selected: false, icon }
  })

  let tab
  if (selected) tab = find(tabs, ({ id }) => id === selected)
  else tab = tabs[0]
  tab.selected = true

  return tabs
}
