import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import BubbleImageAttachment from '../../message-parts/bubble-link-attachments/BubbleImageAttachment'
import BubbleLinkAttachment from '../../message-parts/bubble-link-attachments/BubbleLinkAttachment'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#attachments
export default class BubbleAttachment extends PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
    footerUrl: PropTypes.string,
    title: PropTypes.string,
  }

  static defaultProps = {
    imageUrl: null,
    footerUrl: null,
    title: null,
  }

  render() {
    const { imageUrl, footerUrl, title } = this.props

    if (imageUrl) {
      return <BubbleImageAttachment {...this.props} url={imageUrl} />
    }

    return (
      <BubbleLinkAttachment url={footerUrl} {...this.props}>
        {title}
      </BubbleLinkAttachment>
    )
  }
}
