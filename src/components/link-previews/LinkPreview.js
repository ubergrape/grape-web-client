import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {
  Author,
  Bubble,
  Footer,
  Embed,
  ImagePreviewLink,
  Row,
  Title
} from './parts'
import ImageAttachment from '../message-parts/attachments/ImageAttachment'
import {styles} from './linkPreviewTheme.js'

@injectSheet(styles)
export default class LinkPreview extends PureComponent {
  static propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    serviceIcon: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
    serviceUrl: PropTypes.string.isRequired,
    authorName: PropTypes.string,
    authorLink: PropTypes.string,
    authorIcon: PropTypes.string,
    title: PropTypes.string.isRequired,
    titleLink: PropTypes.string,
    text: PropTypes.string,
    imageUrl: PropTypes.string,
    thumbUrl: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    embedUrl: PropTypes.string,
    ts: PropTypes.number.isRequired,
    className: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    width: 360,
    height: 360
  }

  render() {
    const {
      sourceUrl,
      serviceIcon, serviceName, serviceUrl,
      authorName, authorLink, authorIcon,
      title, titleLink,
      text,
      imageUrl, thumbUrl,
      width, height,
      embedUrl,
      ts,
      className,
      sheet: {classes}
    } = this.props

    return (
      <div>
        <Bubble hasArrow={false} className={className}>
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
              <Row><p className={classes.text}>{text}</p></Row>
            }
            <Footer
              serviceName={serviceName}
              serviceIcon={serviceIcon}
              serviceUrl={serviceUrl}
              timestamp={ts}
             />
            {imageUrl && (
              <Row spaced>
                <ImageAttachment
                  url={imageUrl}
                  thumbnailUrl={thumbUrl || imageUrl}
                  thumbnailWidth={width}
                  thumbnailHeight={height} />
              </Row>
            )}
            {embedUrl && (
              <Row spaced>
                <Embed
                  embedUrl={embedUrl}
                  thumbUrl={thumbUrl}
                  width={width}
                  height={height}
                  permalink={sourceUrl} />
              </Row>
            )}
          </div>
          {thumbUrl && !embedUrl && !imageUrl && (
            <div className={classes.side}>
              <ImagePreviewLink
                url={thumbUrl}
                permalink={sourceUrl} />
            </div>
          )}
        </Bubble>
      </div>
    )
  }
}
