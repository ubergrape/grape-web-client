import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {userStatusMap} from '../../../constants/app'
import {Username} from '../../avatar-name'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import {styles} from './theme'
import Divider from '../Divider'

const messages = defineMessages({
  title: {
    id: 'userProfile',
    defaultMessage: 'User Profile'
  }
})

@injectSheet(styles)
@injectIntl
export default class UserProfile extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onClose: PropTypes.func.isRequired,
    status: PropTypes.number.isRequired,
    avatar: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    whatIDo: PropTypes.string,
    skypeUsername: PropTypes.string,
    skypeForBusiness: PropTypes.string,
    phoneNumber: PropTypes.string
  }

  static defaultProps = {
    avatar: null,
    displayName: null,
    email: null,
    whatIDo: null,
    skypeUsername: null,
    skypeForBusiness: null,
    phoneNumber: null
  }

  constructor(props) {
    super(props)
    const {classes} = props
    this.userNameTheme = {
      classes: {
        name: classes.name
      }
    }
  }

  render() {
    const {
      status,
      avatar,
      displayName,
      whatIDo,
      email,
      skypeUsername,
      skypeForBusiness,
      phoneNumber,
      intl: {formatMessage},
      classes,
      onClose
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
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
        <Divider />
        <div className={classes.details}>
          {whatIDo && (
            <div className={classes.about}>
              <h2 className={classes.whatIDo}>
                <FormattedMessage
                  id="whatIDo"
                  defaultMessage="What I do"
                />
                :
              </h2>
              <p>{whatIDo}</p>
            </div>
          )}
          <Divider />
          <ul>
            <li>
              <a href={`mailto:${email}`} className={classes.email}>
                {email}
              </a>
            </li>
            {skypeUsername && (
              <li>
                <a href={`skype:${skypeUsername}`} className={classes.skype}>
                  {skypeUsername}
                </a>
              </li>
            )}
            {skypeForBusiness && (
              <li>
                <a href={`callto:sip:${skypeForBusiness}`} className={classes.skype}>
                  {skypeForBusiness}
                </a>
              </li>
            )}
            {phoneNumber && (
              <li>
                <a href={`tel:${phoneNumber}`} className={classes.phone}>
                  {phoneNumber}
                </a>
              </li>
            )}
          </ul>
        </div>
      </SidebarPanel>
    )
  }
}
