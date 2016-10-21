import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {styles} from './notificationSettingsTheme'
import Dialog from '../dialog/Dialog'

export const values = ['inherit', 'all', 'anyMention', 'directMention', 'off']

const messages = defineMessages({
  title: {
    id: 'notificationSettingsTitle',
    defaultMessage: 'Notification in {group}',
    description: 'Notification settings dialog.'
  },
  inherit: {
    id: 'notificationSettingDefault',
    defaultMessage: 'Default Notification Settings',
    description: 'Notification setting name.'
  },
  all: {
    id: 'notificationSettingAll',
    defaultMessage: 'All messages',
    description: 'Notification setting name.'
  },
  anyMention: {
    id: 'notificationSettingAnyMention',
    defaultMessage: 'Mentions and announcements (@room)',
    description: 'Notification setting name.'
  },
  directMention: {
    id: 'notificationSettingDirectMention',
    defaultMessage: 'Direct mentions only (@{user})',
    description: 'Notification setting name.'
  },
  off: {
    id: 'notificationSettingOff',
    defaultMessage: 'Nothing',
    description: 'Notification setting name.'
  }
})

const MuteAllSetting = ({classes, value, channel, onChange, onLeave}) => (
  <div className={classes.setting}>
    <h3 className={classes.h3}>Mute this Group</h3>
    <label className={classes.label}>
      <input
        type="checkbox"
        checked={value}
        className={classes.checkbox}
        onChange={onChange} />
      <FormattedMessage
        id="muteAllNotifications"
        defaultMessage="Block all notifications for this group on all your devices" />
    </label>
    {value && (
      <p className={classes.allMutedHint}>
        <FormattedMessage
          id="muteAllNotificationsHint"
          defaultMessage="This group is completely muted on all your devices. No more rings and beeps coming from
        {channel} - but you can still come back anytime to check it out for new messages.
        If you want to leave the group and remove it from your sidebar, {leaveButton}"
          values={{
            channel: channel.displayName,
            leaveButton: (
              <a className={classes.inlineLink} href="" onClick={onLeave}>
                <FormattedMessage
                  id="clickHereInlineLink"
                  defaultMessage="click here"
                  description={"Link used inline in the middle of a sentence."} />
              </a>
            )
          }} />
      </p>
    )}
  </div>
)

MuteAllSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.bool.isRequired,
  channel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired
}

const Select = ({user, onChange, formatMessage, value: selected}) => (
  <select onChange={onChange} value={selected}>
    {values.map(value => (
      <option value={value} key={value}>
        {formatMessage(messages[value], {user: user.displayName})}
      </option>
    ))}
  </select>
)

Select.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  }).isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired,
  formatMessage: PropTypes.func.isRequired
}

const DesktopSetting = ({classes, ...rest}) => (
  <div className={classes.groupedSetting}>
    <h3 className={classes.h3}>Desktop Notifications</h3>
    <Select {...rest} />
  </div>
)

DesktopSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired
}

const PushSetting = ({classes, ...rest}) => (
  <div className={classes.groupedSetting}>
    <h3 className={classes.h3}>Mobile Push Notifications</h3>
    <Select {...rest} />
  </div>
)

PushSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired
}

const Footer = ({classes}) => (
  <div className={classes.footer}>
    <FormattedMessage
      id="notificationSettingsHint"
      defaultMessage="*You can change the default preferences in your account's {link}"
      values={{
        link: (
          <a className={classes.inlineLink} href="/accounts/settings/notifications/">
            <FormattedMessage
              id="notificationSettingsHintLink"
              defaultMessage="notification settings"
              description="An inline link in channel notification settings." />
          </a>
        )
      }} />
  </div>
)

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

const isAllMuted = ({desktop, push}) => push === 'off' && desktop === 'off'

@injectSheet(styles)
@injectIntl
export default class NotificationSettings extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    desktop: PropTypes.oneOf(values),
    push: PropTypes.oneOf(values),
    channel: PropTypes.object,
    user: PropTypes.object
  }

  onToggleMuteAll = () => {
    const {onChange, channel} = this.props
    const allMuted = isAllMuted(this.props)
    onChange(channel, {transport: 'all', setting: 'all', value: !allMuted})
  }

  onChangeDesktop = (e) => {
    const {value: setting} = e.target
    const {onChange, channel} = this.props
    onChange(channel, {transport: 'desktop', setting, value: true})
  }

  onChangePush = (e) => {
    const {value: setting} = e.target
    const {onChange, channel} = this.props
    onChange(channel, {transport: 'push', setting, value: true})
  }

  onLeave = () => {
    const {onLeave, onHide, channel} = this.props
    onLeave(channel.id)
    onHide()
  }

  render() {
    const {
      sheet: {classes},
      intl: {formatMessage},
      onHide, show, channel, user,
      desktop, push
    } = this.props

    if (!channel || !desktop) return null

    const allMuted = isAllMuted(this.props)

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.title, {group: channel.name})}>
        <div className={classes.notificationSettings}>
          <section className={classes.section}>
            <MuteAllSetting
              value={allMuted}
              classes={classes}
              channel={channel}
              onChange={this.onToggleMuteAll}
              onLeave={this.onLeave} />
          </section>
          {!allMuted && (
            <section className={classes.section}>
              <DesktopSetting
                value={desktop}
                classes={classes}
                onChange={this.onChangeDesktop}
                formatMessage={formatMessage}
                user={user} />
              <PushSetting
                value={push}
                classes={classes}
                onChange={this.onChangePush}
                formatMessage={formatMessage}
                user={user} />
            </section>
          )}
          <Footer classes={classes} />
        </div>
      </Dialog>
    )
  }
}
