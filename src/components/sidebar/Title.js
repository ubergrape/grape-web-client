import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import fonts from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'
import cn from 'classnames'

import { spacing } from './constants'

const styles = ({ palette }) => ({
  root: {
    extend: [fonts.big, ellipsis],
    display: 'block',
    lineHeight: 1,
    color: palette.text.primary,
    padding: [sizes.spacer.m, spacing],
    margin: 0,
  },
})

const Title = ({ classes, className, children }) => (
  <h2 className={cn(classes.root, className)}>{children}</h2>
)

Title.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

Title.defaultProps = {
  className: undefined,
}

export default injectSheet(styles)(Title)
