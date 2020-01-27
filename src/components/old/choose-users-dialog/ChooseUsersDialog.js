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
import { noop } from 'lodash'

import { styles } from './theme'

import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import Username from '../avatar-name/Username'
import InviteGuests from '../invite-guests/InviteGuests'
import { userStatusMap } from '../../../constants/app'

const SelectedUser = ({ displayName }) => displayName

function OrgInviteButton({ isInviter, onClick, classes }) {
  if (!isInviter) return null

  return (
    <div className={classes.linkWrapper}>
      <button className={classes.link} onClick={onClick}>
        <FormattedMessage
          id="inviteToOrganization"
          defaultMessage="Invite a new person to your organization"
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

class ChooseUsersDialog extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object,
    conf: PropTypes.object,
    children: PropTypes.node.isRequired,
    onHide: PropTypes.func.isRequired,
    onChangeFilter: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    onRemoveSelectedUser: PropTypes.func.isRequired,
    showInviteToOrg: PropTypes.func.isRequired,
    listed: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    onClickList: PropTypes.func,
    onClickFocusReset: PropTypes.func,
    goTo: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    filter: PropTypes.string.isRequired,
    isInviter: PropTypes.bool.isRequired,
    isFilterFocused: PropTypes.bool,
    show: PropTypes.bool.isRequired,
    showInviteGuests: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    onClickList: noop,
    onClickFocusReset: noop,
    goTo: noop,
    channel: {},
    conf: {},
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
      channel,
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
      onClickFocusReset,
      goTo,
      conf,
      showInviteGuests,
    } = this.props

    return (
      <Dialog show={show} onHide={onHide} title={title}>
        <div className={classes.wrapper}>
          <FilterableList
            listClassName={classes.list}
            isFilterFocused={isFilterFocused}
            filter={filter}
            items={this.props.users}
            selected={listed}
            placeholder={formatMessage(messages.placeholder)}
            onClick={onClickList}
            onBlur={onClickFocusReset}
            onChange={onChangeFilter}
            onSelect={onSelectUser}
            onRemoveSelected={onRemoveSelectedUser}
            renderItem={this.renderItem}
            renderSelected={SelectedUser}
            renderNotFound={this.renderNotFound}
            renderEmptyItems={this.renderEmptyItems}
          />
          {children}
        </div>
        <div>
          <OrgInviteButton
            isInviter={isInviter}
            onClick={this.onInvite}
            classes={classes}
          />
          {showInviteGuests && (
            <InviteGuests channel={channel} onClick={goTo} conf={conf} />
          )}
        </div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(ChooseUsersDialog))
