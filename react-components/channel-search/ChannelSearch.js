import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import noop from 'lodash/utility/noop'
import keyname from 'keyname'

import List from 'react-finite-list'
import Dialog from '../dialog/Dialog'
import {useSheet} from '../jss'
import style from './style'
import * as utils from './utils'

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
export default class ChannelSearch extends Component {
  static defaultProps = {
    shortcuts: ['mod+k'],
    show: false,
    items: [],
    onSelect: noop,
    onCreate: noop,
    onShow: noop,
    onHide: noop
  }

  constructor(props) {
    super(props)
    this.state = this.createState(props)
    mousetrap.bindGlobal(props.shortcuts, ::this.onShortcut)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps), ::this.focus)
  }

  render() {
    let {classes} = this.props.sheet
    return (
      <Dialog
        show={this.state.show}
        onHide={::this.onHide}
        title="Jump to a conversation">
        <div className={classes.content}>
          <input
            className={classes.input}
            onChange={::this.onInput}
            onKeyDown={::this.onKeyDown}
            type="text"
            ref="input" />
          {this.state.items.length ? this.renderItems() : this.renderFallback()}
        </div>
      </Dialog>
    )
  }

  renderItems() {
    let {classes} = this.props.sheet

    return (
      <List
        items={this.state.items}
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
          There&apos;s nothing that matches <b>{this.state.search}</b>.
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
    if (item.isRoom) {
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

  createState(props) {
    let search = this.state ? this.state.search : ''
    return {
      show: props.show,
      search,
      items: utils.getItems(props.items, search)
    }
  }

  focus() {
    let {input} = this.refs
    if (input) React.findDOMNode(input).focus()
  }

  onInput(e) {
    let {value} = e.target
    this.setState({
      search: value,
      items: utils.getItems(this.props.items, value)
    })
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

  onSelect(item) {
    this.onBeforeHide(this.props.onSelect.bind(null, item))
  }

  onCreate() {
    let name = this.state.search
    this.onBeforeHide(this.props.onCreate.bind(null, {name}))
  }

  onShortcut(e) {
    e.preventDefault()
    this.props.onShow()
  }

  onHide() {
    this.onBeforeHide(this.props.onHide)
  }

  onBeforeHide(callback) {
    this.setState({search: ''}, callback)
  }
}
