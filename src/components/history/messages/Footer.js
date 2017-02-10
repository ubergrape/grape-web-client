import React, {PureComponent} from 'react'

export default class Footer extends PureComponent {
  render() {
    const {nlp} = this.props

    if (!nlp) return null

    return (
      <div />
    )
  }
}
