import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {grayDark, white} from 'grape-theme/dist/base-colors'
import {link} from 'grape-theme/dist/web-colors'
import injectSheet from 'grape-web/lib/jss'

import {userStatusMap} from '../../constants/app'
import Username from '../avatar-name/Username'

@injectSheet({
  contact: {
    display: 'block',
    color: grayDark,
    padding: [10, 20],
    '&:hover, &:focus': {
      isolate: false,
      backgroundColor: link,
      '& $name': {
        isolate: false,
        color: white
      },
      '&, & *': {
        isolate: false,
        cursor: 'pointer'
      }
    }
  },
  name: {}
})
export default class Contact extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  }

  onClick = () => {
    const {
      onSelect,
      user: {id}
    } = this.props

    onSelect({id})
  }

  render() {
    const {
      classes,
      user
    } = this.props
    const {displayName, avatar, status} = user

    return (
      <div className={classes.contact} onClick={this.onClick} tabIndex="0">
        <Username
          name={displayName}
          avatar={avatar}
          statusBorderColor={white}
          status={userStatusMap[status]}
          theme={{classes}}
        />
      </div>
    )
  }
}
