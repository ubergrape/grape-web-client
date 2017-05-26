import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import List from 'react-finite-list'
import keyname from 'keyname'

import {styles} from './theme'
import TagsInput from '../tags-input/TagsInput'

@injectSheet(styles)
export default class FilterableList extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    isFilterFocused: PropTypes.bool.isRequired,
    listClassName: PropTypes.string,
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    filter: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onRemoveSelected: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    renderSelected: PropTypes.func.isRequired,
    renderNotFound: PropTypes.func.isRequired,
    renderEmptyItems: PropTypes.func.isRequired,
    children: PropTypes.element
  }

  static defaultProps = {
    isFilterFocused: true
  }

  constructor(props) {
    super(props)
    this.state = {
      focusedItem: this.props.items[0]
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      focusedItem: nextProps.items[0]
    })
  }

  onSelectItem = (item) => {
    this.clearFilter()
    this.props.onSelect(item)
  }

  onKeyDown = (e) => {
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
        const {focusedItem} = this.state
        if (!focusedItem) return
        this.onSelectItem(focusedItem)
        e.preventDefault()
        break
      default:
    }
  }

  onFocusItem = (item) => {
    this.setState({
      focusedItem: item
    })
  }

  clearFilter() {
    this.props.onChange('')
  }

  shouldFocusFilter() {
    const {items, selected, filter, isFilterFocused} = this.props
    if (!isFilterFocused) return false
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
      if (filter) return renderNotFound()
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
        onFocus={this.onFocusItem}
        onMouseOver={this.onFocusItem}
        onSelect={this.onSelectItem}
        focused={focusedItem}
      />
    )
  }

  render() {
    const {
      sheet: {classes},
      children,
      selected,
      filter,
      placeholder,
      onChange,
      onClick,
      renderSelected,
      onRemoveSelected
    } = this.props

    return (
      <div onClick={onClick}>
        <TagsInput
          onKeyDown={this.onKeyDown}
          onChange={onChange}
          deleteTag={onRemoveSelected}
          list={selected}
          value={filter}
          placeholder={placeholder}
          focused={this.shouldFocusFilter()}
          renderTag={renderSelected}
          className={classes.filterArea}
        />
        {children}
        <div
          className={classes.list}
        >
          {this.renderList()}
        </div>
      </div>
    )
  }
}
