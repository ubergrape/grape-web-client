import React, {PureComponent, PropTypes} from 'react'
import sample from 'lodash/collection/sample'
import {colors, icons} from 'grape-theme/dist/room-settings'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {Create} from '../i18n/i18n'
import {styles} from './theme'
import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import Settings from './Settings'

function FooterButtons(props) {
  const {
    listed, name, advanced,
    onClickSettings, onClickCreate, theme
  } = props
  const {classes} = theme
  return (
    <div className={classes.footer}>
      <div>
        {!advanced &&
          <button
            className={classes.roomSettingsButton}
            onClick={onClickSettings}>
            <FormattedMessage
              id="advancedOptions"
              defaultMessage="Advanced Options" />
          </button>
        }
      </div>
      <button
        onClick={onClickCreate}
        className={classes.createButton}
        disabled={!listed.length && !name}>
        <Create />
      </button>
    </div>
  )
}

FooterButtons.propTypes = {
  listed: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  advanced: PropTypes.bool.isRequired,
  onClickSettings: PropTypes.func.isRequired,
  onClickCreate: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

function getInitialState() {
  return {
    name: '',
    error: '',
    isPublic: true,
    saving: false,
    color: sample(colors),
    icon: sample(icons),
    roomNameFocused: false
  }
}

const messages = defineMessages({
  title: {
    id: 'newConversation',
    defaultMessage: 'New Conversation'
  }
})

@injectSheet(styles)
@injectIntl
export default class NewConversation extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    organization: PropTypes.number,
    error: PropTypes.object.isRequired,
    createRoomWithUsers: PropTypes.func.isRequired,
    showNewConversationAdvanced: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    addToNewConversation: PropTypes.func.isRequired,
    removeFromNewConversation: PropTypes.func.isRequired,
    hideNewConversation: PropTypes.func.isRequired,
    filterNewConversation: PropTypes.func.isRequired,
    clearRoomCreateError: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      ...getInitialState(),
      error: props.error.message
    }
  }

  componentWillReceiveProps({show, error}) {
    if (!show) {
      this.setState(getInitialState())
      return
    }

    const {message} = error
    if (message !== this.state.error) {
      this.setState({
        error: message,
        saving: false,
        roomNameFocused: message ? true : this.state.roomNameFocused
      })
      return
    }

    this.setState({saving: false})
  }

  onSetRoomIcon = icon => {
    this.setState({icon})
  }

  onSetRoomColor = color => {
    this.setState({color})
  }

  onClickRoomName = () => {
    this.setState({roomNameFocused: true})
  }

  onBlurRoomName = () => {
    this.setState({roomNameFocused: false})
  }

  onChangeRoomName = ({target}) => {
    this.setState({name: target.value})
  }

  onPrivacyChange = () => {
    this.setState({isPublic: !this.state.isPublic})
  }

  onCreate = () => {
    const {
      listed, goToChannel, createRoomWithUsers, organization
    } = this.props
    const {name, color, icon, isPublic} = this.state

    if (listed.length === 1 && !name) {
      goToChannel(listed[0].slug)
      return
    }

    const room = {
      name,
      icon,
      color,
      organization,
      isPublic
    }

    this.setState({saving: true}, () => {
      createRoomWithUsers(room, listed)
    })
  }

  onHide = () => {
    this.props.clearRoomCreateError()
    this.props.hideNewConversation()
  }

  render() {
    const {
      sheet, filterNewConversation,
      addToNewConversation, removeFromNewConversation,
      showNewConversationAdvanced, organization, intl: {formatMessage}
    } = this.props

    if (!organization) return null

    const {classes} = sheet
    return (
      <ChooseUsersDialog
        {...this.props}
        title={formatMessage(messages.title)}
        theme={{classes}}
        onHide={this.onHide}
        isFilterFocused={!this.state.roomNameFocused}
        beforeList={(
          <Settings
            {...this.props}
            {...this.state}
            onCreate={this.onCreate}
            onChangeRoomName={this.onChangeRoomName}
            onPrivacyChange={this.onPrivacyChange}
            onClickRoomName={this.onClickRoomName}
            onBlurRoomName={this.onBlurRoomName}
            onSetRoomColor={this.onSetRoomColor}
            onSetRoomIcon={this.onSetRoomIcon}
            theme={{classes}} />
        )}
        onChangeFilter={value => filterNewConversation(value)}
        onSelectUser={user => addToNewConversation(user)}
        onRemoveSelectedUser={user => removeFromNewConversation(user)}>
        <FooterButtons
          {...this.props}
          {...this.state}
          onClickCreate={this.onCreate}
          onClickSettings={showNewConversationAdvanced}
          theme={{classes}} />
      </ChooseUsersDialog>
    )
  }
}
