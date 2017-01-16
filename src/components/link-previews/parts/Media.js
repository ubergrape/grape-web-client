import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import ImageAttachment from '../../message-parts/attachments/ImageAttachment'
import MediaActions from './MediaActions'
import {styles} from './mediaTheme.js'

@injectSheet(styles)
export default class Media extends PureComponent {
  state = {
    open: false
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({open: true})
  }

  render() {
    const {
      preview,
      embed,
      permalink,
      sheet: {classes}
    } = this.props

    const {open} = this.state
    const showPreview = !open && preview.url
    return (
      <div className={cn(classes.media)}>
        {showPreview && <ImageAttachment {...preview} />}
        {showPreview && (
          <div className={classes.actionsContainer}>
            <div className={classes.actions}>
              <MediaActions
                permalink={permalink}
                onPlay={this.onClick} />
            </div>
          </div>
        )}
        {open && (
          <div className={classes.embed} dangerouslySetInnerHTML={{__html: embed}} />
        )}
      </div>
    )
  }
}
