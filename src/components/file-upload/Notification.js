import React, {PureComponent, PropTypes} from 'react'
import LinearProgress from 'material-ui/progress/LinearProgress'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'
import {FormattedMessage} from 'react-intl'

import {maxSize} from './constants'
import {styles, calcHeight} from './notificationTheme'

const maxSizeInMb = maxSize / 1000 / 1000

/**
 * This function truncates in the middle of a string.
 * It is similar to what OSX does in finder.
 */
const truncate = (str, maxLength) => {
  if (str.length <= maxLength) return str
  const part1 = str.substr(0, maxLength / 2)
  const part2 = str.substr(str.length - maxLength / 2)
  return `${part1}…${part2}`
}

const Upload = ({classes, progress, isComplete, name, error}) => (
  <div
    className={cn(
      classes.progress,
      isComplete && classes.progressCompleted
    )}>
    <div
      className={cn(
        classes.name,
        isComplete && classes.nameCompleted,
        error && classes.nameErrored
      )}>
      {truncate(name, 30)}
    </div>
    {error && <div className={classes.error}>{error}</div>}
    {!isComplete && (
      <LinearProgress mode="determinate" value={progress} />
    )}
  </div>
)

Upload.propTypes = {
  classes: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
  isComplete: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
}

Upload.defaultProps = {
  isComplete: false
}

const Message = ({uploads, handled, classes}) => (
  <div className={classes.message}>
    <h3 className={classes.title}>
      Uploading {uploads.length - handled.length} of {uploads.length} Files
    </h3>
    <div className={classes.list}>
      {uploads.map(upload => {
        let {error} = upload
        if (!error && upload.isRejected) {
          error = (
            <FormattedMessage
              id="fileTooBig"
              defaultMessage="File exceeds size limit of {limit}Mb."
              values={{limit: maxSizeInMb}} />
          )
        }
        return <Upload {...upload} classes={classes} key={upload.id} error={error} />
      })}
    </div>
  </div>
)

Message.propTypes = {
  classes: PropTypes.object.isRequired,
  uploads: PropTypes.array.isRequired,
  handled: PropTypes.array.isRequired
}

@injectSheet(styles)
export default class Notification extends PureComponent {
  static propTypes = {
    uploads: PropTypes.array.isRequired,
    onNotify: PropTypes.func.isRequired,
    onHideNotification: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.notify(props)
  }

  componentWillReceiveProps(nextProps) {
    this.notify(nextProps)
  }

  notify(props) {
    const {
      sheet: {classes},
      uploads,
      onHideNotification,
      onNotify
    } = props

    if (!uploads.length) return

    const handled = uploads.filter(({isComplete, isRejected}) => isComplete || isRejected)

    const message = (
      <Message
        uploads={uploads}
        handled={handled}
        classes={classes} />
    )

    onNotify({
      message,
      height: calcHeight(uploads)
    })

    // Everything is finished.
    if (handled.length === uploads.length) {
      setTimeout(onHideNotification, 3000)
    }
  }

  render() {
    return null
  }
}
