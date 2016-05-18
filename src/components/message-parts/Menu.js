import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'
import {useSheet} from 'grape-web/lib/jss'

import styles from './MenuStyles'

@useSheet(styles)
export default class Menu extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired
  }

  static defaultProps = {
    onSelect: noop,
    items: ['edit', 'copyLink', 'remove']
  }

  render() {
    const {sheet, onSelect, items} = this.props
    const {classes} = sheet
    const singleClass = items.length === 1 ? classes.single : ''

    return (
      <div className={classes.menu}>
        {items.map(name => (
          <span
            className={`${classes[`item${capitalize(name)}`]} ${singleClass}`}
            onClick={onSelect.bind(null, {name})}
            key={name}></span>
        ))}
      </div>
    )
  }
}
