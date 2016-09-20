import React, {PropTypes} from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import {useSheet} from 'grape-web/lib/jss'

import style from './style'
import {getFilteredUsers} from './utils'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import Username from '../avatar-name/Username'
import {userStatusMap} from '../../constants/app'

import colors from 'grape-theme/dist/base-colors'

function User(props, {item, focused}) {
  const {displayName, avatar, status} = item
  const {classes} = props.sheet
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

User.propTypes = {
  sheet: PropTypes.object.isRequired
}

function SelectedUser({displayName}) {
  return displayName
}

function NotFound({sheet, filter}) {
  return (
    <div
      className={sheet.classes.note}>
        <FormattedMessage
          id="usersNotFoundFor"
          defaultMessage="No one found for" />
        {' '}
      <strong>{filter}</strong>
    </div>
  )
}

NotFound.propTypes = {
  sheet: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired
}


function NoUsers({sheet}) {
  return (
    <div
      className={sheet.classes.note}>
      <FormattedMessage
        id="everyoneInvited"
        defaultMessage="Everyone has been invited to this group" />
    </div>
  )
}

NoUsers.propTypes = {
  sheet: PropTypes.object.isRequired
}

function OrgInviteButton({isInviter, onHide, showInviteToOrg, theme}) {
  if (!isInviter) return null

  const {classes} = theme
  return (
    <div className={classes.orgInvite}>
      <button
        className={classes.orgInviteButton}
        onClick={() => {
          onHide()
          showInviteToOrg()
        }}>
        <FormattedMessage
          id="inviteToTeam"
          defaultMessage="Invite a new person to your team…" />
      </button>
    </div>
  )
}

OrgInviteButton.propTypes = {
  theme: PropTypes.object.isRequired,
  isInviter: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  showInviteToOrg: PropTypes.func.isRequired
}

const messages = defineMessages({
  placeholder: {
    id: 'typeName',
    defaultMessage: 'Type name...'
  }
})

function ChooseUsersDialog(props) {
  const {
    sheet, show, filter, listed, title,
    children, isInviter, showInviteToOrg,
    beforeList, filterFocus, onHide,
    onChangeFilter, onSelectUser,
    onRemoveSelectedUser
  } = props

  const {formatMessage} = props.intl

  const {classes} = sheet

  return (
    <Dialog
      show={show}
      onHide={onHide}
      title={title}>
      <div
        className={classes.wrapper}>
        {beforeList}
        <FilterableList
          listClassName={classes.list}
          filterFocus={filterFocus}
          filter={filter}
          items={getFilteredUsers(props)}
          selected={listed}
          placeholder={formatMessage(messages.placeholder)}
          onChange={onChangeFilter}
          onSelect={onSelectUser}
          onRemoveSelected={onRemoveSelectedUser}
          renderItem={User.bind(null, props)}
          renderSelected={SelectedUser}
          renderNotFound={NotFound.bind(null, props)}
          renderEmptyItems={NoUsers.bind(null, props)}>
          <OrgInviteButton
            isInviter={isInviter}
            onHide={onHide}
            showInviteToOrg={showInviteToOrg}
            theme={{classes}} />
        </FilterableList>
        {children}
      </div>
    </Dialog>
  )
}

ChooseUsersDialog.propTypes = {
  intl: intlShape.isRequired,
  sheet: PropTypes.object.isRequired,
  beforeList: PropTypes.node,
  children: PropTypes.node,
  onHide: PropTypes.func.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  onRemoveSelectedUser: PropTypes.func.isRequired,
  showInviteToOrg: PropTypes.func.isRequired,
  listed: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  filter: PropTypes.string.isRequired,
  isInviter: PropTypes.bool.isRequired,
  filterFocus: PropTypes.bool,
  show: PropTypes.bool.isRequired
}

export default injectIntl(useSheet(ChooseUsersDialog, style))
