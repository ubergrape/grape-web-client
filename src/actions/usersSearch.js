import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'

export const searchUsersToMention = (org, search, limit) => (dispatch) => {
  api.searchUsers({
    orgId: org.id,
    search,
    limit
  }).then((users) => {
    dispatch({
      type: types.SEARCH_USERS_TO_MENTION,
      payload: users.results
    })
  })
}
