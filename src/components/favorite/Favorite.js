import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Favorite extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    id: PropTypes.number,
    favorited: PropTypes.bool,
    requestAddChannelToFavorites: PropTypes.func.isRequired,
    requestRemoveChannelFromFavorites: PropTypes.func.isRequired
  }

  toggleFavorited() {
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
    const {favorited} = this.props
    const {classes} = this.props.sheet
    return (
      <button
        onClick={::this.toggleFavorited}
        className={classes[favorited ? 'favorited' : 'favorite']}>
      </button>
    )
  }
}
