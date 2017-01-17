import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import MediaActions from './MediaActions'
import {styles} from './mediaTheme.js'

@injectSheet(styles)
export default class Media extends PureComponent {
  static propTypes = {
    previewUrl: PropTypes.string,
    permalink: ProptTypes.string,
    embed: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  state = {
    open: false
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({open: true})
  }

  render() {
    const {
      previewUrl,
      embed,
      permalink,
      sheet: {classes}
    } = this.props

    const {open} = this.state
    const showPreview = !open && previewUrl
    const style = {
      backgroundImage: showPreview ? `url(${previewUrl})` : 'none'
    }

    return (
      <div className={cn(classes.media)} style={style}>
        {showPreview ? (
            <div className={classes.actions}>
              <MediaActions
                permalink={permalink}
                onPlay={this.onClick} />
            </div>
          ) :
          <div className={classes.embed} dangerouslySetInnerHTML={{__html: embed}} />
        }
      </div>
    )
  }
}
