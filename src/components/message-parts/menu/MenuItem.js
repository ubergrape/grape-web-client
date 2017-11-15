import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import Tooltip from '../../tooltip/HoverTooltip'
import * as messages from './messages'

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

export default class MenuItem extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onRefItem: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }

  onSelect = () => {
    const {onSelect, name} = this.props
    onSelect({name})
  }

  render() {
    const {name, classes, index, total, onRefItem} = this.props

    return (
      <Tooltip
        key={name}
        placement="top"
        message={messages[name]}
        inline
      >
        <span
          className={getItemClassName(classes, name, index, total)}
          onClick={this.onSelect}
          ref={onRefItem}
        />
      </Tooltip>
    )
  }
}
