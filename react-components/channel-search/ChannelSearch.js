import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import mousetrap from 'mousetrap'

import Dialog from '../dialog/Dialog'
import style from './style'
import {useSheet} from '../jss'

/**
 * This renders Browser inside of Modal and connects those show/hide handlers.
 */
@useSheet(style)
export default class ChannelSearch extends Component {
  static defaultProps = {
    shortcuts: ['command+k', 'ctrl+k'],
    show: false
  }

  constructor(props) {
    super(props)
    this.state = this.createState(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    mousetrap.bind(this.props.shortcuts, ::this.onShortcut)
  }

  componentWillUnmount() {
    mousetrap.unbind(this.props.shortcuts)
  }

  render() {
    return (
      <Dialog
        show={this.state.show}
        onHide={::this.onHide}
        title="Test test">
          asdfasdf
      </Dialog>
    )
  }

  createState(props) {
    return {
      show: props.show
    }
  }

  onShortcut() {
    this.setState({show: true})
  }

  onHide() {
    this.setState({show: false})
  }
}
