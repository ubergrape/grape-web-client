import React, {Component} from 'react'
import useSheet from 'react-jss'
import ImagesLoader from 'images-loader'
import {shouldPureComponentUpdate} from 'react-pure-render'

import style from './previewStyle'

let loader = new ImagesLoader()

/**
 * Detail view for objects.
 */
@useSheet(style)
export default class Preview extends Component {
  static defaultProps = {
    image: undefined,
    spinner: undefined
  }

  constructor(props) {
    super(props)
    this.state = {image: this.props.spinner}
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.load(this.props.image)
  }

  componentWillReceiveProps(nextProps) {
    let state = {image: nextProps.spinner}
    this.setState(state)
    this.load(nextProps.image)
  }

  render() {
    let {classes} = this.props.sheet
    return <img src={this.state.image} className={classes.preview} />
  }

  load(image) {
    loader.load(image, err => {
      // TODO maybe show an error image.
      if (err) image = ImagesLoader.emptyGif
      this.setState({image})
    })
  }
}
