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

  makeOnRemove = (id, url) => {
    const {onRemove, isAdmin} = this.props
    return () => onRemove({id, url, isAdmin})
  }

  render() {
    const {
      onRemove,
      attachments,
      sheet: {classes}
    } = this.props

    return (
      <ul>
        {attachments.map((meta, idx) => (
          <li key={meta.sourceUrl}>
            <LinkAttachment
              {...meta}
              onRemove={onRemove && this.makeOnRemove(idx, meta.sourceUrl)}
              className={classes.linkAttachment}
            />
          </li>
        ))}
      </ul>
    )
  }
}
