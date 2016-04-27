import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import Favorite from '../favorite/Favorite'
import listenOutsideClick from '../outside-click/listenOutsideClick'
import Button from './Button'

function Input({sheet, onFocus, onChange, onClick, placeholder}) {
  return (
    <input
      onClick={onClick}
      className={sheet.classes.search}
      onFocus={onFocus}
      onChange={onChange}
      placeholder={placeholder}
      type="search" />
  )
}

Input.propTypes = {
  sheet: PropTypes.object.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  placeholder: PropTypes.string
}

const Search = listenOutsideClick(Input)

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
    mentions: PropTypes.number,
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

  onSearchOutsideClick({target}) {
    const {sidebar, hideSidebar} = this.props
    if (sidebar !== 'search') return
    const {value} = findDOMNode(target)
    if (!value) hideSidebar()
  }

  getHandler(panel) {
    if (this.props.sidebar === panel) return this.props.hideSidebar
    return this.props.showInSidebar.bind(null, panel)
  }

  getClassName(panel) {
    const {sidebar, sheet} = this.props
    return sheet.classes[sidebar === panel ? `${panel}Active` : panel]
  }

  renderTile() {
    const {channel, sheet} = this.props
    const title = [
      (<h1
        className={sheet.classes.name}
        key="t">
        {channel.name}
      </h1>)
    ]
    if (channel.description) {
      title.push((
        <h2
          className={sheet.classes.description}
          key="d">
          {channel.description}
        </h2>
      ))
    }

    return title
  }

  renderInfoButton() {
    const {type} = this.props.channel
    const {classes} = this.props.sheet
    return (
      <Button
        className={type ? this.getClassName(type) : classes.infoDisabled}
        onClick={type ? this.getHandler(type) : noop} />
    )
  }

  renderMentionsBadge() {
    const {mentions, sidebar, sheet} = this.props
    if (!mentions || sidebar === 'mentions') return null
    return <i className={sheet.classes.badge} />
  }

  render() {
    const {
      showChannelMembersInvite,
      support,
      favorite,
      sheet
    } = this.props

    const favoriteProps = {...favorite, ...this.props}
    return (
      <ul className={sheet.classes.header}>
        <li>
          <Favorite {...favoriteProps}/>
        </li>
        <li className={sheet.classes.title}>
          {this.renderTile()}
        </li>
        <li className={sheet.classes.action}>
          <Button
            className={sheet.classes.invite}
            onClick={showChannelMembersInvite} />
        </li>
        <li className={sheet.classes.action}>
          {this.renderInfoButton()}
        </li>
        <li className={sheet.classes.action}>
          <Button
            className={this.getClassName('files')}
            onClick={this.getHandler('files')} />
        </li>
        <li className={sheet.classes.searchAction}>
          <Search
            {...this.props}
            onOutsideClick={::this.onSearchOutsideClick}
            placeholder="Search messages"
            onFocus={::this.onMessageSearchFocus}
            onChange={::this.onMessageSearchChange} />
        </li>
        <li className={sheet.classes.action}>
          <Button
            className={this.getClassName('mentions')}
            onClick={this.getHandler('mentions')} />
          {this.renderMentionsBadge()}
        </li>
        <li className={sheet.classes.action}>
          <a
            href={support.href}
            className={this.getClassName('intercom')}
            onClick={::this.onSupportClick}>
          </a>
        </li>
      </ul>
    )
  }
}
