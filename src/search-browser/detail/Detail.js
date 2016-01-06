import React, {Component, PropTypes} from 'react'
import get from 'lodash/object/get'
import isEmpty from 'lodash/lang/isEmpty'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import Preview from './Preview'
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
    images: PropTypes.object,
    headerHeight: PropTypes.number
  }

  static defaultProps = {
    data: {},
    headerHeight: undefined,
    images: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  renderHeader() {
    const {classes} = this.props.sheet
    const {data} = this.props
    const previewUrl = get(data, 'preview.image.url')
    const {iconUrl} = data

    if (!previewUrl && !iconUrl) return null

    let image

    if (previewUrl) {
      image = <Preview image={previewUrl} spinner={this.props.images.spinner} />
    } else {
      image = <img src={iconUrl} className={classes.icon}/>
    }

    return (
      <header
        className={classes.header}
        style={{height: this.props.headerHeight}}>
        {image}
      </header>
    )
  }

  renderEmpty() {
    const {classes} = this.props.sheet

    return (
      <div className={`${classes.detail} ${classes.empty}`}>
        <img src={this.props.images.noDetail} />
        <span className={classes.emptyNote}>No Detail Infos for this Item</span>
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
    const {data} = this.props

    if (isEmpty(data)) return this.renderEmpty()

    return (
      <div className={classes.detail}>
        {this.renderHeader()}
        <div className={classes.body}>
          <h2 className={classes.title}>{data.title}</h2>
          <h3 className={classes.subtitle}>{data.subtitle}</h3>
          <p className={classes.description}>{data.description}</p>
          {this.renderMeta()}
        </div>
      </div>
    )
  }
}
