import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'
import {styles} from './sharedFilesTheme'
import SharedFile from './SharedFile'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import {ShowMore} from '../i18n/i18n'

const messages = defineMessages({
  title: {
    id: 'sharedFiles',
    defaultMessage: 'Shared Files'
  }
})

@injectSheet(styles)
@injectIntl
export default class SharedFiles extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    images: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    hideSidebar: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    total: PropTypes.number
  }

  componentDidMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const reset = !nextProps.items.length &&
      nextProps.total == null &&
      this.props.total != null
    if (reset) this.load(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onLoadMore() {
    this.load()
  }

  onClose() {
    this.props.hideSidebar()
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
          <ShowMore />
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes} = this.props.sheet
    if (this.props.total !== 0) return null
    return (
      <div className={classes.empty}>
        <FormattedMessage
          id="noSharedFiles"
          defaultMessage="No shared files" />.
      </div>
    )
  }

  render() {
    const {formatMessage} = this.props.intl
    const {classes} = this.props.sheet
    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
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
