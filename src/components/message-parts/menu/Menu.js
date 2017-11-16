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

const toggleDropdown = state => ({showDropdown: !state.showDropdown})

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
    isPinned: PropTypes.array
  }

  static defaultProps = {
    isPinned: false,
    onSelect: noop
  }

  state = {showDropdown: false}

  onRefMoreIcon = (ref) => {
    this.moreIconRef = ref
  }

  onSelect = ({name}) => {
    if (name === 'more') {
      this.setState(toggleDropdown)
      return
    }

    this.props.onSelect({name})
  }

  onSelectFromDropdown = (data) => {
    this.setState({showDropdown: false})
    this.props.onSelect(data)
  }

  render() {
    const {
      classes,
      items,
      getContentNode,
      isPinned
    } = this.props
    const {showDropdown} = this.state

    const position = getPosition(getContentNode(), items.length)

    return (
      <div className={`${classes.root} ${classes[position]}`}>
        {items.map((name, index) => (
          <span key={name}>
            <MenuItem
              name={name}
              index={index}
              total={items.length}
              onSelect={this.onSelect}
              onRefItem={this.onRefMoreIcon}
            />
            {showDropdown && name === 'more' && (
              <Dropdown
                target={this.moreIconRef}
                placement="top"
                container={this}
              >
                <MenuList className={classes.dropdownList}>
                  <DropdownItem
                    icon="pencil"
                    name="edit"
                    onSelect={this.onSelectFromDropdown}
                  />
                  <DropdownItem
                    icon="link"
                    name="copyLink"
                    onSelect={this.onSelectFromDropdown}
                  />
                  <DropdownItem
                    icon={isPinned ? 'unpin' : 'pin'}
                    name={isPinned ? 'unpin' : 'pin'}
                    onSelect={this.onSelectFromDropdown}
                  />
                  <Divider />
                  <DropdownItem
                    icon="deleteMessage"
                    name="remove"
                    onSelect={this.onSelectFromDropdown}
                  />
                </MenuList>
              </Dropdown>
            )}
          </span>
        ))}
      </div>
    )
  }
}
