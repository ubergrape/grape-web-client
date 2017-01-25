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
import {styles} from './linkAttachmentTheme.js'

@injectSheet(styles)
export default class LinkAttachment extends PureComponent {
  static propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    footerIcon: PropTypes.string,
    footer: PropTypes.string.isRequired,
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
    embedHtml: PropTypes.string,
    ts: PropTypes.number.isRequired,
    className: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    width: 360,
    height: 360
  }

  renderAuthor() {
    const {
      authorName,
      authorLink,
      authorIcon
    } = this.props

    return (
      <Author
        name={authorName}
        link={authorLink}
        iconUrl={authorIcon} />
    )
  }

  renderTitle() {
    const {title, titleLink} = this.props
    return (
      <Row><Title text={title} link={titleLink} /></Row>
    )
  }

  renderText() {
    const {
      text,
      sheet: {classes}
    } = this.props

    return (
      <Row><p className={classes.text}>{text}</p></Row>
    )
  }

  renderImage() {
    const {
      imageUrl,
      thumbUrl,
      width,
      height
    } = this.props

    return (
      <Row spaced>
        <ImageAttachment
          url={imageUrl}
          thumbnailUrl={thumbUrl || imageUrl}
          thumbnailWidth={width}
          thumbnailHeight={height} />
      </Row>
    )
  }

  renderEmbed() {
    const {
      embedHtml,
      thumbUrl,
      width,
      height,
      sourceUrl
    } = this.props

    return (
      <Row spaced>
        <Embed
          embedHtml={embedHtml}
          thumbUrl={thumbUrl}
          width={width}
          height={height}
          permalink={sourceUrl} />
      </Row>
    )
  }

  renderImageLinkPreview() {
    const {
      thumbUrl,
      sourceUrl,
      sheet: {classes}
    } = this.props

    return (
      <div className={classes.side}>
        <ImagePreviewLink
          url={thumbUrl}
          permalink={sourceUrl} />
      </div>
    )
  }

  render() {
    const {
      authorName,
      title,
      text,
      imageUrl, thumbUrl,
      embedHtml,
      footerIcon, footer,
      ts,
      className,
      sheet: {classes}
    } = this.props

    return (
      <div>
        <Bubble hasArrow={false} className={className}>
          <div className={classes.main}>
            {authorName && this.renderAuthor()}
            {title && this.renderTitle()}
            {text && this.renderText()}
            <Footer
              text={footer}
              icon={footerIcon}
              timestamp={ts}
             />
            {imageUrl && this.renderImage()}
            {embedHtml && this.renderEmbed()}
          </div>
          {thumbUrl && !embedHtml && !imageUrl && this.renderImageLinkPreview()}
        </Bubble>
      </div>
    )
  }
}
