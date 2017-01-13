import React, {PureComponent, PropTypes} from 'react'
import {gray} from 'grape-theme/dist/base-colors'

import Bubble from './parts/Bubble'
import {Author} from './parts'

export default class LinkPreview extends PureComponent {
  render() {
    const {
      authorName,
      authorLink,
      authorIcon,
      color
    } = this.props

    const border = {boxShadow: `-3px 0 0 0 ${color || gray}`}

    return (
      <Bubble hasArrow={false} style={border}>
        {authorName &&
          <Author
            name={authorName}
            link={authorLink}
            icon={authorIcon} />
        }
      </Bubble>
    )
  }
}
