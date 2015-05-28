import * as emoji from './emoji'
import each from 'lodash-es/collection/each'
import {default as meta} from 'emojione/emoji.json'
import find from 'lodash-es/collection/find'

emoji.options.jsx = true

export function getSections() {
  let sections = []

  each(meta, (data, name) => {
    let section = find(sections, section => section.id == data.category)

    if (!section) {
      section = {
        id: data.category,
        label: data.category,
        items: [],
        selected: false
      }
      sections.push(section)
    }
    let item = emoji.get(name)
    if (item) section.items.push(item)
  })

  return sections
}

export function setSelectedSection() {

}

export function getSelectedSection() {

}

export function getTabs() {
  return [{
    label: 'Emoji',
    amount: Object.keys(meta).length,
    id: 1,
    selected: true
  }]
}

export function setSelectedTab() {

}

export function extractItems() {

}

export function setFocusedItemAt() {

}

export function getFocusedItemAt() {

}
