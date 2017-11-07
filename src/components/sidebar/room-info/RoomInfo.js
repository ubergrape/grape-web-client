import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/lang/isEmpty'
import {
  defineMessages,
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import Divider from '../Divider'
import SharedFiles from '../shared-files/SharedFiles'
import TabbedContent from '../tabbed-content/TabbedContent'
import Title from '../Title'
import MainSettings from './MainSettings'
import User from './User'
import RoomActions from './RoomActions'
import Description from './Description'
import {getRoles} from './utils'
import {styles} from './roomInfoTheme.js'

const messages = defineMessages({
  title: {
    id: 'groupInfo',
    defaultMessage: 'Group Info'
  }
})

const subviewRenderMap = {
  members: 'renderMembers',
  files: 'renderSharedFiles'
}

const tabs = Object.keys(subviewRenderMap)

@injectSheet(styles)
@injectIntl
export default class RoomInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    renameError: PropTypes.object,
    showSubview: PropTypes.string,
    subview: PropTypes.object,
    showChannelMembersInvite: PropTypes.func.isRequired,
    showNotificationSettings: PropTypes.func.isRequired,
    openSharedFile: PropTypes.func,
    onLoadSharedFiles: PropTypes.func.isRequired,
    onShowSubview: PropTypes.func.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToAddIntegrations: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    renameRoom: PropTypes.func.isRequired,
    setRoomDescription: PropTypes.func.isRequired,
    setRoomPrivacy: PropTypes.func.isRequired,
    setRoomColor: PropTypes.func.isRequired,
    setRoomIcon: PropTypes.func.isRequired,
    clearRoomRenameError: PropTypes.func.isRequired,
    showRoomDeleteDialog: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    notificationSettings: PropTypes.object.isRequired
  }

  static defaultProps = {
    renameError: null,
    showSubview: 'members',
    subview: undefined,
    openSharedFile: undefined
  }

  componentDidMount() {
    const {onLoad, channel} = this.props
    onLoad({channel})
  }

  componentWillReceiveProps(nextProps) {
    const {channel, onLoad} = this.props
    const channelHasChanged = channel !== nextProps.channel
    if (channelHasChanged) onLoad({channel: nextProps.channel})
  }

  onInvite = () => {
    this.props.showChannelMembersInvite(this.props.channel)
  }

  onLeave = () => {
    this.props.leaveChannel(this.props.channel.id)
  }

  onChangePrivacy = () => {
    const {setRoomPrivacy, channel} = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
  }

  onSetRoomColor = (color) => {
    const {setRoomColor, channel} = this.props
    setRoomColor(channel.id, color)
  }

  onSetRoomIcon = (icon) => {
    const {setRoomIcon, channel} = this.props
    setRoomIcon(channel.id, icon)
  }

  onSetRoomDescription = (description) => {
    const {setRoomDescription, channel} = this.props
    setRoomDescription(channel.id, description)
  }

  onRenameRoom = (name) => {
    const {renameRoom, channel} = this.props
    renameRoom(channel.id, name)
  }

  onChangeTab = (index) => {
    this.props.onShowSubview(tabs[index])
  }

  renderMembers = () => {
    const {
      channel, goToAddIntegrations, user: currUser, goToChannel,
      kickMemberFromChannel, classes
    } = this.props

    return (
      <section>
        <header className={classes.sectionHeader}>
          <Title>
            <FormattedMessage
              id="members"
              defaultMessage="Members"
            />
          </Title>
        </header>
        <div className={classes.sectionBody}>
          <RoomActions
            channel={channel}
            onLeave={this.onLeave}
            onInvite={this.onInvite}
            onAddIntegration={goToAddIntegrations}
          />
          <Divider />
          {channel.users.map(user => (
            <User
              key={user.id}
              user={user}
              channel={channel}
              currUser={currUser}
              goToChannel={goToChannel}
              kickMemberFromChannel={kickMemberFromChannel}
            />
          ))}
        </div>
      </section>
    )
  }

  renderSharedFiles = () => {
    const {onLoadSharedFiles, openSharedFile, subview, classes} = this.props

    return (
      <section>
        <header className={classes.sectionHeader}>
          <Title>
            <FormattedMessage
              id="sharedFiles"
              defaultMessage="Shared Files"
            />
          </Title>
        </header>
        <div className={classes.sectionBody}>
          <SharedFiles
            {...subview}
            onLoad={onLoadSharedFiles}
            onOpen={openSharedFile}
          />
        </div>
      </section>
    )
  }

  render() {
    const {
      channel, renameError, clearRoomRenameError,
      intl: {formatMessage},
      intl,
      classes,
      showNotificationSettings, notificationSettings,
      showRoomDeleteDialog,
      user: currUser,
      showSubview,
      onClose
    } = this.props

    if (isEmpty(channel)) return null

    const {allowEdit} = getRoles({channel, user: currUser})

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        onClose={onClose}
      >
        <div className={classes.roomInfo}>
          <MainSettings
            classes={classes}
            channel={channel}
            clearRoomRenameError={clearRoomRenameError}
            renameError={renameError}
            allowEdit={allowEdit}
            onSetRoomColor={this.onSetRoomColor}
            onSetRoomIcon={this.onSetRoomIcon}
            onChangePrivacy={this.onChangePrivacy}
            onShowRoomDeleteDialog={showRoomDeleteDialog}
            renameRoom={this.onRenameRoom}
            notificationSettings={notificationSettings}
            showNotificationSettings={showNotificationSettings}
          />
          <Divider inset />
          <Description
            description={channel.description}
            intl={intl}
            allowEdit={allowEdit}
            onSetRoomDescription={this.onSetRoomDescription}
          />
          <TabbedContent
            value={tabs.indexOf(showSubview)}
            onChange={this.onChangeTab}
          >
            {this[subviewRenderMap[showSubview]]()}
          </TabbedContent>
        </div>
      </SidebarPanel>
    )
  }
}
