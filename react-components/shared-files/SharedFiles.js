import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'
import SharedFile from '../shared-files-file/SharedFile'

@useSheet(style)
export default class SharedFiles extends Component {
  static defaultProps = {
    show: false,
    hasMore: false,
    onLoadMore: noop,
    items: []
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    if (!this.props.show) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.sharedFiles}>
        {this.props.items.map((item, i) => <SharedFile {...item} key={i} />)}
        {this.renderEmpty()}
        {this.renderLoadMore()}
      </div>
    )
  }

  renderLoadMore() {
    if (!this.props.hasMore) return null
    const {classes} = this.props.sheet
    return (
      <div className={classes.loadMoreContainer}>
        <button
          onClick={::this.onLoadMore}
          className={classes.button}>
          Show more
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes} = this.props.sheet
    if (this.props.items.length) return null
    return (
      <div className={classes.empty}>
        No shared files.
      </div>
    )
  }

  onLoadMore() {
    this.props.onLoadMore()
  }
}
