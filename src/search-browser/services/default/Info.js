import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './infoStyle'
import * as contents from './infoContents'
import Button from '../../../button/Button'
import {useSheet} from '../../../jss'

/**
 * Info messages for the user for e.g. to explain integrations.
 */
@useSheet(style)
export default class Info extends Component {
  static defaultProps = {
    canAddIntegrations: true,
    hasIntegrations: false,
    orgName: 'Organisation',
    orgOwner: 'org owner',
    headerHeight: undefined,
    images: undefined,
    onAddIntegration: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    let {classes} = this.props.sheet
    let {images} = this.props

    let addIntegration
    if (this.props.canAddIntegrations) {
      addIntegration = <Button
        onClick={::this.onAddIntegration}
        text="Add a Service Integration"
        className={classes.button} />
    }

    let headerStyle = {
      height: this.props.headerHeight + 'px',
      backgroundImage: `url(${images.traubyReading})`
    }

    let selected = 'basic'
    if (!this.props.hasIntegrations) {
      selected = this.props.canAddIntegrations ? 'canAdd' : 'needsHelp'
      headerStyle.backgroundImage = `url(${images.traubyJuggling})`
    }
    let content = contents[selected](this.props)


    return (
      <article className={content.ok ? classes.infoOk : classes.infoNok}>
        <header style={headerStyle} className={content.ok ? classes.headerOk : classes.headerNok}></header>
        <div className={classes.body}>
          {content.title}
          {content.description}
          {addIntegration}
        </div>
      </article>
    )
  }

  onAddIntegration() {
    this.props.onAddIntegration()
  }
}
