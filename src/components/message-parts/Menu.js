import React, {PureComponent, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import {styles, getWidth} from './menuTheme'

function getItemClassName(classes, name, index, total) {
  const classNames = [classes[`${name}Item`], classes.item]

  if (total === 1) {
    classNames.push(classes.singleItem)
  } else {
    if (index === 0) {
      classNames.push(classes.firstItem)
      if (total === 2) classNames.push(classes.nextToLastItem)
    }
    if (index === total - 1) classNames.push(classes.lastItem)
  }

  return classNames.join(' ')
}

function getMessage(name) {
  switch (name) {
    case 'edit':
      return (
        <FormattedMessage
          id="editMessage"
          defaultMessage="Edit message"/>
      )
    case 'copyLink':
      return (
        <FormattedMessage
          id="copyLink"
          defaultMessage="Copy link to message"/>
      )
    case 'remove':
      return (
        <FormattedMessage
          id="deleteMessage"
          defaultMessage="Delete message"/>
      )
    default:
  }
}

function getPosition(content, total) {
  const canFit = content.offsetWidth > getWidth(total)
  return canFit ? 'top' : 'right'
}

class MenuItem extends PureComponent {
  onSelect = () => {
    const {onSelect, name} = this.props
    onSelect({name})
  }

  render() {
    const {name, classes, index, total} = this.props
    return (
      <Tooltip
        key={name}
        placement="top"
        message={getMessage(name)}
        inline>
        <span
          className={getItemClassName(classes, name, index, total)}
          onClick={this.onSelect} />
      </Tooltip>
    )
  }
}

@injectSheet(styles)
export default class Menu extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired
  }

  static defaultProps = {
    onSelect: noop
  }

  render() {
    const {
      sheet: {classes},
      items,
      onSelect,
      getContentNode
    } = this.props

    const position = getPosition(getContentNode(), items.length)

    return (
      <div className={`${classes.menu} ${classes[position]}`}>
        {items.map((name, index) => (
          <MenuItem
            key={name}
            name={name}
            index={index}
            total={items.length}
            classes={classes}
            onSelect={onSelect} />
        ))}
      </div>
    )
  }
}
