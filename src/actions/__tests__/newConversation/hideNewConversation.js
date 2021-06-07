import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { hideNewConversation } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('hideNewConversation', () => {
  it('hideNewConversation should dispatch HIDE_NEW_CONVERSATION action', done => {
    expect(hideNewConversation()).toDispatchActionsWithState(
      {},
      [{ type: types.HIDE_NEW_CONVERSATION }],
      err => {
        onError(done, err)
      },
    )
  })
})
