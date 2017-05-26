import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {FormattedMessage} from 'react-intl'

import staticUrl from '../../utils/static-url'
import {maxSize} from './constants'
import {styles} from './dropOverlayTheme'

const maxSizeInMb = maxSize / 1000 / 1000

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
            <img
              className={classes.image}
              src={staticUrl('app/images/drag-and-drop.png')}
              alt=""
            />
            <h1 className={classes.headline}>
              <FormattedMessage
                id="dropFileToUpload"
                description="Hint on the drop overlay screen."
                defaultMessage="Drop your file to upload it!"
              />
            </h1>
            <p className={classes.descr}>
              <FormattedMessage
                id="dropFileToUploadMaxFileSize"
                description="Hint on the drop overlay screen."
                defaultMessage="We support almost every file type up to a size of {limit}mb."
                values={{limit: maxSizeInMb}}
              />
            </p>
          </div>
        </div>
      </div>
    )
  }
}
