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

class IframeUnsafeHtml extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired,
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
    } = this.props

    return (
      <iframe
        title="This is a unique title"
        className={cn(classes.iframe, className)}
        ref={this.onRefIframe}
      />
    )
  }
}

export default injectSheet(styles)(IframeUnsafeHtml)
