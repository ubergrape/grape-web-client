import React, {PureComponent, PropTypes} from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'

import {ShowMore} from '../../i18n'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import {styles} from './sharedFilesTheme'
import SharedFile from './SharedFile'

const messages = defineMessages({
  title: {
    id: 'sharedFiles',
    defaultMessage: 'Shared Files'
  }
})

@injectSheet(styles)
@injectIntl
export default class SharedFiles extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    images: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    load: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func,
    total: PropTypes.number
  }

  static defaultProps = {
    hideSidebar: null,
    total: null
  }

  componentDidMount() {
    this.load()
  }

  componentWillReceiveProps(nextProps) {
    const reset = !nextProps.items.length &&
      nextProps.total == null &&
      this.props.total != null
    if (reset) this.load(nextProps)
  }

  onLoadMore = () => {
    this.load()
  }

  load({items, limit, load} = this.props) {
    load({
      offset: items.length,
      limit
    })
  }

  renderFiles() {
    return this.props.items.map(item => <SharedFile {...item} key={item.id} />)
  }

  renderLoadMore() {
    const {classes, total, items} = this.props
    if (!total || items.length >= total) return null

    return (
      <div className={classes.loadMoreContainer}>
        <button
          onClick={this.onLoadMore}
          className={classes.button}
        >
          <ShowMore />
        </button>
      </div>
    )
  }

  renderEmpty() {
    const {classes, total} = this.props
    if (total !== 0) return null
    return (
      <div className={classes.empty}>
        <FormattedMessage
          id="noSharedFiles"
          defaultMessage="No shared files"
        />.
      </div>
    )
  }

  render() {
    const {
      hideSidebar,
      intl: {formatMessage},
      classes,
      images
    } = this.props

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        images={images}
        onClose={hideSidebar}
      >
        <div className={classes.sharedFiles}>
          {this.renderFiles()}
          {this.renderEmpty()}
          {this.renderLoadMore()}
          {this.props.isLoading && <Spinner image={images.spinner} />}
        </div>
      </SidebarPanel>
    )
  }
}
