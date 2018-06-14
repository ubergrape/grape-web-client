import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import Tasks from './task/Tasks'

@injectSheet({
  footer: {
    marginTop: 20,
  },
})
export default class Footer extends PureComponent {
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
