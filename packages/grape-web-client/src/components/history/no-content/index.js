import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'
import noop from 'lodash/noop'

import styles from './styles'

function Illustration({ type, theme: { classes } }) {
  return (
    <div className={classes.illustration}>
      <div className={classes[`${type}ChannelImage`]} />
    </div>
  )
}

Illustration.propTypes = {
  theme: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['private', 'public', 'pm']).isRequired,
}

const text = {
  public: (
    <FormattedMessage
      id="groupIsPublic"
      defaultMessage="This group is public. Every member can join and read the history."
    />
  ),
  private: (
    <FormattedMessage
      id="groupIsPrivate"
      defaultMessage="This group is private. Only invited members can see and join this group."
    />
  ),
}

function RoomContent(props) {
  const {
    name,
    isPublic,
    theme: { classes },
    onAddIntegration,
    onInvite,
    permissions,
  } = props

  return (
    <div className={classes.noContent}>
      <Illustration
        type={isPublic ? 'public' : 'private'}
        theme={{ classes }}
      />
      <div className={classes.description}>
        <h2 className={classes.title}>
          <FormattedMessage
            id="welcomeToGroup"
            defaultMessage="Welcome to {group}"
            values={{ group: name }}
          />
        </h2>
        <p className={classes.text}>{text[isPublic ? 'public' : 'private']}</p>
        {permissions.canInviteMembers && (
          <button onClick={onInvite} className={classes.buttonInvite}>
            <FormattedMessage
              id="inviteMoreToGroup"
              defaultMessage="Invite more members to this group"
              description="No Content: invite members to the group"
            />
          </button>
        )}
        {permissions.canAddIntegration && (
          <button
            onClick={onAddIntegration}
            className={classes.buttonIntegration}
          >
            <FormattedMessage
              id="addServiceIntegration"
              defaultMessage="Add Service Integrations"
            />
          </button>
        )}
      </div>
    </div>
  )
}

RoomContent.propTypes = {
  name: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onAddIntegration: PropTypes.func.isRequired,
  onInvite: PropTypes.func.isRequired,
  permissions: PropTypes.object,
}

RoomContent.defaultProps = {
  permissions: {},
}

function PmContent(props) {
  const { partner, classes } = props

  return (
    <div className={classes.noContent}>
      <Illustration type="pm" theme={{ classes }} />
      <div className={classes.description}>
        <h2 className={classes.title}>
          <FormattedMessage
            id="welcomeToPm"
            defaultMessage="Private conversation with {partner}"
            values={{ partner: partner.displayName }}
          />
        </h2>
        <p className={classes.text}>
          <FormattedMessage
            id="pmIntro"
            defaultMessage="This is a private conversation between you and {partner}.{br}Private conversations are only accessible to the two of you."
            values={{
              partner: partner.displayName,
              br: <br />,
            }}
          />
        </p>
      </div>
    </div>
  )
}

PmContent.propTypes = {
  partner: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
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
      partner: PropTypes.shape({}),
    }).isRequired,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    onInvite: noop,
    onAddIntegration: noop,
    permissions: {},
  }

  onInvite = () => {
    this.props.onInvite(this.props.channel)
  }

  render() {
    const { channel, classes, onAddIntegration, permissions } = this.props

    if (channel.type === 'room') {
      return (
        <RoomContent
          name={channel.name}
          isPublic={channel.isPublic}
          theme={{ classes }}
          onAddIntegration={onAddIntegration}
          onInvite={this.onInvite}
          permissions={permissions}
        />
      )
    }

    return <PmContent classes={classes} partner={channel.partner} />
  }
}
