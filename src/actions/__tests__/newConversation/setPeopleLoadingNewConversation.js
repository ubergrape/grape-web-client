import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { setPeopleLoadingNewConversation } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('setPeopleLoadingNewConversation', () => {
  it('should dispatch SET_PEOPLE_SEARCH_LOADING_STATE action', done => {
    expect(setPeopleLoadingNewConversation()).toDispatchActionsWithState(
      {},
      [{ type: types.SET_PEOPLE_SEARCH_LOADING_STATE }],
      err => {
        onError(done, err)
      },
    )
  })
})
