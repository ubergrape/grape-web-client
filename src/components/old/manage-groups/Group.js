import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import GroupName from '../avatar-name/GroupName'
import { styles } from './groupTheme'

const messages = defineMessages({
  unjoined: {
    id: 'manageGroupsJoinableButton',
    defaultMessage: 'join',
    description: 'Manage Groups Dialog: join button label',
  },
  joined: {
    id: 'manageGroupsJoinedButton',
    defaultMessage: 'leave',
    description: 'Manage Groups Dialog: leave button label',
  },
})

class Group extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    group: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  onClick = () => {
    const {
      group: { id, isPublic },
      onSelect,
    } = this.props

    onSelect(id, !isPublic)
  }

  render() {
    const {
      group,
      intl: { formatMessage },
      classes,
      type,
    } = this.props
    return (
      <div className={classes.item}>
        <div className={classes.group}>
          <GroupName
            {...group}
            showPrivateStatus
            showRoomInfo
            theme={{ classes }}
          />
        </div>
        <button className={classes[type]} onClick={this.onClick}>
          {formatMessage(messages[type])}
        </button>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(Group))
