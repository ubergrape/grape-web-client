import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import sizes from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'
import { FormattedMessage } from 'react-intl'

import inlineLink from '../../button/inlineLink'

const styles = ({ palette }) => ({
  row: {
    display: 'flex',
    marginBottom: sizes.spacer.s,
    alignItems: 'center',
  },
  fixed: {
    extend: fonts.small,
    flex: {
      grow: 0,
      shrink: 0,
    },
    marginRight: sizes.spacer.s,
    color: palette.text.secondary,
    lineHeight: 1,
  },
  icon: {
    composes: '$fixed',
    marginRight: sizes.spacer.s,
    width: '1em',
  },
  name: {
    composes: '$fixed',
    width: 60,
  },
  value: {
    flex: 1,
    extend: ellipsis,
  },
  link: {
    extend: [inlineLink, fonts.small],
    lineHeight: 1,
  },
})

const Contacts = ({
  classes,
  hideEmailField,
  email,
  skypeUsername,
  skypeForBusiness,
  phoneNumber,
}) => (
  <ul>
    {!hideEmailField && (
      <li className={classes.row}>
        <Icon name="envelope" className={classes.icon} />
        <span className={classes.name}>
          <FormattedMessage id="email" defaultMessage="E-mail" />
        </span>
        <span className={classes.value}>
          <a href={`mailto:${email}`} className={classes.link}>
            {email}
          </a>
        </span>
      </li>
    )}
    {skypeUsername && (
      <li className={classes.row}>
        <Icon name="skype" className={classes.icon} />
        <span className={classes.name}>
          <FormattedMessage id="skype" defaultMessage="Skype" />
        </span>
        <span className={classes.value}>
          <a href={`skype:${skypeUsername}`} className={classes.link}>
            {skypeUsername}
          </a>
        </span>
      </li>
    )}
    {skypeForBusiness && (
      <li className={classes.row}>
        <Icon name="skype" className={classes.icon} />
        <span className={classes.name}>
          <FormattedMessage id="skype" defaultMessage="Skype" />
        </span>
        <span className={classes.value}>
          <a href={`callto:sip:${skypeForBusiness}`} className={classes.link}>
            {skypeForBusiness}
          </a>
        </span>
      </li>
    )}
    {phoneNumber && (
      <li className={classes.row}>
        <Icon name="phone" className={classes.icon} />
        <span className={classes.name}>
          <FormattedMessage id="phone" defaultMessage="Phone" />
        </span>
        <span className={classes.value}>
          <a href={`tel:${phoneNumber}`} className={classes.link}>
            {phoneNumber}
          </a>
        </span>
      </li>
    )}
  </ul>
)

Contacts.propTypes = {
  classes: PropTypes.object.isRequired,
  hideEmailField: PropTypes.bool,
  email: PropTypes.string,
  skypeUsername: PropTypes.string,
  skypeForBusiness: PropTypes.string,
  phoneNumber: PropTypes.string,
}

Contacts.defaultProps = {
  hideEmailField: false,
  email: undefined,
  skypeUsername: undefined,
  skypeForBusiness: undefined,
  phoneNumber: undefined,
}

export default injectSheet(styles)(Contacts)
