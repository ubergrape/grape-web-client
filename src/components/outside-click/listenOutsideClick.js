import React, {Component, PropTypes} from 'react'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'

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
      onClick: PropTypes.func.isRequired
    }

    onClickWindow() {
      if (!this.state.isInsideClick) {
        this.props.onOutsideClick()
        return
      }

      this.setState({
        isInsideClick: false
      })
    }

    onClick(e) {
      this.props.onClick(e)
      this.setState({isInsideClick: true})
    }

    render() {
      return (
        <GlobalEvent event="click" handler={::this.onClickWindow}>
          <ChildComponent {...this.props} onClick={::this.onClick} />
        </GlobalEvent>
      )
    }
  }
}
