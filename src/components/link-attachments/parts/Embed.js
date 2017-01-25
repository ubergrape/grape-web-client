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
    embedHtml: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sheet: PropTypes.object.isRequired
  }

  state = {
    isOpen: false
  }

  onClick = (e) => {
    e.preventDefault()
    this.setState({isOpen: true})
  }

  getSource() {
    const {embedHtml} = this.props

    return `
      <style>
        html, body, iframe {
          border: 0;
          padding: 0;
          margin: 0;
          background: transparent;
          width: 100% !important;
          height: 100% !important;
        }
      </style>
      ${embedHtml}
    `
  }

  render() {
    const {
      thumbUrl,
      width, height,
      permalink,
      sheet: {classes}
    } = this.props

    const {isOpen} = this.state
    const showPreview = !isOpen && thumbUrl
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
          <iframe className={classes.embed} srcDoc={this.getSource()}></iframe>
        }
      </div>
    )
  }
}
