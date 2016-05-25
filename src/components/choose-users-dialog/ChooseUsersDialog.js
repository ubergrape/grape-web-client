import React, {PropTypes} from 'react'

import {getFilteredUsers} from './utils'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import Username from '../avatar-name/Username'
import {userStatusMap} from '../../constants/app'

import colors from 'grape-theme/dist/base-colors'

function renderUser(props, {item, focused}) {
  const {displayName, avatar, status} = item
  const {classes} = props.theme
  let className = classes.user
  if (focused) className += ` ${classes.focusedUser}`
  return (
    <div
      className={className}>
      <Username
        name={displayName}
        avatar={avatar}
        statusBorderColor={focused ? colors.grayBlueLighter : colors.white}
        status={userStatusMap[status]}
      />
    </div>
  )
}

renderUser.propTypes = {
  theme: PropTypes.object.isRequired
}

function selectedUser({displayName}) {
  return displayName
}

function renderNotFound({theme, filter}) {
  return (
    <div
      className={theme.classes.note}>
      {'No one found for '}
      <strong>{filter}</strong>
    </div>
  )
}

renderNotFound.propTypes = {
  theme: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired
}


function renderNoUsers({theme}) {
  return (
    <div
      className={theme.classes.note}>
      Everyone has been invited to this group
    </div>
  )
}

renderNoUsers.propTypes = {
  theme: PropTypes.object.isRequired
}

function OrgInviteButton({isInviter, onHide, showOrgInvite, theme}) {
  if (!isInviter) return null
  const {classes} = theme
  return (
    <div className={classes.orgInvite}>
      <button
        className={classes.orgInviteButton}
        onClick={() => {
          onHide()
          showOrgInvite()
        }}>
        Invite a new person to your team…
      </button>
    </div>
  )
}

OrgInviteButton.propTypes = {
  theme: PropTypes.object.isRequired,
  isInviter: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  showOrgInvite: PropTypes.func.isRequired
}

export default function ChooseUsersDialog(props) {
  const {
    theme, show, filter, listed, title, children,
    onHide, onChangeFilter, onSelectUser, onRemoveSelectedUser
  } = props

  const {classes} = theme

  return (
    <Dialog
      show={show}
      onHide={onHide}
      title={title}>
      <div
        className={classes.wrapper}>
        <FilterableList
          listClassName={classes.list}
          filter={filter}
          items={getFilteredUsers(props)}
          selected={listed}
          placeholder={'Type name...'}
          onChange={onChangeFilter}
          onSelect={onSelectUser}
          onRemoveSelected={onRemoveSelectedUser}
          renderItem={renderUser.bind(null, props)}
          renderSelected={selectedUser}
          renderNotFound={renderNotFound.bind(null, props)}
          renderEmptyItems={renderNoUsers.bind(null, props)}>
          <OrgInviteButton {...props} />
        </FilterableList>
        {children}
      </div>
    </Dialog>
  )
}

ChooseUsersDialog.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.node,
  onHide: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  onRemoveSelectedUser: PropTypes.func.isRequired,
  showOrgInvite: PropTypes.func.isRequired,
  listed: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  isInviter: PropTypes.bool.isRequired,
  show: PropTypes.bool.isRequired
}
