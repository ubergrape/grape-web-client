import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { showNewConversation } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('showNewConversation', () => {
  it('showNewConversation should dispatch SHOW_NEW_CONVERSATION action', done => {
    expect(showNewConversation()).toDispatchActionsWithState(
      {},
      [{ type: types.SHOW_NEW_CONVERSATION }],
      err => {
        onError(done, err)
      },
    )
  })
})
