import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import noop from 'lodash/utility/noop'

import {styles} from './noContentTheme'

function Illustration({type, theme: {classes}}) {
  return (
    <div className={classes.illustration}>
      <div className={classes[`${type}ChannelImage`]} />
    </div>
  )
}

Illustration.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['private', 'public', 'pm']).isRequired
}

const text = {
  public: (
    <FormattedMessage
      id="roomIsPublic"
      defaultMessage="This group is public. Every member can join and read the history."
    />
  ),
  private: (
    <FormattedMessage
      id="roomIsPrivate"
      defaultMessage="This group is private. Only invited members can see and join this group."
    />
  )
}

function RoomContent(props) {
  const {
    name,
    isPublic,
    theme: {classes},
    onAddIntegration,
    onInvite
  } = props

  return (
    <div className={classes.noContent}>
      <Illustration type={isPublic ? 'public' : 'private'} theme={{classes}} />
      <div className={classes.description}>
        <h2 className={classes.title}>
          <FormattedMessage
            id="welcomeToRoom"
            defaultMessage="Welcome to {channel}"
            values={{channel: name}}
          />
        </h2>
        <p className={classes.text}>
          {text[isPublic ? 'public' : 'private']}
        </p>
        <button
          onClick={onInvite}
          className={classes.buttonInvite}
        >
          <FormattedMessage
            id="inviteMoreToGroup"
            defaultMessage="Invite more people to this group"
          />
        </button>
        <button
          onClick={onAddIntegration}
          className={classes.buttonIntegration}
        >
          <FormattedMessage
            id="addServiceIntegration"
            defaultMessage="Add service integration"
          />
        </button>
      </div>
    </div>
  )
}

RoomContent.propTypes = {
  name: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onAddIntegration: PropTypes.func.isRequired,
  onInvite: PropTypes.func.isRequired
}

function PmContent(props) {
  const {
    mate,
    classes
  } = props

  return (
    <div className={classes.noContent}>
      <Illustration type="pm" theme={{classes}} />
      <div className={classes.description}>
        <h2 className={classes.title}>
          <FormattedMessage
            id="welcomeToPm"
            defaultMessage="Private messages with {mate}"
            values={{mate: mate.displayName}}
          />
        </h2>
        <p className={classes.text}>
          <FormattedMessage
            id="pmIntro"
            defaultMessage="This is a private conversation between you and {mate}.{br}Private conversations are only accessible to the two of you."
            values={{
              mate: mate.displayName,
              br: <br />
            }}
          />
        </p>
      </div>
    </div>
  )
}

PmContent.propTypes = {
  mate: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  }).isRequired,
  classes: PropTypes.object.isRequired
}

@injectSheet(styles)
export default class NoContent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    channel: PropTypes.shape({
      type: PropTypes.oneOf(['pm', 'room']).isRequired,
      name: PropTypes.string,
      isPublic: PropTypes.bool,
      users: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      mate: PropTypes.shape({})
    }).isRequired
  }

  static defaultProps = {
    onInvite: noop,
    onAddIntegration: noop
  }

  onInvite = () => {
    this.props.onInvite(this.props.channel)
  }

  render() {
    const {
      channel,
      classes,
      onAddIntegration
    } = this.props

    if (channel.type === 'room') {
      return (
        <RoomContent
          name={channel.name}
          isPublic={channel.isPublic}
          theme={{classes}}
          onAddIntegration={onAddIntegration}
          onInvite={this.onInvite}
        />
      )
    }

    return <PmContent classes={classes} mate={channel.mate} />
  }
}
