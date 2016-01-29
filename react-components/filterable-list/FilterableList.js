import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

import List from 'react-finite-list'
import keyname from 'keyname'

@useSheet(style)
export default class FilterableList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    listClassName: PropTypes.string,
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    filter: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemoveSelected: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    renderSelected: PropTypes.func.isRequired,
    renderNotFound: PropTypes.func.isRequired,
    renderEmptyItems: PropTypes.func.isRequired,
    children: PropTypes.element
  }

  constructor(props) {
    super(props)
    this.state = {
      focusedItem: this.props.items[0]
    }
  }

  componentDidMount() {
    if (this.shouldFocusFilter()) this.refs.filter.focus()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      focusedItem: nextProps.items[0]
    })
  }

  componentDidUpdate() {
    const {filter, ruler} = this.refs
    if (!filter) return
    if (this.shouldFocusFilter()) filter.focus()

    // Input can hide last/first few pixels of font
    // that will don't be hidden in regular span (which is `ruler`)
    // http://s.codepen.io/tyv/debug/pgKJLK
    // http://codepen.io/tyv/pen/pgKJLK
    filter.style.width = `${ruler.offsetWidth + 5}px`
    filter.scrollIntoView()
  }

  onSelectItem(item) {
    this.clearFilter()
    this.props.onSelect(item)
  }

  onSelectedClick(item) {
    this.props.onRemoveSelected(item)
  }

  onClick() {
    if (this.shouldFocusFilter()) this.refs.filter.focus()
  }

  onKeyDown(e) {
    const {list} = this.refs
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
        this.deleteLastItem()
        break
      default:
    }
  }

  onFocusItem(item) {
    this.setState({
      focusedItem: item
    })
  }

  onChange() {
    this.props.onChange(this.refs.filter.value)
  }

  deleteLastItem() {
    const {selected} = this.props
    if (!selected.length) return

    const {selectionStart, selectionEnd} = this.refs.filter
    const isStartPos = selectionStart + selectionEnd === 0
    if (!isStartPos) return

    this.props.onRemoveSelected(selected[selected.length - 1])
  }

  clearFilter() {
    this.props.onChange('')
  }

  shouldFocusFilter() {
    const {items, selected, filter} = this.props
    if (filter) return true

    return items.length + selected.length > 0
  }

  renderList() {
    const {
      items,
      filter,
      selected,
      renderItem,
      renderNotFound,
      renderEmptyItems
    } = this.props

    if (!items.length) {
      if (filter) return renderNotFound(filter)
      if (selected.length) return null

      return renderEmptyItems()
    }

    const {focusedItem} = this.state
    return (
      <List
        ref="list"
        className={this.props.listClassName}
        items={items}
        renderItem={renderItem}
        onFocus={::this.onFocusItem}
        onMouseOver={::this.onFocusItem}
        onSelect={::this.onSelectItem}
        focused={focusedItem} />
    )
  }

  renderInput() {
    if (!this.shouldFocusFilter()) return null

    const {sheet, filter} = this.props
    return (
      <input
        ref="filter"
        className={sheet.classes.filter}
        onKeyDown={::this.onKeyDown}
        onChange={::this.onChange}
        value={filter} />
    )
  }

  renderSelected() {
    const {selected, sheet} = this.props
    if (!selected.length) return null
    return selected.map((item, i) => {
      return (
        <button
          key={i}
          className={sheet.classes.token}
          onClick={this.onSelectedClick.bind(this, item)}>
          {this.props.renderSelected(item)}
        </button>
      )
    })
  }

  renderFilter() {
    const {
      ruler,
      filterArea
    } = this.props.sheet.classes

    return (
      <div
        className={filterArea}>
        {this.renderSelected()}
        {this.renderInput()}
        <span
          ref="ruler"
          className={ruler}
          ariaHidden>
          {this.props.filter}
        </span>
      </div>
    )
  }

  render() {
    const {children, sheet} = this.props
    return (
      <div
        onClick={::this.onClick}>
        {this.renderFilter()}
        {children}
        <div
          className={sheet.classes.list}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}
