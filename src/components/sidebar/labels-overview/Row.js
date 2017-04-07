import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {intlShape} from 'react-intl'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import moment from 'moment'

import DateSeparator from '../../message-parts/DateSeparator'
import {spacing} from '../sidebar-panel/theme'
import Label from './Label'

const labelPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  nameLocalized: PropTypes.string.isRequired,
  message: PropTypes.shape({
    time: PropTypes.instanceOf(Date).isRequired
  })
})

@injectSheet({
  separatorDate: {
    background: grayBlueLighter
  },
  label: {
    padding: [7, spacing]
  }
})
export default class Row extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    label: labelPropType.isRequired,
    prevLabel: labelPropType,
    style: PropTypes.object,
    user: PropTypes.object,
    onSelect: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    style: null,
    prevLabel: null,
    user: null,
    onSelect: null,
    className: null
  }

  dateSeparatorTheme = {
    date: this.props.classes.separatorDate
  }

  render() {
    const {
      classes,
      label,
      prevLabel,
      intl,
      style,
      user,
      onSelect,
      className
    } = this.props

    const showDateSeparator =
      !prevLabel ||
      !moment(label.message.time).isSame(prevLabel.message.time, 'day')

    return (
      <div style={style} className={className}>
        {showDateSeparator && (
          <DateSeparator
            theme={this.dateSeparatorTheme}
            date={label.message.time}
            key={`${label.id}-date`}
          />
        )}
        <Label
          label={label}
          key={`${label.id}-label`}
          intl={intl}
          className={classes.label}
          onSelect={onSelect}
          user={user}
        />
      </div>
    )
  }
}
