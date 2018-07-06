import PropTypes from 'prop-types'
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import { styles } from './embedActionsTheme.js'

@injectSheet(styles)
export default class EmbedActions extends PureComponent {
  static propTypes = {
    permalink: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
  }

  render() {
    const {
      permalink,
      onClick,
      sheet: { classes },
    } = this.props

    return (
      <div className={classes.container}>
        <button
          className={cn(classes.action, classes.playIcon)}
          onClick={onClick}
        />
        <a
          className={cn(classes.action, classes.externalLinkIcon)}
          rel="noopener noreferrer"
          target="_blank"
          href={permalink}
        />
      </div>
    )
  }
}
