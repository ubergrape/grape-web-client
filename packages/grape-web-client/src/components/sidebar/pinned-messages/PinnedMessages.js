import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'
import Spinner from 'grape-web/lib/components/spinner'

import { Grapedown } from '../../grapedown'
import PinnedMessage from './PinnedMessage'
import Empty from './Empty'

const styles = () => ({
  root: {
    display: 'block',
  },
  rootEmpty: {
    display: 'flex',
    paddingTop: sizes.spacer.xxl,
  },
  loading: {
    // needed because the spinner inside has position absolute
    position: 'relative',
    display: 'block',
    marginTop: sizes.spacer.xl,
  },
  empty: {
    // Required by IE11.
    width: '100%',
  },
})

class PinnedMessages extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    customEmojis: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onLoad: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    onUnpin: PropTypes.func,
    total: PropTypes.number,
  }

  static defaultProps = {
    total: undefined,
    onSelect: noop,
    onUnpin: noop,
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

  load({ onLoad } = this.props) {
    onLoad()
  }

  render() {
    const {
      classes,
      items,
      onSelect,
      onUnpin,
      user,
      isLoading,
      customEmojis,
    } = this.props

    if (isLoading) {
      return (
        <div className={classes.loading}>
          <Spinner size="s" delay={250} />
        </div>
      )
    }

    return (
      <div className={classes[items.length ? 'root' : 'rootEmpty']}>
        {items.map(message => (
          <PinnedMessage
            message={message}
            key={message.id}
            onSelect={onSelect}
            onUnpin={onUnpin}
          >
            <Grapedown
              customEmojis={customEmojis}
              text={message.text}
              user={user}
            />
          </PinnedMessage>
        ))}
        {!items.length && <Empty className={classes.empty} />}
      </div>
    )
  }
}

export default injectSheet(styles)(PinnedMessages)
