import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {defineMessages, intlShape} from 'react-intl'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import moment from 'moment'

import DateSeparator from '../../message-parts/DateSeparator'
import {spacing} from '../sidebar-panel/theme'
import Label from './Label'

const messages = defineMessages({
  todo: {
    id: 'nlpLabelTodo',
    defaultMessage: 'Tasks',
    description: 'Sidebar todo label group headline'
  },
  question: {
    id: 'nlpLabelQuestion',
    defaultMessage: 'Questions',
    description: 'Sidebar question label group headline'
  }
})

const labelPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['todo', 'question']).isRequired,
  message: PropTypes.shape({
    time: PropTypes.instanceOf(Date).isRequired
  })
})

@injectSheet({
  row: {
    padding: [0, spacing]
  },
  type: {
    extend: [ellipsis, small],
    textTransform: 'uppercase',
    margin: [15, 0],
    fontWeight: 'bold'
  },
  separatorDate: {
    background: grayBlueLighter
  },
  label: {
    marginBottom: 15
  }
})
export default class Row extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    label: labelPropType.isRequired,
    prevLabel: labelPropType,
    style: PropTypes.object
  }

  static defaultProps = {
    style: null,
    prevLabel: null
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
      intl: {formatMessage},
      style
    } = this.props

    const showDateSeparator =
      !prevLabel ||
      !moment(label.message.time).isSame(prevLabel.message.time, 'day')

    const showType = !prevLabel || prevLabel.type !== label.type

    return (
      <div className={classes.row} style={style}>
        {showDateSeparator && (
          <DateSeparator
            theme={this.dateSeparatorTheme}
            date={label.message.time}
            key={`${label.id}-date`}
          />
        )}

        {showType && (
          <h2
            className={classes.type}
            style={{color: label.color}}
            key={`${label.id}-type`}
          >
            {messages[label.type] ? formatMessage(messages[label.type]) : label.type}
          </h2>
        )}

        <Label
          label={label}
          key={`${label.id}-label`}
          intl={intl}
          className={classes.label}
        />
      </div>
    )
  }
}
