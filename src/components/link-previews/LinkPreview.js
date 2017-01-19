import React, {PureComponent, PropTypes} from 'react'
import {gray} from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'

import Bubble from './parts/Bubble'
import {
  Author,
  Title,
  Media,
  Row
} from './parts'
import ImageAttachment from '../message-parts/attachments/ImageAttachment'

import {styles} from './linkPreviewTheme.js'

const defaultMediaSize = {
  image: {
    width: 360,
    height: 360
  },
  image_s: {
    width: 80,
    height: 80
  },
  media: {
    width: 360,
    height: 360
  }
}

@injectSheet(styles)
export default class LinkPreview extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    sourceUrl: PropTypes.string.isRequired,
    authorName: PropTypes.string,
    authorLink: PropTypes.string,
    authorIcon: PropTypes.string,
    title: PropTypes.string,
    titleLink: PropTypes.string,
    text: PropTypes.string,
    imageUrl: PropTypes.string,
    mediaWidth: PropTypes.number,
    mediaHeight: PropTypes.number,
    embedHtml: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      type,
      sourceUrl,
      authorName, authorLink, authorIcon,
      title, titleLink,
      text,
      imageUrl, mediaWidth, mediaHeight,
      embedHtml,
      color,
      className,
      sheet: {classes}
    } = this.props

    // TODO generate color from sourceUrl's domain e.g. facebook.com
    // when the server doesn't return it.
    const border = {boxShadow: `-3px 0 0 0 ${color || gray}`}

    const isMedia = ['video', 'audio'].includes(type)
    const {
      width,
      height
    } = defaultMediaSize[isMedia ? 'media' : type] || {width: 100, height: 100}
    const mediaInfo = {
      url: imageUrl,
      thumbnailUrl: imageUrl,
      thumbnailWidth: mediaWidth || width,
      thumbnailHeight: mediaHeight || height
    }
    console.log(this.props)
    return (
      <Bubble hasArrow={false} className={className} style={border}>
        <div className={classes.main}>
          {authorName &&
            <Author
              name={authorName}
              link={authorLink}
              iconUrl={authorIcon} />
          }
          {title &&
            <Row><Title text={title} link={titleLink} /></Row>
          }
          {text &&
            <Row><p>{text}</p></Row>
          }
          {type === 'image' && imageUrl && (
            <Row spaced><ImageAttachment {...mediaInfo} /></Row>
          )}
          {isMedia && embedHtml && (
            <Row spaced>
              <Media
                previewUrl={mediaInfo.url}
                embed={embedHtml}
                permalink={sourceUrl || titleLink} />
            </Row>
          )}
        </div>
        {type === 'image_s' && imageUrl && (
          <div className={classes.side}>
            <ImageAttachment {...mediaInfo} />
          </div>
        )}
      </Bubble>
    )
  }
}
