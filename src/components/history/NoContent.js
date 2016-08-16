import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {useSheet} from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'
import noop from 'lodash/utility/noop'

import {styles} from './noContentTheme'

@useSheet(styles)
export default class NoContent extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onAddIntegration: PropTypes.func.isRequired,
    channel: PropTypes.shape({
      name: PropTypes.string,
      isPublic: PropTypes.bool,
      type: PropTypes.oneOf(['pm', 'room']).isRequired,
      users: PropTypes.arrayOf(PropTypes.shape({
        displayName: PropTypes.string.isRequired
      })).isRequired
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

  renderIllustration = (type) => {
    const {sheet: {classes}} = this.props
    return (
      <div className={classes.illustration}>
        <div className={classes[`${type}ChannelImage`]}></div>
      </div>
    )
  }

  renderText = (...nodes) => {
    const {sheet: {classes}} = this.props
    return <p className={classes.text}>{nodes}</p>
  }

  renderRoomContent() {
    const {
      channel: {name, isPublic},
      sheet: {classes},
      onAddIntegration
    } = this.props

    return (
      <div className={classes.noContent}>
        {this.renderIllustration(isPublic ? 'public' : 'private')}
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
              {this.renderText}
            </FormattedMessage>
            :
            <FormattedMessage
              id="roomIsPrivate"
              defaultMessage="This group is private. Only invited members can see and join this group.">
              {this.renderText}
            </FormattedMessage>
          }

          <FormattedMessage
            id="inviteMoreToGroup"
            defaultMessage="Invite more people to this group">
            {(...nodes) => (
              <button
                onClick={this.onInvite}
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

  renderPmContent() {
    const {channel: {users}, sheet: {classes}} = this.props

    return (
      <div className={classes.noContent}>
        {this.renderIllustration('pm')}
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
            {this.renderText}
          </FormattedMessage>
        </div>
      </div>
    )
  }

  render() {
    const {channel: {type}} = this.props
    return type === 'room' ? this.renderRoomContent() : this.renderPmContent()
  }
}
