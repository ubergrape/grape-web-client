import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import color from 'color'
import colors from 'grape-theme/dist/base-colors'

import buttonIcon from '../button/icon'
import {iconSize} from './constants'

@injectSheet({
  favorite: {
    ...buttonIcon('star', {
      color: colors.grayBlue,
      hoverColor: colors.grayBlueDark,
      iconOnly: true
    }),
    fontSize: iconSize
  },
  favorited: {
    ...buttonIcon('star', {
      color: colors.orange,
      hoverColor: color(colors.orange).lighten(0.2).hexString(),
      iconOnly: true
    }),
    fontSize: iconSize
  }
})
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
