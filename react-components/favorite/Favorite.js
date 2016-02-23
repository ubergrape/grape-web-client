import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Favorite extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    id: PropTypes.number,
    favorited: PropTypes.bool,
    addToFavorites: PropTypes.func.isRequired,
    removeFromFavorites: PropTypes.func.isRequired
  }

  toggleFavorited() {
    const {
      id,
      favorited,
      addToFavorites,
      removeFromFavorites
    } = this.props

    if (favorited) {
      removeFromFavorites(id)
      return
    }

    addToFavorites(id)
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
