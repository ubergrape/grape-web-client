import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import Divider from 'grape-web/lib/components/divider'
import MenuList from 'grape-web/lib/components/menu/menuList'
import injectSheet from 'grape-web/lib/jss'

import Popover from 'grape-web/lib/components/popover'
import PopoverItem from './PopoverItem'
import MenuItem from './MenuItem'

@injectSheet({
  list: {
    width: 230,
    padding: 0,
  },
})
export default class More extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    menuItems: PropTypes.array.isRequired,
    isPinned: PropTypes.bool,
    isDropdownOpened: PropTypes.bool,
  }

  static defaultProps = {
    isPinned: false,
    isDropdownOpened: false,
  }

  onRefMoreIcon = ref => {
    this.moreIconRef = findDOMNode(ref)
  }

  onRequestClose = () => {
    this.props.onSelect({ name: 'more' })
  }

  render() {
    const {
      classes,
      isPinned,
      isDropdownOpened,
      onSelect,
      items,
      menuItems,
    } = this.props

    return (
      <span>
        <MenuItem
          name="more"
          index={menuItems.length}
          total={menuItems.length + 1}
          onSelect={onSelect}
          onRefItem={this.onRefMoreIcon}
        />
        {isDropdownOpened && (
          <Popover
            anchorEl={this.moreIconRef}
            onRequestClose={this.onRequestClose}
            open
          >
            <MenuList className={classes.list}>
              {items.includes('copyLink') && (
                <PopoverItem
                  icon="iconLink"
                  name="copyLink"
                  onSelect={onSelect}
                />
              )}
              {items.includes('edit') && (
                <PopoverItem icon="pencil" name="edit" onSelect={onSelect} />
              )}
              {items.includes('quote') && (
                <PopoverItem icon="quote" name="quote" onSelect={onSelect} />
              )}
              {items.includes('pin') && (
                <PopoverItem
                  icon={isPinned ? 'unpin' : 'pin'}
                  name={isPinned ? 'unpin' : 'pin'}
                  onSelect={onSelect}
                />
              )}
              {items.includes('remove') && <Divider />}
              {items.includes('remove') && (
                <PopoverItem
                  icon="deleteMessage"
                  name="remove"
                  onSelect={onSelect}
                />
              )}
            </MenuList>
          </Popover>
        )}
      </span>
    )
  }
}
