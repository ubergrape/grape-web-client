import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import fonts from 'grape-theme/dist/fonts'
import { FormattedMessage } from 'react-intl'
import sizes from 'grape-theme/dist/sizes'
import Icon from 'grape-web/lib/svg-icons/Icon'

import { spacing } from '../constants'
import Contacts from './Contacts'

const styles = ({ palette }) => ({
  root: {
    display: 'block',
  },
  section: {
    extend: fonts.small,
    display: 'block',
    marginBottom: spacing,
    color: palette.text.primary,
  },
  sectionTitle: {
    extend: fonts.small,
    display: 'block',
    lineHeight: 1,
    marginBottom: sizes.spacer.s,
    textTransform: 'uppercase',
    color: palette.text.secondary,
  },
  whatIDo: {
    display: 'flex',
    maxHeight: 200,
    overflowY: 'auto',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    color: 'inherit',
  },
  whatIDoIcon: {
    flexShrink: 0,
    fontSize: 'inherit',
    color: palette.text.secondary,
    marginRight: sizes.spacer.s,
    marginTop: 3,
  },
})

const About = ({ classes, whatIDo, ...contacts }) => (
  <div className={classes.root}>
    {whatIDo && (
      <section className={classes.section}>
        <h2 className={classes.sectionTitle}>
          <FormattedMessage id="whatIDo" defaultMessage="What I do" />
        </h2>
        <div className={classes.whatIDo}>
          <Icon name="infoFilled" className={classes.whatIDoIcon} />
          <p>{whatIDo}</p>
        </div>
      </section>
    )}
    <section className={classes.section}>
      <h2 className={classes.sectionTitle}>
        <FormattedMessage
          id="contactInfo"
          defaultMessage="Contact information"
        />
      </h2>
      <Contacts {...contacts} />
    </section>
  </div>
)

About.propTypes = {
  classes: PropTypes.object.isRequired,
  whatIDo: PropTypes.string,
}

About.defaultProps = {
  whatIDo: undefined,
}

export default injectSheet(styles)(About)
