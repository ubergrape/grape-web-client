import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import merge from 'lodash/merge'

import { A11yDialog, A11yDialogStyles } from '../a11y-dialog'
import { Tabs } from '../tabs'
import Person from './Tabs/Person'
import Group from './Tabs/Group'
import styles from './styles/NewConversationStyles'

const NewConversation = ({
  show,
  users,
  groups,
  filterUsers,
  filterGroups,
  isLoaded,
  hideNewConversation,
  changeTabNewConversation,
  changeInputUsersNewConversation,
  changeInputGroupsNewConversation,
  searchUsersNewConversation,
  searchGroupsNewConversation,
  classes,
}) => (
  <A11yDialog
    id="new-conversation"
    title="New conversation"
    show={show}
    onHide={hideNewConversation}
    classNames={classes}
    closeButtonLabel="Close new conversation dialog window"
  >
    {show ? (
      <div className={classes.content}>
        <p className={classes.description}>
          Start a conversation with one person. Join or create a group to chat
          with more people.
        </p>
        <div className={classes.tabs}>
          <Tabs
            tabs={[
              {
                name: 'Person',
                component: Person,
                data: {
                  users,
                  isLoaded,
                  filterUsers,
                },
                actions: {
                  searchUsersNewConversation,
                  changeInputUsersNewConversation,
                },
                onLoad: () => {
                  searchUsersNewConversation()
                },
                onChange: () => {
                  changeTabNewConversation()
                  searchUsersNewConversation()
                },
              },
              {
                name: 'Group',
                component: Group,
                data: {
                  groups,
                  isLoaded,
                  filterGroups,
                },
                actions: {
                  searchGroupsNewConversation,
                  changeInputGroupsNewConversation,
                },
                onLoad: () => {
                  searchGroupsNewConversation()
                },
                onChange: () => {
                  changeTabNewConversation()
                  searchGroupsNewConversation()
                },
              },
            ]}
          />
        </div>
      </div>
    ) : null}
  </A11yDialog>
)

NewConversation.propTypes = {
  show: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  filterUsers: PropTypes.string.isRequired,
  filterGroups: PropTypes.string.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  hideNewConversation: PropTypes.func.isRequired,
  changeTabNewConversation: PropTypes.func.isRequired,
  changeInputUsersNewConversation: PropTypes.func.isRequired,
  changeInputGroupsNewConversation: PropTypes.func.isRequired,
  searchUsersNewConversation: PropTypes.func.isRequired,
  searchGroupsNewConversation: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default injectSheet(merge(A11yDialogStyles, styles))(NewConversation)
