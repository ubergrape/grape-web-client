import * as types from '../constants/actionTypes'

export const showVideoConferenceWarning = () => ({
  type: types.SHOW_VIDEO_CONFERENCE,
})

export const hideVideoConferenceWarning = () => ({
  type: types.HIDE_VIDEO_CONFERENCE,
})
