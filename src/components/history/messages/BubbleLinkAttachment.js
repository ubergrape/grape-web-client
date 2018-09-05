import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import ImageAttachment from '../../message-parts/bubble-link-attachments/ImageAttachment'
import LinkAttachment from '../../message-parts/bubble-link-attachments/LinkAttachment'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#attachments
export default class BubbleLinkAttachment extends PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string,
    title: PropTypes.string,
  }

  static defaultProps = {
    imageUrl: null,
    title: null,
  }

  render() {
    const { imageUrl, title } = this.props

    if (imageUrl) {
      return <ImageAttachment {...this.props} url={imageUrl} />
    }

    return <LinkAttachment {...this.props}>{title}</LinkAttachment>
  }
}
