import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'

import Dropdown from './Dropdown'
import MenuItem from './MenuItem'
import {
  fontSize,
  borderSize,
  padding,
  firstLastPadding
} from './constants'

const getWidth = (total) => {
  const itemWidth = fontSize + (borderSize * 2) + (padding * 2)
  if (total === 1) return itemWidth

  const itemsWidth = (total - 2) * itemWidth
  const firstLastItemsWidth = fontSize + borderSize + firstLastPadding + padding
  return (firstLastItemsWidth * 2) + (itemsWidth > 0 ? itemsWidth : 0)
}

const getPosition = (content, total) => {
  const canFit = content.offsetWidth > getWidth(total)
  return canFit ? 'top' : 'right'
}

@injectSheet({
  root: {
    whiteSpace: 'nowrap'
  },
  top: {
    position: 'absolute',
    top: -13,
    right: 15
  },
  right: {
    position: 'absolute',
    top: 1,
    left: `calc(100% + ${firstLastPadding}px)`
  }
})
export default class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    getContentNode: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    dropdown: PropTypes.bool
  }

  static defaultProps = {
    dropdown: false,
    onSelect: noop
  }

  render() {
    const {
      classes,
      items,
      getContentNode,
      dropdown,
      onSelect,
      ...dropdownProps
    } = this.props

    const menuItems = items.slice(0, dropdown ? 2 : 3)
    const position = getPosition(getContentNode(), menuItems.length)

    return (
      <div className={`${classes.root} ${classes[position]}`}>
        {menuItems.map((name, index) => (
          <MenuItem
            name={name}
            index={index}
            total={menuItems.length + (dropdown ? 1 : 0)}
            onSelect={onSelect}
            key={name}
          />
        ))}
        {dropdown && (
          <Dropdown
            {...dropdownProps}
            onSelect={onSelect}
            items={items}
            menuItems={menuItems}
          />
        )}
      </div>
    )
  }
}
