import React, {PropTypes, PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import LinkAttachment from './LinkAttachment'
import {styles} from './linkAttachmentsTheme'

@injectSheet(styles)
export default class LinkAttachments extends PureComponent {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      attachments,
      sheet: {classes}
    } = this.props

    return (
      <ul>
        {attachments.map(meta => (
          <li key={meta.sourceUrl}>
            <LinkAttachment
              {...meta}
              className={classes.linkAttachment} />
          </li>
        ))}
      </ul>
    )
  }
}
