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
      filtered: null,
      value: ''
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
    const {filter, ruler} = this.refs
    if (!this.refs.filter) return

    filter.style.width = `${ruler.offsetWidth + 5}px`
    filter.scrollIntoView()
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
      case 'backspace':
        this.deleteLastItem(e.target)
        break
      default:
    }
  }

  deleteLastItem(input) {
    const {selectionStart, selectionEnd} = input
    const {selected} = this.props
    const isStartPos = selectionStart === selectionEnd && selectionStart === 0
    if (!isStartPos || !selected.length) return

    this.props.onSelectedClick(selected[selected.length - 1])
  }

  onFilterChange() {
    const value = this.refs.filter.value.toLowerCase()

    if (!value) {
      this.setState({
        filtered: null,
        value: ''
      })
      return
    }

    const filtered = this.props.items
      .filter(this.props.filter.bind(null, value))
      .sort(this.props.sort.bind(null, value))

    this.setState({filtered, value})
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

  renderItem({item, focused}) {
    const {
      itemClassName,
      itemFocusedClassName,
      renderItem
    } = this.props

    return (
      <div
        className={itemClassName + (focused ? ` ${itemFocusedClassName}` : '')}>
        {renderItem(item, focused)}
      </div>
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

  renderInput() {
    if (!this.state.focused) return null

    return (
      <input
        ref="filter"
        className={this.props.sheet.classes.filter}
        onKeyDown={::this.onKeyDown}
        onChange={::this.onFilterChange} />
    )
  }

  renderFilter() {
    const {
      token,
      remove,
      selected,
      ruler,
      filterArea
    } = this.props.sheet.classes

    return (
      <div
        ref="filterArea"
        onClick={::this.onFilterClick}
        className={filterArea}>
        <ul className={selected}>
          {
            this.props.selected.map((item, i) => {
              return (
                <li
                  key={i}
                  className={token}
                  onClick={this.onSelectedClick.bind(this, item)}>
                  {this.props.renderSelected(item)}
                  <i
                    className={`${remove} mdi mdi-close-circle-outline`}></i>
                </li>
              )
            }, this)
          }
        </ul>
        {this.renderInput()}
        <span
          ref='ruler'
          className={ruler}
          ariaHidden>
          {this.state.value}
        </span>
      </div>
    )
  }

  render() {
    const {height} = this.props
    return (
      <div>
        {this.renderFilter()}
        {this.props.children}
        <div
          className={this.props.sheet.classes.list}
          style={{height}}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}
