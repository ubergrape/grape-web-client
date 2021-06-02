import { registerAssertions } from 'redux-actions-assertions/jest'
import { registerMiddlewares } from 'redux-actions-assertions'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'grape-web/lib/router'

import history from '../../../app/history'
import * as types from '../../../constants/actionTypes'
import { onError, generateArrayOfObjects } from '../../../../jest/helpers'

import { onCreateGroup } from '../..'
import { getSelectedMember } from '../../../reducers/__tests__/createGroup'

beforeEach(registerAssertions)

registerMiddlewares([thunk, routerMiddleware(history)])

describe('onCreateGroup', () => {
  it('onCreateGroup should dispatch REQUEST_CREATE_GROUP, HIDE_NEW_CONVERSATION, GO_TO_CHANNEL and ADD_CHANNEL actions', done => {
    expect(onCreateGroup()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        createGroup: {
          name: 'name',
          description: 'description',
          isPrivate: false,
          selectedMembers: generateArrayOfObjects(getSelectedMember, 3),
        },
      },
      [
        { type: types.REQUEST_CREATE_GROUP },
        { type: types.HIDE_NEW_CONVERSATION },
        { type: types.GO_TO_CHANNEL },
        { type: types.ADD_CHANNEL },
      ],
      err => {
        onError(done, err)
      },
    )
  })

  it('onCreateGroup should dispatch REQUEST_CREATE_GROUP and HANDLE_CREATE_GROUP_ERROR_DETAILS actions', done => {
    // eslint-disable-next-line no-underscore-dangle
    global.__TEST_ERROR__ = true

    expect(onCreateGroup()).toDispatchActionsWithState(
      {
        org: {
          id: 1,
        },
        createGroup: {
          name: 'name',
          description: 'description',
          isPrivate: false,
          selectedMembers: generateArrayOfObjects(getSelectedMember, 3),
        },
      },
      [
        { type: types.REQUEST_CREATE_GROUP },
        { type: types.HANDLE_CREATE_GROUP_ERROR_DETAILS },
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
