import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { onMemberSelect } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onMemberSelect', () => {
  it('should dispatch HANDLE_MEMBER_SELECT action', done => {
    expect(onMemberSelect()).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_MEMBER_SELECT }],
      err => {
        onError(done, err)
      },
    )
  })
})
