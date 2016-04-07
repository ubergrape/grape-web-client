import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import Favorite from '../favorite/Favorite'

@useSheet(style)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    name: PropTypes.string,
    description: PropTypes.string
  }

  renderTile() {
    const {name, description} = this.props
    const title = [
      <h1>{name}</h1>
    ]
    if (description) title.push(<h2>{description}</h2>)

    return title
  }

  render() {
    return (
      <div>
        <Favorite {...this.props}/>
        {this.renderTile()}
      </div>
    )
  }
}
