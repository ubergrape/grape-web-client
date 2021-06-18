import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { itemsToLoad } from '../../../constants/navigation'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'
import { getRoom } from '../../../../jest/mocks/dataMocks'

import { onSearchGroups } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onSearchGroups', () => {
  it('should not dispatch any actions', done => {
    expect(onSearchGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: generateArrayOfObjects(getRoom, itemsToLoad),
          isGroupsWithMembershipLoading: true,
          groupsPage: 1,
        },
      },
      [],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_GROUPS_SEARCH action', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_RESULTS_LENGTH__ = itemsToLoad - 1
    expect(onSearchGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: [],
          isGroupsWithMembershipLoading: false,
          groupsPage: 1,
        },
      },
      [{ type: types.HANDLE_GROUPS_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_GROUPS_SEARCH and REQUEST_MEMBERSHIP_GROUPS_LOADING actions', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_RESULTS_LENGTH__ = itemsToLoad - 1
    expect(onSearchGroups()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        newConversation: {
          groupsQuery: '',
          groups: [],
          isGroupsWithMembershipLoading: false,
          groupsPage: 1,
        },
      },
      [
        { type: types.HANDLE_GROUPS_SEARCH },
        { type: types.REQUEST_MEMBERSHIP_GROUPS_LOADING },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  afterEach(() => {
    /* eslint-disable no-underscore-dangle */
    global.__TEST_RESULTS_LENGTH__ = null
    /* eslint-enable no-underscore-dangle */
  })
})
