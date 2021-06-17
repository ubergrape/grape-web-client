import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { itemsToLoad } from '../../../constants/navigation'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'

import { getRoom } from '../../../../jest/mocks/dataMocks'
import { loadMembershipGroups } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('loadMembershipGroups', () => {
  it('should dispatch HANDLE_NO_OTHER_GROUPS_IN_ORG action', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_EMPTY_RESULTS__ = true
    expect(loadMembershipGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: [],
          isMemberOfEachGroup: false,
          groupsPage: 1,
        },
      },
      [{ type: types.HANDLE_NO_OTHER_GROUPS_IN_ORG }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_NO_GROUPS_LEFT_TO_JOIN action', done => {
    expect(loadMembershipGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: [],
          isMemberOfEachGroup: false,
          groupsPage: 1,
        },
      },
      [{ type: types.HANDLE_NO_GROUPS_LEFT_TO_JOIN }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_GROUPS_SEARCH action', done => {
    expect(loadMembershipGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: [],
          isMemberOfEachGroup: false,
          groupsPage: 1,
        },
      },
      [{ type: types.HANDLE_GROUPS_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_GROUPS_SEARCH action', done => {
    expect(loadMembershipGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: 'query',
          groups: generateArrayOfObjects(getRoom, itemsToLoad),
          isMemberOfEachGroup: false,
          groupsPage: 2,
        },
      },
      [{ type: types.HANDLE_GROUPS_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_GROUPS_SEARCH action', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_ERROR__ = true
    expect(loadMembershipGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: [],
          isMemberOfEachGroup: false,
          groupsPage: 1,
        },
      },
      [{ type: types.HANDLE_ERROR }, { type: types.SHOW_TOAST_NOTIFICATION }],
      err => {
        onError(done, err)
      },
    )
  })

  afterEach(() => {
    /* eslint-disable no-underscore-dangle */
    global.__TEST_EMPTY_RESULTS__ = false
    global.__TEST_ERROR__ = false
    /* eslint-enable no-underscore-dangle */
  })
})
