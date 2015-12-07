import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import keyname from 'keyname'

import List from 'react-finite-list'
import Dialog from '../dialog/Dialog'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
export default class ChannelSearch extends Component {
  static propTypes = {
    shortcuts: PropTypes.array,
    sheet: PropTypes.object,
    show: PropTypes.bool,
    items: PropTypes.array,
    search: PropTypes.string,
    inputChannelSearch: PropTypes.func,
    showRoomManager: PropTypes.func,
    hideChannelSearch: PropTypes.func,
    showChannelSearch: PropTypes.func,
    selectChannelSearch: PropTypes.func,
    org: PropTypes.object,
    user: PropTypes.object
  }

  static defaultProps = {
    shortcuts: ['mod+k']
  }

  constructor(props) {
    super(props)
    mousetrap.bindGlobal(props.shortcuts, ::this.onShortcut)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidUpdate() {
    this.focus()
  }

  onInput(e) {
    const {value} = e.target

    this.props.inputChannelSearch(
      value,
      this.props.org,
      this.props.user
    )
  }

  onKeyDown(e) {
    const {list} = this.refs
    if (!list) return
    switch (keyname(e.keyCode)) {
      case 'up':
        list.focus('prev')
        e.preventDefault()
        break
      case 'down':
        list.focus('next')
        e.preventDefault()
        break
      case 'enter':
        this.onSelect(list.state.focused)
        e.preventDefault()
        break
      default:
    }
  }

  onSelect(channel) {
    this.props.selectChannelSearch(channel)
  }

  onCreate() {
    this.props.showRoomManager()
  }

  onShortcut(e) {
    if (e.preventDefault) e.preventDefault()
    this.onShow()
  }

  onHide() {
    this.props.hideChannelSearch()
  }

  onShow() {
    this.props.showChannelSearch(this.props.org, this.props.user)
  }

  focus() {
    const {input} = this.refs
    if (input) input.focus()
  }

  renderItems() {
    const {classes} = this.props.sheet

    return (
      <List
        items={this.props.items}
        className={classes.list}
        renderItem={::this.renderItem}
        onSelect={::this.onSelect}
        ref="list"/>
    )
  }

  renderFallback() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.fallback}>
        <h3 className={classes.fallbackHeadline}>
          There&apos;s nothing that matches <b>{this.props.search}</b>.
        </h3>
        <button
          onClick={::this.onCreate}
          className={classes.button}>
          Manage rooms
        </button>
      </div>
    )
  }

  renderItem({item, focused}) {
    const {classes} = this.props.sheet
    const itemClasses = [classes.item, focused ? classes.itemFocused : null]

    let icon
    if (item.type === 'room') {
      icon = (
        <span
          className={classes.itemRoomIcon}
          style={{backgroundColor: item.color}}>
          {item.abbr}
        </span>
      )
    } else {
      icon = (
        <span
          style={{backgroundImage: `url(${item.iconUrl})`}}
          className={classes.itemUserIcon} />
      )
    }

    return (
      <div className={itemClasses.join(' ')}>
        {icon}
        <span className={classes.itemText}>{item.name}</span>
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <Dialog
        show={this.props.show}
        onHide={::this.onHide}
        title="Jump to a conversation">
        <div className={classes.content}>
          <input
            className={classes.input}
            onChange={::this.onInput}
            onKeyDown={::this.onKeyDown}
            type="text"
            ref="input" />
          {this.props.items.length ? this.renderItems() : this.renderFallback()}
        </div>
      </Dialog>
    )
  }
}
