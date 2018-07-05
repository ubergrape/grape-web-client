import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import ImageAttachment from '../../message-parts/attachments/ImageAttachment'
import LinkAttachment from '../../message-parts/attachments/LinkAttachment'

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#attachments
export default class Attachment extends PureComponent {
  static propTypes = {
    thumbnailUrl: PropTypes.string,
    name: PropTypes.string,
  }

  static defaultProps = {
    thumbnailUrl: null,
    name: null,
  }

  render() {
    const { thumbnailUrl, name, ...rest } = this.props

    if (thumbnailUrl) {
      return <ImageAttachment {...rest} thumbnailUrl={thumbnailUrl} />
    }

    return <LinkAttachment {...rest}>{name}</LinkAttachment>
  }
}
