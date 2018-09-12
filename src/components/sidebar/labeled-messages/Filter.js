import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import webColors from 'grape-theme/dist/web-colors'
import noop from 'lodash/noop'

import FilterButton from './FilterButton'

@injectSheet({
  filter: {
    padding: 15,
    textAlign: 'center',
    borderBottom: [1, 'solid', webColors.borderDefault],
  },
})
export default class Filter extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    selected: PropTypes.string,
    items: PropTypes.array,
  }

  static defaultProps = {
    items: [],
    selected: null,
    onSelect: noop,
  }

  render() {
    const { classes, items, selected, onSelect } = this.props

    return (
      <div className={classes.filter}>
        {items.map(item => (
          <FilterButton
            {...item}
            key={item.name}
            isSelected={selected === item.name}
            onClick={onSelect}
          />
        ))}
      </div>
    )
  }
}
