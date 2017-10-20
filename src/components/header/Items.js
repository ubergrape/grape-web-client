import PropTypes from 'prop-types'
import React from 'react'
import {intlShape} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'

import {Beacon} from '../intro'
import FavoriteButton from './FavoriteButton'
import Title from './Title'
import MentionsButton from './MentionsButton'
import LabeledMessagesButton from './LabeledMessagesButton'
import InfoButton from './InfoButton'
import Search from './Search'
import {height} from './constants'

export const styles = ({palette}) => ({
  header: {
    display: 'flex',
    height,
    padding: [0, sizes.spacer.s],
    alignItems: 'center',
    borderBottom: [1, 'solid', palette.grey[300]],
    flexShrink: 0
  },
  headerDisabled: {
    opacity: 0.4,
    WebkitFilter: 'grayscale(100%)',
    filter: 'grayscale(100%)',
    pointerEvents: 'none'
  },
  favorite: {
    listStyle: 'none',
    flexShrink: 0,
    position: 'relative',
    marginRight: sizes.spacer.xs
  },
  title: {
    listStyle: 'none',
    overflow: 'hidden',
    flexGrow: 1,
    minWidth: 50,
    paddingLeft: sizes.spacer.s
  },
  action: {
    listStyle: 'none',
    position: 'relative',
    flexShrink: 0,
    marginLeft: sizes.spacer.xs,
    lineHeight: 0
  },
  search: {
    listStyle: 'none',
    marginLeft: sizes.spacer.s,
    minWidth: 190
  }
})

const itemClickHandler = (panel, {sidebar, hideSidebar, showSidebar}) => (
  sidebar === panel ? hideSidebar : showSidebar.bind(null, panel)
)

function Items(props) {
  const {
    onFocusMessageSearch,
    onChangeMessageSearch,
    requestAddChannelToFavorites,
    requestRemoveChannelFromFavorites,
    mate,
    favorite,
    mentions,
    sidebar,
    classes,
    features,
    intl,
    channel
  } = props

  return (
    <ul className={`${classes.header} ${channel ? '' : classes.headerDisabled}`}>
      <li className={classes.favorite}>
        <FavoriteButton
          id={favorite.id}
          favorited={favorite.favorited}
          onFavorize={requestAddChannelToFavorites}
          onUnfavorize={requestRemoveChannelFromFavorites}
        />
      </li>
      <li className={classes.title}>
        <Title
          channel={channel}
          mate={mate}
        />
      </li>
      <li className={classes.action}>
        <InfoButton
          onClick={itemClickHandler(channel.type, props)}
          isSelected={sidebar === channel.type}
          channel={channel.type}
        />
      </li>
      <li className={classes.search}>
        <Search
          onFocus={onFocusMessageSearch}
          onChange={onChangeMessageSearch}
          intl={intl}
        />
        <Beacon id="search" placement="bottom" shift={{top: 40, left: -120}} />
      </li>
      <li className={classes.action}>
        <MentionsButton
          onClick={itemClickHandler('mentions', props)}
          isSelected={sidebar === 'mentions'}
          mentions={mentions}
        />
      </li>
      {features.labeledMessagesList && (
        <li className={classes.action}>
          <LabeledMessagesButton
            isSelected={sidebar === 'labeledMessages'}
            onClick={itemClickHandler('labeledMessages', props)}
          />
        </li>
      )}
    </ul>
  )
}

Items.propTypes = {
  intl: intlShape.isRequired,
  classes: PropTypes.object.isRequired,
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
  }),
  requestAddChannelToFavorites: PropTypes.func.isRequired,
  requestRemoveChannelFromFavorites: PropTypes.func.isRequired
}

Items.defaultProps = {
  features: {},
  mentions: 0,
  sidebar: undefined
}

export default injectSheet(styles)(Items)
