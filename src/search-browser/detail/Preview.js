import React, {Component} from 'react'
import ImagesLoader from 'images-loader'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../../jss'
import Spinner from '../../spinner/Spinner'
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

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.load(this.props.image)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      error: null
    })
    this.load(nextProps.image)
  }

  render() {
    let {classes} = this.props.sheet
    let {error} = this.state

    if (this.state.loading && !error) {
      return <Spinner image={this.props.spinner} active={true} />
    }

    // TODO maybe show an error image.
    let image = error ? ImagesLoader.emptyGif : this.props.image
    return <img src={image} className={classes.preview} />
  }

  load(image) {
    loader.load(image, err => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }
}
