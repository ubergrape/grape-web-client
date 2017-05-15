import PropTypes from 'prop-types'
import React, {Component} from 'react'
import get from 'lodash/object/get'
import isEmpty from 'lodash/lang/isEmpty'

import injectSheet from 'grape-web/lib/jss'
import Preview from './Preview'
import Empty from './DetailEmpty'
import Actions from './Actions'
import ServiceIcon from '../service-icon/ServiceIcon'
import style from './detailStyle'
import * as utils from './utils'
import {listTypes} from '../constants'

/**
 * Detail view for objects.
 */
@injectSheet(style)
export default class Detail extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    data: PropTypes.object,
    images: PropTypes.object,
    focusedView: PropTypes.oneOf(listTypes),
    actions: PropTypes.array,
    focusedAction: PropTypes.object,
    hoveredAction: PropTypes.object,
    onFocusAction: PropTypes.func,
    execSearchBrowserAction: PropTypes.func,
    focusSearchBrowserAction: PropTypes.func,
    blurSearchBrowserAction: PropTypes.func
  }

  static defaultProps = {
    data: {},
    images: {}
  }

  renderPreview() {
    const {classes} = this.props.sheet
    const {data, images} = this.props
    const previewUrl = get(data, 'preview.image.url')

    if (!previewUrl) return null

    return (
      <div className={classes.previewContainer}>
        <Preview
          image={previewUrl}
          spinner={images.spinner} />
      </div>
    )
  }

  renderInfo() {
    const {classes} = this.props.sheet
    const {service, title, subtitle, description} = this.props.data

    if (!title && !subtitle && !description) return null

    return (
      <div className={classes.article}>
        <ServiceIcon service={service} theme={{classes}} />
        <div className={classes.articleBody}>
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
    if (isEmpty(this.props.data)) return <Empty images={this.props.images} />

    return (
      <div className={classes.detail}>
        <div className={classes.content}>
          {this.renderPreview()}
          {this.renderInfo()}
          {this.renderMeta()}
        </div>
        <Actions
          focused={this.props.focusedView === 'actions'}
          items={this.props.actions}
          focusedAction={this.props.focusedAction}
          hoveredAction={this.props.hoveredAction}
          onSelect={this.props.execSearchBrowserAction}
          onFocus={this.props.focusSearchBrowserAction}
          onBlur={this.props.blurSearchBrowserAction} />
      </div>
    )
  }
}
