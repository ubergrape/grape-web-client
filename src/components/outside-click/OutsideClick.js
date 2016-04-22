import React, {Component} from 'react'
import GlobalEvent from 'grape-web/lib/global-event/GlobalEvent'

export default function listenOutsideClick(ChildComponent, onOutsideClick, onClick) {
  return class OutsideClick extends Component {
    constructor() {
      super()
      this.state = {
        isInsideClick: false
      }
    }

    onClickWindow() {
      if (!this.state.isInsideClick) {
        onOutsideClick()
        return
      }

      this.setState({
        isInsideClick: false
      })
    }

    onClick(e) {
      onClick(e)
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
