import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import each from 'lodash/each'
import random from 'lodash/random'
import capitalize from 'lodash/capitalize'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'

import { styles } from './theme'
import Dialog from '../dialog/Dialog'
import { Done } from '../i18n/i18n'
import { isAllOff, values } from '../../../utils/notification-settings'

const statuses = ['pending', 'complete', undefined]

const messages = defineMessages({
  title: {
    id: 'notificationSettingsTitle',
    defaultMessage: 'Notification in {group}',
    description: 'Notification settings dialog.',
  },
  inherit: {
    id: 'notificationSettingDefault',
    defaultMessage: 'Default Notification Settings',
    description: 'Notification setting name.',
  },
  all: {
    id: 'notificationSettingAll',
    defaultMessage: 'All messages',
    description: 'Notification setting name.',
  },
  anyMention: {
    id: 'notificationSettingAnyMention',
    defaultMessage: 'Mentions and announcements (@room)',
    description: 'Notification setting name.',
  },
  directMention: {
    id: 'notificationSettingDirectMention',
    defaultMessage: 'Direct mentions only (@{user})',
    description: 'Notification setting name.',
  },
  off: {
    id: 'notificationSettingOff',
    defaultMessage: 'Nothing',
    description: 'Notification setting name.',
  },
})

const Title = ({ classes, children, setting, status }) => (
  <div className={classes.titleContainer}>
    <span
      className={`${classes[`titleIcon${capitalize(setting)}`]} ${
        classes.iconColumn
      }`}
    />
    <h3 className={classes.titleHeadline}>{children}</h3>
    <span
      className={`${classes.status} ${!status ? classes.statusHidden : ''}`}
    >
      <FormattedMessage
        id="notificationSettingStatusComplete"
        defaultMessage="saved"
      />
    </span>
  </div>
)

Title.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  setting: PropTypes.oneOf(['muteAll', 'desktop', 'push']).isRequired,
  status: PropTypes.oneOf(statuses),
}

Title.defaultProps = {
  status: undefined,
}

const id = `muteAllNotifications${random(1000000)}`
const MuteAllSetting = ({
  classes,
  status,
  value,
  channel,
  onChange,
  onLeave,
}) => (
  <div className={classes.setting}>
    <Title classes={classes} setting="muteAll" status={status}>
      <FormattedMessage id="muteGroupTitle" defaultMessage="Mute this Group" />
    </Title>
    <label htmlFor={id} className={classes.label}>
      <input
        id={id}
        className={classes.checkbox}
        type="checkbox"
        checked={value}
        onChange={onChange}
      />
      <FormattedMessage
        id="muteAllNotifications"
        defaultMessage="Block all notifications for this group on all your devices"
      />
    </label>
    {value && (
      <p className={classes.allMutedHint}>
        <FormattedMessage
          id="muteAllNotificationsHint"
          defaultMessage="This group is completely muted on all your devices. No more rings and beeps coming from
        {channel} - but you can still come back anytime to check it out for new messages.
        If you want to leave the group and remove it from your sidebar, {leaveButton}"
          values={{
            channel: channel.name,
            leaveButton: (
              <button className={classes.buttonLink} onClick={onLeave}>
                <FormattedMessage
                  id="clickHereInlineLink"
                  defaultMessage="click here"
                  description="Link used inline in the middle of a sentence."
                />
              </button>
            ),
          }}
        />
      </p>
    )}
  </div>
)

MuteAllSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.bool.isRequired,
  channel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  status: PropTypes.oneOf(statuses),
}

MuteAllSetting.defaultProps = {
  status: undefined,
}

const Select = ({
  classes,
  user,
  onChange,
  formatMessage,
  value: selected,
}) => (
  <select onChange={onChange} value={selected} className={classes.select}>
    {values.map(value => (
      <option value={value} key={value}>
        {formatMessage(messages[value], { user: user.displayName })}
      </option>
    ))}
  </select>
)

Select.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired,
  formatMessage: PropTypes.func.isRequired,
}

const DesktopSetting = ({ classes, status, ...rest }) => (
  <div className={classes.groupedSetting}>
    <Title classes={classes} setting="desktop" status={status}>
      <FormattedMessage
        id="desktopNotificationsTitle"
        defaultMessage="Desktop Notifications"
      />
    </Title>
    <Select {...rest} classes={classes} />
  </div>
)

DesktopSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.oneOf(statuses),
}

DesktopSetting.defaultProps = {
  status: undefined,
}

const PushSetting = ({ classes, status, ...rest }) => (
  <div className={classes.groupedSetting}>
    <Title classes={classes} setting="push" status={status}>
      <FormattedMessage
        id="mobileNotificationsTitle"
        defaultMessage="Mobile Push Notifications"
      />
    </Title>
    <Select {...rest} classes={classes} />
  </div>
)

PushSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.oneOf(statuses),
}

PushSetting.defaultProps = {
  status: undefined,
}

const Footer = ({ classes, onClose }) => (
  <div className={classes.footer}>
    <div className={classes.hint}>
      <FormattedMessage
        id="notificationSettingsHint"
        defaultMessage="You can change the default preferences in your account's {link}"
        values={{
          link: (
            <a
              className={classes.inlineLink}
              href="/accounts/settings/notifications/"
            >
              <FormattedMessage
                id="notificationSettingsHintLink"
                defaultMessage="notification settings"
                description="An inline link in channel notification settings."
              />
            </a>
          ),
        }}
      />
    </div>
    <button className={classes.done} onClick={onClose}>
      <Done />
    </button>
  </div>
)

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

class NotificationSettings extends PureComponent {
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
    user: PropTypes.object,
  }

  static defaultProps = {
    desktop: 'off',
    push: 'off',
    channel: {},
    user: {},
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.timers = {}
  }

  componentWillUpdate() {
    each(this.state, (status, name) => {
      if (status !== 'pending') return
      this.setState({ [name]: 'complete' })
      clearTimeout(this.timers[name])
      this.timers[name] = setTimeout(() => {
        this.setState({ [name]: undefined })
      }, 1000)
    })
  }

  onToggleMuteAll = () => {
    const { onChange, channel } = this.props
    const allMuted = isAllOff(this.props)
    this.setState({ muteAllStatus: 'pending' })
    onChange(channel, { transport: 'all', setting: 'all', value: !allMuted })
  }

  onChangeDesktop = e => {
    const { value: setting } = e.target
    const { onChange, channel } = this.props
    this.setState({ desktopStatus: 'pending' })
    onChange(channel, { transport: 'desktop', setting, value: true })
  }

  onChangePush = e => {
    const { value: setting } = e.target
    const { onChange, channel } = this.props
    this.setState({ pushStatus: 'pending' })
    onChange(channel, { transport: 'push', setting, value: true })
  }

  onLeave = () => {
    const { onLeave, onHide, channel } = this.props
    onLeave(channel.id, !channel.isPublic)
    onHide()
  }

  render() {
    const {
      sheet: { classes },
      intl: { formatMessage },
      onHide,
      show,
      channel,
      user,
      desktop,
      push,
    } = this.props

    if (!channel || !desktop) return null

    const allMuted = isAllOff(this.props)

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={formatMessage(messages.title, { group: channel.name })}
      >
        <div className={classes.notificationSettings}>
          <section className={classes.section}>
            <MuteAllSetting
              value={allMuted}
              classes={classes}
              channel={channel}
              onChange={this.onToggleMuteAll}
              onLeave={this.onLeave}
              status={this.state.muteAllStatus}
            />
          </section>
          {!allMuted && (
            <section className={classes.section}>
              <DesktopSetting
                value={desktop}
                classes={classes}
                onChange={this.onChangeDesktop}
                formatMessage={formatMessage}
                user={user}
                status={this.state.desktopStatus}
              />
              <PushSetting
                value={push}
                classes={classes}
                onChange={this.onChangePush}
                formatMessage={formatMessage}
                user={user}
                status={this.state.pushStatus}
              />
            </section>
          )}
          <Footer classes={classes} onClose={onHide} />
        </div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(NotificationSettings))
