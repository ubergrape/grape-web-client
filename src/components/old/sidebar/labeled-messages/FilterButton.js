import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { blue, white } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import noop from 'lodash/noop'
import Chip from 'grape-web/lib/components/chip'

class FilterButton extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    nameLocalized: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    /* eslint-disable react/no-unused-prop-types */
    color: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    /* eslint-enable react/no-unused-prop-types */
  }

  static defaultProps = {
    onClick: noop,
    isSelected: false,
  }

  onClick = () => {
    const { onClick, name } = this.props
    onClick({ name })
  }

  render() {
    const { classes, nameLocalized } = this.props

    return (
      <Chip
        className={classes.chip}
        onClick={this.onClick}
        label={nameLocalized}
      />
    )
  }
}

export default injectSheet({
  chip: {
    extend: fonts.small,
    display: 'inline-block',
    background: ({ isSelected }) => (isSelected ? blue : white),
    color: ({ isSelected, color }) => (isSelected ? white : color),
    margin: {
      right: 5,
      bottom: 5,
    },
    '&:hover, &:focus': {
      isolate: false,
      color: white,
      background: blue,
    },
    padding: [3, 0],
  },
})(FilterButton)
