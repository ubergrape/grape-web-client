import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {useSheet} from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import noop from 'lodash/utility/noop'

import {styles} from './noContentTheme'

function Illustration({type, theme: {classes}}) {
  return (
    <div className={classes.illustration}>
      <div className={classes[`${type}ChannelImage`]}></div>
    </div>
  )
}

Illustration.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['private', 'public', 'pm']).isRequired
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
        <FormattedMessage
          id="welcomeToRoom"
          defaultMessage="Welcome to {channel}"
          values={{channel: name}}>
          {message => <h2 className={classes.title}>{message}</h2>}
        </FormattedMessage>
        {isPublic ?
          <FormattedMessage
            id="roomIsPublic"
            defaultMessage="This group is public. Every member can join and read the history.">
            {nodes => <p className={classes.text}>{nodes}</p>}
          </FormattedMessage>
          :
          <FormattedMessage
            id="roomIsPrivate"
            defaultMessage="This group is private. Only invited members can see and join this group.">
            {nodes => <p className={classes.text}>{nodes}</p>}
          </FormattedMessage>
        }

        <FormattedMessage
          id="inviteMoreToGroup"
          defaultMessage="Invite more people to this group">
          {(...nodes) => (
            <button
              onClick={onInvite}
              className={classes.buttonInvite}>
              {nodes}
            </button>
          )}
        </FormattedMessage>

        <FormattedMessage
          id="addServiceIntegration"
          defaultMessage="Add service integration">
          {(...nodes) => (
            <button
              onClick={onAddIntegration}
              className={classes.buttonIntegration}>
              {nodes}
            </button>
          )}
        </FormattedMessage>
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
    users,
    theme: {classes}
  } = props

  return (
    <div className={classes.noContent}>
      <Illustration type="pm" theme={{classes}} />
      <div className={classes.description}>
        <FormattedMessage
          id="welcomeToPm"
          defaultMessage="Private messages with {mate}"
          values={{mate: users[0].displayName}}>
          {message => <h2 className={classes.title}>{message}</h2>}
        </FormattedMessage>
        <FormattedMessage
          id="pmIntro"
          defaultMessage="This is a private conversation between you and {mate}.{br}Private conversations are only accessible to the two of you."
          values={{
            mate: users[0].displayName,
            br: <br key="br-0"/>
          }}>
          {nodes => <p className={classes.text}>{nodes}</p>}
        </FormattedMessage>
      </div>
    </div>
  )
}

PmContent.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired
  })).isRequired,
  theme: PropTypes.object.isRequired
}

@useSheet(styles)
export default class NoContent extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    channel: PropTypes.shape({
      type: PropTypes.oneOf(['pm', 'room']).isRequired
    }).isRequired
  }

  static defaultProps = {
    onInvite: noop,
    onAddIntegration: noop
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onInvite = () => {
    this.props.onInvite(this.props.channel)
  }

  render() {
    const {
      channel: {type, name, isPublic, users},
      sheet: {classes},
      onAddIntegration
    } = this.props

    if (type === 'room') {
      return (
        <RoomContent
          name={name}
          isPublic={isPublic}
          theme={{classes}}
          onAddIntegration={onAddIntegration}
          onInvite={this.onInvite} />
      )
    }

    return <PmContent theme={{classes}} users={users} />
  }
}
