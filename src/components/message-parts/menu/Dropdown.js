import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Divider from 'material-ui/Divider'
import MenuList from 'material-ui/Menu/MenuList'
import injectSheet from 'grape-web/lib/jss'

import BaseDropdown from '../../dropdown/Dropdown'
import DropdownItem from './DropdownItem'
import MenuItem from './MenuItem'

@injectSheet({
  list: {
    width: 250,
    padding: 0
  }
})
export default class Dropdown extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    menuItems: PropTypes.array.isRequired,
    isPinned: PropTypes.bool,
    isDropdownOpened: PropTypes.bool
  }

  static defaultProps = {
    isPinned: false,
    isDropdownOpened: false
  }

  onRefMoreIcon = (ref) => {
    this.moreIconRef = ref
  }

  render() {
    const {
      classes,
      isPinned, isDropdownOpened,
      onSelect,
      items, menuItems
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
          <BaseDropdown
            target={this.moreIconRef}
            placement="top"
            container={this}
          >
            <MenuList className={classes.list}>
              <span>
                <DropdownItem
                  icon="link"
                  name="copyLink"
                  onSelect={onSelect}
                />
                {items.includes('edit') && (
                  <DropdownItem
                    icon="pencil"
                    name="edit"
                    onSelect={onSelect}
                  />
                )}
                {items.includes('quote') && (
                  <DropdownItem
                    icon="quote"
                    name="quote"
                    onSelect={onSelect}
                  />
                )}
                <DropdownItem
                  icon={isPinned ? 'unpin' : 'pin'}
                  name={isPinned ? 'unpin' : 'pin'}
                  onSelect={onSelect}
                />
                {items.includes('remove') && <Divider />}
                {items.includes('remove') && (
                  <DropdownItem
                    icon="deleteMessage"
                    name="remove"
                    onSelect={onSelect}
                  />
                )}
              </span>
            </MenuList>
          </BaseDropdown>
        )}
      </span>
    )
  }
}
