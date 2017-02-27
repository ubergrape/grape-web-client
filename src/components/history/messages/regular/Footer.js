import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import Task from './task/Task'

@injectSheet({
  footer: {
    marginTop: 20
  }
})
export default class Footer extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    nlp: PropTypes.object
  }

  static defaultProps = {
    nlp: null
  }

  render() {
    const {nlp, classes, ...taskProps} = this.props

    if (!nlp) return null

    return (
      <div className={classes.footer}>
        <Task {...taskProps} {...nlp} />
      </div>
    )
  }
}
