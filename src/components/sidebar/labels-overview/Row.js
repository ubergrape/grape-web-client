import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {defineMessages, intlShape} from 'react-intl'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import {small} from 'grape-theme/dist/fonts'
import moment from 'moment'

import Label from './Label'
import DateSeparator from '../../message-parts/DateSeparator'

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
  name: PropTypes.oneOf(['todo', 'question']).isRequired,
  message: PropTypes.shape({
    time: PropTypes.instanceOf(Date).isRequired
  })
})

@injectSheet({
  row: {
    padding: 20
  },
  name: {
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

    const showName = !prevLabel || prevLabel.name !== label.name

    return (
      <div className={classes.row} style={style}>
        {showDateSeparator && (
          <DateSeparator
            theme={this.dateSeparatorTheme}
            date={label.message.time}
            key={`${label.id}-date`}
          />
        )}

        {showName && (
          <h2
            className={classes.name}
            style={{color: label.color}}
            key={`${label.id}-name`}
          >
            {formatMessage(messages[label.name])}
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
