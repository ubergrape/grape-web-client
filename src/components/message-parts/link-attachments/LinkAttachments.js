import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import LinkAttachment from './LinkAttachment'

@injectSheet({
  root: {
    display: 'block',
  },
  linkAttachment: {
    display: 'block',
    margin: [2, 0, 0, 3],
  },
})
export default class LinkAttachments extends PureComponent {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onRemove: PropTypes.func,
    isAdmin: PropTypes.bool,
    messageText: PropTypes.string,
  }

  static defaultProps = {
    onRemove: null,
    isAdmin: false,
    messageText: '',
  }

  makeOnRemove = url => {
    const { onRemove, isAdmin } = this.props
    return () => onRemove({ url, isAdmin })
  }

  render() {
    const { onRemove, attachments, classes, messageText } = this.props

    return (
      <div className={classes.root}>
        {attachments.map(meta => (
          <LinkAttachment
            {...meta}
            key={`${meta.sourceUrl}${meta.footerIcon}`}
            messageText={messageText}
            onRemove={onRemove && this.makeOnRemove(meta.sourceUrl)}
            className={classes.linkAttachment}
          />
        ))}
      </div>
    )
  }
}
