import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'

@injectSheet(styles)
export default class Favorite extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    id: PropTypes.number,
    favorited: PropTypes.bool,
    requestAddChannelToFavorites: PropTypes.func.isRequired,
    requestRemoveChannelFromFavorites: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
      sheet: {classes}
    } = this.props

    return (
      <button
        onClick={this.onToggle}
        className={classes[favorited ? 'favorited' : 'favorite']}>
      </button>
    )
  }
}
