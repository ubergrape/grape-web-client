import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import {small, normal} from 'grape-theme/dist/fonts'
import {grayBlueLighter, grayLight, grayDark} from 'grape-theme/dist/base-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import cn from 'classnames'
import color from 'color'
import noop from 'lodash/utility/noop'

import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import Tag from '../../tag'
import {styles as linkStyles} from '../../message-parts/linkTheme'

@injectSheet({
  message: {
    '&:hover': {
      isolate: false,
      background: color(grayBlueLighter).darken(0.05).hexString()
    },
    '&, & *': {
      cursor: 'pointer'
    },
    '& a': linkStyles.link
  },
  channel: {
    extend: [ellipsis, small],
    marginLeft: 20,
    color: grayLight
  },
  body: {
    extend: normal,
    color: grayDark,
    wordWrap: 'break-word'
  },
  footer: {
    marginTop: 10
  },
  tag: {
    margin: {
      right: 5,
      bottom: 5
    }
  }
})
export default class Message extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired
      }),
      time: PropTypes.instanceOf(Date).isRequired,
      channel: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      labels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        nameLocalized: PropTypes.string.isRequired
      })).isRequired
    }).isRequired,
    user: PropTypes.object,
    onSelect: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    className: null,
    user: null,
    onSelect: noop
  }

  onClick = () => {
    const {message, onSelect} = this.props
    onSelect(message)
  }

  render() {
    const {
      message: {
        text,
        author,
        time,
        channel,
        labels
      },
      classes,
      className,
      user
    } = this.props

    return (
      <section className={cn(classes.message, className)} onClick={this.onClick}>
        <Header time={time} author={author.name}>
          <FormattedMessage
            id="sidebarLabelInChannel"
            defaultMessage="in {channel}"
            desctiption="Labeled messages sidebar channel headline."
            values={{channel: channel.name}}
          >
            {(...nodes) => <span className={classes.channel}>{nodes}</span>}
          </FormattedMessage>
        </Header>
        <div className={classes.body}>
          <Grapedown text={text} user={user} />
        </div>
        <div>
          {labels.map(label => (
            <Tag
              style={{color: label.color}}
              className={classes.tag}
              key={label.id}
            >
              {label.nameLocalized}
            </Tag>
          ))}
        </div>
      </section>
    )
  }
}
