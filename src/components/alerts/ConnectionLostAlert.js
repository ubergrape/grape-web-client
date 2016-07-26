import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import {useSheet} from 'grape-web/lib/jss'

import style from './alertStyle'

@useSheet(style)
export default class ConnectionLostAlert extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  onReload() {
    window.location.reload()
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <span>
        <FormattedMessage
          id="lostConnectionAlert"
          description="**Describe lostConnectionAlert**: it is alert asking for reload page."
          values={{
            action: (
              <button
                className={classes.buttonLink}
                onClick={this.onReload}>
                <FormattedMessage
                  id="reload"
                  defaultMessage="reload" />
              </button>
            )
          }}
          defaultMessage="Lost connection to the server — trying to reconnect. You can also try to {action}." />
      </span>
    )
  }
}
