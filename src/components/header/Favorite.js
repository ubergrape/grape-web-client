import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import buttonIcon from '../button/icon'
import {iconSize} from './constants'

@injectSheet(({palette}) => ({
  favorite: {
    ...buttonIcon('star', {
      stroke: palette.text.primary,
      hoverStroke: palette.accent.A200,
      iconOnly: true
    }),
    fontSize: iconSize
  },
  favorited: {
    ...buttonIcon('star', {
      color: palette.secondary[700],
      hoverColor: palette.secondary[500],
      iconOnly: true
    }),
    fontSize: iconSize
  }
}))
export default class Favorite extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    id: PropTypes.number,
    favorited: PropTypes.bool,
    requestAddChannelToFavorites: PropTypes.func.isRequired,
    requestRemoveChannelFromFavorites: PropTypes.func.isRequired
  }

  static defaultProps = {
    id: null,
    favorited: false
  }

  onToggle = () => {
    const {
      id,
      favorited,
      requestAddChannelToFavorites,
      requestRemoveChannelFromFavorites
    } = this.props

    if (favorited) {
      requestRemoveChannelFromFavorites(id)
      return
    }

    requestAddChannelToFavorites(id)
  }

  render() {
    const {
      favorited,
      classes
    } = this.props

    return (
      <button
        onClick={this.onToggle}
        className={classes[favorited ? 'favorited' : 'favorite']}
      />
    )
  }
}
