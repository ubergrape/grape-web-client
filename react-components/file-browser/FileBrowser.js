import React, {Component} from 'react'

import {useSheet} from '../jss'
import style from './style'
import File from '../file-browser-file/File'

@useSheet(style)
export default class FileBrowser extends Component {
  static defaultProps = {
    show: false,
    items: []
  }
  render() {
    if (!this.props.show) return null
    console.log(this.props.items)
    return (
      <div>
        {this.props.items.map((item, i) => <File {...item} key={i} />)}
      </div>
    )
  }
}
