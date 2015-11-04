import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'
import style from './style'
import SharedFile from '../shared-files-file/SharedFile'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

@useSheet(style)
export default class SharedFiles extends Component {
  static defaultProps = {
    show: false,
    total: undefined,
    items: [],
    limit: 20,
    images: {},
    isLoading: false,
    onRequestFiles: noop,
    onClose: noop
  }

  constructor(props) {
    super(props)
    this.offset = props.items.length
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillReceiveProps(nextProps) {
    this.offset = nextProps.items.length
    // It was hidden, we show it now.
    if (nextProps.show && !this.props.show) {
      if (!this.offset) this.requestFiles(nextProps)
    }
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
          {this.props.items.map((item, i) => <SharedFile {...item} key={i} />)}
          {this.renderEmpty()}
          {this.renderLoadMore()}
          {this.props.isLoading && <Spinner image={this.props.images.spinner} />}
        </div>
      </SidebarPanel>
    )
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

  requestFiles(props = this.props) {
    props.onRequestFiles({
      offset: this.offset,
      limit: props.limit
    })
  }

  onLoadMore() {
    this.requestFiles()
  }

  onClose() {
    this.props.onClose()
  }
}
