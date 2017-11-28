import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import sizes from 'grape-theme/dist/sizes'

import {Grapedown} from '../../grapedown'
import PinnedMessage from './PinnedMessage'
import Empty from './Empty'

@injectSheet({
  root: {
    display: 'flex',
    paddingTop: ({items}) => (items.length ? 0 : sizes.spacer.xxl)
  }
})
export default class PinnedMessages extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onLoad: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    onUnpin: PropTypes.func,
    total: PropTypes.number
  }

  static defaultProps = {
    total: undefined,
    items: [],
    onSelect: noop,
    onUnpin: noop
  }

  componentDidMount() {
    this.load()
  }

  componentWillReceiveProps(nextProps) {
    const reset = (
      !nextProps.items.length &&
      (nextProps.total == null && this.props.total != null)
    )
    if (reset) this.load(nextProps)
  }

  load({onLoad} = this.props) {
    onLoad()
  }

  render() {
    const {classes, items, onSelect, onUnpin, user} = this.props

    return (
      <div className={classes.root}>
        {items.map(message => (
          <PinnedMessage
            message={message}
            key={message.id}
            onSelect={onSelect}
            onUnpin={onUnpin}
          >
            <Grapedown text={message.text} user={user} />
          </PinnedMessage>
        ))}
        {!items.length && <Empty />}
      </div>
    )
  }
}
