import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './infoStyle'
import * as contents from './infoContents'
import Button from '../../../button/Button'
import {useSheet} from 'grape-web/lib/jss'

/**
 * Info messages for the user for e.g. to explain integrations.
 */
@useSheet(style)
export default class Info extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    onAddIntegration: PropTypes.func,
    canAddIntegrations: PropTypes.bool,
    hasIntegrations: PropTypes.bool,
    images: PropTypes.object,
    headerHeight: PropTypes.number
  }

  static defaultProps = {
    canAddIntegrations: true,
    hasIntegrations: false,
    orgName: 'Organisation',
    orgOwner: 'org owner',
    headerHeight: 128,
    images: undefined,
    onAddIntegration: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onAddIntegration() {
    this.props.onAddIntegration()
  }

  render() {
    const {classes} = this.props.sheet
    const {images} = this.props

    let addIntegration
    if (this.props.canAddIntegrations) {
      addIntegration = (
        <Button
          onClick={::this.onAddIntegration}
          text="Add a Service Integration"
          className={classes.button} />
      )
    }

    const headerStyle = {
      backgroundImage: `url(${images.traubyReading})`
    }

    let selected = 'basic'
    if (!this.props.hasIntegrations) {
      selected = this.props.canAddIntegrations ? 'canAdd' : 'needsHelp'
      headerStyle.backgroundImage = `url(${images.traubyJuggling})`
    }
    const content = contents[selected](this.props)

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
}
