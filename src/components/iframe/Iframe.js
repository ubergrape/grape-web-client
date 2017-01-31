import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import {styles} from './iframeTheme.js'

const setIframeContent = (iframe, content) => {
  if ('srcdoc' in iframe) {
    iframe.setAttribute('srcdoc', content)
    return
  }

  // Fallback for browsers that don't support srcdoc
  const doc = iframe.contentDocument || iframe.contentWindow.document
  doc.write(content)
  doc.close()
}

@injectSheet(styles)
export default class Iframe extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    className: ''
  }

  componentDidMount() {
    const {html} = this.props
    setIframeContent(this.iframe, html)
  }

  componentDidUpdate() {
    const {html} = this.props
    setIframeContent(this.iframe, html)
  }

  getIframe = iframe => {
    this.iframe = iframe
  }

  render() {
    const {
      className,
      sheet: {classes}
    } = this.props

    return (
      <iframe
        className={cn(classes.iframe, className)}
        ref={this.getIframe} />
    )
  }
}
