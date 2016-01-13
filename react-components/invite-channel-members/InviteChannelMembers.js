import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class InviteChannelMembers extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  render() {
    console.log(this.props)
    return (
      <div>Invite list</div>
    )
  }
}
