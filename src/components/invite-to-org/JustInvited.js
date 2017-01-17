import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

export default function JustInvited(props) {
  const {theme: {classes}, invited} = props

  if (!invited.length) return null

  return (
    <div className={classes.success}>
      <FormattedMessage
        id="justInvited"
        defaultMessage={
          `Congratulations! You just invited {user} {amount, plural,
            =0 {}
            one {and one more people}
            other {and {amount} more people}}.`
        }
        values={{
          user: invited[0],
          amount: invited.length - 1
        }} />
    </div>
  )
}

JustInvited.propTypes = {
  theme: PropTypes.object.isRequired,
  invited: PropTypes.array.isRequired
}
