import React, {PropTypes, Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from './actions'

import List from 'react-finite-list'
import Dialog from '../dialog/Dialog'

import * as utils from './utils'

import mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import keyname from 'keyname'
import page from 'page'

import style from './style'
import {useSheet} from '../jss'

import pick from 'lodash/object/pick'


/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
class ChannelSearch extends Component {

  static defaultProps = {
    shortcuts: ['mod+k']
  }

  static propTypes = {
    emitter: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    mousetrap.bindGlobal(props.shortcuts, ::this.onShortcut)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillMount() {
    this.actions = bindActionCreators(actions, this.props.dispatch)
  }

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

    this.actions.input(
      value,
      utils.find(this.getFileteredItems(), value)
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

  onSelect(item) {
    page('/chat/' + item.slug)
    this.onHide()
  }

  onCreate() {
    this.onHide()
    this.props.emitter.emit('triggerRoomManager')
  }

  onShortcut(e) {
    e.preventDefault()
    this.onShow()
  }

  onHide() {
    this.actions.hide()
  }

  onShow() {
    this.actions.show(this.getFileteredItems())
  }

  getFileteredItems() {
    return this.filterItem(
      this.getItems(this.props.emitter.org),
      this.props.emitter.user
    )
  }

  getItems(org) {
    let users = org.users.filter(({active}) => active)
    users = users.map(({id, slug, displayName, avatar}) => {
      return {
        id,
        slug,
        type: 'user',
        name: displayName,
        iconUrl: avatar
      }
    })
    let rooms = org.rooms.filter(({joined}) => joined)
    rooms = rooms.map(room => {
      let item = pick(room, 'id', 'name', 'slug', 'color', 'abbr')
      item.type = 'room'
      return item
    })
    return [...users, ...rooms]
  }

  filterItem(items, user) {
    return items.filter(({id}) => id !== user.id)
  }
}

// TODO: possibly use 'reselect': https://github.com/faassen/reselect
function select(state) {
  // in future: use only needed fields from global app state
  return {...state}
}

export default connect(select)(ChannelSearch)
