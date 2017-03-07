import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import {gray} from 'grape-theme/dist/base-colors'
import {big, small} from 'grape-theme/dist/fonts'
import {FormattedMessage} from 'react-intl'

@injectSheet({
  noContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%'
  },
  magicWand: {
    height: '2em'
  },
  title: {
    extend: big,
    color: gray,
    width: '50%',
    textAlign: 'center'
  },
  text: {
    extend: small,
    color: gray,
    width: '50%',
    textAlign: 'center'
  }
})
export default class NoContent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.noContent}>
        <Icon name="magicWand" className={classes.magicWand} />
        <h2 className={classes.title}>
          <FormattedMessage
            id="labelsOverviewNoContentTitle"
            defaultMessage="This is where the magic happens."
          />
        </h2>
        <p className={classes.text}>
          <FormattedMessage
            id="labelsOverviewNoContentText1"
            defaultMessage="Grape automatically summarizes your conversations, so you can browse and find them based on context - we call it “amplified intelligence”."
          />
        </p>
        <p className={classes.text}>
          <FormattedMessage
            id="labelsOverviewNoContentText2"
            defaultMessage="Write a few Tasks or Questions to see them appear here!"
          />
        </p>
      </div>
    )
  }
}
