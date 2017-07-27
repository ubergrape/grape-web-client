import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import fonts from 'grape-theme/dist/fonts'
import injectSheet from 'grape-web/lib/jss'
import {spacer} from 'grape-theme/dist/sizes'
import {FormattedMessage} from 'react-intl'
import Button from 'material-ui/Button'
import {rgba} from 'css-functions'

import {Done} from '../i18n'
import Tooltip from './Tooltip'
import {containerStyle} from './constants'

const styles = {
  view: containerStyle,
  hl: {
    extend: fonts.biggest,
    lineHeight: 1,
    color: 'inherit',
    fontWeight: 'bold',
    margin: 0,
    paddingBottom: spacer.m
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    color: 'inherit',
    marginBottom: spacer.xxl
  },
  text: {
    extend: fonts.normal,
    color: 'inherit'
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
      image: ({image}) => `url(${image})`
    }
  },
  footer: {
    extend: fonts.small,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'inherit'
  },
  button: {
    backgroundColor: rgba(0, 0, 0, 0.5),
    border: 'none',
    color: 'inherit',
    cursor: 'pointer'
  },
  skip: {
    extend: fonts.small,
    color: 'inherit',
    cursor: 'pointer'
  }
}

const Footer = (props) => {
  const {classes, onNext, onSkip, onDone, isLast} = props

  if (isLast) {
    return (
      <Button raised primary className={classes.button} onClick={onDone}>
        <Done />
      </Button>
    )
  }

  const skip = (
    <FormattedMessage
      id="skipIntro"
      defaultMessage="Skip tutorial"
      description="Intro footer skip button"
    >
      {(...children) => (
        <Button className={classes.skip} onClick={onSkip}>
          {children}
        </Button>
      )}
    </FormattedMessage>
  )

  return (
    <div className={classes.footer}>
      <FormattedMessage
        id="buttonContinue"
        defaultMessage="Continue"
        description="Intro button continue."
      >
        {(...children) => (
          <Button raised primary className={classes.button} onClick={onNext}>
            {children}
          </Button>
        )}
      </FormattedMessage>
      <FormattedMessage
        id="skipIfDone"
        defaultMessage="Already done?{skip}"
        description="Intro footer"
        values={{skip}}
      />
    </div>
  )
}

const Div = ({className, children}) => <div className={className}>{children}</div>

@injectSheet(styles)
export default class View extends PureComponent {
  static defaultProps = {
    onSkip: noop
  }

  render() {
    const {classes, headline, text, beacon, background, container, onSkip} = this.props

    const Container = beacon ? Tooltip : Div

    return (
      <Container
        className={classes.view}
        background={background}
        beacon={beacon}
        onOutsideClick={onSkip}
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
