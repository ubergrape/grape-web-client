import PropTypes from 'prop-types'
import React, { Component } from 'react'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'

import style from './style'

/**
 * Info messages for the user for e.g. to explain integrations.
 */
class Info extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    onAddIntegration: PropTypes.func,
  }

  static defaultProps = {
    onAddIntegration: noop,
  }

  onAddIntegration = e => {
    e.preventDefault()
    this.props.onAddIntegration()
  }

  render() {
    const { classes } = this.props.sheet

    return (
      <div className={classes.info}>
        <FormattedMessage
          id="searchInfo"
          defaultMessage="Search Wikipedia, YouTube, Giphy and {tools} by clicking {plusIcon} or pressing the plus key on your keyboard"
          values={{
            tools: (
              <a href="" onClick={this.onAddIntegration}>
                <FormattedMessage
                  id="yourBusinessTools"
                  description="*Describe yourBusinessTools*: link used in sentence 'Search Wikipedia, Youtube, Giphy and {tools}'"
                  defaultMessage="your business tools"
                />
              </a>
            ),
            plusIcon: <i className={classes.plusIcon} />,
          }}
        />
        .
      </div>
    )
  }
}

export default injectSheet(style)(Info)
