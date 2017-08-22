import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import LinkAttachment from './LinkAttachment'

@injectSheet({
  linkAttachments: {
  },
  linkAttachment: {
    margin: [2, 0, 0, 3]
  }
})
export default class LinkAttachments extends PureComponent {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onRemove: PropTypes.func,
    isAdmin: PropTypes.bool
  }

  static defaultProps = {
    onRemove: null,
    isAdmin: false
  }

  makeOnRemove = (url) => {
    const {onRemove, isAdmin} = this.props
    return () => onRemove({url, isAdmin})
  }

  render() {
    const {
      onRemove,
      attachments,
      classes
    } = this.props

    return (
      <div className={classes.linkAttachments}>
        {attachments.map(meta => (
          <LinkAttachment
            {...meta}
            key={meta.sourceUrl}
            onRemove={onRemove && this.makeOnRemove(meta.sourceUrl)}
            className={classes.linkAttachment}
          />
        ))}
      </div>
    )
  }
}
