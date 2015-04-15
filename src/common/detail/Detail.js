import React from 'react'
import useSheet from 'react-jss'
import dotpather from 'dotpather'

import detailStyle from './detailStyle'

let getImageUrl = dotpather('preview.image.url')

/**
 * Detail view for objects.
 */
export default React.createClass({
  mixins: [useSheet(detailStyle)],

  getDefaultProps() {
    return {
      height: null,
      className: '',
      data: null
    }
  },

  render() {
    let {classes} = this.sheet
    let data = this.props.data.detail || {}
    let previewUrl = getImageUrl(data)
    let previewStyle
    if (previewUrl) {
      previewStyle = {
        backgroundImage: `url(${previewUrl})`
      }
    }

    let style = {
      height: `${this.props.height}px`
    }

    return (
      <div className={`${classes.container} ${this.props.className}`} style={style}>
        <div className={classes.preview} style={previewStyle}></div>
        <div className={classes.contentWrapper}>
          <h2 className={classes.title}>{data.title}</h2>
          <h3 className={classes.subtitle}>{data.subtitle}</h3>
          <p className={classes.description}>{data.description}</p>
        </div>
      </div>
    )
  }
})
