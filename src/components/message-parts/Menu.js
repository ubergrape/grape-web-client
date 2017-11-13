import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import Divider from 'material-ui/Divider'
import MenuList from 'material-ui/Menu/MenuList'
import injectSheet from 'grape-web/lib/jss'

import MenuItem from './MenuItem'
import Dropdown from '../dropdown/Dropdown'
import {styles, getWidth} from './menuTheme'
import {
  EditMessage,
  CopyMessageLink,
  PinMessage,
  DeleteMessage
} from './MenuItems'

function getPosition(content, total) {
  const canFit = content.offsetWidth > getWidth(total)
  return canFit ? 'top' : 'right'
}

@injectSheet(styles)
export default class Menu extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    getContentNode: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired,
    showMenuDropdown: PropTypes.bool.isRequired
  }

  static defaultProps = {
    onSelect: noop
  }

  onMenuItemRef = (ref) => {
    this.menuItemRef = ref
  }

  render() {
    const {
      sheet: {classes},
      items,
      onSelect,
      getContentNode,
      onEdit,
      onRemove,
      onCopyLink,
      showMenuDropdown
    } = this.props

    let key = 0

    const position = getPosition(getContentNode(), items.length)
    const menuItems = [
      <EditMessage onClick={onEdit} key={++key} />,
      <CopyMessageLink onClick={onCopyLink} key={++key} />,
      <PinMessage key={++key} />,
      <Divider key={++key} />,
      <DeleteMessage onClick={onRemove} key={++key} />
    ]

    return (
      <div
        className={`${classes.menu} ${classes[position]}`}
        ref={(input) => { this.onMenuItemRef(input) }}
      >
        {items.map((name, index) => (
          <span key={name}>
            <MenuItem
              name={name}
              index={index}
              total={items.length}
              classes={classes}
              onSelect={onSelect}
            />
            {showMenuDropdown && name === 'more' &&
              <Dropdown
                target={this.menuItemRef}
                placement="bottom"
                container={this}
              >
                <MenuList>
                  {menuItems}
                </MenuList>
              </Dropdown>
            }
          </span>
        ))}
      </div>
    )
  }
}
