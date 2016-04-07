import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import Favorite from '../favorite/Favorite'


@useSheet(style)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object
  }

  render() {
    return (
      <div>
        <Favorite {...this.props}/>
        asdsad
      </div>
    )
  }
}
