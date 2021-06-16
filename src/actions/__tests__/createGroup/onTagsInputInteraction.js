import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { onTagsInputInteraction } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onTagsInputInteraction', () => {
  it('should dispatch HANDLE_TAGS_INPUT_INTERACTION action', done => {
    expect(onTagsInputInteraction()).toDispatchActionsWithState(
      {},
      [{ type: types.HANDLE_TAGS_INPUT_INTERACTION }],
      err => {
        onError(done, err)
      },
    )
  })
})
