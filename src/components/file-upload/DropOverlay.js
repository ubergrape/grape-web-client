import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import staticUrl from 'staticurl'

import {styles} from './dropOverlayTheme'

@injectSheet(styles)
export default class DropOverlay extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {sheet: {classes}} = this.props
    return (
      <div className={classes.overlay}>
        <div className={classes.body}>
          <div className={classes.content}>
            <img className={classes.image} src={staticUrl('app/images/drag-and-drop.png')} />
            <h1 className={classes.headline}>Drop your file to upload it!</h1>
            <p className={classes.descr}>We support almost every file type up to a size of 50mb.</p>
          </div>
        </div>
      </div>
    )
  }
}
