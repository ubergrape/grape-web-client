import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { white } from 'grape-theme/dist/base-colors'
import { borderRadius } from 'grape-theme/dist/sizes'

const size = 80

@injectSheet({
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    backgroundColor: white,
    borderRadius: borderRadius.bigger,
    overflow: 'hidden',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
})
export default class ImagePreviewLink extends PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    permalink: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { url, permalink, classes } = this.props

    return (
      <a
        className={classes.link}
        href={permalink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={`${url}${size}x${size}`} alt="" className={classes.img} />
      </a>
    )
  }
}
