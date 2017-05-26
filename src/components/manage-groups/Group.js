import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Roomname from '../avatar-name/Roomname'
import {styles} from './groupTheme'

const messages = defineMessages({
  joinable: {
    id: 'manageGroupsJoinableBtn',
    defaultMessage: 'join',
    description: 'Manage Groups Dialog: join button label'
  },
  joined: {
    id: 'manageGroupsJoinedBtn',
    defaultMessage: 'leave',
    description: 'Manage Groups Dialog: leave button label'
  }
})

@injectSheet(styles)
@injectIntl
export default class Group extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    group: PropTypes.object.isRequired,
    sheet: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  onClick = () => {
    const {
      group: {slug, id},
      onSelect,
      type
    } = this.props

    onSelect(
      type === 'joined' ? id : slug
    )
  }

  render() {
    const {
      group,
      intl: {formatMessage},
      sheet: {classes},
      type
    } = this.props
    return (
      <div className={classes.item} onClick={this.onClick} tabIndex="0">
        <div className={classes.group}>
          <Roomname
            {...group}
            showPrivateStatus
            showRoomInfo
          />
        </div>
        <button className={classes[type]} onClick={this.onClick}>
          {formatMessage(messages[type])}
        </button>
      </div>
    )
  }
}
