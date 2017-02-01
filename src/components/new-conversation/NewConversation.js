import React, {PureComponent, PropTypes} from 'react'
import sample from 'lodash/collection/sample'
import {colors, icons} from 'grape-theme/dist/room-settings'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {Create} from '../i18n/i18n'
import {styles} from './newConversationTheme'
import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import AdvancedSettings from './AdvancedSettings'

const getInitialState = () => ({
  name: '',
  error: '',
  isPublic: true,
  saving: false,
  focusedInput: 'users',
  color: sample(colors),
  icon: sample(icons)
})

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
        saving: false
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

  onChangeRoomName = ({name}) => {
    this.setState({name})
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

  onClickRoomName = () => {
    this.setState({focusedInput: 'name'})
  }

  onClickList = () => {
    this.setState({focusedInput: 'users'})
  }

  renderSettings = () => {
    const {sheet: {classes}, clearRoomCreateError} = this.props
    const {focusedInput, error, isPublic, saving, name, color, icon} = this.state

    return (
      <div className={classes.advancedSettings}>
        <AdvancedSettings
          icon={icon}
          color={color}
          name={name}
          saving={saving}
          isPublic={isPublic}
          clearRoomCreateError={clearRoomCreateError}
          error={error}
          isNameFocused={focusedInput === 'name'}
          onClickRoomName={this.onClickRoomName}
          onCreate={this.onCreate}
          onChangeRoomName={this.onChangeRoomName}
          onPrivacyChange={this.onPrivacyChange}
          onSetRoomColor={this.onSetRoomColor}
          onSetRoomIcon={this.onSetRoomIcon} />
      </div>
    )
  }

  renderFooter() {
    const {
      sheet: {classes},
      listed
    } = this.props
    const {name} = this.state

    return (
      <div className={classes.footer}>
        <button
          onClick={this.onCreate}
          className={classes.createButton}
          disabled={!listed.length && !name}>
          <Create />
        </button>
      </div>
    )
  }

  render() {
    const {
      sheet: {classes}, filterNewConversation,
      addToNewConversation, removeFromNewConversation,
      organization, intl: {formatMessage}
    } = this.props
    const {focusedInput} = this.state

    if (!organization) return null
    const {sheet, ...props} = this.props
    return (
      <ChooseUsersDialog
        {...props}
        title={formatMessage(messages.title)}
        theme={{classes}}
        onHide={this.onHide}
        onClickList={this.onClickList}
        isFilterFocused={focusedInput !== 'name'}
        onChangeFilter={value => filterNewConversation(value)}
        onSelectUser={user => addToNewConversation(user)}
        onRemoveSelectedUser={user => removeFromNewConversation(user)}>
        {this.renderSettings()}
        {this.renderFooter()}
      </ChooseUsersDialog>
    )
  }
}
