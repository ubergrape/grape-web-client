import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {styles} from './notificationSettingsTheme'
import Dialog from '../dialog/Dialog'

const values = ['inherit', 'all', 'anyMention', 'directMention', 'off']

const messages = defineMessages({
  title: {
    id: 'notificationSettingsTitle',
    defaultMessage: 'Notification in {group}',
    description: 'Notification settings dialog.'
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
      {'Block all notifications for this group on all your devices'}
    </label>
    {value && (
      <p className={classes.allMutedHint}>
        {`This group is completely muted on all your devices. No more rings and beeps coming from
        ${channel.name} - but you can still come back anytime to check it out for new messages.
        If you want to leave the group and remove it from your sidebar, `}
        <a className={classes.inlineLink} href="" onClick={onLeave}>click here</a>
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

const Select = ({onChange, value}) => (
  <select onChange={onChange} value={value}>
    <option value="inherit">Default Notification Settings</option>
    <option value="all">All messages</option>
    <option value="anyMention">Mentions of my name or @room announcements</option>
    <option value="directMention">Only direct mentions</option>
    <option value="off">Nothing</option>
  </select>
)

Select.propTypes = {
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired
}

const DesktopSetting = ({classes, onChange, value}) => (
  <div className={classes.groupedSetting}>
    <h3 className={classes.h3}>Desktop Notifications</h3>
    <Select onChange={onChange} value={value} />
  </div>
)

DesktopSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired
}

const PushSetting = ({classes, onChange, value}) => (
  <div className={classes.groupedSetting}>
    <h3 className={classes.h3}>Mobile Push Notifications</h3>
    <Select onChange={onChange} value={value} />
  </div>
)

PushSetting.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.oneOf(values).isRequired,
  onChange: PropTypes.func.isRequired
}

const Footer = ({classes}) => (
  <div className={classes.footer}>
    {'*You can change the default preferences in your account\'s '}
    <a className={classes.inlineLink} href="/accounts/settings/notifications/">notification settings</a>
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
    channel: PropTypes.object
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
      onHide, show, channel,
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
                onChange={this.onChangeDesktop} />
              <PushSetting
                value={push}
                classes={classes}
                onChange={this.onChangePush} />
            </section>
          )}
          <Footer classes={classes} />
        </div>
      </Dialog>
    )
  }
}
