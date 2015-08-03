import React, {Component} from 'react'
import get from 'lodash/object/get'
import isEmpty from 'lodash/lang/isEmpty'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../../jss'
import Preview from './Preview'
import style from './style'
import * as utils from './utils'

/**
 * Detail view for objects.
 */
@useSheet(style)
export default class Detail extends Component {
  static defaultProps = {
    data: {},
    headerHeight: undefined,
    images: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    let {classes} = this.props.sheet
    let {data} = this.props
    let previewUrl = get(data, 'preview.image.url')
    let {iconUrl} = data

    let header
    if (previewUrl || iconUrl) {
      let image

      if (previewUrl) {
        image = <Preview image={previewUrl} spinner={this.props.images.spinner} />
      }
      else {
        image = <img src={iconUrl} className={classes.icon}/>
      }

      header = (
        <header
          className={classes.header}
          style={{height: this.props.headerHeight}}>
          {image}
        </header>
      )
    }

    if (isEmpty(data)) {
      return (
        <div className={`${classes.detail} ${classes.empty}`}>
          <img src={this.props.images.noDetail} />
          <span className={classes.emptyNote}>No Detail Infos for this Item</span>
        </div>
      )
    }

    return (
      <div className={classes.detail}>
        {header}
        <div className={classes.body}>
          <h2 className={classes.title}>{data.title}</h2>
          <h3 className={classes.subtitle}>{data.subtitle}</h3>
          <p className={classes.description}>{data.description}</p>
          {data.meta &&
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
          }
        </div>
      </div>
    )
  }
}
