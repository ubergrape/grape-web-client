import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import { blue, white } from 'grape-theme/dist/base-colors'
import fonts from 'grape-theme/dist/fonts'

import { zIndex } from '../../utils/z-index'
import staticUrl from '../../utils/static-url'
import { maxSize } from './constants'

const maxSizeInMb = maxSize / 1000 / 1000

@injectSheet({
  dropzone: {},
  overlay: {
    position: 'absolute',
    background: 'rgba(0,0,0,.85)',
    zIndex: zIndex('dialog'),
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    border: {
      width: 2,
      style: 'dashed',
      color: blue,
      radius: 15,
    },
  },
  content: {
    width: '50%',
    marginTop: '-10%',
    textAlign: 'center',
  },
  image: {
    width: '30%',
    minWidth: 150,
    marginBottom: 20,
  },
  headline: {
    extend: fonts.biggest,
    display: 'block',
    color: blue,
    textAlign: 'center',
  },
  descr: {
    extend: fonts.small,
    lineHeight: 2,
    color: white,
    textAlign: 'center',
  },
})
export default class DropOverlay extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
  }

  render() {
    const {
      sheet: { classes },
    } = this.props
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
                values={{ limit: maxSizeInMb }}
              />
            </p>
          </div>
        </div>
      </div>
    )
  }
}
