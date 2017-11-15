import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import Divider from 'material-ui/Divider'
import MenuList from 'material-ui/Menu/MenuList'
import injectSheet from 'grape-web/lib/jss'

import Dropdown from '../../dropdown/Dropdown'
import MenuItem from './MenuItem'
import DropdownItem from './DropdownItem'
import {styles, getWidth} from './menuTheme'

function getPosition(content, total) {
  const canFit = content.offsetWidth > getWidth(total)
  return canFit ? 'top' : 'right'
}

const toggleDropdown = state => ({showDropdown: !state.showDropdown})

@injectSheet(styles)
export default class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    getContentNode: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired
  }

  static defaultProps = {
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

  onEdit = () => {
    this.setState({showDropdown: false})
    this.props.onSelect({name: 'edit'})
  }

  onCopyLink = () => {
    this.setState({showDropdown: false})
    this.props.onSelect({name: 'copyLink'})
  }

  onRemove = () => {
    this.setState({showDropdown: false})
    this.props.onSelect({name: 'remove'})
  }

  onPin = () => {
    this.setState({showDropdown: false})
    this.props.onSelect({name: 'pin'})
  }

  render() {
    const {
      classes,
      items,
      getContentNode
    } = this.props
    const {showDropdown} = this.state

    const position = getPosition(getContentNode(), items.length)

    return (
      <div className={`${classes.menu} ${classes[position]}`}>
        {items.map((name, index) => (
          <span key={name}>
            <MenuItem
              name={name}
              index={index}
              total={items.length}
              classes={classes}
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
                    onClick={this.onEdit}
                  />
                  <DropdownItem
                    icon="link"
                    name="copyLink"
                    onClick={this.onCopyLink}
                  />
                  <DropdownItem
                    icon="pin"
                    name="pin"
                    onClick={this.onPin}
                  />
                  <Divider />
                  <DropdownItem
                    icon="deleteMessage"
                    name="remove"
                    onClick={this.onRemove}
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
