import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import groupConsecutive from '../../../utils/group-consecutive'

import {
  Author,
  Bubble,
  Field,
  Footer,
  Embed,
  ImagePreviewLink,
  Row,
  Title
} from './parts'
import ImageAttachment from '../attachments/ImageAttachment'
import {styles} from './linkAttachmentTheme.js'

const fieldsGroupSize = 2

const groupFields = fields => groupConsecutive(
  fields, fieldsGroupSize,
  (field, nextField) => field.short && nextField.short
)

const getThumbUrl = ({imageUrl, width, height}) => (
  `${imageUrl}${width}x${height}`
)

@injectSheet(styles)
export default class LinkAttachment extends PureComponent {
  static propTypes = {
    sourceUrl: PropTypes.string.isRequired,
    footerIcon: PropTypes.string.isRequired,
    footer: PropTypes.string.isRequired,
    footerUrl: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorLink: PropTypes.string.isRequired,
    authorIcon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleLink: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    thumbUrl: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    embedHtml: PropTypes.string.isRequired,
    ts: PropTypes.number.isRequired,
    fields: PropTypes.array.isRequired,
    className: PropTypes.string.isRequired,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    width: 360,
    height: 360,
    fields: [],
    footerIcon: null,
    footer: null,
    footerUrl: null,
    authorName: null,
    authorLink: null,
    authorIcon: null,
    titleLink: null,
    text: null,
    imageUrl: null,
    thumbUrl: null,
    embedHtml: null,
    ts: null,
    className: ''
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
        iconUrl={authorIcon}
      />
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

  renderFooter() {
    const {
      footer,
      footerIcon,
      footerUrl,
      ts
    } = this.props

    return (
      <Footer
        text={footer}
        icon={footerIcon}
        url={footerUrl}
        timestamp={ts}
      />
    )
  }

  renderImage() {
    const {
      imageUrl,
      width,
      height
    } = this.props

    const thumbUrl = getThumbUrl({
      imageUrl,
      width,
      height
    })

    return (
      <Row spaced>
        <ImageAttachment
          url={imageUrl}
          thumbnailUrl={thumbUrl}
          thumbnailWidth={width}
          thumbnailHeight={height}
        />
      </Row>
    )
  }

  renderEmbed() {
    const {
      embedHtml,
      imageUrl,
      width,
      height,
      sourceUrl
    } = this.props

    const thumbUrl = getThumbUrl({
      imageUrl,
      width,
      height
    })

    return (
      <Row spaced>
        <Embed
          embedHtml={embedHtml}
          thumbUrl={thumbUrl}
          width={width}
          height={height}
          permalink={sourceUrl}
        />
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
          permalink={sourceUrl}
        />
      </div>
    )
  }

  renderFields() {
    const {
      fields,
      sourceUrl,
      sheet: {classes}
    } = this.props

    let key = 0
    const fieldGroups = groupFields(fields)

    return (
      <div className={classes.fields}>
        {fieldGroups.map(group => (
          <div
            className={
              cn(classes.fieldGroup, group.length === fieldsGroupSize && classes.fieldGroupShort)
            }
            key={`${sourceUrl}-${key++}`}
          >
            {group.map(({title, value}) => (
              <Field
                title={title}
                value={value}
                key={`${sourceUrl}-${key++}`}
              />
            ))}
          </div>
        ))}
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
      fields,
      footer,
      className,
      sheet: {classes}
    } = this.props

    return (
      <Bubble hasArrow={false} className={className}>
        <div className={classes.main}>
          {authorName && this.renderAuthor()}
          {title && this.renderTitle()}
          {text && this.renderText()}
          {fields.length > 0 && this.renderFields()}
          {footer && this.renderFooter()}
          {imageUrl && !embedHtml && this.renderImage()}
          {embedHtml && this.renderEmbed()}
        </div>
        {!imageUrl && !embedHtml && thumbUrl && this.renderImageLinkPreview()}
      </Bubble>
    )
  }
}
