import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { noop } from 'lodash'
import injectSheet from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/components/spinner'

import { ShowMore } from '../../i18n'
import { styles } from './sharedFilesTheme'
import SharedFile from './SharedFile'

class SharedFiles extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onLoad: PropTypes.func.isRequired,
    onOpen: PropTypes.func,
    total: PropTypes.number,
  }

  static defaultProps = {
    total: undefined,
    onOpen: noop,
  }

  componentDidMount() {
    this.load()
  }

  componentWillReceiveProps(nextProps) {
    const reset =
      !nextProps.items.length &&
      nextProps.total == null &&
      this.props.total != null
    if (reset) this.load(nextProps)
  }

  onLoadMore = () => {
    this.load()
  }

  load({ items, limit, onLoad } = this.props) {
    onLoad({
      offset: items.length,
      limit,
    })
  }

  renderFiles() {
    const { items, onOpen } = this.props
    return items.map(item => (
      <SharedFile {...item} key={item.id} onOpen={onOpen} />
    ))
  }

  renderLoadMore() {
    const { classes, total, items } = this.props
    if (!total || items.length >= total) return null

    return (
      <div className={classes.loadMoreContainer}>
        <button onClick={this.onLoadMore} className={classes.button}>
          <ShowMore />
        </button>
      </div>
    )
  }

  renderEmpty() {
    const { classes, total } = this.props
    if (total !== 0) return null
    return (
      <div className={classes.empty}>
        <FormattedMessage id="noSharedFiles" defaultMessage="No shared files" />.
      </div>
    )
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.sharedFiles}>
        {this.renderFiles()}
        {this.renderEmpty()}
        {this.renderLoadMore()}
        {this.props.isLoading && <Spinner className={classes.spinner} />}
      </div>
    )
  }
}

export default injectSheet(styles)(SharedFiles)
