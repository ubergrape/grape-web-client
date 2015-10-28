import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'
import File from '../file-browser-file/File'

@useSheet(style)
export default class FileBrowser extends Component {
  static defaultProps = {
    show: false,
    onLoadMore: noop,
    items: []
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    if (!this.props.show) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.fileBrowser}>
        {this.props.items.map((item, i) => <File {...item} key={i} />)}
        <button onClick={::this.onLoadMore}>Show more</button>
      </div>
    )
  }

  onLoadMore() {
    this.props.onLoadMore()
  }
}
