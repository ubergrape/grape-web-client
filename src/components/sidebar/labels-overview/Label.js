import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage
} from 'react-intl'
import {small} from 'grape-theme/dist/fonts'
import {grayLight, grayDark} from 'grape-theme/dist/base-colors'
import Header from '../../message-parts/Header'

@injectSheet({
  header: {

  },
  channel: {
    extend: small,
    marginLeft: 20,
    color: grayLight
  },
  body: {
    color: grayDark
  }
})
export default class Label extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    label: PropTypes.shape({
      text: PropTypes.string.isRequired,
      message: PropTypes.shape({
        author: PropTypes.shape({
          displayName: PropTypes.string.isRequired
        }),
        time: PropTypes.instanceOf(Date).isRequired,
        channel: PropTypes.shape({
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }

  static defaultProps = {
    className: null
  }

  render() {
    const {
      label: {
        text,
        message: {
          author,
          time,
          channel
        }
      },
      classes,
      className
    } = this.props

    return (
      <section className={className}>
        <Header time={time} author={author.displayName} className={classes.header}>
          <FormattedMessage
            id="sidebarLabelInChannel"
            defaultMessage="in {channel}"
            desctiption="Labels overview sidebar channel headline."
            values={{channel: channel.name}}
          >
            {(...nodes) => <span className={classes.channel}>{nodes}</span>}
          </FormattedMessage>
        </Header>
        <div className={classes.body}>
          {`… ${text}`}
        </div>
      </section>
    )
  }
}
