import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import Tasks from './task/Tasks'

class Footer extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    nlp: PropTypes.object,
  }

  static defaultProps = {
    nlp: null,
  }

  render() {
    const { nlp, classes, ...tasksProps } = this.props

    if (!nlp) return null

    return (
      <div className={classes.footer}>
        <Tasks {...tasksProps} {...nlp} />
      </div>
    )
  }
}

export default injectSheet({
  footer: {
    marginTop: 20,
  },
})(Footer)
