import PropTypes from 'prop-types'
import React, { Component } from 'react'
import noop from 'lodash/utility/noop'
import omit from 'lodash/object/omit'

import GlobalEvent from '../global-event/GlobalEvent'

export default function listenOutsideClick(ChildComponent) {
  return class OutsideClick extends Component {
    constructor() {
      super()
      this.state = {
        isInsideClick: false,
      }
    }

    static propTypes = {
      onOutsideClick: PropTypes.func.isRequired,
      onClick: PropTypes.func,
    }

    static defaultProps = {
      onClick: noop,
    }

    onClickWindow = e => {
      if (!this.state.isInsideClick) {
        this.props.onOutsideClick(e)
        return
      }

      this.setState({
        isInsideClick: false,
      })
    }

    onClick = e => {
      this.props.onClick(e)
      this.setState({ isInsideClick: true })
    }

    render() {
      return (
        <GlobalEvent event="click" handler={this.onClickWindow}>
          <ChildComponent
            {...omit(this.props, 'onOutsideClick')}
            onClick={this.onClick}
          />
        </GlobalEvent>
      )
    }
  }
}
