import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'
import noop from 'lodash/noop'

import { styles } from './theme'
import { getFilteredUsers } from './utils'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import Username from '../avatar-name/Username'
import { userStatusMap } from '../../constants/app'

const SelectedUser = ({ displayName }) => displayName

function OrgInviteButton({ isInviter, onClick, classes }) {
  if (!isInviter) return null

  return (
    <div className={classes.orgInvite}>
      <button className={classes.orgInviteButton} onClick={onClick}>
        <FormattedMessage
          id="inviteToTeam"
          defaultMessage="Invite a new person to your team…"
        />
      </button>
    </div>
  )
}

OrgInviteButton.propTypes = {
  classes: PropTypes.object.isRequired,
  isInviter: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

const messages = defineMessages({
  placeholder: {
    id: 'typeName',
    defaultMessage: 'Add members…',
  },
})

@injectSheet(styles)
@injectIntl
export default class ChooseUsersDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onHide: PropTypes.func.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    onRemoveSelectedUser: PropTypes.func.isRequired,
    showInviteToOrg: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired,
    onClickList: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    filter: PropTypes.string.isRequired,
    isInviter: PropTypes.bool.isRequired,
    isFilterFocused: PropTypes.bool,
    show: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    onClickList: noop,
    title: null,
    isFilterFocused: true,
  }

  onInvite = () => {
    const { onHide, showInviteToOrg } = this.props
    onHide()
    showInviteToOrg()
  }

  renderItem = ({ item, focused }) => {
    const { classes } = this.props
    const { displayName, avatar, status, id } = item

    let className = classes.user
    if (focused) className += ` ${classes.focusedUser}`

    return (
      <div className={className} key={id}>
        <Username
          name={displayName}
          avatar={avatar}
          statusBorderColor={focused ? colors.grayBlueLighter : colors.white}
          status={userStatusMap[status]}
        />
      </div>
    )
  }

  renderEmptyItems = () => {
    const { classes } = this.props

    return (
      <div className={classes.note}>
        <FormattedMessage
          id="everyoneInvited"
          defaultMessage="Everyone has been invited to this group"
        />
      </div>
    )
  }

  renderNotFound = () => {
    const { classes, filter } = this.props

    return (
      <div className={classes.note}>
        <FormattedMessage
          id="usersNotFoundFor"
          defaultMessage="No one found for"
        />{' '}
        <strong>{filter}</strong>
      </div>
    )
  }

  render() {
    const {
      classes,
      intl: { formatMessage },
      show,
      filter,
      listed,
      title,
      children,
      isInviter,
      isFilterFocused,
      onHide,
      onChangeFilter,
      onSelectUser,
      onRemoveSelectedUser,
      onClickList,
    } = this.props

    return (
      <Dialog show={show} onHide={onHide} title={title}>
        <div className={classes.wrapper}>
          <FilterableList
            listClassName={classes.list}
            isFilterFocused={isFilterFocused}
            filter={filter}
            items={getFilteredUsers(this.props)}
            selected={listed}
            placeholder={formatMessage(messages.placeholder)}
            onClick={onClickList}
            onChange={onChangeFilter}
            onSelect={onSelectUser}
            onRemoveSelected={onRemoveSelectedUser}
            renderItem={this.renderItem}
            renderSelected={SelectedUser}
            renderNotFound={this.renderNotFound}
            renderEmptyItems={this.renderEmptyItems}
          >
            <OrgInviteButton
              isInviter={isInviter}
              onClick={this.onInvite}
              classes={classes}
            />
          </FilterableList>
          {children}
        </div>
      </Dialog>
    )
  }
}
