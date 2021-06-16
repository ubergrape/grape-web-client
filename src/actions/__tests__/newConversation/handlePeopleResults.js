import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { handlePeopleResults } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('handlePeopleResults', () => {
  it('should dispatch HANDLE_PEOPLE_SEARCH action', done => {
    expect(handlePeopleResults([], false)).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_PEOPLE_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })

  it('should dispatch HANDLE_PEOPLE_SEARCH and SET_PEOPLE_SEARCH_LOADING_STATE actions', done => {
    expect(handlePeopleResults([], true)).toDispatchActionsWithState(
      {},
      [
        { type: types.HANDLE_PEOPLE_SEARCH },
        { type: types.SET_PEOPLE_SEARCH_LOADING_STATE },
      ],
      err => {
        onError(done, err)
      },
    )
  })
})
