import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import List from 'react-finite-list'
import Dialog from '../dialog/Dialog'

import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import keyname from 'keyname'

import style from './style'
import {useSheet} from '../jss'

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
export default class ChannelSearch extends Component {

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

  render() {
    let {classes} = this.props.sheet
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

  renderItems() {
    let {classes} = this.props.sheet

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
    let {classes} = this.props.sheet

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
    let {classes} = this.props.sheet
    let itemClasses = [classes.item]
    if (focused) itemClasses.push(classes.itemFocused)

    let icon
    if (item.type === 'room') {
      icon = (
        <span
          className={classes.itemRoomIcon}
          style={{backgroundColor: item.color}}>
          {item.abbr}
        </span>
      )
    }
    else {
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

  focus() {
    let {input} = this.refs
    if (input) input.focus()
  }

  onInput(e) {
    let {value} = e.target

    this.props.channelSearchInput(
      value,
      this.props.org,
      this.props.user
    )
  }

  onKeyDown(e) {
    let {list} = this.refs
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
    this.props.channelSearchSelect(channel)
  }

  onCreate() {
    this.props.showRoomManager()
  }

  onShortcut(e) {
    e.preventDefault()
    this.onShow()
  }

  onHide() {
    this.props.channelSearchHide()
  }

  onShow() {
    this.props.channelSearchShow(this.props.org, this.props.user)
  }
}
