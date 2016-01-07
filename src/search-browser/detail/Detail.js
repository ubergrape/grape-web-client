import React, {Component, PropTypes} from 'react'
import get from 'lodash/object/get'
import isEmpty from 'lodash/lang/isEmpty'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import Preview from './Preview'
import Empty from './DetailEmpty'
import style from './detailStyle'
import * as utils from './utils'

/**
 * Detail view for objects.
 */
@useSheet(style)
export default class Detail extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    data: PropTypes.object,
    images: PropTypes.object
  }

  static defaultProps = {
    data: {},
    images: {}
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  renderMain() {
    const {classes} = this.props.sheet
    const {iconUrl, title, subtitle, description} = this.props.data

    if (!title && !subtitle && !description) return null

    return (
      <div className={classes.article}>
        {iconUrl && <img src={iconUrl} className={classes.icon} />}
        <div>
          {title && <h2 className={classes.title}>{title}</h2>}
          {subtitle && <h3 className={classes.subtitle}>{subtitle}</h3>}
          {description && <p className={classes.description}>{description}</p>}
        </div>
      </div>
    )
  }

  renderMeta() {
    const {classes} = this.props.sheet
    const {data} = this.props

    if (!data.meta) return null

    return (
      <div className={classes.metaContainer}>
        {data.meta.map((item, i) => {
          return (
            <div className={classes.metaRow} key={i}>
              <div className={classes.metaLabel}>
                {item.label}
              </div>
              <div className={classes.metaValue}>
                {utils.formatDateMaybe(item.label, item.value)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet
    const {data, images} = this.props

    if (isEmpty(data)) return <Empty images={images} />

    const previewUrl = get(data, 'preview.image.url')

    return (
      <div className={classes.detail}>
        {previewUrl && (
          <div className={classes.previewContainer}>
            <Preview
              image={previewUrl}
              spinner={images.spinner} />
          </div>
        )}
        {this.renderMain()}
        {this.renderMeta()}
      </div>
    )
  }
}
