import React, {Component} from 'react'

export default class Input extends Component {
  render() {
    return <input data-test="input" {...this.props} />
  }
}
