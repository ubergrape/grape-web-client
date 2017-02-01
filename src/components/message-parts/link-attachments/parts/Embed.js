import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import EmbedActions from './EmbedActions'
import {IframeUnsafeHtml} from '../../../iframe-unsafe-html'
import {styles} from './embedTheme.js'

@injectSheet(styles)
export default class Embed extends PureComponent {
  static propTypes = {
    thumbUrl: PropTypes.string.isRequired,
    permalink: PropTypes.string.isRequired,
    embedHtml: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    thumbUrl: null
  }

  state = {
    isOpen: false
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({isOpen: true})
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
          onClick={this.onClick}
        />
      </div>
    )
  }

  renderIframe() {
    const {embedHtml} = this.props

    const html = `
      <style>
        html, body, iframe {
          border: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent;
          width: 100% !important;
          height: 100% !important;
        }
        iframe { display: block !important; }
      </style>
      ${embedHtml}
    `

    return <IframeUnsafeHtml html={html} />
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
