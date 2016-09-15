import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import Tooltip from '../tooltip/HoverTooltip'
import {FormattedMessage} from 'react-intl'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './menuTheme'

function getClassName(classes, name, i, length) {
  const classNames = [classes[`${name}Item`], classes.item]

  if (length === 1) {
    classNames.push(classes.singleItem)
  } else {
    if (i === 0) {
      classNames.push(classes.firstItem)
      if (length === 2) classNames.push(classes.nextToLastItem)
    }
    if (i === length - 1) classNames.push(classes.lastItem)
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

@useSheet(styles)
export default class Menu extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired
  }

  static defaultProps = {
    onSelect: noop,
    className: ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {sheet, onSelect, items, className} = this.props
    const {classes} = sheet
    return (
      <div className={`${classes.menu} ${className}`}>
        {items.map((name, i) => {
          return (
            <Tooltip
              key={name}
              placement="top"
              message={getMessage(name)}>
                <span
                  className={getClassName(classes, name, i, items.length)}
                  onClick={onSelect.bind(null, {name})} />
            </Tooltip>
          )
        })}
      </div>
    )
  }
}
