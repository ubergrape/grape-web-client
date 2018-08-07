import PropTypes from 'prop-types'
import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import List from 'react-finite-list'
import keyname from 'keyname'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'

import TagsInput from '../tags-input/TagsInput'

class FilterableList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isFilterFocused: PropTypes.bool.isRequired,
    listClassName: PropTypes.string,
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    filter: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    onRemoveSelected: PropTypes.func,
    onChange: PropTypes.func,
    renderItem: PropTypes.func,
    renderSelected: PropTypes.func,
    renderNotFound: PropTypes.func,
    renderEmptyItems: PropTypes.func,
    children: PropTypes.element,
  }

  static defaultProps = {
    listClassName: undefined,
    placeholder: undefined,
    children: null,
    onSelect: noop,
    onClick: noop,
    onRemoveSelected: noop,
    onChange: noop,
    renderItem: noop,
    renderSelected: noop,
    renderNotFound: noop,
    renderEmptyItems: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      focusedItem: this.props.items[0],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      focusedItem: nextProps.items[0],
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // This check need to be sure, that list will not be updated if
    // (focus, selected items or focused item) will changed to different input.
    // Also, one more case there. Let's assume, that list of items didn't
    // changed, and focus placed to another input. So, in the next line this
    // function will return false, because list didn't change, and as a result
    // focus will not change to another input.
    if (
      nextProps.isFilterFocused !== this.props.isFilterFocused ||
      nextState.focusedItem !== this.state.focusedItem ||
      nextProps.selected !== this.props.selected
    )
      return true
    if (isEqual(nextProps.items, this.props.items)) return false
    return true
  }

  onSelectItem = item => {
    this.clearFilter()
    this.props.onSelect(item)
  }

  onKeyDown = e => {
    switch (keyname(e.keyCode)) {
      case 'up':
        this.list.focus('prev')
        e.preventDefault()
        break
      case 'down':
        this.list.focus('next')
        e.preventDefault()
        break
      case 'enter': {
        const { focusedItem } = this.state
        if (!focusedItem) return
        this.onSelectItem(focusedItem)
        e.preventDefault()
        break
      }
      default:
    }
  }

  onFocusItem = item => {
    this.setState({
      focusedItem: item,
    })
  }

  onRefList = ref => {
    this.list = ref
  }

  clearFilter() {
    this.props.onChange('')
  }

  shouldFocusFilter() {
    if (!this.props.isFilterFocused) return false
    return true
  }

  renderList() {
    const {
      items,
      filter,
      selected,
      renderItem,
      renderNotFound,
      renderEmptyItems,
    } = this.props

    if (!items.length) {
      if (filter) return renderNotFound()
      if (selected.length) return null

      return renderEmptyItems()
    }

    const { focusedItem } = this.state
    return (
      <List
        ref={this.onRefList}
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
      classes,
      children,
      selected,
      filter,
      placeholder,
      onChange,
      onClick,
      renderSelected,
      onRemoveSelected,
    } = this.props

    return (
      <button className={classes.listWrapper} onClick={onClick}>
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
        <div className={classes.list}>{this.renderList()}</div>
      </button>
    )
  }
}

export default injectSheet({
  listWrapper: {
    background: 'none',
    width: '100%',
  },
  list: {
    display: 'block',
    marginTop: 20,
  },
})(FilterableList)
