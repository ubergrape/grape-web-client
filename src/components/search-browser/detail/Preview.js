import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ImagesLoader from 'images-loader'
import pick from 'lodash/pick'

import Spinner from 'grape-web/lib/components/spinner'

const loader = new ImagesLoader()

const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

/**
 * Preview image with loading indication.
 */
export default class Preview extends Component {
  static propTypes = {
    image: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    maxWidth: stringOrNumber,
    maxHeight: stringOrNumber,
    height: stringOrNumber,
    width: stringOrNumber,
    /* eslint-enable react/no-unused-prop-types */
  }

  static defaultProps = {
    maxWidth: '100%',
    maxHeight: '100%',
    height: 'auto',
    width: 'auto',
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: null,
    }
  }

  componentDidMount() {
    this.load(this.props.image)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: true,
      error: null,
    })
    this.load(nextProps.image)
  }

  load(image) {
    loader.load(image, err => {
      this.setState({
        loading: false,
        error: err,
      })
    })
  }

  render() {
    const { error } = this.state

    if (this.state.loading && !error) {
      return <Spinner />
    }

    // TODO maybe show an error image.
    const image = error ? ImagesLoader.emptyGif : this.props.image
    const style = pick(this.props, 'width', 'height', 'maxWidth', 'maxHeight')
    return <img src={image} style={style} alt="" />
  }
}
