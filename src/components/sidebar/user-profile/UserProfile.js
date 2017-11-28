import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import colors from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'
import {FormattedMessage} from 'react-intl'
import pick from 'lodash/object/pick'
import find from 'lodash/collection/find'

import {userStatusMap} from '../../../constants/app'
import {Username} from '../../avatar-name'
import {SharedFiles as SharedFilesText, UserProfile as UserProfileText} from '../../i18n'
import SharedFiles from '../shared-files/SharedFiles'
import SidebarPanel from '../SidebarPanel'
import {spacing} from '../constants'
import TabbedContent from '../TabbedContent'
import About from './About'

const tabs = [
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
    )
  },
  {
    name: 'files',
    icon: 'folderPicture',
    render: 'renderSharedFiles',
    title: <SharedFilesText />
  }
]

@injectSheet({
  userNameContainer: {
    display: 'block',
    padding: spacing
  },
  avatar: {
    width: sizes.icon.xxl,
    height: sizes.icon.xxl
  },
  userName: fonts.bigger
})
export default class UserProfile extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onShowSubview: PropTypes.func.isRequired,
    onLoadSharedFiles: PropTypes.func.isRequired,
    onOpenSharedFile: PropTypes.func.isRequired,
    status: PropTypes.number,
    avatar: PropTypes.string,
    displayName: PropTypes.string,
    showSubview: PropTypes.string,
    subview: PropTypes.object
  }

  static defaultProps = {
    avatar: undefined,
    displayName: undefined,
    status: undefined,
    subview: undefined,
    showSubview: 'about'
  }

  constructor(props) {
    super(props)
    const {classes} = props
    this.userNameTheme = {
      classes: {
        name: classes.userName,
        avatar: classes.avatar
      }
    }
  }

  onChangeTab = (index) => {
    this.props.onShowSubview(tabs[index].name)
  }

  renderAbout = () => (
    <About
      {...pick(this.props, 'whatIDo', 'email', 'skypeUsername',
      'skypeForBusiness', 'phoneNumber')}
    />
  )

  renderSharedFiles = () => {
    const {onLoadSharedFiles, onOpenSharedFile, subview} = this.props

    return (
      <SharedFiles
        {...subview}
        onLoad={onLoadSharedFiles}
        onOpen={onOpenSharedFile}
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
      showSubview
    } = this.props

    const tab = find(tabs, {name: showSubview})

    return (
      <SidebarPanel
        title={<UserProfileText />}
        onClose={onClose}
      >
        <div className={classes.userNameContainer}>
          <Username
            statusBorderColor={colors.grayBlueLighter}
            avatar={avatar}
            status={userStatusMap[status]}
            name={displayName}
            theme={this.userNameTheme}
          />
        </div>
        <TabbedContent
          index={tabs.indexOf(tab)}
          onChange={this.onChangeTab}
          tabs={tabs}
          title={tab.title}
          body={this[tab.render]()}
        />
      </SidebarPanel>
    )
  }
}
