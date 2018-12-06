import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import { small, normal } from 'grape-theme/dist/fonts'
import {
  white,
  grayLight,
  grayDark,
  grayBlueLighter,
} from 'grape-theme/dist/base-colors'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import cn from 'classnames'
import color from 'color'
import noop from 'lodash/noop'
import Chip from 'grape-web/lib/components/chip'

import { Grapedown } from '../../grapedown'
import Header from '../../message-parts/Header'
import contentStyles from '../../message-parts/contentStyles'

class Message extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      time: PropTypes.instanceOf(Date).isRequired,
      channel: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      labels: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          color: PropTypes.string.isRequired,
          nameLocalized: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
    user: PropTypes.object,
    onSelect: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    user: null,
    onSelect: noop,
  }

  onClick = ({ target }) => {
    const { message, onSelect } = this.props
    if (target.href) return
    onSelect(message)
  }

  render() {
    const {
      message: { text, author, time, channel, labels },
      classes,
      className,
      user,
    } = this.props

    return (
      <button className={cn(classes.message, className)} onClick={this.onClick}>
        <Header time={time} author={author.name}>
          <FormattedMessage
            id="sidebarLabelInChannel"
            defaultMessage="in {channel}"
            desctiption="Labeled messages sidebar channel headline."
            values={{ channel: channel.name }}
          >
            {(...nodes) => <span className={classes.channel}>{nodes}</span>}
          </FormattedMessage>
        </Header>
        <div className={classes.body}>
          <Grapedown text={text} user={user} />
        </div>
        <div>
          {labels.map(label => (
            <Chip
              style={{ color: label.color }}
              className={classes.chip}
              key={label.id}
              label={label.nameLocalized}
            />
          ))}
        </div>
      </button>
    )
  }
}

export default injectSheet({
  message: {
    width: '100%',
    extend: contentStyles,
    '&:hover': {
      isolate: false,
      background: color(grayBlueLighter)
        .darken(0.05)
        .hexString(),
      '&, & *': {
        isolate: false,
        cursor: 'pointer',
      },
    },
  },
  channel: {
    extend: [ellipsis, small],
    marginLeft: 20,
    color: grayLight,
  },
  body: {
    display: 'block',
    extend: [normal, ellipsis],
    color: grayDark,
    wordWrap: 'break-word',
  },
  footer: {
    display: 'block',
    marginTop: 10,
  },
  chip: {
    display: 'inline-block',
    background: white,
    margin: {
      right: 5,
      bottom: 5,
    },
    padding: [3, 0],
  },
})(Message)