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
      data: undefined,
      headerHeight: undefined,
      images: undefined
    }
  },

  render() {
    let {classes} = this.sheet
    let data = this.props.data || {}

    let previewUrl = getImageUrl(data)
    let header
    if (previewUrl) {
      let imgStyle = {maxHeight: this.props.headerHeight + 'px'}
      header = (
        <header className={classes.header}>
          <img style={imgStyle} src={previewUrl} className={classes.preview} />
        </header>
      )
    }

    if (!this.props.data) {
      let style = {backgroundImage: `url(${this.props.images.noDetail})`}
      return (
        <div className={`${classes.detail} ${classes.empty}`} style={style}>
          <span className={classes.emptyNote}>No Detail Infos for this Object</span>
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
          {data.meta && data.meta.map(item => {
            return (
              <div>
                <b>{item.label + ': '}</b>
                <span>{item.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
