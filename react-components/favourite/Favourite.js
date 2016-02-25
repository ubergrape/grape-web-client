import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'

@useSheet(style)
export default class Favourite extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    id: PropTypes.number,
    favourited: PropTypes.bool,
    requestAddToFavourites: PropTypes.func.isRequired,
    requestRemoveFromFavourites: PropTypes.func.isRequired
  }

  toggleFavourited() {
    const {
      id,
      favourited,
      requestAddToFavourites,
      requestRemoveFromFavourites
    } = this.props

    if (favourited) {
      requestRemoveFromFavourites(id)
      return
    }

    requestAddToFavourites(id)
  }

  render() {
    const {favourited} = this.props
    const {classes} = this.props.sheet
    return (
      <button
        onClick={::this.toggleFavourited}
        className={classes[favourited ? 'favourited' : 'favourite']}>
      </button>
    )
  }
}
