import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'
import style from './sharedFilesStyle'
import SharedFile from './SharedFile'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

@useSheet(style)
export default class SharedFiles extends Component {
  static propTypes = {
    show: PropTypes.bool,
    total: PropTypes.number,
    sheet: PropTypes.object,
    images: PropTypes.object,
    items: PropTypes.array,
    hideSharedFiles: PropTypes.func,
    isLoading: PropTypes.bool
  }

  componentWillReceiveProps(nextProps) {
    // It was hidden, we show it now.
    const show = nextProps.show && !this.props.show
    const reset = nextProps.show && !nextProps.items.length && nextProps.total == null
      && this.props.total != null
    if (show || reset) this.load(nextProps)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onLoadMore() {
    this.load()
  }

  onClose() {
    this.props.hideSharedFiles()
  }

  load(props = this.props) {
    props.loadSharedFiles({
      offset: props.items.length,
      limit: props.limit
    })
  }

  renderFiles() {
    return this.props.items.map(item => <SharedFile {...item} key={item.id} />)
  }

  renderLoadMore() {
    if (!this.props.total || this.props.items.length >= this.props.total) return null
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
    if (this.props.total !== 0) return null
    return (
      <div className={classes.empty}>
        No shared files.
      </div>
    )
  }

  render() {
    if (!this.props.show) return null
    const {classes} = this.props.sheet
    return (
      <SidebarPanel
        title="Shared Files"
        images={this.props.images}
        onClose={::this.onClose}>
        <div className={classes.sharedFiles}>
          {this.renderFiles()}
          {this.renderEmpty()}
          {this.renderLoadMore()}
          {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
        </div>
      </SidebarPanel>
    )
  }
}
