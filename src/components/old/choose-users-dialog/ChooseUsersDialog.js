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

import OrgInviteButton from './OrgInviteButton'
import Dialog from '../dialog/Dialog'
import FilterableList from '../filterable-list/FilterableList'
import Username from '../avatar-name/Username'
import InviteGuests from '../invite-guests/InviteGuests'
import { userStatusMap } from '../../../constants/app'

const SelectedUser = ({ displayName }) => displayName

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
    loaded: PropTypes.bool.isRequired,
    onClickList: PropTypes.func,
    onClickFocusReset: PropTypes.func,
    goTo: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    filter: PropTypes.string.isRequired,
    isInviter: PropTypes.bool.isRequired,
    isFilterFocused: PropTypes.bool,
    show: PropTypes.bool.isRequired,
    showEmailToInvite: PropTypes.bool.isRequired,
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

  renderLoading = () => {
    const { classes } = this.props

    return (
      <div className={classes.note}>
        <FormattedMessage id="loading" defaultMessage="Loading..." />
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

  renderNoOtherMembers = () => {
    const { classes } = this.props

    return (
      <div className={classes.noteSmall}>
        <div className={classes.textBold}>
          <FormattedMessage
            id="feelsLonely"
            defaultMessage="Feeling lonely here?"
          />
        </div>
        <div className={classes.emptyOrg}>
          <FormattedMessage
            id="noOtherMembers"
            defaultMessage="It seems that your Grape organization has no other members than you yet. Using a messenger is more convenient with several people, so why not invite someone. As soon as they join, you can come back and start a conversation."
          />
        </div>
        <div>
          <OrgInviteButton
            font="normal"
            id="inviteUsersNow"
            onClick={this.onInvite}
            className={classes.link}
          />
        </div>
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
      users,
      loaded,
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
      showEmailToInvite,
      showInviteGuests,
    } = this.props

    return (
      <Dialog show={show} onHide={onHide} title={title}>
        <div className={classes.wrapper}>
          <FilterableList
            listClassName={classes.list}
            isFilterFocused={isFilterFocused}
            filter={filter}
            items={users}
            loaded={loaded}
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
            renderNoOtherMembers={this.renderNoOtherMembers}
            renderLoading={this.renderLoading}
            isInviter={isInviter}
            showEmailToInvite={showEmailToInvite}
          />
          {children}
        </div>
        <div className={classes.linksWrapper}>
          {isInviter && (
            <div className={classes.linkWrapper}>
              <OrgInviteButton
                id="inviteToOrganization"
                onClick={this.onInvite}
                className={classes.linkSmall}
              />
            </div>
          )}
          {showInviteGuests && (
            <InviteGuests channel={channel} onClick={goTo} conf={conf} />
          )}
        </div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(ChooseUsersDialog))
