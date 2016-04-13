import React, {Component, PropTypes} from 'react'
import SharedFiles from '../shared-files/SharedFiles'
import ChannelInfo from '../channel-info/ChannelInfo'
import UserProfile from '../user-profile/UserProfile'
import Mentions from '../message-search/MessageSearch'
import Search from '../message-search/MessageSearch'
import Intercom from '../intercom/Intercom'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class Sidebar extends Component {
  static propTypes = {

  }

  constructor() {
    super()
    this.el = null
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.show) {
      case 'files':
        this.el = <SharedFiles {...nextProps} />
        break
      case 'room':
        this.el = <ChannelInfo {...nextProps} />
        break
      case 'pm':
        this.el = <UserProfile {...nextProps} />
        break
      case 'mentions': {
        const props = {
          ...nextProps,
          load: nextProps.loadMentions,
          hide: this.props.hideSidebar,
          select: nextProps.goToMessage
        }
        this.el = <Mentions {...props} />
        break
      }
      case 'search': {
        const props = {
          ...nextProps,
          load: nextProps.searchMessages,
          hide: this.props.hideSidebar,
          select: nextProps.goToMessage
        }
        this.el = <Search {...props} />
        break
      }
      case 'intercom':
        this.el = <Intercom {...nextProps} />
        break
      default:
        this.el = null
    }
  }

  render() {
    if (!this.el) return null
    return (
      <div className={this.props.sheet.classes.sidebar}>
        {this.el}
      </div>
    )
  }
}
