import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import fonts from 'grape-theme/dist/fonts'
import { grayBlueDark } from 'grape-theme/dist/base-colors'
import cn from 'classnames'

import groupConsecutive from '../../../utils/group-consecutive'
import BubbleImageAttachment from './parts/ImageAttachment'
import Menu from '../menu/Menu'
import {
  Author,
  Bubble,
  Field,
  Footer,
  Embed,
  ImagePreviewLink,
  Row,
  Title,
} from './parts'

const fieldsGroupSize = 2

const groupFields = fields =>
  groupConsecutive(
    fields,
    fieldsGroupSize,
    (field, nextField) => field.short && nextField.short,
  )

const getThumbUrl = ({ imageUrl, width, height }) =>
  `${imageUrl}${width}x${height}`

@injectSheet({
  main: {
    flex: 1,
    minWidth: 0,
  },
  side: {
    marginLeft: 10,
  },
  text: {
    extend: fonts.normal,
    lineHeight: 1.4,
    margin: 0,
    color: grayBlueDark,
  },
  fields: {
    display: 'block',
    margin: [3, 0],
  },
  fieldGroup: {
    display: 'block',
    marginTop: 8,
    '&:first-child': {
      isolate: false,
      marginTop: 0,
    },
  },
  fieldGroupShort: {
    display: 'flex',
  },
  embed: {
    maxWidth: 480,
  },
})
export default class LinkAttachment extends PureComponent {
  static propTypes = {
    sourceUrl: PropTypes.string,
    footerIcon: PropTypes.string,
    footer: PropTypes.string,
    footerUrl: PropTypes.string,
    authorDisplayName: PropTypes.string,
    authorLink: PropTypes.string,
    authorIcon: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string,
    titleLink: PropTypes.string,
    text: PropTypes.string,
    imageUrl: PropTypes.string,
    thumbUrl: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    embedHtml: PropTypes.string,
    autoPlay: PropTypes.bool,
    ts: PropTypes.number,
    fields: PropTypes.array,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onRemove: PropTypes.func,
    messageText: PropTypes.string,
  }

  static defaultProps = {
    sourceUrl: '',
    width: 360,
    height: 360,
    fields: [],
    footerIcon: null,
    footer: null,
    footerUrl: null,
    authorDisplayName: null,
    authorLink: null,
    authorIcon: null,
    title: null,
    color: null,
    titleLink: null,
    text: null,
    imageUrl: null,
    thumbUrl: null,
    embedHtml: null,
    autoPlay: false,
    ts: null,
    className: '',
    onRemove: null,
    messageText: '',
  }

  state = { isMenuOpened: false }

  onMouseEnter = () => {
    this.setState({ isMenuOpened: true })
  }

  onMouseLeave = () => {
    this.setState({ isMenuOpened: false })
  }

  onRefContent = ref => {
    this.content = ref
  }

  getContentNode = () => this.content

  menuProps = {
    items: ['removeLinkAttachment'],
    onSelect: this.props.onRemove,
  }

  renderAuthor() {
    const { authorDisplayName, authorLink, authorIcon } = this.props

    return (
      <Row>
        <Author
          name={authorDisplayName}
          link={authorLink}
          iconUrl={authorIcon}
        />
      </Row>
    )
  }

  renderTitle() {
    const { title, titleLink } = this.props
    return (
      <Row>
        <Title text={title} link={titleLink} />
      </Row>
    )
  }

  renderText() {
    const { text, classes } = this.props

    return (
      <Row>
        <p className={classes.text}>{text}</p>
      </Row>
    )
  }

  renderFooter() {
    const { footer, footerIcon, footerUrl, ts } = this.props

    return (
      <Row>
        <Footer
          text={footer}
          icon={footerIcon}
          url={footerUrl}
          timestamp={ts}
        />
      </Row>
    )
  }

  renderImage() {
    const { imageUrl, width, height } = this.props

    const thumbUrl =
      imageUrl &&
      getThumbUrl({
        imageUrl,
        width,
        height,
      })

    return (
      <Row spaced>
        <BubbleImageAttachment
          url={imageUrl}
          thumbnailUrl={thumbUrl}
          width={width}
          height={height}
        />
      </Row>
    )
  }

  renderEmbed() {
    const {
      embedHtml,
      autoPlay,
      imageUrl,
      width,
      height,
      sourceUrl,
      classes,
    } = this.props

    const thumbUrl =
      imageUrl &&
      getThumbUrl({
        imageUrl,
        width,
        height,
      })

    return (
      <Row spaced className={classes.embed}>
        <Embed
          embedHtml={embedHtml}
          thumbUrl={thumbUrl}
          autoPlay={autoPlay}
          width={width}
          height={height}
          permalink={sourceUrl}
        />
      </Row>
    )
  }

  renderImageLinkPreview() {
    const { thumbUrl, sourceUrl, classes } = this.props

    return (
      <div className={classes.side}>
        <ImagePreviewLink url={thumbUrl} permalink={sourceUrl} />
      </div>
    )
  }

  renderFields() {
    const { fields, sourceUrl, classes } = this.props

    let key = 0
    const fieldGroups = groupFields(fields)

    return (
      <div className={classes.fields}>
        {fieldGroups.map(group => (
          <div
            className={cn(
              classes.fieldGroup,
              group.length === fieldsGroupSize && classes.fieldGroupShort,
            )}
            key={`${sourceUrl}-${key++}`}
          >
            {group.map(({ title, value }) => (
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

  renderRemoveButton = () => {
    const { isMenuOpened } = this.state

    const isAllowedToRemove = this.props.onRemove && isMenuOpened

    return (
      isAllowedToRemove && (
        <Menu {...this.menuProps} getContentNode={this.getContentNode} />
      )
    )
  }

  renderAttachments = () => {
    const {
      authorDisplayName,
      title,
      text,
      imageUrl,
      embedHtml,
      fields,
      footer,
      classes,
    } = this.props

    return (
      <div className={classes.main}>
        {authorDisplayName && this.renderAuthor()}
        {title && this.renderTitle()}
        {text && this.renderText()}
        {fields.length > 0 && this.renderFields()}
        {footer && this.renderFooter()}
        {imageUrl && !embedHtml && this.renderImage()}
        {embedHtml && this.renderEmbed()}
      </div>
    )
  }

  render() {
    const {
      imageUrl,
      embedHtml,
      color,
      thumbUrl,
      className,
      messageText,
    } = this.props

    return (
      <div ref={this.onRefContent} className={className}>
        {messageText ? (
          <Bubble
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            hasArrow={false}
            color={color}
          >
            {this.renderRemoveButton()}
            {this.renderAttachments()}
            {!imageUrl &&
              !embedHtml &&
              thumbUrl &&
              this.renderImageLinkPreview()}
          </Bubble>
        ) : (
          <div
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            {this.renderAttachments()}
            {!imageUrl &&
              !embedHtml &&
              thumbUrl &&
              this.renderImageLinkPreview()}
          </div>
        )}
      </div>
    )
  }
}
