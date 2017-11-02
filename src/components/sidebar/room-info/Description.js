import React from 'react'
import {defineMessages} from 'react-intl'
import Icon from 'grape-web/lib/svg-icons/Icon'
import injectSheet from 'grape-web/lib/jss'
import {small} from 'grape-theme/dist/fonts'
import sizes from 'grape-theme/dist/sizes'

import {maxChannelDescriptionLength} from '../../../constants/app'
import {Description as DescriptionText} from '../../i18n'
import EditableText from '../../editable-text/EditableText'

const messages = defineMessages({
  placeholder: {
    id: 'addGroupDescription',
    defaultMessage: 'Add a group description here…'
  }
})

const Editable = ({allowEdit, description, intl: {formatMessage}, onSetRoomDescription}) => {
  if (!allowEdit) return <p>{description}</p>

  return (
    <EditableText
      placeholder={formatMessage(messages.placeholder)}
      maxLength={maxChannelDescriptionLength}
      onSave={onSetRoomDescription}
      value={description}
      preserveSpaceForButton
      multiline
    />
  )
}

const PrivateHint = injectSheet(({palette}) => ({
  root: {
    extend: small,
    color: palette.text.secondary
  },
  icon: {
    color: 'inherit',
    marginRight: sizes.spacer.xs
  }
}))(({classes}) => (
  <div className={classes.root}>
    <Icon name="lock" className={classes.icon} />
    This conversation is private.
  </div>
))

const styles = ({palette}) => ({
  root: {
    display: 'block'
  },
  title: {
    extend: small,
    textTransform: 'uppercase',
    background: '0 0 no-repeat',
    color: palette.text.secondary
  }
})

const Description = ({classes, allowEdit, description, ...rest}) => {
  if (!allowEdit && !description) return null

  return (
    <article className={classes.root}>
      <h2 className={classes.title}>
        <DescriptionText />
      </h2>
      <Editable
        allowEdit={allowEdit}
        description={description}
        {...rest}
      />
      <PrivateHint />
    </article>
  )
}

export default injectSheet(styles)(Description)
