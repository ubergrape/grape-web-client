import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import LinearProgress from 'grape-web/lib/components/progress/linearProgress'
import injectSheet from 'grape-web/lib/jss'
import { green, grayLight } from 'grape-theme/dist/base-colors'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'

import { maxSize } from './constants'
import { styles } from './notificationTheme'

const maxSizeInMb = maxSize / 1000 / 1000

const Upload = ({ classes, progress, isComplete, name, error }) => (
  <div className={classes.upload}>
    <div
      className={cn(
        classes.name,
        isComplete && classes.nameCompleted,
        error && classes.nameErrored,
      )}
    >
      <span className={classes.nameText}>
        <span className={classes.nameTextLeft}>
          {name.substr(0, name.length - 7)}
        </span>
        <span>{name.substr(name.length - 7)}</span>
      </span>
      {isComplete && !error && (
        <Icon name="check" className={classes.iconSuccess} />
      )}
      {error && <Icon name="remove" className={classes.iconError} />}
    </div>
    <LinearProgress
      mode="determinate"
      value={isComplete ? 0 : progress}
      style={isComplete ? { background: error ? grayLight : green } : null}
    />
    {error && <div className={classes.error}>{error}</div>}
  </div>
)

Upload.propTypes = {
  classes: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
  isComplete: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

Upload.defaultProps = {
  error: null,
}

const Message = ({ uploads, uploadingAmount, classes }) => (
  <div className={classes.message}>
    <h3 className={classes.title}>
      {uploadingAmount > 0 && (
        <FormattedMessage
          id="fileUploadTitle"
          defaultMessage="Uploading {uploading} of {total} files"
          description="Upload notification title"
          values={{
            uploading: uploadingAmount,
            total: uploads.length,
          }}
        />
      )}
      {!uploadingAmount && (
        <FormattedMessage
          id="fileUploadStatus"
          defaultMessage="Upload status"
          description="Upload notification title"
        />
      )}
    </h3>
    <div className={classes.list}>
      {uploads.map(upload => {
        let { error } = upload
        if (!error && upload.isRejected) {
          error = (
            <FormattedMessage
              id="fileTooBig"
              defaultMessage="File exceeds size limit of {limit}mb."
              values={{ limit: maxSizeInMb }}
            />
          )
        }
        return (
          <Upload {...upload} classes={classes} key={upload.id} error={error} />
        )
      })}
    </div>
  </div>
)

Message.propTypes = {
  classes: PropTypes.object.isRequired,
  uploads: PropTypes.array.isRequired,
  uploadingAmount: PropTypes.number.isRequired,
}

const notify = props => {
  const {
    sheet: { classes },
    uploads,
    onHideNotification,
    onNotify,
  } = props

  if (!uploads.length) return

  const handled = uploads.filter(
    ({ isComplete, isRejected }) => isComplete || isRejected,
  )

  const message = (
    <Message
      uploads={uploads}
      uploadingAmount={uploads.length - handled.length}
      classes={classes}
    />
  )

  onNotify({ message })

  // Everything is finished.
  if (handled.length === uploads.length) {
    onHideNotification()
  }
}

class Notification extends PureComponent {
  constructor(props) {
    super(props)
    notify(props)
  }

  componentWillReceiveProps(nextProps) {
    notify(nextProps)
  }

  render() {
    return null
  }
}

export default injectSheet(styles)(Notification)
