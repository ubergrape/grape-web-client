import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { handleGroupsResults } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('handleGroupsResults', () => {
  it('handleGroupsResults should dispatch HANDLE_GROUPS_SEARCH action', done => {
    expect(handleGroupsResults([], false)).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_GROUPS_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('handleGroupsResults should dispatch HANDLE_GROUPS_SEARCH and SET_GROUPS_SEARCH_LOADING_STATE actions', done => {
    expect(handleGroupsResults([], true)).toDispatchActionsWithState(
      {},
      [
        { type: types.HANDLE_GROUPS_SEARCH },
        { type: types.SET_GROUPS_SEARCH_LOADING_STATE },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
