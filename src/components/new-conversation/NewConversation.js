import React, {Component, PropTypes} from 'react'
import sample from 'lodash/collection/sample'
import {colors, icons} from 'grape-theme/dist/room-settings'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'
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
            Advanced Options
          </button>
        }
      </div>
      <button
        onClick={onClickCreate}
        className={classes.createButton}
        disabled={!listed.length && !name}>
        Create
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

const initialState = {
  name: '',
  isPublic: true,
  color: sample(colors),
  icon: sample(icons),
  roomNameFocused: false
}

@useSheet(style)
export default class NewConversation extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    organization: PropTypes.number,
    createRoomWithUsers: PropTypes.func.isRequired,
    showNewConversationAdvanced: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    addToNewConversation: PropTypes.func.isRequired,
    removeFromNewConversation: PropTypes.func.isRequired,
    hideNewConversation: PropTypes.func.isRequired,
    filterNewConversation: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired
  }

  constructor() {
    super()
    this.state = initialState
  }

  componentWillReceiveProps({show}) {
    if (!show) this.setState({...initialState})
  }

  onSetRoomIcon = icon => {
    this.setState({icon})
  }

  onSetRoomColor = color => {
    this.setState({color})
  }

  onClickRoomName = ({target}) => {
    this.setState({roomNameFocused: true}, () => target.focus())
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
      listed, goToChannel,
      createRoomWithUsers, organization
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

    createRoomWithUsers(room, listed)
  }

  render() {
    const {
      sheet, hideNewConversation, filterNewConversation,
      addToNewConversation, removeFromNewConversation,
      showNewConversationAdvanced, organization
    } = this.props

    if (!organization) return null

    const {classes} = sheet
    return (
      <ChooseUsersDialog
        {...this.props}
        title="New Conversation"
        onHide={hideNewConversation}
        theme={{classes}}
        filterFocus={!this.state.roomNameFocused}
        beforeList={(
          <Settings
            {...this.props}
            {...this.state}
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
