import React, {Component, PropTypes} from 'react'
import ImagesLoader from 'images-loader'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import Spinner from 'grape-web/lib/spinner/Spinner'
import style from './previewStyle'

const loader = new ImagesLoader()

/**
 * Detail view for objects.
 */
@useSheet(style)
export default class Preview extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    spinner: PropTypes.string,
    image: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null
    }
  }

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

  shouldComponentUpdate = shouldPureComponentUpdate

  load(image) {
    loader.load(image, err => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }

  render() {
    const {classes} = this.props.sheet
    const {error} = this.state

    if (this.state.loading && !error) {
      return <Spinner image={this.props.spinner} />
    }

    // TODO maybe show an error image.
    const image = error ? ImagesLoader.emptyGif : this.props.image
    return <img src={image} className={classes.preview} />
  }
}
