import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape
} from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import {Beacon} from '../intro'
import Favorite from './Favorite'

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
          defaultMessage="Pin to Favorites"
        />
      )
    case 'room':
      return (
        <FormattedMessage
          id="groupInfo"
          defaultMessage="Group Info"
        />
      )
    case 'pm':
      return (
        <FormattedMessage
          id="userProfile"
          defaultMessage="User Profile"
        />
      )
    case 'mentions':
      return (
        <FormattedMessage
          id="mentions"
          defaultMessage="Mentions"
        />
      )
    case 'labeledMessages':
      return (
        <FormattedMessage
          id="labeledMessagesTooltip"
          defaultMessage="Important Messages"
        />
      )
    default:
      return (<span />)
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
      onClick={onClick}
    />
  )
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
}

function MentionsBadge({mentions, sidebar, theme}) {
  if (!mentions || sidebar === 'mentions') return null
  return <i className={theme.classes.badge} />
}

MentionsBadge.propTypes = {
  mentions: PropTypes.number,
  sidebar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  theme: PropTypes.object.isRequired
}

function itemButtonClassName(panel, {sidebar, theme}) {
  return theme.classes[sidebar === panel ? `${panel}Active` : panel] || ''
}

function itemClickHandler(panel, {sidebar, hideSidebar, showSidebar}) {
  if (sidebar === panel) return hideSidebar
  return showSidebar.bind(null, panel)
}

export default function Items(props) {
  const {
    onFocusMessageSearch,
    onChangeMessageSearch,
    mate,
    favorite,
    mentions,
    sidebar,
    theme,
    features
  } = props
  const {type: channel} = props.channel

  const favoriteProps = {...favorite, ...props}
  const {formatMessage} = props.intl
  const {classes} = theme

  return (
    <ul className={`${classes.header} ${channel ? '' : classes.headerDisabled}`}>
      <li className={classes.favorite}>
        <Tooltip message={getTooltipMessage('favorite')}>
          <Favorite {...favoriteProps} />
        </Tooltip>
      </li>
      <li className={classes.title}>
        <Title
          channel={props.channel}
          mate={mate}
          theme={theme}
        />
      </li>
      <li className={classes.action}>
        <Tooltip message={getTooltipMessage(channel)}>
          <Button
            className={itemButtonClassName(channel, props)}
            onClick={itemClickHandler(channel, props)}
          />
        </Tooltip>
      </li>
      <li className={classes.searchAction}>
        <input
          className={`${classes.search} search-form`}
          onFocus={onFocusMessageSearch}
          onChange={onChangeMessageSearch}
          placeholder={formatMessage(messages.placeholder)}
          type="search"
        />
        <Beacon id="search" placement="bottom" shift={{top: 40, left: -120}} />
      </li>
      <li className={classes.action}>
        <Tooltip message={getTooltipMessage('mentions')}>
          <Button
            className={itemButtonClassName('mentions', props)}
            onClick={itemClickHandler('mentions', props)}
          />
          <MentionsBadge
            mentions={mentions}
            sidebar={sidebar}
            theme={theme}
          />
        </Tooltip>
      </li>
      {features.labeledMessagesList && (
        <li className={classes.action}>
          <Tooltip message={getTooltipMessage('labeledMessages')} align="right">
            <Button
              className={itemButtonClassName('labeledMessages', props)}
              onClick={itemClickHandler('labeledMessages', props)}
            />
          </Tooltip>
        </li>
      )}
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
    PropTypes.bool
  ]),
  favorite: PropTypes.object.isRequired,
  onFocusMessageSearch: PropTypes.func.isRequired,
  onChangeMessageSearch: PropTypes.func.isRequired,
  features: PropTypes.shape({
    labeledMessagesList: PropTypes.bool
  })
}

Items.defaultProps = {
  features: {}
}
