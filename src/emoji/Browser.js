import React from 'react'
import useSheet from 'react-jss'
import findIndex from 'lodash-es/array/findIndex'
import pick from 'lodash-es/object/pick'
import assign from 'lodash-es/object/assign'
import dotpather from 'dotpather'

import style from '../components/browser/style'
import tabsWithControlsStyle from '../components/tabs/tabsWithControlsStyle'
import TabsWithControls from '../components/tabs/TabsWithControls'
import Grid from '../components/grid/Grid'
import Item from './item/Item'
import * as data from './data'
import * as emoji from './emoji'

let getEmojiSheet = dotpather('images.emojiSheet')

/**
 * Main emoji browser component.
 */
export default React.createClass({
  mixins: [useSheet(style)],

  getDefaultProps() {
    return {
      images: {},
      height: 400,
      maxWidth: 920,
      className: '',
      itemId: undefined,
      onSelectTab: undefined,
      onSelectItem: undefined,
      key: ''
    }
  },

  getInitialState() {
    return {
      tabs: [],
      sections: []
    }
  },

  componentWillReceiveProps(props) {
    let emojiSheet = getEmojiSheet(props)
    if (emojiSheet && emojiSheet !== getEmojiSheet(this.props)) {
      emoji.setSheet(emojiSheet)
    }

    this.setState({
      tabs: data.getTabs(),
      sections: data.getSections()
    })
  },

  /**
   * Select tab.
   *
   * @param {String} id can be item id or "prev" or "next"
   * @param {Object} [options]
   * @param {Function} [callback]
   */
  selectTab(id, options = {}, callback) {
    let {tabs} = this.state
    let currIndex = findIndex(tabs, tab => tab.selected)

    let newIndex
    let set = false

    if (id == 'next') {
      newIndex = currIndex + 1
      if (newIndex < tabs.length) {
        set = true
      }
    }
    else if (id == 'prev') {
      newIndex = currIndex - 1
      if (newIndex >= 0) {
        set = true
      }
    }
    else {
      newIndex = findIndex(tabs, tab => tab.id == id)
      set = true
    }

    if (set) {
      let {id} = tabs[newIndex]
      data.setSelectedTab(tabs, newIndex)
      let sections = data.getSections(this.props.data, id)
      data.setSelectedSection(sections, id)
      data.setFocusedItemAt(sections, id, 0)
      this.setState({tabs: tabs, sections: sections, itemId: id}, callback)
      if (!options.silent) this.props.onSelectTab({id: id})
    }
  },

  focusItem(id) {
    let {sections} = this.state
    let set = false

    if (id == 'next' || id == 'prev') {
      let selectedSection = data.getSelectedSection(sections)
      let items = selectedSection ? selectedSection.items : data.extractItems(sections)
      let focusedIndex = findIndex(items, item => item.focused)
      let newItem

      if (id == 'next') {
        newItem = items[focusedIndex + 1]
      }
      else if (id == 'prev') {
        newItem = items[focusedIndex - 1]
      }

      if (newItem) {
        id = newItem.id
        set = true
      }
    }
    else {
      set = true
    }

    if (set) {
      data.setFocusedItem(sections, id)
      this.setState({sections: sections})
    }
  },

  getFocusedItem() {

  },

  selectItem(id) {
    this.focusItem(id)
    this.props.onSelectItem(this.getFocusedItem())
  },

  render() {
    let {classes} = this.sheet
    let props = pick(this.props, 'images')

    assign(props, {
      data: this.state.sections,
      Item: Item,
      focusedItem: this.getFocusedItem(),
      height: this.props.height - tabsWithControlsStyle.container.height,
      onFocus: this.onFocusItem,
      onSelect: this.onSelectItem
    })

    let style = {
      height: `${this.props.height}px`,
      maxWidth: this.props.maxWidth
    }

    return (
      <div
        className={`${classes.browser} ${this.props.className}`}
        style={style}
        onMouseDown={this.onMouseDown}>
        <TabsWithControls data={this.state.tabs} onSelect={this.onSelectTab} />
        <div className={classes.column}>
          <div className={classes.row}>
            <Grid {...props} className={classes.leftColumn} />
          </div>
        </div>
      </div>
    )
  },

  onFocusItem(data) {
    this.focusItem(data.id)
  },

  onSelectItem(data) {
    this.selectItem(data.id)
  },

  onSelectTab(data, callback) {
    this.selectTab(data.id, {}, callback)
  },

  onMouseDown(e) {
    // Important!!!
    // Avoids loosing focus and though caret position in editable.
    e.preventDefault()
  }
})
