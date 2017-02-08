import React, {PureComponent, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import injectSheet from 'grape-web/lib/jss'
import icons from 'grape-web/lib/svg-icons/data'
import {openUrl} from 'grape-web/lib/x-platform'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'

import ImageZoom from '../image-zoom/ImageZoom'
import {styles} from './sharedFileTheme'

@injectSheet(styles)
@injectIntl
export default class SharedFile extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    channelName: PropTypes.string.isRequired,
    channelType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    author: PropTypes.string,
    thumbnailUrl: PropTypes.string
  }

  static defaultProps = {
    author: null,
    thumbnailUrl: null
  }

  onOpen = () => {
    openUrl(this.props.url, false)
  }

  setPreviewRef = (ref) => {
    this.preview = ref
  }

  getPreviewRef = () => this.preview

  renderPreview() {
    const {thumbnailUrl, sheet: {classes}, category} = this.props
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
        style={{backgroundImage}}
      />
    )
  }

  renderSection(handleClick) {
    const {
      channelType, channelName, time, author, name,
      sheet: {classes},
      intl: {formatDate, formatTime}
    } = this.props
    let when = formatDate(time, {year: '2-digit', month: 'short', day: '2-digit'})
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
            values={{channelName}}
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
            values={{channelName}}
          />
        )
        break
      }
      default:
    }

    return (
      <section
        className={classes.sharedFile}
        onClick={handleClick ? this.onOpen : noop}
      >
        <div className={classes.leftColumn}>
          {this.renderPreview()}
        </div>
        <div className={classes.rightColumn}>
          <h2 className={classes.name}>{name}</h2>
          <p className={classes.meta}>{when}</p>
          <p className={classes.meta}>
            {message}
          </p>
        </div>
      </section>
    )
  }

  render() {
    const {thumbnailUrl, url} = this.props
    const section = this.renderSection(!thumbnailUrl)

    if (thumbnailUrl) {
      return (
        <ImageZoom
          getPreviewRef={this.getPreviewRef}
          url={url}
        >
          {section}
        </ImageZoom>
      )
    }

    return section
  }
}
