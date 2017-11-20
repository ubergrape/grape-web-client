import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import Divider from 'material-ui/Divider'
import MenuList from 'material-ui/Menu/MenuList'
import injectSheet from 'grape-web/lib/jss'

import Dropdown from '../../dropdown/Dropdown'
import MenuItem from './MenuItem'
import DropdownItem from './DropdownItem'
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
  },
  dropdownList: {
    width: 200,
    padding: 0
  }
})
export default class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    getContentNode: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    isPinned: PropTypes.bool,
    isDropdownOpened: PropTypes.bool,
    quote: PropTypes.bool,
    edit: PropTypes.bool,
    remove: PropTypes.bool
  }

  static defaultProps = {
    isPinned: false,
    isDropdownOpened: false,
    quote: false,
    remove: false,
    edit: false,
    onSelect: noop
  }

  onRefMoreIcon = (ref) => {
    this.moreIconRef = ref
  }

  render() {
    const {
      classes,
      items,
      getContentNode,
      isPinned, isDropdownOpened,
      edit, remove, quote,
      onSelect
    } = this.props

    const position = getPosition(getContentNode(), items.length)

    return (
      <div className={`${classes.root} ${classes[position]}`}>
        {items.slice(0, 2).map((name, index) => (
          <MenuItem
            name={name}
            index={index}
            total={items.length + 1}
            onSelect={onSelect}
            key={name}
          />
        ))}
        <span>
          <MenuItem
            name="more"
            index={items.length}
            total={items.length + 1}
            onSelect={onSelect}
            onRefItem={this.onRefMoreIcon}
          />
          {isDropdownOpened && (
            <Dropdown
              target={this.moreIconRef}
              placement="top"
              container={this}
            >
              <MenuList className={classes.dropdownList}>
                <span>
                  {edit && (
                    <DropdownItem
                      icon="pencil"
                      name="edit"
                      onSelect={onSelect}
                    />
                  )}
                  {quote && (
                    <DropdownItem
                      icon="quote"
                      name="quote"
                      onSelect={onSelect}
                    />
                  )}
                  <DropdownItem
                    icon="link"
                    name="copyLink"
                    onSelect={onSelect}
                  />
                  <DropdownItem
                    icon={isPinned ? 'unpin' : 'pin'}
                    name={isPinned ? 'unpin' : 'pin'}
                    onSelect={onSelect}
                  />
                  {remove && <Divider />}
                  {remove && (
                    <DropdownItem
                      icon="deleteMessage"
                      name="remove"
                      onSelect={onSelect}
                    />
                  )}
                </span>
              </MenuList>
            </Dropdown>
          )}
        </span>
      </div>
    )
  }
}
