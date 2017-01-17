import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import {styles} from './mediaActionsTheme.js'

@injectSheet(styles)
export default class Image extends PureComponent {
  render() {
    const {
      permalink,
      onPlay,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.container}>
        <button
          className={cn(classes.action, classes.playIcon)}
          onClick={onPlay} />
        {permalink && (
          <a
            className={cn(classes.action, classes.externalLinkIcon)}
            rel="noreferrer"
            target="_blank"
            href={permalink} />
        )}
      </div>
    )
  }
}
