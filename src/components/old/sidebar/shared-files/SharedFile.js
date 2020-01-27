import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { noop } from 'lodash'
import injectSheet from 'grape-web/lib/jss'
import icons from 'grape-web/lib/svg-icons/data'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import ImageZoom from '../../image-zoom/ImageZoom'
import { styles } from './sharedFileTheme'

class SharedFile extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired,
    channelName: PropTypes.string.isRequired,
    channelType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    author: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    onOpen: PropTypes.func,
  }

  static defaultProps = {
    author: undefined,
    thumbnailUrl: undefined,
    onOpen: noop,
  }

  onOpen = () => {
    const { onOpen, url } = this.props
    onOpen(url)
  }

  setPreviewRef = ref => {
    this.preview = ref
  }

  getPreviewRef = () => this.preview

  renderPreview() {
    const { thumbnailUrl, classes, category } = this.props
    let className
    let backgroundImage

    if (thumbnailUrl) {
      className = classes.thumbnail
      backgroundImage = `url(${thumbnailUrl})`
    } else {
      className = classes.icon
      const svg = icons[category] || icons.file
      backgroundImage = `url('${svg}')`
    }

    return (
      <div
        ref={this.setPreviewRef}
        className={className}
        style={{ backgroundImage }}
      />
    )
  }

  renderSection(handleClick) {
    const {
      channelType,
      channelName,
      time,
      author,
      name,
      classes,
      intl: { formatDate, formatTime },
    } = this.props
    let when = formatDate(time, {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
    })
    when += ` ${formatTime(time)}`
    if (author) when += ` - ${author}`

    let message
    switch (channelType) {
      case 'room': {
        message = (
          <FormattedMessage
            id="sharedInRoom"
            defaultMessage="Shared in {channelName}"
            description="*Describe sharedInRoom*, example: 'Shared in Office'"
            values={{ channelName }}
          />
        )
        break
      }
      case 'pm': {
        message = (
          <FormattedMessage
            id="sharedInPm"
            defaultMessage="Shared with {channelName}"
            description="*Describe sharedInPm*, example: Shared with Felix'"
            values={{ channelName }}
          />
        )
        break
      }
      default:
    }

    return (
      <button
        className={classes.sharedFile}
        onClick={handleClick ? this.onOpen : noop}
      >
        <div className={classes.leftColumn}>{this.renderPreview()}</div>
        <div className={classes.rightColumn}>
          <h2 className={classes.name}>{name}</h2>
          <p className={classes.meta}>{when}</p>
          <p className={classes.meta}>{message}</p>
        </div>
      </button>
    )
  }

  render() {
    const { thumbnailUrl, url, classes } = this.props
    const section = this.renderSection(!thumbnailUrl)

    if (thumbnailUrl) {
      return (
        <ImageZoom
          getPreviewRef={this.getPreviewRef}
          url={url}
          className={classes.image}
        >
          {section}
        </ImageZoom>
      )
    }

    return section
  }
}

export default injectSheet(styles)(injectIntl(SharedFile))
