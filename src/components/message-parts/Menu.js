import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'

import MenuItem from './MenuItem'
import {styles, getWidth} from './menuTheme'

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
            onSelect={onSelect}
          />
        ))}
      </div>
    )
  }
}
