import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { onMemberRemove } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onMemberRemove', () => {
  it('onMemberRemove should dispatch HANDLE_MEMBER_REMOVE action', done => {
    expect(onMemberRemove()).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_MEMBER_REMOVE }],
      err => {
        onError(done, err)
      },
    )
  })
})
