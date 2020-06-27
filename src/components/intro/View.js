import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import fonts from 'grape-theme/dist/fonts'
import injectSheet from 'grape-web/lib/jss'
import { spacer } from 'grape-theme/dist/sizes'
import { FormattedMessage } from 'react-intl'
import Button from 'grape-web/lib/components/button'
import { rgba } from 'css-functions'

import { Done } from '../i18n'
import Tooltip from './Tooltip'
import { containerStyle } from './constants'

const styles = {
  root: containerStyle,
  hl: {
    extend: fonts.biggest,
    lineHeight: 1,
    color: 'white',
    fontWeight: 'bold',
    margin: 0,
    paddingBottom: spacer.m,
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    color: 'white',
    marginBottom: spacer.xxl,
  },
  text: {
    extend: fonts.normal,
    color: 'white',
  },
  image: {
    flexShrink: 0,
    width: 130,
    height: 130,
    marginLeft: spacer.xxl,
    borderRadius: '50%',
    background: {
      position: 'center',
      repeat: 'no-repeat',
      size: 'contain',
      image: ({ image }) => `url(${image})`,
    },
  },
  footer: {
    extend: fonts.small,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
  },
  button: {
    backgroundColor: rgba(0, 0, 0, 0.5),
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  skip: {
    extend: fonts.small,
    color: 'white',
    cursor: 'pointer',
  },
}

const SkipButton = props => (
  <FormattedMessage
    id="skipIntro"
    defaultMessage="Skip tutorial"
    description="Intro footer skip button"
  >
    {(...children) => <Button {...props}>{children}</Button>}
  </FormattedMessage>
)

const Footer = props => {
  const { classes, onNext, onSkip, onDone, isLast } = props

  if (isLast) {
    return (
      <Button
        raised
        color="primary"
        className={classes.button}
        onClick={onDone}
      >
        <Done />
      </Button>
    )
  }

  return (
    <div className={classes.footer}>
      <FormattedMessage
        id="buttonContinue"
        defaultMessage="Continue"
        description="Intro button continue."
      >
        {(...children) => (
          <Button
            raised
            color="primary"
            className={classes.button}
            onClick={onNext}
          >
            {children}
          </Button>
        )}
      </FormattedMessage>
      <FormattedMessage
        id="skipIfDone"
        defaultMessage="Already done? {skip}"
        description="Intro footer"
        values={{
          skip: <SkipButton className={classes.skip} onClick={onSkip} />,
        }}
      />
    </div>
  )
}

const Div = ({ className, children }) => (
  <div className={className}>{children}</div>
)

@injectSheet(styles)
export default class View extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    headline: PropTypes.node.isRequired,
    text: PropTypes.node.isRequired,
    beacon: PropTypes.string,
    background: PropTypes.string,
    container: PropTypes.object,
  }

  static defaultProps = {
    beacon: undefined,
    background: undefined,
    container: undefined,
  }

  render() {
    const {
      classes,
      headline,
      text,
      beacon,
      background,
      container,
    } = this.props

    const Container = beacon ? Tooltip : Div

    return (
      <Container
        className={classes.root}
        background={background}
        beacon={beacon}
        container={container}
      >
        <div>
          <div className={classes.row}>
            <div>
              <h2 className={classes.hl}>{headline}</h2>
              <div className={classes.text}>{text}</div>
            </div>
            <div className={classes.image} />
          </div>
          <Footer {...this.props} />
        </div>
      </Container>
    )
  }
}
