import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import EmbedActions from './EmbedActions'
import {styles} from './embedTheme.js'

@injectSheet(styles)
export default class Embed extends PureComponent {
  static propTypes = {
    thumbUrl: PropTypes.string,
    permalink: PropTypes.string.isRequired,
    embedUrl: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
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
      thumbUrl,
      embedUrl,
      width, height,
      permalink,
      sheet: {classes}
    } = this.props

    const {open} = this.state
    const showPreview = !open && thumbUrl
    const style = {
      backgroundImage: showPreview ? `url(${thumbUrl})` : 'none',
      width,
      height
    }

    return (
      <div className={cn(classes.media)} style={style}>
        {showPreview ? (
            <div className={classes.actions}>
              <EmbedActions
                permalink={permalink}
                onClick={this.onClick} />
            </div>
          ) :
          <iframe className={classes.embed} src={embedUrl}></iframe>
        }
      </div>
    )
  }
}
