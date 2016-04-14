import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import Favorite from '../favorite/Favorite'
import Button from './Button'

@useSheet(style)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    channel: PropTypes.object.isRequired,
    favorite: PropTypes.object.isRequired,
    support: PropTypes.object.isRequired,
    sidebar: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]),
    showChannelMembersInvite: PropTypes.func,
    updateMessageSearchQuery: PropTypes.func,
    hideIntercom: PropTypes.func,
    showInSidebar: PropTypes.func,
    hideSidebar: PropTypes.func
  }

  componentWillMount() {
    // Hide intercom, because it keeps state outside of app.
    const {support, hideIntercom} = this.props
    if (support.type === 'intercom') hideIntercom()
  }

  onMessageSearchFocus({target}) {
    this.props.showInSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onMessageSearchChange({target}) {
    this.props.updateMessageSearchQuery(target.value)
  }

  onSupportClick(e) {
    if (this.props.support.type === 'intercom') {
      e.preventDefault()
      this.getHandler('intercom')()
    }
  }

  getHandler(panel) {
    if (this.props.sidebar === panel) return this.props.hideSidebar
    return this.props.showInSidebar.bind(null, panel)
  }

  renderTile() {
    const {name, description} = this.props.channel
    const title = [
      <h1 key="t">{name}</h1>
    ]
    if (description) title.push(<h2 key="d">{description}</h2>)

    return title
  }

  render() {
    const {
      showChannelMembersInvite,
      support,
      channel,
      favorite,
      sheet
    } = this.props

    const favoriteProps = {...favorite, ...this.props}
    return (
      <div className={sheet.classes.header}>
        <div>
          <Favorite {...favoriteProps}/>
        </div>
        <div className={sheet.classes.title}>
          {this.renderTile()}
        </div>
        <ul className={sheet.classes.actions}>
          <li className={sheet.classes.action}>
            <Button
              className={`${sheet.classes.invite}`}
              onClick={showChannelMembersInvite} />
          </li>
          <li className={sheet.classes.action}>
            <Button
              className={`${sheet.classes.info}`}
              onClick={this.getHandler(channel.type)} />
          </li>
          <li className={sheet.classes.action}>
            <Button
              className={`${sheet.classes.files}`}
              onClick={this.getHandler('files')} />
          </li>
          <li className={sheet.classes.action}>
            <input
              onFocus={::this.onMessageSearchFocus}
              onChange={::this.onMessageSearchChange}
              type="search" />
          </li>
          <li className={sheet.classes.action}>
            <Button
              className={`${sheet.classes.mentions}`}
              onClick={this.getHandler('mentions')} />
          </li>
          <li className={sheet.classes.action}>
            <a
              href={support.href}
              className={`${sheet.classes.support}`}
              onClick={::this.onSupportClick}>
            </a>
          </li>
        </ul>
      </div>
    )
  }
}
