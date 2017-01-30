import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import EmbedActions from './EmbedActions'
import {styles} from './embedTheme.js'

@injectSheet(styles)
export default class Embed extends PureComponent {
  static propTypes = {
    thumbUrl: PropTypes.string,
    permalink: PropTypes.string.isRequired,
    embedHtml: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sheet: PropTypes.object.isRequired
  }

  state = {
    isOpen: false
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({isOpen: true})
  }

  getSource() {
    const {embedHtml} = this.props

    return `
      <style>
        html, body, iframe {
          border: 0;
          padding: 0;
          margin: 0;
          background: transparent;
          width: 100% !important;
          height: 100% !important;
        }
      </style>
      ${embedHtml}
    `
  }

  renderActions() {
    const {
      permalink,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.actions}>
        <EmbedActions
          permalink={permalink}
          onClick={this.onClick} />
      </div>
    )
  }

  renderIframe() {
    const {sheet: {classes}} = this.props

    return (
      <iframe className={classes.embed} srcDoc={this.getSource()}></iframe>
    )
  }

  render() {
    const {
      thumbUrl,
      width, height,
      sheet: {classes}
    } = this.props

    const {isOpen} = this.state
    const style = {
      backgroundImage: !isOpen && thumbUrl ? `url(${thumbUrl})` : 'none',
      width,
      height
    }

    return (
      <div className={cn(classes.media)} style={style}>
        {!isOpen ? this.renderActions() : this.renderIframe()}
      </div>
    )
  }
}
