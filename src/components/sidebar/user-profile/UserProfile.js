import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import { FormattedMessage } from 'react-intl'
import pick from 'lodash/pick'
import find from 'lodash/find'

import { userStatusMap } from '../../../constants/app'
import { Username } from '../../avatar-name'
import {
  SharedFiles as SharedFilesText,
  UserProfile as UserProfileText,
  PinnedMessages as PinnedMessagesText,
} from '../../i18n'
import SharedFiles from '../shared-files/SharedFiles'
import PinnedMessages from '../pinned-messages/PinnedMessages'
import SidebarPanel from '../SidebarPanel'
import { spacing } from '../constants'
import TabbedContent from '../TabbedContent'
import Divider from '../Divider'
import About from './About'
import VideoConferenceLink from '../VideoConferenceLink'

const tabs = [
  {
    name: 'pinnedMessages',
    icon: 'pinFilled',
    render: 'renderPinnedMessages',
    title: <PinnedMessagesText />,
  },
  {
    name: 'about',
    icon: 'userInfo',
    render: 'renderAbout',
    title: (
      <FormattedMessage
        id="aboutUserTitle"
        defaultMessage="About this user"
        description="User profile sidebar, about user title."
      />
    ),
    onSelect: 'onUserInfoClick',
  },
  {
    name: 'files',
    icon: 'folderPicture',
    render: 'renderSharedFiles',
    title: <SharedFilesText />,
  },
]

@injectSheet({
  userNameContainer: {
    display: 'block',
    padding: spacing,
  },
  avatar: {
    width: sizes.icon.xxl,
    height: sizes.icon.xxl,
  },
  userName: fonts.bigger,
})
export default class UserProfile extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onShowSubview: PropTypes.func.isRequired,
    onLoadSharedFiles: PropTypes.func.isRequired,
    onOpenSharedFile: PropTypes.func.isRequired,
    onUnpin: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    onLoadPinnedMessages: PropTypes.func.isRequired,
    onSelectPinnedMessage: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    email: PropTypes.string,
    status: PropTypes.number,
    avatar: PropTypes.string,
    displayName: PropTypes.string,
    showSubview: PropTypes.string,
    subview: PropTypes.object,
    channel: PropTypes.object.isRequired,
    orgFeatures: PropTypes.object.isRequired,
  }

  static defaultProps = {
    avatar: undefined,
    displayName: undefined,
    status: undefined,
    subview: undefined,
    email: undefined,
    showSubview: 'pinnedMessages',
  }

  constructor(props) {
    super(props)
    const { classes } = props
    this.userNameTheme = {
      classes: {
        name: classes.userName,
        avatar: classes.avatar,
      },
    }
  }

  onChangeTab = index => {
    this.props.onShowSubview(tabs[index].name)
  }

  onUserInfoClick = () => {
    const { getUser, email, id } = this.props
    if (!email) getUser(id)
  }

  renderAbout = () => (
    <About
      {...pick(
        this.props,
        'whatIDo',
        'email',
        'skypeUsername',
        'skypeForBusiness',
        'phoneNumber',
      )}
    />
  )

  renderSharedFiles = () => {
    const { onLoadSharedFiles, onOpenSharedFile, subview } = this.props

    return (
      <SharedFiles
        {...subview}
        onLoad={onLoadSharedFiles}
        onOpen={onOpenSharedFile}
      />
    )
  }

  renderPinnedMessages = () => {
    const {
      onLoadPinnedMessages,
      onSelectPinnedMessage,
      onUnpin,
      subview,
      user,
    } = this.props

    return (
      <PinnedMessages
        {...subview}
        user={user}
        onLoad={onLoadPinnedMessages}
        onSelect={onSelectPinnedMessage}
        onUnpin={onUnpin}
      />
    )
  }

  render() {
    const {
      status,
      avatar,
      displayName,
      classes,
      onClose,
      showSubview,
      channel,
      orgFeatures,
    } = this.props

    const tab = find(tabs, { name: showSubview })

    return (
      <SidebarPanel title={<UserProfileText />} onClose={onClose}>
        <div className={classes.userNameContainer}>
          <Username
            statusBorderColor={colors.grayBlueLighter}
            avatar={avatar}
            status={userStatusMap[status]}
            name={displayName}
            theme={this.userNameTheme}
          />
        </div>
        {orgFeatures.videoconference && (
          <div>
            <Divider inset />
            <VideoConferenceLink channel={channel} />
          </div>
        )}
        <TabbedContent
          index={tabs.indexOf(tab)}
          onChange={this.onChangeTab}
          tabs={tabs}
          title={tab.title}
          body={this[tab.render]()}
          onSelect={tab.onSelect ? this[tab.onSelect]() : undefined}
        />
      </SidebarPanel>
    )
  }
}
