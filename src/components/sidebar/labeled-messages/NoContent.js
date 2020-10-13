import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { gray } from 'grape-theme/dist/base-colors'
import { big, small } from 'grape-theme/dist/fonts'
import { FormattedMessage } from 'react-intl'
import MagicWand from 'grape-web/lib/components/svg-icons/MagicWand'

@injectSheet({
  noContent: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  magicWand: {
    height: '2em',
  },
  title: {
    extend: big,
    color: gray,
    width: '50%',
    textAlign: 'center',
    margin: [20, 0],
  },
  text: {
    extend: small,
    color: gray,
    width: '50%',
    textAlign: 'center',
    marginBottom: small.fontSize,
  },
})
export default class NoContent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.noContent}>
        <MagicWand className={classes.magicWand} />
        <h2 className={classes.title}>
          <FormattedMessage
            id="labeledMessagesNoContentTitle"
            defaultMessage="This is where the magic happens."
          />
        </h2>
        <p className={classes.text}>
          <FormattedMessage
            id="labeledMessagesNoContentText1"
            defaultMessage="{product} automatically summarizes your conversations, so you can browse and find them based on context - we call it “amplified intelligence”."
            values={{ product: __PRODUCT_NAME__ }}
          />
        </p>
        <p className={classes.text}>
          <FormattedMessage
            id="labeledMessagesNoContentText2"
            defaultMessage="Write a few Tasks or Questions to see them appear here!"
          />
        </p>
      </div>
    )
  }
}
