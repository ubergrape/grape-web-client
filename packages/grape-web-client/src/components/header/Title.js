import React from 'react'
import PropTypes from 'prop-types'
import { small, big } from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import injectSheet from 'grape-web/lib/jss'

const styles = ({ palette }) => ({
  root: {
    overflow: 'hidden',
  },
  name: {
    extend: [ellipsis, big],
    fontWeight: 'bold',
    lineHeight: 1.2,
    color: palette.grey.A400,
  },
  description: {
    extend: [ellipsis, small],
    lineHeight: 1.2,
    color: palette.text.secondary,
  },
})

const Title = ({ channel, partner, classes }) => {
  const title = (
    <h1 className={classes.name}>{channel.name || partner.displayName}</h1>
  )
  if (!channel.description) return title

  return (
    <div className={classes.root}>
      {title}
      <h2 className={classes.description}>{channel.description}</h2>
    </div>
  )
}

Title.propTypes = {
  channel: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  partner: PropTypes.shape({
    displayName: PropTypes.string,
  }).isRequired,
  classes: PropTypes.object.isRequired,
}

export default injectSheet(styles)(Title)
