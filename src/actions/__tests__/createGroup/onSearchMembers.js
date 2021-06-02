import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError } from '../../../../jest/helpers'

import { onSearchMembers } from '../..'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onSearchMembers', () => {
  it('onSearchMembers should dispatch REQUEST_MEMBERS_SEARCH, HANDLE_MEMBERS_SEARCH, REQUEST_MEMBERS_SEARCH and HANDLE_TAGS_INPUT_INTERACTION actions', done => {
    expect(onSearchMembers()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        createGroup: {
          membersQuery: 'query',
          page: 1,
        },
      },
      [
        { type: types.REQUEST_MEMBERS_SEARCH },
        { type: types.HANDLE_MEMBERS_SEARCH },
        { type: types.REQUEST_MEMBERS_SEARCH },
        { type: types.HANDLE_TAGS_INPUT_INTERACTION },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('onSearchMembers should dispatch REQUEST_MEMBERS_SEARCH, HANDLE_ERROR and SHOW_TOAST_NOTIFICATION actions', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_ERROR__ = true

    expect(onSearchMembers()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        createGroup: {
          membersQuery: 'query',
          page: 1,
        },
      },
      [
        { type: types.REQUEST_MEMBERS_SEARCH },
        { type: types.HANDLE_ERROR },
        { type: types.SHOW_TOAST_NOTIFICATION },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  afterEach(() => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_ERROR__ = false
  })
})
