import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { intlShape, FormattedMessage } from 'react-intl'
import { grayBlueLighter } from 'grape-theme/dist/base-colors'
import moment from 'moment'
import Button from 'grape-web/lib/components/button'

import DateSeparator from '../../message-parts/DateSeparator'
import { spacing } from '../constants'
import Message from './Message'

const messagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
})

const RefreshButton = ({ className, amount, onClick }) => (
  <FormattedMessage
    id="newImportantMessages"
    defaultMessage={`{amount} {amount, plural,
      one {{newImportantMessagesOne}}
      other {{newImportantMessagesOther}}
    }`}
    desctiption="Labeled messages sidebar button text."
    values={{
      amount,
      newImportantMessagesOne: (
        <FormattedMessage
          id="newImportantMessagesOne"
          defaultMessage="new important message"
        />
      ),
      newImportantMessagesOther: (
        <FormattedMessage
          id="newImportantMessagesOther"
          defaultMessage="new important messages"
        />
      ),
    }}
  >
    {(...nodes) => (
      <Button raised className={className} onClick={onClick}>
        {nodes}
      </Button>
    )}
  </FormattedMessage>
)

@injectSheet({
  refresh: {
    margin: spacing,
  },
  refreshButton: {
    width: '100%',
  },
  separatorDate: {
    background: grayBlueLighter,
  },
  message: {
    padding: [7, spacing],
  },
})
export default class Row extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    customEmojis: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    message: messagePropType.isRequired,
    prevMessage: messagePropType,
    style: PropTypes.object,
    user: PropTypes.object,
    onSelect: PropTypes.func,
    onRefresh: PropTypes.func,
    className: PropTypes.string,
    newMessagesAmount: PropTypes.number,
  }

  static defaultProps = {
    style: null,
    prevMessage: null,
    user: null,
    onSelect: null,
    onRefresh: null,
    className: null,
    newMessagesAmount: 0,
  }

  onRefresh = () => {
    this.props.onRefresh()
  }

  dateSeparatorTheme = {
    date: this.props.classes.separatorDate,
  }

  render() {
    const {
      classes,
      customEmojis,
      message,
      prevMessage,
      intl,
      style,
      user,
      onSelect,
      className,
      newMessagesAmount,
    } = this.props

    const showDateSeparator =
      !prevMessage || !moment(message.time).isSame(prevMessage.time, 'day')

    return (
      <div style={style} className={className}>
        {newMessagesAmount > 0 && (
          <div className={classes.refresh}>
            <RefreshButton
              className={classes.refreshButton}
              amount={newMessagesAmount}
              onClick={this.onRefresh}
            />
          </div>
        )}
        {showDateSeparator && (
          <DateSeparator
            theme={this.dateSeparatorTheme}
            date={message.time}
            key={`${message.id}-date`}
          />
        )}
        <Message
          message={message}
          customEmojis={customEmojis}
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
