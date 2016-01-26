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
      focusedItem: this.props.items[0]
    }
  }

  componentDidMount() {
    if (this.props.focused) this.refs.filter.focus()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.filter) {
      this.setState({
        focusedItem: nextProps.items[0]
      })
    }
  }

  componentDidUpdate() {
    if (this.props.focused) this.refs.filter.focus()
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

  onFilterClick(e) {
    if (this.props.focused) this.refs.filter.focus()
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
        this.onSelectItem(this.state.focusedItem)
        e.preventDefault()
        break
      case 'backspace':
        this.deleteLastItem(e.target)
        break
      default:
    }
  }

  onFocusItem(item) {
    this.setState({
      focusedItem: item
    })
  }

  deleteLastItem(input) {
    const {selectionStart, selectionEnd} = input
    const {selected} = this.props
    const isStartPos = selectionStart === selectionEnd && selectionStart === 0
    if (!isStartPos || !selected.length) return

    this.props.onSelectedClick(selected[selected.length - 1])
  }

  onChange() {
    this.props.onChange(this.refs.filter.value)
  }

  clearFilter() {
    this.refs.filter.value = ''
    this.onChange()
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
    const {focusedItem} = this.state
    const {
      items,
      filter,
      renderNotFound,
      renderEmptyItems
    } = this.props

    if (!items.length) {
      return filter ? renderNotFound(filter) : renderEmptyItems()
    }

    return (
      <List
        items={items}
        renderItem={::this.renderItem}
        onFocus={::this.onFocusItem}
        onMouseOver={::this.onFocusItem}
        onSelect={::this.onSelectItem}
        focused={focusedItem}
        ref="list"/>
    )
  }

  renderInput() {
    const {sheet, focused, filter} = this.props
    if (!focused) return null

    return (
      <input
        ref="filter"
        className={sheet.classes.filter}
        onKeyDown={::this.onKeyDown}
        onChange={::this.onChange}
        value={filter} />
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
          {this.props.filter}
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
