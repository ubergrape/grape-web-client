import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

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
    items: ['edit', 'copyLink', 'remove'],
    className: ''
  }

  render() {
    const {sheet, onSelect, items, className} = this.props
    const {classes} = sheet

    return (
      <div className={`${classes.menu} ${className}`}>
        {items.map((name, i) => {
          return (
            <span
              className={getClassName(classes, name, i, items.length)}
              onClick={onSelect.bind(null, {name})}
              key={name} />
          )
        })}
      </div>
    )
  }
}
