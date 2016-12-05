import React, {PropTypes, PureComponent} from 'react'
import colors from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'

import {userStatusMap} from '../../constants/app'
import Username from '../avatar-name/Username'
import {styles} from './contactTheme'

@injectSheet(styles)
export default class Contact extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    sheet: PropTypes.object.isRequired
  }

  onClick = (e) => {
    const {
      onSelectUser,
      onHide,
      user: {slug}
    } = this.props

    e.preventDefault()
    onHide()
    onSelectUser(slug)
  }

  render() {
    const {
      sheet: {classes},
      user
    } = this.props
    const {displayName, avatar, slug, status} = user

    return (
      <a href={`/chat/${slug}`} className={classes.item} onClick={this.onClick}>
        <Username
          name={displayName}
          avatar={avatar}
          statusBorderColor={colors.white}
          status={userStatusMap[status]} />
      </a>
    )
  }
}
