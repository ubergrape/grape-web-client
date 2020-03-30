import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import sample from 'lodash/sample'
import { colors as roomColors, icons } from 'grape-theme/dist/room-settings'
import injectSheet from 'grape-web/lib/jss'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import { Create } from '../i18n/i18n'
import { styles } from './newConversationTheme'
import ChooseUsersDialog from '../choose-users-dialog/ChooseUsersDialog'
import AdvancedSettings from './AdvancedSettings'

const getInitialState = ({ groupDefaults }) => ({
  name: '',
  error: '',
  isPublic: !(groupDefaults && groupDefaults.visibility === 'private'),
  saving: false,
  focusedInput: 'users',
  color: sample(roomColors),
  icon: sample(icons),
})

const messages = defineMessages({
  title: {
    id: 'newConversation',
    defaultMessage: 'New Conversation',
  },
})

class NewConversationDialog extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object,
    intl: intlShape.isRequired,
    organization: PropTypes.number,
    error: PropTypes.object.isRequired,
    colors: PropTypes.object,
    showNewConversation: PropTypes.func.isRequired,
    createRoomWithUsers: PropTypes.func.isRequired,
    addToNewConversation: PropTypes.func.isRequired,
    removeFromNewConversation: PropTypes.func.isRequired,
    hideNewConversation: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired,
    clearRoomCreateError: PropTypes.func.isRequired,
    openPm: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired,
    show: PropTypes.bool,
    isMemberOfAnyRooms: PropTypes.bool.isRequired,
    defaults: PropTypes.object,
  }

  static defaultProps = {
    organization: null,
    channel: {},
    colors: {},
    defaults: {},
    show: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      ...getInitialState(props.defaults),
      error: props.error.message,
    }
  }

  componentWillReceiveProps({ show, error, isMemberOfAnyRooms, defaults }) {
    if (!show) {
      this.setState(getInitialState(defaults))
      if (
        this.props.isMemberOfAnyRooms !== isMemberOfAnyRooms &&
        !isMemberOfAnyRooms
      ) {
        this.props.showNewConversation()
      }
      return
    }

    const { message } = error
    if (message !== this.state.error) {
      this.setState({
        error: message,
        saving: false,
      })
      return
    }

    this.setState({ saving: false })
  }

  componentDidUpdate(prevProps) {
    const { show, searchUsers } = this.props
    // Initial population first time dialog was showed.
    if (show && !prevProps.show) searchUsers('')
  }

  onSetRoomIcon = icon => {
    this.setState({ icon })
  }

  onSetRoomColor = color => {
    this.setState({ color })
  }

  onChangeRoomName = ({ name }) => {
    this.setState({ name })
  }

  onPrivacyChange = () => {
    this.setState({ isPublic: !this.state.isPublic })
  }

  onCreate = () => {
    const { listed, openPm, createRoomWithUsers, organization } = this.props
    const { name, color, icon, isPublic } = this.state

    if (listed.length === 1 && !name) {
      this.setState({ saving: true })
      openPm(listed[0].id)
      return
    }

    this.setState({ saving: true })
    createRoomWithUsers(
      {
        name,
        icon,
        color,
        organization,
        isPublic,
      },
      listed,
    ).then(() => {
      this.setState({ saving: false })
    })
  }

  onHide = () => {
    this.props.clearRoomCreateError()
    this.props.hideNewConversation()
  }

  onClickRoomName = () => {
    this.setState({ focusedInput: 'name' })
  }

  onClickList = () => {
    this.setState({ focusedInput: 'users' })
  }

  onClickFocusReset = () => {
    this.setState({ focusedInput: '' })
  }

  renderSettings = () => {
    const { classes, clearRoomCreateError, colors } = this.props
    const {
      focusedInput,
      error,
      isPublic,
      saving,
      name,
      color,
      icon,
    } = this.state

    return (
      <div className={classes.advancedSettings}>
        <AdvancedSettings
          icon={icon}
          color={color}
          colors={colors}
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
          onSetRoomIcon={this.onSetRoomIcon}
        />
      </div>
    )
  }

  renderFooter() {
    const { classes, listed } = this.props
    const { name, saving } = this.state

    return (
      <div className={classes.footer}>
        <button
          onClick={this.onCreate}
          className={classes.createButton}
          disabled={(!listed.length && !name) || saving}
        >
          <Create />
        </button>
      </div>
    )
  }

  render() {
    const {
      classes,
      searchUsers,
      addToNewConversation,
      removeFromNewConversation,
      organization,
      channel,
      intl: { formatMessage },
      ...chooseUsersProps
    } = this.props
    const { focusedInput } = this.state

    if (!organization) return null

    return (
      <ChooseUsersDialog
        {...chooseUsersProps}
        title={formatMessage(messages.title)}
        theme={{ classes }}
        onHide={this.onHide}
        onClickList={this.onClickList}
        onClickFocusReset={this.onClickFocusReset}
        isFilterFocused={focusedInput === 'users'}
        onChangeFilter={searchUsers}
        onSelectUser={user => addToNewConversation(user)}
        onRemoveSelectedUser={user => removeFromNewConversation(user)}
        channel={channel}
        showInviteGuests={false}
        showEmailToInvite
      >
        {this.renderSettings()}
        {this.renderFooter()}
      </ChooseUsersDialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(NewConversationDialog))
