import React, {PropTypes} from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape
} from 'react-intl'
import listenOutsideClick from 'grape-web/lib/outside-click'

import Tooltip from '../tooltip/HoverTooltip'
import Favorite from '../favorite/Favorite'

const messages = defineMessages({
  placeholder: {
    id: 'searchMessages',
    defaultMessage: 'Search messages'
  }
})

function getTooltipMessage(name) {
  switch (name) {
    case 'favorite':
      return (
        <FormattedMessage
          id="pinToFavorites"
          description="Tooltip text"
          defaultMessage="Pin to Favorites" />
      )
    case 'invite':
      return (
        <FormattedMessage
          id="addUsersToGroup"
          description="Tooltip text"
          defaultMessage="Add users to Group" />
      )
    case 'room':
      return (
        <FormattedMessage
          id="groupInfo"
          defaultMessage="Group Info" />
      )
    case 'pm':
      return (
        <FormattedMessage
          id="userProfile"
          defaultMessage="User Profile" />
      )
    case 'files':
      return (
        <FormattedMessage
          id="sharedFiles"
          defaultMessage="Shared Files" />
      )
    case 'mentions':
      return (
        <FormattedMessage
          id="mentions"
          defaultMessage="Mentions" />
      )
    case 'support':
      return (
        <FormattedMessage
          id="supportInfo"
          defaultMessage="Support Info" />
      )
    default:
      return (<span></span>)
  }
}

function Title({channel, mate, theme}) {
  const title = (
    <h1 className={theme.classes.name}>
      {channel.name || mate.displayName}
    </h1>
  )
  if (!channel.description) return title

  return (
    <div>
      {title}
      <h2 className={theme.classes.description}>
        {channel.description}
      </h2>
    </div>
  )
}

Title.propTypes = {
  channel: PropTypes.object.isRequired,
  mate: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

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

function Input({theme, onFocus, onChange, onClick, placeholder}) {
  return (
    <input
      onClick={onClick}
      className={`${theme.classes.search} search-form`}
      onFocus={onFocus}
      onChange={onChange}
      placeholder={placeholder}
      type="search" />
  )
}

Input.propTypes = {
  theme: PropTypes.object.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
}

Input.defaultProps = {
  placeholder: ''
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

const Search = listenOutsideClick(Input)

function itemButtonClassName(panel, {sidebar, theme}) {
  return theme.classes[sidebar === panel ? `${panel}Active` : panel]
}

function itemClickHandler(panel, {sidebar, hideSidebar, showInSidebar}) {
  if (sidebar === panel) return hideSidebar
  return showInSidebar.bind(null, panel)
}

export default function Items(props) {
  const {
    showChannelMembersInvite,
    onClickOutsideMessageSearch,
    onFocusMessageSearch,
    onChangeMessageSearch,
    support,
    mate,
    favorite,
    mentions,
    sidebar,
    theme
  } = props
  const {type: channel} = props.channel

  const favoriteProps = {...favorite, ...props}
  const {formatMessage} = props.intl
  const {classes} = theme

  const onSupportClick = (e) => {
    if (support.type === 'intercom') {
      e.preventDefault()
      itemClickHandler('intercom', props)()
    }
  }

  return (
    <ul
      className={`${classes.header} ${channel ? '' : classes.headerDisabled}`}
      id="intro-step4">
      <li className={classes.favorite}>
        <Tooltip message={getTooltipMessage('favorite')}>
          <Favorite {...favoriteProps}/>
        </Tooltip>
      </li>
      <li className={classes.title}>
        <Title
          channel={props.channel}
          mate={mate}
          theme={theme} />
      </li>
      <li className={classes.action}>
        <Tooltip message={getTooltipMessage('invite')}>
          <Button
            className={classes.invite}
            onClick={showChannelMembersInvite} />
        </Tooltip>
      </li>
      <li className={classes.action}>
        <Tooltip message={getTooltipMessage(channel)}>
          <Button
            className={itemButtonClassName(channel || 'room', props)}
            onClick={itemClickHandler(channel, props)} />
        </Tooltip>
      </li>
      <li className={classes.action}>
        <Tooltip message={getTooltipMessage('files')}>
          <Button
            className={itemButtonClassName('files', props)}
            onClick={itemClickHandler('files', props)} />
        </Tooltip>
      </li>
      <li className={classes.searchAction}>
        <Search
          theme={theme}
          onOutsideClick={onClickOutsideMessageSearch}
          placeholder={formatMessage(messages.placeholder)}
          onFocus={onFocusMessageSearch}
          onChange={onChangeMessageSearch} />
      </li>
      <li className={classes.action}>
        <Tooltip message={getTooltipMessage('mentions')}>
          <Button
            className={itemButtonClassName('mentions', props)}
            onClick={itemClickHandler('mentions', props)} />
          <MentionsBadge
            mentions={mentions}
            sidebar={sidebar}
            theme={theme} />
        </Tooltip>
      </li>
      <li className={classes.action}>
        <Tooltip
          message={getTooltipMessage('support')}
          align="right">
          <a
            href={support.href}
            className={itemButtonClassName('intercom', props)}
            onClick={onSupportClick}>
          </a>
        </Tooltip>
      </li>
    </ul>
  )
}

Items.propTypes = {
  intl: intlShape.isRequired,
  theme: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  mate: PropTypes.object.isRequired,
  mentions: PropTypes.number,
  sidebar: PropTypes.oneOfType([
    PropTypes.string,
    React.PropTypes.bool
  ]),
  favorite: PropTypes.object.isRequired,
  support: PropTypes.object.isRequired,
  showChannelMembersInvite: PropTypes.func.isRequired,
  onClickOutsideMessageSearch: PropTypes.func.isRequired,
  onFocusMessageSearch: PropTypes.func.isRequired,
  onChangeMessageSearch: PropTypes.func.isRequired
}
