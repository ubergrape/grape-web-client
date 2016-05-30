import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import Favorite from '../favorite/Favorite'
import listenOutsideClick from '../outside-click/listenOutsideClick'

function Input({sheet, onFocus, onChange, onClick, placeholder}) {
  return (
    <input
      onClick={onClick}
      className={`${sheet.classes.search} search-form`}
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
  onClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}

Input.defaultProps = {
  placeholder: ''
}

const Search = listenOutsideClick(Input)

function Button({onClick, className}) {
  return (
    <button
      className={className}
      onClick={onClick} />
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
}

function Title({channel, mate, sheet}) {
  const title = (
    <h1 className={sheet.classes.name}>
      {channel.name || mate.displayName}
    </h1>
  )
  if (!channel.description) return title

  return (
    <div>
      {title}
      <h2 className={sheet.classes.description}>
        {channel.description}
      </h2>
    </div>
  )
}

Title.propTypes = {
  channel: PropTypes.object.isRequired,
  mate: PropTypes.object.isRequired,
  sheet: PropTypes.object.isRequired
}

@useSheet(style)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    channel: PropTypes.object.isRequired,
    mate: PropTypes.object.isRequired,
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

  onFocusMessageSearch({target}) {
    this.props.showInSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onChangeMessageSearch({target}) {
    this.props.updateMessageSearchQuery(target.value)
  }

  onClickOutsideMessageSearch({target}) {
    const {sidebar, hideSidebar} = this.props
    if (sidebar !== 'search') return
    const {value} = findDOMNode(target)
    if (!value) hideSidebar()
  }

  onSupportClick(e) {
    if (this.props.support.type === 'intercom') {
      e.preventDefault()
      this.getOnClickHandler('intercom')()
    }
  }

  getOnClickHandler(panel) {
    if (this.props.sidebar === panel) return this.props.hideSidebar
    return this.props.showInSidebar.bind(null, panel)
  }

  getButtonClassName(panel) {
    const {sidebar, sheet} = this.props
    return sheet.classes[sidebar === panel ? `${panel}Active` : panel]
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
      favorite
    } = this.props
    const {type: channel} = this.props.channel

    const {classes} = this.props.sheet
    const favoriteProps = {...favorite, ...this.props}
    return (
      <div className={classes.headerWrapper}>
        {channel && (
          <ul className={classes.header}>
            <li className={classes.favorite}>
              <Favorite {...favoriteProps}/>
            </li>
            <li className={classes.title}>
              <Title {...this.props} />
            </li>
            <li className={classes.action}>
              <Button
                className={classes.invite}
                onClick={showChannelMembersInvite} />
            </li>
            <li className={classes.action}>
              <Button
                className={this.getButtonClassName(channel)}
                onClick={this.getOnClickHandler(channel)} />
            </li>
            <li className={classes.action}>
              <Button
                className={this.getButtonClassName('files')}
                onClick={this.getOnClickHandler('files')} />
            </li>
            <li className={classes.searchAction}>
              <Search
                {...this.props}
                onOutsideClick={::this.onClickOutsideMessageSearch}
                placeholder="Search messages"
                onFocus={::this.onFocusMessageSearch}
                onChange={::this.onChangeMessageSearch} />
            </li>
            <li className={classes.action}>
              <Button
                className={this.getButtonClassName('mentions')}
                onClick={this.getOnClickHandler('mentions')} />
              {this.renderMentionsBadge()}
            </li>
            <li className={classes.action}>
              <a
                href={support.href}
                className={this.getButtonClassName('intercom')}
                onClick={::this.onSupportClick}>
              </a>
            </li>
          </ul>
        )}
      </div>
    )
  }
}
