import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { setGroupsLoadingNewConversation } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('setGroupsLoadingNewConversation', () => {
  it('setGroupsLoadingNewConversation should dispatch SET_GROUPS_SEARCH_LOADING_STATE action', done => {
    expect(setGroupsLoadingNewConversation()).toDispatchActionsWithState(
      {},
      [{ type: types.SET_GROUPS_SEARCH_LOADING_STATE }],
      err => {
        onError(done, err)
      },
    )
  })
})
