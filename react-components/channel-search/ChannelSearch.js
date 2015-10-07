import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import mousetrap from 'mousetrap'
import noop from 'lodash/utility/noop'

import Datalist from '../datalist/Datalist'
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
    shortcuts: ['command+k', 'ctrl+k'],
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
    mousetrap.bind(props.shortcuts, ::this.onShow)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    this.setState(this.createState(nextProps), ::this.focus)
  }

  render() {
    let {classes} = this.props.sheet
    return (
      <Dialog
        show={this.state.show}
        onHide={this.props.onHide}
        title="Jump to a conversation">
        <div className={classes.content}>
          <input
            className={classes.input}
            onChange={::this.onInput}
            type="text"
            ref="input" />
          {this.renderItemsOrFallback()}
        </div>
      </Dialog>
    )
  }

  renderItemsOrFallback() {
    let {classes} = this.props.sheet

    if (this.state.items.length) {
      return <Datalist
        items={this.state.items}
        className={classes.datalist}
        renderItem={::this.renderItem} />
    }

    return (
      <div className={classes.fallback}>
        <h3 className={classes.fallbackHeadline}>
          There's nothing that matches <b>{this.state.search}</b>.
        </h3>
        <button
          onClick={::this.onCreate}
          className={classes.button}>
            Manage rooms
        </button>
      </div>
    )
  }

  renderItem(item, props, state) {
    let {classes} = this.props.sheet
    return (
      <div
        {...props}
        className={classes.item}
        onClick={this.onSelect.bind(this, item)}>
        {item.name}
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

  focus() {
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

  onSelect(item) {
    this.props.onSelect(item)
  }

  onCreate() {
    this.props.onCreate({name: this.state.search})
  }

  onShow() {
    this.props.onShow()
  }
}
