import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { requestMembersNewConversation } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('requestMembersNewConversation', () => {
  it('requestMembersNewConversation should dispatch REQUEST_MEMBERS_SEARCH action', done => {
    expect(requestMembersNewConversation()).toDispatchActionsWithState(
      {},
      [{ type: types.REQUEST_MEMBERS_SEARCH }],
      err => {
        onError(done, err)
      },
    )
  })
})
