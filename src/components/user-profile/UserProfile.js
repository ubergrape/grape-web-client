import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import style from './style'

const messages = defineMessages({
  title: {
    id: 'userProfile',
    defaultMessage: 'User Profile'
  }
})

@injectSheet(style)
@injectIntl
export default class UserProfile extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    whatIDo: PropTypes.string,
    skypeUsername: PropTypes.string,
    skypeForBusiness: PropTypes.string,
    phoneNumber: PropTypes.string
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClose = () => {
    this.props.hideSidebar()
  }

  render() {
    const {
      avatar,
      username,
      displayName,
      whatIDo,
      email,
      skypeUsername,
      skypeForBusiness,
      phoneNumber,
      intl: {formatMessage},
      sheet: {classes}
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        onClose={this.onClose}>
        <div className={classes.profile}>
          <div className={classes.leftColumn}>
            <img
              className={classes.avatar}
              src={avatar}
              alt={username} />
          </div>
          <div className={classes.rightColumn}>
            <div className={classes.fullName}>
              {displayName}
            </div>
          </div>
        </div>
        <div>
          {whatIDo && (
            <div className={classes.about}>
              <p>
                <FormattedMessage
                  id="whatIDo"
                  defaultMessage="What I do" />
                :
              </p>
              <p>{whatIDo}</p>
            </div>
          )}
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
                <a href={`tel:${skypeForBusiness}`} className={classes.skype}>
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
