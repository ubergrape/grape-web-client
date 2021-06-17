import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import { styles } from './theme.js'

const setIframeContent = (iframe, content) => {
  const doc = iframe.contentDocument || iframe.contentWindow.document
  doc.write(content)
  doc.close()
}

@injectSheet(styles)
export default class IframeUnsafeHtml extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  componentDidMount() {
    const { html } = this.props
    setIframeContent(this.iframe, html)
  }

  componentDidUpdate() {
    const { html } = this.props
    setIframeContent(this.iframe, html)
  }

  onRefIframe = iframe => {
    this.iframe = iframe
  }

  render() {
    const {
      className,
      sheet: { classes },
      ...iframeHtmlAttrs
    } = this.props

    delete iframeHtmlAttrs.html

    return (
      <iframe
        className={cn(classes.iframe, className)}
        ref={this.onRefIframe}
        {...iframeHtmlAttrs}
      />
    )
  }
}
