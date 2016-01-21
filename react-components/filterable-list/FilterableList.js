import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import List from 'react-finite-list'
import keyname from 'keyname'

@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: Boolean(this.props.items.length),
      filtered: null
    }
  }

  componentDidMount() {
    if (this.state.focused) this.refs.filter.focus()
  }


  componentWillReceiveProps(nexProps) {
    this.setState({
      focused: this.shouldInputFocus(nexProps)
    })
  }

  componentDidUpdate() {
    if (this.state.focused) this.refs.filter.focus()
  }

  onSelectItem(item) {
    this.clearFilter()
    this.props.onSelect(item)
  }

  onSelectedClick(item) {
    this.props.onSelectedClick(item)
  }

  onFilterClick() {
    this.setState({
      focused: this.shouldInputFocus(this.props)
    })
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
        this.onSelectItem(list.state.focused)
        e.preventDefault()
        break
      default:
    }
  }

  onFilterChange() {
    const value = this.refs.filter.value.toLowerCase()

    if (!value) {
      this.setState({
        filtered: null
      })
      return
    }

    const filtered = this.props.items
      .filter(this.props.filter.bind(null, value))
      .sort(this.props.sort.bind(null, value))

    this.setState({filtered})
  }

  shouldInputFocus({items}) {
    const itemsLength = items.length
    const {filtered} = this.state
    const filteredLength = filtered && filtered.length || 0

    return itemsLength && itemsLength > filteredLength
  }

  clearFilter() {
    this.refs.filter.value = ''
    this.onFilterChange()
  }

  renderInput() {
    if (!this.state.focused) return null

    return (
      <input
        ref="filter"
        onKeyDown={::this.onKeyDown}
        onChange={::this.onFilterChange} />
    )
  }

  renderItem({item, focused}) {
    return (
      <div style={focused ? {border: '1px solid red'} : null}>{item.render}</div>
    )
  }

  renderList() {
    const {filtered} = this.state
    const {items} = this.props

    if (filtered && !filtered.length) {
      return this.props.renderNotFound(this.refs.filter.value)
    }

    if (!items.length) {
      return this.props.renderEmptyItems()
    }

    return (
      <List
        items={filtered || items}
        renderItem={::this.renderItem}
        onSelect={::this.onSelectItem}
        ref="list"/>
    )
  }

  renderFilter() {
    const {token, remove} = this.props.sheet.classes
    return (
      <div onClick={::this.onFilterClick}>
        <ul>
          {
            this.props.selected.map((item, i) => {
              return (
                <li
                  key={i}
                  className={token}
                  onClick={this.onSelectedClick.bind(this, item)}>
                  {item.render}
                  <i
                    className={`${remove} mdi mdi-close-circle-outline`}></i>
                </li>
              )
            }, this)
          }
        </ul>
        {this.renderInput()}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderFilter()}
        {this.props.children}
        {this.renderList()}
      </div>
    )
  }
}
