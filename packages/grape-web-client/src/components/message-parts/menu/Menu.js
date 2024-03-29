import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { zIndex } from '../../../utils/z-index'
import More from './More'
import MenuItem from './MenuItem'
import { fontSize, borderSize, padding, firstLastPadding } from './constants'

const getWidth = total => {
  const itemWidth = fontSize + borderSize * 2 + padding * 2
  if (total === 1) return itemWidth

  const itemsWidth = (total - 2) * itemWidth
  const firstLastItemsWidth = fontSize + borderSize + firstLastPadding + padding
  return firstLastItemsWidth * 2 + (itemsWidth > 0 ? itemsWidth : 0)
}

const getPosition = (contentNode, total) => {
  // 100 is rough tooltip width
  const canFit = contentNode.offsetWidth > getWidth(total) + 100
  return canFit ? 'top' : 'right'
}

const styles = {
  root: {
    whiteSpace: 'nowrap',
    zIndex: zIndex('base'),
  },
  top: {
    position: 'absolute',
    top: -22,
    right: 15,
  },
  right: {
    position: 'absolute',
    top: -22,
    left: `calc(100% - ${firstLastPadding * 4}px)`,
  },
}

class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    getContentNode: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    showDropdown: PropTypes.bool,
    style: PropTypes.object,
    parent: PropTypes.object,
    scrollTop: PropTypes.number,
  }

  static defaultProps = {
    showDropdown: false,
    parent: undefined,
    style: undefined,
    scrollTop: undefined,
  }

  render() {
    const {
      classes,
      items,
      getContentNode,
      showDropdown,
      onSelect,
      style,
      parent,
      scrollTop,
      ...dropdownProps
    } = this.props

    const contentNode = getContentNode()

    if (!contentNode) return null

    const menuItems = items.slice(0, showDropdown ? 2 : 3)
    const position = getPosition(contentNode, menuItems.length)

    return (
      <div className={`${classes.root} ${classes[position]}`}>
        {menuItems.map((name, index) => (
          <MenuItem
            name={name}
            index={index}
            style={style}
            parent={parent}
            scrollTop={scrollTop}
            total={menuItems.length + (showDropdown ? 1 : 0)}
            onSelect={onSelect}
            key={name}
          />
        ))}
        {showDropdown && (
          <More
            {...dropdownProps}
            onSelect={onSelect}
            style={style}
            parent={parent}
            scrollTop={scrollTop}
            items={items}
            menuItems={menuItems}
          />
        )}
      </div>
    )
  }
}

export default injectSheet(styles)(Menu)
