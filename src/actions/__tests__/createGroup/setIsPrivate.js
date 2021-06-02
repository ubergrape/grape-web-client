import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { setIsPrivate } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('setIsPrivate', () => {
  it('setIsPrivate should dispatch SET_IS_PRIVATE action', done => {
    expect(setIsPrivate()).toDispatchActionsWithState(
      {},
      [{ type: types.SET_IS_PRIVATE }],
      err => {
        onError(done, err)
      },
    )
  })
})
