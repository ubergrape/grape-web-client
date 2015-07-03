import React, {Component} from 'react'
import useSheet from 'react-jss'
import get from 'lodash-es/object/get'
import isEmpty from 'lodash-es/lang/isEmpty'
import ImagesLoader from 'images-loader'
import {shouldPureComponentUpdate} from 'react-pure-render'

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

  constructor(props) {
    super(props)
    this.loader = new ImagesLoader()
    this.state = this.createState(this.props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    if (this.state.isPreview) this.loadPreview(this.props)
  }

  componentWillReceiveProps(nextProps) {
    let state = this.createState(nextProps)
    this.setState(state)
    if (state.isPreview) this.loadPreview(nextProps)
  }

  render() {
    let {classes} = this.props.sheet
    let {data} = this.props
    let {imageUrl} = this.state

    let header
    if (imageUrl) {
      let style = {height: this.props.headerHeight}
      header = (
        <header className={classes.header} style={style}>
          <img
            src={imageUrl}
            className={this.state.isPreview ? classes.preview : classes.icon} />
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

  createState(props) {
    let isPreview = Boolean(this.getPreviewUrl(props))
    let {iconUrl} = props.data
    let imageUrl

    if (isPreview) imageUrl = props.images.spinner
    else if (iconUrl) imageUrl = iconUrl

    return {imageUrl, isPreview}
  }

  getPreviewUrl(props) {
    return get(props, 'data.preview.image.url')
  }

  loadPreview(props) {
    let imageUrl = this.getPreviewUrl(props)
    if (!imageUrl) return
    this.loader.load(imageUrl, err => {
      // TODO maybe show an error image.
      if (err) imageUrl = ImagesLoader.emptyGif
      this.setState({imageUrl})
    })
  }
}
