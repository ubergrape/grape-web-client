import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import pick from 'lodash/object/pick'

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

function itemButtonClassName(panel, {sidebar, theme}) {
  return theme.classes[sidebar === panel ? `${panel}Active` : panel]
}

function itemClickHandler(panel, {sidebar, hideSidebar, showInSidebar}) {
  if (sidebar === panel) return hideSidebar
  return showInSidebar.bind(null, panel)
}

function MentionsBadge({mentions, sidebar, theme}) {
  if (!mentions || sidebar === 'mentions') return null
  return <i className={theme.classes.badge} />
}

MentionsBadge.propTypes = {
  mentions: PropTypes.number,
  sidebar: PropTypes.oneOfType([
    PropTypes.string,
    React.PropTypes.bool
  ]),
  theme: PropTypes.object.isRequired
}


function Items(props) {
  const {
    showChannelMembersInvite,
    onClickOutsideMessageSearch,
    onFocusMessageSearch,
    onChangeMessageSearch,
    onSupportClick,
    support,
    favorite,
    theme
  } = props
  const {type: channel} = props.channel

  if (!channel) return null

  const favoriteProps = {...favorite, ...props}
  const {classes} = theme
  return (
    <ul className={classes.header}>
      <li className={classes.favorite}>
        <Favorite {...favoriteProps}/>
      </li>
      <li className={classes.title}>
        <Title {...pick(props, Object.keys(Title.propTypes))} />
      </li>
      <li className={classes.action}>
        <Button
          className={classes.invite}
          onClick={showChannelMembersInvite} />
      </li>
      <li className={classes.action}>
        <Button
          className={itemButtonClassName(channel, props)}
          onClick={itemClickHandler(channel, props)} />
      </li>
      <li className={classes.action}>
        <Button
          className={itemButtonClassName('files', props)}
          onClick={itemClickHandler('files', props)} />
      </li>
      <li className={classes.searchAction}>
        <Search
          {...pick(props, Object.keys(Input.propTypes))}
          onOutsideClick={onClickOutsideMessageSearch}
          placeholder="Search messages"
          onFocus={onFocusMessageSearch}
          onChange={onChangeMessageSearch} />
      </li>
      <li className={classes.action}>
        <Button
          className={itemButtonClassName('mentions', props)}
          onClick={itemClickHandler('mentions', props)} />
        <MentionsBadge
          {...pick(props, Object.keys(MentionsBadge.propTypes))} />
      </li>
      <li className={classes.action}>
        <a
          href={support.href}
          className={itemButtonClassName('intercom', props)}
          onClick={onSupportClick}>
        </a>
      </li>
    </ul>
  )
}

Items.propTypes = {
  theme: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  favorite: PropTypes.object.isRequired,
  support: PropTypes.object.isRequired,
  showChannelMembersInvite: PropTypes.func.isRequired,
  onClickOutsideMessageSearch: PropTypes.func.isRequired,
  onFocusMessageSearch: PropTypes.func.isRequired,
  onChangeMessageSearch: PropTypes.func.isRequired,
  onSupportClick: PropTypes.func.isRequired
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

  onFocusMessageSearch = ({target}) => {
    this.props.showInSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onChangeMessageSearch = ({target}) => {
    this.props.updateMessageSearchQuery(target.value)
  }

  onClickOutsideMessageSearch = ({target}) => {
    const {sidebar, hideSidebar} = this.props
    if (sidebar !== 'search') return
    const {value} = findDOMNode(target)
    if (!value) hideSidebar()
  }

  onSupportClick = (e) => {
    if (this.props.support.type === 'intercom') {
      e.preventDefault()
      itemClickHandler('intercom', this.props)()
    }
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.headerWrapper}>
        <Items
          {...this.props}
          onClickOutsideMessageSearch={this.onClickOutsideMessageSearch}
          onChangeMessageSearch={this.onChangeMessageSearch}
          onFocusMessageSearch={this.onFocusMessageSearch}
          onSupportClick={this.onSupportClick}
          theme={{classes}} />
      </div>
    )
  }
}
