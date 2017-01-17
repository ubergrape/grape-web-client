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
  video: {
    width: 360,
    height: 360
  }
}

@injectSheet(styles)
export default class LinkPreview extends PureComponent {
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
      sheet: {classes}
    } = this.props

    const border = {boxShadow: `-3px 0 0 0 ${color || gray}`}

    const {width, height} = defaultMediaSize[type] || {width: 100, height: 100}
    const mediaInfo = {
      url: imageUrl,
      thumbnailUrl: imageUrl,
      thumbnailWidth: mediaWidth || width,
      thumbnailHeight: mediaHeight || height
    }

    return (
      <Bubble hasArrow={false} style={border}>
        <div className={classes.main}>
          {authorName &&
            <Author
              name={authorName}
              link={authorLink}
              icon={authorIcon} />
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
          {type === 'video' && embedHtml && (
            <Row spaced>
              <Media
                previewUrl={mediaInfo.url}
                embed={embedHtml}
                permalink={sourceUrl || titleLink} />
            </Row>
          )}
        </div>
        {type === 'image_s' && imageUrl && (
          <ImageAttachment {...mediaInfo} />
        )}
      </Bubble>
    )
  }
}
