import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

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

const messages = defineMessages({
  edit: {
    id: 'editMessage',
    defaultMessage: 'Edit message'
  },
  copyLink: {
    id: 'copyLink',
    defaultMessage: 'Copy link to message'
  },
  remove: {
    id: 'deleteMessage',
    defaultMessage: 'Delete message'
  }
})

@useSheet(styles)
@injectIntl
export default class Menu extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired
  }

  static defaultProps = {
    onSelect: noop,
    className: ''
  }

  render() {
    const {sheet, onSelect, items, className} = this.props
    const {formatMessage} = this.props.intl
    const {classes} = sheet
    return (
      <div className={`${classes.menu} ${className}`}>
        {items.map((name, i) => {
          return (
            <span
              className={getClassName(classes, name, i, items.length)}
              title={formatMessage(messages[name])}
              onClick={onSelect.bind(null, {name})}
              key={name} />
          )
        })}
      </div>
    )
  }
}
