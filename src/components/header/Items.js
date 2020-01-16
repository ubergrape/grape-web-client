import PropTypes from 'prop-types'
import React from 'react'
import { intlShape } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'

import { Beacon } from '../intro'
import FavoriteButton from './FavoriteButton'
import Title from './Title'
import MentionsButton from './MentionsButton'
import LabeledMessagesButton from './LabeledMessagesButton'
import PinButton from './PinButton'
import InfoButton from './InfoButton'
import VideoConferenceButton from './VideoConferenceButton'
import Search from './Search'
import Divider from './Divider'
import { height } from './constants'
import { sidebarWidth, sidebarWidthXl } from '../app-layout'

export const styles = ({ palette }) => ({
  header: {
    display: 'flex',
    height,
    alignItems: 'center',
    borderBottom: [1, 'solid', palette.text.divider],
    flexShrink: 0,
  },
  headerDisabled: {
    opacity: 0.4,
    WebkitFilter: 'grayscale(100%)',
    filter: 'grayscale(100%)',
    pointerEvents: 'none',
  },
  favorite: {
    listStyle: 'none',
    flexShrink: 0,
    position: 'relative',
    margin: [0, sizes.spacer.xs, 0, sizes.spacer.s],
  },
  videoConference: {
    listStyle: 'none',
    flexShrink: 0,
    position: 'relative',
    margin: [0, sizes.spacer.xs, 0, sizes.spacer.s],
  },
  title: {
    display: 'flex',
    listStyle: 'none',
    flexGrow: 1,
    minWidth: 50,
    paddingRight: sizes.spacer.s,
  },
  pinButton: {
    flexShrink: 0,
  },
  action: {
    listStyle: 'none',
    position: 'relative',
    flexShrink: 0,
    lineHeight: 0,
    marginLeft: sizes.spacer.xs,
  },
  search: {
    listStyle: 'none',
    margin: [0, 0, 0, sizes.spacer.xs],
    flexGrow: 1,
  },
  sidebarActions: {
    display: 'flex',
    marginRight: sizes.spacer.xs,
    width: sidebarWidthXl - sizes.spacer.xs,
    height: '100%',
    flexShrink: 0,
    alignItems: 'center',
  },
  [`@media (max-width: ${sizes.screenWidth.xl}px)`]: {
    sidebarActions: {
      width: sidebarWidth - sizes.spacer.xs,
    },
  },
})

const itemClickHandler = (panel, { sidebar, hideSidebar, showSidebar }) =>
  sidebar === panel ? hideSidebar : () => showSidebar(panel)

function Items(props) {
  const {
    onFocusMessageSearch,
    onChangeMessageSearch,
    requestAddChannelToFavorites,
    requestRemoveChannelFromFavorites,
    partner,
    favorite,
    mentions,
    sidebar,
    classes,
    permissions,
    intl,
    channel,
    user,
    colors,
    inactive,
    features,
    showVideoConferenceWarning,
    showToastNotification,
  } = props

  return (
    <ul
      className={`${classes.header} ${channel ? '' : classes.headerDisabled}`}
    >
      <li className={classes.favorite}>
        <FavoriteButton
          id={favorite.id}
          favorited={favorite.favorited}
          onFavorize={requestAddChannelToFavorites}
          onUnfavorize={requestRemoveChannelFromFavorites}
          colors={colors}
        />
      </li>
      <li className={classes.title}>
        <Title channel={channel} partner={partner} />
        {channel.hasPinnedMessages && (
          <PinButton
            onClick={itemClickHandler(channel.type, props)}
            className={classes.pinButton}
          />
        )}
      </li>
      {features && features.videoconference && (
        <li className={classes.videoConference}>
          <VideoConferenceButton
            channel={channel}
            inactive={inactive}
            user={user}
            colors={colors}
            intl={intl}
            showToastNotification={showToastNotification}
            showVideoConferenceWarning={showVideoConferenceWarning}
          />
        </li>
      )}
      <ul className={classes.sidebarActions}>
        <Divider />
        <li className={classes.action}>
          <InfoButton
            onClick={itemClickHandler(channel.type, props)}
            isSelected={sidebar === channel.type}
            channel={channel.type}
            colors={colors}
          />
        </li>
        <li className={classes.search}>
          <Search
            onFocus={onFocusMessageSearch}
            onChange={onChangeMessageSearch}
            intl={intl}
          />
          <Beacon
            id="search"
            placement="bottom"
            shift={{ top: 40, left: -120 }}
          />
        </li>
        <li className={classes.action}>
          <MentionsButton
            onClick={itemClickHandler('mentions', props)}
            isSelected={sidebar === 'mentions'}
            mentions={mentions}
            colors={colors}
          />
        </li>
        {permissions.canSeeLabels && (
          <li className={classes.action}>
            <LabeledMessagesButton
              isSelected={sidebar === 'labeledMessages'}
              onClick={itemClickHandler('labeledMessages', props)}
              colors={colors}
            />
          </li>
        )}
      </ul>
    </ul>
  )
}

Items.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  partner: PropTypes.object.isRequired,
  colors: PropTypes.object,
  mentions: PropTypes.number,
  sidebar: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  features: PropTypes.object,
  favorite: PropTypes.object.isRequired,
  inactive: PropTypes.bool.isRequired,
  onFocusMessageSearch: PropTypes.func.isRequired,
  onChangeMessageSearch: PropTypes.func.isRequired,
  permissions: PropTypes.object,
  requestAddChannelToFavorites: PropTypes.func.isRequired,
  requestRemoveChannelFromFavorites: PropTypes.func.isRequired,
  showVideoConferenceWarning: PropTypes.func.isRequired,
  showToastNotification: PropTypes.func.isRequired,
}

Items.defaultProps = {
  permissions: {},
  mentions: 0,
  sidebar: undefined,
  colors: {},
  features: undefined,
}

export default injectSheet(styles)(Items)
