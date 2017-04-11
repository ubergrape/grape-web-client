import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {intlShape} from 'react-intl'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import moment from 'moment'

import DateSeparator from '../../message-parts/DateSeparator'
import {spacing} from '../sidebar-panel/theme'
import Message from './Message'

const messagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  time: PropTypes.instanceOf(Date).isRequired
})

@injectSheet({
  separatorDate: {
    background: grayBlueLighter
  },
  message: {
    padding: [7, spacing]
  }
})
export default class Row extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    message: messagePropType.isRequired,
    prevMessage: messagePropType,
    style: PropTypes.object,
    user: PropTypes.object,
    onSelect: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    style: null,
    prevMessage: null,
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
      message,
      prevMessage,
      intl,
      style,
      user,
      onSelect,
      className
    } = this.props

    const showDateSeparator =
      !prevMessage ||
      !moment(message.time).isSame(prevMessage.time, 'day')

    return (
      <div style={style} className={className}>
        {showDateSeparator && (
          <DateSeparator
            theme={this.dateSeparatorTheme}
            date={message.time}
            key={`${message.id}-date`}
          />
        )}
        <Message
          message={message}
          key={`${message.id}-message`}
          intl={intl}
          className={classes.message}
          onSelect={onSelect}
          user={user}
        />
      </div>
    )
  }
}
