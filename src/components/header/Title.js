import React from 'react'
import PropTypes from 'prop-types'
import {gray, grayDarker} from 'grape-theme/dist/base-colors'
import {small, big} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import injectSheet from 'grape-web/lib/jss'

const styles = {
  name: {
    extend: [ellipsis, big],
    fontWeight: 'bold',
    lineHeight: 1.2,
    color: grayDarker
  },
  description: {
    extend: [ellipsis, small],
    lineHeight: 1.2,
    color: gray
  }
}

const Title = ({channel, mate, classes}) => {
  const title = (
    <h1 className={classes.name}>
      {channel.name || mate.displayName}
    </h1>
  )
  if (!channel.description) return title

  return (
    <div>
      {title}
      <h2 className={classes.description}>
        {channel.description}
      </h2>
    </div>
  )
}

Title.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  mate: PropTypes.shape({
    displayName: PropTypes.string
  }).isRequired,
  classes: PropTypes.object.isRequired
}

export default injectSheet(styles)(Title)
