import React, {Component, PropTypes} from 'react'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'
import noop from 'lodash/utility/noop'
import omit from 'lodash/object/omit'

export default function listenOutsideClick(ChildComponent) {
  return class OutsideClick extends Component {
    constructor() {
      super()
      this.state = {
        isInsideClick: false
      }
    }

    static propTypes = {
      onOutsideClick: PropTypes.func.isRequired,
      onClick: PropTypes.func
    }

    static defaultProps = {
      onClick: noop
    }

    onClickWindow = () => {
      if (!this.state.isInsideClick) {
        this.props.onOutsideClick({target: this})
        return
      }

      this.setState({
        isInsideClick: false
      })
    }

    onClick = e => {
      this.props.onClick(e)
      this.setState({isInsideClick: true})
    }

    render() {
      return (
        <GlobalEvent event="click" handler={this.onClickWindow}>
          <ChildComponent
            {...omit(this.props, 'onOutsideClick')}
            onClick={this.onClick} />
        </GlobalEvent>
      )
    }
  }
}
