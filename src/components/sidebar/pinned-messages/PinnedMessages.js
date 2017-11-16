import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'

import Message from '../message-search/Message'
import {Grapedown} from '../../grapedown'

@injectSheet({
  root: {
    display: 'block'
  }
})
export default class PinnedMessages extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    user: PropTypes.array.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onLoad: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    total: PropTypes.number
  }

  static defaultProps = {
    total: undefined,
    items: [],
    onSelect: noop
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
    const {classes, items, onSelect, user} = this.props

    return (
      <div className={classes.root}>
        {items.map(message => (
          <Message
            message={message}
            key={message.id}
            onSelect={onSelect}
          >
            <Grapedown text={message.text} user={user} />
          </Message>
        ))}
      </div>
    )
  }
}
