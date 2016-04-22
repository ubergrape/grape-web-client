import React, {Component} from 'react'

export default function addClickOutside(_Component, onClickOutside, onClick) {
  return class ClickOutside extends Component {
    constructor() {
      super()
      this.preventClickOutside = false
      this.onClickOutside = ::this.onClickOutside
    }

    componentDidMount() {
      window.addEventListener('click', this.onClickOutside)
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.onClickOutside)
    }

    onClickOutside() {
      if (!this.preventClickOutside) onClickOutside()
      this.preventClickOutside = false
    }

    onClick(e) {
      this.preventClickOutside = true
      onClick(e)
    }

    render() {
      return <_Component {...this.props} onClick={::this.onClick} />
    }
  }
}
