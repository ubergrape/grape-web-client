import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { setNewConversationTab } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('setNewConversationTab', () => {
  it('setNewConversationTab should dispatch SET_NEW_CONVERSATION_TAB action', done => {
    expect(setNewConversationTab()).toDispatchActionsWithState(
      {},
      [{ type: types.SET_NEW_CONVERSATION_TAB }],
      err => {
        onError(done, err)
      },
    )
  })
})
