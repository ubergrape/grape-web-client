import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPMsManager: PropTypes.func.isRequired,
    recent: PropTypes.array.isRequired
  }

  renderManageButtons() {
    const {
      sheet,
      showChannelsManager,
      showPMsManager
    } = this.props

    return (
      <ul>
        <li>
          <button
            className={sheet.classes.contacts}
            onClick={showPMsManager}>
            Contacts
          </button>
        </li>
        <li>
          <button
            className={sheet.classes.groups}
            onClick={showChannelsManager}>
            Groups
          </button>
        </li>
      </ul>
    )
  }

  renderRecentList() {
    return (
      <ol>
        {
          this.props.recent.map(channel => {
            return (
              <li>
                {channel.name || channel.displayName || ''}
              </li>
            )
          })
        }
      </ol>
    )
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.navigation}>
        {this.renderManageButtons()}
        {this.renderRecentList()}
      </div>
    )
  }
}
