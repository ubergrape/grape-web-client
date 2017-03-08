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
import {styles as linkStyles} from '../../message-parts/linkTheme'
import {spacing} from '../sidebar-panel/theme'

@injectSheet({
  label: {
    padding: [0, spacing],
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
    color: grayDark
  }
})
export default class Label extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.shape({
      phrase: PropTypes.string.isRequired,
      message: PropTypes.shape({
        author: PropTypes.shape({
          name: PropTypes.string.isRequired
        }),
        time: PropTypes.instanceOf(Date).isRequired,
        channel: PropTypes.shape({
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
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
    const {label, onSelect} = this.props
    onSelect(label)
  }

  render() {
    const {
      label: {
        phrase,
        message: {
          author,
          time,
          channel
        }
      },
      classes,
      className,
      user
    } = this.props

    return (
      <section className={cn(classes.label, className)} onClick={this.onClick}>
        <Header time={time} author={author.name}>
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
          <Grapedown text={`… ${phrase}`} user={user} />
        </div>
      </section>
    )
  }
}
