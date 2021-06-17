import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import EmbedActions from './EmbedActions'
import { IframeUnsafeHtml } from '../../../iframe-unsafe-html'
import { styles } from './embedTheme.js'

@injectSheet(styles)
export default class Embed extends PureComponent {
  static propTypes = {
    thumbUrl: PropTypes.string,
    permalink: PropTypes.string.isRequired,
    embedHtml: PropTypes.string.isRequired,
    autoPlay: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    thumbUrl: null,
  }

  state = {
    isOpen: false,
  }

  onClick = e => {
    e.preventDefault()
    this.setState({ isOpen: true })
  }

  renderActions() {
    const {
      permalink,
      sheet: { classes },
    } = this.props

    return (
      <div className={classes.actions}>
        <EmbedActions permalink={permalink} onClick={this.onClick} />
      </div>
    )
  }

  renderIframe() {
    const {
      embedHtml,
      sheet: { classes },
    } = this.props

    const html = `
      <style>
        html, body, body > * {
          border: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent;
          width: 100% !important;
          height: 100% !important;
        }
        body { overflow: hidden !important; }
        body > * { display: block !important; }
        style, script { display: none !important; }
      </style>
      ${embedHtml}
    `

    return <IframeUnsafeHtml className={classes.iframe} html={html} />
  }

  render() {
    const {
      thumbUrl,
      autoPlay,
      width,
      height,
      sheet: { classes },
    } = this.props

    const { isOpen } = this.state
    const style = {
      backgroundImage: !isOpen && thumbUrl ? `url(${thumbUrl})` : 'none',
      width,
    }

    return (
      <div className={cn(classes.media)} style={style}>
        <div
          style={{ width: 1, paddingBottom: `${100 * (height / width)}%` }}
        />
        {isOpen || autoPlay ? this.renderIframe() : this.renderActions()}
      </div>
    )
  }
}
